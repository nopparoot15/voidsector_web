// public/js/dm-page.js

(async () => {
  const { me, friendId } = window.__DM__ || {};

  if (!me?.id || !friendId) {
    alert('DM initialization failed');
    return;
  }

  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  // --------------------
  // helpers
  // --------------------
  function addMessage({ userId, username, message }) {
    const div = document.createElement('div');
    const isMe = Number(userId) === Number(me.id);

    div.className = `msg ${isMe ? 'me' : 'other'}`;
    div.innerHTML = `
      <div class="user">${isMe ? 'You' : username}</div>
      <div class="text">${escapeHtml(message)}</div>
    `;

    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function jpost(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.json();
  }

  async function jget(url) {
    const r = await fetch(url);
    return r.json();
  }

  // --------------------
  // socket.io
  // --------------------
  // Use the global singleton socket created by public/js/vs-socket.js
  const socket = window.VS_SOCKET;
  if (!socket || typeof socket.emit !== 'function') {
    alert('Socket not ready — please refresh');
    return;
  }

  
  async function markRead() {
    if (!ROOM_ID) return;
    try {
      await fetch('/api/notify/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomId: ROOM_ID })
      });
      if (window.VS_TOPBAR?.refresh) window.VS_TOPBAR.refresh();
    } catch {}
  }

let ROOM_ID = null;

  // --------------------
  // init DM
  // --------------------
  async function init() {
    // 1) open DM room
    const open = await jpost('/api/dm/open', { friend_id: friendId });
    if (!open.ok) {
      alert(open.reason === 'not_friends'
        ? 'คุณยังไม่ได้เป็นเพื่อนกัน'
        : 'ไม่สามารถเปิด DM ได้');
      return;
    }

    ROOM_ID = open.room_id;

    // 2) join room
    socket.emit('dm:join', { roomId: ROOM_ID });

    // 3) load history
    const hist = await jget(`/api/dm/rooms/${ROOM_ID}/messages?limit=50`);
    if (hist.ok && Array.isArray(hist.messages)) {
      hist.messages.forEach(addMessage);
    }

    // mark as read (so badges reset)
    await markRead();
  }

  // --------------------
  // send message
  // --------------------
  function sendMessage() {
    const msg = inputEl.value.trim();
    if (!msg || !ROOM_ID) return;

    inputEl.value = '';
    socket.emit('dm:send', {
      roomId: ROOM_ID,
      message: msg
    });
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // --------------------
  // receive message
  // --------------------
  socket.on('dm:new', (payload) => {
    if (Number(payload.roomId) !== Number(ROOM_ID)) return;
    addMessage(payload);
    if (Number(payload.userId) !== Number(me.id)) markRead();
  });

  socket.on('dm:error', (err) => {
    console.error('DM error:', err);
    alert(err?.message || 'DM error');
  });

  // start
  init();
})();
