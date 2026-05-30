'use strict';
/* ── Shared utilities for all multiplayer game pages ── */

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderLobbyPlayersHTML(pl, host) {
  const el = document.getElementById('lobby-players');
  if (!el) return;
  el.innerHTML = pl.map(p => `
    <div class="lobby-player-item">
      <span>${esc(p.username)}${p.offline ? ' 🔴' : ''}</span>
      ${p.userId === host ? '<span class="host-tag">HOST</span>' : ''}
    </div>`).join('');
}

function updateChips(pl) {
  const myId = window.__USER__?.id;
  const el = document.getElementById('gm-players');
  if (!el) return;
  el.innerHTML = pl.map(p =>
    `<span class="gm-player-chip ${p.userId === myId ? 'is-me' : ''}${p.offline ? ' offline' : ''}">${esc(p.username)}${p.offline ? ' 🔴' : ''}</span>`
  ).join('');
}

function showOfflineNotice(pl) {
  const myId = window.__USER__?.id;
  const gone = pl.find(p => p.offline && p.userId !== myId);
  let el = document.getElementById('gm-offline-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'gm-offline-notice';
    el.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fca5a5;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;display:none;';
    document.body.appendChild(el);
  }
  if (gone) { el.textContent = '⚠️ ' + gone.username + ' ออกจากเกม'; el.style.display = 'block'; }
  else { el.style.display = 'none'; }
}
