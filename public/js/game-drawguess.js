(() => {
  const roomId = window.__ROOM_ID__;
  const me = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby   = document.getElementById('dg-lobby');
  const game    = document.getElementById('dg-game');
  const results = document.getElementById('dg-results');
  const startBtn = document.getElementById('dg-start-btn');
  const lobbyPlayers = document.getElementById('lobby-players');
  const canvas  = document.getElementById('dg-canvas');
  const ctx     = canvas.getContext('2d');
  const tools   = document.getElementById('dg-tools');
  const guessRow = document.getElementById('dg-guess-row');
  const guessInput = document.getElementById('dg-guess-input');
  const chatBox = document.getElementById('dg-chat-box');
  const overlay = document.getElementById('dg-overlay');

  let state = null;
  let roomData = null;
  let players = [];
  let isDrawer = false;
  let timerInterval = null;
  let drawing = false;
  let currentColor = '#ffffff';
  let currentSize = 4;
  let currentTool = 'pen';
  let lastPt = null;

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
    if (room.host === me.id) startBtn.classList.remove('hidden');
    if (room.status === 'playing' && st) startGame(st);
  });

  socket.on('gm:players', ({ players: pl }) => {
    showOfflineNotice(pl);
    players = pl;
    renderLobby({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => startGame(st));

  socket.on('dg:word', ({ word }) => {
    document.getElementById('dg-word-display').textContent = word;
    document.getElementById('dg-word-display').classList.add('dg-word--known');
  });

  socket.on('dg:stroke', ({ pts, color, size, tool }) => {
    if (!pts || pts.length < 4) return;
    ctx.save();
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0] * canvas.width, pts[1] * canvas.height);
    for (let i = 2; i < pts.length; i += 2) {
      ctx.lineTo(pts[i] * canvas.width, pts[i+1] * canvas.height);
    }
    ctx.stroke();
    ctx.restore();
  });

  socket.on('dg:clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  socket.on('dg:chat', ({ userId, username, text }) => {
    addChat(username, text, false, userId === me.id);
  });

  socket.on('dg:correct', ({ userId, username, points, scores }) => {
    const isMe = userId === me.id;
    addChat(username, `✓ ทายถูก! +${points}`, true, isMe);
    state.scores = scores;
    renderScores();
    if (isMe) {
      guessInput.disabled = true;
      document.getElementById('dg-guess-btn').disabled = true;
      guessInput.placeholder = '✓ ทายถูกแล้ว!';
    }
  });

  socket.on('dg:roundend', ({ word, scores }) => {
    clearInterval(timerInterval);
    state.scores = scores;
    document.getElementById('dg-overlay-word').textContent = word;
    document.getElementById('dg-overlay-sub').textContent = 'รอบถัดไปเริ่มเลย…';
    overlay.classList.remove('hidden');
    renderScores();
  });

  socket.on('dg:newround', (st) => {
    overlay.classList.add('hidden');
    updateGameState(st);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    chatBox.innerHTML = '';
    guessInput.disabled = false;
    document.getElementById('dg-guess-btn').disabled = false;
    guessInput.placeholder = 'พิมพ์คำตอบ…';
    guessInput.value = '';
  });

  socket.on('dg:ended', ({ scores }) => showResults(scores));

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีผู้เล่นอย่างน้อย 2 คน');
    socket.emit('gm:start', { roomId });
  });

  // Guess submission
  function submitGuess() {
    const text = guessInput.value.trim();
    if (!text || isDrawer) return;
    socket.emit('dg:guess', { roomId, text });
    guessInput.value = '';
  }
  document.getElementById('dg-guess-btn').addEventListener('click', submitGuess);
  guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(); });

  // Color picker
  document.getElementById('dg-colors').addEventListener('click', e => {
    const btn = e.target.closest('.dg-color');
    if (!btn) return;
    document.querySelectorAll('.dg-color').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    currentTool = 'pen';
    document.getElementById('dg-eraser-btn').classList.remove('active');
  });

  document.getElementById('dg-size').addEventListener('input', e => { currentSize = Number(e.target.value); });

  document.getElementById('dg-eraser-btn').addEventListener('click', () => {
    currentTool = currentTool === 'eraser' ? 'pen' : 'eraser';
    document.getElementById('dg-eraser-btn').classList.toggle('active', currentTool === 'eraser');
  });

  document.getElementById('dg-clear-btn').addEventListener('click', () => {
    socket.emit('dg:clear', { roomId });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Drawing events
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
  }

  let strokePts = [];

  function startStroke(e) {
    if (!isDrawer) return;
    e.preventDefault();
    drawing = true;
    strokePts = [];
    const pt = getPos(e);
    strokePts.push(pt.x, pt.y);
    lastPt = pt;
    drawLocal([pt.x, pt.y, pt.x, pt.y]);
  }

  function continueStroke(e) {
    if (!isDrawer || !drawing) return;
    e.preventDefault();
    const pt = getPos(e);
    strokePts.push(pt.x, pt.y);
    if (strokePts.length >= 4) {
      drawLocal(strokePts.slice(-4));
    }
    if (strokePts.length >= 20) flushStroke();
    lastPt = pt;
  }

  function endStroke() {
    if (!drawing) return;
    drawing = false;
    if (strokePts.length >= 2) flushStroke(true);
    strokePts = [];
  }

  function flushStroke(final = false) {
    if (strokePts.length < 4 && !final) return;
    socket.emit('dg:stroke', { roomId, pts: [...strokePts], color: currentColor, size: currentSize, tool: currentTool });
    const last = strokePts.slice(-2);
    strokePts = final ? [] : [...last];
  }

  function drawLocal(pts) {
    ctx.save();
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0] * canvas.width, pts[1] * canvas.height);
    ctx.lineTo(pts[2] * canvas.width, pts[3] * canvas.height);
    ctx.stroke();
    ctx.restore();
  }

  canvas.addEventListener('mousedown', startStroke);
  canvas.addEventListener('mousemove', continueStroke);
  canvas.addEventListener('mouseup', endStroke);
  canvas.addEventListener('mouseleave', endStroke);
  canvas.addEventListener('touchstart', startStroke, { passive: false });
  canvas.addEventListener('touchmove', continueStroke, { passive: false });
  canvas.addEventListener('touchend', endStroke);

  function startGame(st) {
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    updateGameState(st);
  }

  function updateGameState(st) {
    state = st;
    isDrawer = st.drawer === me.id;
    tools.classList.toggle('hidden', !isDrawer);
    guessRow.classList.toggle('hidden', isDrawer);
    if (isDrawer) {
      guessInput.disabled = true;
    } else {
      guessInput.disabled = false;
      guessInput.focus();
    }
    const drawerPlayer = players.find(p => p.userId === st.drawer);
    document.getElementById('dg-round-info').textContent = `รอบ ${st.round}/${st.totalRounds} — ${esc(drawerPlayer?.username || '?')} วาด`;
    if (!isDrawer) {
      const hint = '_ '.repeat(st.wordLength).trim();
      document.getElementById('dg-word-display').textContent = hint;
      document.getElementById('dg-word-display').classList.remove('dg-word--known');
    }
    renderScores();
    startTimer(st.timerEndsAt);
    if (st.chat) st.chat.forEach(e => addChat(e.username, e.text, false, e.userId === me.id));
  }

  function startTimer(endsAt) {
    clearInterval(timerInterval);
    const el = document.getElementById('dg-timer');
    timerInterval = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      el.textContent = left;
      el.className = 'dg-timer' + (left <= 10 ? ' dg-timer--urgent' : '');
      if (left <= 0) clearInterval(timerInterval);
    }, 200);
  }

  function renderScores() {
    if (!state) return;
    const sorted = [...players].sort((a, b) => (state.scores[b.userId] || 0) - (state.scores[a.userId] || 0));
    document.getElementById('dg-scores').innerHTML = sorted.map((p, i) => `
      <div class="dg-score-row ${p.userId === me.id ? 'is-me' : ''}">
        <span class="dg-score-rank">${i + 1}</span>
        <span class="dg-score-name">${esc(p.username)}${p.userId === state.drawer ? ' 🖌️' : ''}</span>
        <span class="dg-score-val">${state.scores[p.userId] || 0}</span>
      </div>`).join('');
  }

  function addChat(username, text, correct, isMe) {
    const div = document.createElement('div');
    div.className = `dg-chat-entry${correct ? ' dg-chat--correct' : ''}${isMe ? ' dg-chat--me' : ''}`;
    div.innerHTML = `<span class="dg-chat-user">${esc(username)}:</span> <span>${esc(text)}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showResults(scores) {
    clearInterval(timerInterval);
    game.classList.add('hidden');
    results.classList.remove('hidden');
    const sorted = [...players].sort((a, b) => (scores[b.userId] || 0) - (scores[a.userId] || 0));
    const medals = ['🥇','🥈','🥉'];
    document.getElementById('dg-final-table').innerHTML = sorted.map((p, i) => `
      <div class="dg-final-row ${p.userId === me.id ? 'is-me' : ''}">
        <span>${medals[i] || `#${i+1}`}</span>
        <span>${esc(p.username)}${p.offline?' 🔴':''}</span>
        <span>${scores[p.userId] || 0} คะแนน</span>
      </div>`).join('') + `
    <div class="gm-result-actions" style="margin-top:1.5rem">
      <button class="btn-primary" onclick="playAgain('drawguess')">เล่นใหม่ 🔄</button>
      <a href="/arcade" class="btn-outline">Arcade</a>
    </div>`;
  }

  window.playAgain = () => socket.emit('gm:new_game', { roomId });

  socket.on('gm:reset', () => {
    results.classList.add('hidden');
    game.classList.add('hidden');
    lobby.classList.remove('hidden');
    startBtn.classList.toggle('hidden', roomData?.host !== me.id);
    overlay.classList.add('hidden');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function renderLobby({ players: pl, host }) {
    renderLobbyPlayersHTML(pl, host);
    document.getElementById('lobby-status') && (document.getElementById('lobby-status').textContent =
      pl.length < 2 ? `รอผู้เล่น… (${pl.length}/2+)` : 'พร้อมแล้ว!');
    if (roomData && roomData.host === me.id) startBtn.classList.remove('hidden');
  }
})();
