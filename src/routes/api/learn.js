'use strict';
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/db');
const { requireLogin } = require('../../middleware/requireLogin');
const { updateStreak } = require('../../controllers/authController');

router.get('/languages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM languages ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/units/:langCode', requireLogin, async (req, res) => {
  try {
    const { langCode } = req.params;
    const userId = req.session.user.id;

    const { rows: [language] } = await pool.query(
      'SELECT * FROM languages WHERE code=$1', [langCode]
    );
    if (!language) return res.status(404).json({ error: 'Language not found' });

    const { rows: units } = await pool.query(
      'SELECT * FROM units WHERE language_id=$1 ORDER BY order_num', [language.id]
    );

    const { rows: completedLessons } = await pool.query(
      `SELECT lesson_id FROM user_lesson_progress WHERE user_id=$1`, [userId]
    );
    const completedSet = new Set(completedLessons.map(r => r.lesson_id));

    const result = [];
    for (const unit of units) {
      const { rows: lessons } = await pool.query(
        'SELECT id, order_num, title, xp_reward FROM lessons WHERE unit_id=$1 ORDER BY order_num',
        [unit.id]
      );

      const lessonsWithStatus = lessons.map((lesson, idx) => {
        const completed = completedSet.has(lesson.id);
        let unlocked = false;
        if (unit.order_num === 1 && lesson.order_num === 1) {
          unlocked = true;
        } else if (idx === 0) {
          // first lesson of non-first unit: check if previous unit's last lesson is completed
          unlocked = true; // simplified: allow access to first lesson of each unit
        } else {
          const prevLesson = lessons[idx - 1];
          unlocked = completedSet.has(prevLesson.id);
        }
        return { ...lesson, completed, unlocked };
      });

      result.push({ ...unit, lessons: lessonsWithStatus });
    }

    res.json({ language, units: result });
  } catch (err) {
    console.error('units error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/lesson/:lessonId', requireLogin, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const { rows: [lesson] } = await pool.query(
      'SELECT * FROM lessons WHERE id=$1', [lessonId]
    );
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const { rows: exercises } = await pool.query(
      'SELECT * FROM exercises WHERE lesson_id=$1 ORDER BY order_num', [lessonId]
    );

    // Fisher-Yates shuffle
    for (let i = exercises.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [exercises[i], exercises[j]] = [exercises[j], exercises[i]];
    }

    res.json({ lesson, exercises });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/lesson/:lessonId/complete', requireLogin, async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const { score, total } = req.body;
    const userId = req.session.user.id;

    const { rows: [lesson] } = await pool.query(
      'SELECT xp_reward FROM lessons WHERE id=$1', [lessonId]
    );
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const safeScore = Math.max(0, Math.min(Number(score) || 0, Number(total) || 1));
    const safeTotal = Math.max(1, Number(total) || 1);
    const xp_earned = Math.round(lesson.xp_reward * (safeScore / safeTotal));

    await pool.query(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, score, xp_earned)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET score=$3, xp_earned=$4, completed_at=NOW()`,
      [userId, lessonId, safeScore, xp_earned]
    );

    await pool.query('UPDATE users SET xp = xp + $1 WHERE id=$2', [xp_earned, userId]);

    const { rows: [user] } = await pool.query(
      'SELECT xp, streak, last_streak_date FROM users WHERE id=$1', [userId]
    );
    const newStreak = await updateStreak(userId, user.streak, user.last_streak_date);
    const total_xp = user.xp;
    const level = Math.floor(Math.sqrt(total_xp / 100)) + 1;

    req.session.user = { ...req.session.user, xp: total_xp, streak: newStreak };

    res.json({ xp_earned, total_xp, streak: newStreak, level });
  } catch (err) {
    console.error('complete error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
