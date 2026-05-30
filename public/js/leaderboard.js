(function () {
  const podium  = document.getElementById('lbPodium');
  const body    = document.getElementById('lbBody');
  const empty   = document.getElementById('lbEmpty');
  const refresh = document.getElementById('lbRefresh');

  function medal(rank) {
    return rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : String(rank);
  }

  async function load() {
    if (body) body.innerHTML = '';
    if (podium) podium.innerHTML = '';
    if (empty) empty.style.display = 'none';

    try {
      const res  = await fetch('/api/leaderboard', { credentials: 'include' });
      const json = await res.json();
      if (!json.success) throw new Error(json.msg);

      const list = json.board || [];
      if (!list.length) { if (empty) empty.style.display = 'block'; return; }

      // Podium — top 3
      const top3 = list.slice(0, 3);
      const order = [1, 0, 2]; // 2nd, 1st, 3rd
      if (podium) {
        podium.innerHTML = order.filter(i => top3[i]).map(i => {
          const r = top3[i];
          return `<div class="podium-slot rank-${r.rank}${r.isMe ? ' podium-me' : ''}">
            <div class="podium-medal">${medal(r.rank)}</div>
            <div class="podium-name">${esc(r.username)}${r.isMe ? ' <span class="lb-you">YOU</span>' : ''}</div>
            <div class="podium-xp">${r.xp.toLocaleString()} XP</div>
            <div class="podium-base rank-${r.rank}-base"></div>
          </div>`;
        }).join('');
      }

      // Full table
      if (body) {
        body.innerHTML = list.map(r => `
          <tr class="${r.isMe ? 'lb-row-me' : ''}">
            <td class="lb-rank">${medal(r.rank)}</td>
            <td class="lb-username">${esc(r.username)}${r.isMe ? ' <span class="lb-you">YOU</span>' : ''}</td>
            <td class="lb-xp">${r.xp.toLocaleString()}</td>
            <td class="lb-streak">${r.streak > 0 ? r.streak + ' 🔥' : '—'}</td>
            <td class="lb-lessons">${r.lessons}</td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error(e);
      if (empty) { empty.style.display = 'block'; empty.textContent = 'โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชอีกครั้ง'; }
    }
  }

  if (refresh) refresh.addEventListener('click', load);
  load();
})();
