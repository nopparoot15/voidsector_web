'use strict';
const express = require('express');
const { pool } = require('../config/db');
const { requireLogin, requireFullAccount } = require('../middleware/requireLogin');
const { checkAndAward } = require('../helpers/badges');

const router = express.Router();
const MAX_IMAGE_BYTES = 500 * 1024;

router.get('/stories', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.user_id, u.username, u.avatar, s.text, s.image, s.created_at, s.expires_at
       FROM stories s
       JOIN users u ON u.id = s.user_id
       WHERE s.expires_at > NOW()
         AND (s.user_id = $1 OR s.user_id IN (SELECT friend_user_id FROM friendships WHERE user_id=$1))
       ORDER BY s.user_id = $1 DESC, s.created_at DESC`,
      [me]
    );
    // Group by user
    const byUser = {};
    for (const s of rows) {
      if (!byUser[s.user_id]) byUser[s.user_id] = { user_id: s.user_id, username: s.username, avatar: s.avatar, stories: [] };
      byUser[s.user_id].stories.push(s);
    }
    res.json({ ok: true, users: Object.values(byUser) });
  } catch (e) {
    console.error('[stories get]', e.message);
    res.status(500).json({ ok: false });
  }
});

router.post('/stories', requireFullAccount, async (req, res) => {
  const me   = Number(req.session.user.id);
  const text = String(req.body.text || '').trim().slice(0, 500);
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
    const { rows: [s] } = await pool.query(
      `INSERT INTO stories(user_id, text, image) VALUES($1,$2,$3) RETURNING id, created_at, expires_at`,
      [me, text || null, image]
    );
    checkAndAward(me).catch(() => {});
    res.json({ ok: true, story: { id: s.id, user_id: me, username: req.session.user.username, avatar: req.session.user.avatar || null, text, image, created_at: s.created_at, expires_at: s.expires_at } });
  } catch (e) {
    console.error('[stories post]', e.message);
    res.status(500).json({ ok: false });
  }
});

router.delete('/stories/:id', requireFullAccount, async (req, res) => {
  const me = Number(req.session.user.id);
  const id = Number(req.params.id);
  const { rowCount } = await pool.query(`DELETE FROM stories WHERE id=$1 AND user_id=$2`, [id, me]);
  res.json({ ok: rowCount > 0 });
});

module.exports = router;
