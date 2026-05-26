(() => {
  const roomId = window.__ROOM_ID__;
  const me = window.__USER__;
  if (!me) return;

  const socket = io({ auth: { userId: me.id, username: me.username } });

  const lobby      = document.getElementById('ck-lobby');
  const game       = document.getElementById('ck-game');
  const startBtn   = document.getElementById('ck-start-btn');
  const boardEl    = document.getElementById('ck-board');
  const statusEl   = document.getElementById('ck-status');
  const resultEl   = document.getElementById('ck-result');
  const actionsEl  = document.getElementById('ck-actions');
  const restartBtn = document.getElementById('ck-restart-btn');
  const resignBtn  = document.getElementById('ck-resign-btn');
  const timerEl    = document.getElementById('ck-timer');
  const lobbyPlayers = document.getElementById('lobby-players');

  let state = null, players = [], roomData = null;
  let selected = null;
  let timerInterval = null;

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
    renderLobbyPlayers(room);
    if (room.host === me.id) startBtn.classList.remove('hidden');
    if (room.status === 'playing' && st?.board) startGame(st);
  });

  socket.on('gm:players', ({ players: pl }) => {
    players = pl;
    renderLobbyPlayers({ players: pl, host: roomData?.host });
    updateChips(pl);
  });

  socket.on('gm:started', ({ state: st }) => startGame(st));
  socket.on('checkers:state', st => { state = st; selected = null; renderBoard(); startTimer(); });

  startBtn.addEventListener('click', () => {
    if (players.length < 2) return alert('ต้องมีผู้เล่น 2 คน');
    socket.emit('gm:start', { roomId });
  });
  restartBtn.addEventListener('click', () => socket.emit('checkers:restart', { roomId }));
  resignBtn.addEventListener('click', () => {
    if (confirm('ยืนยันการยอมแพ้?')) socket.emit('checkers:resign', { roomId });
  });

  function startGame(st) {
    state = st; selected = null;
    lobby.classList.add('hidden');
    game.classList.remove('hidden');
    renderNames(st);
    renderBoard();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerInterval);
    if (!state || state.winner) { timerEl.textContent = '—'; timerEl.className = 'ck-timer'; return; }
    timerInterval = setInterval(() => {
      if (!state || state.winner) { clearInterval(timerInterval); timerEl.textContent = '—'; timerEl.className = 'ck-timer'; return; }
      const left = Math.max(0, Math.ceil((state.timerEndsAt - Date.now()) / 1000));
      timerEl.textContent = left + 's';
      timerEl.className = 'ck-timer' + (left <= 10 ? ' danger' : '');
    }, 250);
  }

  function renderNames(st) {
    const p1 = players.find(p => p.userId === st.p1) || { username: 'ผู้เล่น 1' };
    const p2 = players.find(p => p.userId === st.p2) || { username: 'ผู้เล่น 2' };
    document.getElementById('ck-p1-name').textContent = p1.username;
    document.getElementById('ck-p2-name').textContent = p2.username;
  }

  // ── Board logic (client-side, mirrors server) ─────────────────────────────
  function captures(board, idx, player) {
    const r=Math.floor(idx/8),c=idx%8;
    const isKing=board[idx]===3||board[idx]===4;
    const opp=player===1?[2,4]:[1,3];
    // Kings capture all 4 directions; regular pieces capture forward only
    const dirs=[];
    if(player===1||isKing)dirs.push([-1,-1],[-1,1]);
    if(player===2||isKing)dirs.push([1,-1],[1,1]);
    const out=[];
    for(const[dr,dc]of dirs){
      if(isKing){
        let nr=r+dr,nc=c+dc;
        while(nr>=0&&nr<8&&nc>=0&&nc<8){
          if(opp.includes(board[nr*8+nc])){
            const lr=nr+dr,lc=nc+dc;
            if(lr>=0&&lr<8&&lc>=0&&lc<8&&board[lr*8+lc]===0)out.push({to:lr*8+lc,over:nr*8+nc});
            break;
          } else if(board[nr*8+nc]!==0) break;
          nr+=dr;nc+=dc;
        }
      } else {
        const mr=r+dr,mc=c+dc,lr=r+2*dr,lc=c+2*dc;
        if(mr<0||mr>7||mc<0||mc>7||lr<0||lr>7||lc<0||lc>7)continue;
        if(opp.includes(board[mr*8+mc])&&board[lr*8+lc]===0)out.push({to:lr*8+lc,over:mr*8+mc});
      }
    }
    return out;
  }
  function moves(board, idx, player) {
    const r=Math.floor(idx/8),c=idx%8;
    const isKing=board[idx]===3||board[idx]===4;
    const dirs=[];
    if(player===1||isKing)dirs.push([-1,-1],[-1,1]);
    if(player===2||isKing)dirs.push([1,-1],[1,1]);
    const out=[];
    for(const[dr,dc]of dirs){
      if(isKing){
        let nr=r+dr,nc=c+dc;
        while(nr>=0&&nr<8&&nc>=0&&nc<8&&board[nr*8+nc]===0){
          out.push({to:nr*8+nc});
          nr+=dr;nc+=dc;
        }
      } else {
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<8&&nc>=0&&nc<8&&board[nr*8+nc]===0)out.push({to:nr*8+nc});
      }
    }
    return out;
  }
  function mustCapturePieces(board, player) {
    const pieces=player===1?[1,3]:[2,4];
    return Array.from({length:64},(_,i)=>i).filter(i=>pieces.includes(board[i])&&captures(board,i,player).length>0);
  }

  function getValidTargets(idx) {
    if (!state) return [];
    const player = state.p1===me.id?1:state.p2===me.id?2:0;
    if (!player || player!==state.turn) return [];
    const must = state.multiJumpFrom!=null ? [] : mustCapturePieces(state.board, player);
    if (state.multiJumpFrom!=null && idx!==state.multiJumpFrom) return [];
    if (must.length>0 && !must.includes(idx)) return [];
    const caps = captures(state.board, idx, player);
    if (caps.length>0) return caps.map(m=>m.to);
    if (must.length>0) return [];
    return moves(state.board, idx, player).map(m=>m.to);
  }

  function renderBoard() {
    if (!state) return;
    const player = state.p1===me.id?1:state.p2===me.id?2:0;
    const flipped = player === 2; // p2 sees the board flipped so their pieces are at the bottom
    const myPieces = player===1?[1,3]:player===2?[2,4]:[];
    const must = mustCapturePieces(state.board, player);
    const validTargets = selected!=null ? getValidTargets(selected) : [];
    const canSelectIdxs = player && player===state.turn && !state.winner
      ? (state.multiJumpFrom!=null ? [state.multiJumpFrom]
        : must.length>0 ? must
        : Array.from({length:64},(_,i)=>i).filter(i=>myPieces.includes(state.board[i])&&(captures(state.board,i,player).length>0||moves(state.board,i,player).length>0)))
      : [];

    boardEl.innerHTML = '';
    for (let vr=0;vr<8;vr++) {
      for (let vc=0;vc<8;vc++) {
        const r = flipped ? 7-vr : vr;
        const c = flipped ? 7-vc : vc;
        const idx=r*8+c;
        const isDark=(r+c)%2===1;
        const cell=document.createElement('div');
        cell.className='ck-cell'+(isDark?' dark':' light');
        cell.dataset.idx=idx;

        if (isDark) {
          if (idx===selected) cell.classList.add('selected');
          else if (validTargets.includes(idx)) cell.classList.add('can-move');
          else if (canSelectIdxs.includes(idx)) cell.classList.add('selectable');

          const v=state.board[idx];
          if (v>0) {
            const piece=document.createElement('div');
            const p=v===1||v===3?'p1':'p2';
            piece.className=`ck-piece ${p}${(v===3||v===4)?' king':''}`;
            if(idx===selected)piece.classList.add('selected-piece');
            cell.appendChild(piece);
          }
          cell.addEventListener('click', ()=>onCellClick(idx));
        }
        boardEl.appendChild(cell);
      }
    }

    // Piece counts
    const p1cnt=state.board.filter(v=>v===1||v===3).length;
    const p2cnt=state.board.filter(v=>v===2||v===4).length;
    document.getElementById('ck-p1-count').textContent=`(${p1cnt})`;
    document.getElementById('ck-p2-count').textContent=`(${p2cnt})`;
    document.getElementById('ck-p1').classList.toggle('active', state.turn===1&&!state.winner);
    document.getElementById('ck-p2').classList.toggle('active', state.turn===2&&!state.winner);

    const isPlayer = player === 1 || player === 2;

    if (state.winner) {
      const winPlayer=players.find(p=>p.userId===state.winner);
      const isMe=state.winner===me.id;
      resultEl.textContent=isMe?'🎉 คุณชนะ!':`😔 ${esc(winPlayer?.username||'?')} ชนะ`;
      resultEl.classList.remove('hidden');
      actionsEl.classList.remove('hidden');
      resignBtn.classList.add('hidden');
      restartBtn.classList.remove('hidden');
      statusEl.textContent='';
    } else {
      resultEl.classList.add('hidden');
      actionsEl.classList.toggle('hidden', !isPlayer);
      resignBtn.classList.toggle('hidden', !isPlayer);
      restartBtn.classList.add('hidden');
      if (player && player===state.turn) {
        statusEl.textContent = state.multiJumpFrom!=null ? '🔴 กระโดดต่อได้อีก!' : (must.length>0?'⚠️ ต้องกินหมาก!':'ตาคุณ — เลือกหมาก');
      } else {
        const cur=players.find(p=>p.userId===(state.turn===1?state.p1:state.p2));
        statusEl.textContent=`รอ ${esc(cur?.username||'?')}…`;
      }
    }
  }

  function onCellClick(idx) {
    if (!state || state.winner) return;
    const player = state.p1===me.id?1:state.p2===me.id?2:0;
    if (!player || player!==state.turn) return;

    if (selected!=null && getValidTargets(selected).includes(idx)) {
      socket.emit('checkers:move', { roomId, from: selected, to: idx });
      selected = null;
      return;
    }

    const myPieces=player===1?[1,3]:[2,4];
    if (myPieces.includes(state.board[idx])) {
      if (state.multiJumpFrom!=null && idx!==state.multiJumpFrom) return;
      selected = idx===selected ? null : idx;
      renderBoard();
    } else {
      selected = null;
      renderBoard();
    }
  }

  function renderLobbyPlayers({ players: pl, host }) {
    lobbyPlayers.innerHTML = pl.map(p => `
      <div class="lobby-player-item">
        <span>${esc(p.username)}</span>
        ${p.userId===host?'<span class="host-tag">HOST</span>':''}
      </div>`).join('');
    document.getElementById('lobby-status').textContent =
      pl.length<2?`รอผู้เล่นเข้าร่วม… (${pl.length}/2)`:'พร้อมเริ่ม!';
  }

  function updateChips(pl) {
    document.getElementById('gm-players').innerHTML = pl.map(p =>
      `<span class="gm-player-chip ${p.userId===me.id?'is-me':''}">${esc(p.username)}</span>`
    ).join('');
  }

  function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})();
