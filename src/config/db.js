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
}

module.exports = { pool, initDb };
