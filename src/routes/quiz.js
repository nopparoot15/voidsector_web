// src/routes/quiz.js
// Leaderboard + quiz score submission (latest attempt per quiz)

const express = require('express');
const { pool } = require('../config/db');
const { requireLogin } = require('../middleware/requireLogin');

const router = express.Router();

function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

// POST /api/quiz/submit
// body: { category, episodeIdx, score, total }
router.post('/quiz/submit', requireLogin, async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const category = String(req.body.category || '').trim();
    const episodeIdx = toInt(req.body.episodeIdx);
    const score = toInt(req.body.score);
    const total = toInt(req.body.total);

    if (!userId) return res.status(401).json({ success: false, msg: 'unauthorized' });
    if (!category) return res.status(400).json({ success: false, msg: 'missing_category' });
    if (!Number.isInteger(episodeIdx) || episodeIdx < 0) return res.status(400).json({ success: false, msg: 'bad_episode' });
    if (!Number.isInteger(score) || score < 0) return res.status(400).json({ success: false, msg: 'bad_score' });
    if (!Number.isInteger(total) || total <= 0) return res.status(400).json({ success: false, msg: 'bad_total' });
    if (score > total) return res.status(400).json({ success: false, msg: 'score_gt_total' });

    const quizKey = `${category}:${episodeIdx}`;

    await pool.query(
      `INSERT INTO quiz_latest (user_id, quiz_key, category, episode_idx, score, total, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6, NOW())
       ON CONFLICT (user_id, quiz_key)
       DO UPDATE SET score=EXCLUDED.score, total=EXCLUDED.total, updated_at=NOW(), category=EXCLUDED.category, episode_idx=EXCLUDED.episode_idx`,
      [userId, quizKey, category, episodeIdx, score, total]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('quiz/submit error:', err);
    return res.status(500).json({ success: false, msg: 'server_error' });
  }
});

// GET /api/quiz/leaderboard
// returns aggregated totals per user based on latest attempt per quiz
router.get('/quiz/leaderboard', requireLogin, async (req, res) => {
  try {
    const limit = Math.max(5, Math.min(100, toInt(req.query.limit) || 25));
    const { rows } = await pool.query(
      `SELECT u.id AS user_id,
              u.username,
              COALESCE(SUM(q.score),0)::INT AS total_score,
              COALESCE(SUM(q.total),0)::INT AS total_possible,
              MAX(q.updated_at) AS last_quiz_at
       FROM quiz_latest q
       JOIN users u ON u.id = q.user_id
       GROUP BY u.id, u.username
       ORDER BY total_score DESC, last_quiz_at DESC
       LIMIT $1`,
      [limit]
    );

    const meId = req.session.user?.id;
    const leaderboard = rows.map((r, i) => ({
      rank: i + 1,
      userId: r.user_id,
      username: r.username,
      totalScore: r.total_score,
      totalPossible: r.total_possible,
      percent: r.total_possible > 0 ? Math.round((r.total_score / r.total_possible) * 1000) / 10 : 0,
      lastQuizAt: r.last_quiz_at,
      isMe: meId && Number(meId) === Number(r.user_id),
    }));

    return res.json({ success: true, leaderboard });
  } catch (err) {
    console.error('quiz/leaderboard error:', err);
    return res.status(500).json({ success: false, msg: 'server_error' });
  }
});

module.exports = router;
