const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Uses DATABASE_URL (recommended for Render/Heroku/etc)
// Example: postgres://user:pass@host:5432/dbname
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
});

async function initDb() {
  // Apply the full schema from /database/schema.sql
  // This keeps the DB structure in one place and avoids drift between code and SQL.
  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(sql);

  // Lightweight idempotent migrations for environments where tables already exist.
  // (CREATE TABLE IF NOT EXISTS does not add missing columns.)
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_path TEXT;');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();');

  await pool.query('ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS client_msg_id TEXT;');

  // Whiteboard invites (notifications)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS whiteboard_invites (
      id SERIAL PRIMARY KEY,
      room_id TEXT NOT NULL,
      from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_wbi_room_to ON whiteboard_invites(room_id, to_user_id);');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_wbi_to_status_time ON whiteboard_invites(to_user_id, status, created_at DESC);');
}

module.exports = { pool, initDb };
