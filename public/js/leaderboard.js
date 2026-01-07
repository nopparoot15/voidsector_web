(function () {
  const body = document.getElementById('lbBody');
  const empty = document.getElementById('lbEmpty');
  const refreshBtn = document.getElementById('lbRefresh');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fmtDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return '-';
    return d.toLocaleString();
  }

  async function load() {
    if (!body) return;
    body.innerHTML = '';
    if (empty) empty.style.display = 'none';

    try {
      const res = await fetch('/api/quiz/leaderboard?limit=50', { credentials: 'include' });
      const json = await res.json();
      if (!json.success) throw new Error(json.msg || 'failed');

      const list = json.leaderboard || [];
      if (!list.length) {
        if (empty) empty.style.display = 'block';
        return;
      }

      for (const r of list) {
        const tr = document.createElement('tr');
        tr.className = 'lb-row' + (r.isMe ? ' lb-me' : '');
        tr.innerHTML = `
          <td class="mono">${r.rank}</td>
          <td>${esc(r.username)}${r.isMe ? ' <span class="muted">(you)</span>' : ''}</td>
          <td class="mono">${r.totalScore} / ${r.totalPossible}</td>
          <td class="mono">${r.percent}%</td>
          <td class="mono" style="text-align:right;">${fmtDate(r.lastQuizAt)}</td>
        `;
        body.appendChild(tr);
      }
    } catch (e) {
      console.error(e);
      if (empty) {
        empty.style.display = 'block';
        empty.textContent = 'โหลด leaderboard ไม่สำเร็จ (ลองรีเฟรชอีกครั้ง)';
      }
    }
  }

  if (refreshBtn) refreshBtn.addEventListener('click', load);
  load();
})();
