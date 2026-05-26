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
app.set('io', io);

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  // Identity set from handshake auth — no race condition with wb:/wp: events
  const authUid = Number(socket.handshake.auth?.userId);
  socket.data.userId = Number.isFinite(authUid) && authUid > 0 ? authUid : null;
  socket.data.username = String(socket.handshake.auth?.username || '').trim().slice(0, 32);
  socket.data.wbRoomId = null;
  socket.data.wpRoomId = null;
  socket.data.gameRoomId = null;
  // Join personal room immediately so all socket types receive user-targeted events
  if (socket.data.userId) socket.join(`user:${socket.data.userId}`);

  // Legacy support: allow runtime re-identification (e.g. vs-socket.js which sends no auth)
  socket.on('vs:hello', ({ userId, username } = {}) => {
    const uid = Number(userId);
    socket.data.userId = Number.isFinite(uid) && uid > 0 ? uid : null;
    socket.data.username = String(username || '').trim().slice(0, 32);
    if (socket.data.userId) socket.join(`user:${socket.data.userId}`);
  });

  // ── Global Chat ──────────────────────────────────────────────────────────────
  socket.on('chat:pull', async ({ limit } = {}) => {
    try {
      const n = Math.min(Math.max(Number(limit) || 60, 1), 200);
      const { rows } = await pool.query(
        `SELECT id, user_id, username, message, created_at
         FROM chat_messages WHERE room_id=1
         ORDER BY created_at DESC LIMIT $1`, [n]
      );
      socket.emit('chat:history', rows.reverse());
    } catch (e) { console.error('[chat:pull]', e.message); }
  });

  socket.on('chat:send', async ({ message, clientMsgId } = {}) => {
    const username = socket.data.username;
    const userId   = socket.data.userId;
    if (!username) return;
    const msg = String(message || '').trim().slice(0, 1000);
    if (!msg) return;
    try {
      await pool.query(
        `INSERT INTO chat_messages(room_id, user_id, username, message) VALUES(1,$1,$2,$3)`,
        [userId || null, username, msg]
      );
      io.emit('chat:new', { userId, username, message: msg, clientMsgId: clientMsgId || null });
    } catch (e) {
      console.error('[chat:send]', e.message);
      socket.emit('chat:error', { message: 'Send failed' });
    }
  });

  // ── DM ───────────────────────────────────────────────────────────────────────
  socket.on('dm:join', async ({ roomId } = {}) => {
    const rid    = Number(roomId);
    const userId = socket.data.userId;
    if (!rid || !userId) return;
    try {
      const { rows } = await pool.query(
        `SELECT 1 FROM chat_room_members WHERE room_id=$1 AND user_id=$2`, [rid, userId]
      );
      if (rows.length) socket.join(`dm:${rid}`);
    } catch (e) { console.error('[dm:join]', e.message); }
  });

  socket.on('dm:send', async ({ roomId, message, clientMsgId } = {}) => {
    const rid      = Number(roomId);
    const userId   = socket.data.userId;
    const username = socket.data.username;
    if (!rid || !userId || !username) return;
    const msg = String(message || '').trim().slice(0, 1000);
    if (!msg) return;
    try {
      const { rows: mem } = await pool.query(
        `SELECT 1 FROM chat_room_members WHERE room_id=$1 AND user_id=$2`, [rid, userId]
      );
      if (!mem.length) return socket.emit('dm:error', { message: 'Not a member' });

      await pool.query(
        `INSERT INTO chat_messages(room_id, user_id, username, message) VALUES($1,$2,$3,$4)`,
        [rid, userId, username, msg]
      );
      io.to(`dm:${rid}`).emit('dm:new', { roomId: rid, userId, username, message: msg, clientMsgId: clientMsgId || null });

      // notify offline recipient
      const { rows: others } = await pool.query(
        `SELECT user_id FROM chat_room_members WHERE room_id=$1 AND user_id!=$2`, [rid, userId]
      );
      others.forEach(m => io.to(`user:${m.user_id}`).emit('dm:notify', { roomId: rid, from: username }));
    } catch (e) {
      console.error('[dm:send]', e.message);
      socket.emit('dm:error', { message: 'Send failed' });
    }
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

  socket.on('wb:invite', async ({ roomId, friendIds } = {}, cb) => {
    const uid = Number(socket.data.userId);
    const rid = String(roomId || '');
    if (!rid || !Number.isFinite(uid) || uid <= 0) return cb?.({ ok: false, reason: 'not_identified' });

    const out = whiteboardStore.invite(rid, uid, friendIds);
    if (!out.ok) return cb?.({ ok: false, reason: out.reason });

    const ids = (Array.isArray(friendIds) ? friendIds : []).map(Number).filter(n => Number.isFinite(n) && n > 0);
    const origin = process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : 'http://localhost:3000';
    const room = whiteboardStore.get(rid);
    const joinUrl = room?.roomJoinKey
      ? `${origin}/whiteboard/r/${encodeURIComponent(rid)}?k=${encodeURIComponent(room.roomJoinKey)}`
      : `${origin}/whiteboard/r/${encodeURIComponent(rid)}`;

    for (const toId of ids) {
      pool.query(
        `INSERT INTO whiteboard_invites(room_id, from_user_id, to_user_id, status, join_url)
         VALUES($1,$2,$3,'pending',$4)`,
        [rid, uid, toId, joinUrl]
      ).catch(() => {});
      io.to(`user:${toId}`).emit('vs:notification', {
        type: 'whiteboard_invite',
        from_username: socket.data.username,
        room_id: rid,
        join_url: joinUrl,
      });
    }
    cb?.({ ok: true, added: out.added });
  });

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

  socket.on('wp:chat', guardWP((rid, { text } = {}) => {
    const msg = String(text || '').trim().slice(0, 200);
    if (!msg) return;
    const username = socket.data.username || 'Guest';
    io.to(`wp:${rid}`).emit('wp:chat', { username, text: msg, ts: Date.now() });
  }));

  socket.on('wp:react', guardWP((rid, { emoji } = {}) => {
    const ALLOWED = ['😂','😮','❤️','🔥','👏','💀'];
    const e = String(emoji || '').trim();
    if (!ALLOWED.includes(e)) return;
    const username = socket.data.username || 'Guest';
    io.to(`wp:${rid}`).emit('wp:react', { username, emoji: e, ts: Date.now() });
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
    const gmRid = socket.data.gameRoomId;
    if (gmRid) {
      const userId = Number(socket.data.userId);
      const gmRoom = gameStore.get(gmRid);
      if (gmRoom) {
        if (gmRoom.status === 'waiting' || gmRoom.status === 'ended') {
          // Grace period before removing — handles page refresh without killing the room
          gmRoom.offlinePlayers.add(userId);
          gameStore.setTimer(gmRid, `dc_${userId}`, () => {
            const r = gameStore.get(gmRid);
            if (!r || !r.offlinePlayers.has(userId)) return;
            const remaining = gameStore.removePlayer(gmRid, userId);
            if (remaining) {
              const pl = remaining.players.map(p => ({ userId: p.userId, username: p.username }));
              io.to(`gm:${gmRid}`).emit('gm:players', { players: pl });
            }
          }, 30000);
        } else if (gmRoom.status === 'playing') {
          gmRoom.offlinePlayers.add(userId);
          const players = gmRoom.players.map(p => ({ userId: p.userId, username: p.username, offline: gmRoom.offlinePlayers.has(p.userId) }));
          io.to(`gm:${gmRid}`).emit('gm:players', { players });
          // Remove player permanently if they don't reconnect within 60s
          gameStore.setTimer(gmRid, `dc_${userId}`, () => {
            const r = gameStore.get(gmRid);
            if (!r || !r.offlinePlayers.has(userId)) return;
            r.players = r.players.filter(p => p.userId !== userId);
            r.offlinePlayers.delete(userId);
            if (r.players.length === 0) { gameStore.clearAllTimers(gmRid); return; }
            const updated = r.players.map(p => ({ userId: p.userId, username: p.username, offline: r.offlinePlayers.has(p.userId) }));
            io.to(`gm:${gmRid}`).emit('gm:players', { players: updated });
          }, 60000);
        }
      }
    }
  });

  // ── GAME ROOM ──────────────────────────────────────────────────────────────
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

    const wasOffline = room.offlinePlayers?.has(userId);
    if (wasOffline) {
      room.offlinePlayers.delete(userId);
      gameStore.clearTimer(room.id, `dc_${userId}`);
    }

    const playersWithStatus = room.players.map(p => ({ userId: p.userId, username: p.username, offline: room.offlinePlayers?.has(p.userId) || false }));
    const pub = { id: room.id, gameType: room.gameType, host: room.host, status: room.status, players: playersWithStatus };
    socket.emit('gm:joined', { room: pub, state: room.state });
    socket.to(`gm:${rid}`).emit('gm:players', { players: playersWithStatus });

    // Restore Spyfall state for reconnecting player
    if (room.gameType === 'spyfall' && room.status === 'playing' && room.state?.phase) {
      const st = room.state;
      const isSpy = userId === st.spyUserId;
      socket.emit('sp:role', {
        isSpy,
        location: isSpy ? null : st.location,
        role: isSpy ? null : (st.roles?.[userId] || '?'),
        allLocations: st.allLocationNames,
      });
      if (st.askedUserId) socket.emit('sp:asking', { askedUserId: st.askedUserId, askedUsername: st.askedUsername, seconds: null });
    }
  });

  socket.on('gm:start', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.host !== userId || room.status !== 'waiting') return;
    if (room.gameType === 'xo' && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมี 2 คน' });
    if (room.gameType === 'rps' && room.players.length !== 2) return socket.emit('gm:error', { msg: 'ต้องมีผู้เล่นพอดี 2 คน' });
    if ((room.gameType === 'wordbomb' || room.gameType === 'trivia') && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมีอย่างน้อย 2 คน' });
    if (room.gameType === 'typerace' && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมีอย่างน้อย 2 คน' });
    if (room.gameType === 'drawguess' && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมีอย่างน้อย 2 คน' });
    if (room.gameType === 'spyfall' && room.players.length < 4) return socket.emit('gm:error', { msg: 'ต้องมีผู้เล่นอย่างน้อย 4 คน' });
    if (room.gameType === 'checkers' && room.players.length < 2) return socket.emit('gm:error', { msg: 'ต้องมี 2 คน' });

    room.status = 'playing';

    if (room.gameType === 'xo') {
      room.state = { board: Array(9).fill(0), turn: 0, winner: null, winLine: null,
        x: room.players[0].userId, o: room.players[1].userId };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });

    } else if (room.gameType === 'wordbomb') {
      const wbLang = room.state?.options?.lang || 'en';
      room.state = {
        players: room.players.map(p => ({ userId: p.userId, username: p.username, lives: 3, alive: true })),
        currentIdx: 0,
        usedWords: [],
        lastLetter: '',
        lastWord: '',
        lang: wbLang,
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

    } else if (room.gameType === 'typerace') {
      const { lang = 'en', difficulty = 'medium' } = room.state?.options || {};
      const pool = TYPERACE_POOL[lang]?.[difficulty] || TYPERACE_POOL.en.medium;
      const text = pool[Math.floor(Math.random() * pool.length)].normalize('NFC');
      room.state = {
        text,
        lang,
        difficulty,
        phase: 'typing',
        progress: Object.fromEntries(room.players.map(p => [p.userId, 0])),
        finished: {},
        rank: 0,
        timerEndsAt: Date.now() + 60000,
      };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });
      gameStore.setTimer(rid, 'trend', () => endTypeRace(rid), 60000);

    } else if (room.gameType === 'rps') {
      room.state = {
        phase: 'choosing',
        scores: Object.fromEntries(room.players.map(p => [p.userId, 0])),
        choices: {},
        round: 1,
        maxRounds: 9,
        history: [],
        timerEndsAt: Date.now() + 10000,
      };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });
      gameStore.setTimer(rid, 'rpsround', () => resolveRPS(rid, true), 10000);

    } else if (room.gameType === 'spyfall') {
      const loc      = SPYFALL_LOCATIONS[Math.floor(Math.random() * SPYFALL_LOCATIONS.length)];
      const spyIdx   = Math.floor(Math.random() * room.players.length);
      const spyUserId = room.players[spyIdx].userId;
      const rolePool = shuffle([...loc.roles]);
      const roles    = {};
      let roleIdx    = 0;
      room.players.forEach(p => { if (p.userId !== spyUserId) roles[p.userId] = rolePool[roleIdx++ % rolePool.length]; });
      const minutes  = Number(room.state?.options?.minutes) || 8;
      const duration = minutes * 60 * 1000;
      const allLocationNames = SPYFALL_LOCATIONS.map(l => l.name);

      const nonSpyPlayers = room.players.filter(p => p.userId !== spyUserId);
      const firstAsked = nonSpyPlayers[Math.floor(Math.random() * nonSpyPlayers.length)];
      room.state = { phase: 'playing', location: loc.name, spyUserId, roles, allLocationNames, timerEndsAt: Date.now() + duration, accusation: null, winner: null, spyGuessedLocation: null, askedUserId: firstAsked.userId, askedUsername: firstAsked.username };

      io.to(`gm:${rid}`).emit('gm:started', { state: { phase: 'playing', timerEndsAt: room.state.timerEndsAt, players: room.players.map(p => ({ userId: p.userId, username: p.username })), accusation: null } });

      io.in(`gm:${rid}`).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          const uid = Number(s.data.userId);
          const spy = uid === spyUserId;
          s.emit('sp:role', { isSpy: spy, location: spy ? null : loc.name, role: spy ? null : (roles[uid] || '?'), allLocations: allLocationNames });
        });
        io.to(`gm:${rid}`).emit('sp:asking', { askedUserId: firstAsked.userId, askedUsername: firstAsked.username, seconds: null });
      });
      gameStore.setTimer(rid, 'sptimer', () => endSpyfall(rid, 'spy', 'หมดเวลา — สปายรอดไปได้!'), duration);

    } else if (room.gameType === 'checkers') {
      room.state = { board: initCheckersBoard(), turn: 1, p1: room.players[0].userId, p2: room.players[1].userId, winner: null, multiJumpFrom: null };
      io.to(`gm:${rid}`).emit('gm:started', { state: room.state });

    } else if (room.gameType === 'drawguess') {
      const word = DG_WORDS[Math.floor(Math.random() * DG_WORDS.length)];
      const totalRounds = Math.min(room.players.length, 4);
      room.state = {
        phase: 'drawing',
        drawerIdx: 0,
        drawer: room.players[0].userId,
        word,
        timerEndsAt: Date.now() + 60000,
        round: 1,
        totalRounds,
        scores: Object.fromEntries(room.players.map(p => [p.userId, 0])),
        guessedBy: [],
        chat: [],
      };
      io.to(`gm:${rid}`).emit('gm:started', { state: publicDGState(room.state) });
      io.in(`gm:${rid}`).fetchSockets().then(sockets => {
        sockets.forEach(s => {
          if (Number(s.data.userId) === room.players[0].userId) s.emit('dg:word', { word });
        });
      });
      gameStore.setTimer(rid, 'dground', () => endDGRound(rid), 60000);
    }
  });

  // ── SPYFALL EVENTS ─────────────────────────────────────────────────────────────
  socket.on('gm:set_option', ({ roomId, key, value } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.status !== 'waiting' || room.host !== userId) return;
    if (!room.state) room.state = {};
    if (!room.state.options) room.state.options = {};
    room.state.options[key] = value;
  });

  function pickNextAsked(rid, excludeUserId) {
    const room = gameStore.get(rid);
    if (!room) return null;
    const candidates = room.players.filter(p => p.userId !== excludeUserId);
    if (!candidates.length) return room.players[0] || null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  socket.on('sp:done_answer', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'spyfall' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'playing' || st.askedUserId !== userId) return;
    gameStore.clearTimer(rid, 'spanswer');
    const next = pickNextAsked(rid, userId);
    if (!next) return;
    st.askedUserId   = next.userId;
    st.askedUsername = next.username;
    io.to(`gm:${rid}`).emit('sp:asking', { askedUserId: next.userId, askedUsername: next.username, seconds: null });
  });

  socket.on('sp:accuse', ({ roomId, targetUserId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'spyfall' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'playing') return;
    const accuser = room.players.find(p => p.userId === userId);
    const target  = room.players.find(p => p.userId === Number(targetUserId));
    if (!accuser || !target || target.userId === userId) return;

    gameStore.clearTimer(rid, 'sptimer');
    const timeLeft = Math.max(0, st.timerEndsAt - Date.now());
    st.phase = 'voting';
    st.accusation = { accuserUserId: userId, accuserUsername: accuser.username, targetUserId: target.userId, targetUsername: target.username, votes: {}, timeLeft };

    io.to(`gm:${rid}`).emit('sp:accusation', { accuserUserId: userId, accuserUsername: accuser.username, targetUserId: target.userId, targetUsername: target.username });
  });

  socket.on('sp:vote', ({ roomId, guilty } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'spyfall' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'voting' || !st.accusation) return;
    if (!room.players.find(p => p.userId === userId)) return;
    if (st.accusation.votes[userId] !== undefined) return;
    if (userId === st.accusation.accuserUserId || userId === st.accusation.targetUserId) return;

    st.accusation.votes[userId] = !!guilty;
    const voteCount      = Object.keys(st.accusation.votes).length;
    const eligible       = room.players.filter(p => p.userId !== st.accusation.accuserUserId && p.userId !== st.accusation.targetUserId).length;
    const guiltyVotes    = Object.values(st.accusation.votes).filter(Boolean).length;
    const innocentVotes  = voteCount - guiltyVotes;
    const majority       = Math.floor(eligible / 2) + 1;

    io.to(`gm:${rid}`).emit('sp:vote_update', { votes: voteCount, total: eligible, guilty: guiltyVotes, innocent: innocentVotes });

    if (guiltyVotes >= majority || innocentVotes >= majority || voteCount >= eligible) {
      if (guiltyVotes > innocentVotes) {
        if (st.accusation.targetUserId === st.spyUserId) {
          st.phase = 'spy_guess';
          const spyUser = room.players.find(p => p.userId === st.spyUserId);
          io.to(`gm:${rid}`).emit('sp:spy_caught', { spyUserId: st.spyUserId, spyUsername: spyUser?.username || '?' });
          io.in(`gm:${rid}`).fetchSockets().then(sockets => {
            sockets.forEach(s => {
              if (Number(s.data.userId) === st.spyUserId) s.emit('sp:your_turn_guess', { locations: st.allLocationNames });
            });
          });
          gameStore.setTimer(rid, 'spguess', () => endSpyfall(rid, 'players', 'สปายไม่ยอมเดา — ผู้เล่นชนะ!'), 30000);
        } else {
          endSpyfall(rid, 'spy', `กล่าวหาผิดตัว! ${st.accusation.targetUsername} ไม่ใช่สปาย`);
        }
      } else {
        st.phase = 'playing';
        st.timerEndsAt = Date.now() + st.accusation.timeLeft;
        const nextAsked = pickNextAsked(rid, st.accusation.targetUserId) || room.players.find(p => p.userId === st.accusation.targetUserId) || room.players[0];
        st.askedUserId   = nextAsked.userId;
        st.askedUsername = nextAsked.username;
        st.accusation  = null;
        io.to(`gm:${rid}`).emit('sp:vote_resolved', { result: 'innocent', timerEndsAt: st.timerEndsAt });
        io.to(`gm:${rid}`).emit('sp:asking', { askedUserId: nextAsked.userId, askedUsername: nextAsked.username, seconds: null });
        gameStore.setTimer(rid, 'sptimer', () => endSpyfall(rid, 'spy', 'หมดเวลา — สปายรอดไปได้!'), st.timerEndsAt - Date.now());
      }
    }
  });

  socket.on('sp:guess', ({ roomId, location } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'spyfall' || room.status !== 'playing') return;
    const st = room.state;
    if (userId !== st.spyUserId) return;
    if (st.phase !== 'spy_guess' && st.phase !== 'playing') return;
    gameStore.clearTimer(rid, 'spguess');
    st.spyGuessedLocation = String(location || '');
    endSpyfall(rid, st.spyGuessedLocation === st.location ? 'spy' : 'players',
      st.spyGuessedLocation === st.location ? `สปายเดาถูก! ที่นั่นคือ "${st.location}"` : `สปายเดาผิด! ที่จริงคือ "${st.location}"`);
  });

  socket.on('sp:new_game', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'spyfall' || room.host !== userId) return;
    gameStore.clearAllTimers(rid);
    room.status = 'waiting';
    room.state  = {};
    io.to(`gm:${rid}`).emit('sp:reset');
  });

  // Universal new-game reset for wordbomb / trivia / typerace / rps / drawguess
  socket.on('gm:new_game', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.host !== userId) return;
    gameStore.clearAllTimers(rid);
    const savedOptions = room.state?.options || {};
    room.status = 'waiting';
    room.state  = { options: savedOptions };
    io.to(`gm:${rid}`).emit('gm:reset');
    io.to(`gm:${rid}`).emit('gm:players', { players: room.players, host: room.host });
  });

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

  // ── CHECKERS ────────────────────────────────────────────────────────────────
  socket.on('checkers:move', ({ roomId, from, to } = {}) => {
    const rid = String(roomId||'').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'checkers' || room.status !== 'playing') return;
    const st = room.state;
    const player = st.p1===userId ? 1 : st.p2===userId ? 2 : 0;
    if (!player || player !== st.turn) return;
    const pieces = player===1?[1,3]:[2,4];
    if (!pieces.includes(st.board[from])) return;

    const mustFrom = ckMustCapture(st.board, player);
    if (st.multiJumpFrom != null && from !== st.multiJumpFrom) return;
    if (st.multiJumpFrom == null && mustFrom.length > 0 && !mustFrom.includes(from)) return;

    const caps = ckCaptures(st.board, from, player);
    const moves = mustFrom.length > 0 ? [] : ckMoves(st.board, from, player);
    const cap = caps.find(m => m.to === to);
    const mov = moves.find(m => m.to === to);
    if (!cap && !mov) return;

    const b = [...st.board];
    b[to] = b[from]; b[from] = 0;
    let canContinue = false;
    if (cap) {
      b[cap.over] = 0;
      const wasKing = st.board[from] === 3 || st.board[from] === 4;
      ckPromote(b, to);
      const promoted = !wasKing && (b[to] === 3 || b[to] === 4);
      if (!promoted && ckCaptures(b, to, player).length > 0) canContinue = true;
    } else {
      ckPromote(b, to);
    }
    st.board = b;
    if (canContinue) {
      st.multiJumpFrom = to;
    } else {
      st.multiJumpFrom = null;
      st.turn = player===1 ? 2 : 1;
      const w = ckWinner(b, st.turn);
      if (w) { st.winner = w===1 ? st.p1 : st.p2; room.status = 'ended'; }
    }
    io.to(`gm:${rid}`).emit('checkers:state', st);
  });

  socket.on('checkers:restart', ({ roomId } = {}) => {
    const rid = String(roomId||'').toUpperCase();
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'checkers') return;
    if (!room.players.find(p => p.userId === Number(socket.data.userId))) return;
    room.status = 'playing';
    room.state = { board: initCheckersBoard(), turn: 1, p1: room.state.p1, p2: room.state.p2, winner: null, multiJumpFrom: null };
    io.to(`gm:${rid}`).emit('checkers:state', room.state);
  });

  socket.on('wb:setoptions', ({ roomId, lang } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'wordbomb' || room.status !== 'waiting') return;
    if (room.host !== userId) return;
    if (!['en', 'th'].includes(lang)) return;
    room.state.options = { lang };
    io.to(`gm:${rid}`).emit('wb:options', { lang });
  });

  socket.on('wb:word', async ({ roomId, word } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'wordbomb' || room.status !== 'playing') return;
    const st = room.state;
    const curPlayer = st.players[st.currentIdx];
    if (!curPlayer || curPlayer.userId !== userId || !curPlayer.alive) return;

    if (st.lang === 'th') {
      const w = String(word || '').trim();
      if (!w) return;
      if (st.lastLetter && !w.startsWith(st.lastLetter)) {
        socket.emit('wb:invalid', { reason: `คำต้องขึ้นต้นด้วย "${st.lastLetter}"` });
        return;
      }
      if (st.usedWords.includes(w)) {
        socket.emit('wb:invalid', { reason: 'คำนี้ถูกใช้ไปแล้ว' });
        return;
      }
      if (!TH_WORDS.has(w)) {
        socket.emit('wb:invalid', { reason: `"${w}" ไม่อยู่ในรายการคำศัพท์ไทย` });
        return;
      }
      const nextLetter = thLastConsonant(w);
      if (!nextLetter) {
        socket.emit('wb:invalid', { reason: 'คำต้องลงท้ายด้วยพยัญชนะ' });
        return;
      }
      gameStore.clearTimer(rid, 'wbturn');
      st.usedWords.push(w);
      st.lastLetter = nextLetter;
      st.lastWord = w;
      advanceWBTurn(rid);
    } else {
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
    }
  });

  socket.on('tq:answer', ({ roomId, idx } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'trivia' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'question') return;
    if (st.answers[userId] !== undefined) return;

    const opt = Number(idx);
    if (opt < 0 || opt > 3) return;
    const q = st.questions[st.questionIdx];
    const correct = opt === q.ans;
    const elapsed = 15000 - Math.max(0, st.timerEndsAt - Date.now());
    const points = correct ? Math.max(100, Math.round(1000 * (1 - elapsed / 15000))) : 0;
    st.answers[userId] = { idx: opt, correct, points };
    if (correct) st.scores[userId] = (st.scores[userId] || 0) + points;

    socket.emit('tq:answered', { correct, points });

    const alive = room.players.map(p => p.userId);
    if (alive.every(uid => st.answers[uid] !== undefined)) {
      gameStore.clearTimer(rid, 'tqturn');
      revealTriviaResult(rid);
    }
  });

  // ── TYPING RACE ───────────────────────────────────────────────────────────
  socket.on('tr:progress', ({ roomId, chars } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'typerace' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'typing' || st.finished[userId] !== undefined) return;
    const c = Math.max(0, Math.min(Number(chars) || 0, st.text.length));
    st.progress[userId] = c;
    if (c >= st.text.length) {
      st.rank++;
      st.finished[userId] = st.rank;
      io.to(`gm:${rid}`).emit('tr:progress', { progress: st.progress, finished: st.finished });
      if (Object.keys(st.finished).length >= room.players.length) endTypeRace(rid);
    } else {
      io.to(`gm:${rid}`).emit('tr:progress', { progress: st.progress, finished: st.finished });
    }
  });

  socket.on('tr:setoptions', ({ roomId, lang, difficulty } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'typerace' || room.status !== 'waiting') return;
    if (room.host !== userId) return;
    if (!['en', 'th'].includes(lang)) return;
    if (!['easy', 'medium', 'hard'].includes(difficulty)) return;
    room.state.options = { lang, difficulty };
    io.to(`gm:${rid}`).emit('tr:options', { lang, difficulty });
  });

  // ── ROCK PAPER SCISSORS ──────────────────────────────────────────────────
  socket.on('rps:choose', ({ roomId, choice } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'rps' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'choosing' || st.choices[userId] !== undefined) return;
    if (!['rock', 'paper', 'scissors'].includes(choice)) return;
    st.choices[userId] = choice;
    socket.emit('rps:chose', {});
    if (room.players.every(p => st.choices[p.userId] !== undefined)) {
      gameStore.clearTimer(rid, 'rpsround');
      resolveRPS(rid, false);
    }
  });

  // ── DRAW & GUESS ─────────────────────────────────────────────────────────
  socket.on('dg:stroke', ({ roomId, pts, color, size, tool } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'drawguess' || room.status !== 'playing') return;
    if (room.state.drawer !== userId || room.state.phase !== 'drawing') return;
    socket.to(`gm:${rid}`).emit('dg:stroke', {
      pts: Array.isArray(pts) ? pts.slice(0, 256) : [],
      color: String(color || '#ffffff').slice(0, 16),
      size: Math.max(1, Math.min(Number(size) || 4, 40)),
      tool: String(tool || 'pen').slice(0, 8),
    });
  });

  socket.on('dg:clear', ({ roomId } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'drawguess' || room.status !== 'playing') return;
    if (room.state.drawer !== userId) return;
    io.to(`gm:${rid}`).emit('dg:clear');
  });

  socket.on('dg:guess', ({ roomId, text } = {}) => {
    const rid = String(roomId || '').toUpperCase();
    const userId = Number(socket.data.userId);
    const room = gameStore.get(rid);
    if (!room || room.gameType !== 'drawguess' || room.status !== 'playing') return;
    const st = room.state;
    if (st.phase !== 'drawing' || userId === st.drawer || st.guessedBy.includes(userId)) return;
    const guess = String(text || '').trim().slice(0, 60);
    if (!guess) return;
    const correct = guess.toLowerCase() === st.word.toLowerCase();
    if (correct) {
      const timeLeft = Math.max(0, st.timerEndsAt - Date.now());
      const points = Math.round(100 + (timeLeft / 60000) * 400);
      st.scores[userId] = (st.scores[userId] || 0) + points;
      st.scores[st.drawer] = (st.scores[st.drawer] || 0) + 50;
      st.guessedBy.push(userId);
      io.to(`gm:${rid}`).emit('dg:correct', { userId, username: socket.data.username, points, scores: st.scores });
      const nonDrawers = room.players.filter(p => p.userId !== st.drawer);
      if (nonDrawers.every(p => st.guessedBy.includes(p.userId))) {
        gameStore.clearTimer(rid, 'dground');
        endDGRound(rid);
      }
    } else {
      const entry = { userId, username: socket.data.username, text: guess };
      st.chat.push(entry);
      if (st.chat.length > 60) st.chat.shift();
      io.to(`gm:${rid}`).emit('dg:chat', entry);
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

const TYPERACE_POOL = {
  en: {
    easy: [
      'The cat sat on the mat',
      'I love to eat pizza with friends',
      'The sun is bright and warm today',
      'She runs fast every morning',
      'Dogs are loyal and friendly pets',
      'I drink coffee every day',
      'He reads books at night',
      'We play games on weekends',
      'The sky is blue and clear',
      'Good food makes people happy',
    ],
    medium: [
      'The quick brown fox jumps over the lazy dog near the river',
      'Programming is the art of telling a computer what you want it to do',
      'First solve the problem then write the code to solve it clearly',
      'Simplicity is the soul of efficiency so always prefer simpler solutions',
      'Talk is cheap show me the code and I will tell you if it works',
      'Every great developer got there by solving problems they seemed unqualified to solve',
      'Code is like humor when you have to explain it it is probably not good',
      'The best way to predict the future is to invent it yourself today',
      'Learning never exhausts the mind it only ignites curiosity further each day',
      'Practice makes perfect so write code every single day without exception',
    ],
    hard: [
      'Any fool can write code that a computer can understand but good programmers write code that humans can understand',
      'The most disastrous thing that you can ever learn is your first programming language because it shapes how you think',
      'Debugging is twice as hard as writing the code in the first place so if you write the code as cleverly as possible you are not smart enough to debug it',
      'Programs must be written for people to read and only incidentally for machines to execute otherwise nobody will maintain them',
      'The function of good software is to make the complex appear to be simple and the difficult appear to be easy for all users',
      'One of the most important skills you can develop as a programmer is the ability to read other peoples code and understand their intent',
      'Software testing is not about finding bugs it is about gaining confidence that the system works correctly under all expected conditions',
      'The art of programming is the art of organizing complexity and managing that complexity so that the human mind can grasp the whole picture',
    ],
  },
  th: {
    easy: [
      'แมวกระโดดข้ามรั้วบ้าน',
      'ฉันชอบกินข้าวกับเพื่อน',
      'วันนี้ฟ้าใสและอากาศดีมาก',
      'หมาวิ่งเล่นในสวนสนุก',
      'เด็กๆชอบกินไอศกรีม',
      'ดอกไม้บานสะพรั่งในสวน',
      'พ่อแม่รักลูกอย่างไม่มีเงื่อนไข',
      'ฝนตกทำให้อากาศเย็นสบาย',
      'นกร้องเพลงยามเช้าเสมอ',
      'ต้นไม้ใหญ่ให้ร่มเงาในยามร้อน',
    ],
    medium: [
      'การเรียนรู้ไม่มีวันสิ้นสุด ยิ่งรู้มากยิ่งพบว่าตัวเองยังรู้น้อยมาก',
      'โปรแกรมมิ่งคือการแก้ปัญหาด้วยตรรกะและความคิดสร้างสรรค์ผสมกัน',
      'ความสำเร็จไม่ได้มาจากโชค แต่มาจากความพยายามและความอดทนอย่างต่อเนื่อง',
      'เทคโนโลยีเปลี่ยนโลกให้เล็กลง แต่ทำให้ความรู้กว้างขวางขึ้นกว่าเดิม',
      'คนที่อ่านหนังสือมากจะมีโลกทัศน์กว้างและเข้าใจคนอื่นได้ดีกว่า',
      'ภาษาโปรแกรมมิ่งเปรียบเสมือนเครื่องมือ เลือกใช้ให้ถูกกับงานที่ทำ',
      'ความรักที่แท้จริงคือการยอมรับในสิ่งที่อีกฝ่ายเป็น โดยไม่พยายามเปลี่ยนแปลง',
      'การออกกำลังกายสม่ำเสมอช่วยให้ร่างกายแข็งแรงและจิตใจแจ่มใส',
      'มิตรภาพที่แท้จริงต้องผ่านการทดสอบของเวลาและความยากลำบาก',
      'อาหารไทยมีรสชาติหลากหลายทั้งเผ็ด หวาน เปรี้ยว และเค็มในคำเดียวกัน',
    ],
    hard: [
      'ในยุคดิจิทัลที่ข้อมูลข่าวสารไหลเวียนอย่างรวดเร็ว ทักษะการคัดกรองข้อมูลและการคิดวิเคราะห์อย่างมีวิจารณญาณจึงสำคัญยิ่งกว่าการท่องจำข้อเท็จจริงใดๆ',
      'ความฉลาดทางอารมณ์ไม่ใช่สิ่งที่ติดตัวมาตั้งแต่เกิด แต่สามารถฝึกฝนและพัฒนาได้ผ่านการสังเกตตนเองและการเรียนรู้จากประสบการณ์ในชีวิตจริง',
      'การเขียนโปรแกรมที่ดีไม่ใช่แค่การทำให้คอมพิวเตอร์เข้าใจ แต่คือการเขียนโค้ดที่มนุษย์คนอื่นสามารถอ่านเข้าใจและดูแลรักษาได้ในระยะยาว',
      'ประเทศไทยมีวัฒนธรรมอันหลากหลายและงดงาม ทั้งศิลปะ ดนตรี อาหาร และประเพณีที่สืบทอดมาจากบรรพบุรุษหลายร้อยปี ซึ่งสะท้อนถึงเอกลักษณ์ของชาติไทยอย่างชัดเจน',
      'การพัฒนาซอฟต์แวร์ที่มีคุณภาพสูงต้องอาศัยความร่วมมือจากทีมงานที่มีทักษะหลากหลาย ทั้งนักพัฒนา นักออกแบบ นักทดสอบ และผู้จัดการโครงการที่มีความเข้าใจร่วมกัน',
    ],
  },
};

const THAI_CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ');
function thLastConsonant(word) {
  const w = word.trim();
  if (w[w.length - 1] === 'ำ') return 'ม';
  for (let i = w.length - 1; i >= 0; i--) {
    if (THAI_CONSONANTS.has(w[i])) return w[i];
  }
  return null;
}

// ── SPYFALL DATA ───────────────────────────────────────────────────────────────
const SPYFALL_LOCATIONS = [
  { name: 'โรงพยาบาล',      roles: ['แพทย์','พยาบาล','คนไข้','ผู้เยี่ยมไข้','พนักงานทำความสะอาด','เจ้าหน้าที่รับผู้ป่วย'] },
  { name: 'สนามบิน',        roles: ['นักบิน','ลูกเรือ','ผู้โดยสาร','เจ้าหน้าที่รักษาความปลอดภัย','พนักงานเคาน์เตอร์','ช่างซ่อมเครื่องบิน'] },
  { name: 'ร้านอาหาร',      roles: ['เชฟ','พนักงานเสิร์ฟ','ลูกค้า','เจ้าของร้าน','แคชเชียร์','คนล้างจาน'] },
  { name: 'โรงเรียน',       roles: ['ครู','นักเรียน','ผู้ปกครอง','ผู้อำนวยการ','พนักงานโรงเรียน','ยาม'] },
  { name: 'ชายหาด',         roles: ['นักท่องเที่ยว','เจ้าหน้าที่กู้ภัย','ชาวประมง','พ่อค้าขายของ','นักกีฬาทางน้ำ','ช่างภาพ'] },
  { name: 'ธนาคาร',         roles: ['พนักงานธนาคาร','ลูกค้า','ยาม','ผู้จัดการสาขา','เจ้าหน้าที่สินเชื่อ','โจรปล้นธนาคาร'] },
  { name: 'ตลาด',           roles: ['พ่อค้า','แม่ค้า','ลูกค้า','เจ้าหน้าที่ตลาด','คนขับรถส่งของ','เจ้าหน้าที่สุขาภิบาล'] },
  { name: 'สวนสนุก',        roles: ['นักท่องเที่ยว','คนดูแลเครื่องเล่น','พ่อค้าขายของ','เจ้าหน้าที่รักษาความปลอดภัย','ช่างซ่อม','นักแสดงตัวการ์ตูน'] },
  { name: 'พิพิธภัณฑ์',     roles: ['ผู้เยี่ยมชม','ไกด์นำชม','ภัณฑารักษ์','เจ้าหน้าที่รักษาความปลอดภัย','นักวิจัย','นักเรียนทัศนศึกษา'] },
  { name: 'สวนสัตว์',       roles: ['นักท่องเที่ยว','ผู้ดูแลสัตว์','สัตวแพทย์','พ่อค้าขายของ','เจ้าหน้าที่รักษาความปลอดภัย','ช่างภาพธรรมชาติ'] },
  { name: 'ค่ายทหาร',       roles: ['ทหาร','นายทหาร','แพทย์ทหาร','พ่อครัว','พนักงานซักผ้า','ครูฝึก'] },
  { name: 'วัด',             roles: ['พระ','เณร','นักท่องเที่ยว','คนมาไหว้พระ','พนักงานทำความสะอาด','ช่างก่อสร้าง'] },
  { name: 'โรงหนัง',        roles: ['ผู้ชม','คนขายตั๋ว','คนขายป๊อปคอร์น','ผู้จัดการโรง','เจ้าหน้าที่ทำความสะอาด','นักวิจารณ์หนัง'] },
  { name: 'สนามกีฬา',       roles: ['นักกีฬา','โค้ช','แฟนกีฬา','กรรมการ','ผู้บรรยาย','ช่างภาพ'] },
  { name: 'ห้างสรรพสินค้า', roles: ['ลูกค้า','พนักงานขาย','เจ้าหน้าที่รักษาความปลอดภัย','แคชเชียร์','ผู้จัดการร้าน','พนักงานทำความสะอาด'] },
  { name: 'เรือสำราญ',      roles: ['ผู้โดยสาร','กัปตัน','ลูกเรือ','พนักงานร้านอาหาร','นักบันเทิง','ผู้อำนวยการฝ่ายกิจกรรม'] },
  { name: 'รถไฟ',           roles: ['ผู้โดยสาร','พนักงานตรวจตั๋ว','พนักงานขับรถไฟ','พนักงานร้านอาหาร','ช่างซ่อมบำรุง','ตำรวจรถไฟ'] },
  { name: 'โรงแรม',         roles: ['แขก','พนักงานต้อนรับ','แม่บ้าน','พ่อครัว','คนส่งของ','ผู้จัดการโรงแรม'] },
  { name: 'ห้องปฏิบัติการ', roles: ['นักวิทยาศาสตร์','ผู้ช่วยนักวิจัย','ผู้ดูแลห้องแลป','เจ้าหน้าที่ความปลอดภัย','นักศึกษาฝึกงาน','ผู้ตรวจสอบ'] },
  { name: 'ค่ายพักแรม',     roles: ['นักเดินป่า','ไกด์นำทาง','ช่างภาพธรรมชาติ','เจ้าหน้าที่อุทยาน','นักเรียน','ครู'] },
  { name: 'เรือดำน้ำ',      roles: ['กัปตัน','นักวิทยาศาสตร์','ลูกเรือ','วิศวกร','แพทย์','สายลับ'] },
  { name: 'ยานอวกาศ',       roles: ['นักบินอวกาศ','นักวิทยาศาสตร์','วิศวกร','นักสื่อสาร','ผู้บัญชาการ','หุ่นยนต์'] },
  { name: 'ร้านเสริมสวย',   roles: ['ช่างทำผม','ลูกค้า','ผู้ช่วย','พนักงานต้อนรับ','เจ้าของร้าน','นักเรียนฝึกงาน'] },
  { name: 'คลินิก',         roles: ['แพทย์','พยาบาล','คนไข้','พนักงานต้อนรับ','เภสัชกร','นักเรียนแพทย์'] },
  { name: 'โรงงาน',         roles: ['คนงาน','ผู้จัดการ','วิศวกร','พนักงานควบคุมคุณภาพ','เจ้าหน้าที่ความปลอดภัย','ตัวแทนขาย'] },
  { name: 'ห้องสมุด',       roles: ['บรรณารักษ์','นักเรียน','นักวิจัย','อาจารย์','พนักงานทำความสะอาด','ผู้เยี่ยมชม'] },
  { name: 'สปา',            roles: ['ลูกค้า','นักบำบัด','พนักงานต้อนรับ','ผู้จัดการ','ช่างทำเล็บ','นักโภชนาการ'] },
  { name: 'มหาวิทยาลัย',    roles: ['อาจารย์','นักศึกษา','พนักงานธุรการ','ผู้อำนวยการ','นักวิจัย','เจ้าหน้าที่รักษาความปลอดภัย'] },
  { name: 'ไร่องุ่น',       roles: ['เจ้าของไร่','คนงาน','นักท่องเที่ยว','ผู้เชี่ยวชาญไวน์','ช่างภาพ','ผู้ซื้อองุ่น'] },
  { name: 'ร้านหนังสือ',    roles: ['ลูกค้า','พนักงานร้าน','เจ้าของร้าน','นักเขียน','บรรณาธิการ','นักสะสมหนังสือ'] },
];

function endSpyfall(rid, winner, reason) {
  const room = gameStore.get(rid);
  if (!room || room.gameType !== 'spyfall') return;
  gameStore.clearAllTimers(rid);
  room.status = 'ended';
  const st = room.state;
  st.phase = 'ended';
  st.winner = winner;
  io.to(`gm:${rid}`).emit('sp:ended', {
    winner,
    reason,
    spyUserId:          st.spyUserId,
    spyUsername:        room.players.find(p => p.userId === st.spyUserId)?.username || '?',
    location:           st.location,
    spyGuessedLocation: st.spyGuessedLocation || null,
    roles:              st.roles,
  });
}

const TH_WORDS = new Set([
  // ก
  'กบ','กระต่าย','กระโดด','กระดาษ','กระเป๋า','กระทะ','กระดาน','กระปุก','กระชาย','กระเทียม',
  'กระจก','กระดูก','กระท่อม','กระแส','กระสุน','กระโปรง','กล้วย','กล่อง','กล้า','กลาง',
  'กลับ','กลัว','กลิ่น','กลอง','กลม','กวาง','กอล์ฟ','กาแฟ','กาน้ำ','กำแพง',
  'กิน','กีฬา','กีวี','กุ้ง','กุญแจ','กุหลาบ','ก่อน','ก้อน','เก่า','เก้าอี้',
  'เกม','เกาะ','เกิด','เก็บ','แก้ว','แกง','แกะ','โกรธ','โกหก','ไก่',
  'กาว','กาย','กาน','กำลัง','กิจ','กีต้าร์','กอง','กาก','กลอน','กวาด',
  'กัด','กัน','ก้าน','ก้าว','การ','กาง','กาม','กาล','กาว','กิจการ',
  'กีดขวาง','กุม','เกณฑ์','เกรง','เกษตร','เกาหลี','ไกล','กรง','กรรไกร',
  'กรวด','กรอง','กรีด','กรุง','กรุงเทพ','กลัก','กลิ้ง','กวน','กวาง',
  // ข
  'ขนม','ขนมปัง','ขมิ้น','ขาว','ขิง','ขึ้น','ข้าว','ข่าว','เขียน','เขียว',
  'แขน','โขน','ไข่','ขา','ขาย','ขาด','ขำ','ขีด','ขุด','ขน',
  'ขวด','ขวาน','ขวัญ','ขยะ','ขยัน','ขนส่ง','ขนาด','ขยาย','ขอ','ขอบ',
  'ของ','ขัด','ขั้น','ข้า','ข้าม','ข้าง','ข้าพเจ้า','ขึง','ขื่อ','ขุน',
  'เขต','เขม','เขลา','แขวน','ไข','ขบ','ขบวน','ขมวด','ขอด','ขาม',
  // ค
  'คน','คม','คอ','คอมพิวเตอร์','ควาย','คิด','คีม','คุณ','คู่','คา',
  'คาน','คาว','คาด','คิ้ว','คืน','คุก','เคย','เครื่อง','เค็ม','เคาะ',
  'แคน','โคม','ค่า','ค่าย','ครัว','ครู','ครอบ','ครั้ง','คลอง','คลาย',
  'คลื่น','คลำ','ความ','คะแนน','คาถา','คุณภาพ','คณิต','คดี','คน','คม',
  'คอก','คอง','คับ','คาม','คาว','คิม','คีย์','คีบ','คุ้ย','คูน',
  'เคลื่อน','เคล็ด','เคลีย','แค่','โครง','โคตร','ไคล','คลับ','คลาส',
  // ง
  'งาน','งู','เงิน','งาม','เงียบ','โง่','ง่วง','ง่าย','งม','งัด',
  'งาช้าง','งวง','งับ','งิ้ว','งุน','เงา','เงือก','แงะ','โงน','ไง',
  // จ
  'จมูก','จระเข้','จักรยาน','จาน','จิ้งจก','จีน','จุด','เจ็บ','เจ็ด',
  'เจ้าของ','แจก','โจร','ใจ','จอ','จับ','จาก','จาม','จ้าง','จิ้ม',
  'จูง','เจาะ','แจ้ง','โจทย์','ใจดี','จม','จ่าย','จ้อง','จริง','จรวด',
  'จังหวัด','จำ','จำนวน','จิต','จิตใจ','จีบ','จุก','จุน','เจตนา','เจ้า',
  'แจ','โจง','ใจกล้า','จน','จบ','จัด','จับกัง','จิ้ง','จ้าว','จ่า',
  // ช
  'ชม','ชมพู่','ชา','ชาม','ชาย','ชาติ','ช้าง','ช็อกโกแลต','ช่วย','เช้า',
  'เชียงใหม่','แชมพู','โชค','ใช่','ชอบ','ชีวิต','ชีส','ชื่อ','ชุด','ชุมชน',
  'เช่น','เชื่อ','เชือก','เช็ค','แชมป์','โชว์','ใช้','ชนะ','ช่อง','ชาวนา',
  'ชาน','ชาก','ชัก','ชิม','ชี','ชิ้น','ชีด','ชุ่ม','ชุ่ย','เชิญ',
  'เชี่ยว','เชี่ยวชาญ','เชย','เชา','แช่','แชร์','โชว','ใจช่วง','ชาล',
  'ชำ','ชำนาญ','ชำระ','ชั้น','ชั่ว','ชั่วคราว','ชาด','ชาติ','ชาว',
  // ซ
  'ซื้อ','ซอง','ซ่อม','ซอย','ซีรีย์','ซึ้ง','เซ็น','โซฟา','ซอส','ซุป',
  'ซ้าย','ซาบซึ้ง','ซ่าหริ่ม','ซุกซน','ซ่อนหา','ซาก','ซาน','ซิน','ซีด','ซึม',
  'เซ','เซา','เซิ้ง','โซ','โซน','ไซ','ซวย','ซน','ซัก','ซ่า',
  // ด
  'ดนตรี','ดวงอาทิตย์','ดอกไม้','ดิน','ดินสอ','ดีใจ','ดึง','ดู','เด็ก',
  'เดิน','เดือน','แดง','ดาว','ดำ','ดี','ดีด','ดึก','เดา','เดือด',
  'ได้','ดัก','ดัน','ด้วย','ด้าน','ด้าม','ดาบ','ดูแล','ดำน้ำ','ดำเนิน',
  'ดุ','ดูด','ดูถูก','ดอก','ดอง','ดัง','ด่า','ด่าน','ดาน','ดาว',
  'ดิ้น','ดิ่ง','ดิบ','ดีงาม','ดีเด่น','ดุ่ย','ดุ้ง','เด่น','เด็ดขาด',
  // ต
  'ตลาด','ตอน','ตา','ตาม','ตำรวจ','ตำบล','ตี','ตุ๊กตา','ต้นไม้',
  'ต้ม','ต้มยำ','เตียง','เต่า','โต๊ะ','ตับ','ตาย','ตาก','ตาล','ติด',
  'ตุ้ม','เตะ','เต้น','ตน','ตัก','ตัง','ตัว','ตั้ง','ตัด','ตาข่าย',
  'ตำนาน','ตำแหน่ง','ไต','ติ','ตะ','ตะกร้า','ตะวัน','ตะไกร','ตั่ง','ตาราง',
  'ตี่','ตุ้ย','ตูด','เตา','เตือน','แตก','แตง','แตน','แตะ','โต',
  'โตะ','ไต้','ติดตาม','ติดใจ','ตีความ','ตีนตุ๊กแก',
  // ถ
  'ถนน','ถ้ำ','ถาม','ถั่ว','ถูก','ถ่าน','ถ่าย','ถัง','ถาด','ถาวร',
  'ถ่อ','ถอน','ถอด','ถือ','ถึง','ถุง','ถุงมือ','ถูกต้อง','เถา','โถ',
  'ถากถาง','ถาม','ถ้วน',
  // ท
  'ทดลอง','ทราย','ทหาร','ทะเล','ทะเลสาบ','ทอง','ทอด','ทำ','ทำงาน',
  'ท่าเรือ','ทีวี','ทุเรียน','เทนนิส','ทาง','ทาน','ทิ้ง','ทีม','ทุ่ง',
  'เทา','โทร','ทน','ทั้ง','ทัก','ท้อ','ทำลาย','ทะเลาะ','ทำนอง','ทาสี',
  'ทาน','ทาว','ทิ','ทีบ','ทุ่น','เทพ','เทศ','แทง','แทบ','โทน',
  'โทษ','ไทย','ทอ','ทน','ทั่ว','ท่า','ท่าน','ท่าที','ทาม','ทีท่า',
  // ธ
  'ธนาคาร','ธรรม','ธง','ธาตุ','ธุรกิจ','ธนบัตร','ธรรมชาติ','ธาน','ธารน้ำ',
  'ธีม','ธิดา','ธุระ','เธอ','โธ่',
  // น
  'นก','นกแก้ว','นม','นวด','นอน','นักเรียน','นาฬิกา','นาที','น้อง','น้ำ',
  'น้ำตก','น้ำตาล','น้ำผลไม้','น้ำแข็ง','เนื้อ','นาน','นาย','นิทาน',
  'นิยม','นิ้ว','นุ่ม','เนย','แนว','โน้ต','นัด','น่า','น้า','นึก',
  'นูน','เน่า','แน่','นม','นำ','นำเสนอ','นาม','นามสกุล','นาข้าว',
  'นิด','นิ่ง','นิ่ม','นึก','นุ้ย','เนิน','เน้น','แนะ','โนน','ไน',
  'นอก','นอกจาก','น้ำใจ','น้ำเงิน','น้ำเสียง','นักกีฬา','นักดนตรี',
  'นักแสดง','นักร้อง','นักบิน','นับ','นัน','น่าน','น่าเชื่อ',
  // บ
  'บน','บวก','บ้าน','บาสเกตบอล','บิน','เบา','เบียร์','แบดมินตัน',
  'บาง','บาท','บ่าย','บุญ','บุหรี่','เบ่ง','แบก','บัตร','บัง','บ่น',
  'บ้า','บ่อ','บ่อย','บาร์','บาน','บอก','บอล','บัส','บีบ','บุ๋ม',
  'บุ๊ก','บก','บด','บน','บม','บรรจุ','บรรยาย','บั้ง','บั้นท้าย',
  'บาม','บาว','บ่าว','บี','บีบ','บึง','บุก','บุรุษ','เบา','เบ็ด',
  'เบน','เบอร์','เบิก','เบื้อ','แบน','แบบ','โบ','โบก','โบกวาว','ไบ',
  // ป
  'ปลา','ปลาทอด','ปลาวาฬ','ปวด','ปาก','ปี','ปีใหม่','เป็ด','เปรี้ยว',
  'แปด','โปรแกรม','ปั้น','ปิด','ปิ้ง','ปุ่ม','เป้า','แปลก','ปน','ปัจจัย',
  'ปาน','ปาลม์','ปิงปอง','ปี่','ปีก','ปีน','เปิด','แป้น','แป้ง','ไป',
  'ปก','ปด','ปลด','ปลอม','ปลอด','ปลั๊ก','ปลิว','ปลุก','ปวน','ปอ',
  'ปอก','ปอน','ปะ','ปัก','ปัง','ปัด','ปัน','ป่า','ป่าน','ป้า',
  'ป้าย','ปากกา','ปาท่องโก๋','ปิด','ปีศาจ','ปึก','ปืน','เปลือย','เปลือก',
  'เปลี่ยน','เปล','โป','โปก','โปง','โปะ','ไป','ไปรษณีย์',
  // ผ
  'ผลไม้','ผัก','ผัดไทย','ผึ้ง','ผีเสื้อ','ผู้ชาย','ผู้หญิง','แผน',
  'ผา','ผิว','ผิด','ผูก','เผา','ผนัง','ผม','ผ่าน','ผลัก','ผลัด',
  'ผสม','ผอม','ผ้า','ผ้าขาว','ผ้าพัน','ผ้าห่ม','ผิง','ผิน','ผุ','เผลอ',
  'เผชิญ','แผก','แผ่น','แผ่นดิน','แผนที่','โผ','ไผ่',
  // พ
  'พ่อ','พัน','พี่','พิพิธภัณฑ์','พิมพ์','เพชร','เพลง','เพื่อน','แพง',
  'พัก','พาย','พาน','พิง','พุง','เพลิน','แพ','พัฒนา','พระ','พิษ',
  'พิเศษ','พา','พาน','พาว','พาด','พาที','พิการ','พีค','พีช','พุ่ม',
  'เพา','เพิ่ม','เพาะ','เพ้อ','แพะ','แพ้','แพทย์','โพน','โพด','ไพ',
  'พรม','พรั่น','พร้อม','พล','พลัด','พลาด','พลาย','พลัง','พลิก',
  'พลุ','พลุ่ง','พัว','พัวพัน','พาชี','พาณิช','พาน','พาว',
  // ฟ
  'ฟัน','ฟ้า','ฝน','ฝรั่ง','ฝัน','ฟาก','ฟาง','ฟิน','ฟุต','เฟอร์',
  'ฝาก','ฝ้าย','ฟิล์ม','ฟุตบอล','ฟัง','ฟ่อ','ฟอง','ฟอน','ฟัก','ฟ้อน',
  'ฟาด','ฟาน','ฟิต','ฟี','ฟีเวอร์','ฟุ้ง','เฟ้น','เฟือง','เฟือย','แฟน',
  'แฝง','โฟน','ไฟ','ไฟฟ้า','ฝาง','ฝาย','ฝีมือ','ฝีปาก','ฝืน','ฝุ่น',
  // ภ
  'ภาพ','ภูเขา','ภูเก็ต','ภาษา','ภาคี','ภาระ','ภาษี','ภาคเหนือ','ภาคใต้',
  'ภาคกลาง','ภาคอีสาน','ภิกษุ','ภูมิ','ภูมิใจ','เภสัช','โภชนา',
  // ม
  'มวย','มะนาว','มะม่วง','มะละกอ','มังคุด','มาก','มิตร','มีด','มือ',
  'แมลง','แมว','แม่','แม่น้ำ','โมง','มาย','มาม่า','มี','มุก','มุ้ง',
  'มุม','เมา','เมีย','แมน','มน','มั่น','มาก','มาด','มาน','มาว',
  'มีชีวิต','มุ่ง','มอ','มอง','มาก','มาน','มาว','มาม่า','มิถุนา',
  'มั้ย','มาถึง','มาแล้ว','มาเร็ว','มิน','มินิ','มี','มีเงิน','มีงาน',
  'มีดาว','มีโชค','มุ่งมั่น','มุขตลก','มุขเด็ด','มั่นใจ','มั่งคั่ง',
  'มาตรฐาน','มิตรภาพ','มีค่า','มีคุณค่า','เมฆ','เมือง','เมือน','แมวน้ำ',
  // ย
  'ยา','ยักษ์','ยาย','ยิ้ม','ยีราฟ','ยุง','เยือน','ยาว','ยาก','ยาม',
  'ยิง','ยิ่ง','ยุ่ง','เยอะ','เย็น','แยก','โยก','ยก','ยน','ยาน',
  'ยาด','ยาน','ยาแก้','ยาดม','ยาดี','ยาพิษ','ยาม','ยาว','ยิม','ยีน',
  'ยีน','ยืน','ยืด','ยุค','ยุทธ','ยุทธศาสตร์','เยาว','เยาวชน','เยื่อ',
  'แยม','แยง','โยม','โยน','โยะ','ไยดี',
  // ร
  'รถ','รถไฟ','รถเมล์','รสชาติ','รัก','ราคา','ริน','รีสอร์ท','รูป',
  'เรียน','เรือ','แรง','โรค','โรงพยาบาล','โรงเรียน','โรงแรม','โรงภาพยนตร์',
  'ไร่','ราน','ราว','ริ้ว','รีบ','รุ้ง','เริ่ม','แรก','โรย','รับ',
  'รั้น','ร้าน','ร้อน','ร้อย','ร้าย','ร่ม','ร่าง','ร่วง','ร่วม','รำ',
  'รำลึก','ราษฎร','รอ','รอง','รอด','รอน','รัฐ','รั้ว','ร้อง','ร้าน',
  'ร่า','ร่าน','ริ','ริม','รีด','รีโมท','รึ','รือ','รุก','รุน',
  'รูก','รูด','รูป','เรา','เราะ','เร็ว','เร่ง','เร้า','เรือน','เรียก',
  'แรด','โรตี','ไร้','ระบำ','ระฆัง','ระวัง','ระยะ','ระหว่าง','ราคาถูก',
  // ล
  'ลม','ลอย','ลิง','ลิ้นจี่','ลุง','ลูก','เล็ก','เล่น','ลำไย',
  'ลา','ลาก','ลาด','ลาว','ลิ้ม','ลึก','ลืม','เล่า','แล','ลน','ลัก',
  'ล่า','ล่าง','ล้อ','ล้าง','ล้า','ลาน','ลำ','ลำดับ','ลอง','ลด',
  'ลาย','ลี','ลีลา','ลีบ','ลีลาศ','ลุ่ม','ลุก','ลุน','ลุย','ลุ่ย',
  'เลว','เลียน','เลือก','เลือด','เลื่อน','เล่ห์','แลก','แลง','แลน','แล้ว',
  'โล่','โลก','โลภ','ไล','ลาภ','ลำคลอง','ลำพัง','ลำบาก','ลำเอียง',
  // ว
  'วัด','วัน','วาด','วิ่ง','วิทยุ','วินาที','เวลา','วาง','วาน','วาว',
  'วิน','วุ้น','เวที','เว็บ','แวว','โวย','วน','วัว','วัฒนธรรม',
  'วาม','วิทยา','วิชา','วิหาร','วก','วง','วงกต','วงจร','วงดนตรี',
  'วาบ','วาม','วาย','วาว','วิก','วิกฤต','วิจัย','วิจิตร','วิ่น','วิ้ง',
  'วิ้ว','วี','วีซ่า','วีรบุรุษ','วุ่น','วุ่นวาย','เวร','เวลา','เวียน',
  'เวียนหัว','เว้า','แวบ','แวล','โวก','ไว','ไวรัส','วรรณ','วรรณกรรม',
  // ส
  'สนามบิน','สบู่','สวน','สวนสนุก','สวนสัตว์','สวย','สอง','สอน','สาม',
  'สามี','ส้ม','ส้มตำ','สีเขียว','สุข','สูง','เสือ','เสียง','เสียใจ',
  'แสง','โสด','สาย','สาว','สาน','สาก','สาร','สิ่ง','สิน','สิ้น',
  'สีแดง','สีน้ำเงิน','สีเหลือง','สีขาว','สีดำ','สีชมพู','สีม่วง','สีส้ม',
  'สุนัข','สุดยอด','เสาร์','เสื้อ','เส้น','สน','สนใจ','สนาม','สนุก',
  'ส่วน','ส้น','สัตว์','สัน','สั้น','สาขา','สิทธิ','สี','สุก','เสียดาย',
  'เสริม','เสนอ','สอง','สอด','สอน','สะ','สะดวก','สะอาด','สะอึก','สะท้าน',
  'สับ','สัก','สัญญา','สั่น','ส่ง','ส่งเสริม','ส่ง','สาด','สาน','สาม',
  'สามารถ','สาย','สาวน้อย','สาวใหญ่','สำ','สำคัญ','สำเร็จ','สุดท้าย',
  'สุดใจ','เสมอ','เสร็จ','เสมียน','แสดง','แสบ','โสม','โสมม','ไสว',
  'สะพาน','สะอาด','สีฟ้า','สีเทา','สีน้ำตาล','สนธิ','สนธยา',
  // ห
  'หก','หนัก','หนัง','หนู','หมอ','หมาป่า','หมี','หมู','หลัง','หลัก',
  'หวาน','หัว','หัวใจ','หัวเราะ','หาย','หิน','หู','เห็ด','เหล็ก',
  'เหลือง','แหวน','โหน','ไหน','หาน','หาว','หิว','หิ้ง','หีบ','หุ้ม',
  'หุน','เห','เหา','แหน','โหด','ห่วง','ห้อง','หน้า','หน้าต่าง','หน้าที่',
  'หลาย','หลาม','หลุด','หล่อ','หลอก','หวัง','หวาด','หัน','หัด','หาก',
  'หาม','หาน','หนาว','หนีบ','หมวก','หมอน','หมาก','หมาย','หมั้น','หมัน',
  'หมั่น','หมุน','หมู่','หยัก','หยาบ','หยิก','หยิบ','หยุด','หยุ่น',
  'หยู่','หรือ','หรู','หล่น','หล้า','หลับ','หลาก','หลาน','หลีก','หลุม',
  'หาดทราย','หาดสวย','หิมาลัย','หิมะ','เหนือ','เหนื่อย','เหม็น','เหมาะ',
  'เหยียด','เหยียบ','เหยี่ยว','เหล่า','เหล่าทัพ','เหลือ','เหลือเชื่อ',
  'แหล่ง','แหล่งน้ำ','แหวกว่าย','โหวด','ไหว้','ไหล',
  // อ
  'อ่าน','อาทิตย์','อาหาร','อินเทอร์เน็ต','อุ่น','แอปเปิ้ล','แอร์','โอ่ง',
  'ไอศกรีม','อยู่','อยาก','อาจ','อิ่ม','อิน','อุด','เอา','แอบ','โอม',
  'ออก','อัน','อ้าง','อ้วน','อาคาร','อาชีพ','อาบน้ำ','อาศัย','อาสา',
  'อาหารทะเล','อินเดีย','อีก','อุปกรณ์','อน','อนาคต','อนุ','อนุญาต',
  'อบ','อบอุ่น','อม','อมยิ้ม','อวด','อวน','อวย','อวยพร','อะ','อะไร',
  'อัก','อัน','อั้น','อา','อาก','อาง','อาด','อาน','อาน','อาว',
  'อาม','อาย','อาร์','อิ','อิก','อิง','อิ้น','อิ้ม','อี','อีก',
  'อีด','อีน','อีม','อือ','อุ','อุก','อุง','อุน','อู','อูฐ',
  'เอก','เอง','เอน','เอม','เอา','เอาใจ','เอ้า','เอาท์','แอก','แอง',
  'แอน','โอ','โอก','โอง','โอน','โอย','โอาย','ไอ','ไอ้','ไอน้ำ',
  'อุโมงค์','อุตสาหกรรม','อุดมสมบูรณ์','อุปสรรค','อุปนิสัย',
  // ก (เพิ่ม)
  'กะหล่ำ','กะเพรา','กะปิ','กะทิ','กะลา','กะโหลก','กะรัต','กะทัดรัด',
  'กะตังบ','กะดาง','กะดิก','กะดุม','กะบอก','กะบัง','กะบาย','กะบือ',
  'กะพริบ','กะพัก','กะรุน','กะลาม','กะลุมพู','กะโดด','กะโปก',
  'กระสอบ','กระสับกระส่าย','กระสาย','กระซิบ','กระแซะ','กระชัง',
  'กระชับ','กระชาก','กระดก','กระดาง','กระดี้กระเดีย','กระดือ',
  'กระดุม','กระตือรือร้น','กระต่ายป่า','กระทบ','กระทาย','กระทำ',
  'กระทุ้ง','กระทุ่ม','กระนั้น','กระนี้','กระบวนการ','กระบาก',
  'กระบาล','กระบุง','กระบือ','กระปอดกระแปด','กระป๋อง','กระปุ่ม',
  'กระผม','กระผาย','กระพัก','กระพือ','กระฟัด','กระมัง','กระย่อม',
  'กระรอก','กระวนกระวาย','กระวาน','กระวี','กระสัน','กระหน่ำ',
  'กระหนาบ','กระหวัด','กระหาย','กระหึ่ม','กระโจน','กระโดงเรือ',
  'กร่อน','กร้าน','กราบ','กราย','กริก','กริ่ง','กริ้ว','กริช',
  'กรีด','กรีน','กรุ๊ป','กรุณา','กรุ่น','กรุ้มกริ่ม','กลวง',
  'กลอก','กลอน','กลัก','กลับกลาย','กลิ้ง','กลืน','กลุ่ม','กลุ้ม',
  'กว่า','กวาด','กวี','กสิกร','กอง','กักตุน','กักขัง','กัก',
  'กับดัก','กัมมันต','กาล','กาลัง','กาลิเลโอ','กาแล็กซี','กำกับ',
  'กำจัด','กำจร','กำชับ','กำซาบ','กำดัด','กำทอน','กำนัน','กำบัง',
  'กำปั้น','กำพร้า','กำพวด','กำพู','กำเนิด','กำเริบ','กำเหน็จ',
  'กิจกรรม','กิตติ','กิตติมศักดิ์','กิริยา','กิเลส','กีดกัน',
  'กีบ','กุฏิ','กุลีกุจอ','กุมภาพันธ์','กุลบุตร','กุลธิดา',
  'เกณฑ์ทหาร','เกมส์','เกรียน','เกรียวกราว','เกลียด','เกลือ',
  'เกลือก','เกลื่อน','เกษม','เกษียณ','เกาเหลา','เกาลัด','เกาลา',
  'เกี่ยว','เกี้ยว','เกียจคร้าน','เกียรติ','เกียร์','เกิดขึ้น',
  'แก่น','แกน','แกนน้ำ','แกร่ง','แกว่ง','แกะสลัก','โกง','โกน',
  'โกรก','โกลาหล','โกสน','ไก','ไกรลาส',
  // ข (เพิ่ม)
  'ขนาบ','ขนุน','ขบถ','ขบขัน','ขยอก','ขยาด','ขยับ','ขยิบ',
  'ขยุกขยิก','ขรม','ขรึม','ขรุขระ','ขลัง','ขลาด','ขลิบ','ขลุก',
  'ขลุ่ย','ขวนขวาย','ขวบ','ขวย','ขวัก','ขวาก','ขวิด','ขอด',
  'ขอทาน','ขะมักเขม้น','ขั้นตอน','ขับร้อง','ขับขาน','ขัดขวาง',
  'ขัดแย้ง','ขัน','ขา','ขาดใจ','ขาดทุน','ขาดแคลน','ขาน','ขาม',
  'ขิงแก่','ขีดเขียน','ขีดจำกัด','ขีดความสามารถ','ขืน','ขื่อ',
  'ขุนเขา','ขุมทรัพย์','ขุมนรก','ขุ่น','ขุ่มขวัก','ขูด','เขต',
  'เขม็ง','เขม้น','เขลา','เขา','เขาควาย','เขาวงกต','เขี้ยว',
  'เขียด','แขก','แขนงวิชา','โขมด','โขลก','ไขว้','ไขว้เขว',
  // ค (เพิ่ม)
  'คชสาร','คณะ','คณาจารย์','คดโกง','คดีความ','คนละ','คบหา',
  'คบเพลิง','คฤหาสน์','คล้าย','คลาคล่ำ','คลาน','คลิก','คลิป',
  'คลุก','คลุ้มคลั่ง','ความดี','ความจริง','ความรัก','ความสุข',
  'คอนเสิร์ต','คอนโด','คอเลสเตอรอล','คัดค้าน','คัดเลือก',
  'คัดลอก','คัมภีร์','คาดการณ์','คาดหวัง','คาดเข็มขัด','คาม',
  'คาราเต้','คาราวาน','คาวมัน','คำตอบ','คำถาม','คำพูด','คำสั่ง',
  'คิดเห็น','คิดอยาก','คึกคัก','คื่นช่าย','คุกคาม','คุณธรรม',
  'คุณประโยชน์','คุณสมบัติ','คุ้มกัน','คุ้มค่า','คุ้มครอง',
  'เคร่งครัด','เคลือบ','เคลื่อนที่','เคียงข้าง','เคียด','แครง',
  'แครอท','แคลน','แคว้น','โคกเขา','โคตร','โคมไฟ','ไคร้',
  // ง (เพิ่ม)
  'งกเงิ่น','งดงาม','งดเว้น','งบประมาณ','งวด','งอก','งอแง',
  'งอน','งันงก','งิ้ว','งีบ','งึมงำ','งุ่มง่าม','งุ้ม','เงอะงะ',
  'เงิบ','เงิ่น','เงือด','แงน','แงะแงง','โงน','ไง',
  // จ (เพิ่ม)
  'จงใจ','จงรัก','จดหมาย','จดจำ','จตุรัส','จนกว่า','จนถึง',
  'จรจัด','จรดปาก','จริงจัง','จริยธรรม','จริยา','จวน','จวนเจียน',
  'จะงอย','จะเข้','จักจั่น','จักษุ','จัด','จัดงาน','จัดการ',
  'จัดทำ','จัดสรร','จับกุม','จับคู่','จับมือ','จาบัน','จาบัง',
  'จำกัด','จำนน','จำนวนมาก','จำเป็น','จำเลย','จิ้งหรีด','จินตนาการ',
  'จิปาถะ','จิ้มจุ่ม','จิ้มลิ้ม','จีรัง','จุกจิก','จุดเด่น',
  'จุดอ่อน','จุดแข็ง','เจตจำนง','เจตนา','เจ้าบ่าว','เจ้าสาว',
  'เจ้าหน้าที่','เจ้าหนี้','เจ้าโลก','แจ่มใส','โจมตี','ใจเย็น',
  // ช (เพิ่ม)
  'ชนบท','ชนิด','ชมเชย','ชมชอบ','ชมรม','ชลประทาน','ชวน',
  'ชวนหัว','ชะงัก','ชะตา','ชะรอย','ชะล้าง','ชะลอ','ชั่งน้ำหนัก',
  'ชั่งใจ','ชั้นเรียน','ชิ้นส่วน','ชิดใกล้','ชิดซ้าย','ชิดขวา',
  'ชีพจร','ชีวเคมี','ชุมนุม','ชุมทาง','เช็ดตัว','เชิงเทิน',
  'เชิดหน้า','เชิดชู','เชือดเฉือน','เชื่อถือ','เชื่อมต่อ',
  'เชื่อมโยง','แชต','โชคดี','โชคร้าย','ใช้งาน','ใช้ชีวิต',
  // ซ (เพิ่ม)
  'ซ่อนเร้น','ซ่อมแซม','ซาบซึ้งใจ','ซ่าสร้าน','ซิ่ง','ซึมเศร้า',
  'ซุ่มโจมตี','ซุ่มซ่าม','ซุ้ม','โซเชียล','ซีพียู','ซอฟต์แวร์',
  // ด (เพิ่ม)
  'ดมกลิ่น','ดวงชะตา','ดวงจิต','ดวงดาว','ดวงตา','ดวงใจ',
  'ดอกเบี้ย','ดักดาน','ดักฟัง','ดั้งเดิม','ดั้น','ดาราศาสตร์',
  'ดาวเทียม','ดาวพระศุกร์','ดาวอังคาร','ดิ้นรน','ดีงาม','ดีต่อใจ',
  'ดีใจมาก','ดุเดือด','ดุ่มดึ่ม','ดูแลรักษา','เดินทาง','เดินหน้า',
  'เดือดดาล','แด่','แดนดิน','โดดเด่น','โดดเดี่ยว','ได้ยิน',
  // ต (เพิ่ม)
  'ตกใจ','ตกต่ำ','ตกทอด','ตกลง','ตกอยู่','ตบมือ','ตบตา',
  'ตรม','ตรวจสอบ','ตรวจเลือด','ตรงไปตรงมา','ตรึง','ตลอด',
  'ตลกคะนอง','ตลาดนัด','ตลาดหุ้น','ตลิ่ง','ตวัด','ตะขอ',
  'ตะขาบ','ตะเกียง','ตะเกียบ','ตะโกน','ตะวันตก','ตะวันออก',
  'ตั้งใจ','ตั้งหน้า','ตับปลา','ตามใจ','ตามทัน','ตามทาง',
  'ตาราง','ตาล','ตาวาว','ติดตั้ง','ติดตาม','ติดแผ่น','ติดแหง็ก',
  'ตีกลับ','ตีความ','ตีคู่','ตีนตุ๊กแก','ตุ๊กแก','ตุ่มตึม',
  'เตร็ดเตร่','เตรียมตัว','เตะตา','เตือนใจ','แตกต่าง','แตกแยก',
  // ถ (เพิ่ม)
  'ถดถอย','ถนนหลวง','ถนอม','ถลก','ถลัง','ถลำ','ถลุง','ถลาย',
  'ถล่ม','ถ่อยแท้','ถ่าง','ถ่าน','ถ่ายทอด','ถ่ายรูป','ถ่ายเท',
  'ถ่ายโอน','ถ้วยรางวัล','ถาม','ถากถาง','ถาวร','ถีบ','ถือหาง',
  'ถุงทราย','ถุงเท้า','ถุงมือ','เถียง','โถงโหล','ถ้วยชาม',
  // ท (เพิ่ม)
  'ทดสอบ','ทดแทน','ทนายความ','ทบทวน','ทบต้น','ทรงพลัง',
  'ทรงผม','ทรมาน','ทรัพย์สิน','ทราบ','ทราม','ทรุดโทรม',
  'ทลาย','ทวงถาม','ทวีคูณ','ทอดยาว','ทอดสะพาน','ทักษะ',
  'ทักทาย','ทัณฑ์','ทัน','ทันสมัย','ทันใด','ทับซ้อน','ทางการ',
  'ทางเลือก','ทางออก','ทาสี','ทำซ้ำ','ทำนาย','ทำบุญ','ทำร้าย',
  'ทำลาย','ทุ่มเท','ทุ่งหญ้า','ทุนนิยม','เทพนิยาย','เทพเจ้า',
  'เทวดา','เที่ยว','เที่ยงตรง','แทงทะลุ','แทรกซึม','โทรทัศน์',
  'โทรม','โทษทัณฑ์','ไทยแท้',
  // ธ (เพิ่ม)
  'ธรรมชาติ','ธรรมดา','ธรรมเนียม','ธรรมาภิบาล','ธารน้ำ','ธาราบำบัด',
  'ธิดา','ธุรกรรม','ธุรกิจขนาดย่อม','ธุรการ','เธอนะ','ธนู',
  // น (เพิ่ม)
  'นครบาล','นวนิยาย','นักการเมือง','นักข่าว','นักแสดง','นักวิทยาศาสตร์',
  'นักสืบ','นักสำรวจ','นักสังคมสงเคราะห์','นักบุญ','นิทรรศการ',
  'นิเทศ','นิ่ง','นิ่งสงบ','นิสัยดี','นึกฝัน','นูนต่ำ','เนินเขา',
  'เนื้อหา','แนวคิด','แนวทาง','แนวโน้ม','โน้มน้าว','นอบน้อม',
  'น้ำใจงาม','น้ำพริก','น้ำพุ','น้ำเชื้อ','น้ำเสีย','น้ำเต้า',
  // บ (เพิ่ม)
  'บทเรียน','บทบาท','บทกวี','บรรจบ','บรรจุภัณฑ์','บรรณาการ',
  'บรรยากาศ','บรรลุ','บรรเทา','บรรเลง','บวร','บสเทา','บ่อน้ำ',
  'บ้าบิ่น','บ้านนอก','บ้านเมือง','บาดแผล','บาดเจ็บ','บาดตา',
  'บารมี','บิดา','บิดเบือน','บิดมาตร','บุคคล','บุคลิก','บุหงา',
  'บุ่มบ่าม','เบ็ดเสร็จ','เบิกบาน','เบิกทาง','แบกรับ','แบ่งปัน',
  'แบ่งสรร','โบราณ','โบราณสถาน','โบสถ์','โบว์ชวย','ไบโอ',
  // ป (เพิ่ม)
  'ประกอบ','ประกาศ','ประกัน','ประกันชีวิต','ประการ','ประชา',
  'ประชาชน','ประชาธิปไตย','ประชาสัมพันธ์','ประณีต','ประดิษฐ์',
  'ประทับใจ','ประทาน','ประทีป','ประทุษร้าย','ประนีประนอม',
  'ประพันธ์','ประมาณ','ประมง','ประโยชน์','ประโยค','ประวัติ',
  'ประสบ','ประสบการณ์','ประสาน','ปรับตัว','ปรับปรุง','ปรารถนา',
  'ปรารมภ์','ปราศรัย','ปลอบใจ','ปลอดภัย','ปลาช่อน','ปลาดุก',
  'ปลาตะเพียน','ปลาแซลมอน','ปัญหา','ปั้นแต่ง','ปั่นจักรยาน',
  'เปลือย','เปลี่ยนแปลง','เป้าหมาย','เป็นต้น','แปลงกาย','ไปด้วย',
  // ผ (เพิ่ม)
  'ผงาด','ผจญภัย','ผดุงครรภ์','ผนวก','ผนึก','ผ่อนคลาย',
  'ผ่อนผัน','ผ่านพ้น','ผิวหนัง','ผิวพรรณ','ผิวเผิน','ผิวขาว',
  'ผิวดำ','ผิวเหลือง','ผิวสวย','ผุดขึ้น','เผชิญหน้า','เผ่าพันธุ์',
  'เผลอไผล','แผ่นดินไหว','แผ่นฟ้า','โผล่','ไผ่ป่า',
  // พ (เพิ่ม)
  'พงศาวดาร','พจนานุกรม','พตร','พบปะ','พรรณนา','พรรค',
  'พรรคการเมือง','พระเจ้า','พระราชา','พลอย','พลังงาน',
  'พลังงานแสงอาทิตย์','พลิกแพลง','พลีชีพ','พวงมาลัย','พัดลม',
  'พันธนาการ','พันธมิตร','พันธุ์ไม้','พาหนะ','พาณิชย์','พิงค์',
  'พิชิต','พิทักษ์','พิธีกร','พิธีการ','พิมพ์ดีด','พิสูจน์',
  'เพดาน','เพรียว','เพลิดเพลิน','แพทย์แผนไทย','โพธิ์','ไพร',
  // ฟ (เพิ่ม)
  'ฟ้าผ่า','ฟ้าใส','ฟักทอง','ฟักแฟง','ฟัดกัน','ฝ่าฝืน','ฝ่ามือ',
  'ฝ่ายค้าน','ฝ่ายรัฐบาล','ฝึกฝน','ฝึกซ้อม','ฝืดเคือง','ฝูงชน',
  // ภ (เพิ่ม)
  'ภควัมปติ','ภัยธรรมชาติ','ภัยพิบัติ','ภาคีเครือข่าย','ภาษาอังกฤษ',
  'ภาษาจีน','ภาษาญี่ปุ่น','ภาษาเกาหลี','ภาษาฝรั่งเศส','ภาษาเยอรมัน',
  'ภิกษุณี','ภูมิต้านทาน','ภูมิภาค','ภูมิปัญญา','ภูมิใจ',
  // ม (เพิ่ม)
  'มงคล','มดแดง','มดดำ','มดตะนอย','มรดก','มรรยาท','มฤตยู',
  'มฤคสิงห์','มวยไทย','มวยสากล','มอบหมาย','มะกอก','มะขาม',
  'มะขามเปียก','มะเขือ','มะเขือเทศ','มะเดื่อ','มะดัน','มะตาด',
  'มะนาวโห่','มะพร้าว','มะพร้าวน้ำหอม','มะปราง','มะม่วงหิมพานต์',
  'มะรุม','มะลิ','มะลิลา','มักน้อย','มักมาก','มักโกหก','มักง่าย',
  'มันสำปะหลัง','มันเทศ','มันฝรั่ง','มันแกว','มาตุภูมิ','มิตรสหาย',
  'มิตรภาพ','มีน้ำใจ','มีคุณธรรม','มีประสิทธิภาพ','มีศีล','มีสติ',
  'มุมมอง','มุ่งมั่น','มุ่งหน้า','มุ่งหวัง','เมืองหลวง','เมืองไทย',
  'เมตตา','เมาน้ำ','เมาค้าง','แมงมุม','แมงกะพรุน','แมลงวัน',
  // ย (เพิ่ม)
  'ยกเว้น','ยกย่อง','ยศถาบรรดาศักดิ์','ยาสีฟัน','ยาสระผม',
  'ยาแก้ปวด','ยาแก้ไข้','ยาหยอดตา','ยาหม่อง','ยาอมหัวใจ',
  'ยาเม็ด','ยาน้ำ','ยิ้มแย้ม','ยิ้มแยกเขี้ยว','ยุคสมัย','ยุทธวิธี',
  'ยุบยับ','ยืดเยื้อ','ยืนหยัด','ยุ่งยาก','เยาวราช','เยื่อใย',
  'แยบยล','โยธา','โยนทิ้ง','โยนหิน','ไยดี',
  // ร (เพิ่ม)
  'รกร้าง','รณรงค์','รบกวน','รบราฆ่าฟัน','รวดเร็ว','รวมกัน',
  'รวมใจ','รวยเงิน','รสนิยม','ระดับ','ระบบ','ระวังภัย',
  'ระแวง','ราชการ','ราชนาวี','ราชบัลลังก์','ราชวงศ์','ราตรี',
  'ราษฎร','รำพัน','รำลึกใจ','รีวิว','รุ่นพี่','รุ่นน้อง','รุ่นเดียว',
  'รู้จัก','รู้สึก','รู้ทัน','รู้ใจ','เรียบง่าย','เรียบร้อย',
  'เรียบเรียง','เรือดำน้ำ','เรือบิน','เรือสำราญ','แรงงาน',
  'แรงบันดาลใจ','โรคระบาด','โรคภัย','ไร้สาระ','ไร้ประโยชน์',
  // ล (เพิ่ม)
  'ลงทุน','ลงโทษ','ลดหย่อน','ลบเลือน','ลมพัด','ลมหนาว',
  'ลอกเลียน','ลอดช่อง','ลองผิดลองถูก','ลักษณะ','ลักขโมย',
  'ลักลอบ','ลำบากใจ','ลำพอง','ลำเลียง','ลิขสิทธิ์','ลิ้นไก่',
  'ลุกลาม','ลุกฮือ','ลุ่มหลง','เลี้ยงดู','เลี้ยงปลา','เลียนแบบ',
  'เลื่อนลอย','เลือกตั้ง','แลนด์มาร์ก','โล่งใจ','ไล่ล่า',
  // ว (เพิ่ม)
  'วงเวียน','วนเวียน','วรรคทอง','วรรณกรรม','วรรณคดี','วัชพืช',
  'วัตถุ','วัตถุดิบ','วัตถุมงคล','วันสำคัญ','วิกิพีเดีย','วิจิตรศิลป์',
  'วิชาการ','วิทยาการ','วิทยาลัย','วิทยาศาสตร์','วิธีการ','วิบาก',
  'วิปริต','วิพากษ์','วิเคราะห์','วิเศษ','เวทมนตร์','เวทีโลก',
  // ส (เพิ่ม)
  'สกัด','สกุล','สดชื่น','สดใส','สถาปัตยกรรม','สถานการณ์',
  'สถานที่','สถานะ','สนทนา','สนับสนุน','สนามรบ','สบายดี',
  'สมดุล','สมบัติ','สมบูรณ์','สมเจตนา','สมาคม','สมาชิก',
  'สมานฉันท์','สร้างสรรค์','สร้างสรร','สลาย','สว่าง','สวรรค์',
  'สวิตช์','สะสม','สะสาง','สะอึก','สะท้อน','สะเทือน','สะอาดบริสุทธิ์',
  'สัญชาติ','สัญญาณ','สัมภาษณ์','สัมมนา','สาธารณสุข','สาธุ',
  'สามัคคี','สำนึก','สำนึกผิด','สำเร็จรูป','สิ่งแวดล้อม','สิงโต',
  'สิงห์','สิทธิมนุษยชน','สีทอง','สีเงิน','สีทองเหลือง','สีน้ำ',
  'สุขภาพ','สุขภาพดี','สุดท้าย','สุดยอดมาก','เสนาบดี','เสน่ห์',
  'เสน่หา','เสรีภาพ','เสียชีวิต','เสียสละ','เสียใจ','แสงจันทร์',
  'แสงดาว','แสงสว่าง','โสตศึกษา','ไสยศาสตร์',
  // ห (เพิ่ม)
  'หงิก','หงิม','หงุดหงิด','หงุ่ย','หน่ายแหนง','หนองบัว',
  'หนาแน่น','หนุ่มสาว','หมากเม่า','หมากรุก','หมุนเวียน','หมู่บ้าน',
  'หย่อนใจ','หย่อน','หยาบคาย','หยาบช้า','หย่าร้าง','หย่า',
  'หวาดกลัว','หวาดหวั่น','หวานใจ','หวือหวา','หัตถกรรม','หัตถศิลป์',
  'หัวโขน','หาเรื่อง','หินผา','หินทราย','หินอ่อน','หินแกรนิต',
  'หุ้นส่วน','เหตุผล','เหตุการณ์','เหน็ดเหนื่อย','เหนียวแน่น',
  'เหมาะสม','เหมือน','เหี้ย','เหี่ยว','เหือด','แหล่งน้ำ','แหลม',
  'โหดร้าย','โหดเหี้ยม','โหวต','ไหลลื่น','ไหวพริบ',
  // อ (เพิ่ม)
  'อดทน','อดอยาก','อดีต','อนามัย','อนาถา','อบายมุข','อบรม',
  'อภิปราย','อภัย','อมตะ','อยู่ดีกินดี','อยู่รอด','อรชร','อรุณ',
  'อลเวง','อวดเก่ง','อวดโก้','อวดอ้าง','อสูร','อาคันตุกะ',
  'อาจาร','อาจารย์','อาชญากร','อาชีวะ','อาณาจักร','อาณาเขต',
  'อาทรณ์','อาทิ','อาธรรม','อานุภาพ','อาบัติ','อาพาธ','อาภรณ์',
  'อาภัพ','อาร์ต','อาร์เซนอล','อาวุธ','อาวุโส','อาสาสมัคร',
  'อาหารว่าง','อาหารเช้า','อาหารกลางวัน','อาหารเย็น','อาหารเสริม',
  'อิจฉา','อิ่มอกอิ่มใจ','อิสระ','อิสระภาพ','อีสาน','อึดอัด',
  'อุทยาน','อุทิศ','อุทาหรณ์','อุบัติเหตุ','อุปถัมภ์','อุปทาน',
  'อุปมา','อุปราช','อุปสงค์','อุปสรรค','อุ่นใจ','เอกชน',
  'เอกเทศ','เอกภาพ','เอกลักษณ์','เอกสาร','เอกสิทธิ์','เอน็จอนาถ',
  'เอาใจใส่','เอาชนะ','เอาตัวรอด','เอื้อเฟื้อ','เอื้ออาทร',
  'แอดมิน','แอปพลิเคชัน','โอกาส','โอนถ่าย','โอบอ้อมอารี',
  'โอ้อวด','ไอเดีย','ไอเย็น','ไอร้อน',

  // ── คำพื้นฐานที่ขาดหาย ──
  // สัตว์
  'มด','ม้า','แมว','หมา','วัว','หมู','นก','ปลา','เป็ด','ไก่',
  'หมี','งู','เสือ','ช้าง','ลิง','กวาง','หนู','กระรอก','ผีเสื้อ',
  'ยุง','ผึ้ง','แตน','แมลง','ปู','หอย','เต่า','กิ้งก่า','ตุ๊กแก',
  'นกแก้ว','ห่าน','อีกา','นกพิราบ','สิงโต','เสือดาว','หมาป่า',
  'หมาจิ้งจอก','แรด','ม้าลาย','วาฬ','ปลาโลมา','ปลาฉลาม',
  'แมลงสาบ','จิ้งหรีด','ตั๊กแตน','หนอน','ไส้เดือน','แมงกะพรุน',
  'ปลาทอง','ปลาคาร์ป','ปลานิล','กุ้งแม่น้ำ','ปูทะเล','หอยทาก',
  'เหยี่ยว','นกกระจอก','นกกระสา','นกกระเรียน','นกยูง','นกออก',
  'หมูป่า','กระทิง','กระบือ','ลา','อูฐ','จิงโจ้','โคอาล่า',
  'เพนกวิน','แมวน้ำ','วัวกระทิง','ควายป่า','สมเสร็จ','เม่น',
  'ตะพาบ','กบ','คางคก','อึ่งอ่าง','ปาด','งูเหลือม','งูเห่า',
  // อวัยวะร่างกาย
  'มือ','เท้า','ตา','หู','จมูก','ปาก','หัว','คอ','แขน','ขา',
  'นิ้ว','ฟัน','ลิ้น','ผม','หน้า','หลัง','ท้อง','หน้าอก',
  'หัวใจ','ปอด','ตับ','ไต','สมอง','กระดูก','กล้ามเนื้อ','เล็บ',
  'เส้นผม','คิ้ว','ขนตา','แก้ม','คาง','หน้าผาก','ขมับ','กราม',
  'ไหล่','ข้อมือ','ข้อเท้า','หัวเข่า','ข้อศอก','สะโพก','เอว',
  'อก','ซี่โครง','กระดูกสันหลัง','เส้นเลือด','หลอดเลือด',
  // สี
  'แดง','น้ำเงิน','เขียว','เหลือง','ส้ม','ม่วง','ชมพู','ขาว',
  'ดำ','เทา','น้ำตาล','ทอง','เงิน','ครีม','ฟ้า','เขียวมะกอก',
  'แดงเลือดหมู','ชมพูเข้ม','ม่วงอ่อน','เหลืองทอง','เขียวเข้ม',
  // อาหารและเครื่องดื่ม
  'น้ำ','นม','ไข่','เนื้อ','ผัก','ผลไม้','ขนม','เค้ก',
  'ไอศกรีม','ชา','น้ำส้ม','น้ำมะพร้าว','น้ำอัดลม',
  'ข้าวผัด','ผัดไทย','ต้มยำ','แกงเขียวหวาน','แกงเผ็ด',
  'แกงกะหรี่','แกงส้ม','ข้าวหน้าเป็ด','ข้าวมันไก่','ข้าวขาหมู',
  'ก๋วยเตี๋ยว','บะหมี่','วุ้นเส้น','เส้นใหญ่','เส้นเล็ก',
  'ลาบ','น้ำตก','ยำ','สลัด','ข้าวเหนียว','ข้าวเหนียวมะม่วง',
  'ทุเรียน','มังคุด','เงาะ','ลำไย','ลิ้นจี่','มะปราง','ระกำ',
  'สับปะรด','มะละกอ','ฝรั่ง','พุทรา','มะกรูด','มะนาว','ส้มโอ',
  'ส้มเขียวหวาน','แอปเปิล','องุ่น','สตรอว์เบอร์รี','บลูเบอร์รี',
  'เชอร์รี','พีช','แพร์','กีวี','แตงกวา','แตงไทย','ฟักทอง',
  'ถั่วฝักยาว','ถั่วลันเตา','บรอกโคลี','กะหล่ำปลี','กะหล่ำดอก',
  'มะเขือยาว','มะเขือพวง','หน่อไม้','หน่อไม้ฝรั่ง','ผักบุ้ง',
  'คะน้า','กวางตุ้ง','ผักกาด','ผักชี','ต้นหอม','ขึ้นฉ่าย',
  'เกลือ','พริก','น้ำปลา','ซีอิ๊ว','น้ำมัน','เนย','แป้ง',
  'น้ำผึ้ง','แยม','มายองเนส','ซอสมะเขือเทศ','ซอสพริก',
  'หมูสับ','ไก่สับ','เนื้อสับ','ปลาทู','ปลาช่อน','ปลาดุก',
  'กุ้งสด','ปูนิ่ม','หมึกกรอบ','หอยลาย','หอยแมลงภู่',
  // สถานที่
  'บ้าน','โรงเรียน','โรงพยาบาล','ตลาด','ร้านอาหาร','วัด',
  'โบสถ์','สนามบิน','สถานี','ถนน','สะพาน','อาคาร','สวน',
  'ชายหาด','ห้าง','ร้านค้า','ธนาคาร','ไปรษณีย์','สำนักงาน',
  'โรงแรม','รีสอร์ท','หอพัก','คอนโด','วิลล่า','บังกะโล',
  'สนามฟุตบอล','สนามบาสเกตบอล','สระว่ายน้ำ','ยิม','สปา',
  'ห้องน้ำ','ห้องนอน','ห้องครัว','ห้องนั่งเล่น','ห้องทำงาน',
  'สวนสาธารณะ','สวนสัตว์','สวนสนุก','พิพิธภัณฑ์','หอศิลป์',
  'ร้านหนังสือ','ห้องสมุด','โรงหนัง','โรงละคร','สนามกีฬา',
  // ยานพาหนะ
  'รถ','รถยนต์','มอเตอร์ไซค์','จักรยาน','เรือ','เครื่องบิน',
  'รถไฟ','รถเมล์','แท็กซี่','รถตุ๊กตุ๊ก','รถสองแถว','รถกระบะ',
  'รถบรรทุก','รถพ่วง','รถพยาบาล','รถดับเพลิง','รถตำรวจ',
  'เรือแจว','เรือยนต์','เรือใบ','เรือสำราญ','เรือดำน้ำ',
  'เฮลิคอปเตอร์','จรวด','กระสวยอวกาศ','รถแทรกเตอร์','รถไถ',
  // สิ่งของ/เครื่องใช้
  'โต๊ะ','ประตู','หน้าต่าง','เตียง','หมอน','ผ้าห่ม','ตู้',
  'ชั้นวาง','ทีวี','ตู้เย็น','เตาอบ','ไมโครเวฟ','เครื่องซักผ้า',
  'พัดลม','แอร์','หลอดไฟ','ไฟฉาย','เทียน','ไม้ขีด','ถ่านไฟ',
  'กระเป๋าสตางค์','กุญแจรถ','กุญแจบ้าน','ร่ม','หมวกกันน็อก',
  'แว่นกันแดด','นาฬิกา','นาฬิกาปลุก','ปฏิทิน','สมุด','ดินสอ',
  'ปากกา','ยางลบ','ไม้บรรทัด','กรรไกร','เทป','กาว','แม็กซ์',
  'โทรศัพท์','แท็บเล็ต','คีย์บอร์ด','เมาส์','จอคอม','หูฟัง',
  'ลำโพง','กล้อง','กล้องวิดีโอ','ไดร์เป่าผม','เครื่องโกนหนวด',
  'แปรงสีฟัน','ยาสีฟัน','สบู่','แชมพู','ครีมนวด','โลชั่น',
  'กระจกเงา','หวี','มีดโกน','กรรไกรตัดเล็บ','ตะไบเล็บ',
  'จาน','ชาม','ช้อน','ส้อม','มีด','ตะเกียบ','แก้วน้ำ','กาน้ำ',
  'กระทะ','หม้อ','ไห','โถ','ถัง','กะละมัง','ฝาหม้อ',
  // ธรรมชาติ
  'ดิน','ไฟ','ลม','ฝน','หิมะ','ดาว','พระจันทร์','พระอาทิตย์',
  'ท้องฟ้า','เมฆ','ภูเขา','แม่น้ำ','ทะเล','ทะเลสาบ','ป่า',
  'ทุ่ง','ต้นไม้','ใบไม้','หิน','ทราย','ถ้ำ','น้ำตก','หนอง',
  'บึง','คลอง','ลำห้วย','ลำธาร','ชายฝั่ง','เกาะ','แหลม','อ่าว',
  'ดอกไม้','ดอกกุหลาบ','ดอกบัว','ดอกมะลิ','ดอกลำดวน','ดอกชบา',
  'ดอกแก้ว','ดอกพุด','ดอกอัญชัน','ดอกดาวเรือง','ดอกทานตะวัน',
  'ต้นมะม่วง','ต้นมะพร้าว','ต้นไผ่','ต้นสัก','ต้นยาง','ต้นโอ๊ก',
  'ต้นปาล์ม','ต้นกล้วย','ต้นขนุน','ต้นมะขาม','ต้นโพธิ์','ต้นไทร',
  'เห็ด','ตะไคร้','ขิง','ข่า','พริกไทย','กระชาย','โหระพา','กะเพรา',
  // ครอบครัวและคน
  'พ่อ','แม่','พี่','น้อง','ปู่','ย่า','ตา','ยาย','ลุง','ป้า',
  'น้า','อา','ลูก','หลาน','สามี','ภรรยา','แฟน','เพื่อน',
  'ครู','นักเรียน','นักศึกษา','อาจารย์','หมอ','พยาบาล',
  'ตำรวจ','ทหาร','ชาวนา','ชาวประมง','นักกีฬา','นักร้อง',
  'นักแสดง','นักเขียน','นักวิทยาศาสตร์','นักธุรกิจ','วิศวกร',
  'สถาปนิก','ทนาย','ผู้พิพากษา','นักการเมือง','ผู้ว่า','นายก',
  'เด็ก','ผู้ใหญ่','คนชรา','ทารก','วัยรุ่น','หนุ่ม','สาว',
  // เวลา
  'วัน','คืน','เช้า','เย็น','กลางวัน','กลางคืน','บ่าย','เที่ยง',
  'ปี','เดือน','สัปดาห์','ชั่วโมง','นาที','วินาที',
  'จันทร์','อังคาร','พุธ','พฤหัส','ศุกร์','เสาร์','อาทิตย์',
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
  // กีฬาและกิจกรรม
  'ฟุตบอล','บาสเกตบอล','วอลเลย์บอล','เทนนิส','แบดมินตัน',
  'ปิงปอง','ว่ายน้ำ','วิ่ง','ยิมนาสติก','ยูโด','มวย','มวยไทย',
  'เทควันโด','คาราเต้','ดำน้ำ','ปีนเขา','ตกปลา','ล่าสัตว์',
  'เดินป่า','ตั้งแคมป์','ขี่ม้า','ขี่จักรยาน','สเก็ตบอร์ด','สกี',
  'เล่นเกม','อ่านหนังสือ','ฟังเพลง','ดูหนัง','วาดรูป','ถ่ายภาพ',
  'เต้น','ร้องเพลง','เล่นดนตรี','ทำอาหาร','ทำสวน','ถักนิตติ้ง',
  // คำกริยาพื้นฐาน
  'กิน','ดื่ม','นอน','ยืน','เดิน','วิ่ง','นั่ง','ยิ้ม','หัวเราะ',
  'ร้องไห้','พูด','อ่าน','เขียน','ดู','ฟัง','ร้องเพลง','เต้น',
  'ว่าย','ขับ','บิน','โกรธ','รัก','เกลียด','กลัว','สุข','เศร้า',
  'ตี','เตะ','โยน','จับ','ปล่อย','แบก','ลาก','ดัน','ยก','วาง',
  'เปิด','ปิด','ล็อก','ปลด','ผูก','แก้','ตัด','เย็บ','ทาสี',
  'ล้าง','ซัก','รีด','กวาด','ถู','เช็ด','เทล','เก็บ','ทิ้ง',
  'ซื้อ','ขาย','แลก','ให้','รับ','ส่ง','นำ','เอา','เอามา',
  'ถาม','ตอบ','อธิบาย','บอก','เล่า','แนะนำ','สอน','เรียน',
  'คิด','ฝัน','จำ','ลืม','รู้','เข้าใจ','เชื่อ','สงสัย',
  // คุณศัพท์พื้นฐาน
  'ใหญ่','เล็ก','สูง','เตี้ย','กว้าง','แคบ','ยาว','สั้น',
  'หนัก','เบา','เร็ว','ช้า','ร้อน','เย็น','อุ่น','หนาว',
  'ดี','เลว','สวย','못','น่าเกลียด','ฉลาด','โง่','แข็งแรง',
  'อ่อนแอ','กล้า','ขี้กลัว','ขยัน','ขี้เกียจ','ซื่อสัตย์','โกหก',
  'รวย','จน','แก่','อ่อน','ใหม่','เก่า','สด','เน่า','สุก','ดิบ',
  'หวาน','เปรี้ยว','เค็ม','ขม','เผ็ด','จืด','มัน','เหนียว','กรอบ',
  'นุ่ม','แข็ง','เรียบ','หยาบ','เปียก','แห้ง','สกปรก','สะอาด',
  // คำที่ใช้บ่อยอื่นๆ
  'ใช่','ไม่','อยาก','ต้อง','ได้','เป็น','มี','ไม่มี','ทำ',
  'ไป','มา','อยู่','จะ','แล้ว','ยัง','ก็','แต่','และ','หรือ',
  'เพราะ','เพื่อ','ถ้า','เมื่อ','ตอน','ที่','ของ','กับ','ใน','นอก',
  'บน','ล่าง','หน้า','หลัง','ซ้าย','ขวา','ข้างใน','ข้างนอก',
  'นี้','นั้น','โน้น','ที่นี่','ที่นั่น','ทุก','บาง','หลาย','น้อย',
  'มาก','พอ','เกิน','ขาด','เพียง','แค่','เท่า','เท่านั้น',
  'ฉัน','เรา','เขา','เธอ','มัน','พวกเขา','ใคร','อะไร','ที่ไหน',
  'เมื่อไร','ทำไม','อย่างไร','กี่','เท่าไร',
]);


const DG_WORDS = [
  'แมว','หมา','ช้าง','เสือ','ลิง','นก','ปลา','กบ','จระเข้','กระต่าย',
  'หมู','วัว','ม้า','แกะ','ไก่','เป็ด','หมี','ยีราฟ','งู','นกฮูก',
  'ข้าว','ก๋วยเตี๋ยว','ส้มตำ','ไก่ทอด','พิซซ่า','เบอร์เกอร์','ไอศกรีม',
  'เค้ก','ซูชิ','ราเมน','ต้มยำ','ผัดไทย','มะม่วง','กล้วย','แตงโม','สตรอว์เบอร์รี',
  'บ้าน','รถ','เครื่องบิน','จักรยาน','โทรศัพท์','คอมพิวเตอร์','ทีวี',
  'หนังสือ','กระเป๋า','ร่ม','เก้าอี้','โต๊ะ','กุญแจ','นาฬิกา','แว่นตา',
  'ดวงอาทิตย์','ดวงจันทร์','ดาว','ต้นไม้','ดอกไม้','ภูเขา','ทะเล',
  'สายรุ้ง','เมฆ','ฝน','หิมะ','ไฟ','น้ำ','กระดาษ','ดินสอ','กรรไกร',
  'วิ่ง','กระโดด','ว่ายน้ำ','บิน','นอนหลับ','กิน','อ่านหนังสือ','เล่นกีฬา',
  'เก้าอี้เด็ก','พัดลม','ตู้เย็น','เตาไฟ','กาน้ำ','ถ้วย','ช้อน','มีด',
];

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

// ── CHECKERS HELPERS ───────────────────────────────────────────────────────────
function initCheckersBoard() {
  const b = Array(64).fill(0);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 2) b[r*8+c] = 2;
        if (r > 5) b[r*8+c] = 1;
      }
    }
  }
  return b;
}
function ckCaptures(board, idx, player) {
  const r = Math.floor(idx/8), c = idx%8;
  const isKing = board[idx] === 3 || board[idx] === 4;
  const opp = player === 1 ? [2,4] : [1,3];
  const dirs = [];
  if (player === 1 || isKing) dirs.push([-1,-1],[-1,1]);
  if (player === 2 || isKing) dirs.push([1,-1],[1,1]);
  const out = [];
  for (const [dr,dc] of dirs) {
    const mr=r+dr, mc=c+dc, lr=r+2*dr, lc=c+2*dc;
    if (mr<0||mr>7||mc<0||mc>7||lr<0||lr>7||lc<0||lc>7) continue;
    if (opp.includes(board[mr*8+mc]) && board[lr*8+lc]===0) out.push({to:lr*8+lc,over:mr*8+mc});
  }
  return out;
}
function ckMoves(board, idx, player) {
  const r = Math.floor(idx/8), c = idx%8;
  const isKing = board[idx] === 3 || board[idx] === 4;
  const dirs = [];
  if (player === 1 || isKing) dirs.push([-1,-1],[-1,1]);
  if (player === 2 || isKing) dirs.push([1,-1],[1,1]);
  const out = [];
  for (const [dr,dc] of dirs) {
    const nr=r+dr, nc=c+dc;
    if (nr>=0&&nr<8&&nc>=0&&nc<8&&board[nr*8+nc]===0) out.push({to:nr*8+nc});
  }
  return out;
}
function ckMustCapture(board, player) {
  const pieces = player===1?[1,3]:[2,4];
  return Array.from({length:64},(_,i)=>i).filter(i=>pieces.includes(board[i])&&ckCaptures(board,i,player).length>0);
}
function ckPromote(board, idx) {
  const r = Math.floor(idx/8);
  if (board[idx]===1 && r===0) board[idx]=3;
  if (board[idx]===2 && r===7) board[idx]=4;
}
function ckWinner(board, nextTurn) {
  const pieces = nextTurn===1?[1,3]:[2,4];
  if (!board.some(v=>pieces.includes(v))) return nextTurn===1?2:1;
  for (let i=0;i<64;i++) {
    if (!pieces.includes(board[i])) continue;
    if (ckCaptures(board,i,nextTurn).length>0||ckMoves(board,i,nextTurn).length>0) return null;
  }
  return nextTurn===1?2:1;
}
// ────────────────────────────────────────────────────────────────────────────────

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

