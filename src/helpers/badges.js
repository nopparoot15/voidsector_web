'use strict';
const { pool } = require('../config/db');

const BADGES = [
  { slug: 'first_post',  icon: '📝', name: 'First Post',    desc: 'โพสต์แรก' },
  { slug: 'social_10',   icon: '💬', name: 'Social',        desc: 'โพสต์ 10 ครั้ง' },
  { slug: 'social_50',   icon: '🗣', name: 'Chatterbox',    desc: 'โพสต์ 50 ครั้ง' },
  { slug: 'level_5',     icon: '⭐', name: 'Rising Star',   desc: 'ถึง Level 5' },
  { slug: 'level_10',    icon: '🌟', name: 'Veteran',       desc: 'ถึง Level 10' },
  { slug: 'level_20',    icon: '👑', name: 'Master',        desc: 'ถึง Level 20' },
  { slug: 'streak_7',    icon: '🔥', name: 'Week Streak',   desc: 'Streak 7 วัน' },
  { slug: 'streak_30',   icon: '⚡', name: 'Monthly',       desc: 'Streak 30 วัน' },
  { slug: 'game_winner', icon: '🏆', name: 'Winner',        desc: 'ชนะเกมแรก' },
  { slug: 'friend_5',    icon: '👥', name: 'Connected',     desc: 'มีเพื่อน 5 คน' },
  { slug: 'story_teller',icon: '📖', name: 'Story Teller',  desc: 'โพสต์ Story แรก' },
  { slug: 'early_bird',  icon: '🌅', name: 'Early Bird',    desc: 'สมาชิกยุคแรก' },
];

const BADGE_MAP = Object.fromEntries(BADGES.map(b => [b.slug, b]));

async function awardBadge(userId, slug) {
  if (!BADGE_MAP[slug]) return false;
  try {
    const { rowCount } = await pool.query(
      `INSERT INTO user_achievements(user_id, slug) VALUES($1,$2) ON CONFLICT DO NOTHING`,
      [userId, slug]
    );
    return rowCount > 0;
  } catch { return false; }
}

async function checkAndAward(userId) {
  try {
    const [postRes, xpRes, streakRes, friendRes, storyRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS cnt FROM posts WHERE user_id=$1 AND user_id NOT IN (SELECT id FROM users WHERE username='VoidSector')`, [userId]),
      pool.query(`SELECT xp, streak FROM users WHERE id=$1`, [userId]),
      pool.query(`SELECT COUNT(*)::int AS cnt FROM friendships WHERE user_id=$1`, [userId]),
      pool.query(`SELECT COUNT(*)::int AS cnt FROM stories WHERE user_id=$1`, [userId]),
    ]);
    const posts   = postRes.rows[0]?.cnt || 0;
    const xp      = xpRes.rows[0]?.xp || 0;
    const streak  = xpRes.rows[0]?.streak || 0;
    const friends = friendRes.rows[0]?.cnt || 0;
    const stories = storyRes.rows[0]?.cnt || 0;
    const level   = Math.floor(Math.sqrt(xp / 100)) + 1;

    const toCheck = [];
    if (posts >= 1)  toCheck.push('first_post');
    if (posts >= 10) toCheck.push('social_10');
    if (posts >= 50) toCheck.push('social_50');
    if (level >= 5)  toCheck.push('level_5');
    if (level >= 10) toCheck.push('level_10');
    if (level >= 20) toCheck.push('level_20');
    if (streak >= 7) toCheck.push('streak_7');
    if (streak >= 30)toCheck.push('streak_30');
    if (friends >= 5)toCheck.push('friend_5');
    if (stories >= 1)toCheck.push('story_teller');

    const awarded = [];
    for (const slug of toCheck) {
      const got = await awardBadge(userId, slug);
      if (got) awarded.push(slug);
    }
    return awarded;
  } catch { return []; }
}

async function getUserBadges(userId) {
  const { rows } = await pool.query(
    `SELECT slug, earned_at FROM user_achievements WHERE user_id=$1 ORDER BY earned_at ASC`,
    [userId]
  );
  return rows.map(r => ({ ...BADGE_MAP[r.slug], slug: r.slug, earned_at: r.earned_at })).filter(b => b.icon);
}

module.exports = { BADGES, awardBadge, checkAndAward, getUserBadges };
