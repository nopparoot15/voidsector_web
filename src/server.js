'use strict';
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const { createApp } = require('./app');
const { pool, initDb } = require('./config/db');
const { seedAll } = require('../data/seed');
const { whiteboardStore } = require('./whiteboard/store');
const { watchPartyStore } = require('./watchparty/store');
const gameStore = require('./games/store');
const https = require('https');

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: true, credentials: true } });

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  // Identity set from handshake auth — no race condition with wb:/wp: events
  const authUid = Number(socket.handshake.auth?.userId);
  socket.data.userId = Number.isFinite(authUid) && authUid > 0 ? authUid : null;
  socket.data.username = String(socket.handshake.auth?.username || '').trim().slice(0, 32);
  socket.data.wbRoomId = null;
  socket.data.wpRoomId = null;

  // Legacy support: allow runtime re-identification
  socket.on('vs:hello', ({ userId, username } = {}) => {
    const uid = Number(userId);
    socket.data.userId = Number.isFinite(uid) && uid > 0 ? uid : null;
    socket.data.username = String(username || '').trim().slice(0, 32);
  });

  // ── WHITEBOARD ─────────────────────────────────────────────────────────────
  socket.on('wb:join', ({ roomId, k } = {}) => {
    const rid = String(roomId || '');
    const userId = Number(socket.data.userId);
    if (!rid || !Number.isFinite(userId) || userId <= 0) {
      socket.emit('wb:error', { message: 'Not identified' }); return;
    }
    whiteboardStore.ensurePublic();
    const room = whiteboardStore.get(rid);
    if (!room) { socket.emit('wb:error', { message: 'Room not found' }); return; }

    const key = String(k || '');
    const allowed = whiteboardStore.canAccess(rid, userId) || whiteboardStore.canAccessWithKey(rid, userId, key);
    if (!allowed) { socket.emit('wb:error', { message: 'Forbidden' }); return; }
    if (!room.isPublic && whiteboardStore.canAccessWithKey(rid, userId, key)) whiteboardStore.grant(rid, userId);

    if (socket.data.wbRoomId && socket.data.wbRoomId !== rid) {
      socket.leave(`wb:${socket.data.wbRoomId}`);
      whiteboardStore.removePresence(socket.data.wbRoomId, socket.id);
    }
    socket.data.wbRoomId = rid;
    socket.join(`wb:${rid}`);
    whiteboardStore.addPresence(rid, socket.id, userId);
    socket.emit('wb:joined', { roomId: rid, isPublic: !!room.isPublic, membersOnline: room.presence.size });
    socket.emit('wb:init', { history: room.history || [] });
    io.to(`wb:${rid}`).emit('wb:presence', { membersOnline: room.presence.size });
  });

  function guardWB(cb) {
    return (...args) => {
      const rid = socket.data.wbRoomId;
      const uid = Number(socket.data.userId);
      if (!rid || !Number.isFinite(uid) || uid <= 0) return;
      if (!whiteboardStore.canAccess(rid, uid)) return;
      cb(rid, ...args);
    };
  }

  socket.on('wb:stroke_part', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      t: 'stroke',
      id: String(evt.id || ''),
      tool: String(evt.tool || 'pen').slice(0, 16),
      color: String(evt.color || '#00ffff').slice(0, 32),
      size: Math.max(1, Math.min(Number(evt.size) || 3, 48)),
      points: Array.isArray(evt.points) ? evt.points.slice(0, 160) : [],
    };
    if (!clean.id || clean.points.length < 2 || clean.points.length % 2 !== 0) return;
    socket.to(`wb:${rid}`).emit('wb:stroke_part', clean);
  }));

  socket.on('wb:stroke', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      t: 'stroke',
      id: String(evt.id || '') || crypto.randomBytes(8).toString('hex'),
      tool: String(evt.tool || 'pen').slice(0, 16),
      color: String(evt.color || '#00ffff').slice(0, 32),
      size: Math.max(1, Math.min(Number(evt.size) || 3, 48)),
      points: Array.isArray(evt.points) ? evt.points.slice(0, 2048) : [],
      userId: Number(socket.data.userId),
      ts: Date.now(),
    };
    if (clean.points.length < 4 || clean.points.length % 2 !== 0) return;
    whiteboardStore.appendEvent(rid, clean);
    socket.to(`wb:${rid}`).emit('wb:stroke', clean);
  }));

  socket.on('wb:undo', guardWB((rid, _p, cb) => {
    const uid = Number(socket.data.userId);
    const removedId = whiteboardStore.undoLastStroke(rid, uid);
    if (!removedId) { if (typeof cb === 'function') cb({ ok: false }); return; }
    io.to(`wb:${rid}`).emit('wb:undo', { id: removedId, userId: uid });
    if (typeof cb === 'function') cb({ ok: true });
  }));

  socket.on('wb:text', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    const text = String(evt.text || '').slice(0, 200);
    if (!text) return;
    const clean = {
      t: 'text',
      x: Math.max(0, Math.min(Number(evt.x) || 0, 1)),
      y: Math.max(0, Math.min(Number(evt.y) || 0, 1)),
      color: String(evt.color || '#e6f7ff').slice(0, 32),
      size: Math.max(10, Math.min(Number(evt.size) || 18, 72)),
      font: String(evt.font || 'Inter, ui-sans-serif').slice(0, 80),
      text,
      ts: Date.now(),
    };
    whiteboardStore.appendEvent(rid, clean);
    socket.to(`wb:${rid}`).emit('wb:text', clean);
  }));

  socket.on('wb:clear', guardWB((rid) => {
    whiteboardStore.clear(rid);
    io.to(`wb:${rid}`).emit('wb:clear');
  }));

  socket.on('wb:cursor', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    socket.to(`wb:${rid}`).emit('wb:cursor', {
      userId: Number(socket.data.userId),
      username: socket.data.username,
      x: Math.max(0, Math.min(Number(evt.x) || 0, 1)),
      y: Math.max(0, Math.min(Number(evt.y) || 0, 1)),
      drawing: !!evt.drawing,
      color: String(evt.color || '#00ffff').slice(0, 32),
    });
  }));

  // ── WATCH PARTY ─────────────────────────────────────────────────────────────
  socket.on('wp:time_sync', ({ t0 } = {}) => {
    socket.emit('wp:time_sync', { t0: Number(t0) || 0, ts: Date.now() });
  });

  socket.on('wp:join', ({ roomId, k } = {}) => {
    const rid = String(roomId || '');
    const userId = Number(socket.data.userId);
    if (!rid || !Number.isFinite(userId) || userId <= 0) {
      socket.emit('wp:error', { message: 'Not identified' }); return;
    }
    const room = watchPartyStore.get(rid);
    if (!room) { socket.emit('wp:error', { message: 'Room not found' }); return; }

    const key = String(k || '');
    const allowed = watchPartyStore.canAccess(rid, userId) || watchPartyStore.canAccessWithKey(rid, userId, key);
    if (!allowed) { socket.emit('wp:error', { message: 'Forbidden' }); return; }
    if (!room.isPublic && watchPartyStore.canAccessWithKey(rid, userId, key)) watchPartyStore.grant(rid, userId);

    if (socket.data.wpRoomId && socket.data.wpRoomId !== rid) {
      socket.leave(`wp:${socket.data.wpRoomId}`);
      watchPartyStore.removePresence(socket.data.wpRoomId, socket.id);
    }
    socket.data.wpRoomId = rid;
    socket.join(`wp:${rid}`);
    watchPartyStore.addPresence(rid, socket.id, userId);
    socket.emit('wp:joined', { roomId: rid, isPublic: !!room.isPublic, membersOnline: room.presence.size, state: room.state });
    io.to(`wp:${rid}`).emit('wp:presence', { membersOnline: room.presence.size });
  });

  function guardWP(cb) {
    return (...args) => {
      const rid = socket.data.wpRoomId;
      const uid = Number(socket.data.userId);
      if (!rid || !Number.isFinite(uid) || uid <= 0) return;
      if (!watchPartyStore.canAccess(rid, uid)) return;
      cb(rid, ...args);
    };
  }

  socket.on('wp:set_url', guardWP((rid, { url, provider } = {}) => {
    const st = watchPartyStore.setState(rid, {
      url: String(url || '').trim().slice(0, 2000),
      provider: String(provider || 'generic').slice(0, 16),
      isPlaying: true,
      t: 0,
    });
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:play', guardWP((rid, { t } = {}) => {
    const st = watchPartyStore.setState(rid, { isPlaying: true, t: Math.max(0, Number(t) || 0) });
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:pause', guardWP((rid, { t } = {}) => {
    const st = watchPartyStore.setState(rid, { isPlaying: false, t: Math.max(0, Number(t) || 0) });
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:seek', guardWP((rid, { t } = {}) => {
    const st = watchPartyStore.setState(rid, { t: Math.max(0, Number(t) || 0) });
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:ping_state', guardWP((rid) => {
    const room = watchPartyStore.get(rid);
    if (room) socket.emit('wp:state', room.state);
  }));

  // ── Disconnect ──────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const wbRid = socket.data.wbRoomId;
    if (wbRid) {
      const out = whiteboardStore.removePresence(wbRid, socket.id);
      const room = whiteboardStore.get(wbRid);
      io.to(`wb:${wbRid}`).emit('wb:presence', { membersOnline: room?.presence?.size || 0, deleted: !!out.deleted });
    }
    const wpRid = socket.data.wpRoomId;
    if (wpRid) {
      watchPartyStore.removePresence(wpRid, socket.id);
      const room = watchPartyStore.get(wpRid);
      io.to(`wp:${wpRid}`).emit('wp:presence', { membersOnline: room?.presence?.size || 0 });
    }
  });
});

