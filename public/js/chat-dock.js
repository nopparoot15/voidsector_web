// public/js/chat-dock.js — Facebook-style chat dock
// Max 4 open windows; extras collapse to circle bubbles on the right
(() => {
  if (window.__VS_CHAT_DOCK_INIT__) return;
  window.__VS_CHAT_DOCK_INIT__ = true;

  // ── Identity ──────────────────────────────────────────────────────────────
  const MY_ID   = window.VS_ME?.id ? Number(window.VS_ME.id) : null;
  const MY_NAME = norm(window.VS_ME?.username || '');

  // ── DOM setup ─────────────────────────────────────────────────────────────
  let dock = document.getElementById('chatDock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'chatDock';
    dock.className = 'chat-dock';
    document.body.appendChild(dock);
  }

  let bubblesEl = document.getElementById('chat-bubbles');
  if (!bubblesEl) {
    bubblesEl = document.createElement('div');
    bubblesEl.id = 'chat-bubbles';
    document.body.appendChild(bubblesEl);
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const MAX_OPEN   = 4;
  const boxes      = new Map(); // key → { el, meta }
  const openOrder  = [];        // keys in insertion order (oldest first)
  const minimized  = new Set(); // keys currently shown as bubbles

  // Dedupe optimistic messages
  const pendingById = new Map();
  function genId() { return `c_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

  // DM maps
  const dmRoomByFriend = new Map();
  const dmKeyByRoom    = new Map();

  // Unread counts for bubbles
  const unreadCount = new Map(); // key → number

  // Global chat history cache
  let lastGlobalHistory = [];

  // ── Socket ────────────────────────────────────────────────────────────────
  let socket = null;

  function ensureSocket() {
    if (socket) return socket;
    socket = window.VS_SOCKET || null;
    if (socket && !socket.__vs_chat_dock_bound__) bindSocket(socket);
    return socket;
  }

  function bindSocket(s) {
    s.__vs_chat_dock_bound__ = true;

    s.on('chat:history', rows => {
      lastGlobalHistory = Array.isArray(rows) ? rows : [];
      const entry = boxes.get('global');
      if (entry) renderGlobalHistory(entry.el);
    });

    s.on('chat:new', row => {
      if (row) lastGlobalHistory.push(row);
      const entry = boxes.get('global');
      const cmid  = row?.clientMsgId ? String(row.clientMsgId) : '';
      if (entry && !entry.collapsed) {
        const body = entry.el.querySelector('.chat-box__body');
        if (cmid && pendingById.has(cmid)) {
          pendingById.get(cmid)?.classList.remove('is-pending');
          pendingById.delete(cmid);
        } else {
          appendMsg(body, { userId: row.userId ?? row.user_id, username: row.username, message: row.message });
          scrollBottom(body);
        }
      }
      if ((row?.userId ?? row?.user_id) !== MY_ID) {
        bumpUnread('global');
        window.VS_REFRESH_NOTIFY?.();
      }
    });

    s.on('dm:history', ({ roomId, rows }) => {
      if (!roomId) return;
      const key   = dmKeyByRoom.get(Number(roomId));
      const entry = key ? boxes.get(key) : null;
      if (entry) renderDmHistory(entry.el, Array.isArray(rows) ? rows : []);
    });

    s.on('dm:new', row => {
      const roomId = Number(row?.roomId ?? row?.room_id ?? 0);
      if (!roomId) return;
      const key   = dmKeyByRoom.get(roomId);
      const entry = key ? boxes.get(key) : null;
      const cmid  = row?.clientMsgId ? String(row.clientMsgId) : '';

      if (entry && !entry.collapsed) {
        const body = entry.el.querySelector('.chat-box__body');
        if (cmid && pendingById.has(cmid)) {
          pendingById.get(cmid)?.classList.remove('is-pending');
          pendingById.delete(cmid);
        } else {
          appendMsg(body, { userId: row.userId ?? row.user_id, username: row.username, message: row.message });
          scrollBottom(body);
        }
      }
      if ((row?.userId ?? row?.user_id) !== MY_ID) {
        bumpUnread(key);
        window.VS_REFRESH_NOTIFY?.();
      }
    });

    s.on('dm:notify', () => window.VS_REFRESH_NOTIFY?.());
  }

  // Poll until VS_SOCKET is ready
  (function waitSocket() {
    const s = ensureSocket();
    if (!s) { let n = 0; const t = setInterval(() => { n++; if (ensureSocket() || n > 60) clearInterval(t); }, 150); }
  })();

  // ── Utils ─────────────────────────────────────────────────────────────────
  function norm(s) { return String(s || '').trim().toLowerCase(); }

  function avatarHtml(avatar, name) {
    const init = String(name || '?').trim().charAt(0).toUpperCase();
    if (avatar) return `<img src="${esc(avatar)}" alt="">`;
    return init;
  }

  async function postJson(url, body) {
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, credentials:'include', body: JSON.stringify(body || {}) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.reason || j.message || 'request_failed');
    return j;
  }

  async function getJson(url) {
    const r = await fetch(url, { headers:{'Accept':'application/json'}, credentials:'include' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.reason || j.message || 'request_failed');
    return j;
  }

  // ── Unread badge ──────────────────────────────────────────────────────────
  function bumpUnread(key) {
    if (!key) return;
    const entry = boxes.get(key);
    if (!entry) return;
    if (minimized.has(key)) {
      const n = (unreadCount.get(key) || 0) + 1;
      unreadCount.set(key, n);
      updateBubbleBadge(key, n);
    }
  }

  function clearUnread(key) {
    unreadCount.set(key, 0);
    updateBubbleBadge(key, 0);
  }

  function updateBubbleBadge(key, n) {
    const bubble = bubblesEl.querySelector(`[data-bubble-key="${CSS.escape(key)}"]`);
    if (!bubble) return;
    let badge = bubble.querySelector('.chat-bubble__badge');
    if (n > 0) {
      if (!badge) { badge = document.createElement('div'); badge.className = 'chat-bubble__badge'; bubble.appendChild(badge); }
      badge.textContent = n > 99 ? '99+' : n;
    } else {
      badge?.remove();
    }
  }

  // ── Layout: open slot counting ─────────────────────────────────────────────
  function countOpen() {
    return openOrder.filter(k => !minimized.has(k)).length;
  }

  function minimizeOldest() {
    for (const k of openOrder) {
      if (!minimized.has(k)) { minimizeBox(k); return; }
    }
  }

  // ── Minimize / restore ────────────────────────────────────────────────────
  function minimizeBox(key) {
    const entry = boxes.get(key);
    if (!entry || minimized.has(key)) return;
    minimized.add(key);

    // Hide the window from dock
    entry.el.style.display = 'none';
    // Rebuild dock visibility
    refreshDock();

    // Create bubble
    const meta   = entry.meta;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.dataset.bubbleKey = key;
    bubble.title = meta.title;
    bubble.innerHTML = avatarHtml(meta.avatar, meta.title);
    bubble.addEventListener('click', () => restoreBox(key));
    bubblesEl.appendChild(bubble);

    const n = unreadCount.get(key) || 0;
    if (n > 0) updateBubbleBadge(key, n);
  }

  function restoreBox(key) {
    if (!minimized.has(key)) return;
    // If dock is full, minimize the oldest open window first
    if (countOpen() >= MAX_OPEN) minimizeOldest();

    minimized.delete(key);
    clearUnread(key);

    // Remove bubble
    bubblesEl.querySelector(`[data-bubble-key="${CSS.escape(key)}"]`)?.remove();

    // Show window and move to front (rightmost)
    const entry = boxes.get(key);
    if (entry) {
      entry.el.style.display = '';
      dock.appendChild(entry.el); // move to end (rightmost visually)
    }
    refreshDock();
  }

  // ── Ensure position in openOrder ──────────────────────────────────────────
  function touchOrder(key) {
    const idx = openOrder.indexOf(key);
    if (idx !== -1) openOrder.splice(idx, 1);
    openOrder.push(key);
  }

  function refreshDock() {
    // Nothing structural needed; CSS flex does layout.
    // Hide/show handled per box. Just sync bubblesEl right offset.
    const openCount = countOpen();
    // Shift bubble column left of the dock windows
    const dockWidth = openCount * (300 + 10);
    bubblesEl.style.right = (dockWidth + 16) + 'px';

    // Also hide bubble column if empty
    bubblesEl.style.display = minimized.size > 0 ? 'flex' : 'none';
  }

  // ── Core: open / create a chat box ───────────────────────────────────────
  function openChatBox({ key, title, mode, avatar = null }) {
    if (boxes.has(key)) {
      const entry = boxes.get(key);
      if (minimized.has(key)) {
        restoreBox(key);
      } else {
        // Already open — bring to front
        dock.appendChild(entry.el);
        touchOrder(key);
        entry.el.querySelector('.chat-box__input input')?.focus();
      }
      return entry.el;
    }

    // Need a new slot
    if (countOpen() >= MAX_OPEN) minimizeOldest();

    // Build window
    const box = document.createElement('div');
    box.className = 'chat-box';
    box.dataset.chatKey = key;

    box.innerHTML = `
      <div class="chat-box__head">
        <div class="chat-box__avatar">${avatarHtml(avatar, title)}</div>
        <div class="chat-box__title"><span>${esc(title)}</span></div>
        <div class="chat-box__head-actions">
          <button type="button" class="chat-box__head-btn btn-minimize" title="ย่อ">—</button>
          <button type="button" class="chat-box__head-btn btn-close" title="ปิด">✕</button>
        </div>
      </div>
      <div class="chat-box__body"></div>
      <form class="chat-box__input" autocomplete="off">
        <input type="text" placeholder="พิมพ์ข้อความ…" maxlength="1000" />
        <button type="submit" title="ส่ง">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </form>
    `;

    const head     = box.querySelector('.chat-box__head');
    const body     = box.querySelector('.chat-box__body');
    const form     = box.querySelector('.chat-box__input');
    const input    = box.querySelector('input');
    const btnMin   = box.querySelector('.btn-minimize');
    const btnClose = box.querySelector('.btn-close');

    // Toggle collapse on header click (not on buttons)
    head.addEventListener('click', e => {
      if (e.target.closest('.chat-box__head-actions')) return;
      box.classList.toggle('is-collapsed');
      if (!box.classList.contains('is-collapsed')) {
        scrollBottom(body);
        input.focus();
      }
    });

    btnMin.addEventListener('click', e => { e.stopPropagation(); minimizeBox(key); });
    btnClose.addEventListener('click', e => {
      e.stopPropagation();
      // Remove completely
      boxes.delete(key);
      minimized.delete(key);
      bubblesEl.querySelector(`[data-bubble-key="${CSS.escape(key)}"]`)?.remove();
      const idx = openOrder.indexOf(key);
      if (idx !== -1) openOrder.splice(idx, 1);
      box.remove();
      refreshDock();
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = String(input.value || '').trim();
      if (!msg) return;
      input.value = '';

      const clientMsgId = genId();
      const el = appendMsg(body, { userId: MY_ID, username: window.VS_ME?.username || 'Me', message: msg, pending: true });
      if (el) pendingById.set(clientMsgId, el);
      scrollBottom(body);

      const s = ensureSocket();
      if (mode === 'global') {
        if (s) s.emit('chat:send', { message: msg, clientMsgId });
      } else if (mode === 'dm') {
        const roomId = Number(box.dataset.roomId);
        if (s && roomId) s.emit('dm:send', { roomId, message: msg, clientMsgId });
      }
    });

    dock.appendChild(box);
    boxes.set(key, { el: box, meta: { title, avatar, mode }, collapsed: false });
    touchOrder(key);
    refreshDock();

    input.focus();
    return box;
  }

  // ── Message rendering ──────────────────────────────────────────────────────
  function appendMsg(bodyEl, { userId, username, message, pending = false, clientMsgId = null }) {
    const u = norm(username);
    const isMe =
      (MY_ID !== null && userId !== null && Number(userId) === Number(MY_ID)) ||
      (MY_NAME && u === MY_NAME);

    const row = document.createElement('div');
    row.className = 'chat-box__msg ' + (isMe ? 'is-me' : 'is-other');
    if (pending) row.classList.add('is-pending');
    if (clientMsgId) row.dataset.clientMsgId = String(clientMsgId);

    const uRaw = String(username || '').trim();
    row.innerHTML = `
      <div class="u">${esc(uRaw || 'Unknown')}</div>
      <div class="t">${esc(message || '')}</div>
    `;
    bodyEl.appendChild(row);
    return row;
  }

  function scrollBottom(el) { el.scrollTop = el.scrollHeight; }

  function renderGlobalHistory(box) {
    const body = box.querySelector('.chat-box__body');
    body.innerHTML = '';
    lastGlobalHistory.forEach(r => appendMsg(body, {
      userId: r.userId ?? r.user_id ?? null,
      username: r.username,
      message: r.message
    }));
    scrollBottom(body);
  }

  function renderDmHistory(box, rows) {
    const body = box.querySelector('.chat-box__body');
    body.innerHTML = '';
    rows.forEach(m => appendMsg(body, {
      userId: m.user_id ?? m.userId ?? null,
      username: m.username,
      message: m.message
    }));
    scrollBottom(body);
  }

  // ── Open Global Chat ───────────────────────────────────────────────────────
  async function openGlobal() {
    const box = openChatBox({ key: 'global', title: '🌐 Global', mode: 'global', avatar: null });
    const s = ensureSocket();
    if (s) s.emit('chat:pull', { limit: 60 });
    else if (lastGlobalHistory.length) renderGlobalHistory(box);
  }

  // ── Open DM ────────────────────────────────────────────────────────────────
  async function openDm(friendId, friendName = 'Friend', friendAvatar = null) {
    ensureSocket();
    const fid = Number(friendId);
    if (!fid) return;

    const key = `dm:${fid}`;
    const box = openChatBox({ key, title: friendName, mode: 'dm', avatar: friendAvatar });

    if (!box.dataset.roomId) {
      try {
        const j   = await postJson('/dm/open', { friend_id: fid });
        const rid = Number(j.room_id);
        if (rid) {
          box.dataset.roomId = String(rid);
          dmRoomByFriend.set(fid, rid);
          dmKeyByRoom.set(rid, key);

          const s = ensureSocket();
          if (s) s.emit('dm:join', { roomId: rid });

          const hist = await getJson(`/dm/rooms/${rid}/messages?limit=60`);
          renderDmHistory(box, hist.messages || []);
        }
      } catch (e) {
        const body = box.querySelector('.chat-box__body');
        if (body) body.innerHTML = `<div class="chat-box__sys">เกิดข้อผิดพลาด: ${esc(e.message)}</div>`;
      }
    }
  }

  // ── Click delegation for topbar items ────────────────────────────────────
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-open-chat]');
    if (!item) return;
    if (item.dataset.openChat === 'global') { openGlobal(); return; }
    if (item.dataset.openChat === 'dm') {
      openDm(item.dataset.friendId, item.dataset.friendName || 'Friend', item.dataset.friendAvatar || null);
    }
  });

  // ── Open DM by room ID (called from toast click) ─────────────────────────
  async function openDmByRoom(roomId, friendName) {
    const rid = Number(roomId);
    if (!rid) return;
    const existingKey = dmKeyByRoom.get(rid);
    if (existingKey) { restoreBox(existingKey); return; }
    const key = `dm:room:${rid}`;
    const box = openChatBox({ key, title: friendName || 'DM', mode: 'dm' });
    box.dataset.roomId = String(rid);
    dmKeyByRoom.set(rid, key);
    const s = ensureSocket();
    if (s) s.emit('dm:join', { roomId: rid });
    try {
      const hist = await getJson(`/dm/rooms/${rid}/messages?limit=60`);
      renderDmHistory(box, hist.messages || []);
    } catch (_) {}
    window.VS_CLEAR_CHAT_BADGE?.();
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.VS_CHAT_DOCK = { openGlobal, openDm, openDmByRoom };

  // Init bubble column visibility
  refreshDock();
})();
