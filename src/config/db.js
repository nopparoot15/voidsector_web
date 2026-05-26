'use strict';
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDb() {
  const schema = fs.readFileSync(
    path.join(__dirname, '../../database/schema.sql'), 'utf8'
  );

  // Split into individual statements and run each one — avoids multi-statement issues
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    await pool.query(stmt);
  }

  // Migrations for deployments that have an older users table schema
  const migrations = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(200)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(200)`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`,
    `CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email) WHERE email IS NOT NULL`,
    `ALTER TABLE units ADD COLUMN IF NOT EXISTS level VARCHAR(20)`,
    `ALTER TABLE units ADD COLUMN IF NOT EXISTS grammar_note TEXT`,
    `ALTER TABLE units ADD COLUMN IF NOT EXISTS cultural_note TEXT`,
    `ALTER TABLE threads ADD COLUMN IF NOT EXISTS image TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`,
    `ALTER TABLE posts ADD COLUMN IF NOT EXISTS image TEXT`,
    `CREATE TABLE IF NOT EXISTS "session" (
       "sid" varchar NOT NULL COLLATE "default",
       "sess" json NOT NULL,
       "expire" timestamp(6) NOT NULL,
       CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
     )`,
    `CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS cover TEXT`,
    `CREATE TABLE IF NOT EXISTS notifications (
       id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       from_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
       type VARCHAR(30) NOT NULL,
       post_id INTEGER,
       is_read BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read, created_at DESC)`,
    `ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW()`,
    `UPDATE posts SET last_activity_at = created_at WHERE last_activity_at IS NULL`,
    `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS message TEXT`,
    `ALTER TABLE chat_room_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW()`,
    `CREATE TABLE IF NOT EXISTS chat_reads (
       room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       PRIMARY KEY(room_id, user_id)
     )`,
    `ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE`,
    `CREATE TABLE IF NOT EXISTS comment_likes (
       comment_id INTEGER REFERENCES post_comments(id) ON DELETE CASCADE,
       user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
       PRIMARY KEY(comment_id, user_id)
     )`,
    `CREATE TABLE IF NOT EXISTS whiteboard_invites (
       id SERIAL PRIMARY KEY,
       room_id TEXT NOT NULL,
       from_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       to_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       status VARCHAR(20) DEFAULT 'pending',
       created_at TIMESTAMPTZ DEFAULT NOW()
     )`,
    `CREATE INDEX IF NOT EXISTS idx_wb_invites_to ON whiteboard_invites(to_user_id, status)`,
    `UPDATE users SET avatar = NULL WHERE avatar = '/uploads/avatars/default.png'`,
    `ALTER TABLE whiteboard_invites ADD COLUMN IF NOT EXISTS join_url TEXT`,
    `CREATE TABLE IF NOT EXISTS password_reset_tokens (
       id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
       token VARCHAR(64) NOT NULL UNIQUE,
       expires_at TIMESTAMPTZ NOT NULL,
       used BOOLEAN DEFAULT FALSE
     )`,
    `CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens(token)`,
  ];
  for (const m of migrations) {
    await pool.query(m).catch(() => {});
  }

  // Seed welcome post once (idempotent)
  const WELCOME = `🌌 ยินดีต้อนรับสู่ VoidSector!

เว็บนี้ทำมาสำหรับคนที่ชอบเรียน เล่น และแชทในที่เดียว — ไม่ต้องสมัครหลายแพลตฟอร์ม

────────────────────
📚 เรียนภาษา
────────────────────
ไปที่เมนู "เรียน" → เลือกภาษาที่สนใจ → ทำ Placement Test วัดระดับ → เรียนทีละ Lesson พร้อมระบบ Flashcard ช่วยจำคำศัพท์ และดูอันดับของคุณได้ที่ Leaderboard

────────────────────
🛠️ Tools
────────────────────
• Code Editor — เขียนและรันโค้ด Python / JavaScript / C# ได้เลยในเบราว์เซอร์
• Calculator — เครื่องคิดเลขวิทยาศาสตร์
• Terminal

────────────────────
🎮 Arcade — เล่นคนเดียว
────────────────────
2048 · Snake · Memory Match · Breakout

────────────────────
👥 Arcade — Multiplayer
────────────────────
สร้างห้อง → แชร์ลิงก์ให้เพื่อน → เล่นได้เลย

XO · Word Bomb · Trivia · Typing Race
Rock Paper Scissors · Draw & Guess · Spyfall · หมากฮอส

────────────────────
💬 Social
────────────────────
• Feed — โพสต์และแชร์ความคิด
• DM — แชทส่วนตัวกับเพื่อน
• Friends — เพิ่มเพื่อนและดูโปรไฟล์

ลองใช้งานได้เลย — เจอบักหรืออยากแนะนำฟีเจอร์ไหน คอมเมนต์ไว้ได้เลยครับ! 🚀`;
  await pool.query(`
    INSERT INTO posts (user_id, text, created_at, last_activity_at)
    SELECT id, $1, NOW(), NOW() FROM users
    WHERE NOT EXISTS (SELECT 1 FROM posts WHERE text = $1)
    ORDER BY id ASC LIMIT 1
  `, [WELCOME]).catch(() => {});

  console.log('✅ Schema ready');
}

module.exports = { pool, initDb };
