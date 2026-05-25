// public/js/chat-dock.js
// -----------------------------------------------------------------------------
// Chat dock overlays (Global + DM) — Facebook style
// - Singleton init guard (script may be included multiple times)
// - Global chat uses socket event chat:send/chat:new + chat:pull
// - DM uses /api/dm/open + /api/dm/rooms/:id/messages + socket dm:join/dm:send/dm:new
// -----------------------------------------------------------------------------
(() => {
  if (window.__VS_CHAT_DOCK_INIT__) return;
  window.__VS_CHAT_DOCK_INIT__ = true;

  let dock = document.getElementById('chatDock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'chatDock';
    dock.className = 'chat-dock';
    document.body.appendChild(dock);
  }

  // ===== identity (from EJS) =====
  const MY_ID = window.VS_ME?.id ? Number(window.VS_ME.id) : null;
  const MY_NAME = norm(window.VS_ME?.username || '');

  // ===== socket (shared) =====
  let socket = null;
  let lastGlobalHistory = [];

  // Dedupe: track optimistic messages by clientMsgId
  const pendingById = new Map();

  function genClientMsgId() {
    return `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  // DM registries
  const dmRoomByFriend = new Map(); // friendId -> roomId
  const dmKeyByRoom = new Map();    // roomId -> key

  function bindSocketOnce(s) {
    if (!s || s.__vs_chat_dock_bound__) return;
    s.__vs_chat_dock_bound__ = true;

    s.on('chat:history', (rows) => {
      lastGlobalHistory = Array.isArray(rows) ? rows : [];
      const box = boxes.get('global');
      if (!box) return;
      renderGlobalHistory(box);
    });

    s.on('chat:new', (row) => {
      const box = boxes.get('global');
      if (row) lastGlobalHistory.push(row);
      if (!box) return;

      const body = box.querySelector('.chat-box__body');
      const cmid = row?.clientMsgId ? String(row.clientMsgId) : '';

      // Dedupe: upgrade optimistic message instead of duplicating
      if (cmid && pendingById.has(cmid)) {
        const el = pendingById.get(cmid);
        pendingById.delete(cmid);
        if (el) el.classList.remove('is-pending');
      } else {
        appendMsg(body, {
          userId: row.userId ?? row.user_id ?? null,
          username: row.username,
          message: row.message,
          clientMsgId: cmid || null,
        });
      }

      scrollToBottom(body);

      // ✅ FIX: roomId was undefined (crashed listener => "อีกฝั่งไม่เห็น" + notify เพี้ยน)
      if ((row.userId ?? row.user_id ?? null) !== MY_ID) {
        markRoomRead(1); // Global room_id = 1
      }

      typeof window.VS_REFRESH_NOTIFY === 'function' && window.VS_REFRESH_NOTIFY();
    });

    s.on('dm:history', ({ roomId, rows }) => {
      if (!roomId) return;
      const key = dmKeyByRoom.get(Number(roomId));
      if (!key) return;
      const box = boxes.get(key);
      if (!box) return;
      renderDmHistory(box, Array.isArray(rows) ? rows : []);
    });

    s.on('dm:new', (row) => {
      const roomId = Number(row?.roomId ?? row?.room_id ?? 0);
      if (!roomId) return;
      const key = dmKeyByRoom.get(roomId);
      if (!key) return;
      const box = boxes.get(key);
      if (!box) return;

      const body = box.querySelector('.chat-box__body');
      const cmid = row?.clientMsgId ? String(row.clientMsgId) : '';

      if (cmid && pendingById.has(cmid)) {
        const el = pendingById.get(cmid);
        pendingById.delete(cmid);
        if (el) el.classList.remove('is-pending');
      } else {
        appendMsg(body, {
          userId: row.userId ?? row.user_id ?? null,
          username: row.username,
          message: row.message,
          clientMsgId: cmid || null,
        });
      }

      scrollToBottom(body);

      if ((row.userId ?? row.user_id ?? null) !== MY_ID) {
        markRoomRead(roomId);
      }

      typeof window.VS_REFRESH_NOTIFY === 'function' && window.VS_REFRESH_NOTIFY();
    });

    s.on('dm:notify', () => (typeof window.VS_REFRESH_NOTIFY === 'function' && window.VS_REFRESH_NOTIFY()));
  }

  function ensureSocket() {
    if (socket) return socket;

    socket = window.VS_SOCKET || null;
    if (!socket) return null;

    bindSocketOnce(socket);
    return socket;
  }

  // ✅ Robust bind: wait until VS_SOCKET exists (prevents missing history)
  function waitForSocketBind() {
    const s = ensureSocket();
    if (s) return;
    // try a few times quickly, then stop (safe)
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const s2 = ensureSocket();
      if (s2 || tries > 40) clearInterval(t);
    }, 100);
  }
  waitForSocketBind();

  // ===== small utils =====
  function norm(s) {
    return String(s || '').trim().toLowerCase();
  }
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function postJson(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body || {})
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.reason || j.message || 'request_failed');
    return j;
  }

  async function getJson(url) {
    const r = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.ok === false) throw new Error(j.reason || j.message || 'request_failed');
    return j;
  }

  // Mark a room as read (clears message badge for that thread)
  const _markTimers = new Map();
  async function markRoomRead(roomId) {
    const rid = Number(roomId);
    if (!rid) return;
    // debounce per room
    if (_markTimers.has(rid)) return;
    _markTimers.set(rid, setTimeout(() => {
      clearTimeout(_markTimers.get(rid));
      _markTimers.delete(rid);
    }, 900));

    try {
      await postJson('/api/notify/read', { roomId: rid });
    } catch (_) {
      // ignore
    }
    if (typeof window.VS_REFRESH_NOTIFY === 'function') {
      window.VS_REFRESH_NOTIFY();
    }
  }

  // ===== chat box registry (prevent duplicates) =====
  const boxes = new Map(); // key -> element

  function openChatBox({ key, title, mode }) {
    if (boxes.has(key)) {
      const el = boxes.get(key);
      dock.appendChild(el);
      return el;
    }

    const box = document.createElement('div');
    box.className = 'chat-box';
    box.dataset.chatKey = key;
    box.dataset.mode = mode || 'global';

    box.innerHTML = `
      <div class="chat-box__head">
        <div class="chat-box__title"><span>${escapeHtml(title)}</span></div>
        <button type="button" aria-label="Close">✕</button>
      </div>
      <div class="chat-box__body"></div>
      <form class="chat-box__input" autocomplete="off">
        <input type="text" placeholder="พิมพ์ข้อความ..." maxlength="1000" />
        <button type="submit">Send</button>
      </form>
    `;

    const closeBtn = box.querySelector('.chat-box__head button');
    const body = box.querySelector('.chat-box__body');
    const form = box.querySelector('form');
    const input = box.querySelector('input');

    closeBtn.addEventListener('click', () => {
      boxes.delete(key);
      box.remove();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = String(input.value || '').trim();
      if (!msg) return;
      input.value = '';

      // optimistic UI (dedupe with clientMsgId)
      const clientMsgId = genClientMsgId();
      const el = appendMsg(body, {
        userId: MY_ID,
        username: window.VS_ME?.username || 'Me',
        message: msg,
        clientMsgId,
        pending: true,
      });
      if (clientMsgId && el) pendingById.set(clientMsgId, el);
      scrollToBottom(body);

      const modeNow = box.dataset.mode;

      if (modeNow === 'global') {
        const s = ensureSocket();
        if (s) s.emit('chat:send', { message: msg, clientMsgId });
      } else if (modeNow === 'dm') {
        const roomId = Number(box.dataset.roomId);
        const s = ensureSocket();
        if (s && roomId) s.emit('dm:send', { roomId, message: msg, clientMsgId });
      }
    });

    dock.appendChild(box);
    boxes.set(key, box);
    scrollToBottom(body);
    return box;
  }

  function appendMsg(bodyEl, { userId = null, username, message, clientMsgId = null, pending = false }) {
    const uRaw = String(username || '').trim();
    const u = norm(uRaw);

    // ✅ decide side (prefer userId)
    const isMe =
      (MY_ID !== null && userId !== null && Number(userId) === Number(MY_ID)) ||
      (MY_NAME && u === MY_NAME);

    const row = document.createElement('div');
    row.className = 'chat-box__msg ' + (isMe ? 'is-me' : 'is-other');
    if (pending) row.classList.add('is-pending');
    if (clientMsgId) row.dataset.clientMsgId = String(clientMsgId);

    row.innerHTML = `
      <div class="u">${escapeHtml(uRaw || 'Unknown')}</div>
      <div class="t">${escapeHtml(message || '')}</div>
    `;

    bodyEl.appendChild(row);
    return row;
  }

  function scrollToBottom(bodyEl) {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderGlobalHistory(box) {
    const body = box.querySelector('.chat-box__body');
    body.innerHTML = '';
    lastGlobalHistory.forEach(r => appendMsg(body, {
      userId: r.userId ?? r.user_id ?? null,
      username: r.username,
      message: r.message
    }));
    scrollToBottom(body);
  }

  function renderDmHistory(box, rows) {
    const body = box.querySelector('.chat-box__body');
    body.innerHTML = '';
    (rows || []).forEach(m => appendMsg(body, {
      userId: m.user_id ?? m.userId ?? null,
      username: m.username,
      message: m.message
    }));
    scrollToBottom(body);
  }

  async function openGlobal() {
    const s = ensureSocket();
    const box = openChatBox({ key: 'global', title: '🌐 Global Chat', mode: 'global' });

    // ✅ Always pull history when opening (fix "ประวัติหาย" 100%)
    if (s) s.emit('chat:pull', { limit: 60 });

    // Also render cached if already have it
    if (!box.dataset.bound) {
      box.dataset.bound = '1';
      if (lastGlobalHistory.length) renderGlobalHistory(box);
    }
    return box;
  }

  async function openDm(friendId, friendName = 'Friend') {
    ensureSocket();
    const fid = Number(friendId);
    if (!fid) return null;

    const key = `dm:${fid}`;
    const box = openChatBox({ key, title: `👤 ${friendName}`, mode: 'dm' });

    // open/get room id once
    if (!box.dataset.roomId) {
      try {
        const j = await postJson('/dm/open', { friend_id: fid });
        const rid = Number(j.room_id);
        if (rid) {
          box.dataset.roomId = String(rid);
          dmRoomByFriend.set(fid, rid);
          dmKeyByRoom.set(rid, key);

          // join room for realtime
          const s = ensureSocket();
          if (s) s.emit('dm:join', { roomId: rid });

          // load history and mark read
          const history = await getJson(`/dm/rooms/${rid}/messages?limit=60`);
          renderDmHistory(box, history.messages || []);

          // mark read now that DM is open
          await markRoomRead(rid);

          typeof window.VS_REFRESH_NOTIFY === 'function' && window.VS_REFRESH_NOTIFY();
        }
      } catch (e) {
        const body = box.querySelector('.chat-box__body');
        body.innerHTML = `<div class="chat-box__sys">DM error: ${escapeHtml(e.message || e)}</div>`;
      }
    }

    return box;
  }

  // ===== integrate with topbar dropdown items =====
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-open-chat]');
    if (!item) return;

    const type = item.getAttribute('data-open-chat');
    if (type === 'global') {
      openGlobal();
      return;
    }

    if (type === 'dm') {
      const fid = item.getAttribute('data-friend-id');
      const fname = item.getAttribute('data-friend-name') || 'Friend';
      if (!fid) return;
      openDm(fid, fname);
      return;
    }
  });

  // ===== expose for programmatic opening =====
  window.VS_CHAT_DOCK = {
    openGlobal,
    openDm,
  };
})();
