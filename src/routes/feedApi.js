// src/routes/feedApi.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { pool } = require('../config/db');
const { requireLogin } = require('../middleware/requireLogin');

const router = express.Router();

// ----------------------------
// Uploads
// ----------------------------
const uploadRoot = path.join(__dirname, '../../public/uploads/posts');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const safeBase = String(path.basename(file.originalname || 'file'))
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);
    const ext = path.extname(safeBase);
    const base = safeBase.replace(ext, '');
    cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}_${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    files: 6,
    fileSize: 25 * 1024 * 1024, // 25MB each
  }
});

// ----------------------------
// GET feed (latest activity first)
// GET /api/feed?limit=20&offset=0
// ----------------------------
router.get('/feed', requireLogin, async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const rows = await pool.query(
    `SELECT p.id, p.user_id, u.username, p.text, p.created_at, p.updated_at,
            COALESCE(
              json_agg(
                json_build_object('url', m.url, 'mime', m.mime, 'name', m.name)
              ) FILTER (WHERE m.id IS NOT NULL),
              '[]'::json
            ) AS media
     FROM posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN post_media m ON m.post_id = p.id
     GROUP BY p.id, u.username
     ORDER BY p.updated_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  res.json({ ok: true, posts: rows.rows });
});

// ----------------------------
// CREATE post
// POST /api/feed  (multipart)
// fields: text
// files: media[]
// ----------------------------
router.post('/feed', requireLogin, upload.array('media', 6), async (req, res) => {
  const me = Number(req.session.user.id);
  const text = String(req.body.text || '').trim().slice(0, 4000);
  const files = req.files || [];

  if (!text && files.length === 0) {
    return res.status(400).json({ ok: false, reason: 'empty' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const p = await client.query(
      `INSERT INTO posts (user_id, text)
       VALUES ($1, $2)
       RETURNING id`,
      [me, text]
    );
    const postId = p.rows[0].id;

    for (const f of files) {
      const url = `/uploads/posts/${path.basename(f.filename)}`;
      await client.query(
        `INSERT INTO post_media (post_id, url, mime, name)
         VALUES ($1, $2, $3, $4)`,
        [postId, url, f.mimetype || 'application/octet-stream', f.originalname || 'file']
      );
    }

    await client.query('COMMIT');
    res.json({ ok: true, post_id: postId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('[feed create] error:', e);
    res.status(500).json({ ok: false });
  } finally {
    client.release();
  }
});

module.exports = router;
