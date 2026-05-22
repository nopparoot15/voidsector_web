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
  await pool.query(schema);

  // Migrations: add columns that may not exist in older deployments
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(200) UNIQUE`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date DATE`);

  console.log('✅ Schema ready');
}

module.exports = { pool, initDb };
