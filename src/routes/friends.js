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
// SEND FRIEND REQUEST  (คุณมีแล้ว)
// POST /friends/request  body: { username }
// ------------------------------------------------------
router.post('/friends/request', requireLogin, async (req, res) => {
  const { username } = req.body;
  const me = req.session.user.id;

  if (!username || typeof username !== 'string') return res.json({ ok: false });
  if (username === req.session.user.username) return res.json({ ok: false });

  const user = await pool.query('SELECT id FROM users WHERE username=$1', [username]);
  if (!user.rows.length) return res.json({ ok: false });

  const targetId = user.rows[0].id;
  await pool.query(
    `INSERT INTO friend_requests(from_user_id,to_user_id)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [me, targetId]
  );
  pool.query(
    `INSERT INTO notifications(user_id,from_user_id,type) VALUES($1,$2,'friend_request')`,
    [targetId, me]
  ).catch(() => {});

  res.json({ ok: true });
});

// ------------------------------------------------------
// INCOMING REQUESTS
// GET /friends/requests/incoming
// ------------------------------------------------------
router.get('/friends/requests/incoming', requireLogin, async (req, res) => {
  const me = req.session.user.id;

  const r = await pool.query(
    `SELECT fr.id, fr.from_user_id, u.username, fr.created_at
     FROM friend_requests fr
     JOIN users u ON u.id = fr.from_user_id
     WHERE fr.to_user_id=$1 AND fr.status='pending'
     ORDER BY fr.created_at DESC`,
    [me]
  );

  res.json({ ok: true, requests: r.rows });
});

// ------------------------------------------------------
// ACCEPT REQUEST  (สำคัญ: transaction + สร้าง DM room + members)
// POST /friends/requests/:id/accept
// ------------------------------------------------------
router.post('/friends/requests/:id/accept', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  const reqId = Number(req.params.id);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) โหลด request และล็อกแถว
    const fr = await client.query(
      `SELECT id, from_user_id, to_user_id, status
       FROM friend_requests
       WHERE id=$1
       FOR UPDATE`,
      [reqId]
    );

    if (!fr.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ ok: false, reason: 'not_found' });
    }

    const row = fr.rows[0];
    if (Number(row.to_user_id) !== me) {
      await client.query('ROLLBACK');
      return res.status(403).json({ ok: false, reason: 'not_yours' });
    }
    if (row.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.json({ ok: true, already: row.status });
    }

    const fromId = Number(row.from_user_id);
    const toId = Number(row.to_user_id);

    // 2) update request -> accepted
    await client.query(
      `UPDATE friend_requests
       SET status='accepted'
       WHERE id=$1`,
      [reqId]
    );

    // 3) friendships (directed 2 แถว)
    await client.query(
      `INSERT INTO friendships(user_id, friend_user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [fromId, toId]
    );
    await client.query(
      `INSERT INTO friendships(user_id, friend_user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [toId, fromId]
    );

    // 4) create/find DM room
    const name = dmRoomName(fromId, toId);

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

    // 5) ใส่สมาชิก 2 คน
    await client.query(
      `INSERT INTO chat_room_members(room_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [roomId, fromId]
    );
    await client.query(
      `INSERT INTO chat_room_members(room_id, user_id)
       VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [roomId, toId]
    );

    await client.query('COMMIT');
    res.json({ ok: true, dm_room_id: roomId });

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('[friends accept] error:', e);
    res.status(500).json({ ok: false });
  } finally {
    client.release();
  }
});

// ------------------------------------------------------
// DECLINE / DENY REQUEST
// POST /friends/requests/:id/decline
// POST /friends/requests/:id/deny   (alias)
// ------------------------------------------------------
async function declineRequest(req, res) {
  const me = Number(req.session.user.id);
  const reqId = Number(req.params.id);

  const r = await pool.query(
    `UPDATE friend_requests
     SET status='declined'
     WHERE id=$1 AND to_user_id=$2 AND status='pending'
     RETURNING id`,
    [reqId, me]
  );

  if (!r.rows.length) return res.json({ ok: false });
  res.json({ ok: true });
}

router.post('/friends/requests/:id/decline', requireLogin, declineRequest);
router.post('/friends/requests/:id/deny', requireLogin, declineRequest);

// ------------------------------------------------------
// FRIEND LIST
// GET /friends/list
// ------------------------------------------------------
router.get('/friends/list', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);

  const r = await pool.query(
    `SELECT u.id, u.username, u.avatar
     FROM friendships f
     JOIN users u ON u.id = f.friend_user_id
     WHERE f.user_id=$1
     ORDER BY u.username ASC`,
    [me]
  );

  res.json({ ok: true, friends: r.rows });
});

module.exports = router;
