(() => {
  const roomId = window.__ROOM_ID__;
  const me     = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby      = document.getElementById('tq-lobby');
  const game       = document.getElementById('tq-game');
  const startBtn   = document.getElementById('tq-start-btn');
  const lobbyPlayers = document.getElementById('lobby-players');
  const scoreboardEl = document.getElementById('tq-scoreboard');
  const progressBar  = document.getElementById('tq-progress-bar');
  const qnumEl       = document.getElementById('tq-qnum');
  const questionEl   = document.getElementById('tq-question');
  const optionsEl    = document.getElementById('tq-options');
  const timerBar     = document.getElementById('tq-timer-bar');
  const answeredEl   = document.getElementById('tq-answered-count');
  const resultEl     = document.getElementById('tq-result');

  let roomData = null;
  let players  = [];
  let timerInterval = null;
  let currentState  = null;
  let myAnswer = null;

  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      document.getElementById('copy-link-btn').textContent = '✓ คัดลอก';
      setTimeout(() => document.getElementById('copy-link-btn').textContent = '🔗 แชร์', 2000);
    });
  });

  socket.on('connect', () => socket.emit('gm:join', { roomId }));
  socket.on('gm:error', ({ msg }) => alert(msg));

  socket.on('gm:joined', ({ room }) => {
    roomData = room;
    players = room.players;
    renderLobbyPlayers(room);
    if (room.host === me.id) startBtn.classList.remove('hidden');
    updateChips(players);
  });

  socket.on('gm:players', ({ players: pl }) => {
    players = pl;
    renderLobbyPlayers({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state }) => {
    currentState = state;
    myAnswer = null;
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    renderQuestion(state);
  });

  socket.on('tq:state', state => {
    currentState = state;
    myAnswer = null;
    renderQuestion(state);
  });

  socket.on('tq:answered', ({ correct, points }) => {
    // Flash feedback on the selected option
    if (myAnswer !== null) {
      const btn = optionsEl.querySelectorAll('.tq-option')[myAnswer];
      if (btn) btn.classList.add('selected');
    }
  });

  socket.on('tq:result', ({ correctIdx, answers, scores, questionIdx }) => {
    clearInterval(timerInterval);
    timerBar.style.width = '0%';

    // Reveal options
    optionsEl.querySelectorAll('.tq-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      else if (answers[me.id]?.idx === i && i !== correctIdx) btn.classList.add('wrong');
    });

    // Update scoreboard
    renderScoreboard(scores);

    // Show how many answered
    const total = players.length;
    const answered = Object.keys(answers).length;
    answeredEl.textContent = `ตอบแล้ว ${answered}/${total} คน`;
  });

  socket.on('tq:ended', ({ scores }) => {
    clearInterval(timerInterval);
    game.classList.add('hidden');
    showFinalResult(scores);
  });

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีอย่างน้อย 2 คน');
    socket.emit('gm:start', { roomId });
  });

  function renderQuestion(state) {
    const { question, questionIdx, totalQuestions, scores, timerEndsAt } = state;

    progressBar.style.width = ((questionIdx / totalQuestions) * 100) + '%';
    qnumEl.textContent = `ข้อ ${questionIdx + 1} / ${totalQuestions}`;
    questionEl.textContent = question.q;
    answeredEl.textContent = '';

    optionsEl.innerHTML = question.opts.map((opt, i) => `
      <button class="tq-option" data-idx="${i}">${esc(opt)}</button>`).join('');

    optionsEl.querySelectorAll('.tq-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (myAnswer !== null) return;
        myAnswer = Number(btn.dataset.idx);
        optionsEl.querySelectorAll('.tq-option').forEach(b => b.disabled = true);
        btn.classList.add('selected');
        socket.emit('tq:answer', { roomId, idx: myAnswer });
      });
    });

    renderScoreboard(scores);
    startTimer(timerEndsAt);
  }

  function startTimer(endsAt) {
    clearInterval(timerInterval);
    function tick() {
      const left = Math.max(0, endsAt - Date.now());
      const pct  = (left / 15000) * 100;
      timerBar.style.width = pct + '%';
      timerBar.classList.toggle('danger', pct < 25);
      if (left <= 0) clearInterval(timerInterval);
    }
    tick();
    timerInterval = setInterval(tick, 100);
  }

  function renderScoreboard(scores) {
    const sorted = players
      .map(p => ({ ...p, pts: scores[p.userId] || 0 }))
      .sort((a, b) => b.pts - a.pts);
    scoreboardEl.innerHTML = sorted.map(p => `
      <div class="tq-score-item ${p.userId === me.id ? 'is-me' : ''}">
        <span class="tq-score-name">${esc(p.username)}</span>
        <span class="tq-score-pts">${p.pts}</span>
      </div>`).join('');
  }

  function showFinalResult(scores) {
    const sorted = players
      .map(p => ({ ...p, pts: scores[p.userId] || 0 }))
      .sort((a, b) => b.pts - a.pts);
    const ranks = ['🥇','🥈','🥉'];
    const winner = sorted[0];
    const isWinner = winner?.userId === me.id;

    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `
      <div class="gm-result-card">
        <h2>${isWinner ? '🎉 คุณชนะ!' : `🏆 ${esc(winner?.username)} ชนะ!`}</h2>
        <p>ผลคะแนนรอบนี้</p>
        <div class="gm-score-list">
          ${sorted.map((p, i) => `
            <div class="gm-score-row">
              <span class="gm-score-rank">${ranks[i] || (i+1)}</span>
              <span class="gm-score-name">${esc(p.username)}</span>
              <span class="gm-score-pts">${p.pts} pts</span>
            </div>`).join('')}
        </div>
        <div class="gm-result-actions">
          <a href="/arcade/trivia" class="btn-outline">เล่นใหม่</a>
          <a href="/arcade" class="btn-outline">Arcade</a>
        </div>
      </div>`;
  }

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

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
