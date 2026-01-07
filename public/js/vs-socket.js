// public/js/vs-socket.js
// Create a single shared Socket.IO connection for the whole app.
// This prevents duplicated connections/listeners that cause missed realtime updates or duplicate UI echoes.
(() => {
  if (window.__VS_SOCKET_SINGLETON__) return;
  window.__VS_SOCKET_SINGLETON__ = true;

  if (typeof io !== 'function') {
    console.warn('[VOIDSECTOR] Socket.IO client not loaded');
    return;
  }

  const socket = io({ withCredentials: true });
  window.VS_SOCKET = socket;

  const hello = () => {
    try {
      const me = window.VS_ME || {};
      const username = String(me.username || '').trim();
      if (!username) return;
      socket.emit('chat:hello', { userId: me.id || null, username });
    } catch {}
  };

  // Try immediately (covers the case where `connect` fires before listeners are attached)
  // and retry a few times until VS_ME is available.
  hello();
  let tries = 0;
  const t = setInterval(() => {
    tries++;
    hello();
    if ((window.VS_ME && window.VS_ME.username) || tries >= 10) clearInterval(t);
  }, 250);

  socket.on('connect', hello);
  // also resend identity on reconnect
  socket.on('reconnect', hello);
})();
