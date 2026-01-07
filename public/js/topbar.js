
// === VOIDSECTOR: DM dropdown ordering ===
function vsParseTs(x){
  if(!x) return 0;
  if(typeof x === 'number') return x;
  const t = Date.parse(x);
  return Number.isFinite(t) ? t : 0;
}
function vsSortDmItems(container){
  if(!container) return;
  const items = Array.from(container.querySelectorAll('[data-dm-item]'));
  items.sort((a,b)=>{
    const ta = vsParseTs(a.getAttribute('data-last-ts')) || 0;
    const tb = vsParseTs(b.getAttribute('data-last-ts')) || 0;
    // newest first
    return tb - ta;
  });
  for(const el of items) container.appendChild(el);
}
function vsBumpDmToTop(container, friendId, ts){
  if(!container || !friendId) return;
  const el = container.querySelector(`[data-dm-item][data-friend-id="${friendId}"]`);
  if(!el) return;
  if(ts) el.setAttribute('data-last-ts', String(vsParseTs(ts)));
  container.prepend(el);
}

// public/js/topbar.js
// VOIDSECTOR Topbar + Notifications
// - Dropdown works WITHOUT JS via <details>/<summary>
// - With JS: close other menus on open, close on outside click/ESC, close buttons
// - Also: fetches /api/notify/summary to update badges + render Messages/Alerts like Facebook

