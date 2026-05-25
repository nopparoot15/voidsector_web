'use strict';
const express = require('express');
const { pool } = require('../config/db');
const { requireLogin, requireFullAccount } = require('../middleware/requireLogin');

const router = express.Router();

const MAX_IMAGE_BYTES = 800 * 1024;

// ── GET feed (friends + self) ───────────────────────────────────────────────
router.get('/feed', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  const limit  = Math.min(Number(req.query.limit)  || 20, 50);
  const offset = Math.max(Number(req.query.offset) || 0,  0);
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.user_id, u.username, u.avatar, p.text, p.image, p.created_at,
              COUNT(DISTINCT l.user_id)::int AS like_count,
              EXISTS(SELECT 1 FROM post_likes WHERE post_id=p.id AND user_id=$1) AS liked,
              COUNT(DISTINCT c.id)::int AS comment_count
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN post_likes l ON l.post_id = p.id
       LEFT JOIN post_comments c ON c.post_id = p.id
       WHERE p.user_id = $1
          OR p.user_id IN (SELECT friend_user_id FROM friendships WHERE user_id=$1)
       GROUP BY p.id, u.username, u.avatar
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [me, limit, offset]
    );
    res.json({ ok: true, posts: rows });
  } catch (e) {
    console.error('[feed get]', e.message);
    res.status(500).json({ ok: false });
  }
});

// ── CREATE post ────────────────────────────────────────────────────────────
router.post('/feed', requireFullAccount, async (req, res) => {
  const me   = Number(req.session.user.id);
  const text = String(req.body.text || '').trim().slice(0, 4000);
  let image  = null;
  const raw  = (req.body.image || '').trim();
  if (raw) {
    if (!raw.startsWith('data:image/') || Buffer.byteLength(raw) > MAX_IMAGE_BYTES) {
      return res.status(400).json({ ok: false, reason: 'image_too_large' });
    }
    image = raw;
  }
  if (!text && !image) return res.status(400).json({ ok: false, reason: 'empty' });
  try {
    const { rows: [p] } = await pool.query(
      `INSERT INTO posts (user_id, text, image) VALUES ($1,$2,$3) RETURNING id`,
      [me, text || null, image]
    );
    // return full post row for instant prepend
    const { rows: [post] } = await pool.query(
      `SELECT p.id, p.user_id, u.username, u.avatar, p.text, p.image, p.created_at,
              0 AS like_count, false AS liked, 0 AS comment_count
       FROM posts p JOIN users u ON u.id=p.user_id WHERE p.id=$1`,
      [p.id]
    );
    res.json({ ok: true, post });
  } catch (e) {
    console.error('[feed post]', e.message);
    res.status(500).json({ ok: false });
  }
});

// ── DELETE post (owner only) ───────────────────────────────────────────────
router.delete('/feed/:id', requireFullAccount, async (req, res) => {
  const me = Number(req.session.user.id);
  const id = Number(req.params.id);
  const { rowCount } = await pool.query(
    `DELETE FROM posts WHERE id=$1 AND user_id=$2`, [id, me]
  );
  res.json({ ok: rowCount > 0 });
});

// ── LIKE / UNLIKE ──────────────────────────────────────────────────────────
router.post('/feed/:id/like', requireFullAccount, async (req, res) => {
  const me = Number(req.session.user.id);
  const id = Number(req.params.id);
  await pool.query(
    `INSERT INTO post_likes(post_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING`, [id, me]
  );
  const { rows: [r] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM post_likes WHERE post_id=$1`, [id]
  );
  res.json({ ok: true, count: r.count });
});

router.delete('/feed/:id/like', requireFullAccount, async (req, res) => {
  const me = Number(req.session.user.id);
  const id = Number(req.params.id);
  await pool.query(`DELETE FROM post_likes WHERE post_id=$1 AND user_id=$2`, [id, me]);
  const { rows: [r] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM post_likes WHERE post_id=$1`, [id]
  );
  res.json({ ok: true, count: r.count });
});

// ── COMMENTS ──────────────────────────────────────────────────────────────
router.get('/feed/:id/comments', requireLogin, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.user_id, c.username, u.avatar, c.text, c.created_at
     FROM post_comments c JOIN users u ON u.id=c.user_id
     WHERE c.post_id=$1 ORDER BY c.created_at ASC`,
    [Number(req.params.id)]
  );
  res.json({ ok: true, comments: rows });
});

router.post('/feed/:id/comments', requireFullAccount, async (req, res) => {
  const me   = Number(req.session.user.id);
  const id   = Number(req.params.id);
  const text = String(req.body.text || '').trim().slice(0, 1000);
  if (!text) return res.status(400).json({ ok: false });
  await pool.query(
    `INSERT INTO post_comments(post_id,user_id,username,text) VALUES($1,$2,$3,$4)`,
    [id, me, req.session.user.username, text]
  );
  const { rows: [r] } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM post_comments WHERE post_id=$1`, [id]
  );
  res.json({ ok: true, count: r.count });
});

// ── AVATAR ────────────────────────────────────────────────────────────────
router.post('/avatar', requireFullAccount, async (req, res) => {
  const me  = Number(req.session.user.id);
  const raw = (req.body.avatar || '').trim();
  if (!raw || !raw.startsWith('data:image/') || Buffer.byteLength(raw) > 300 * 1024) {
    return res.status(400).json({ ok: false, reason: 'invalid' });
  }
  await pool.query(`UPDATE users SET avatar=$1 WHERE id=$2`, [raw, me]);
  req.session.user.avatar = raw;
  res.json({ ok: true });
});

module.exports = router;
