(() => {
  const roomId  = window.__ROOM_ID__;
  const me      = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby      = document.getElementById('xo-lobby');
  const game       = document.getElementById('xo-game');
  const startBtn   = document.getElementById('xo-start-btn');
  const boardEl    = document.getElementById('xo-board');
  const cells      = boardEl.querySelectorAll('.xo-cell');
  const turnLabel  = document.getElementById('xo-turn-label');
  const p1Info     = document.getElementById('xo-p1-info');
  const p2Info     = document.getElementById('xo-p2-info');
  const resultEl   = document.getElementById('xo-result');
  const actionsEl  = document.getElementById('xo-actions');
  const restartBtn = document.getElementById('xo-restart-btn');
  const lobbyPlayers = document.getElementById('lobby-players');

  let state = null;
  let roomData = null;
  let players = [];

  // Share link
  document.getElementById('copy-link-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(location.href).then(() => {
      document.getElementById('copy-link-btn').textContent = '✓ คัดลอกแล้ว';
      setTimeout(() => document.getElementById('copy-link-btn').textContent = '🔗 แชร์', 2000);
    });
  });

  socket.on('connect', () => socket.emit('gm:join', { roomId }));

  socket.on('gm:error', ({ msg }) => alert(msg));

  socket.on('gm:joined', ({ room, state: st }) => {
    roomData = room;
    players = room.players;
    renderLobbyPlayers(room);
    if (room.host === me.id) startBtn.classList.remove('hidden');
    if (room.status === 'playing' && st && st.board) startGame(st);
  });

  socket.on('gm:players', ({ players: pl }) => {
    showOfflineNotice(pl);
    players = pl;
    renderLobbyPlayers({ players: pl, host: roomData?.host });
    updatePlayerChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => startGame(st));

  socket.on('xo:state', st => {
    state = st;
    renderBoard();
  });

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีผู้เล่น 2 คน');
    socket.emit('gm:start', { roomId });
  });

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (!state || state.winner) return;
      const myMark = state.x === me.id ? 1 : state.o === me.id ? 2 : 0;
      if (!myMark) return;
      if (state.turn !== (myMark - 1)) return;
      socket.emit('xo:move', { roomId, cell: Number(cell.dataset.cell) });
    });
  });

  restartBtn.addEventListener('click', () => socket.emit('xo:restart', { roomId }));

  function startGame(st) {
    state = st;
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    renderPlayerInfos(st);
    renderBoard();
  }

  function renderPlayerInfos(st) {
    const xPlayer = players.find(p => p.userId === st.x) || { username: 'Player X' };
    const oPlayer = players.find(p => p.userId === st.o) || { username: 'Player O' };
    p1Info.innerHTML = `<div class="xo-player-mark" style="color:#818cf8">✕</div><div class="xo-player-name">${esc(xPlayer.username)}</div>`;
    p2Info.innerHTML = `<div class="xo-player-mark" style="color:#f87171">○</div><div class="xo-player-name">${esc(oPlayer.username)}</div>`;
  }

  function renderBoard() {
    if (!state) return;
    const marks = ['', '✕', '○'];
    const classes = ['', 'x-mark', 'o-mark'];
    cells.forEach((cell, i) => {
      const v = state.board[i];
      cell.textContent = marks[v];
      cell.className = 'xo-cell' + (v ? ` ${classes[v]}` : '');
      const isWin = state.winLine && state.winLine.includes(i);
      if (isWin) cell.classList.add('winning');
      cell.disabled = !!state.winner || v !== 0;
    });

    const myMark = state.x === me.id ? 1 : state.o === me.id ? 2 : 0;
    p1Info.classList.toggle('active', state.turn === 0 && !state.winner);
    p2Info.classList.toggle('active', state.turn === 1 && !state.winner);

    if (state.winner) {
      actionsEl.classList.remove('hidden');
      resultEl.classList.remove('hidden');
      if (state.winner === 'draw') {
        resultEl.textContent = '🤝 เสมอ!';
      } else {
        const isWinner = state.winner === me.id;
        const winPlayer = players.find(p => p.userId === state.winner);
        resultEl.textContent = isWinner ? '🎉 คุณชนะ!' : `😔 ${esc(winPlayer?.username || '?')} ชนะ`;
      }
      turnLabel.textContent = '';
    } else {
      actionsEl.classList.add('hidden');
      resultEl.classList.add('hidden');
      const curMark = state.turn === 0 ? '✕' : '○';
      const curPlayer = state.turn === 0 ? state.x : state.o;
      turnLabel.textContent = curPlayer === me.id ? `คุณ (${curMark})` : `รอ…`;
    }
  }

  function renderLobbyPlayers({ players: pl, host }) {
    lobbyPlayers.innerHTML = pl.map(p => `
      <div class="lobby-player-item">
        <span>${esc(p.username)}${p.offline?' 🔴':''}</span>
        ${p.userId === host ? '<span class="host-tag">HOST</span>' : ''}
      </div>`).join('');
    document.getElementById('lobby-status').textContent =
      pl.length < 2 ? `รอผู้เล่นเข้าร่วม… (${pl.length}/2)` : 'พร้อมเริ่มแล้ว!';
  }

  function updatePlayerChips(pl) {
    document.getElementById('gm-players').innerHTML = pl.map(p =>
      `<span class="gm-player-chip ${p.userId===me.id?'is-me':''}${p.offline?' offline':''}">${esc(p.username)}${p.offline?' 🔴':''}</span>`
    ).join('');
  }

  function showOfflineNotice(pl) {
    const gone = pl.find(p => p.offline && p.userId !== me.id);
    let el = document.getElementById('gm-offline-notice');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gm-offline-notice';
      el.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#7f1d1d;color:#fca5a5;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;display:none;';
      document.body.appendChild(el);
    }
    if (gone) { el.textContent = '⚠️ ' + gone.username + ' ออกจากเกม'; el.style.display='block'; }
    else { el.style.display='none'; }
  }
  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
