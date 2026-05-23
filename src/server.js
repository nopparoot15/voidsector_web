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
  { q: 'ดาวเคราะห์ที่ใหญ่ที่สุดในระบบสุริยะคือ?', opts: ['Saturn','Neptune','Jupiter','Uranus'], ans: 2 },
  { q: 'ประเทศไทยมีกี่จังหวัด?', opts: ['73','75','77','80'], ans: 2 },
];

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
  socket.on('wb:word', ({ roomId, word } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'wordbomb' || room.status !== 'playing') return;
    const st = room.state;
    const curPlayer = st.players[st.currentIdx];
    if (!curPlayer || curPlayer.userId !== userId || !curPlayer.alive) return;

    const w = String(word || '').trim().toLowerCase().replace(/[^a-z฀-๿]/g, '');
    if (!w) return;

    // Validate: correct starting letter (if any) + not already used
    if (st.lastLetter && !w.startsWith(st.lastLetter)) {
      socket.emit('wb:invalid', { reason: `คำต้องขึ้นต้นด้วย "${st.lastLetter.toUpperCase()}"` });
      return;
    }
    if (st.usedWords.includes(w)) {
      socket.emit('wb:invalid', { reason: 'คำนี้ถูกใช้ไปแล้ว' });
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