// ─── /api/run-code proxy (fix Piston 401, use Codex API) ─────────────────────
app.post('/api/run-code', (req, res) => {
  const { language, code, stdin = '' } = req.body || {};
  const langMap = { python: 'py3', javascript: 'js' };
  const lang = langMap[language];
  if (!lang) return res.json({ output: '', error: 'Language not supported for execution', exitCode: 1 });

  const body = JSON.stringify({ code, language: lang, input: stdin });
  const options = {
    hostname: 'api.codex.jaagrav.in',
    path: '/',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  };
  const apiReq = https.request(options, apiRes => {
    let data = '';
    apiRes.on('data', chunk => { data += chunk; });
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.json({ output: parsed.output || '', error: parsed.error || '', exitCode: parsed.error ? 1 : 0 });
      } catch {
        res.json({ output: data, error: '', exitCode: 0 });
      }
    });
  });
  apiReq.on('error', e => res.json({ output: '', error: e.message, exitCode: 1 }));
  apiReq.setTimeout(15000, () => { apiReq.destroy(); res.json({ output: '', error: 'Execution timeout', exitCode: 1 }); });
  apiReq.write(body);
  apiReq.end();
});

// ─── GAMES ────────────────────────────────────────────────────────────────────

const TRIVIA_QUESTIONS = [
  // ── IT & Programming ──────────────────────────────────────────────────────
  { q: 'Python ถูกสร้างโดยใคร?', opts: ['Guido van Rossum','James Gosling','Brendan Eich','Linus Torvalds'], ans: 0 },
  { q: 'HTML ย่อมาจากอะไร?', opts: ['HyperText Markup Language','HyperText Machine Language','HighText Markup Language','HyperTool Markup Language'], ans: 0 },
  { q: 'Git ถูกสร้างโดยใคร?', opts: ['Bill Gates','Linus Torvalds','Dennis Ritchie','Steve Jobs'], ans: 1 },
  { q: 'JavaScript ถูกสร้างในปีใด?', opts: ['1990','1993','1995','2000'], ans: 2 },
  { q: 'CPU ย่อมาจากอะไร?', opts: ['Central Processing Unit','Computer Processing Unit','Central Power Unit','Core Processing Unit'], ans: 0 },
  { q: 'HTTP status 404 หมายความว่า?', opts: ['Server Error','Not Found','Unauthorized','OK'], ans: 1 },
  { q: 'ภาษา C# พัฒนาโดยบริษัทใด?', opts: ['Google','Apple','Microsoft','Meta'], ans: 2 },
  { q: 'React.js สร้างโดยบริษัทใด?', opts: ['Google','Microsoft','Twitter','Meta (Facebook)'], ans: 3 },
  { q: 'Binary 1010 มีค่าเท่าไรในเลขฐาน 10?', opts: ['8','10','12','14'], ans: 1 },
  { q: 'RAM ย่อมาจากอะไร?', opts: ['Random Access Memory','Read Access Memory','Random Array Memory','Read Array Module'], ans: 0 },
  { q: 'npm ย่อมาจากอะไร?', opts: ['Node Package Manager','New Project Manager','Node Process Module','Network Package Module'], ans: 0 },
  { q: 'SQL ย่อมาจากอะไร?', opts: ['Structured Query Language','Standard Query Language','Simple Query Language','Sequence Query Language'], ans: 0 },
  { q: 'OOP ย่อมาจากอะไร?', opts: ['Object Oriented Programming','Open Object Program','Output Oriented Process','Object Operation Protocol'], ans: 0 },
  { q: 'API ย่อมาจากอะไร?', opts: ['Application Protocol Interface','Application Programming Interface','Advanced Protocol Integration','Application Process Interface'], ans: 1 },
  { q: 'Big O notation O(1) หมายความว่า?', opts: ['Linear time','Quadratic time','Constant time','Logarithmic time'], ans: 2 },
  { q: 'IPv4 address มีกี่ bit?', opts: ['16','32','64','128'], ans: 1 },
  { q: 'ภาษา Python ชื่อมาจาก?', opts: ['งู Python','Monty Python คณะตลก','Greek god','ไม่มีที่มา'], ans: 1 },
  { q: 'CSS ย่อมาจากอะไร?', opts: ['Cascading Style Sheets','Creative Style Sheets','Computer Style Syntax','Cascading Script System'], ans: 0 },
  { q: 'HTTP status 200 หมายความว่า?', opts: ['Not Found','Redirect','OK','Server Error'], ans: 2 },
  { q: 'HTTP status 500 หมายความว่า?', opts: ['Not Found','Unauthorized','Redirect','Internal Server Error'], ans: 3 },
  { q: 'DNS ย่อมาจากอะไร?', opts: ['Domain Name System','Data Network Service','Dynamic Name Server','Digital Network Sync'], ans: 0 },
  { q: 'URL ย่อมาจากอะไร?', opts: ['Universal Resource Locator','Uniform Resource Locator','Unified Reference Link','Universal Record Locator'], ans: 1 },
  { q: 'Linux kernel เขียนด้วยภาษาอะไร?', opts: ['Python','Java','C','Assembly'], ans: 2 },
  { q: 'Docker ใช้สำหรับ?', opts: ['Database management','Containerization','Version control','CI/CD pipeline only'], ans: 1 },
  { q: 'JSON ย่อมาจากอะไร?', opts: ['JavaScript Object Notation','Java Serialized Object Notation','JavaScript Online Node','Java Object Network'], ans: 0 },
  { q: 'ภาษาใดที่ใช้สร้าง Android app เป็นหลักในปัจจุบัน?', opts: ['Swift','Kotlin','C++','Ruby'], ans: 1 },
  { q: 'ภาษาใดที่ใช้สร้าง iOS app เป็นหลัก?', opts: ['Kotlin','Java','Swift','Go'], ans: 2 },
  { q: 'TCP/IP มี layer กี่ชั้น?', opts: ['3','4','5','7'], ans: 1 },
  { q: 'SSH ใช้ port หมายเลขใดเป็นค่าตั้งต้น?', opts: ['21','22','23','80'], ans: 1 },
  { q: 'HTTPS ใช้ port หมายเลขใดเป็นค่าตั้งต้น?', opts: ['80','443','8080','3000'], ans: 1 },
  { q: 'Git branch หลักมักชื่อว่าอะไร?', opts: ['root','dev','master / main','trunk'], ans: 2 },
  { q: '"printf" ในภาษา C ย่อมาจากอะไร?', opts: ['print formatted','print function','process read','pure format'], ans: 0 },
  { q: 'ข้อใดคือ NoSQL database?', opts: ['MySQL','PostgreSQL','MongoDB','SQLite'], ans: 2 },
  { q: 'WebSocket แตกต่างจาก HTTP อย่างไร?', opts: ['เร็วกว่าเสมอ','เชื่อมต่อแบบ full-duplex ต่อเนื่อง','ปลอดภัยกว่า','ใช้ UDP'], ans: 1 },
  { q: 'ใน Python ฟังก์ชัน len("hello") คืนค่าเท่าไร?', opts: ['4','5','6','error'], ans: 1 },
  { q: 'Recursion คืออะไร?', opts: ['Loop ชนิดหนึ่ง','ฟังก์ชันเรียกตัวเอง','Array nested','Pointer arithmetic'], ans: 1 },
  { q: 'ข้อใดไม่ใช่ version control system?', opts: ['Git','SVN','Mercurial','Docker'], ans: 3 },
  { q: 'IDE ย่อมาจากอะไร?', opts: ['Integrated Development Environment','Internet Development Engine','Internal Design Editor','Integrated Debug Extension'], ans: 0 },
  { q: 'ใน CSS selector #id กับ .class ต่างกันอย่างไร?', opts: ['# ใช้สีได้อย่างเดียว','# คือ id (unique) . คือ class (ซ้ำได้)','ไม่ต่างกัน','# ใช้กับ JS เท่านั้น'], ans: 1 },
  { q: 'REST API ใช้ HTTP method ใดในการสร้างข้อมูลใหม่?', opts: ['GET','PUT','POST','DELETE'], ans: 2 },
  { q: 'ใน JavaScript === ต่างจาก == อย่างไร?', opts: ['ไม่ต่างกัน','=== เช็ค value และ type','== เช็ค type ด้วย','=== ช้ากว่า'], ans: 1 },
  // ── วิทยาศาสตร์ ───────────────────────────────────────────────────────────
  { q: 'ดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะคือ?', opts: ['Saturn','Neptune','Jupiter','Uranus'], ans: 2 },
  { q: 'ธาตุที่เบาที่สุดในตารางธาตุคือ?', opts: ['Helium','Oxygen','Hydrogen','Carbon'], ans: 2 },
  { q: 'แสงเดินทางด้วยความเร็วเท่าไรในสุญญากาศ?', opts: ['150,000 km/s','300,000 km/s','450,000 km/s','600,000 km/s'], ans: 1 },
  { q: 'DNA ย่อมาจากอะไร?', opts: ['Deoxyribonucleic Acid','Dinucleic Acid','Deoxyribose Nucleotide Array','Double Nucleic Acid'], ans: 0 },
  { q: 'สัตว์ที่มีขาหลายขาที่สุดในโลกคือ?', opts: ['ตะขาบ','กิ้งกือ (Millipede)','แมงมุม','แมลง'], ans: 1 },
  { q: 'น้ำเดือดที่อุณหภูมิกี่องศาเซลเซียส (ที่ระดับน้ำทะเล)?', opts: ['90','95','100','105'], ans: 2 },
  { q: 'ดวงอาทิตย์อยู่ห่างจากโลกประมาณเท่าไร?', opts: ['50 ล้าน km','150 ล้าน km','300 ล้าน km','500 ล้าน km'], ans: 1 },
  { q: 'กระดูกที่เล็กที่สุดในร่างกายมนุษย์อยู่ที่ไหน?', opts: ['นิ้วมือ','หู','เท้า','ฟัน'], ans: 1 },
  { q: 'กราวิตี้บนโลก มีค่าประมาณ?', opts: ['6.7 m/s²','9.8 m/s²','11.2 m/s²','1.6 m/s²'], ans: 1 },
  { q: 'ออกซิเจนมีสัญลักษณ์ธาตุว่า?', opts: ['Ox','O','Og','Or'], ans: 1 },
  // ── ภูมิศาสตร์ & ทั่วไป ───────────────────────────────────────────────────
  { q: 'ประเทศไทยมีกี่จังหวัด?', opts: ['73','75','77','80'], ans: 2 },
  { q: 'เมืองหลวงของญี่ปุ่นคือ?', opts: ['Osaka','Kyoto','Nagoya','Tokyo'], ans: 3 },
  { q: 'แม่น้ำที่ยาวที่สุดในโลกคือ?', opts: ['Amazon','Yangtze','Nile','Mississippi'], ans: 2 },
  { q: 'ประเทศใดมีประชากรมากที่สุดในโลก?', opts: ['USA','India','China','Indonesia'], ans: 1 },
  { q: 'ภูเขาที่สูงที่สุดในโลกคือ?', opts: ['K2','Mont Blanc','Everest','Kilimanjaro'], ans: 2 },
  { q: 'ทวีปที่ใหญ่ที่สุดในโลกคือ?', opts: ['Africa','North America','Asia','Europe'], ans: 2 },
  { q: 'มหาสมุทรที่ใหญ่ที่สุดในโลกคือ?', opts: ['Atlantic','Indian','Arctic','Pacific'], ans: 3 },
  { q: 'เมืองหลวงของฝรั่งเศสคือ?', opts: ['Lyon','Marseille','Paris','Nice'], ans: 2 },
  { q: 'ประเทศใดที่มีพื้นที่ใหญ่ที่สุดในโลก?', opts: ['Canada','USA','China','Russia'], ans: 3 },
  { q: 'กำแพงเมืองจีนยาวประมาณเท่าไร?', opts: ['5,000 km','10,000 km','21,000 km','30,000 km'], ans: 2 },
  // ── ประวัติศาสตร์ & วัฒนธรรม ─────────────────────────────────────────────
  { q: 'ใครเป็นผู้คิดค้นโทรศัพท์?', opts: ['Thomas Edison','Nikola Tesla','Alexander Graham Bell','Guglielmo Marconi'], ans: 2 },
  { q: 'Internet ถูกพัฒนาครั้งแรกในยุค?', opts: ['1950s','1960s','1970s','1980s'], ans: 1 },
  { q: 'World Wide Web ถูกสร้างโดยใคร?', opts: ['Bill Gates','Tim Berners-Lee','Steve Jobs','Vint Cerf'], ans: 1 },
  { q: 'Apple ก่อตั้งโดยใครในปี 1976?', opts: ['Bill Gates','Steve Jobs และ Steve Wozniak','Elon Musk','Larry Page'], ans: 1 },
  { q: 'บริษัทใดสร้าง Windows?', opts: ['Apple','IBM','Microsoft','Google'], ans: 2 },
  { q: 'Google ก่อตั้งโดยใคร?', opts: ['Bill Gates & Paul Allen','Larry Page & Sergey Brin','Mark Zuckerberg','Jeff Bezos'], ans: 1 },
  // ── คณิตศาสตร์ ────────────────────────────────────────────────────────────
  { q: 'π (pi) มีค่าประมาณ?', opts: ['2.718','3.141','1.618','4.012'], ans: 1 },
  { q: 'จำนวนเฉพาะ (prime) ในข้อต่อไปนี้คือ?', opts: ['9','15','17','21'], ans: 2 },
  { q: '2^10 มีค่าเท่าไร?', opts: ['512','1000','1024','2048'], ans: 2 },
  { q: 'ราก√144 มีค่าเท่าไร?', opts: ['10','11','12','13'], ans: 2 },
  { q: 'Fibonacci sequence ลำดับที่ 7 คือ?', opts: ['8','11','13','15'], ans: 2 },
  { q: '16 ในเลขฐาน 16 (hex) คือ?', opts: ['F','10','11','1F'], ans: 1 },
  // ── Pop Culture ──────────────────────────────────────────────────────────
  { q: 'Minecraft พัฒนาโดยใคร?', opts: ['Valve','Mojang','Ubisoft','EA'], ans: 1 },
  { q: 'เกม Fortnite พัฒนาโดยบริษัทใด?', opts: ['Activision','Epic Games','Riot Games','Valve'], ans: 1 },
  { q: 'LoL ย่อมาจากอะไร?', opts: ['League of Legends','Lords of Legends','Legacy of Lore','Legends of Land'], ans: 0 },
  { q: 'YouTube ก่อตั้งในปีใด?', opts: ['2003','2004','2005','2006'], ans: 2 },
  { q: 'ภาษาโปรแกรมใดใช้สร้างเกม Unity เป็นหลัก?', opts: ['Java','Python','C#','C++'], ans: 2 },
];

