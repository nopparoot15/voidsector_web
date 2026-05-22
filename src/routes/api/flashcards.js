'use strict';
const express = require('express');
const router = express.Router();
const { pool } = require('../../config/db');
const { requireLogin } = require('../../middleware/requireLogin');

function sm2(ease_factor, interval_days, repetitions, quality) {
  if (quality < 3) {
    repetitions = 0;
    interval_days = 1;
  } else {
    if (repetitions === 0) interval_days = 1;
    else if (repetitions === 1) interval_days = 6;
    else interval_days = Math.round(interval_days * ease_factor);
    repetitions++;
  }
  ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const next_review = new Date(Date.now() + interval_days * 86400000);
  return { ease_factor, interval_days, repetitions, next_review };
}

router.get('/flashcards/:langCode/review', requireLogin, async (req, res) => {
  try {
    const { langCode } = req.params;
    const userId = req.session.user.id;

    const { rows: [language] } = await pool.query(
      'SELECT id FROM languages WHERE code=$1', [langCode]
    );
    if (!language) return res.status(404).json({ error: 'Language not found' });

    // Check if user has any progress for this language
    const { rows: existingProgress } = await pool.query(
      `SELECT uvp.vocab_id FROM user_vocab_progress uvp
       JOIN vocab v ON uvp.vocab_id = v.id
       WHERE uvp.user_id=$1 AND v.language_id=$2`,
      [userId, language.id]
    );

    if (existingProgress.length === 0) {
      // Initialize: get first 10 vocab items
      const { rows: newVocab } = await pool.query(
        'SELECT id FROM vocab WHERE language_id=$1 ORDER BY id LIMIT 10',
        [language.id]
      );
      for (const v of newVocab) {
        await pool.query(
          `INSERT INTO user_vocab_progress (user_id, vocab_id, next_review)
           VALUES ($1,$2,NOW())
           ON CONFLICT DO NOTHING`,
          [userId, v.id]
        );
      }
    }

    // Get cards due for review
    const { rows } = await pool.query(
      `SELECT v.id AS vocab_id, v.word, v.reading, v.translation, v.example, v.example_translation,
              uvp.ease_factor, uvp.interval_days, uvp.repetitions, uvp.next_review
       FROM user_vocab_progress uvp
       JOIN vocab v ON uvp.vocab_id = v.id
       WHERE uvp.user_id=$1 AND v.language_id=$2 AND uvp.next_review <= NOW()
       ORDER BY uvp.next_review ASC
       LIMIT 20`,
      [userId, language.id]
    );

    res.json(rows);
  } catch (err) {
    console.error('flashcard review error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/flashcards/:vocabId/review', requireLogin, async (req, res) => {
  try {
    const vocabId = parseInt(req.params.vocabId);
    const quality = Math.max(0, Math.min(5, parseInt(req.body.quality) || 0));
    const userId = req.session.user.id;

    const { rows: [existing] } = await pool.query(
      'SELECT * FROM user_vocab_progress WHERE user_id=$1 AND vocab_id=$2',
      [userId, vocabId]
    );

    const current = existing || { ease_factor: 2.5, interval_days: 1, repetitions: 0 };
    const updated = sm2(current.ease_factor, current.interval_days, current.repetitions, quality);

    await pool.query(
      `INSERT INTO user_vocab_progress (user_id, vocab_id, ease_factor, interval_days, repetitions, next_review, last_review)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())
       ON CONFLICT (user_id, vocab_id)
       DO UPDATE SET ease_factor=$3, interval_days=$4, repetitions=$5, next_review=$6, last_review=NOW()`,
      [userId, vocabId, updated.ease_factor, updated.interval_days, updated.repetitions, updated.next_review]
    );

    res.json({ ok: true, interval_days: updated.interval_days, next_review: updated.next_review });
  } catch (err) {
    console.error('flashcard post error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
