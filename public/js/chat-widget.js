document.addEventListener('DOMContentLoaded', () => {
  // Guard against double-init if this script is included more than once.
  if (window.__VS_CHAT_WIDGET_INIT__) return;
  window.__VS_CHAT_WIDGET_INIT__ = true;
  const widget = document.getElementById('chat-widget');
  const header = document.getElementById('chat-header');
  const toggleBtn = document.getElementById('chat-toggle');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  if (!widget || !header || !toggleBtn || !form || !input || !messages) return;

  // ---------- collapse toggle ----------
  const collapsed = localStorage.getItem('chatCollapsed') === 'true';
  if (collapsed) {
    widget.classList.add('chat-collapsed');
    toggleBtn.textContent = '▲';
  } else {
    toggleBtn.textContent = '▼';
  }

  header.addEventListener('click', () => {
    widget.classList.toggle('chat-collapsed');
    const isCollapsed = widget.classList.contains('chat-collapsed');
    toggleBtn.textContent = isCollapsed ? '▲' : '▼';
    localStorage.setItem('chatCollapsed', isCollapsed);
    if (!isCollapsed) input.focus();
  });

  // ---------- identity ----------
  const meObj = window.__USER__ || null;
  const myUserId = (meObj && meObj.id !== undefined && meObj.id !== null) ? Number(meObj.id) : null;
  const myUsername = String(meObj?.username || '').trim() || 'Guest';

  // ---------- socket ----------
  if (typeof io !== 'function') {
    // ไม่ใส่ข้อความลงแชทตามที่ขอ แค่ disable input เฉย ๆ
    input.disabled = true;
    input.placeholder = 'Chat unavailable (socket.io client missing)';
    return;
  }

  const socket = window.VS_SOCKET;
  if (!socket) {
    console.warn('[VOIDSECTOR] VS_SOCKET missing; vs-socket.js not loaded');
    return;
  }
socket.on('connect', () => {
    // identity is handled by vs-socket.js
  });
});

  // ---------- UI helpers ----------
  function addMsg({ userId = null, username, message, system = false }) {
    const row = document.createElement('div');
    row.className = 'chat-row';

    const isSystem = system || username === 'System';
    const isMe = !isSystem && (myUserId !== null && Number(userId) === Number(myUserId));

    row.classList.add(isSystem ? 'system' : (isMe ? 'me' : 'other'));

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (!isSystem && !isMe) {
      const name = document.createElement('div');
      name.className = 'chat-name';
      name.textContent = username;
      bubble.appendChild(name);
    }

    const text = document.createElement('div');
    text.className = 'chat-text';
    text.textContent = message;
    bubble.appendChild(text);

    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function clearMessages() {
    messages.innerHTML = '';
  }

  // ---------- history + new messages ----------
  socket.on('chat:history', (rows) => {
    clearMessages();
    rows.forEach(r => addMsg({ userId: r.user_id ?? null, username: r.username, message: r.message }));
  });

  socket.on('chat:new', (row) => {
    addMsg({ userId: row.userId ?? row.user_id ?? null, username: row.username, message: row.message });
  });

  socket.on('chat:error', (e) => {
    // แสดงเป็น system message (สั้น ๆ)
    addMsg({ username: 'System', message: e?.message || 'Send failed', system: true });
  });

  // ---------- send ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    // ส่งไป server (server จะ broadcast กลับมาให้ทุกคน รวมถึงเรา)
    socket.emit('chat:send', { message: text });
    input.value = '';
  });
});
