// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

const router = express.Router();

// ====================
// GET /login
// ====================
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('pages/login', { error: null });
});

// ====================
// POST /login
// ====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT id, username, password, avatar_path FROM users WHERE username=$1',
      [username]
    );

    if (!rows.length) {
      return res.render('pages/login', { error: 'ไม่พบบัญชีผู้ใช้' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.render('pages/login', { error: 'รหัสผ่านไม่ถูกต้อง' });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      avatar_path: user.avatar_path || null
    };

    res.redirect('/');
  } catch (err) {
    console.error('login error:', err);
    res.render('pages/login', { error: 'เกิดข้อผิดพลาด' });
  }
});

// ====================
// GET /register   ✅ (ตัวที่คุณขาด)
// ====================
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('pages/register', { error: null });
});

// ====================
// POST /register
// ====================
router.post('/register', async (req, res) => {
  const { username, password, confirm } = req.body;

  if (!username || username.length < 3) {
    return res.render('pages/register', { error: 'Username ต้องยาวอย่างน้อย 3 ตัว' });
  }
  if (!password || password.length < 6) {
    return res.render('pages/register', { error: 'Password ต้องยาวอย่างน้อย 6 ตัว' });
  }
  if (password !== confirm) {
    return res.render('pages/register', { error: 'Password ไม่ตรงกัน' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      'INSERT INTO users(username,password) VALUES($1,$2) RETURNING id, username, avatar_path',
      [username, hash]
    );

    const user = rows[0];
    req.session.user = {
      id: user.id,
      username: user.username,
      avatar_path: user.avatar_path || null
    };

    res.redirect('/');
  } catch (err) {
    if (err.code === '23505') {
      return res.render('pages/register', { error: 'Username นี้ถูกใช้แล้ว' });
    }
    console.error('register error:', err);
    res.render('pages/register', { error: 'เกิดข้อผิดพลาด' });
  }
});

// ====================
// POST /logout
// ====================
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
