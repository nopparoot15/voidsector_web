'use strict';
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/requireLogin');
const { pool } = require('../config/db');

router.get('/', (req, res) => {
  res.render('pages/landing', { title: 'VoidSector' });
});

router.get('/home', requireLogin, (req, res) => {
  res.render('pages/home', { title: 'VoidSector' });
});

router.get('/learning', (req, res) => {
  res.render('pages/languages', { title: 'Learning' });
});

router.get('/learning/:cat', (req, res) => {
  res.render('pages/languages', { title: 'Learning' });
});

router.get('/languages', (req, res) => res.redirect(301, '/learning'));
router.get('/languages/:cat', (req, res) => res.redirect(301, '/learning/' + req.params.cat));

router.get('/portfolio', (req, res) => {
  res.render('pages/coding', { title: 'Portfolio' });
});

router.get('/coding', (req, res) => res.redirect(301, '/portfolio'));

router.get('/games', (req, res) => {
  res.render('pages/games', { title: 'เกม & Anime' });
});

router.get('/music', (req, res) => {
  res.render('pages/music', { title: 'ดนตรี' });
});

router.get('/login', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/home');
  res.render('pages/login', { title: 'เข้าสู่ระบบ', error: req.query.error || null });
});

router.get('/register', (req, res) => {
  if (req.session && req.session.user) return res.redirect('/home');
  res.render('pages/register', { title: 'สมัครสมาชิก', error: req.query.error || null });
});

router.get('/learn/:langCode', requireLogin, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese', math: 'คณิตศาสตร์', py: 'Python', js: 'JavaScript', cs: 'C#' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/learn', { title: 'เรียน ' + names[langCode], langCode });
});

router.get('/placement/:langCode', requireLogin, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/placement', { title: 'Placement Test — ' + names[langCode], langCode });
});

router.get('/lesson/:lessonId', requireLogin, async (req, res) => {
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

router.get('/flashcards/:langCode', requireLogin, (req, res) => {
  const { langCode } = req.params;
  const names = { en: 'English', ja: 'Japanese', zh: 'Chinese' };
  if (!names[langCode]) return res.status(404).render('pages/notfound', { title: '404' });
  res.render('pages/flashcards', { title: 'Flashcard ' + names[langCode], langCode });
});

router.get('/tools', requireLogin, (req, res) => {
  res.render('pages/tools', { title: 'Tools' });
});

router.get('/tools/terminal', requireLogin, (req, res) => {
  res.render('pages/terminal', { title: 'Terminal' });
});

router.get('/tools/calculator', requireLogin, (req, res) => {
  res.render('pages/calculator', { title: 'Calculator' });
});

router.get('/tools/codeeditor', requireLogin, (req, res) => {
  res.render('pages/codeeditor', { title: 'Code Editor' });
});

router.get('/leaderboard', requireLogin, (req, res) => {
  res.render('pages/leaderboard', { title: 'Leaderboard' });
});

router.get('/profile', requireLogin, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { rows: [userData] } = await pool.query(
      'SELECT id, username, email, xp, streak, created_at FROM users WHERE id=$1',
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
