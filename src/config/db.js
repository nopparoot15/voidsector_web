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
  ];
  for (const m of migrations) {
    await pool.query(m).catch(() => {});
  }

  console.log('✅ Schema ready');
}

module.exports = { pool, initDb };
