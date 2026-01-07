// src/routes/pages.js
const express = require('express');
const router = express.Router();

const catalog = [
  { key: 'english', title: 'English Basic Course', desc: 'คอร์สอังกฤษพื้นฐาน + แบบทดสอบ', icon: '🇬🇧' },
  { key: 'coding', title: 'Python Master Class', desc: 'ทบทวน Python Phase 1-2 พร้อม quiz', icon: '🐍' }
];

// Map course -> category (future-proof)
const courseCategory = {
  english: 'language',
  coding: 'coding',
};

// ------------------------------------------------------
// Landing gate: must login/register before entering the app
// ------------------------------------------------------
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.render('pages/landing');
  }

  // After login, Home is a Tool Hub (Cyber Portal)
  res.render('pages/home', { catalog });
});

// From here on, all pages require login
router.use((req, res, next) => {
  if (!req.session.user) return res.redirect('/');
  next();
});

// Learn Hub: choose category before entering /learn
router.get('/learn/categories', (req, res) => {
  res.render('pages/learn-categories');
});

router.get('/learn', (req, res) => {
  const cat = (req.query.cat || '').toString();
  const filtered = (cat && cat !== 'all')
    ? catalog.filter(c => courseCategory[c.key] === cat)
    : catalog;
  res.render('pages/learn', { catalog: filtered, selectedCat: cat });
});

router.get('/python-playground', (req, res) => {
  // Back-compat: Python Playground moved under /compiler
  res.redirect('/compiler');
});

// Compiler (OneCompiler embed)
router.get('/compiler', (req, res) => {
  res.render('pages/compiler');
});

router.get('/terminal', (req, res) => {
  res.render('pages/terminal');
});

router.get('/calculator', (req, res) => {
  res.render('pages/calculator');
});

// Leaderboard (quiz rankings)
router.get('/leaderboard', (req, res) => {
  res.render('pages/leaderboard');
});

router.get('/course/:category', (req, res) => {
  const category = req.params.category;
  const item = catalog.find(c => c.key === category);

  if (!item) {
    return res.status(404).render('pages/notfound');
  }

  res.render('pages/course', { category, item });
});

module.exports = router;