async function checkEnglishWord(word) {
  return new Promise(resolve => {
    const req = https.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, res => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on('error', () => resolve(true)); // fail open on network error
    req.setTimeout(3000, () => { req.destroy(); resolve(true); });
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// XO helpers
function checkXOWin(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

io.on('connection', (socket) => {
  // Identity (same pattern as whiteboard)
  const authUid = Number(socket.handshake.auth?.userId);
  if (!socket.data.userId) {
    socket.data.userId = Number.isFinite(authUid) && authUid > 0 ? authUid : null;
    socket.data.username = String(socket.handshake.auth?.username || '').trim().slice(0, 32);
  }
  socket.data.gameRoomId = null;

  // ── JOIN GAME ROOM ─────────────────────────────────────────────────────────
  socket.on('gm:join', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const username = socket.data.username;
    if (!rid || !userId) return socket.emit('gm:error', { msg: 'Not identified' });

    const room = gameStore.addPlayer(rid, userId, username);
    if (!room) return socket.emit('gm:error', { msg: 'ไม่พบห้อง' });
    if (room.status === 'playing' && !room.players.find(p => p.userId === userId))
      return socket.emit('gm:error', { msg: 'เกมเริ่มไปแล้ว' });

    if (socket.data.gameRoomId && socket.data.gameRoomId !== rid) {
      socket.leave(`gm:${socket.data.gameRoomId}`);
    }
    socket.data.gameRoomId = rid;
    socket.join(`gm:${rid}`);

    const pub = { id: room.id, gameType: room.gameType, host: room.host, status: room.status,
      players: room.players.map(p => ({ userId: p.userId, username: p.username })) };
    socket.emit('gm:joined', { room: pub, state: room.state });
    socket.to(`gm:${rid}`).emit('gm:players', { players: pub.players });
  });

  // ── START ──────────────────────────────────────────────────────────────────
  socket.on('gm:start', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.host !== userId || room.status !== 'waiting') return;
    if (room.gameType === 'xo' && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมี 2 คน' });
    if ((room.gameType === 'wordbomb' || room.gameType === 'trivia') && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมีอย่างน้อย 2 คน' });

    room.status = 'playing';

    if (room.gameType === 'xo') {
      room.state = { board: Array(9).fill(0), turn: 0, winner: null, winLine: null,
        x: room.players[0].userId, o: room.players[1].userId };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });

    } else if (room.gameType === 'wordbomb') {
      room.state = {
        players: room.players.map(p => ({ userId: p.userId, username: p.username, lives: 3, alive: true })),
        currentIdx: 0,
        usedWords: [],
        lastLetter: '',
        phase: 'turn',
        timerEndsAt: Date.now() + 12000,
        roundNum: 0,
      };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });
      startWBTimer(rid);

    } else if (room.gameType === 'trivia') {
      const qs = shuffle(TRIVIA_QUESTIONS).slice(0, 10);
      room.state = {
        questions: qs,
        questionIdx: 0,
        scores: Object.fromEntries(room.players.map(p => [p.userId, 0])),
        answers: {},
        phase: 'question',
        timerEndsAt: Date.now() + 15000,
        totalQuestions: qs.length,
      };
      const pub = publicTriviaState(room.state);
      io.to(`gm:${rid}`).emit('gm:started', { state: pub });
      startTriviaTimer(rid);
    }
  });

  // ── XO MOVE ───────────────────────────────────────────────────────────────
  socket.on('xo:move', ({ roomId, cell } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'xo' || room.status !== 'playing') return;
    const st = room.state;
    if (st.winner) return;
    const currentPlayer = st.turn === 0 ? st.x : st.o;
    if (userId !== currentPlayer) return;
    const c = Number(cell);
    if (c < 0 || c > 8 || st.board[c] !== 0) return;

    st.board[c] = st.turn === 0 ? 1 : 2;
    const winner = checkXOWin(st.board);
    if (winner) {
      st.winner = winner === 1 ? st.x : st.o;
      st.winLine = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        .find(([a,b,c2]) => st.board[a] === winner && st.board[b] === winner && st.board[c2] === winner);
      room.status = 'ended';
    } else if (st.board.every(v => v !== 0)) {
      st.winner = 'draw';
      room.status = 'ended';
    } else {
      st.turn = 1 - st.turn;
    }
    io.to(`gm:${rid}`).emit('xo:state', st);
  });

  socket.on('xo:restart', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'xo') return;
    if (!room.players.find(p => p.userId === Number(socket.data.userId))) return;
    room.status = 'playing';
    room.state = { board: Array(9).fill(0), turn: 0, winner: null, winLine: null,
      x: room.state.x, o: room.state.o };
    io.to(`gm:${rid}`).emit('xo:state', room.state);
  });

  // ── WORD BOMB ─────────────────────────────────────────────────────────────
  socket.on('wb:word', async ({ roomId, word } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'wordbomb' || room.status !== 'playing') return;
    const st = room.state;
    const curPlayer = st.players[st.currentIdx];
    if (!curPlayer || curPlayer.userId !== userId || !curPlayer.alive) return;

    const w = String(word || '').trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return;

    if (st.lastLetter && !w.startsWith(st.lastLetter)) {
      socket.emit('wb:invalid', { reason: `คำต้องขึ้นต้นด้วย "${st.lastLetter.toUpperCase()}"` });
      return;
    }
    if (st.usedWords.includes(w)) {
      socket.emit('wb:invalid', { reason: 'คำนี้ถูกใช้ไปแล้ว' });
      return;
    }

    // Dictionary check via Free Dictionary API
    const isReal = await checkEnglishWord(w);
    if (!isReal) {
      socket.emit('wb:invalid', { reason: `"${w}" ไม่ใช่คำภาษาอังกฤษที่ถูกต้อง` });
      return;
    }

    gameStore.clearTimer(rid, 'wbturn');
    st.usedWords.push(w);
    st.lastLetter = w[w.length - 1];
    st.lastWord = w;
    advanceWBTurn(rid);
  });

  // ── TRIVIA ANSWER ─────────────────────────────────────────────────────────
  socket.on('tq:answer', ({ roomId, idx } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'trivia' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'question') return;
    if (st.answers[userId] !== undefined) return; // already answered

    const opt = Number(idx);
    if (opt < 0 || opt > 3) return;
    const q = st.questions[st.questionIdx];
    const correct = opt === q.ans;
    const elapsed = 15000 - Math.max(0, st.timerEndsAt - Date.now());
    const points = correct ? Math.max(100, Math.round(1000 * (1 - elapsed / 15000))) : 0;
    st.answers[userId] = { idx: opt, correct, points };
    if (correct) st.scores[userId] = (st.scores[userId] || 0) + points;

    socket.emit('tq:answered', { correct, points });

    // All alive players answered?
    const alive = room.players.map(p => p.userId);
    if (alive.every(uid => st.answers[uid] !== undefined)) {
      gameStore.clearTimer(rid, 'tqturn');
      revealTriviaResult(rid);
    }
  });

  // ── DISCONNECT ─────────────────────────────────────────────────────────────
  const origDisconnect = socket.listeners('disconnect')[0];
  socket.on('disconnect', () => {
    const rid = socket.data.gameRoomId;
    if (rid) {
      const userId = Number(socket.data.userId);
      const room = gameStore.get(rid);
      if (room) {
        // Mark as disconnected but keep in room for reconnect
        const pub = room.players.map(p => ({ userId: p.userId, username: p.username }));
        io.to(`gm:${rid}`).emit('gm:players', { players: pub });
      }
    }
  });
});

