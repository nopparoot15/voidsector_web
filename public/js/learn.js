(function () {
  const page = document.getElementById('learn-page');
  if (!page) return;
  const langCode = page.dataset.langCode;

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

    map.innerHTML = units.map(unit => `
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
