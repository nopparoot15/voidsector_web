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
  ];
  for (const m of migrations) {
    await pool.query(m).catch(() => {});
  }

  console.log('✅ Schema ready');
}

module.exports = { pool, initDb };
