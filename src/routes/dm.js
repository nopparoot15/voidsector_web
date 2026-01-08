// src/routes/dm.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { pool } = require('../config/db');

const router = express.Router();

function dmRoomName(a, b) {
  const x = Number(a), y = Number(b);
  const u1 = Math.min(x, y);
  const u2 = Math.max(x, y);
  return `dm:${u1}:${u2}`;
}

// ------------------------------------------------------
// OPEN / CREATE DM ROOM WITH A FRIEND
// POST /dm/open  body: { friend_id }
// return: { ok:true, room_id }
// ------------------------------------------------------
router.post('/dm/open', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  // Accept multiple client payload shapes for robustness
  // - friend_id  (snake_case)
  // - friendId   (camelCase)
  // - friend     (query-like)
  const friendId = Number(
    req.body.friend_id ?? req.body.friendId ?? req.body.friend
  );

  if (!friendId || friendId === me) {
    return res.status(400).json({ ok: false, reason: 'bad_friend_id' });
  }

  // ต้องเป็นเพื่อนกัน (schema friendships เป็น directed แต่บางระบบอาจมีแถวเดียว)
  // ยอมรับได้ถ้ามีความสัมพันธ์อย่างน้อย 1 ทิศทาง
  const fr = await pool.query(
    `SELECT 1
     FROM friendships
     WHERE (user_id=$1 AND friend_user_id=$2)
        OR (user_id=$2 AND friend_user_id=$1)
     LIMIT 1`,
    [me, friendId]
  );
  if (!fr.rows.length) return res.status(403).json({ ok: false, reason: 'not_friends' });

  const name = dmRoomName(me, friendId);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // สร้างห้องถ้ายังไม่มี
    await client.query(
      `INSERT INTO chat_rooms(name, is_public)
       VALUES ($1, FALSE)
       ON CONFLICT (name) DO NOTHING`,
      [name]
    );

    // หา room_id
    const room = await client.query(
      `SELECT id FROM chat_rooms WHERE name=$1 LIMIT 1`,
      [name]
    );
    const roomId = room.rows[0].id;

    // ใส่ member ให้ครบ 2 คน (กันกรณีหลุด)
    await client.query(
      `INSERT INTO chat_room_members(room_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [roomId, me]
    );
    await client.query(
      `INSERT INTO chat_room_members(room_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [roomId, friendId]
    );

    await client.query('COMMIT');
    res.json({ ok: true, room_id: roomId });

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('[dm open] error:', e);
    res.status(500).json({ ok: false });
  } finally {
    client.release();
  }
});

// ------------------------------------------------------
// GET MESSAGES IN A ROOM (DM or public)
// GET /dm/rooms/:roomId/messages?limit=50
// ต้องเป็น member ถ้าเป็น private room
// ------------------------------------------------------
router.get('/dm/rooms/:roomId/messages', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = Number(req.params.roomId);
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);

  // ตรวจ room ว่ามีจริง
  const room = await pool.query(
    `SELECT id, is_public FROM chat_rooms WHERE id=$1 LIMIT 1`,
    [roomId]
  );
  if (!room.rows.length) return res.status(404).json({ ok: false });

  const isPublic = !!room.rows[0].is_public;

  // ถ้า private ต้องเป็น member
  if (!isPublic) {
    const mem = await pool.query(
      `SELECT 1 FROM chat_room_members WHERE room_id=$1 AND user_id=$2 LIMIT 1`,
      [roomId, me]
    );
    if (!mem.rows.length) return res.status(403).json({ ok: false, reason: 'not_member' });
  }

  const msgs = await pool.query(
    `SELECT id, room_id, user_id, username, message, created_at
     FROM chat_messages
     WHERE room_id=$1
     ORDER BY created_at DESC
     LIMIT $2`,
    [roomId, limit]
  );

  // mark read (only for private rooms)
  if (!isPublic) {
    await pool.query(
      `INSERT INTO chat_reads(room_id, user_id, last_read_at)
       VALUES ($1,$2,NOW())
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET last_read_at=EXCLUDED.last_read_at`,
      [roomId, me]
    );
  }

  // ส่งกลับแบบเก่า->ใหม่
  res.json({ ok: true, messages: msgs.rows.reverse() });
});

module.exports = router;
