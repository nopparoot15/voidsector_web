'use strict';
const express = require('express');
const router = express.Router();
const { requireLogin, requireFullAccount } = require('../middleware/requireLogin');
const { pool } = require('../config/db');

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'VoidSector', loginError: req.query.error || null });
});

router.get('/home', (req, res) => res.redirect(301, '/'));

router.get('/learning', (req, res) => {
  res.render('pages/languages', { title: 'Learning' });
});

router.get('/learning/:cat', (req, res) => {
  res.render('pages/languages', { title: 'Learning' });
});

router.get('/languages', (req, res) => res.redirect(301, '/learning'));
router.get('/languages/:cat', (req, res) => res.redirect(301, '/learning/' + req.params.cat));

const PORTFOLIO_CODE = process.env.PORTFOLIO_CODE || 'salty6ix';

router.get('/portfolio', (req, res) => {
  if (req.session.portfolioUnlocked) return res.render('pages/coding', { title: 'Portfolio' });
  res.render('pages/portfolio-gate', { title: 'Portfolio', error: null });
});

router.post('/portfolio/unlock', (req, res) => {
  if (String(req.body.code || '').trim() === PORTFOLIO_CODE) {
    req.session.portfolioUnlocked = true;
    return res.redirect('/portfolio');
  }
  res.render('pages/portfolio-gate', { title: 'Portfolio', error: 'รหัสไม่ถูกต้อง' });
});

router.get('/coding', (req, res) => res.redirect(301, '/portfolio'));

router.get('/games', (req, res) => {
  res.render('pages/games', { title: 'เกม & Anime' });
});

router.get('/music', (req, res) => {
  res.render('pages/music', { title: 'ดนตรี' });
});

router.get('/login', (req, res) => {
  if (req.session?.user && !req.session.user.isGuest) return res.redirect('/home');
  res.render('pages/login', { title: 'เข้าสู่ระบบ', error: req.query.error || null });
});

router.get('/register', (req, res) => {
  if (req.session?.user && !req.session.user.isGuest) return res.redirect('/home');
  res.render('pages/register', { title: 'สมัครสมาชิก', error: req.query.error || null });
});

router.get('/learn/:langCode', requireFullAccount, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese', math: 'คณิตศาสตร์', py: 'Python', js: 'JavaScript', cs: 'C#' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/learn', { title: 'เรียน ' + names[langCode], langCode });
});

router.get('/placement/:langCode', requireFullAccount, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/placement', { title: 'Placement Test — ' + names[langCode], langCode });
});

router.get('/lesson/:lessonId', requireFullAccount, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const { rows } = await pool.query(
      `SELECT l.id, l.title, lang.code as lang_code
       FROM lessons l
       JOIN units u ON l.unit_id = u.id
       JOIN languages lang ON u.language_id = lang.id
       WHERE l.id = $1`,
      [lessonId]
    );
    if (!rows.length) return res.status(404).render('pages/notfound', { title: '404' });
    const lesson = rows[0];
    res.render('pages/lesson', { title: lesson.title, lessonId, langCode: lesson.lang_code });
  } catch (err) {
    console.error('lesson page error:', err.message);
    res.status(500).render('pages/notfound', { title: 'Error' });
  }
});

router.get('/flashcards/:langCode', requireFullAccount, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/flashcards', { title: 'Flashcard ' + names[langCode], langCode });
});

router.get('/tools', requireFullAccount, (req, res) => {
  res.render('pages/tools', { title: 'Tools' });
});

router.get('/tools/terminal', requireFullAccount, (req, res) => {
  res.render('pages/terminal', { title: 'Terminal' });
});

router.get('/tools/calculator', requireFullAccount, (req, res) => {
  res.render('pages/calculator', { title: 'Calculator' });
});

router.get('/tools/codeeditor', requireFullAccount, (req, res) => {
  res.render('pages/codeeditor', { title: 'Code Editor' });
});

router.get('/leaderboard', requireFullAccount, (req, res) => {
  res.render('pages/leaderboard', { title: 'Leaderboard' });
});

router.get('/user/:username', requireFullAccount, async (req, res) => {
  try {
    const me = req.session.user.id;
    const { rows: [target] } = await pool.query(
      'SELECT id, username, xp, streak, avatar, cover FROM users WHERE LOWER(username)=LOWER($1)',
      [req.params.username]
    );
    if (!target) return res.status(404).render('pages/notfound', { title: '404' });
    if (target.id === me) return res.redirect('/profile');

    const { rows: [{ count }] } = await pool.query(
      'SELECT COUNT(*) FROM user_lesson_progress WHERE user_id=$1', [target.id]
    );
    const { rows: [friendRow] } = await pool.query(
      'SELECT 1 FROM friendships WHERE user_id=$1 AND friend_user_id=$2', [me, target.id]
    );
    const { rows: [reqRow] } = await pool.query(
      `SELECT status FROM friend_requests
       WHERE from_user_id=$1 AND to_user_id=$2 AND status='pending'`, [me, target.id]
    );
    const level = Math.floor(Math.sqrt((target.xp || 0) / 100)) + 1;
    res.render('pages/user-profile', {
      title: target.username,
      target,
      level,
      completedCount: parseInt(count),
      isFriend: !!friendRow,
      requestSent: !!reqRow,
    });
  } catch (e) {
    console.error('user profile error:', e.message);
    res.redirect('/');
  }
});

router.get('/profile', requireFullAccount, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { rows: [userData] } = await pool.query(
      'SELECT id, username, email, xp, streak, avatar, cover, created_at FROM users WHERE id=$1',
      [userId]
    );
    const { rows: [countRow] } = await pool.query(
      'SELECT COUNT(*) FROM user_lesson_progress WHERE user_id=$1',
      [userId]
    );
    const completedCount = parseInt(countRow.count);
    const level = Math.floor(Math.sqrt((userData.xp || 0) / 100)) + 1;
    res.render('pages/profile', { title: 'โปรไฟล์', userData, completedCount, level });
  } catch (err) {
    console.error('profile error:', err.message);
    res.redirect('/home');
  }
});

module.exports = router;
