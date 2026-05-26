'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/db');

async function updateStreak(userId, currentStreak, lastStreakDate) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = currentStreak || 0;

  if (!lastStreakDate) {
    newStreak = 1;
  } else {
    const last = typeof lastStreakDate === 'string'
      ? lastStreakDate
      : lastStreakDate.toISOString().split('T')[0];
    if (last === today) {
      // already updated today
    } else if (last === yesterday) {
      newStreak = (currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }
  }

  await pool.query(
    'UPDATE users SET streak=$1, last_streak_date=$2 WHERE id=$3',
    [newStreak, today, userId]
  );
  return newStreak;
}

async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.redirect('/register?error=' + encodeURIComponent('กรอกข้อมูลให้ครบ'));
  }
  if (password.length < 6) {
    return res.redirect('/register?error=' + encodeURIComponent('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'));
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const today = new Date().toISOString().split('T')[0];
    const { rows: [user] } = await pool.query(
      'INSERT INTO users (username, email, password_hash, streak, last_streak_date) VALUES ($1,$2,$3,1,$4) RETURNING id, username, xp, streak',
      [username.trim(), email.trim().toLowerCase(), password_hash, today]
    );
    req.session.user = { id: user.id, username: user.username, xp: 0, streak: 1 };
    return res.redirect('/home');
  } catch (err) {
    const msg = err.code === '23505' ? 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้ไปแล้ว' : 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    return res.redirect('/register?error=' + encodeURIComponent(msg));
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const back = (req.body.back || '').startsWith('/') ? req.body.back : null;
  const errRedirect = (msg) => res.redirect((back || '/login') + '?error=' + encodeURIComponent(msg));

  if (!email || !password) return errRedirect('กรอกข้อมูลให้ครบ');
  try {
    const identifier = email.trim().toLowerCase();
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1 OR LOWER(username)=$1',
      [identifier]
    );
    if (!rows.length) return errRedirect('ไม่พบบัญชีผู้ใช้นี้');
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return errRedirect('รหัสผ่านไม่ถูกต้อง');

    const newStreak = await updateStreak(user.id, user.streak, user.last_streak_date);

    req.session.user = {
      id: user.id,
      username: user.username,
      xp: user.xp,
      streak: newStreak,
      avatar: user.avatar || null,
    };
    return res.redirect('/home');
  } catch (err) {
    console.error('login error:', err.message);
    return res.redirect('/login?error=' + encodeURIComponent('เกิดข้อผิดพลาด'));
  }
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/'));
}

async function forgotPassword(req, res) {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) return res.render('pages/forgot-password', { title: 'ลืมรหัสผ่าน', error: 'กรุณากรอกอีเมล', resetUrl: null });

  const { rows } = await pool.query('SELECT id FROM users WHERE LOWER(email)=$1', [email]);
  if (!rows.length) {
    // Don't reveal whether email exists — show same success page
    return res.render('pages/forgot-password', { title: 'ลืมรหัสผ่าน', error: null, resetUrl: null, sent: true });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await pool.query(
    `INSERT INTO password_reset_tokens(user_id, token, expires_at) VALUES($1,$2,$3)`,
    [rows[0].id, token, expiresAt]
  );

  const origin = req.protocol + '://' + req.get('host');
  const resetUrl = `${origin}/reset-password?token=${token}`;
  return res.render('pages/forgot-password', { title: 'ลืมรหัสผ่าน', error: null, resetUrl, sent: false });
}

async function resetPassword(req, res) {
  const token = (req.body.token || req.query.token || '').trim();
  const newPassword = (req.body.password || '').trim();

  if (!token) return res.redirect('/forgot-password');

  if (req.method === 'GET') {
    return res.render('pages/reset-password', { title: 'ตั้งรหัสผ่านใหม่', token, error: null });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.render('pages/reset-password', { title: 'ตั้งรหัสผ่านใหม่', token, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
  }

  const { rows } = await pool.query(
    `SELECT * FROM password_reset_tokens WHERE token=$1 AND used=FALSE AND expires_at > NOW()`,
    [token]
  );
  if (!rows.length) {
    return res.render('pages/reset-password', { title: 'ตั้งรหัสผ่านใหม่', token, error: 'ลิงก์หมดอายุหรือถูกใช้ไปแล้ว' });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, rows[0].user_id]);
  await pool.query('UPDATE password_reset_tokens SET used=TRUE WHERE token=$1', [token]);

  return res.redirect('/login?error=' + encodeURIComponent('ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ'));
}

module.exports = { register, login, logout, updateStreak, forgotPassword, resetPassword };
