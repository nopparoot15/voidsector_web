// src/server.js
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const { createApp } = require('./app');
const { pool, initDb } = require('./config/db');
const { whiteboardStore } = require('./whiteboard/store');

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  }
});

// --------------------------------------------------
// Helper: check room membership (for DM privacy)
// --------------------------------------------------
async function isRoomMember(roomId, userId) {
  if (!roomId || !userId) return false;

  const r = await pool.query(
    `SELECT 1
     FROM chat_room_members
     WHERE room_id = $1 AND user_id = $2
     LIMIT 1`,
    [roomId, userId]
  );

  return r.rows.length > 0;
}

// --------------------------------------------------
// Helper: fetch global history (room_id=1)
// --------------------------------------------------
async function fetchGlobalHistory(limit = 50) {
  const lim = Math.max(1, Math.min(Number(limit) || 50, 200));
  const { rows } = await pool.query(
    `SELECT
       id,
       username,
       user_id,
       message,
       created_at,
       client_msg_id AS "clientMsgId"
     FROM chat_messages
     WHERE room_id = 1
     ORDER BY id DESC
     LIMIT $1`,
    [lim]
  );
  return rows.reverse();
}

// --------------------
// Socket.IO - Global Chat + DM
// --------------------
io.on('connection', async (socket) => {
  console.log('✅ socket connected:', socket.id);

  // ตัวตนของ user ที่ผูกกับ socket นี้
  socket.data.userId = null;
  socket.data.username = null;
  socket.data.wbRoomId = null;

  // ✅ join global immediately so this socket can receive broadcasts
  socket.join('global');

  // --------------------
  // Global chat history (room_id = 1)
  // NOTE: kept for backward compatibility; client may miss this if it binds late,
  // so we also support chat:pull and re-emit on chat:hello.
  // --------------------
  try {
    const rows = await fetchGlobalHistory(30);
    socket.emit('chat:history', rows);
  } catch (err) {
    console.error('chat:history error:', err.code || err.message);
    socket.emit('chat:history', []);
  }

  // --------------------
  // Allow client to pull history anytime (fix "history หาย" แม้ bind ช้า)
  // --------------------
  socket.on('chat:pull', async ({ limit } = {}) => {
    try {
      const rows = await fetchGlobalHistory(limit || 60);
      socket.emit('chat:history', rows);
    } catch (err) {
      console.error('chat:pull error:', err.code || err.message);
      socket.emit('chat:history', []);
    }
  });

  // --------------------
  // Identify user
  // --------------------
  socket.on('chat:hello', async (payload) => {
    const rawId = payload?.userId;
    const userId = (rawId === null || rawId === undefined) ? null : Number(rawId);
    const username = String(payload?.username || '').trim().slice(0, 32);

    if (!username) {
      socket.emit('chat:error', { message: 'Missing username (chat:hello)' });
      return;
    }

    socket.data.userId = Number.isFinite(userId) ? userId : null;
    socket.data.username = username;

    // Personal room for notifications
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }

    // Global room (broadcasts) — already joined on connect, but keep safe
    socket.join('global');

    // ✅ Resync global history on (re)identify (more reliable than "on connect")
    try {
      const rows = await fetchGlobalHistory(60);
      socket.emit('chat:history', rows);
    } catch (e) {
      // ignore
    }

    socket.emit('chat:me', {
      userId: socket.data.userId,
      username: socket.data.username
    });
  });

  // ==================================================
  // WHITEBOARD: join room + broadcast draw events
  // ==================================================
  socket.on('wb:join', ({ roomId } = {}) => {
    const rid = String(roomId || '');
    const userId = Number(socket.data.userId);
    if (!rid) return;
    // must be identified
    if (!Number.isFinite(userId) || userId <= 0) {
      socket.emit('wb:error', { message: 'Not identified' });
      return;
    }

    // public room always exists
    whiteboardStore.ensurePublic();
    const room = whiteboardStore.get(rid);
    if (!room) {
      socket.emit('wb:error', { message: 'Room not found' });
      return;
    }

    if (!whiteboardStore.canAccess(rid, userId)) {
      socket.emit('wb:error', { message: 'Forbidden' });
      return;
    }

    // leave previous
    if (socket.data.wbRoomId && socket.data.wbRoomId !== rid) {
      socket.leave(`wb:${socket.data.wbRoomId}`);
      whiteboardStore.removePresence(socket.data.wbRoomId, socket.id);
    }

    socket.data.wbRoomId = rid;
    socket.join(`wb:${rid}`);
    whiteboardStore.addPresence(rid, socket.id, userId);
    socket.emit('wb:joined', {
      roomId: rid,
      isPublic: !!room.isPublic,
      membersOnline: room.presence?.size || 0,
    });
    socket.emit('wb:init', { history: room.history || [] });
    io.to(`wb:${rid}`).emit('wb:presence', { membersOnline: room.presence?.size || 0 });
  });

  function guardWB(cb) {
    return (...args) => {
      const rid = socket.data.wbRoomId;
      const userId = Number(socket.data.userId);
      if (!rid || !Number.isFinite(userId) || userId <= 0) return;
      if (!whiteboardStore.canAccess(rid, userId)) return;
      cb(rid, ...args);
    };
  }

  socket.on('wb:stroke', guardWB((rid, evt) => {
    // evt: { tool, color, size, points:[...], t }
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      t: 'stroke',
      tool: String(evt.tool || 'pen').slice(0, 16),
      color: String(evt.color || '#00ffff').slice(0, 32),
      size: Math.max(1, Math.min(Number(evt.size) || 3, 48)),
      points: Array.isArray(evt.points) ? evt.points.slice(0, 2048) : [],
      ts: Date.now(),
    };
    whiteboardStore.appendEvent(rid, clean);
    socket.to(`wb:${rid}`).emit('wb:stroke', clean);
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
      font: String(evt.font || 'Orbitron, ui-sans-serif').slice(0, 80),
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

  // --------------------
  // Global chat send
  // --------------------
  socket.on('chat:send', async (payload) => {
    try {
      const msg = String(payload?.message || '').trim().slice(0, 500);
      if (!msg) return;

      const clientMsgId = String(payload?.clientMsgId || '').slice(0, 64) || null;

      const userId = socket.data.userId;     // null ได้
      const username = socket.data.username; // ต้องมี

      if (!username) {
        socket.emit('chat:error', {
          message: 'Not identified. Please send chat:hello first.'
        });
        return;
      }

      // ✅ store client_msg_id so optimistic UI dedupe works + history query won't break
      await pool.query(
        `INSERT INTO chat_messages (room_id, user_id, username, message, client_msg_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [1, userId, username, msg, clientMsgId]
      );

      io.to('global').emit('chat:new', {
        userId,
        username,
        message: msg,
        created_at: new Date().toISOString(),
        clientMsgId,
      });

    } catch (err) {
      console.error('chat:send error', err.code || err.message);
      socket.emit('chat:error', {
        message: `Send failed: ${err.code || err.message}`
      });
    }
  });

  // ==================================================
  // DM: join private room
  // ==================================================
  socket.on('dm:join', async ({ roomId }) => {
    try {
      const rid = Number(roomId);
      const userId = socket.data.userId;

      if (!rid || !userId) return;

      const ok = await isRoomMember(rid, userId);
      if (!ok) {
        socket.emit('dm:error', {
          message: 'Not allowed to join this room'
        });
        return;
      }

      socket.join(`room:${rid}`);
      socket.emit('dm:joined', { roomId: rid });

    } catch (err) {
      console.error('dm:join error:', err.message);
    }
  });

  // ==================================================
  // DM: send message
  // ==================================================
  socket.on('dm:send', async ({ roomId, message, clientMsgId }) => {
    try {
      const rid = Number(roomId);
      const msg = String(message || '').trim().slice(0, 1000);
      const cmid = String(clientMsgId || '').slice(0, 64) || null;

      const userId = socket.data.userId;
      const username = socket.data.username;

      if (!rid || !msg || !userId || !username) return;

      const ok = await isRoomMember(rid, userId);
      if (!ok) {
        socket.emit('dm:error', {
          message: 'Not allowed to send message'
        });
        return;
      }

      // ✅ store client_msg_id for DM too
      await pool.query(
        `INSERT INTO chat_messages (room_id, user_id, username, message, client_msg_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [rid, userId, username, msg, cmid]
      );

      io.to(`room:${rid}`).emit('dm:new', {
        roomId: rid,
        userId,
        username,
        message: msg,
        created_at: new Date().toISOString(),
        clientMsgId: cmid,
      });

      // Notify other participants (badge refresh) even if they are not in the room view
      try {
        const members = await pool.query(
          `SELECT user_id FROM chat_room_members WHERE room_id=$1 AND user_id <> $2`,
          [rid, userId]
        );
        for (const m of members.rows) {
          io.to(`user:${m.user_id}`).emit('dm:notify', { roomId: rid });
        }
      } catch (e) {
        console.warn('dm:notify failed:', e.code || e.message);
      }

    } catch (err) {
      console.error('dm:send error:', err.code || err.message);
      socket.emit('dm:error', { message: 'Send failed' });
    }
  });

  socket.on('disconnect', () => {
    try {
      const rid = socket.data.wbRoomId;
      if (rid) {
        const out = whiteboardStore.removePresence(rid, socket.id);
        const room = whiteboardStore.get(rid);
        io.to(`wb:${rid}`).emit('wb:presence', {
          roomId: rid,
          count: room?.presence?.size || 0,
          deleted: !!out.deleted,
          reset: !!out.reset,
        });
      }
    } catch (e) {
      // ignore
    }
  });
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
  } catch (e) {
    console.error('❌ PostgreSQL connect failed:', e.message);
  }

  try {
    await initDb();
    console.log('✅ Database schema ready');
  } catch (e) {
    console.warn(
      '⚠️ Schema not applied (permission/db mismatch):',
      e.code || e.message
    );
  }

  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
