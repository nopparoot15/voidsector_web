'use strict';
const bcrypt = require('bcrypt');
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
  if (!email || !password) {
    return res.redirect('/login?error=' + encodeURIComponent('กรอกข้อมูลให้ครบ'));
  }
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email.trim().toLowerCase()]
    );
    if (!rows.length) {
      return res.redirect('/login?error=' + encodeURIComponent('ไม่พบบัญชีผู้ใช้นี้'));
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.redirect('/login?error=' + encodeURIComponent('รหัสผ่านไม่ถูกต้อง'));
    }

    const newStreak = await updateStreak(user.id, user.streak, user.last_streak_date);

    req.session.user = {
      id: user.id,
      username: user.username,
      xp: user.xp,
      streak: newStreak
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

module.exports = { register, login, logout, updateStreak };
