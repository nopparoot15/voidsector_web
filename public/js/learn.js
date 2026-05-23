(function () {
  const page = document.getElementById('learn-page');
  if (!page) return;
  const langCode = page.dataset.langCode;

  const LEVEL_ORDER = {
    // English CEFR
    A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5,
    // Japanese JLPT (N5=beginner, N1=advanced)
    N5: 0, N4: 1, N3: 2, N2: 3, N1: 4,
    // Chinese HSK
    HSK1: 0, HSK2: 1, HSK3: 2, HSK4: 3, HSK5: 4, HSK6: 5,
  };

  const LEVEL_DESC = {
    A1: 'ผู้เริ่มต้น', A2: 'ขั้นต้น', B1: 'ระดับกลาง', B2: 'ระดับกลางบน', C1: 'ขั้นสูง', C2: 'ขั้นเชี่ยวชาญ',
    N5: 'ผู้เริ่มต้น', N4: 'ขั้นต้น', N3: 'ระดับกลาง', N2: 'ระดับสูง', N1: 'ขั้นเชี่ยวชาญ',
    HSK1: 'ผู้เริ่มต้น', HSK2: 'ขั้นต้น', HSK3: 'ระดับกลาง', HSK4: 'ระดับสูง', HSK5: 'ขั้นสูง', HSK6: 'ขั้นเชี่ยวชาญ',
  };

  async function init() {
    const [unitsRes, langsRes] = await Promise.all([
      fetch(`/api/units/${langCode}`),
      fetch('/api/languages')
    ]);
    const unitsData = await unitsRes.json();
    const units = unitsData.units || unitsData;
    const langs = await langsRes.json();
    const lang = langs.find(l => l.code === langCode) || {};

    document.getElementById('lang-title').textContent = `${lang.flag || ''} ${lang.name || langCode}`;

    const map = document.getElementById('unit-map');
    if (!units.length) { map.innerHTML = '<p class="loading">ยังไม่มีเนื้อหา</p>'; return; }

    // Group by level
    const groups = new Map();
    for (const unit of units) {
      const lv = unit.level || 'ทั่วไป';
      if (!groups.has(lv)) groups.set(lv, []);
      groups.get(lv).push(unit);
    }

    // Sort groups by level order
    const sortedGroups = [...groups.entries()].sort((a, b) => {
      const oa = LEVEL_ORDER[a[0]] ?? 99;
      const ob = LEVEL_ORDER[b[0]] ?? 99;
      return oa - ob;
    });

    map.innerHTML = sortedGroups.map(([level, groupUnits]) => `
      <div class="level-section">
        <div class="level-header">
          <span class="level-badge level-badge--${level.toLowerCase().replace(/\s/g, '')}">${level}</span>
          <span class="level-desc">${LEVEL_DESC[level] || ''}</span>
        </div>
        ${groupUnits.map(unit => `
          <div class="unit-card">
            <div class="unit-header">
              <span class="unit-icon">${unit.icon || '📚'}</span>
              <div>
                <div class="unit-title">${unit.title}</div>
                <div class="unit-desc">${unit.description || ''}</div>
              </div>
            </div>
            <div class="lesson-list">
              ${unit.lessons.map(lesson => lessonItem(lesson)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function lessonItem(lesson) {
    if (lesson.completed) {
      return `<a href="/lesson/${lesson.id}" class="lesson-item completed">
        <span class="lesson-icon">✅</span>
        <span class="lesson-title">${lesson.title}</span>
        <span class="lesson-xp">+${lesson.xp_reward} XP</span>
      </a>`;
    }
    if (lesson.unlocked) {
      return `<a href="/lesson/${lesson.id}" class="lesson-item unlocked">
        <span class="lesson-icon">▶</span>
        <span class="lesson-title">${lesson.title}</span>
        <span class="lesson-xp">+${lesson.xp_reward} XP</span>
      </a>`;
    }
    return `<div class="lesson-item locked">
      <span class="lesson-icon">🔒</span>
      <span class="lesson-title">${lesson.title}</span>
      <span class="lesson-xp">+${lesson.xp_reward} XP</span>
    </div>`;
  }

  init();
})();
