'use strict';
const en = require('./en');
const ja = require('./ja');
const zh = require('./zh');

async function seedAll(pool) {
  const { rows } = await pool.query('SELECT COUNT(*) FROM languages');
  if (parseInt(rows[0].count) > 0) {
    console.log('📚 Content already seeded, skipping.');
    return;
  }
  console.log('🌱 Seeding language content...');

  for (const lang of [en, ja, zh]) {
    const { rows: [language] } = await pool.query(
      'INSERT INTO languages (code, name, native_name, flag) VALUES ($1,$2,$3,$4) RETURNING id',
      [lang.code, lang.name, lang.native_name, lang.flag]
    );

    for (const unit of lang.units) {
      const { rows: [u] } = await pool.query(
        'INSERT INTO units (language_id, order_num, title, description, icon) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [language.id, unit.order_num, unit.title, unit.description || '', unit.icon || '📚']
      );

      for (const lesson of unit.lessons) {
        const { rows: [l] } = await pool.query(
          'INSERT INTO lessons (unit_id, order_num, title, xp_reward) VALUES ($1,$2,$3,$4) RETURNING id',
          [u.id, lesson.order_num, lesson.title, lesson.xp_reward || 10]
        );

        for (let i = 0; i < lesson.exercises.length; i++) {
          const ex = lesson.exercises[i];
          await pool.query(
            'INSERT INTO exercises (lesson_id, order_num, type, data) VALUES ($1,$2,$3,$4)',
            [l.id, i + 1, ex.type, JSON.stringify(ex.data)]
          );
        }
      }
    }

    for (const v of (lang.vocab || [])) {
      await pool.query(
        `INSERT INTO vocab (language_id, word, reading, translation, example, example_translation, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [language.id, v.word, v.reading || null, v.translation,
         v.example || null, v.example_translation || null, v.tags || []]
      );
    }
  }

  console.log('✅ Seed complete');
}

module.exports = { seedAll };
