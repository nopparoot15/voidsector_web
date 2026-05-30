'use strict';
const express = require('express');
const { pool } = require('../config/db');
const { requireLogin } = require('../middleware/requireLogin');

const router = express.Router();

router.get('/search', requireLogin, async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (q.length < 1) return res.json({ ok: true, users: [], posts: [] });
  const me = Number(req.session.user.id);
  try {
    const [usersRes, postsRes] = await Promise.all([
      pool.query(
        `SELECT id, username, avatar FROM users
         WHERE LOWER(username) LIKE LOWER($1) AND id != $2
         ORDER BY username LIMIT 5`,
        [`${q}%`, me]
      ),
      pool.query(
        `SELECT p.id, p.user_id, u.username, u.avatar, p.text, p.created_at
         FROM posts p JOIN users u ON u.id = p.user_id
         WHERE p.text ILIKE $1
         ORDER BY p.created_at DESC LIMIT 5`,
        [`%${q}%`]
      ),
    ]);
    res.json({ ok: true, users: usersRes.rows, posts: postsRes.rows });
  } catch (e) {
    res.json({ ok: false, users: [], posts: [] });
  }
});

router.get('/badges/:userId', requireLogin, async (req, res) => {
  const { getUserBadges } = require('../helpers/badges');
  try {
    const badges = await getUserBadges(Number(req.params.userId));
    res.json({ ok: true, badges });
  } catch (e) {
    res.json({ ok: false, badges: [] });
  }
});

module.exports = router;
