/* public/js/spyfall.js */
(function () {
  'use strict';

  const roomId = String(window.__ROOM_ID__ || '');
  const user   = window.__USER__ || {};
  const myId   = Number(user.id);

  const socket = window.io({ auth: { userId: myId, username: user.username } });

  // ── DOM refs ─────────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const lobby        = $('sf-lobby');
  const game         = $('sf-game');
  const votingOverlay= $('sf-voting');
  const guessOverlay = $('sf-spy-guess');
  const endOverlay   = $('sf-end');

  const lobbyPlayers = $('sf-lobby-players');
  const startBtn     = $('sf-start-btn');
  const lobbyHint    = $('sf-lobby-hint');
  const timeGroup    = $('sf-time-group');

  const timerEl      = $('sf-timer');
  const cardSpy      = $('sf-card-spy');
  const cardPlayer   = $('sf-card-player');
  const myLocation   = $('sf-my-location');
  const myRole       = $('sf-my-role');
  const locationHints    = $('sf-location-hints');
  const locationList     = $('sf-location-list');
  const locLabel         = $('sf-loc-label');
  const guessInline      = $('sf-guess-inline');
  const guessInlineTimer = $('sf-guess-inline-timer');
  const guessConfirmBtn  = $('sf-guess-confirm-btn');
  const playerList   = $('sf-player-list');
  const turnBanner   = $('sf-turn-banner');

  const accuseBy     = $('sf-accuse-by');
  const accuseTarget = $('sf-accuse-target');
  const voteYes      = $('sf-vote-yes');
  const voteNo       = $('sf-vote-no');
  const voteTally    = $('sf-vote-tally');
  const voteMsg      = $('sf-vote-msg');

  const spyGuessBtn    = $('sf-spy-guess-btn');

  const endWinner    = $('sf-end-winner');
  const endReason    = $('sf-end-reason');
  const endSpy       = $('sf-end-spy');
  const endLocation  = $('sf-end-location');
  const endGuessRow  = $('sf-end-guess-row');
  const endSpyGuess  = $('sf-end-spy-guess');
  const endRoles     = $('sf-end-roles');
  const newGameBtn   = $('sf-new-game-btn');

  const gmPlayers    = $('gm-players');

  // ── State ────────────────────────────────────────────────────────────────────
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

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function show(...els) { els.forEach(e => e?.classList.remove('hidden')); }
  function hide(...els) { els.forEach(e => e?.classList.add('hidden')); }

  function fmtTime(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function startTimerDisplay(endsAt) {
    timerEndsAt = endsAt;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const left = timerEndsAt - Date.now();
      if (timerEl) timerEl.textContent = fmtTime(left);
      if (timerEl) timerEl.className = 'sf-timer' + (left < 60000 ? ' sf-timer--warn' : '');
      if (left <= 0) clearInterval(timerInterval);
    }, 500);
  }

  function stopTimer() { clearInterval(timerInterval); }

  // ── Lobby ────────────────────────────────────────────────────────────────────
  function renderLobbyPlayers(players) {
    currentPlayers = players;
    if (lobbyPlayers) {
      lobbyPlayers.innerHTML = players.map(p =>
        `<div class="lobby-player-row">${esc(p.username)}${p.userId === myId ? ' <span class="lobby-you">(คุณ)</span>' : ''}</div>`
      ).join('');
    }
    renderGmPlayers(players);
  }

  function renderGmPlayers(players) {
    if (!gmPlayers) return;
    gmPlayers.innerHTML = players.map(p =>
      `<span class="gm-player-chip">${esc(p.username)}</span>`
    ).join('');
  }

  // ── Turn / asking banner ──────────────────────────────────────────────────────
  function clearAnswerCountdown() {
    clearInterval(answerCountdown);
    answerCountdown = null;
  }

  function updateTurnBanner(turnUserId, turnUsername) {
    clearAnswerCountdown();
    currentTurnUserId = turnUserId;
    if (!turnBanner) return;
    const isMyTurn = turnUserId === myId;
    if (isMyTurn) {
      turnBanner.innerHTML = '🎤 <b>ตาคุณถาม!</b> เลือกคนที่ต้องการถาม แล้วกดปุ่ม <b>ถาม</b>';
      turnBanner.className = 'sf-turn-banner sf-turn-banner--mine';
    } else {
      turnBanner.innerHTML = `🎤 <b>${esc(turnUsername)}</b> กำลังถาม…`;
      turnBanner.className = 'sf-turn-banner sf-turn-banner--other';
    }
    show(turnBanner);
    renderPlayerList(currentPlayers);
  }

  function showAskingBanner(askerUsername, askedUserId, askedUsername, seconds) {
    clearAnswerCountdown();
    currentTurnUserId = null; // disable ask buttons while someone is answering
    if (!turnBanner) return;

    const isAsked = askedUserId === myId;
    let left = seconds;

    function render() {
      if (isAsked) {
        turnBanner.innerHTML =
          `💬 <b>คุณกำลังโดนถามโดย ${esc(askerUsername)}!</b> ตอบแล้วกด <button id="sf-done-answer-btn" class="sf-done-btn">✅ ถามต่อ</button> <span class="sf-answer-timer">(${left}s)</span>`;
        turnBanner.className = 'sf-turn-banner sf-turn-banner--asked';
        document.getElementById('sf-done-answer-btn')?.addEventListener('click', () => {
          socket.emit('sp:done_answer', { roomId });
        });
      } else {
        turnBanner.innerHTML =
          `💬 <b>${esc(askerUsername)}</b> ถาม <b>${esc(askedUsername)}</b> — รอตอบ <span class="sf-answer-timer">(${left}s)</span>`;
        turnBanner.className = 'sf-turn-banner sf-turn-banner--other';
      }
    }

    render();
    show(turnBanner);
    renderPlayerList(currentPlayers); // re-render to remove ask buttons

    answerCountdown = setInterval(() => {
      left--;
      if (left <= 0) { clearAnswerCountdown(); return; }
      render();
    }, 1000);
  }

  // ── Game: player list ─────────────────────────────────────────────────────────
  function renderPlayerList(players) {
    currentPlayers = players;
    if (!playerList) return;
    const isMyTurn = currentTurnUserId === myId;

    playerList.innerHTML = players.map(p => {
      const isMe = p.userId === myId;
      const offline = !!p.offline;
      const askBtn    = (!isMe && isMyTurn && !offline)
        ? `<button class="sf-ask-btn" data-uid="${p.userId}" data-name="${esc(p.username)}">ถาม</button>`
        : '';
      const accuseBtn = (!isMe && !offline)
        ? `<button class="sf-accuse-btn" data-uid="${p.userId}" data-name="${esc(p.username)}">กล่าวหา</button>`
        : '';
      const offlineBadge = offline ? '<span class="sf-offline-tag">ออฟไลน์</span>' : '';
      const youBadge = isMe ? ' <span class="sf-you-tag">คุณ</span>' : '';
      return `<div class="sf-player-row${currentTurnUserId === p.userId ? ' sf-player-row--active' : ''}${offline ? ' sf-player-row--offline' : ''}" data-uid="${p.userId}">
        <span class="sf-player-name">${esc(p.username)}${youBadge}${offlineBadge}</span>
        <div class="sf-player-actions">${askBtn}${accuseBtn}</div>
      </div>`;
    }).join('');

    playerList.querySelectorAll('.sf-ask-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        socket.emit('sp:ask', { roomId, targetUserId: Number(btn.dataset.uid) });
      });
    });

    playerList.querySelectorAll('.sf-accuse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = Number(btn.dataset.uid);
        if (!confirm(`กล่าวหาว่า "${btn.dataset.name}" เป็นสปาย?`)) return;
        socket.emit('sp:accuse', { roomId, targetUserId: uid });
      });
    });
  }

  // ── Show/hide phases ──────────────────────────────────────────────────────────
  function showLobby() {
    show(lobby); hide(game, votingOverlay, guessOverlay, endOverlay);
  }

  function showGame() {
    hide(lobby, votingOverlay, guessOverlay, endOverlay); show(game);
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

  function showGuessPhase(locations, withTimer = false) {
    const locs = (locations && locations.length) ? locations : allLocations;
    hide(votingOverlay);

    // Show inline guess mode on the location list
    if (locLabel) locLabel.textContent = '🎯 เดาสถานที่ — แตะเพื่อเลือก';
    show(locationHints, guessInline);
    if (guessConfirmBtn) { guessConfirmBtn.setAttribute('disabled', ''); guessConfirmBtn.textContent = 'เลือกสถานที่ก่อน'; }

    if (locationList && locs.length) {
      locationList.innerHTML = locs.map(l =>
        `<div class="sf-loc-item sf-loc-item--pick" data-loc="${esc(l)}">${esc(l)}</div>`
      ).join('');
      locationList.querySelectorAll('.sf-loc-item--pick').forEach(item => {
        item.addEventListener('click', () => {
          locationList.querySelectorAll('.sf-loc-item--pick').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          if (guessConfirmBtn) {
            guessConfirmBtn.removeAttribute('disabled');
            guessConfirmBtn.textContent = `ยืนยัน: ${item.dataset.loc}`;
          }
        });
      });
    }

    clearInterval(guessCountdown);
    if (withTimer) {
      let left = 30;
      if (guessInlineTimer) guessInlineTimer.textContent = `เหลือ ${left} วินาที`;
      show(guessInlineTimer);
      guessCountdown = setInterval(() => {
        left--;
        if (guessInlineTimer) guessInlineTimer.textContent = `เหลือ ${left} วินาที`;
        if (left <= 0) clearInterval(guessCountdown);
      }, 1000);
    } else {
      hide(guessInlineTimer);
    }
  }

  function showEnd(data) {
    hide(votingOverlay, guessOverlay, turnBanner); show(endOverlay);
    stopTimer();
    clearInterval(guessCountdown);

    const spyWon = data.winner === 'spy';
    if (endWinner) {
      endWinner.textContent = spyWon ? '🕵️ สปายชนะ!' : '🎉 ผู้เล่นชนะ!';
      endWinner.className = 'sf-end-winner ' + (spyWon ? 'sf-end-winner--spy' : 'sf-end-winner--players');
    }
    if (endReason)   endReason.textContent   = data.reason || '';
    if (endSpy)      endSpy.textContent      = data.spyUsername || '?';
    if (endLocation) endLocation.textContent = data.location   || '?';

    if (data.spyGuessedLocation) {
      show(endGuessRow);
      if (endSpyGuess) endSpyGuess.textContent = data.spyGuessedLocation;
    } else {
      hide(endGuessRow);
    }

    if (endRoles && data.roles) {
      endRoles.innerHTML = '<div class="sf-end-roles-title">บทบาทของทุกคน</div>' +
        currentPlayers.map(p => {
          const role = p.userId === data.spyUserId ? '🕵️ สปาย' : (data.roles[p.userId] || '?');
          return `<div class="sf-end-role-row"><b>${esc(p.username)}</b> — ${esc(role)}</div>`;
        }).join('');
    }

    if (isHost) show(newGameBtn);
  }

  // ── Socket events ─────────────────────────────────────────────────────────────
  socket.emit('gm:join', { roomId });

  socket.on('gm:joined', ({ room, state }) => {
    isHost = room.host === myId;
    currentPlayers = room.players;
    renderLobbyPlayers(room.players);

    if (isHost) {
      show(startBtn); hide(lobbyHint);
    }

    if (room.status === 'playing' && state) {
      showGame();
      startTimerDisplay(state.timerEndsAt);
      if (state.turnUserId) updateTurnBanner(state.turnUserId, state.turnUsername);
      renderPlayerList(room.players);
      if (state.phase === 'voting' && state.accusation) {
        showVoting({
          accuserUserId: state.accusation.accuserUserId,
          accuserUsername: state.accusation.accuserUsername,
          targetUserId: state.accusation.targetUserId,
          targetUsername: state.accusation.targetUsername,
        });
      }
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
    // Also update in-game player list if game is active
    if (!game.classList.contains('hidden')) {
      renderPlayerList(players);
    }
  });

  socket.on('gm:error', ({ msg }) => {
    alert(msg);
  });

  socket.on('gm:started', ({ state }) => {
    showGame();
    startTimerDisplay(state.timerEndsAt);
    renderPlayerList(state.players || currentPlayers);
    if (state.turnUserId) updateTurnBanner(state.turnUserId, state.turnUsername);
  });

  socket.on('sp:role', ({ isSpy: spy, location, role, allLocations: locs }) => {
    isSpy = spy;
    if (locs && locs.length) allLocations = locs; // always cache
    if (spy) {
      show(cardSpy); hide(cardPlayer);
      if (locs && locationList) {
        show(locationHints);
        locationList.innerHTML = locs.map(l =>
          `<div class="sf-loc-item">${esc(l)}</div>`
        ).join('');
      }
    } else {
      show(cardPlayer); hide(cardSpy); hide(locationHints);
      if (myLocation) myLocation.textContent = location || '?';
      if (myRole)     myRole.textContent     = role     || '?';
    }
  });

  socket.on('sp:turn', ({ turnUserId, turnUsername }) => {
    updateTurnBanner(turnUserId, turnUsername);
  });

  socket.on('sp:asking', ({ askerUserId, askerUsername, askedUserId, askedUsername, seconds }) => {
    showAskingBanner(askerUsername, askedUserId, askedUsername, seconds);
  });

  socket.on('sp:accusation', data => {
    showVoting(data);
  });

  socket.on('sp:vote_update', ({ votes, total, guilty, innocent }) => {
    if (voteTally) {
      voteTally.textContent = `โหวตแล้ว ${votes}/${total} — ผิด: ${guilty}  ไม่ใช่: ${innocent}`;
    }
  });

  socket.on('sp:spy_caught', ({ spyUserId, spyUsername }) => {
    hide(votingOverlay);
    if (myId !== spyUserId) {
      const banner = document.createElement('div');
      banner.className = 'sf-spy-caught-banner';
      banner.textContent = `🕵️ ${spyUsername} โดนจับแล้ว! กำลังรอเดาสถานที่…`;
      game.prepend(banner);
    }
  });

  socket.on('sp:your_turn_guess', ({ locations }) => {
    showGuessPhase(locations, true);
  });

  socket.on('sp:vote_resolved', ({ result }) => {
    hide(votingOverlay);
    document.querySelectorAll('.sf-spy-caught-banner').forEach(b => b.remove());
    if (timerEndsAt) startTimerDisplay(timerEndsAt);
  });

  socket.on('sp:ended', data => {
    showEnd(data);
  });

  socket.on('sp:reset', () => {
    isSpy = false;
    hasVoted = false;
    currentTurnUserId = null;
    allLocations = [];
    stopTimer();
    clearInterval(guessCountdown);
    clearAnswerCountdown();
    hide(cardSpy, cardPlayer, locationHints, guessInline, turnBanner);
    if (locLabel) locLabel.textContent = 'สถานที่ที่เป็นไปได้';
    document.querySelectorAll('.sf-spy-caught-banner').forEach(b => b.remove());
    showLobby();
    if (isHost) show(startBtn);
  });

  // ── UI actions ────────────────────────────────────────────────────────────────
  if (timeGroup) {
    timeGroup.querySelectorAll('.gm-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeGroup.querySelectorAll('.gm-option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        myMinutes = Number(btn.dataset.minutes);
      });
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      socket.emit('gm:set_option', { roomId, key: 'minutes', value: myMinutes });
      socket.emit('gm:start', { roomId });
    });
  }

  if (voteYes) {
    voteYes.addEventListener('click', () => {
      if (hasVoted) return;
      hasVoted = true;
      voteYes.setAttribute('disabled', '');
      voteNo.setAttribute('disabled', '');
      socket.emit('sp:vote', { roomId, guilty: true });
    });
  }

  if (voteNo) {
    voteNo.addEventListener('click', () => {
      if (hasVoted) return;
      hasVoted = true;
      voteYes.setAttribute('disabled', '');
      voteNo.setAttribute('disabled', '');
      socket.emit('sp:vote', { roomId, guilty: false });
    });
  }

  if (guessBtn) {
    guessBtn.addEventListener('click', () => {
      const loc = guessSelect?.querySelector('.sf-guess-item.selected')?.dataset.loc;
      if (!loc) return;
      guessBtn.setAttribute('disabled', '');
      socket.emit('sp:guess', { roomId, location: loc });
    });
  }

  if (spyGuessBtn) {
    spyGuessBtn.addEventListener('click', () => {
      showGuessPhase(allLocations, false);
    });
  }

  if (guessConfirmBtn) {
    guessConfirmBtn.addEventListener('click', () => {
      const loc = locationList?.querySelector('.sf-loc-item--pick.selected')?.dataset.loc;
      if (!loc) return;
      guessConfirmBtn.setAttribute('disabled', '');
      socket.emit('sp:guess', { roomId, location: loc });
    });
  }

  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      socket.emit('sp:new_game', { roomId });
    });
  }

})();
