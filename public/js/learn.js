(function () {
  const page = document.getElementById('learn-page');
  if (!page) return;
  const langCode = page.dataset.langCode;

  const LEVEL_ORDER = {
    A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5,
    N5: 0, N4: 1, N3: 2, N2: 3, N1: 4,
    HSK1: 0, HSK2: 1, HSK3: 2, HSK4: 3, HSK5: 4, HSK6: 5,
  };

  const LEVEL_DESC = {
    A1: 'ผู้เริ่มต้น', A2: 'ขั้นต้น', B1: 'ระดับกลาง', B2: 'ระดับกลางบน', C1: 'ขั้นสูง', C2: 'ขั้นเชี่ยวชาญ',
    N5: 'ผู้เริ่มต้น', N4: 'ขั้นต้น', N3: 'ระดับกลาง', N2: 'ระดับสูง', N1: 'ขั้นเชี่ยวชาญ',
    HSK1: 'ผู้เริ่มต้น', HSK2: 'ขั้นต้น', HSK3: 'ระดับกลาง', HSK4: 'ระดับสูง', HSK5: 'ขั้นสูง', HSK6: 'ขั้นเชี่ยวชาญ',
  };

  async function init() {
    const [unitsRes, langsRes] = await Promise.all([
      fetch('/api/units/' + langCode),
      fetch('/api/languages')
    ]);
    const unitsData = await unitsRes.json();
    const units = unitsData.units || unitsData;
    const langs = await langsRes.json();
    const lang = langs.find(function (l) { return l.code === langCode; }) || {};

    document.getElementById('lang-title').textContent = (lang.flag || '') + ' ' + (lang.name || langCode);

    const map = document.getElementById('unit-map');
    if (!units.length) { map.innerHTML = '<p class="loading">ยังไม่มีเนื้อหา</p>'; return; }

    // Group by level
    var groups = {};
    var groupOrder = [];
    for (var i = 0; i < units.length; i++) {
      var lv = units[i].level || 'ทั่วไป';
      if (!groups[lv]) { groups[lv] = []; groupOrder.push(lv); }
      groups[lv].push(units[i]);
    }

    // Sort groups
    groupOrder.sort(function (a, b) {
      return (LEVEL_ORDER[a] !== undefined ? LEVEL_ORDER[a] : 99) -
             (LEVEL_ORDER[b] !== undefined ? LEVEL_ORDER[b] : 99);
    });

    var recommended = '';
    try { recommended = localStorage.getItem('vs_placement_' + langCode) || ''; } catch (e) {}

    var html = '';
    for (var gi = 0; gi < groupOrder.length; gi++) {
      var level = groupOrder[gi];
      var groupUnits = groups[level];
      var isRec = recommended && recommended === level;
      var levelSlug = level.toLowerCase().replace(/\s/g, '');

      html += '<div class="level-section' + (isRec ? ' level-section--recommended' : '') + '" id="level-' + level + '">';
      html += '<div class="level-header">';
      html += '<span class="level-badge level-badge--' + levelSlug + '">' + level + '</span>';
      html += '<span class="level-desc">' + (LEVEL_DESC[level] || '') + '</span>';
      if (isRec) html += '<span class="level-recommended-tag">⭐ ระดับแนะนำสำหรับคุณ</span>';
      html += '</div>';

      for (var ui = 0; ui < groupUnits.length; ui++) {
        var unit = groupUnits[ui];
        html += '<div class="unit-card">';
        html += '<div class="unit-header">';
        html += '<span class="unit-icon">' + (unit.icon || '📚') + '</span>';
        html += '<div>';
        html += '<div class="unit-title">' + unit.title + '</div>';
        html += '<div class="unit-desc">' + (unit.description || '') + '</div>';
        html += '</div></div>';
        var total = unit.lessons.length;
        var done  = unit.lessons.filter(function(l){ return l.completed; }).length;
        var pct   = total > 0 ? Math.round((done / total) * 100) : 0;
        var pctClass = pct === 100 ? 'done' : pct > 0 ? 'wip' : 'none';
        html += '<div class="unit-progress">';
        html += '<div class="unit-progress-bar"><div class="unit-progress-fill" style="width:' + pct + '%"></div></div>';
        html += '<span class="unit-progress-text">' + done + '/' + total + '</span>';
        html += '<span class="unit-progress-pct ' + pctClass + '">' + pct + '%</span>';
        html += '</div>';
        html += '<div class="lesson-list">';
        for (var li = 0; li < unit.lessons.length; li++) {
          html += lessonItem(unit.lessons[li]);
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
    map.innerHTML = html;

    // Scroll to recommended level
    if (recommended) {
      var el = document.getElementById('level-' + recommended);
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    }
  }

  function lessonItem(lesson) {
    if (lesson.completed) {
      return '<a href="/lesson/' + lesson.id + '" class="lesson-item completed">' +
        '<span class="lesson-icon">✅</span>' +
        '<span class="lesson-title">' + lesson.title + '</span>' +
        '<span class="lesson-xp">+' + lesson.xp_reward + ' XP</span></a>';
    }
    if (lesson.unlocked) {
      return '<a href="/lesson/' + lesson.id + '" class="lesson-item unlocked">' +
        '<span class="lesson-icon">▶</span>' +
        '<span class="lesson-title">' + lesson.title + '</span>' +
        '<span class="lesson-xp">+' + lesson.xp_reward + ' XP</span></a>';
    }
    return '<div class="lesson-item locked">' +
      '<span class="lesson-icon">🔒</span>' +
      '<span class="lesson-title">' + lesson.title + '</span>' +
      '<span class="lesson-xp">+' + lesson.xp_reward + ' XP</span></div>';
  }

  init();
})();