// ── Word Bomb helpers ──────────────────────────────────────────────────────
function startWBTimer(rid) {
  const room = gameStore.get(rid);
  if (!room) return;
  room.state.timerEndsAt = Date.now() + 12000;
  io.to(`gm:${rid}`).emit('wb:state', room.state);
  gameStore.setTimer(rid, 'wbturn', () => wbTimeout(rid), 12000);
}

function wbTimeout(rid) {
  const room = gameStore.get(rid);
  if (!room || room.status !== 'playing') return;
  const st = room.state;
  const cur = st.players[st.currentIdx];
  if (!cur || !cur.alive) return advanceWBTurn(rid);
  cur.lives--;
  if (cur.lives <= 0) cur.alive = false;
  st.lastWord = null;
  advanceWBTurn(rid, true);
}

function advanceWBTurn(rid, timeout = false) {
  const room = gameStore.get(rid);
  if (!room) return;
  const st = room.state;
  const alive = st.players.filter(p => p.alive);
  if (alive.length <= 1) {
    st.phase = 'ended';
    st.winner = alive[0]?.userId || null;
    room.status = 'ended';
    io.to(`gm:${rid}`).emit('wb:state', st);
    return;
  }
  // Next alive player
  let next = (st.currentIdx + 1) % st.players.length;
  let guard = 0;
  while (!st.players[next].alive && guard < st.players.length) { next = (next + 1) % st.players.length; guard++; }
  st.currentIdx = next;
  st.roundNum++;
  startWBTimer(rid);
}

