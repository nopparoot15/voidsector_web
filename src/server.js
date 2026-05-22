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

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: true, credentials: true } });

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  socket.data.userId = null;
  socket.data.username = null;
  socket.data.wbRoomId = null;
  socket.data.wpRoomId = null;

  // Identify (must be called before wb:/wp: events)
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

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
    await initDb();
    await seedAll(pool);
  } catch (e) {
    console.error('❌ DB init failed:', e.message);
    process.exit(1);
  }
  server.listen(PORT, () => console.log(`✅ VoidSector running on http://localhost:${PORT}`));
})();