// ── Typing Race helpers ────────────────────────────────────────────────────
function endTypeRace(rid) {
  const room = gameStore.get(rid);
  if (!room || room.gameType !== 'typerace') return;
  const st = room.state;
  st.phase = 'ended';
  room.status = 'ended';
  gameStore.clearTimer(rid, 'trend');
  let rank = Object.keys(st.finished).length + 1;
  room.players.forEach(p => { if (st.finished[p.userId] === undefined) st.finished[p.userId] = rank++; });
  io.to(`gm:${rid}`).emit('tr:ended', { state: st });
}

// ── Rock Paper Scissors helpers ────────────────────────────────────────────
const RPS_BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const RPS_EMOJI = { rock: '✊', paper: '🖐️', scissors: '✌️' };

function resolveRPS(rid, timeout) {
  const room = gameStore.get(rid);
  if (!room || room.gameType !== 'rps' || room.status !== 'playing') return;
  const st = room.state;
  if (st.phase === 'reveal' || st.phase === 'ended') return;
  gameStore.clearTimer(rid, 'rpsround');
  const [p1, p2] = room.players;
  const choices = ['rock', 'paper', 'scissors'];
  const c1 = st.choices[p1.userId] ?? (timeout ? choices[Math.floor(Math.random() * 3)] : 'rock');
  const c2 = st.choices[p2.userId] ?? (timeout ? choices[Math.floor(Math.random() * 3)] : 'rock');
  let winnerId = null;
  if (c1 === c2) winnerId = 'draw';
  else if (RPS_BEATS[c1] === c2) { winnerId = p1.userId; st.scores[p1.userId]++; }
  else { winnerId = p2.userId; st.scores[p2.userId]++; }
  st.history.push({ round: st.round, c1, c2, winnerId });
  st.phase = 'reveal';
  io.to(`gm:${rid}`).emit('rps:reveal', { round: st.round, choices: { [p1.userId]: c1, [p2.userId]: c2 }, winnerId, scores: st.scores });
  const gameWinner = room.players.find(p => st.scores[p.userId] >= 3);
  const gameOver = !!gameWinner || st.round >= st.maxRounds;
  gameStore.setTimer(rid, 'rpsreveal', () => {
    if (!room || room.status !== 'playing' || room.state !== st) return;
    if (gameOver) {
      room.status = 'ended'; st.phase = 'ended';
      const finalWinner = room.players.reduce((a, b) => st.scores[a.userId] >= st.scores[b.userId] ? a : b).userId;
      io.to(`gm:${rid}`).emit('rps:ended', { scores: st.scores, winner: finalWinner });
    } else {
      st.round++; st.choices = {}; st.phase = 'choosing';
      st.timerEndsAt = Date.now() + 10000;
      io.to(`gm:${rid}`).emit('rps:round', { round: st.round, timerEndsAt: st.timerEndsAt });
      gameStore.setTimer(rid, 'rpsround', () => resolveRPS(rid, true), 10000);
    }
  }, 3000);
}