(() => {
  const menus = Array.from(document.querySelectorAll('.vs-menu[data-menu]'));
  if (!menus.length) return;

  const menusByName = new Map(menus.map(m => [m.getAttribute('data-menu') || '', m]));
  const isLoggedIn = !!window.VS_ME;

  const nameOf = (el) => el.getAttribute('data-menu') || '';

  function closeAll(exceptName = null) {
    menus.forEach((m) => {
      if (exceptName && nameOf(m) === exceptName) return;
      m.removeAttribute('open');
    });
  }

  function setBadge(name, value) {
    const el = document.querySelector(`[data-badge="${name}"]`);
    if (!el) return;
    const n = Number(value) || 0;
    el.textContent = String(n);
    if (n > 0) el.removeAttribute('hidden');
    else el.setAttribute('hidden', 'hidden');
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function fmtTime(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now - d) / 1000);
      if (diff < 60) return 'just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
      return d.toLocaleDateString();
    } catch {
      return '';
    }
  }

  // --------------------
  // Progressive enhancement for <details> menus
  // --------------------
  menus.forEach((menu) => {
    menu.addEventListener('toggle', () => {
      const opened = menu.hasAttribute('open');
      const name = nameOf(menu);
      if (opened) {
        closeAll(name);
        // Fetch data when opening dropdowns
        if (name === 'messages' || name === 'notifications') {
          fetchSummary();
        } else if (name === 'friends') {
          // show loading hint immediately
          const list = document.getElementById('vsFriendsList');
          if (list && !list.children.length) {
            list.innerHTML = '<div class="vs-dd__empty">กำลังโหลด...</div>';
          }
          // friends list needs both friend list + dm threads preview
          fetchSummary();
          fetchFriends();
        }
      }
    });
  });

  // Close buttons
  document.querySelectorAll('[data-menu-close],[data-close-menu],[data-dd-close]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const menu = btn.closest('.vs-menu[data-menu]');
      if (!menu) return;
      menu.removeAttribute('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    const inside = e.target.closest('.vs-menu[data-menu]');
    if (!inside) closeAll(null);
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });

  // --------------------
  // Renderers
  // --------------------

  function renderAlerts(friendRequests) {
    const list = document.getElementById('vsNotifList');
    if (!list) return;

    list.innerHTML = '';
    if (!friendRequests || friendRequests.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'vs-dd__empty';
      empty.textContent = 'No notifications yet';
      list.appendChild(empty);
      return;
    }

    friendRequests.forEach((fr) => {
      const item = document.createElement('div');
      item.className = 'vs-dd__item';
      item.dataset.requestId = fr.id;

      item.innerHTML = `
        <div style="flex:1; min-width:0;">
          <div class="vs-dd__itemTitle">👋 Friend request</div>
          <div class="vs-dd__itemMeta"><b>${escapeHtml(fr.username || fr.from_username || 'Unknown')}</b> sent you a request · ${escapeHtml(fmtTime(fr.created_at))}</div>
        </div>
        <div class="vs-dd__actions">
          <button class="vs-dd__act vs-dd__act--ok" type="button" data-action="accept">Accept</button>
          <button class="vs-dd__act vs-dd__act--bad" type="button" data-action="deny">Decline</button>
        </div>
      `;
      list.appendChild(item);
    });
  }


  function renderMessages(threads) {
    const list = document.getElementById('vsMessagesList');
    if (!list) return;

    list.innerHTML = '';
    if (!threads || threads.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'vs-dd__empty';
      empty.textContent = 'ยังไม่มีเพื่อน';
      list.appendChild(empty);
      return;
    }

    threads.forEach((t) => {
      const unread = Number(t.unread_count) || 0;
      const last = (t.last_message || '').trim();
      const lastLine = last ? last.slice(0, 80) : 'Start a conversation';
      const div = document.createElement('div');
      div.className = 'vs-dd__item vs-dd__item--message';
      div.dataset.openChat = 'dm';
      div.setAttribute('data-open-chat','dm');
      div.dataset.friendId = t.friend_id;
      div.dataset.friendName = t.username;
      div.dataset.roomId = t.room_id;
      div.setAttribute('data-friend-id', t.friend_id);
      div.setAttribute('data-friend-name', t.username);
      div.setAttribute('data-room-id', t.room_id);
div.innerHTML = `
        <div class="vs-dd__avatar">${escapeHtml((t.username || '?').slice(0,1).toUpperCase())}</div>
        <div class="vs-dd__msgMain">
          <div class="vs-dd__msgTop">
            <div class="vs-dd__itemTitle">👤 ${escapeHtml(t.username)}</div>
            <div class="vs-dd__time">${escapeHtml(fmtTime(t.last_at))}</div>
          </div>
          <div class="vs-dd__itemMeta">${escapeHtml(lastLine)}</div>
        </div>
        ${unread > 0 ? `<div class="vs-dd__unread">${unread}</div>` : ``}
      `;

      list.appendChild(div);
    });
  }

  // --------------------
  
  // --------------------
  // Friends dropdown
  // --------------------
  let lastFriends = null;

  function renderFriends(friends, dmThreads) {
    const list = document.getElementById('vsFriendsList');
    if (!list) return;

    const dmByUser = new Map();
    (dmThreads || []).forEach(t => {
      // notify API returns friend_id/last_message/last_at
      if (t.friend_id) dmByUser.set(Number(t.friend_id), t);
    });

    list.innerHTML = '';
    if (!friends || friends.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'vs-dd__empty';
      empty.textContent = 'No friends yet';
      list.appendChild(empty);
      return;
    }

    friends.forEach((f) => {
      const div = document.createElement('div');
      div.className = 'vs-dd__item vs-dd__item--click';
      div.tabIndex = 0;
      div.dataset.friendId = f.id;
      div.dataset.friendName = f.username || 'Friend';

      const thread = dmByUser.get(Number(f.id));
      const preview = thread && thread.last_message ? thread.last_message : 'Tap to chat';
      const time = thread && thread.last_at ? fmtTime(thread.last_at) : '';

      div.innerHTML = `
        <div style="flex:1; min-width:0;">
          <div class="vs-dd__itemTitle">${escapeHtml(f.username || 'Friend')}</div>
          <div class="vs-dd__itemMeta">${escapeHtml(preview)} ${time ? '· ' + escapeHtml(time) : ''}</div>
        </div>
        <div class="vs-dd__pill">Chat</div>
      `;
      list.appendChild(div);
    });
  }

  async function fetchFriends() {
    if (!isLoggedIn) return;
    try {
      const r = await fetch('/api/friends/list', { credentials: 'include' });
      const j = await r.json();
      if (j && j.ok) {
        lastFriends = j.friends || [];
        renderFriends(lastFriends, lastSummary ? lastSummary.dm_threads : []);
      }
    } catch (e) {
      // ignore
    }
  }

  async function addFriend(username) {
    const msg = document.getElementById('vsAddFriendMsg');
    const clean = (username || '').trim();
    if (!clean) return;
    if (msg) { msg.className = 'vs-dd__hint'; msg.textContent = 'Sending request…'; }

    try {
      const r = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: clean })
      });
      const j = await r.json();
      if (j && j.ok) {
        if (msg) { msg.className = 'vs-dd__hint is-ok'; msg.textContent = `Request sent to @${clean}`; }
        // refresh alerts badge
        fetchSummary();
      } else {
        if (msg) { msg.className = 'vs-dd__hint is-bad'; msg.textContent = 'Could not send request'; }
      }
    } catch (e) {
      if (msg) { msg.className = 'vs-dd__hint is-bad'; msg.textContent = 'Network error'; }
    }
  }


  // Data: fetch summary + update UI
  // --------------------
  let lastSummary = null;
  let fetching = false;

  async function fetchSummary() {
    if (!isLoggedIn || fetching) return;
    fetching = true;
    try {
      const r = await fetch('/api/notify/summary', { credentials: 'include' });
      const j = await r.json().catch(() => null);
      if (!j || !j.ok) return;

      lastSummary = j;
      window.VS_NOTIFY = j;

      setBadge('notifications', j.counts?.alerts || 0);
      setBadge('messages', j.counts?.messages || 0);

      renderAlerts(j.friend_requests || []);

      // Friends dropdown (list + preview)
      renderFriends(lastFriends || [], j.dm_threads || []);
      // Keep friends fresh
      fetchFriends();
      renderMessages(j.dm_threads || []);
    } catch (e) {
      // ignore
    } finally {
      fetching = false;
    }
  }
  // expose refresh for other modules
  window.VS_REFRESH_NOTIFY = fetchSummary;

  // initial
  fetchSummary();
  // poll (friend requests are not realtime)
  setInterval(fetchSummary, 15000);

  // If socket exists, refresh on new dm
  const hookSocket = () => {
    const s = window.VS_SOCKET || window.socket || null;
    if (!s || typeof s.on !== 'function') return;
    // when DM arrives and you are in the room view
    s.on('dm:new', () => fetchSummary());
    // when DM arrives but you are not in the room view
    s.on('dm:notify', () => fetchSummary());
  };

  // --------------------
  // Actions: Alerts accept/deny, Friends open chat, Add friend
  // --------------------
  const notifList = document.getElementById('vsNotifList');
  if (notifList) {
    notifList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const item = btn.closest('.vs-dd__item');
      const id = item ? item.dataset.requestId : null;
      if (!id) return;

      btn.disabled = true;
      const action = btn.dataset.action;
      try {
        const url = `/api/friends/requests/${encodeURIComponent(id)}/${action === 'accept' ? 'accept' : 'deny'}`;
        await fetch(url, { method: 'POST', credentials: 'include' });
      } catch (_) {}
      fetchSummary();
      fetchFriends();
    });
  }

  const friendsList = document.getElementById('vsFriendsList');
  if (friendsList) {
    friendsList.addEventListener('click', (e) => {
      const item = e.target.closest('.vs-dd__item[data-friend-id]');
      if (!item) return;
      const id = Number(item.dataset.friendId);
      const name = item.dataset.friendName || 'Friend';
      closeAll();
      if (window.VS_CHAT_DOCK && typeof window.VS_CHAT_DOCK.openDm === 'function') {
        window.VS_CHAT_DOCK.openDm(id, name);
      }
    });
  }

  const addBtn = document.getElementById('vsAddFriendBtn');
  const addInput = document.getElementById('vsAddFriendInput');
  if (addBtn && addInput) {
    addBtn.addEventListener('click', () => addFriend(addInput.value));
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addFriend(addInput.value);
      }
    });
  }


  hookSocket();

  // expose minimal API
  window.VS_TOPBAR = {
    closeAll,
    setBadge,
    refresh: fetchSummary,
    getSummary: () => lastSummary
  };
})();
