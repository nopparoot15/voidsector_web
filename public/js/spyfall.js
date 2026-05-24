/* public/js/spyfall.js */
(function () {
  'use strict';

  const roomId = String(window.__ROOM_ID__ || '');
  const user   = window.__USER__ || {};
  const myId   = Number(user.id);

  const socket = window.io({ auth: { userId: myId, username: user.username } });

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  const lobby         = $('sf-lobby');
  const game          = $('sf-game');
  const votingOverlay = $('sf-voting');
  const endOverlay    = $('sf-end');

  const lobbyPlayers  = $('sf-lobby-players');
  const startBtn      = $('sf-start-btn');
  const lobbyHint     = $('sf-lobby-hint');
  const timeGroup     = $('sf-time-group');

  const timerEl       = $('sf-timer');
  const turnBanner    = $('sf-turn-banner');

  const cardPlayer    = $('sf-card-player');
  const myLocation    = $('sf-my-location');
  const myRole        = $('sf-my-role');

  const cardSpy       = $('sf-card-spy');
  const locationList  = $('sf-location-list');
  const spyGuessBtn   = $('sf-spy-guess-btn');
  const guessInline   = $('sf-guess-inline');
  const guessTimer    = $('sf-guess-inline-timer');
  const guessConfirm  = $('sf-guess-confirm-btn');
  const guessCancel   = $('sf-guess-cancel-btn');

  const playerList    = $('sf-player-list');

  const accuseBy      = $('sf-accuse-by');
  const accuseTarget  = $('sf-accuse-target');
  const voteYes       = $('sf-vote-yes');
  const voteNo        = $('sf-vote-no');
  const voteTally     = $('sf-vote-tally');
  const voteMsg       = $('sf-vote-msg');

  const endWinner     = $('sf-end-winner');
  const endReason     = $('sf-end-reason');
  const endSpy        = $('sf-end-spy');
  const endLocation   = $('sf-end-location');
  const endGuessRow   = $('sf-end-guess-row');
  const endSpyGuess   = $('sf-end-spy-guess');
  const endRoles      = $('sf-end-roles');
  const newGameBtn    = $('sf-new-game-btn');
  const gmPlayers     = $('gm-players');

  // ── State ─────────────────────────────────────────────────────────────────
  let myMinutes         = 8;
  let timerInterval     = null;
  let timerEndsAt       = 0;
  let guessCountdown    = null;
  let answerCountdown   = null;
  let hasVoted          = false;
  let isHost            = false;
  let isSpy             = false;
  let currentPlayers    = [];
  let currentTurnUserId = null;
  let allLocations      = [];
  let inForcedGuess     = false;
  let pendingAccuseUid  = null;

  // ── Helpers ───────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function show(...els) { els.forEach(e => e?.classList.remove('hidden')); }
  function hide(...els) { els.forEach(e => e?.classList.add('hidden')); }

  function fmtTime(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function startTimerDisplay(endsAt) {
    timerEndsAt = endsAt;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const left = timerEndsAt - Date.now();
      if (timerEl) {
        timerEl.textContent = fmtTime(left);
        timerEl.className = 'sf-timer' + (left < 60000 ? ' sf-timer--warn' : '');
      }
      if (left <= 0) clearInterval(timerInterval);
    }, 500);
  }
  function stopTimer() { clearInterval(timerInterval); }
  function clearAnswerCountdown() { clearInterval(answerCountdown); answerCountdown = null; }

  const MIN_PLAYERS = 4;

  // ── Lobby ─────────────────────────────────────────────────────────────────
  function renderLobbyPlayers(players) {
    currentPlayers = players;
    if (lobbyPlayers) {
      lobbyPlayers.innerHTML = players.map(p =>
        `<div class="sf-lobby-player">
          <span class="sf-lobby-avatar">${esc(p.username[0] || '?').toUpperCase()}</span>
          <span class="sf-lobby-name">${esc(p.username)}${p.userId === myId ? ' <span class="sf-you-tag">คุณ</span>' : ''}</span>
        </div>`
      ).join('');
    }
    if (gmPlayers) {
      gmPlayers.innerHTML = players.map(p =>
        `<span class="gm-player-chip">${esc(p.username)}</span>`
      ).join('');
    }
    if (isHost) {
      const ready = players.length >= MIN_PLAYERS;
      if (ready) { show(startBtn); hide(lobbyHint); }
      else { hide(startBtn); show(lobbyHint); lobbyHint.textContent = `รอผู้เล่นให้ครบ ${MIN_PLAYERS} คน… (${players.length}/${MIN_PLAYERS})`; }
    } else {
      hide(startBtn); show(lobbyHint);
      lobbyHint.textContent = players.length >= MIN_PLAYERS ? 'รอเจ้าของห้องเริ่มเกม…' : `รอผู้เล่นให้ครบ ${MIN_PLAYERS} คน… (${players.length}/${MIN_PLAYERS})`;
    }
  }

  // ── Turn banner ────────────────────────────────────────────────────────────
  function setAskedBanner(askedId, askedName) {
    clearAnswerCountdown();
    currentTurnUserId = askedId;
    if (!turnBanner) return;
    const isMe = askedId === myId;
    turnBanner.className = 'sf-turn-banner ' + (isMe ? 'sf-turn-banner--asked' : 'sf-turn-banner--other');
    turnBanner.innerHTML = isMe
      ? `💬 <strong>ตาคุณตอบ!</strong> ตอบเสร็จแล้วกด <button id="sf-done-answer-btn" class="sf-done-btn">จบเทิร์น ›</button>`
      : `💬 <strong>${esc(askedName)}</strong> กำลังตอบ…`;
    $('sf-done-answer-btn')?.addEventListener('click', () => {
      socket.emit('sp:done_answer', { roomId });
    });
    show(turnBanner);
    renderPlayerList(currentPlayers);
  }

  // ── Player list ────────────────────────────────────────────────────────────
  function renderPlayerList(players) {
    currentPlayers = players;
    if (!playerList) return;

    playerList.innerHTML = players.map(p => {
      const isMe    = p.userId === myId;
      const offline = !!p.offline;
      const active  = currentTurnUserId === p.userId;
      const pending = pendingAccuseUid === p.userId;

      let btns = '';
      if (!isMe && !offline) {
        if (pending) {
          btns = `<button class="sf-btn-accuse-cancel" data-uid="${p.userId}">ยกเลิก</button>
                  <button class="sf-btn-accuse-confirm" data-uid="${p.userId}">ยืนยัน!</button>`;
        } else {
          btns = `<button class="sf-btn-accuse" data-uid="${p.userId}" data-name="${esc(p.username)}">กล่าวหา</button>`;
        }
      }

      return `<div class="sf-prow${active ? ' sf-prow--active' : ''}${offline ? ' sf-prow--offline' : ''}${pending ? ' sf-prow--pending' : ''}">
        <div class="sf-prow-left">
          <span class="sf-prow-avatar">${esc(p.username[0] || '?').toUpperCase()}</span>
          <span class="sf-prow-name">${esc(p.username)}
            ${isMe ? '<span class="sf-you-tag">คุณ</span>' : ''}
            ${active ? '<span class="sf-active-tag">กำลังตอบ</span>' : ''}
            ${offline ? '<span class="sf-offline-tag">ออฟไลน์</span>' : ''}
            ${pending ? '<span class="sf-accuse-tag">กล่าวหา?</span>' : ''}
          </span>
        </div>
        <div class="sf-prow-btns">${btns}</div>
      </div>`;
    }).join('');

    playerList.querySelectorAll('.sf-btn-accuse').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingAccuseUid = Number(btn.dataset.uid);
        renderPlayerList(currentPlayers);
      });
    });
    playerList.querySelectorAll('.sf-btn-accuse-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingAccuseUid = null;
        renderPlayerList(currentPlayers);
      });
    });
    playerList.querySelectorAll('.sf-btn-accuse-confirm').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = Number(btn.dataset.uid);
        pendingAccuseUid = null;
        socket.emit('sp:accuse', { roomId, targetUserId: uid });
      });
    });
  }

  // ── Spy location grid ─────────────────────────────────────────────────────
  function buildSpyGrid() {
    if (!locationList || !allLocations.length) return;
    locationList.innerHTML = allLocations.map(l =>
      `<div class="sf-loc-chip" data-loc="${esc(l)}">${esc(l)}</div>`
    ).join('');
    locationList.onclick = null;
  }

  function makeGridSelectable() {
    if (!locationList) return;
    locationList.querySelectorAll('[data-loc]').forEach(c => c.classList.add('sf-loc-chip--pick'));
    locationList.onclick = (e) => {
      const chip = e.target.closest('[data-loc]');
      if (!chip) return;
      locationList.querySelectorAll('[data-loc]').forEach(c => c.classList.remove('picked'));
      chip.classList.add('picked');
      if (guessConfirm) {
        guessConfirm.removeAttribute('disabled');
        guessConfirm.textContent = `ยืนยัน: ${chip.dataset.loc}`;
        guessConfirm.dataset.loc = chip.dataset.loc;
      }
    };
  }

  function resetGuessConfirm() {
    if (guessConfirm) { guessConfirm.setAttribute('disabled', ''); guessConfirm.textContent = 'เลือกสถานที่ก่อน'; delete guessConfirm.dataset.loc; }
    locationList?.querySelectorAll('[data-loc]').forEach(c => c.classList.remove('picked'));
  }

  function enterVoluntaryGuessMode() {
    makeGridSelectable();
    resetGuessConfirm();
    show(guessInline);
    show(guessCancel);
    hide(spyGuessBtn, guessTimer);
  }

  function enterForcedGuessMode() {
    inForcedGuess = true;
    makeGridSelectable();
    resetGuessConfirm();
    clearInterval(guessCountdown);
    let left = 30;
    if (guessTimer) { guessTimer.textContent = `เหลือ ${left} วินาที`; show(guessTimer); }
    show(guessInline);
    hide(guessCancel, spyGuessBtn);
    guessCountdown = setInterval(() => {
      left--;
      if (guessTimer) guessTimer.textContent = `เหลือ ${left} วินาที`;
      if (left <= 0) clearInterval(guessCountdown);
    }, 1000);
  }

  function cancelSelection() {
    clearInterval(guessCountdown);
    inForcedGuess = false;
    hide(guessInline, guessTimer);
    show(spyGuessBtn);
    buildSpyGrid();
    resetGuessConfirm();
  }

  // ── Phases ─────────────────────────────────────────────────────────────────
  function showLobby() {
    show(lobby); hide(game, votingOverlay, endOverlay);
  }
  function showGame() {
    hide(lobby, votingOverlay, endOverlay); show(game);
  }

  function showVoting(data) {
    show(votingOverlay);
    hasVoted = false;
    voteYes?.removeAttribute('disabled');
    voteNo?.removeAttribute('disabled');
    if (accuseBy)     accuseBy.textContent     = data.accuserUsername;
    if (accuseTarget) accuseTarget.textContent = data.targetUsername;
    if (voteTally)    voteTally.textContent    = '';
    if (voteMsg)      voteMsg.textContent      = '';
    const isTarget  = data.targetUserId  === myId;
    const isAccuser = data.accuserUserId === myId;
    if (isTarget || isAccuser) {
      voteYes?.setAttribute('disabled', '');
      voteNo?.setAttribute('disabled', '');
      if (voteMsg) voteMsg.textContent = isTarget ? 'คุณถูกกล่าวหา — รอผล…' : 'คุณเป็นผู้กล่าวหา — รอโหวต…';
    }
  }

  function showEnd(data) {
    hide(votingOverlay, turnBanner); show(endOverlay);
    stopTimer(); clearInterval(guessCountdown); clearAnswerCountdown();

    const spyWon = data.winner === 'spy';

    if (endWinner) {
      endWinner.textContent = spyWon ? '🕵️ สปายชนะ!' : '🎉 ผู้เล่นชนะ!';
      endWinner.className = 'sf-end-winner ' + (spyWon ? 'sf-end-winner--spy' : 'sf-end-winner--players');
    }
    if (endReason) endReason.textContent = data.reason || '';

    // Location + spy guess
    if (endLocation) endLocation.textContent = data.location || '?';
    if (data.spyGuessedLocation) { show(endGuessRow); if (endSpyGuess) endSpyGuess.textContent = data.spyGuessedLocation; }
    else hide(endGuessRow);

    if (endRoles) endRoles.innerHTML = '';

    if (isHost) show(newGameBtn);
  }

  // ── Socket events ──────────────────────────────────────────────────────────
  socket.emit('gm:join', { roomId });

  socket.on('gm:joined', ({ room, state }) => {
    isHost = room.host === myId;
    currentPlayers = room.players;
    renderLobbyPlayers(room.players);

    if (room.status === 'playing' && state) {
      showGame();
      startTimerDisplay(state.timerEndsAt);
      if (state.askedUserId) setAskedBanner(state.askedUserId, state.askedUsername);
      renderPlayerList(room.players);
      if (state.phase === 'voting' && state.accusation) showVoting(state.accusation);
    } else {
      showLobby();
    }

    const copyBtn = $('copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(location.href).catch(() => {});
        copyBtn.textContent = '✓ คัดลอกแล้ว';
        setTimeout(() => (copyBtn.textContent = '🔗 แชร์'), 1200);
      });
    }
  });

  socket.on('gm:players', ({ players }) => {
    renderLobbyPlayers(players);
    if (!game.classList.contains('hidden')) renderPlayerList(players);
  });

  socket.on('gm:error', ({ msg }) => { alert(msg); });

  socket.on('gm:started', ({ state }) => {
    showGame();
    startTimerDisplay(state.timerEndsAt);
    renderPlayerList(state.players || currentPlayers);
  });

  socket.on('sp:role', ({ isSpy: spy, location, role, allLocations: locs }) => {
    isSpy = spy;
    if (locs && locs.length) allLocations = locs;
    if (spy) {
      show(cardSpy); hide(cardPlayer);
      buildSpyGrid();
    } else {
      show(cardPlayer); hide(cardSpy);
      if (myLocation) myLocation.textContent = location || '?';
      if (myRole)     myRole.textContent     = role     || '?';
    }
  });

  socket.on('sp:asking', ({ askedUserId, askedUsername }) => {
    setAskedBanner(askedUserId, askedUsername);
  });

  socket.on('sp:accusation', data => { showVoting(data); });

  socket.on('sp:vote_update', ({ votes, total, guilty, innocent }) => {
    if (voteTally) voteTally.textContent = `โหวตแล้ว ${votes}/${total} — ผิด: ${guilty}  ไม่ใช่: ${innocent}`;
  });

  socket.on('sp:spy_caught', ({ spyUserId, spyUsername }) => {
    hide(votingOverlay);
    if (myId !== spyUserId) {
      const banner = document.createElement('div');
      banner.className = 'sf-caught-banner';
      banner.textContent = `🕵️ ${spyUsername} โดนจับ! รอสปายเดาสถานที่…`;
      game.prepend(banner);
    }
  });

  socket.on('sp:your_turn_guess', () => {
    document.querySelectorAll('.sf-caught-banner').forEach(b => b.remove());
    enterForcedGuessMode();
  });

  socket.on('sp:vote_resolved', ({ timerEndsAt: newEnd }) => {
    hide(votingOverlay);
    document.querySelectorAll('.sf-caught-banner').forEach(b => b.remove());
    if (newEnd) startTimerDisplay(newEnd);
  });

  socket.on('sp:ended', data => { showEnd(data); });

  socket.on('sp:reset', () => {
    isSpy = false; hasVoted = false; inForcedGuess = false; pendingAccuseUid = null;
    currentTurnUserId = null; allLocations = [];
    stopTimer(); clearInterval(guessCountdown); clearAnswerCountdown();
    hide(cardSpy, cardPlayer, guessInline, guessTimer, turnBanner);
    show(spyGuessBtn);
    document.querySelectorAll('.sf-caught-banner').forEach(b => b.remove());
    showLobby();
    renderLobbyPlayers(currentPlayers);
  });

  // ── UI actions ─────────────────────────────────────────────────────────────
  if (timeGroup) {
    timeGroup.querySelectorAll('.sf-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeGroup.querySelectorAll('.sf-time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        myMinutes = Number(btn.dataset.minutes);
      });
    });
  }

  startBtn?.addEventListener('click', () => {
    socket.emit('gm:set_option', { roomId, key: 'minutes', value: myMinutes });
    socket.emit('gm:start', { roomId });
  });

  voteYes?.addEventListener('click', () => {
    if (hasVoted) return; hasVoted = true;
    voteYes.setAttribute('disabled', ''); voteNo?.setAttribute('disabled', '');
    socket.emit('sp:vote', { roomId, guilty: true });
  });

  voteNo?.addEventListener('click', () => {
    if (hasVoted) return; hasVoted = true;
    voteYes?.setAttribute('disabled', ''); voteNo.setAttribute('disabled', '');
    socket.emit('sp:vote', { roomId, guilty: false });
  });

  spyGuessBtn?.addEventListener('click', () => { enterVoluntaryGuessMode(); });

  guessCancel?.addEventListener('click', () => { cancelSelection(); });

  guessConfirm?.addEventListener('click', () => {
    const loc = guessConfirm.dataset.loc;
    if (!loc) return;
    guessConfirm.setAttribute('disabled', '');
    socket.emit('sp:guess', { roomId, location: loc });
  });

  newGameBtn?.addEventListener('click', () => {
    socket.emit('sp:new_game', { roomId });
  });


})();
