'use strict';
const en = require('./en');
const ja = require('./ja');
const zh = require('./zh');
const math = require('./math');
const enExtra = require('./en_extra');
const jaExtra = require('./ja_extra');
const zhExtra = require('./zh_extra');
const enExtra2 = require('./en_extra2');
const jaExtra2 = require('./ja_extra2');
const zhExtra2 = require('./zh_extra2');
const enExtra3 = require('./en_extra3');
const jaExtra3 = require('./ja_extra3');
const zhExtra3 = require('./zh_extra3');
const enExtra4 = require('./en_extra4');
const jaExtra4 = require('./ja_extra4');
const zhExtra4 = require('./zh_extra4');

// Merge base units with extra units by combining arrays
function mergedUnits(base, extra) {
  const map = new Map();
  for (const u of base.units) map.set(u.order_num, u);
  for (const u of extra) map.set(u.order_num, u);
  return [...map.values()].sort((a, b) => a.order_num - b.order_num);
}

const langs = [
  { ...en, units: mergedUnits(en, [...enExtra, ...enExtra2, ...enExtra3, ...enExtra4]) },
  { ...ja, units: mergedUnits(ja, [...jaExtra, ...jaExtra2, ...jaExtra3, ...jaExtra4]) },
  { ...zh, units: mergedUnits(zh, [...zhExtra, ...zhExtra2, ...zhExtra3, ...zhExtra4]) },
  math,
];

// Order-num migration: moves units from sequential 1-17 to spaced multiples
// so inserted extra units appear in correct curriculum order.
const ORDER_MAPS = {
  ja: { 1:10,2:30,3:40,4:70,5:90,6:100,7:120,8:130,9:150,10:170,11:20,12:50,13:60,14:110,15:80,16:140,17:160 },
  zh: { 1:10,2:20,3:30,4:50,5:60,6:80,7:90,8:120,9:140,10:150,11:40,12:70,13:100,14:110,15:130 },
  en: { 1:10,2:20,3:40,4:50,5:80,6:90,7:120,8:140,9:150,10:30,11:60,12:70,13:100,14:110,15:130,16:135 }
};

async function migrateUnitOrder(pool, langCode, langId) {
  const map = ORDER_MAPS[langCode];
  if (!map) return;
  // Only run if units still have old sequential numbering (1 exists)
  const { rows } = await pool.query(
    'SELECT 1 FROM units WHERE language_id=$1 AND order_num=1 LIMIT 1', [langId]
  );
  if (rows.length === 0) return;
  console.log(`  ↻ Migrating unit order for ${langCode}...`);
  // Phase 1: shift all old nums +1000 to avoid conflicts
  await pool.query(
    'UPDATE units SET order_num = order_num + 1000 WHERE language_id=$1 AND order_num <= 20', [langId]
  );
  // Phase 2: move from temp to final new nums
  for (const [oldNum, newNum] of Object.entries(map)) {
    await pool.query(
      'UPDATE units SET order_num=$1 WHERE language_id=$2 AND order_num=$3',
      [newNum, langId, parseInt(oldNum) + 1000]
    );
  }
  console.log(`  ✓ Unit order migrated for ${langCode}`);
}

async function seedAll(pool) {
  console.log('🌱 Running idempotent seed...');

  for (const lang of langs) {
    // Upsert language
    const { rows: [language] } = await pool.query(
      `INSERT INTO languages (code, name, native_name, flag)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
      [lang.code, lang.name, lang.native_name, lang.flag]
    );

    await migrateUnitOrder(pool, lang.code, language.id);

    for (const unit of lang.units) {
      // Check if unit already exists by language_id + order_num
      const existing = await pool.query(
        'SELECT id FROM units WHERE language_id=$1 AND order_num=$2',
        [language.id, unit.order_num]
      );
      if (existing.rows.length > 0) {
        const unitId = existing.rows[0].id;
        await pool.query(
          'UPDATE units SET level=$1, grammar_note=$2, cultural_note=$3 WHERE id=$4',
          [unit.level || null, unit.grammar_note || null, unit.cultural_note || null, unitId]
        );
        // Also refresh exercises for existing lessons (keeps lesson IDs stable, user progress safe)
        for (const lesson of unit.lessons) {
          const existingLesson = await pool.query(
            'SELECT id FROM lessons WHERE unit_id=$1 AND order_num=$2',
            [unitId, lesson.order_num]
          );
          if (existingLesson.rows.length > 0) {
            const lessonId = existingLesson.rows[0].id;
            await pool.query('DELETE FROM exercises WHERE lesson_id=$1', [lessonId]);
            for (let i = 0; i < lesson.exercises.length; i++) {
              const ex = lesson.exercises[i];
              await pool.query(
                'INSERT INTO exercises (lesson_id, order_num, type, data) VALUES ($1,$2,$3,$4)',
                [lessonId, i + 1, ex.type, JSON.stringify(ex.data)]
              );
            }
          } else {
            const { rows: [l] } = await pool.query(
              'INSERT INTO lessons (unit_id, order_num, title, xp_reward) VALUES ($1,$2,$3,$4) RETURNING id',
              [unitId, lesson.order_num, lesson.title, lesson.xp_reward || 10]
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
        continue;
      }

      const { rows: [u] } = await pool.query(
        'INSERT INTO units (language_id, order_num, title, description, icon, level, grammar_note, cultural_note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
        [language.id, unit.order_num, unit.title, unit.description || '', unit.icon || '📚', unit.level || null, unit.grammar_note || null, unit.cultural_note || null]
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

    // Seed vocab if not already present for this language
    const { rows: [{ count }] } = await pool.query(
      'SELECT COUNT(*) FROM vocab WHERE language_id=$1', [language.id]
    );
    if (parseInt(count) === 0) {
      for (const v of (lang.vocab || [])) {
        await pool.query(
          `INSERT INTO vocab (language_id, word, reading, translation, example, example_translation, tags)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [language.id, v.word, v.reading || null, v.translation,
           v.example || null, v.example_translation || null, v.tags || []]
        );
      }
    }
  }

  console.log('✅ Seed complete');
}

module.exports = { seedAll };