// ── Trivia helpers ─────────────────────────────────────────────────────────
function publicTriviaState(st) {
  const q = st.questions[st.questionIdx];
  return {
    questionIdx: st.questionIdx,
    totalQuestions: st.totalQuestions,
    question: { q: q.q, opts: q.opts },
    scores: st.scores,
    answers: st.answers,
    phase: st.phase,
    timerEndsAt: st.timerEndsAt,
  };
}

function startTriviaTimer(rid) {
  const room = gameStore.get(rid);
  if (!room) return;
  room.state.timerEndsAt = Date.now() + 15000;
  room.state.phase = 'question';
  room.state.answers = {};
  io.to(`gm:${rid}`).emit('tq:state', publicTriviaState(room.state));
  gameStore.setTimer(rid, 'tqturn', () => revealTriviaResult(rid), 15000);
}

function revealTriviaResult(rid) {
  const room = gameStore.get(rid);
  if (!room) return;
  const st = room.state;
  st.phase = 'result';
  const q = st.questions[st.questionIdx];
  io.to(`gm:${rid}`).emit('tq:result', {
    correctIdx: q.ans,
    answers: st.answers,
    scores: st.scores,
    questionIdx: st.questionIdx,
  });
  gameStore.setTimer(rid, 'tqnext', () => nextTriviaQuestion(rid), 4000);
}

function nextTriviaQuestion(rid) {
  const room = gameStore.get(rid);
  if (!room) return;
  const st = room.state;
  st.questionIdx++;
  if (st.questionIdx >= st.totalQuestions) {
    st.phase = 'ended';
    room.status = 'ended';
    io.to(`gm:${rid}`).emit('tq:ended', { scores: st.scores });
    return;
  }
  startTriviaTimer(rid);
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

// Listen immediately so Railway health checks pass, then init DB in background
server.listen(PORT, () => {
  console.log(`✅ VoidSector listening on port ${PORT}`);
  (async () => {
    try {
      await pool.query('SELECT 1');
      console.log('✅ PostgreSQL connected');
      await initDb();
      await seedAll(pool);
      console.log('✅ DB ready');
    } catch (e) {
      console.error('❌ DB init failed:', e.message);
    }
  })();
});
