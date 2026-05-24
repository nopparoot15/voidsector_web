(() => {
  const roomId = window.__ROOM_ID__;
  const me = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby   = document.getElementById('rps-lobby');
  const game    = document.getElementById('rps-game');
  const results = document.getElementById('rps-results');
  const startBtn = document.getElementById('rps-start-btn');
  const lobbyPlayers = document.getElementById('lobby-players');

  const EMOJI = { rock: '✊', paper: '🖐️', scissors: '✌️' };
  const LABEL = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };

  let state = null;
  let roomData = null;
  let players = [];
  let timerInterval = null;
  let chosen = false;
  let history = [];

  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      document.getElementById('copy-link-btn').textContent = '✓ คัดลอกแล้ว';
      setTimeout(() => document.getElementById('copy-link-btn').textContent = '🔗 แชร์', 2000);
    });
  });

  socket.on('connect', () => socket.emit('gm:join', { roomId }));
  socket.on('gm:error', ({ msg }) => alert(msg));

  socket.on('gm:joined', ({ room }) => {
    roomData = room; players = room.players;
    renderLobby(room);
    if (room.host === me.id) startBtn.classList.remove('hidden');
  });

  socket.on('gm:players', ({ players: pl }) => {
    players = pl;
    renderLobby({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => startGame(st));

  socket.on('rps:chose', () => {
    chosen = true;
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.add('locked'));
    document.getElementById('rps-hint').textContent = '✓ รอคู่ต่อสู้…';
  });

  socket.on('rps:reveal', ({ round, choices, winnerId, scores }) => {
    clearInterval(timerInterval);
    chosen = false;
    document.querySelectorAll('.rps-btn').forEach(b => { b.classList.remove('locked', 'selected'); b.disabled = true; });
    const [p1, p2] = players;
    const c1 = choices[p1.userId];
    const c2 = choices[p2.userId];
    document.getElementById('rps-left').innerHTML = `<div class="rps-choice-display">${EMOJI[c1] || '?'}</div><div class="rps-choice-name">${LABEL[c1] || '?'}</div>`;
    document.getElementById('rps-right').innerHTML = `<div class="rps-choice-display">${EMOJI[c2] || '?'}</div><div class="rps-choice-name">${LABEL[c2] || '?'}</div>`;
    document.getElementById('rps-left').className = 'rps-side' + (winnerId === p1.userId ? ' rps-win' : winnerId === 'draw' ? '' : ' rps-lose');
    document.getElementById('rps-right').className = 'rps-side' + (winnerId === p2.userId ? ' rps-win' : winnerId === 'draw' ? '' : ' rps-lose');
    history.push({ round, choices, winnerId });
    renderScoreboard(scores);
    let hint = '';
    if (winnerId === 'draw') hint = '🤝 เสมอ!';
    else if (winnerId === me.id) hint = '🎉 คุณชนะรอบนี้!';
    else hint = '😔 แพ้รอบนี้';
    document.getElementById('rps-hint').textContent = hint;
  });

  socket.on('rps:round', ({ round, timerEndsAt }) => {
    document.getElementById('rps-round-label').textContent = `รอบที่ ${round}`;
    document.getElementById('rps-left').innerHTML = '';
    document.getElementById('rps-right').innerHTML = '';
    document.getElementById('rps-left').className = 'rps-side';
    document.getElementById('rps-right').className = 'rps-side';
    document.querySelectorAll('.rps-btn').forEach(b => { b.classList.remove('locked','selected'); b.disabled = false; });
    document.getElementById('rps-hint').textContent = 'เลือกได้เลย!';
    startTimer(timerEndsAt);
  });

  socket.on('rps:ended', ({ scores, winner }) => showResults(scores, winner));

  startBtn.addEventListener('click', () => {
    if (players.length !== 2) return alert('ต้องมีผู้เล่นพอดี 2 คน');
    socket.emit('gm:start', { roomId });
  });

  document.querySelectorAll('.rps-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (chosen) return;
      const choice = btn.dataset.c;
      document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      socket.emit('rps:choose', { roomId, choice });
    });
  });

  function startGame(st) {
    state = st;
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    renderScoreboard(st.scores);
    document.getElementById('rps-round-label').textContent = `รอบที่ ${st.round}`;
    startTimer(st.timerEndsAt);
  }

  function startTimer(endsAt) {
    clearInterval(timerInterval);
    const el = document.getElementById('rps-timer');
    timerInterval = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      el.textContent = left;
      el.className = 'rps-timer' + (left <= 3 ? ' rps-timer--urgent' : '');
      if (left <= 0) clearInterval(timerInterval);
    }, 200);
  }

  function renderScoreboard(scores) {
    if (!players.length) return;
    document.getElementById('rps-scoreboard').innerHTML = players.map(p => `
      <div class="rps-score-item ${p.userId === me.id ? 'is-me' : ''}">
        <span class="rps-score-name">${esc(p.username)}</span>
        <span class="rps-score-val">${scores[p.userId] || 0}</span>
      </div>`).join('<div class="rps-score-sep">–</div>');
  }

  function showResults(scores, winner) {
    clearInterval(timerInterval);
    game.classList.add('hidden');
    results.classList.remove('hidden');
    const winPlayer = players.find(p => p.userId === winner);
    const isWinner = winner === me.id;
    document.getElementById('rps-winner-display').innerHTML = `
      <div class="rps-winner-icon">${isWinner ? '🏆' : '🎮'}</div>
      <h2>${isWinner ? 'คุณชนะ!' : `${esc(winPlayer?.username || '?')} ชนะ!`}</h2>`;
    document.getElementById('rps-final-scores').innerHTML = players.map(p => `
      <div class="rps-final-row ${p.userId === winner ? 'is-winner' : ''}">
        <span>${esc(p.username)}</span><span>${scores[p.userId] || 0} แต้ม</span>
      </div>`).join('');
    document.getElementById('rps-history').innerHTML = history.map(h => {
      const [p1, p2] = players;
      const c1 = h.choices[p1.userId];
      const c2 = h.choices[p2.userId];
      return `<div class="rps-hist-row">
        <span>รอบ ${h.round}</span>
        <span>${EMOJI[c1] || '?'}</span><span>vs</span><span>${EMOJI[c2] || '?'}</span>
        <span class="rps-hist-result">${h.winnerId === 'draw' ? 'เสมอ' : h.winnerId === me.id ? 'ชนะ ✓' : 'แพ้'}</span>
      </div>`;
    }).join('');
    const actionsEl = document.getElementById('rps-result-actions');
    if (actionsEl) actionsEl.classList.remove('hidden');
  }

  function renderLobby({ players: pl, host }) {
    lobbyPlayers.innerHTML = pl.map(p => `
      <div class="lobby-player-item">
        <span>${esc(p.username)}</span>
        ${p.userId === host ? '<span class="host-tag">HOST</span>' : ''}
      </div>`).join('');
    document.getElementById('rps-start-btn').classList.toggle('hidden', pl.length !== 2 || !roomData || roomData.host !== me.id);
  }

  function updateChips(pl) {
    document.getElementById('gm-players').innerHTML = pl.map(p =>
      `<span class="gm-player-chip ${p.userId === me.id ? 'is-me' : ''}">${esc(p.username)}</span>`).join('');
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
