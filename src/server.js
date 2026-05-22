'use strict';
require('dotenv').config();
const { createApp } = require('./app');
const { pool, initDb } = require('./config/db');
const { seedAll } = require('../data/seed');

const app = createApp();
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
    await initDb();
    await seedAll(pool);
  } catch (e) {
    console.error('❌ DB init failed:', e.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`✅ LinguaVoid running on http://localhost:${PORT}`));
})();
