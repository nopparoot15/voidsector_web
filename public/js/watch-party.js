/* public/js/watch-party.js
 * Realtime watch party (best-effort cross-platform).
 * Full control for:
 *  - YouTube (IFrame API)
 *  - Direct HTML5 media (mp4/webm/ogg)
 * For other sites, we embed if allowed, otherwise users can open in new tab and use Sync for timestamps.
 */

(function () {
  const roomId = window.WP_ROOM_ID;
  const isPublic = !!window.WP_IS_PUBLIC;
  const joinKeyFallback = window.WP_JOIN_KEY || '';

  const els = {
    online: document.getElementById('wpOnline'),
    share: document.getElementById('wpShare'),
    copy: document.getElementById('wpCopy'),
    url: document.getElementById('wpUrl'),
    set: document.getElementById('wpSet'),
    player: document.getElementById('wpPlayer'),
    controls: document.getElementById('wpControls'),
    play: document.getElementById('wpPlay'),
    pause: document.getElementById('wpPause'),
    sync: document.getElementById('wpSync'),
    mute: document.getElementById('wpMute'),
    vol: document.getElementById('wpVol'),
    volVal: document.getElementById('wpVolVal'),
    friends: document.getElementById('wpFriends'),
    invite: document.getElementById('wpInvite'),
    tap: document.getElementById('wpTapToggle'),
    centerIcon: document.getElementById('wpCenterIcon'),
    scrubWrap: document.getElementById('wpScrubWrap'),
    scrub: document.getElementById('wpScrub'),
    timeCur: document.getElementById('wpTimeCur'),
    timeDur: document.getElementById('wpTimeDur'),
  };

  // -------------------------
  // Player refs (declared early because volume uses them)
  // -------------------------
  let ytPlayer = null;
  let html5Video = null;
  let ytReady = false;

  // ---- Local volume (not synced) ----
  const VOL_KEY = 'vs_wp_volume';
  const MUTE_KEY = 'vs_wp_muted';
  let userVolume = Number(localStorage.getItem(VOL_KEY));
  if (!Number.isFinite(userVolume)) userVolume = 80;
  userVolume = Math.max(0, Math.min(100, Math.round(userVolume)));
  let userMuted = localStorage.getItem(MUTE_KEY) === '1';

  function updateVolumeUI() {
    if (els.vol) els.vol.value = String(userVolume);
    if (els.volVal) els.volVal.textContent = `${userVolume}%`;
    if (els.mute) {
      const icon =
        userMuted || userVolume === 0 ? '🔇' : userVolume < 40 ? '🔈' : '🔊';
      els.mute.textContent = icon;
    }
  }

  function applyVolumeToPlayer() {
    // YouTube
    if (ytPlayer && ytReady) {
      try {
        ytPlayer.setVolume(userVolume);
        if (userMuted || userVolume === 0) ytPlayer.mute();
        else ytPlayer.unMute();
      } catch (e) {}
    }
    // HTML5
    if (html5Video) {
      try {
        html5Video.volume = userVolume / 100;
        html5Video.muted = !!(userMuted || userVolume === 0);
      } catch (e) {}
    }
  }

  updateVolumeUI();

  els.vol?.addEventListener('input', () => {
    userVolume = Math.max(0, Math.min(100, Math.round(Number(els.vol.value) || 0)));
    localStorage.setItem(VOL_KEY, String(userVolume));
    if (userVolume > 0) {
      userMuted = false;
      localStorage.setItem(MUTE_KEY, '0');
    }
    updateVolumeUI();
    applyVolumeToPlayer();
  });

  els.mute?.addEventListener('click', () => {
    userMuted = !userMuted;
    localStorage.setItem(MUTE_KEY, userMuted ? '1' : '0');
    updateVolumeUI();
    applyVolumeToPlayer();
  });

  // -------------------------
  // Build share link
  // -------------------------
  (function () {
    if (!els.share) return;
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    const base =
      String(roomId) === 'public'
        ? `${window.location.origin}/watch/public`
        : `${window.location.origin}/watch/r/${encodeURIComponent(roomId)}`;
    els.share.value = !isPublic && k ? `${base}?k=${encodeURIComponent(k)}` : base;
    els.copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(els.share.value);
      } catch (e) {}
    });
  })();

  // -------------------------
  // Socket
  // -------------------------
  const socket = (() => {
    if (window.VS_SOCKET) return window.VS_SOCKET;
    if (typeof io === 'function') return io({ withCredentials: true });
    return null;
  })();
  if (!socket) return;

  let identified = false;
  function sendHello() {
    try {
      const me = window.VS_ME || {};
      const username = String(me.username || '').trim();
      if (!username) return;
      socket.emit('chat:hello', { userId: me.id || null, username });
    } catch (e) {}
  }
  socket.on('chat:me', () => {
    identified = true;
  });

  if (socket !== window.VS_SOCKET) {
    sendHello();
    socket.on('connect', sendHello);
  } else {
    socket.on('connect', sendHello);
  }

  // Track recent user gestures so we don't broadcast autoplay-block pauses as real pauses.
  let lastUserGestureAt = 0;
  let lastCommandAt = 0;
  let lastUrlSetAt = 0;
  function markCommand() {
    lastCommandAt = Date.now();
  }
  function markGesture() {
    lastUserGestureAt = Date.now();
  }
  ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach((evt) => {
    document.addEventListener(
      evt,
      (e) => {
        const t = e.target;
        if (t && (t.closest?.('#wpControls') || t.closest?.('#wpPlayer'))) markGesture();
      },
      { passive: true }
    );
  });

  // -------------------------
  // Time sync (server clock) to reduce jitter/drift
  // -------------------------
  let __wpTimeOffsetMs = 0;
  let __wpTimeSynced = false;
  let __wpTimeSyncInit = false;
  let __wpTimeSyncRunning = false;

  function nowServerMs() {
    return Date.now() + (__wpTimeOffsetMs || 0);
  }

  function median(arr) {
    const a = arr.slice().sort((x, y) => x - y);
    const m = Math.floor(a.length / 2);
    return a.length ? (a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2) : 0;
  }

  function startTimeSync(samples = 7) {
    if (__wpTimeSynced) return;
    if (__wpTimeSyncRunning) return;
    __wpTimeSyncRunning = true;

    const offsets = [];
    let done = 0;

    function ping() {
      const t0 = Date.now();
      socket.emit('wp:time_sync', { t0 });
      setTimeout(() => {
        if (done >= samples) return;
        if (done < samples) ping();
      }, 800);
    }

    if (!__wpTimeSyncInit) {
      __wpTimeSyncInit = true;
      socket.on('wp:time_sync', (m) => {
        try {
          const t1 = Date.now();
          const t0 = Number(m?.t0) || 0;
          const ts = Number(m?.ts) || 0;
          if (!t0 || !ts) return;
          const off = ts - (t0 + t1) / 2;
          if (Number.isFinite(off)) offsets.push(off);
          done += 1;
          if (done < samples) ping();
          else {
            __wpTimeOffsetMs = median(offsets);
            __wpTimeSynced = true;
            __wpTimeSyncRunning = false;
          }
        } catch (e) {}
      });
    }

    ping();
  }

  let __wpJoined = false;

  function join() {
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    socket.emit('wp:join', { roomId, k });
  }

  socket.on('wp:error', (e) => {
    try {
      const msg = String(e?.message || 'Watch party error');
      console.warn('[watchparty]', msg);
      if (els.online && msg.toLowerCase().includes('not identified')) {
        els.online.textContent = '—';
      }
    } catch (err) {}
  });

  function ensureJoined() {
    if (__wpJoined) return;
    if (!socket.connected) return;
    if (!identified) {
      sendHello();
      setTimeout(ensureJoined, 250);
      return;
    }
    startTimeSync();
    join();
    setTimeout(ensureJoined, 900);
  }

  socket.on('connect', () => {
    setTimeout(ensureJoined, 50);
  });
  if (socket.connected) setTimeout(ensureJoined, 50);

  socket.on('wp:presence', (p) => {
    if (els.online) els.online.textContent = String(p?.membersOnline || p?.count || 0);
  });

  // -------------------------
  // Provider detection
  // -------------------------
  function detectProvider(url) {
    const u = String(url || '').trim();
    if (!u) return { provider: 'generic', id: null };
    const lower = u.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)(\?|#|$)/)) return { provider: 'html5', id: null };
    try {
      const uu = new URL(u);
      if (uu.hostname.includes('youtu.be')) {
        const id = uu.pathname.replace(/^\//, '').split('/')[0];
        if (id) return { provider: 'youtube', id };
      }
      if (uu.hostname.includes('youtube.com')) {
        const id = uu.searchParams.get('v');
        if (id) return { provider: 'youtube', id };
      }
    } catch (e) {}
    if (lower.includes('vimeo.com')) return { provider: 'vimeo', id: null };
    return { provider: 'generic', id: null };
  }

  // -------------------------
  // Player implementations
  // -------------------------
  let current = { url: '', provider: 'generic' };
  let suppressLocalEvents = false;
  let localIntent = { type: null, at: 0 };
  function setIntent(type) {
    localIntent = { type, at: Date.now() };
  }

  let lastRemoteAppliedAt = 0;
  let lastState = null;
  let desiredPlaying = null;
  let pendingState = null;
  let needsGesture = false;
  let stallTimer = null;
  let lastProgress = { t: 0, at: 0 };

  function setNeedsGesture(on) {
    needsGesture = !!on;
    if (els.centerIcon) {
      els.centerIcon.classList.toggle('is-hint', needsGesture);
      els.centerIcon.textContent = needsGesture ? 'TAP' : '';
    }
  }

  function clearPlayer() {
    if (ytPlayer) {
      try {
        ytPlayer.destroy();
      } catch (e) {}
      ytPlayer = null;
    }
    if (html5Video) {
      try {
        html5Video.pause();
      } catch (e) {}
      try {
        html5Video.remove();
      } catch (e) {}
      html5Video = null;
    }
    if (els.player) els.player.innerHTML = '';
    if (els.controls) els.controls.style.display = 'none';
  }

  function ensureYouTubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (window.__WP_YT_LOADING) return window.__WP_YT_LOADING;
    window.__WP_YT_LOADING = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve();
      setTimeout(resolve, 5000);
    });
    return window.__WP_YT_LOADING;
  }

  async function mountYouTube(videoId) {
    await ensureYouTubeAPI();
    clearPlayer();
    const div = document.createElement('div');
    div.id = 'wpYt';
    els.player?.appendChild(div);
    ytReady = false;

    ytPlayer = new window.YT.Player('wpYt', {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          ytReady = true;
          if (els.controls) els.controls.style.display = '';
          applyVolumeToPlayer();
          if (pendingState) {
            const s = pendingState;
            pendingState = null;
            applyState(s);
          }
        },
        onStateChange: (evt) => {
          if (suppressLocalEvents) return;
          try {
            const st = evt?.data;
            const t = ytPlayer?.getCurrentTime ? ytPlayer.getCurrentTime() || 0 : 0;

            // If server says paused but YT flips to playing, force it back unless we intended play
            const nowTs1 = Date.now();
            const intentAge = nowTs1 - (localIntent?.at || 0);
            const intentType = localIntent?.type || null;
            if (st === 1 && desiredPlaying === false) {
              if (!(intentType === 'play' && intentAge < 1400)) {
                try {
                  ytPlayer.pauseVideo();
                } catch (e) {}
                return;
              }
            }

            // 1=PLAYING, 2=PAUSED
            const nowTs2 = Date.now();
            const sinceRemote = nowTs2 - (lastRemoteAppliedAt || 0);
            const sinceCmd = nowTs2 - (lastCommandAt || 0);
            const sinceUrl = nowTs2 - (lastUrlSetAt || 0);

            if (sinceRemote < 900 || sinceCmd < 900) return;

            const inAutoplayWindow = sinceUrl >= 0 && sinceUrl < 1800;

            if (st === 2) {
              // ignore very-early autoplay policy pause near start
              if (desiredPlaying === true && inAutoplayWindow && t <= 1.0) return;
              socket.emit('wp:pause', { t });
              return;
            }
            if (st === 1) {
              const intentAge2 = nowTs2 - (localIntent?.at || 0);
              const intentType2 = localIntent?.type || null;
              const sinceRemote2 = nowTs2 - (lastRemoteAppliedAt || 0);
              if ((intentType2 === 'play' && intentAge2 < 1600) || (desiredPlaying === false && sinceRemote2 > 800)) {
                socket.emit('wp:play', { t });
              }
              return;
            }
          } catch (e) {}
        },
      },
    });
  }

  function mountHtml5(url) {
    clearPlayer();
    const v = document.createElement('video');
    v.src = url;
    v.controls = true;
    v.playsInline = true;
    v.style.width = '100%';
    v.style.maxHeight = '70vh';
    v.style.borderRadius = '12px';
    els.player?.appendChild(v);
    html5Video = v;
    if (els.controls) els.controls.style.display = '';

    const emitPlay = () => {
      if (suppressLocalEvents) return;
      const sinceRemote = Date.now() - (lastRemoteAppliedAt || 0);
      const sinceGesture = Date.now() - (lastUserGestureAt || 0);
      if (sinceRemote <= 1600 || sinceGesture >= 1400) return;
      socket.emit('wp:play', { t: v.currentTime || 0 });
    };
    const emitPause = () => {
      if (suppressLocalEvents) return;
      const sinceRemote = Date.now() - (lastRemoteAppliedAt || 0);
      const sinceGesture = Date.now() - (lastUserGestureAt || 0);
      if (sinceRemote <= 1600 || sinceGesture >= 1400) return;
      socket.emit('wp:pause', { t: v.currentTime || 0 });
    };
    const emitSeek = () => {
      if (suppressLocalEvents) return;
      socket.emit('wp:seek', { t: v.currentTime || 0 });
    };
    v.addEventListener('play', emitPlay);
    v.addEventListener('pause', emitPause);
    v.addEventListener('seeked', emitSeek);

    applyVolumeToPlayer();
  }

  function escapeAttr(s) {
    return String(s).replace(/["<>&]/g, (m) => ({ '"': '&quot;', '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]));
  }

  function mountGeneric(url) {
    clearPlayer();
    const box = document.createElement('div');
    box.className = 'wp-generic';
    box.innerHTML = `
      <div style="color:#e6f7ff;font-weight:700;margin-bottom:8px">ไม่สามารถควบคุมเว็บนี้ได้โดยตรง</div>
      <div style="color:#9aa7b3;font-size:13px;line-height:1.4">
        ถ้าเว็บปลายทาง <b>อนุญาตให้ embed</b> จะพยายามแสดงด้านล่าง • ถ้าไม่ขึ้น ให้เปิดลิงก์ในแท็บใหม่ แล้วใช้ปุ่ม <b>Sync</b> เพื่อซิงก์เวลา
      </div>
      <a href="${escapeAttr(url)}" target="_blank" rel="noopener" class="wp-open">Open in new tab</a>
    `;
    const frame = document.createElement('iframe');
    frame.src = url;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'no-referrer';
    frame.sandbox = 'allow-scripts allow-same-origin allow-presentation allow-popups allow-forms';
    frame.className = 'wp-iframe';
    els.player?.appendChild(box);
    els.player?.appendChild(frame);
    if (els.controls) els.controls.style.display = '';
  }

  async function mountForUrl(url) {
    const det = detectProvider(url);
    current = { url, provider: det.provider, id: det.id };
    if (!url) {
      clearPlayer();
      return;
    }
    if (det.provider === 'youtube' && det.id) return mountYouTube(det.id);
    if (det.provider === 'html5') return mountHtml5(url);
    return mountGeneric(url);
  }

  // -------------------------
  // Apply state from server
  // -------------------------
  function serverNowMs() {
    return Date.now() + (__wpTimeOffsetMs || 0);
  }
  function expectedFromState(st) {
    const baseT = Number(st?.t) || 0;
    if (!st?.isPlaying) return baseT;
    const updatedAt = Number(st?.updatedAt) || Date.now();
    const delta = (serverNowMs() - updatedAt) / 1000;
    return Math.max(0, baseT + delta);
  }
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }
  function setRate(r) {
    r = clamp(r, 0.75, 1.25);
    try {
      if (current.provider === 'youtube' && ytPlayer && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(r);
      if (html5Video) html5Video.playbackRate = r;
    } catch (e) {}
  }

  async function applyState(st) {
    if (!st) return;
    lastState = st;
    desiredPlaying = !!st.isPlaying;

    const urlChanged = String(st.url || '') !== String(current.url || '');
    if (urlChanged) {
      await mountForUrl(String(st.url || ''));
    }

    if (current.provider === 'youtube' && ytPlayer && !ytReady) {
      pendingState = st;
      return;
    }

    const baseT = Number(st.t) || 0;
    const serverNow = nowServerMs();
    const drift = st.isPlaying ? Math.max(0, (serverNow - (Number(st.updatedAt) || serverNow)) / 1000) : 0;
    const expectedT = baseT + drift;

    const curT = getLocalTime();
    const diff = expectedT - curT;
    const absDiff = Math.abs(diff);

    suppressLocalEvents = true;
    lastRemoteAppliedAt = Date.now();

    try {
      if (current.provider === 'youtube' && ytPlayer) {
        if (!st.isPlaying) {
          try {
            markCommand();
            ytPlayer.pauseVideo();
          } catch (e) {}
          try {
            ytPlayer.setPlaybackRate && ytPlayer.setPlaybackRate(1.0);
          } catch (e) {}
          setNeedsGesture(false);
        } else {
          if (absDiff > 0.9) {
            try {
              markCommand();
              ytPlayer.seekTo(expectedT, true);
            } catch (e) {}
          }
          try {
            markCommand();
            ytPlayer.playVideo();
          } catch (e) {}
          setTimeout(() => {
            try {
              const stt = ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : 0;
              if (stt !== 1) setNeedsGesture(true);
            } catch (e) {}
          }, 350);
        }
      } else if (current.provider === 'html5' && html5Video) {
        if (!st.isPlaying) {
          if (absDiff > 0.15) html5Video.currentTime = expectedT;
          html5Video.pause();
          setRate(1.0);
          setNeedsGesture(false);
        } else {
          if (absDiff > 1.0) {
            html5Video.currentTime = expectedT;
            setRate(1.0);
          } else if (absDiff > 0.2) {
            setRate(diff > 0 ? 1.05 : 0.95);
            setTimeout(() => setRate(1.0), 1400);
          } else {
            setRate(1.0);
          }
          const p = html5Video.play();
          if (p && p.catch) p.catch(() => setNeedsGesture(true));
          else setNeedsGesture(false);
        }
      }
    } finally {
      setTimeout(() => {
        suppressLocalEvents = false;
      }, 600);
    }
  }

  socket.on('wp:joined', (j) => {
    __wpJoined = true;
    if (els.online) els.online.textContent = String(j?.membersOnline || 0);
    applyState(j?.state);
  });
  socket.on('wp:state', applyState);

  // -------------------------
  // Tab/background recovery
  // -------------------------
  function requestFreshState() {
    if (!__wpJoined) return;
    try {
      socket.emit('wp:ping_state');
    } catch (e) {}
  }

  function startStallWatchdog() {
    stopStallWatchdog();
    lastProgress.at = Date.now();
    try {
      if (current.provider === 'youtube' && ytPlayer && ytReady) lastProgress.t = ytPlayer.getCurrentTime?.() || 0;
      else if (current.provider === 'html5' && html5Video) lastProgress.t = html5Video.currentTime || 0;
    } catch (e) {}

    stallTimer = setInterval(() => {
      if (document.hidden) return;
      if (!lastState) return;
      if (!lastState.isPlaying) return;

      const expected = expectedFromState(lastState);

      let cur = 0;
      let playing = false;
      try {
        if (current.provider === 'youtube' && ytPlayer && ytReady) {
          cur = ytPlayer.getCurrentTime?.() || 0;
          const st = ytPlayer.getPlayerState?.() || 0; // 1=playing,2=paused,3=buffering
          playing = st === 1 || st === 3;
        } else if (current.provider === 'html5' && html5Video) {
          cur = html5Video.currentTime || 0;
          playing = !html5Video.paused;
        } else return;
      } catch (e) {
        return;
      }

      const now = Date.now();
      const dt = (now - lastProgress.at) / 1000;
      const progressed = Math.abs(cur - lastProgress.t) > Math.max(0.08, dt * 0.5);

      if (!progressed && dt > 1.6) {
        try {
          if (current.provider === 'youtube' && ytPlayer && ytReady) {
            markCommand();
            ytPlayer.playVideo?.();
            if (Math.abs(expected - cur) > 0.25) {
              markCommand();
              ytPlayer.seekTo?.(expected, true);
            }
          } else if (current.provider === 'html5' && html5Video) {
            if (Math.abs(expected - cur) > 0.25) html5Video.currentTime = expected;
            const p = html5Video.play();
            if (p && p.catch) p.catch(() => setNeedsGesture(true));
          }
        } catch (e) {}
        lastProgress.at = now;
        lastProgress.t = cur;
        return;
      }

      if (!playing) {
        try {
          if (current.provider === 'youtube' && ytPlayer && ytReady) {
            markCommand();
            ytPlayer.playVideo?.();
          }
          if (current.provider === 'html5' && html5Video) {
            const p = html5Video.play();
            if (p && p.catch) p.catch(() => setNeedsGesture(true));
          }
        } catch (e) {}
      }

      lastProgress.at = now;
      lastProgress.t = cur;
    }, 800);
  }

  function stopStallWatchdog() {
    if (stallTimer) {
      clearInterval(stallTimer);
      stallTimer = null;
    }
  }

  function onReturnToTab() {
    setNeedsGesture(false);
    requestFreshState();
    setTimeout(() => {
      try {
        if (lastState) applyState(lastState);
      } catch (e) {}
      startStallWatchdog();
    }, 220);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopStallWatchdog();
    else onReturnToTab();
  });

  window.addEventListener('focus', () => {
    if (!document.hidden) onReturnToTab();
  });

  window.addEventListener(
    'pointerdown',
    () => {
      if (!needsGesture) return;
      setNeedsGesture(false);
      try {
        if (lastState?.isPlaying) {
          if (current.provider === 'youtube' && ytPlayer && ytReady) {
            markCommand();
            ytPlayer.playVideo?.();
          } else if (current.provider === 'html5' && html5Video) {
            const p = html5Video.play();
            if (p && p.catch) p.catch(() => setNeedsGesture(true));
          }
        }
      } catch (e) {}
    },
    { passive: true }
  );

  // -------------------------
  // UI actions
  // -------------------------
  els.set?.addEventListener('click', () => {
    const url = String(els.url?.value || '').trim();
    const det = detectProvider(url);
    lastUrlSetAt = Date.now();
    try {
      mountForUrl(url);
    } catch (e) {}
    socket.emit('wp:set_url', { url, provider: det.provider });
  });

  function getLocalTime() {
    if (current.provider === 'youtube' && ytPlayer) {
      try {
        return ytPlayer.getCurrentTime() || 0;
      } catch (e) {
        return 0;
      }
    }
    if (current.provider === 'html5' && html5Video) return html5Video.currentTime || 0;
    return 0;
  }

  function getDuration() {
    try {
      if (current.provider === 'youtube' && ytPlayer && ytReady && typeof ytPlayer.getDuration === 'function') {
        return Number(ytPlayer.getDuration() || 0);
      }
      if (current.provider === 'html5' && html5Video) return Number(html5Video.duration || 0);
    } catch (e) {}
    return 0;
  }

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(Number(sec || 0)));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  }

  function flashCenter(isPlaying) {
    if (!els.centerIcon) return;
    els.centerIcon.innerHTML = isPlaying ? '<div class="wp-i">⏸</div>' : '<div class="wp-i">▶</div>';
    els.centerIcon.classList.add('show');
    setTimeout(() => els.centerIcon && els.centerIcon.classList.remove('show'), 260);
  }

  els.tap?.addEventListener('click', (e) => {
    e.preventDefault();
    markGesture();
    const playing = !!(lastState && lastState.isPlaying);
    const t = getLocalTime();
    if (playing) {
      setIntent('pause');
      suppressLocalEvents = true;
      setTimeout(() => {
        suppressLocalEvents = false;
      }, 650);
      socket.emit('wp:pause', { t });
      flashCenter(true);
    } else {
      setIntent('play');
      suppressLocalEvents = true;
      setTimeout(() => {
        suppressLocalEvents = false;
      }, 450);
      socket.emit('wp:play', { t });
      flashCenter(false);
    }
  });

  // Scrub slider
  let scrubDragging = false;
  let scrubLastEmitAt = 0;
  let scrubWasPlaying = false;

  function setScrubVisible(on) {
    if (els.scrubWrap) els.scrubWrap.style.display = on ? '' : 'none';
  }

  function updateScrubUI() {
    const dur = getDuration();
    if (dur > 0.1) {
      setScrubVisible(true);
      if (els.timeDur) els.timeDur.textContent = formatTime(dur);
      const cur = getLocalTime();
      if (els.timeCur) els.timeCur.textContent = formatTime(cur);
      if (!scrubDragging && els.scrub) {
        els.scrub.value = String(Math.max(0, Math.min(1000, Math.round((cur / dur) * 1000))));
      }
    } else {
      setScrubVisible(false);
    }
  }

  els.scrub?.addEventListener('pointerdown', () => {
    scrubDragging = true;
    scrubWasPlaying = !!(lastState && lastState.isPlaying);
  });

  window.addEventListener('pointerup', () => {
    if (!scrubDragging) return;
    scrubDragging = false;
    const dur = getDuration();
    if (dur > 0.1 && els.scrub) {
      const pct = Number(els.scrub.value || 0) / 1000;
      const t = dur * pct;
      socket.emit('wp:seek', { t });
      if (scrubWasPlaying) socket.emit('wp:play', { t });
    }
  });

  els.scrub?.addEventListener('input', () => {
    if (!scrubDragging) return;
    const dur = getDuration();
    if (dur <= 0.1) return;
    const pct = Number(els.scrub.value || 0) / 1000;
    const t = dur * pct;
    if (els.timeCur) els.timeCur.textContent = formatTime(t);
    const nowTs = Date.now();
    if (nowTs - scrubLastEmitAt > 140) {
      scrubLastEmitAt = nowTs;
      socket.emit('wp:seek', { t });
    }
  });

  setInterval(updateScrubUI, 250);

  els.play?.addEventListener('click', () => {
    markGesture();
    setIntent('play');
    suppressLocalEvents = true;
    setTimeout(() => {
      suppressLocalEvents = false;
    }, 450);
    socket.emit('wp:play', { t: getLocalTime() });
  });

  els.pause?.addEventListener('click', () => {
    markGesture();
    setIntent('pause');
    suppressLocalEvents = true;
    setTimeout(() => {
      suppressLocalEvents = false;
    }, 650);
    socket.emit('wp:pause', { t: getLocalTime() });
  });

  els.sync?.addEventListener('click', () => socket.emit('wp:ping_state'));

  // -------- private room: invite UI --------
  if (!isPublic) {
    async function loadFriends() {
      if (!els.friends) return;
      try {
        const r = await fetch('/api/friends/list');
        const j = await r.json();
        if (!j.ok) throw new Error('no_friends');
        const friends = Array.isArray(j.friends) ? j.friends : [];
        if (friends.length === 0) {
          els.friends.innerHTML = '<div style="color:#9aa7b3;font-size:12px;padding:8px;">ยังไม่มีเพื่อน</div>';
          return;
        }
        els.friends.innerHTML = friends
          .map((f) => {
            const av = f.avatar_path ? f.avatar_path : '/uploads/avatars/default.png';
            return `
            <label class="wp-friend">
              <div class="wp-friend__left">
                <img class="wp-avatar" src="${av}" alt="" onerror="this.style.display='none'" />
                <div class="wp-name">${escapeHtml(f.username)}</div>
              </div>
              <input type="checkbox" class="wp-friendPick" value="${f.id}" />
            </label>
          `;
          })
          .join('');
      } catch (e) {
        els.friends.innerHTML = '<div style="color:#ffb3ff;font-size:12px;padding:8px;">โหลดรายชื่อเพื่อนไม่สำเร็จ</div>';
      }
    }

    els.invite?.addEventListener('click', async () => {
      const picks = Array.from(document.querySelectorAll('.wp-friendPick:checked'))
        .map((i) => Number(i.value))
        .filter(Boolean);
      if (picks.length === 0) {
        return window.Swal
          ? Swal.fire({ icon: 'info', title: 'เลือกเพื่อนก่อน', background: '#0b0f14', color: '#e6f7ff' })
          : alert('Pick friends');
      }
      els.invite.disabled = true;
      try {
        const resp = await fetch(`/api/watch/rooms/${encodeURIComponent(roomId)}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendIds: picks }),
        });
        const j = await resp.json();
        if (!j.ok) throw j;
        if (window.Swal) {
          Swal.fire({
            icon: 'success',
            title: 'Invite สำเร็จ',
            text: `เพิ่ม ${j.added} คน`,
            timer: 1200,
            showConfirmButton: false,
            background: '#0b0f14',
            color: '#e6f7ff',
          });
        }
      } catch (e) {
        const reason = e && (e.reason || e.message) ? String(e.reason || e.message) : 'invite_failed';
        const msgMap = {
          not_owner: 'ต้องเป็นเจ้าของห้องเท่านั้นถึงจะเชิญได้',
          not_friends: 'คนที่เลือกยังไม่ได้เป็นเพื่อนของคุณ',
          no_targets: 'กรุณาเลือกเพื่อนอย่างน้อย 1 คน',
          not_found: 'ไม่พบห้องนี้',
          server_error: 'เซิร์ฟเวอร์มีปัญหา ลองใหม่อีกครั้ง',
        };
        const text = msgMap[reason] || 'เชิญไม่สำเร็จ ลองใหม่อีกครั้ง';
        if (window.Swal) Swal.fire({ icon: 'error', title: 'Invite ไม่สำเร็จ', text, background: '#0b0f14', color: '#e6f7ff' });
        else alert(text);
      } finally {
        els.invite.disabled = false;
      }
    });

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    loadFriends();
  }

  // -------------------------
  // Smooth drift correction loop
  // -------------------------
  let lastRateBumpAt = 0;
  setInterval(() => {
    try {
      if (!lastState || !lastState.isPlaying) return;
      if (Date.now() - (lastRemoteAppliedAt || 0) < 700) return;

      const expected = expectedFromState(lastState);
      const cur = getLocalTime();
      if (!Number.isFinite(expected) || !Number.isFinite(cur)) return;

      const diff = expected - cur;
      const ad = Math.abs(diff);

      if (ad > 1.25) {
        if (current.provider === 'youtube' && ytPlayer) {
          try {
            markCommand();
            ytPlayer.seekTo(expected, true);
          } catch (e) {}
        } else if (html5Video) {
          try {
            html5Video.currentTime = expected;
          } catch (e) {}
        }
        setRate(1.0);
        return;
      }

      if (ad > 0.18) {
        const bump = diff > 0 ? 1.05 : 0.95;
        setRate(bump);
        lastRateBumpAt = Date.now();
      } else {
        if (Date.now() - lastRateBumpAt > 900) setRate(1.0);
      }
    } catch (e) {}
  }, 800);

  // Detect YouTube seeks made via the native player UI (best-effort)
  let __wpLastSeekEmitAt = 0;
  let ytLastT = 0;
  let ytLastAt = Date.now();
  setInterval(() => {
    if (suppressLocalEvents) return;
    if (current.provider !== 'youtube' || !ytPlayer || !ytReady) return;
    try {
      const nowTs2 = Date.now();
      const cur = ytPlayer.getCurrentTime ? ytPlayer.getCurrentTime() || 0 : 0;
      const dt = (nowTs2 - ytLastAt) / 1000;
      const jump = Math.abs(cur - ytLastT);
      if (dt > 0.12 && jump > 0.85) {
        const nowTs3 = Date.now();
        if (!__wpLastSeekEmitAt || nowTs3 - __wpLastSeekEmitAt > 160) {
          __wpLastSeekEmitAt = nowTs3;
          socket.emit('wp:seek', { t: cur });
        }
      }
      ytLastT = cur;
      ytLastAt = nowTs2;
    } catch (e) {}
  }, 250);
})();
