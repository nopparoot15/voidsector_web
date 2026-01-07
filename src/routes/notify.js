
// src/routes/notify.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { pool } = require('../config/db');

const router = express.Router();

// Helper: return other user in a 2-person DM room
// We assume DM rooms are is_public=false and have exactly 2 members (created on friend accept).
async function getDmThreads(me) {
  const q = `
    WITH my_rooms AS (
      SELECT cr.id AS room_id
      FROM chat_rooms cr
      JOIN chat_room_members crm ON crm.room_id = cr.id
      WHERE crm.user_id = $1 AND cr.is_public = false
    ),
    other_member AS (
      SELECT mr.room_id, u.id AS friend_id, u.username, u.avatar_path
      FROM my_rooms mr
      JOIN chat_room_members crm2 ON crm2.room_id = mr.room_id AND crm2.user_id <> $1
      JOIN users u ON u.id = crm2.user_id
    ),
    last_msg AS (
      SELECT om.room_id,
             cm.message AS last_message,
             cm.user_id AS last_user_id,
             cm.created_at AS last_at
      FROM other_member om
      LEFT JOIN LATERAL (
        SELECT message, user_id, created_at
        FROM chat_messages
        WHERE room_id = om.room_id
        ORDER BY created_at DESC
        LIMIT 1
      ) cm ON true
    ),
    unread AS (
      SELECT om.room_id,
             COUNT(*)::int AS unread_count
      FROM other_member om
      LEFT JOIN chat_reads crd
        ON crd.room_id = om.room_id AND crd.user_id = $1
      LEFT JOIN chat_room_members myjoin
        ON myjoin.room_id = om.room_id AND myjoin.user_id = $1
      JOIN chat_messages cm
        ON cm.room_id = om.room_id
       AND cm.created_at > COALESCE(crd.last_read_at, myjoin.joined_at, '1970-01-01'::timestamptz)
       AND cm.user_id IS DISTINCT FROM $1
      GROUP BY om.room_id
    )
    SELECT om.room_id,
           om.friend_id,
           om.username,
           om.avatar_path,
           lm.last_message,
           lm.last_user_id,
           lm.last_at,
           COALESCE(u.unread_count, 0) AS unread_count
    FROM other_member om
    LEFT JOIN last_msg lm ON lm.room_id = om.room_id
    LEFT JOIN unread u ON u.room_id = om.room_id
    ORDER BY COALESCE(lm.last_at, '1970-01-01'::timestamptz) DESC, om.username ASC
  `;
  const r = await pool.query(q, [me]);
  return r.rows;
}

// GET /api/notify/summary
router.get('/notify/summary', requireLogin, async (req, res) => {
  try {
    const me = Number(req.session.user.id);

    // incoming friend requests (pending)
    const fr = await pool.query(
      `SELECT fr.id, fr.from_user_id, u.username, u.avatar_path, fr.created_at
       FROM friend_requests fr
       JOIN users u ON u.id = fr.from_user_id
       WHERE fr.to_user_id=$1 AND fr.status='pending'
       ORDER BY fr.created_at DESC
       LIMIT 10`,
      [me]
    );

    const threads = await getDmThreads(me);

    const alerts_count = fr.rows.length;
    const messages_unread = threads.reduce((s, t) => s + (t.unread_count || 0), 0);

    res.json({
      ok: true,
      counts: {
        alerts: alerts_count,
        messages: messages_unread,
      },
      friend_requests: fr.rows,
      dm_threads: threads,
    });
  } catch (err) {
    console.error('notify summary error:', err.code || err.message);
    res.status(500).json({ ok: false, message: 'notify summary failed' });
  }
});

// POST /api/notify/read  body: { roomId }
router.post('/notify/read', requireLogin, async (req, res) => {
  try {
    const me = Number(req.session.user.id);
    const roomId = Number(req.body?.roomId);
    if (!roomId) return res.status(400).json({ ok: false, message: 'roomId required' });

    // only allow if member
    const ok = await pool.query(
      `SELECT 1 FROM chat_room_members WHERE room_id=$1 AND user_id=$2`,
      [roomId, me]
    );
    if (!ok.rowCount) return res.status(403).json({ ok: false, message: 'not a member' });

    await pool.query(
      `INSERT INTO chat_reads(room_id, user_id, last_read_at)
       VALUES ($1,$2,NOW())
       ON CONFLICT (room_id, user_id)
       DO UPDATE SET last_read_at=EXCLUDED.last_read_at`,
      [roomId, me]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('notify read error:', err.code || err.message);
    res.status(500).json({ ok: false, message: 'notify read failed' });
  }
});

module.exports = router;
