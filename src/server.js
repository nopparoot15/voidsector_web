// src/server.js
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const { createApp } = require('./app');
const { pool, initDb } = require('./config/db');
const { whiteboardStore } = require('./whiteboard/store');
const { watchPartyStore } = require('./watchparty/store');

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
  socket.on('wb:join', ({ roomId, k } = {}) => {
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

    const key = String(k || '');
    const allowed = whiteboardStore.canAccess(rid, userId) || whiteboardStore.canAccessWithKey(rid, userId, key);
    if (!allowed) {
      socket.emit('wb:error', { message: 'Forbidden' });
      return;
    }

    if (!room.isPublic && whiteboardStore.canAccessWithKey(rid, userId, key)) {
      // Remember access for this user (in-memory) once they join via share-link.
      whiteboardStore.grant(rid, userId);
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

  // Stream live stroke segments while drawing (not persisted to history; final stroke is sent on wb:stroke)
  socket.on('wb:stroke_part', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      t: 'stroke',
      id: String(evt.id || ''),
      tool: String(evt.tool || 'pen').slice(0, 16),
      color: String(evt.color || '#00ffff').slice(0, 32),
      size: Math.max(1, Math.min(Number(evt.size) || 3, 48)),
      // A small batch of points streamed while drawing (even-length array: [x1,y1,x2,y2,...])
      // Keep it bounded to prevent abuse.
      points: Array.isArray(evt.points) ? evt.points.slice(0, 160) : [],
      userId: Number(socket.data.userId),
      username: String(socket.data.username || '').slice(0, 32),
      ts: Date.now(),
    };
    if (!clean.id) return;
    if (!Array.isArray(clean.points) || clean.points.length < 2 || (clean.points.length % 2) !== 0) return;
    // broadcast to others in room (not back to sender)
    socket.to(`wb:${rid}`).emit('wb:stroke_part', clean);
  }));

  socket.on('wb:stroke', guardWB((rid, evt) => {
    // evt: { tool, color, size, points:[...], t }
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      t: 'stroke',
      id: String(evt.id || '') || crypto.randomBytes(8).toString('hex'),
      tool: String(evt.tool || 'pen').slice(0, 16),
      color: String(evt.color || '#00ffff').slice(0, 32),
      size: Math.max(1, Math.min(Number(evt.size) || 3, 48)),
      points: Array.isArray(evt.points) ? evt.points.slice(0, 2048) : [],
      userId: Number(socket.data.userId),
      username: String(socket.data.username || '').slice(0, 32),
      ts: Date.now(),
    };
    // must be even-length point list, at least 4 numbers (2 points)
    if (!Array.isArray(clean.points) || clean.points.length < 4 || (clean.points.length % 2) !== 0) return;
    whiteboardStore.appendEvent(rid, clean);
    socket.to(`wb:${rid}`).emit('wb:stroke', clean);
  }));

  socket.on('wb:undo', guardWB((rid, _payload, cb) => {
    const userId = Number(socket.data.userId);
    const removedId = whiteboardStore.undoLastStroke(rid, userId);
    if (!removedId) {
      if (typeof cb === 'function') cb({ ok: false, reason: 'nothing_to_undo' });
      return;
    }
    io.to(`wb:${rid}`).emit('wb:undo', { id: removedId, userId });
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

  // Cursor presence (show username near cursor ONLY while drawing)
  socket.on('wb:cursor', guardWB((rid, evt) => {
    if (!evt || typeof evt !== 'object') return;
    const clean = {
      userId: Number(socket.data.userId),
      username: String(socket.data.username || '').slice(0, 32),
      x: Math.max(0, Math.min(Number(evt.x) || 0, 1)),
      y: Math.max(0, Math.min(Number(evt.y) || 0, 1)),
      drawing: !!evt.drawing,
      color: String(evt.color || '#00ffff').slice(0, 32),
      ts: Date.now(),
    };
    socket.to(`wb:${rid}`).emit('wb:cursor', clean);
  }));

  // ==================================================
  // WHITEBOARD: invite friends (owner only) + notify
  // ==================================================
  socket.on('wb:invite', async ({ roomId, friendIds } = {}, cb) => {
    try {
      const rid = String(roomId || '');
      const actorId = Number(socket.data.userId);
      const actorName = String(socket.data.username || '');

      if (!rid) return typeof cb === 'function' ? cb({ ok: false, reason: 'room_required' }) : null;
      if (!Number.isFinite(actorId) || actorId <= 0 || !actorName) {
        return typeof cb === 'function' ? cb({ ok: false, reason: 'not_identified' }) : null;
      }

      const room = whiteboardStore.get(rid);
      if (!room || room.isPublic) {
        return typeof cb === 'function' ? cb({ ok: false, reason: 'not_found' }) : null;
      }

      // Only owner can invite
      if (Number(room.ownerId) !== Number(actorId)) {
        return typeof cb === 'function' ? cb({ ok: false, reason: 'not_owner' }) : null;
      }

      // Normalize + validate friend list is actually your friends
      const ids = (Array.isArray(friendIds) ? friendIds : [])
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n) && n > 0);
      if (ids.length === 0) {
        return typeof cb === 'function' ? cb({ ok: false, reason: 'no_targets' }) : null;
      }

      // friendships table uses friend_user_id (directed edges are created on accept)
      const fr = await pool.query(
        `SELECT friend_user_id
         FROM friendships
         WHERE user_id=$1 AND friend_user_id = ANY($2::int[])`,
        [actorId, ids]
      );
      const friendOk = fr.rows.map(r => Number(r.friend_user_id)).filter(Boolean);
      if (friendOk.length === 0) {
        return typeof cb === 'function' ? cb({ ok: false, reason: 'not_friends' }) : null;
      }

      const out = whiteboardStore.invite(rid, actorId, friendOk);
      if (!out.ok) {
        return typeof cb === 'function' ? cb(out) : null;
      }

      // Persist invites + notify in realtime
      let inserted = 0;
      for (const toId of friendOk) {
        try {
          const ins = await pool.query(
            `INSERT INTO whiteboard_invites (room_id, from_user_id, to_user_id)
             VALUES ($1,$2,$3)
             ON CONFLICT (room_id, to_user_id)
             DO UPDATE SET status='pending', created_at=NOW(), from_user_id=EXCLUDED.from_user_id
             RETURNING id`,
            [rid, actorId, toId]
          );
          if (ins.rowCount) inserted += 1;
        } catch (e) {
          // ignore per-user insert errors
        }

        io.to(`user:${toId}`).emit('wb:invite_notify', {
          roomId: rid,
          from_user_id: actorId,
          from_username: actorName,
          at: new Date().toISOString(),
        });
      }

      return typeof cb === 'function' ? cb({ ok: true, added: friendOk.length, saved: inserted }) : null;
    } catch (e) {
      console.error('wb:invite error:', e.code || e.message);
      return typeof cb === 'function' ? cb({ ok: false, reason: 'server_error' }) : null;
    }
  });

  // ==================================================
  // WATCH PARTY: join room + sync video events
  // ==================================================
  // Client/server time sync to reduce jitter (clock skew)
  socket.on('wp:time_sync', ({ t0 } = {}) => {
    const t0n = Number(t0) || 0;
    socket.emit('wp:time_sync', { t0: t0n, ts: Date.now() });
  });

  socket.on('wp:join', ({ roomId, k } = {}) => {
    const rid = String(roomId || '');
    const userId = Number(socket.data.userId);
    if (!rid) return;
    if (!Number.isFinite(userId) || userId <= 0) {
      socket.emit('wp:error', { message: 'Not identified' });
      return;
    }

    const room = watchPartyStore.get(rid);
    if (!room) {
      socket.emit('wp:error', { message: 'Room not found' });
      return;
    }

    const key = String(k || '');
    const allowed = watchPartyStore.canAccess(rid, userId) || watchPartyStore.canAccessWithKey(rid, userId, key);
    if (!allowed) {
      socket.emit('wp:error', { message: 'Forbidden' });
      return;
    }
    if (!room.isPublic && watchPartyStore.canAccessWithKey(rid, userId, key)) {
      watchPartyStore.grant(rid, userId);
    }

    if (socket.data.wpRoomId && socket.data.wpRoomId !== rid) {
      socket.leave(`wp:${socket.data.wpRoomId}`);
      watchPartyStore.removePresence(socket.data.wpRoomId, socket.id);
    }

    socket.data.wpRoomId = rid;
    socket.join(`wp:${rid}`);
    watchPartyStore.addPresence(rid, socket.id, userId);

    socket.emit('wp:joined', {
      roomId: rid,
      isPublic: !!room.isPublic,
      membersOnline: room.presence?.size || 0,
      state: room.state,
    });
    io.to(`wp:${rid}`).emit('wp:presence', { membersOnline: room.presence?.size || 0 });
  });

  function guardWP(cb) {
    return (...args) => {
      const rid = socket.data.wpRoomId;
      const userId = Number(socket.data.userId);
      if (!rid || !Number.isFinite(userId) || userId <= 0) return;
      if (!watchPartyStore.canAccess(rid, userId)) return;
      cb(rid, ...args);
    };
  }

  // Host (or anyone) sets the URL to watch
  socket.on('wp:set_url', guardWP((rid, { url, provider } = {}) => {
    const u = String(url || '').trim().slice(0, 2000);
    const p = String(provider || 'generic').slice(0, 16);
    // When URL changes, start playing immediately (best-effort; browsers may require 1st user gesture)
    const actorId = Number(socket.data.userId) || null;
    const st = watchPartyStore.setState(rid, { url: u, provider: p, isPlaying: true, t: 0 }, actorId);
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:play', guardWP((rid, { t } = {}) => {
    const actorId = Number(socket.data.userId) || null;
    const tn = Number(t);
    const hasT = Number.isFinite(tn);
    const time = hasT ? Math.max(0, Math.min(tn, 10 ** 7)) : undefined;
    const st = watchPartyStore.setState(rid, hasT ? { isPlaying: true, t: time } : { isPlaying: true }, actorId);
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:pause', guardWP((rid, { t } = {}) => {
    const actorId = Number(socket.data.userId) || null;
    const tn = Number(t);
    const hasT = Number.isFinite(tn);
    const time = hasT ? Math.max(0, Math.min(tn, 10 ** 7)) : undefined;
    const st = watchPartyStore.setState(rid, hasT ? { isPlaying: false, t: time } : { isPlaying: false }, actorId);
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:seek', guardWP((rid, { t } = {}) => {
    const actorId = Number(socket.data.userId) || null;
    const time = Math.max(0, Math.min(Number(t) || 0, 10 ** 7));
    const st = watchPartyStore.setState(rid, { t: time }, actorId);
    io.to(`wp:${rid}`).emit('wp:state', st);
  }));

  socket.on('wp:ping_state', guardWP((rid) => {
    const room = watchPartyStore.get(rid);
    if (!room) return;
    socket.emit('wp:state', room.state);
  }));

  // Periodic server-authoritative ticks while playing.
  // Helps clients stay realtime even if a state packet is missed or tab was throttled.
  // (Lightweight: only emits when there are members online.)
  // NOTE: The store is in-memory; this tick loop is safe to run per-process.
  if (!global.__VS_WP_TICK_LOOP__) {
    global.__VS_WP_TICK_LOOP__ = true;
    setInterval(() => {
      try {
        for (const [rid, room] of (watchPartyStore.rooms || new Map()).entries()) {
          if (!room?.presence || room.presence.size === 0) continue;
          const st = room.state;
          if (!st?.isPlaying) continue;
          // Re-base t/updatedAt to "now" so clients can smooth-correct with minimal drift.
          const actorId = room.leaderId || room.ownerId || null;
          const rebased = watchPartyStore.setState(rid, { isPlaying: true }, actorId);
          // Emit as tick (clients treat like state but lower priority).
          io.to(`wp:${rid}`).emit('wp:tick', rebased);
        }
      } catch (e) {
        // ignore tick errors
      }
    }, 1200);
  }

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

      const wpRid = socket.data.wpRoomId;
      if (wpRid) {
        const out = watchPartyStore.removePresence(wpRid, socket.id);
        const room = watchPartyStore.get(wpRid);
        io.to(`wp:${wpRid}`).emit('wp:presence', {
          roomId: wpRid,
          membersOnline: room?.presence?.size || 0,
          deleted: !!out.deleted,
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
