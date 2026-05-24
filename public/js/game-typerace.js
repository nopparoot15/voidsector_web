(() => {
  const roomId = window.__ROOM_ID__;
  const me = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby    = document.getElementById('tr-lobby');
  const game     = document.getElementById('tr-game');
  const results  = document.getElementById('tr-results');
  const startBtn = document.getElementById('tr-start-btn');
  const lobbyPlayers = document.getElementById('lobby-players');
  const textDisplay  = document.getElementById('tr-text-display');
  const input        = document.getElementById('tr-input');
  const progressList = document.getElementById('tr-progress-list');
  const timerFill    = document.getElementById('tr-timer-fill');

  let state = null;
  let roomData = null;
  let players = [];
  let timerAf = null;
  let finished = false;
  let trOptions = { lang: 'en', difficulty: 'easy' };

  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      document.getElementById('copy-link-btn').textContent = '✓ คัดลอกแล้ว';
      setTimeout(() => document.getElementById('copy-link-btn').textContent = '🔗 แชร์', 2000);
    });
  });

  socket.on('connect', () => socket.emit('gm:join', { roomId }));
  socket.on('gm:error', ({ msg }) => alert(msg));

  socket.on('gm:joined', ({ room, state: st }) => {
    roomData = room; players = room.players;
    renderLobby(room);
    const isHost = room.host === me.id;
    if (isHost) startBtn.classList.remove('hidden');
    initOptions(isHost);
    if (room.status === 'playing' && st && st.text) startGame(st);
  });

  socket.on('gm:players', ({ players: pl }) => {
    players = pl;
    renderLobby({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => startGame(st));

  socket.on('tr:options', ({ lang, difficulty }) => {
    trOptions = { lang, difficulty };
    updateOptionUI('tr-lang-group', '[data-lang]', '[data-lang="' + lang + '"]');
    updateOptionUI('tr-diff-group', '[data-diff]', '[data-diff="' + difficulty + '"]');
  });

  socket.on('tr:progress', ({ progress, finished: fin }) => {
    if (state) { state.progress = progress; state.finished = fin; }
    renderProgress(progress, fin);
  });

  socket.on('tr:ended', ({ state: st }) => showResults(st));

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีผู้เล่นอย่างน้อย 2 คน');
    socket.emit('gm:start', { roomId });
  });

  input.addEventListener('input', () => {
    if (!state || finished) return;
    const typed = input.value;
    const target = state.text;
    let correct = 0;
    for (let i = 0; i < typed.length && i < target.length; i++) {
      if (typed[i] === target[i]) correct = i + 1;
      else break;
    }
    socket.emit('tr:progress', { roomId, chars: correct });
    renderText(typed);
  });

  function startGame(st) {
    state = st;
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    input.disabled = false;
    input.focus();
    renderText('');
    renderProgress(st.progress, st.finished || {});
    animateTimer(st.timerEndsAt);
  }

  function renderText(typed) {
    if (!state) return;
    const target = state.text;
    let html = '';
    let errorAt = -1;
    for (let i = 0; i < typed.length && i < target.length; i++) {
      if (typed[i] === target[i]) {
        html += `<span class="tr-char tr-ok">${esc(target[i])}</span>`;
      } else {
        if (errorAt < 0) errorAt = i;
        html += `<span class="tr-char tr-err">${esc(target[i])}</span>`;
      }
    }
    const cursorPos = Math.min(typed.length, target.length);
    for (let i = typed.length; i < target.length; i++) {
      const cls = i === cursorPos ? 'tr-char tr-cursor' : 'tr-char';
      html += `<span class="${cls}">${esc(target[i])}</span>`;
    }
    textDisplay.innerHTML = html;

    // Check completion
    if (!finished && typed === target) {
      finished = true;
      input.disabled = true;
      socket.emit('tr:progress', { roomId, chars: target.length });
    }
  }

  function renderProgress(progress, fin) {
    if (!state) return;
    const total = state.text.length;
    progressList.innerHTML = players.map(p => {
      const chars = progress[p.userId] || 0;
      const pct = Math.round((chars / total) * 100);
      const rank = fin[p.userId];
      const rankStr = rank ? `🥇🥈🥉🏅`[rank - 1] || `#${rank}` : '';
      const isMe = p.userId === me.id;
      return `<div class="tr-player-row ${isMe ? 'is-me' : ''}">
        <span class="tr-player-name">${esc(p.username)}${rankStr ? ` ${rankStr}` : ''}</span>
        <div class="tr-bar-wrap"><div class="tr-bar" style="width:${pct}%"></div></div>
        <span class="tr-pct">${pct}%</span>
      </div>`;
    }).join('');
  }

  function animateTimer(endsAt) {
    cancelAnimationFrame(timerAf);
    function tick() {
      const left = Math.max(0, endsAt - Date.now());
      const pct = (left / 60000) * 100;
      timerFill.style.width = pct + '%';
      timerFill.style.background = pct > 50 ? '#4ade80' : pct > 20 ? '#fbbf24' : '#f87171';
      if (left > 0) timerAf = requestAnimationFrame(tick);
    }
    tick();
  }

  function showResults(st) {
    cancelAnimationFrame(timerAf);
    game.classList.add('hidden');
    results.classList.remove('hidden');
    const ranked = players.slice().sort((a, b) => (st.finished[a.userId] || 99) - (st.finished[b.userId] || 99));
    const medals = ['🥇','🥈','🥉'];
    document.getElementById('tr-result-table').innerHTML = ranked.map((p, i) => {
      const pct = Math.round(((st.progress[p.userId] || 0) / st.text.length) * 100);
      return `<div class="tr-result-row ${p.userId === me.id ? 'is-me' : ''}">
        <span class="tr-result-rank">${medals[i] || `#${i+1}`}</span>
        <span class="tr-result-name">${esc(p.username)}</span>
        <span class="tr-result-pct">${pct}% พิมพ์ได้</span>
      </div>`;
    }).join('') + `
    <div class="gm-result-actions" style="margin-top:1.5rem">
      <button class="btn-primary" onclick="playAgain('typerace')">เล่นใหม่ 🔄</button>
      <a href="/arcade" class="btn-outline">Arcade</a>
    </div>`;
  }

  function renderLobby({ players: pl, host }) {
    lobbyPlayers.innerHTML = pl.map(p => `
      <div class="lobby-player-item">
        <span>${esc(p.username)}</span>
        ${p.userId === host ? '<span class="host-tag">HOST</span>' : ''}
      </div>`).join('');
    document.getElementById('lobby-status').textContent =
      pl.length < 2 ? `รอผู้เล่น… (${pl.length}/2+)` : 'พร้อมแล้ว!';
  }

  function updateChips(pl) {
    document.getElementById('gm-players').innerHTML = pl.map(p =>
      `<span class="gm-player-chip ${p.userId === me.id ? 'is-me' : ''}">${esc(p.username)}</span>`).join('');
  }

  function initOptions(isHost) {
    const langGroup = document.getElementById('tr-lang-group');
    const diffGroup = document.getElementById('tr-diff-group');
    if (!langGroup) return;
    if (!isHost) {
      langGroup.querySelectorAll('.gm-option-btn').forEach(b => b.disabled = true);
      diffGroup.querySelectorAll('.gm-option-btn').forEach(b => b.disabled = true);
      return;
    }
    langGroup.addEventListener('click', e => {
      const btn = e.target.closest('.gm-option-btn');
      if (!btn) return;
      trOptions.lang = btn.dataset.lang;
      updateOptionUI('tr-lang-group', '[data-lang]', '[data-lang="' + trOptions.lang + '"]');
      socket.emit('tr:setoptions', { roomId, lang: trOptions.lang, difficulty: trOptions.difficulty });
    });
    diffGroup.addEventListener('click', e => {
      const btn = e.target.closest('.gm-option-btn');
      if (!btn) return;
      trOptions.difficulty = btn.dataset.diff;
      updateOptionUI('tr-diff-group', '[data-diff]', '[data-diff="' + trOptions.difficulty + '"]');
      socket.emit('tr:setoptions', { roomId, lang: trOptions.lang, difficulty: trOptions.difficulty });
    });
  }

  function updateOptionUI(groupId, allSel, activeSel) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(allSel).forEach(b => b.classList.remove('active'));
    const active = group.querySelector(activeSel);
    if (active) active.classList.add('active');
  }

  window.playAgain = async (gameType) => {
    try {
      const r = await fetch(`/arcade/${gameType}/create`, { method: 'POST' });
      const { roomId } = await r.json();
      window.location.href = `/arcade/${gameType}/${roomId}`;
    } catch { window.location.href = '/arcade'; }
  };

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