// ── Draw & Guess helpers ───────────────────────────────────────────────────
function publicDGState(st) {
  return {
    phase: st.phase,
    drawerIdx: st.drawerIdx,
    drawer: st.drawer,
    wordLength: st.word ? st.word.length : 0,
    timerEndsAt: st.timerEndsAt,
    round: st.round,
    totalRounds: st.totalRounds,
    scores: st.scores,
    guessedBy: st.guessedBy,
    chat: st.chat,
  };
}

function endDGRound(rid) {
  const room = gameStore.get(rid);
  if (!room || room.gameType !== 'drawguess') return;
  const st = room.state;
  if (st.phase === 'reveal' || st.phase === 'ended') return;
  st.phase = 'reveal';
  io.to(`gm:${rid}`).emit('dg:roundend', { word: st.word, scores: st.scores });
  gameStore.setTimer(rid, 'dgreveal', () => {
    if (st.round >= st.totalRounds) {
      room.status = 'ended'; st.phase = 'ended';
      io.to(`gm:${rid}`).emit('dg:ended', { scores: st.scores });
      return;
    }
    st.round++;
    st.drawerIdx = (st.drawerIdx + 1) % room.players.length;
    st.drawer = room.players[st.drawerIdx].userId;
    st.word = DG_WORDS[Math.floor(Math.random() * DG_WORDS.length)];
    st.guessedBy = []; st.chat = []; st.phase = 'drawing';
    st.timerEndsAt = Date.now() + 60000;
    io.to(`gm:${rid}`).emit('dg:newround', publicDGState(st));
    io.to(`gm:${rid}`).emit('dg:clear');
    io.in(`gm:${rid}`).fetchSockets().then(sockets => {
      sockets.forEach(s => { if (Number(s.data.userId) === st.drawer) s.emit('dg:word', { word: st.word }); });
    });
    gameStore.setTimer(rid, 'dground', () => endDGRound(rid), 60000);
  }, 5000);
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
