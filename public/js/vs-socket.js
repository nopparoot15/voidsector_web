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

  socket.on('connect', hello);
  // also resend identity on reconnect
  socket.on('reconnect', hello);
})();
