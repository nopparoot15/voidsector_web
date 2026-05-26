
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

  const menusByName = new Map(menus.map(m => [m.getAttribute('data-menu') || '', m]));
  const isLoggedIn = !!window.VS_ME;

  // --------------------
  // Lightweight cyber toast (for realtime invites etc.)
  // --------------------
  function showToast(message, opts = {}) {
    const text = String(message || '').trim();
    if (!text) return;

    const wrapId = 'vsToastWrap';
    let wrap = document.getElementById(wrapId);
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = wrapId;
      wrap.className = 'vs-toast-wrap';
      document.body.appendChild(wrap);
    }

    const toast = document.createElement('div');
    toast.className = 'vs-toast' + (opts.href ? ' vs-toast--clickable' : '');

    if (opts.href) {
      toast.addEventListener('click', (e) => {
        if (e.target.closest('.vs-toast__close')) return;
        window.location.href = opts.href;
      });
    }

    const msg = document.createElement('div');
    msg.className = 'vs-toast__msg';
    msg.textContent = text;
    toast.appendChild(msg);

    if (opts.actionText && typeof opts.onAction === 'function') {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vs-toast__btn';
      btn.textContent = String(opts.actionText);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        try { opts.onAction(); } catch (_) {}
        toast.remove();
      });
      toast.appendChild(btn);
    }

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'vs-toast__close';
    close.textContent = '✕';
    close.addEventListener('click', (e) => { e.stopPropagation(); toast.remove(); });
    toast.appendChild(close);

    wrap.appendChild(toast);
    const ttl = Math.max(1500, Math.min(15000, Number(opts.ttlMs) || 6000));
    setTimeout(() => { try { toast.remove(); } catch (_) {} }, ttl);
  }

  const nameOf = (el) => el.getAttribute('data-menu') || '';

  // --------------------
  // Watch Party invites (client-side, realtime)
  // - Summary API doesn't include these, so we keep a small local queue.
  // - Rendered inside topbar "Notifications" dropdown.
  // --------------------
  const WP_INV_KEY = 'vs_wp_invites_v1';
  function loadWpInvites(){
    try{
      const raw = sessionStorage.getItem(WP_INV_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    }catch(_){
      return [];
    }
  }
  function saveWpInvites(arr){
    try{ sessionStorage.setItem(WP_INV_KEY, JSON.stringify(arr || [])); }catch(_){ }
  }
  let wpInvitesLocal = loadWpInvites();
  function pushWpInvite(inv){
    if(!inv) return;
    const roomId = String(inv.roomId || '');
    const fromUserId = String(inv.from_user_id || '');
    if(!roomId) return;
    // dedupe (same room + same inviter)
    const key = `${roomId}::${fromUserId}`;
    wpInvitesLocal = (wpInvitesLocal || []).filter(x => `${x.roomId}::${x.from_user_id||''}` !== key);
    wpInvitesLocal.unshift({
      roomId,
      from_user_id: inv.from_user_id || null,
      from_username: String(inv.from_username || 'Someone'),
      created_at: inv.at || new Date().toISOString(),
    });
    // cap
    if (wpInvitesLocal.length > 20) wpInvitesLocal = wpInvitesLocal.slice(0, 20);
    saveWpInvites(wpInvitesLocal);
  }
  function removeWpInvite(roomId, fromUserId){
    const rid = String(roomId || '');
    const fid = String(fromUserId || '');
    if(!rid) return;
    wpInvitesLocal = (wpInvitesLocal || []).filter(x => {
      if (String(x.roomId||'') !== rid) return true;
      if (fid && String(x.from_user_id||'') !== fid) return true;
      // same room (and same inviter if present) => remove
      return false;
    });
    saveWpInvites(wpInvitesLocal);
  }

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

  function renderAlerts(friendRequests, wbInvites, wpInvites) {
    const list = document.getElementById('vsNotifList');
    if (!list) return;

    list.innerHTML = '';
    const frList = Array.isArray(friendRequests) ? friendRequests : [];
    const wbList = Array.isArray(wbInvites) ? wbInvites : [];
    const wpList = Array.isArray(wpInvites) ? wpInvites : [];
    if (frList.length === 0 && wbList.length === 0 && wpList.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'vs-dd__empty';
      empty.textContent = 'No notifications yet';
      list.appendChild(empty);
      return;
    }

    // Watch Party invites (show first)
    wpList.forEach((inv) => {
      const item = document.createElement('div');
      item.className = 'vs-dd__item';
      item.dataset.wpRoomId = inv.roomId || inv.room_id || '';
      item.dataset.wpFromUserId = String(inv.from_user_id || '');

      const fromName = inv.from_username || inv.username || 'Unknown';
      const createdAt = inv.created_at || inv.at || '';

      item.innerHTML = `
        <div style="flex:1; min-width:0;">
          <div class="vs-dd__itemTitle">📺 Watch Party invite</div>
          <div class="vs-dd__itemMeta"><b>${escapeHtml(fromName)}</b> invited you · ${escapeHtml(fmtTime(createdAt))}</div>
        </div>
        <div class="vs-dd__actions">
          <button class="vs-dd__act vs-dd__act--ok" type="button" data-action="wp-join">Join</button>
          <button class="vs-dd__act vs-dd__act--bad" type="button" data-action="wp-dismiss">Dismiss</button>
        </div>
      `;
      list.appendChild(item);
    });

    // Whiteboard invites (show first)
    wbList.forEach((inv) => {
      const item = document.createElement('div');
      item.className = 'vs-dd__item';
      item.dataset.wbInviteId = inv.id;
      item.dataset.roomId = inv.room_id;

      item.innerHTML = `
        <div style="flex:1; min-width:0;">
          <div class="vs-dd__itemTitle">🧩 Whiteboard invite</div>
          <div class="vs-dd__itemMeta"><b>${escapeHtml(inv.username || 'Unknown')}</b> invited you · ${escapeHtml(fmtTime(inv.created_at))}</div>
        </div>
        <div class="vs-dd__actions">
          <button class="vs-dd__act vs-dd__act--ok" type="button" data-action="wb-join">Join</button>
          <button class="vs-dd__act vs-dd__act--bad" type="button" data-action="wb-dismiss">Dismiss</button>
        </div>
      `;
      list.appendChild(item);
    });

    frList.forEach((fr) => {
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
      const r = await fetch('/friends/list', { credentials: 'include' });
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
      const r = await fetch('/friends/request', {
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

      // notifications badge = server alerts + local watch party invites
      const serverAlerts = Number(j.counts?.alerts) || 0;
      const wpCount = (wpInvitesLocal || []).length;
      setBadge('notifications', serverAlerts + wpCount);
      setBadge('messages', j.counts?.messages || 0);

      renderAlerts(j.friend_requests || [], j.whiteboard_invites || [], wpInvitesLocal || []);

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
  let _hookedSocket = null;
  const hookSocket = (explicitSocket) => {
    const s = explicitSocket || window.VS_SOCKET || window.socket || null;
    if (!s || typeof s.on !== 'function') return;
    if (s === _hookedSocket) return; // already hooked this socket
    _hookedSocket = s;
    // when DM arrives and you are in the room view
    s.on('dm:new', () => fetchSummary());
    // when DM arrives but you are not in the room view
    s.on('dm:notify', () => fetchSummary());
    // whiteboard invite notifications
    s.on('wb:invite_notify', () => fetchSummary());

    // watch party invite notifications (realtime)
    s.on('wp:invite_notify', (p = {}) => {
      pushWpInvite(p);
      // update notifications dropdown + badge immediately
      const serverAlerts = Number(lastSummary?.counts?.alerts) || 0;
      setBadge('notifications', serverAlerts + (wpInvitesLocal || []).length);
      renderAlerts(lastSummary?.friend_requests || [], lastSummary?.whiteboard_invites || [], wpInvitesLocal || []);
    });

    // general notifications (likes, comments, friend requests)
    s.on('vs:notification', (p = {}) => {
      fetchSummary();
      const type = p.type || '';
      const from = p.from_username ? `@${p.from_username}` : 'Someone';
      let msg = '';
      let href = '/';
      if (type === 'like') { msg = `❤️ ${from} ถูกใจโพสต์ของคุณ`; }
      else if (type === 'comment') { msg = `💬 ${from} แสดงความคิดเห็นในโพสต์ของคุณ`; }
      else if (type === 'friend_request') { msg = `👋 ${from} ส่งคำขอเป็นเพื่อน`; href = ''; }
      else { msg = '🔔 มีการแจ้งเตือนใหม่'; }
      if (href) {
        showToast(msg, { ttlMs: 6000, href });
      } else {
        showToast(msg, {
          ttlMs: 6000,
          actionText: 'ดู',
          onAction: () => {
            const notifMenu = document.querySelector('.vs-menu[data-menu="notifications"]');
            if (notifMenu) { closeAll(); notifMenu.setAttribute('open', ''); }
          }
        });
      }
    });

    // game invites
    s.on('gm:invite', (p = {}) => {
      const from = p.from_username ? `@${p.from_username}` : 'Someone';
      const label = p.game_label || p.gameType || 'เกม';
      const msg = `🎮 ${from} ชวนคุณเล่น ${label}!`;
      const href = p.roomId && p.gameType ? `/arcade/${p.gameType}/${p.roomId}` : '';
      showToast(msg, { ttlMs: 10000, href: href || undefined });
    });
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
      const action = btn.dataset.action;

      // Watch Party invite actions (client-side)
      if (action === 'wp-join' || action === 'wp-dismiss') {
        const roomId = item?.dataset.wpRoomId;
        const fromUserId = item?.dataset.wpFromUserId || '';
        if (!roomId) return;
        btn.disabled = true;
        removeWpInvite(roomId, fromUserId);
        // refresh UI
        const serverAlerts = Number(lastSummary?.counts?.alerts) || 0;
        setBadge('notifications', serverAlerts + (wpInvitesLocal || []).length);
        renderAlerts(lastSummary?.friend_requests || [], lastSummary?.whiteboard_invites || [], wpInvitesLocal || []);
        if (action === 'wp-join') {
          window.location.href = `/watch/r/${encodeURIComponent(roomId)}`;
        }
        return;
      }

      // Whiteboard invite actions
      if (action === 'wb-join' || action === 'wb-dismiss') {
        const inviteId = item?.dataset.wbInviteId;
        const roomId = item?.dataset.roomId;
        if (!inviteId) return;
        btn.disabled = true;
        try {
          await fetch(`/api/whiteboard/invites/${encodeURIComponent(inviteId)}/dismiss`, {
            method: 'POST',
            credentials: 'include'
          });
        } catch (_) {}
        fetchSummary();
        if (action === 'wb-join' && roomId) {
          window.location.href = `/whiteboard/r/${encodeURIComponent(roomId)}`;
        }
        return;
      }

      // Friend request actions
      const id = item ? item.dataset.requestId : null;
      if (!id) return;
      btn.disabled = true;
      try {
        const url = `/friends/requests/${encodeURIComponent(id)}/${action === 'accept' ? 'accept' : 'deny'}`;
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
    getSummary: () => lastSummary,
    hookSocket,
  };
})();
