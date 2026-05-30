(() => {
  const me = window.__USER__;
  const roomId = window.__ROOM_ID__;
  if (!me || !roomId) return;

  const gameType = location.pathname.split('/')[2]; // /arcade/{gameType}/{roomId}
  const wrap = document.getElementById('gm-invite-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <button class="gm-invite-btn" id="gm-invite-open-btn">👥 เชิญเพื่อน</button>
    <div class="gm-invite-panel hidden" id="gm-invite-panel">
      <div class="gm-invite-panel-header">เชิญเพื่อนเข้าห้อง</div>
      <div class="gm-invite-list" id="gm-invite-list"><div class="gm-invite-empty">กำลังโหลด...</div></div>
    </div>
  `;

  const openBtn = document.getElementById('gm-invite-open-btn');
  const panel = document.getElementById('gm-invite-panel');
  const list = document.getElementById('gm-invite-list');

  openBtn.addEventListener('click', () => {
    const isOpen = !panel.classList.contains('hidden');
    if (isOpen) {
      panel.classList.add('hidden');
    } else {
      panel.classList.remove('hidden');
      loadFriends();
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) panel.classList.add('hidden');
  });

  async function loadFriends() {
    list.innerHTML = '<div class="gm-invite-empty">กำลังโหลด...</div>';
    try {
      const r = await fetch('/friends/list', { credentials: 'include' });
      const j = await r.json();
      const friends = j.friends || [];
      if (!friends.length) {
        list.innerHTML = '<div class="gm-invite-empty">ยังไม่มีเพื่อน</div>';
        return;
      }
      list.innerHTML = friends.map(f => `
        <div class="gm-invite-row" data-id="${Number(f.id)}">
          <span class="gm-invite-name">${esc(f.username)}</span>
          <button class="gm-invite-send-btn" data-id="${Number(f.id)}" data-name="${esc(f.username)}">เชิญ</button>
        </div>`).join('');
    } catch (_) {
      list.innerHTML = '<div class="gm-invite-empty">โหลดไม่ได้</div>';
    }
  }

  list.addEventListener('click', async (e) => {
    const btn = e.target.closest('.gm-invite-send-btn');
    if (!btn || btn.disabled) return;
    const friendId = Number(btn.dataset.id);
    btn.disabled = true;
    btn.textContent = '...';
    try {
      const r = await fetch('/api/games/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendId, roomId, gameType })
      });
      const j = await r.json();
      if (j.ok) {
        btn.textContent = '✓ ส่งแล้ว';
        btn.classList.add('sent');
      } else {
        btn.disabled = false;
        btn.textContent = 'เชิญ';
      }
    } catch (_) {
      btn.disabled = false;
      btn.textContent = 'เชิญ';
    }
  });

})();
