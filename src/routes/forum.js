'use strict';
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { requireFullAccount } = require('../middleware/requireLogin');

const PER_PAGE = 20;

function daysLeft(expiresAt) {
  return Math.max(0, Math.ceil((new Date(expiresAt) - Date.now()) / 86400000));
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'เมื่อกี้';
  if (s < 3600) return `${Math.floor(s / 60)} นาทีที่แล้ว`;
  if (s < 86400) return `${Math.floor(s / 3600)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(s / 86400)} วันที่แล้ว`;
}

// List threads
router.get('/forum', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const offset = (page - 1) * PER_PAGE;
  try {
    const [{ rows: threads }, { rows: [{ count }] }] = await Promise.all([
      pool.query(
        `SELECT t.id, t.username, t.title, t.created_at, t.expires_at,
                COUNT(c.id)::int AS comment_count
         FROM threads t
         LEFT JOIN thread_comments c ON c.thread_id = t.id
         WHERE t.expires_at > NOW()
         GROUP BY t.id
         ORDER BY t.created_at DESC
         LIMIT $1 OFFSET $2`,
        [PER_PAGE, offset]
      ),
      pool.query(`SELECT COUNT(*) FROM threads WHERE expires_at > NOW()`),
    ]);

    const totalPages = Math.ceil(count / PER_PAGE);
    res.render('pages/forum', {
      title: 'กระทู้',
      threads: threads.map(t => ({ ...t, daysLeft: daysLeft(t.expires_at), timeAgo: timeAgo(t.created_at) })),
      page,
      totalPages,
    });
  } catch (err) {
    console.error('forum list error:', err.message);
    res.status(500).render('pages/notfound', { title: 'Error' });
  }
});

// New thread form
router.get('/forum/new', requireFullAccount, (req, res) => {
  res.render('pages/forum-new', { title: 'ตั้งกระทู้ใหม่', error: null });
});

const MAX_IMAGE_BYTES = 600 * 1024; // 600KB base64

// Create thread
router.post('/forum', requireFullAccount, async (req, res) => {
  const title = (req.body.title || '').trim().slice(0, 200);
  const body  = (req.body.body  || '').trim().slice(0, 5000);
  if (!title || !body) {
    return res.render('pages/forum-new', { title: 'ตั้งกระทู้ใหม่', error: 'กรุณากรอกหัวข้อและเนื้อหา' });
  }

  let image = null;
  const raw = (req.body.image || '').trim();
  if (raw) {
    if (!raw.startsWith('data:image/') || Buffer.byteLength(raw) > MAX_IMAGE_BYTES) {
      return res.render('pages/forum-new', { title: 'ตั้งกระทู้ใหม่', error: 'รูปใหญ่เกินไป (สูงสุด ~450KB)' });
    }
    image = raw;
  }

  try {
    const { rows: [t] } = await pool.query(
      `INSERT INTO threads (user_id, username, title, body, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.session.user.id, req.session.user.username, title, body, image]
    );
    res.redirect(`/forum/${t.id}`);
  } catch (err) {
    console.error('forum create error:', err.message);
    res.render('pages/forum-new', { title: 'ตั้งกระทู้ใหม่', error: 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง' });
  }
});

// View thread
router.get('/forum/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.status(404).render('pages/notfound', { title: '404' });
  try {
    const { rows: [thread] } = await pool.query(
      `SELECT * FROM threads WHERE id = $1 AND expires_at > NOW()`, [id]
    );
    if (!thread) return res.status(404).render('pages/notfound', { title: 'ไม่พบกระทู้' });

    const { rows: comments } = await pool.query(
      `SELECT * FROM thread_comments WHERE thread_id = $1 ORDER BY created_at ASC`, [id]
    );

    res.render('pages/forum-thread', {
      title: thread.title,
      thread: { ...thread, daysLeft: daysLeft(thread.expires_at), timeAgo: timeAgo(thread.created_at) },
      comments: comments.map(c => ({ ...c, timeAgo: timeAgo(c.created_at) })),
      myId: req.session?.user?.id || null,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error('forum thread error:', err.message);
    res.status(500).render('pages/notfound', { title: 'Error' });
  }
});

// Add comment
router.post('/forum/:id/comment', requireFullAccount, async (req, res) => {
  const id   = parseInt(req.params.id);
  const body = (req.body.body || '').trim().slice(0, 2000);
  if (!body) return res.redirect(`/forum/${id}?error=กรุณากรอกความคิดเห็น`);
  try {
    const { rows: [thread] } = await pool.query(
      `SELECT id FROM threads WHERE id = $1 AND expires_at > NOW()`, [id]
    );
    if (!thread) return res.status(404).render('pages/notfound', { title: 'ไม่พบกระทู้' });

    await pool.query(
      `INSERT INTO thread_comments (thread_id, user_id, username, body)
       VALUES ($1, $2, $3, $4)`,
      [id, req.session.user.id, req.session.user.username, body]
    );
    await pool.query(
      `UPDATE threads SET expires_at = NOW() + INTERVAL '30 days' WHERE id = $1`, [id]
    );
    res.redirect(`/forum/${id}#comments`);
  } catch (err) {
    console.error('forum comment error:', err.message);
    res.redirect(`/forum/${id}?error=เกิดข้อผิดพลาด`);
  }
});

// Delete thread (owner only)
router.post('/forum/:id/delete', requireFullAccount, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rows: [thread] } = await pool.query(
      `SELECT user_id FROM threads WHERE id = $1`, [id]
    );
    if (!thread) return res.redirect('/forum');
    if (thread.user_id !== req.session.user.id) return res.redirect(`/forum/${id}`);
    await pool.query(`DELETE FROM threads WHERE id = $1`, [id]);
    res.redirect('/forum');
  } catch (err) {
    console.error('forum delete error:', err.message);
    res.redirect(`/forum/${id}`);
  }
});

module.exports = router;
