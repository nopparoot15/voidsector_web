(() => {
  const roomId = window.__ROOM_ID__;
  const me     = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby      = document.getElementById('wb-lobby');
  const game       = document.getElementById('wb-game');
  const startBtn   = document.getElementById('wb-start-btn');
  const lobbyPlayers = document.getElementById('lobby-players');
  const playersRow = document.getElementById('wb-players-row');
  const letterEl   = document.getElementById('wb-letter');
  const lastWordEl = document.getElementById('wb-last-word');
  const timerBar   = document.getElementById('wb-timer-bar');
  const turnLabel  = document.getElementById('wb-turn-label');
  const inputEl    = document.getElementById('wb-input');
  const submitBtn  = document.getElementById('wb-submit-btn');
  const inputRow   = document.getElementById('wb-input-row');
  const invalidEl  = document.getElementById('wb-invalid');
  const usedWords  = document.getElementById('wb-used-words');
  const resultEl   = document.getElementById('wb-result');

  let roomData = null;
  let players  = [];
  let timerInterval = null;
  let state = null;
  let wbLang = 'en';

  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      document.getElementById('copy-link-btn').textContent = '✓ คัดลอก';
      setTimeout(() => document.getElementById('copy-link-btn').textContent = '🔗 แชร์', 2000);
    });
  });

  socket.on('connect', () => socket.emit('gm:join', { roomId }));
  socket.on('gm:error', ({ msg }) => alert(msg));

  socket.on('gm:joined', ({ room, state: st }) => {
    roomData = room;
    players = room.players;
    renderLobbyPlayers(room);
    const isHost = room.host === me.id;
    if (isHost) startBtn.classList.remove('hidden');
    initWBOptions(isHost);
    updateChips(players);
  });

  socket.on('wb:options', ({ lang }) => {
    wbLang = lang;
    const group = document.getElementById('wb-lang-group');
    if (!group) return;
    group.querySelectorAll('.gm-option-btn').forEach(b => b.classList.remove('active'));
    const active = group.querySelector(`[data-lang="${lang}"]`);
    if (active) active.classList.add('active');
  });

  socket.on('gm:players', ({ players: pl }) => {
    players = pl;
    renderLobbyPlayers({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => {
    state = st;
    wbLang = st.lang || 'en';
    inputEl.placeholder = wbLang === 'th' ? 'พิมพ์คำไทย…' : 'type a word…';
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    applyState(st);
  });

  socket.on('wb:state', st => {
    state = st;
    applyState(st);
  });

  socket.on('wb:invalid', ({ reason }) => {
    invalidEl.textContent = reason;
    invalidEl.classList.remove('hidden');
    setTimeout(() => invalidEl.classList.add('hidden'), 2500);
    inputEl.focus();
    inputEl.select();
  });

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีอย่างน้อย 2 คน');
    socket.emit('gm:start', { roomId });
  });

  submitBtn.addEventListener('click', submitWord);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') submitWord(); });

  function submitWord() {
    const word = inputEl.value.trim();
    if (!word) return;
    socket.emit('wb:word', { roomId, word });
    inputEl.value = '';
  }

  function applyState(st) {
    if (!st) return;

    if (st.phase === 'ended') {
      showResult(st);
      return;
    }

    // Players row
    playersRow.innerHTML = st.players.map(p => `
      <div class="wb-player-card ${p.userId === getCurrentPlayer(st)?.userId ? 'is-current' : ''} ${!p.alive ? 'is-dead' : ''}">
        <div class="wb-player-name">${esc(p.username)}</div>
        <div class="wb-player-lives">${'❤️'.repeat(p.lives)}${'🖤'.repeat(3 - p.lives)}</div>
      </div>`).join('');

    // Letter
    const cur = getCurrentPlayer(st);
    const displayLetter = st.lastLetter ? st.lastLetter.toUpperCase() : '—';
    letterEl.textContent = displayLetter;

    // Last word — show word + arrow + required letter for clarity
    if (st.lastWord && st.lastLetter) {
      lastWordEl.innerHTML = `<span class="wb-last-word-text">${esc(st.lastWord)}</span><span class="wb-last-word-arrow"> → </span><span class="wb-last-letter-hint">${displayLetter}</span>`;
    } else {
      lastWordEl.textContent = '';
    }

    // Turn
    const isMyTurn = cur?.userId === me.id;
    turnLabel.textContent = isMyTurn ? '⚡ ตาคุณ!' : `รอ ${esc(cur?.username || '?')}…`;
    inputEl.disabled = !isMyTurn;
    submitBtn.disabled = !isMyTurn;
    if (isMyTurn) inputEl.focus();

    // Used words
    usedWords.innerHTML = st.usedWords.slice().reverse().slice(0, 20)
      .map(w => `<span class="wb-used-word">${esc(w)}</span>`).join('');

    // Timer
    clearInterval(timerInterval);
    startTimer(st.timerEndsAt);
  }

  function startTimer(endsAt) {
    clearInterval(timerInterval);
    function tick() {
      const left = Math.max(0, endsAt - Date.now());
      const pct  = (left / 12000) * 100;
      timerBar.style.width = pct + '%';
      timerBar.classList.toggle('danger', pct < 30);
      if (left <= 0) clearInterval(timerInterval);
    }
    tick();
    timerInterval = setInterval(tick, 100);
  }

  function getCurrentPlayer(st) {
    return st.players[st.currentIdx] || null;
  }

  function showResult(st) {
    clearInterval(timerInterval);
    game.classList.add('hidden');
    const winner = st.players.find(p => p.alive);
    const isWinner = winner?.userId === me.id;
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `
      <div class="gm-result-card">
        <div class="gm-result-icon">${isWinner ? '🏆' : winner ? '🎮' : '🤝'}</div>
        <h2>${winner ? (isWinner ? 'คุณชนะ!' : `${esc(winner.username)} ชนะ!`) : 'เสมอ!'}</h2>
        <p class="gm-result-sub">คำที่ใช้ไปทั้งหมด <strong>${st.usedWords.length}</strong> คำ</p>
        <div class="gm-result-actions">
          <button class="btn-primary" onclick="playAgain('wordbomb')">เล่นใหม่ 🔄</button>
          <a href="/arcade" class="btn-outline">Arcade</a>
        </div>
      </div>`;
  }

  window.playAgain = async (gameType) => {
    try {
      const r = await fetch(`/arcade/${gameType}/create`, { method: 'POST' });
      const { roomId } = await r.json();
      window.location.href = `/arcade/${gameType}/${roomId}`;
    } catch { window.location.href = '/arcade'; }
  };

  function renderLobbyPlayers({ players: pl, host }) {
    lobbyPlayers.innerHTML = pl.map(p => `
      <div class="lobby-player-item">
        <span>${esc(p.username)}</span>
        ${p.userId === host ? '<span class="host-tag">HOST</span>' : ''}
      </div>`).join('');
  }

  function updateChips(pl) {
    document.getElementById('gm-players').innerHTML = pl.map(p =>
      `<span class="gm-player-chip ${p.userId === me.id ? 'is-me' : ''}">${esc(p.username)}</span>`
    ).join('');
  }

  function initWBOptions(isHost) {
    const group = document.getElementById('wb-lang-group');
    if (!group) return;
    if (!isHost) {
      group.querySelectorAll('.gm-option-btn').forEach(b => b.disabled = true);
      return;
    }
    group.addEventListener('click', e => {
      const btn = e.target.closest('.gm-option-btn');
      if (!btn) return;
      wbLang = btn.dataset.lang;
      group.querySelectorAll('.gm-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      socket.emit('wb:setoptions', { roomId, lang: wbLang });
    });
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
