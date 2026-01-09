/* public/js/watch-party.js
 * WATCH PARTY (YouTube) - ULTRA SYNC
 *
 * Key idea:
 * - Server is authoritative. Every state update must include:
 *    { url, isPlaying, t, seq, ts }
 *   where:
 *     t  = base playback time (seconds) at moment ts was captured
 *     ts = server Date.now() when state was written
 *     seq increments EVERY update
 *
 * Client:
 * - Time-sync (clock offset) -> compute "expected now" time from {t,ts,isPlaying}
 * - Smooth lock: use playbackRate nudging to correct small drift (no rubber-banding)
 * - Seek only if drift is large
 *
 * Subtitles (best-effort):
 * - Force playerVars: hl=th, cc_lang_pref=th
 * - When TH Sub ON: cc_load_policy=1 and attempt to select Thai captions track
 * - NOTE: Some videos don't have Thai captions; API cannot magically create them.
 */

(function () {
  'use strict';

  const roomId = String(window.WP_ROOM_ID || '');
  const isPublic = !!window.WP_IS_PUBLIC;
  const joinKey = String(window.WP_JOIN_KEY || '');
  const socket = window.VS_SOCKET;

  if (!socket) {
    console.error('[watch-party] VS_SOCKET not found');
    return;
  }

  const els = {
    online: document.getElementById('wpOnline'),
    share: document.getElementById('wpShare'),
    copy: document.getElementById('wpCopy'),
    url: document.getElementById('wpUrl'),
    set: document.getElementById('wpSet'),
    urlError: document.getElementById('wpUrlError'),

    playerWrap: document.getElementById('wpPlayerWrap'),

    play: document.getElementById('wpPlay'),
    pause: document.getElementById('wpPause'),
    sync: document.getElementById('wpSync'),

    scrub: document.getElementById('wpScrub'),
    timeCur: document.getElementById('wpTimeCur'),
    timeDur: document.getElementById('wpTimeDur'),
    subTH: document.getElementById('wpSubTH'),

    fs: document.getElementById('wpFullscreen'),

    mute: document.getElementById('wpMute'),
    vol: document.getElementById('wpVol'),
    volText: document.getElementById('wpVolText'),

    friends: document.getElementById('wpFriends'),
    invite: document.getElementById('wpInvite'),
  };

  function buildShareUrl() {
    const origin = window.location.origin;
    if (roomId === 'public' || isPublic) return `${origin}/watch/public`;
    const base = `${origin}/watch/r/${encodeURIComponent(roomId)}`;
    return joinKey ? `${base}?k=${encodeURIComponent(joinKey)}` : base;
  }

  if (els.share) els.share.value = buildShareUrl();
  if (els.copy) {
    els.copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(els.share?.value || '');
        els.copy.textContent = 'Copied';
        setTimeout(() => (els.copy.textContent = 'Copy'), 900);
      } catch (_) {}
    });
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );
  }

  function showUrlError(msg) {
    if (!els.urlError) return;
    if (!msg) {
      els.urlError.style.display = 'none';
      els.urlError.textContent = '';
      return;
    }
    els.urlError.style.display = 'block';
    els.urlError.textContent = msg;
  }

  function parseYouTubeId(input) {
    const s = String(input || '').trim();
    if (!s) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

    try {
      const u = new URL(s);
      const host = u.hostname.replace(/^www\./, '').toLowerCase();

      if (host === 'youtu.be') {
        const id = u.pathname.split('/').filter(Boolean)[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }

      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
        const v = u.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

        const parts = u.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex((p) => ['shorts', 'embed', 'live'].includes(p));
        if (idx >= 0 && parts[idx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx + 1])) return parts[idx + 1];
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  function normalizeYouTubeUrl(id) {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  // ---------- Time sync ----------
  let clockOffsetMs = 0;
  let bestRtt = Infinity;

  function nowServerMs() {
    return Date.now() + clockOffsetMs;
  }

  function doTimeSync(samples = 8) {
    bestRtt = Infinity;
    let done = 0;

    const onResp = (payload) => {
      const t3 = Date.now();
      const t0 = Number(payload?.t0) || 0;
      const ts = Number(payload?.ts) || 0;
      if (!t0 || !ts) return;

      const rtt = t3 - t0;
      if (rtt > 0 && rtt < bestRtt) {
        bestRtt = rtt;
        const mid = t0 + rtt / 2;
        clockOffsetMs = ts - mid;
      }

      done += 1;
      if (done >= samples) socket.off('wp:time_sync', onResp);
    };

    socket.on('wp:time_sync', onResp);
    for (let i = 0; i < samples; i++) {
      setTimeout(() => socket.emit('wp:time_sync', { t0: Date.now() }), i * 120);
    }
  }

  // ---------- Player ----------
  let yt = null;
  let ytReady = false;
  let currentVideoId = null;

  let lastSeq = -1;

  let isScrubbing = false;
  let scrubWasPlaying = false;
  let suppressScrub = false;

  const LS_VOL = `vs_wp_vol_${roomId}`;
  const LS_MUTED = `vs_wp_muted_${roomId}`;
  let lastVolume = 80;

  const QUALITY_ORDER = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

  let desiredTHSub = false;

  let ytApiPromise = null;

  function loadYTApi() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytApiPromise) return ytApiPromise;

    ytApiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = () => reject(new Error('YT API failed'));

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try { if (typeof prev === 'function') prev(); } catch (_) {}
        resolve();
      };

      document.head.appendChild(s);
    });

    return ytApiPromise;
  }

  function fitPlayer() {
    const wrap = els.playerWrap;
    if (!wrap || !yt || typeof yt.setSize !== 'function') return;
    const r = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    try { yt.setSize(w, h); } catch (_) {}
  }

  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(fitPlayer, 120);
  });

  function updateSubButtonUI() {
    if (!els.subTH) return;
    els.subTH.setAttribute('data-on', desiredTHSub ? '1' : '0');
    els.subTH.textContent = desiredTHSub ? 'TH Sub: ON' : 'TH Sub';
  }

  function safeCall(fn) { try { fn(); } catch (_) {} }

  function tryEnableThaiCaptions() {
    if (!ytReady || !yt) return false;
    try {
      yt.loadModule('captions');

      let picked = null;
      try {
        const list = yt.getOption('captions', 'tracklist') || yt.getOption('captions', 'trackList') || [];
        if (Array.isArray(list) && list.length) {
          const th = list.find(tr => String(tr.languageCode || tr.language || tr.langCode || '').toLowerCase() === 'th'
                                  && String(tr.kind || '').toLowerCase() !== 'asr');
          const thAsr = list.find(tr => String(tr.languageCode || tr.language || tr.langCode || '').toLowerCase() === 'th');
          picked = th || thAsr || null;
        }
      } catch (_) {}

      if (picked) safeCall(() => yt.setOption('captions', 'track', picked));
      else {
        safeCall(() => yt.setOption('captions', 'track', { languageCode: 'th' }));
        safeCall(() => yt.setOption('captions', 'track', { languageCode: 'th', kind: 'asr' }));
      }

      safeCall(() => yt.setOption('captions', 'reload', true));
      return true;
    } catch (_) {
      return false;
    }
  }

  function tryDisableCaptions() {
    if (!ytReady || !yt) return false;
    try {
      yt.loadModule('captions');
      safeCall(() => yt.setOption('captions', 'track', {}));
      safeCall(() => yt.setOption('captions', 'reload', true));
      return true;
    } catch (_) {
      return false;
    }
  }

  function createPlayer() {
    if (yt) return;

    yt = new window.YT.Player('wpPlayer', {
      playerVars: {
        vq: 'highres',
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        disablekb: 1,
        iv_load_policy: 3,

        hl: 'th',
        cc_lang_pref: 'th',
        cc_load_policy: desiredTHSub ? 1 : 0,
      },
      events: {
        onReady: () => {
          ytReady = true;
          applyAudioToPlayer();
          fitPlayer();
          forceMaxQuality();
          startTick();
          socket.emit('wp:ping_state');
        },
        onStateChange: (ev) => {
          const st = ev && typeof ev.data === 'number' ? ev.data : null;

          if (st === window.YT.PlayerState.PLAYING || st === window.YT.PlayerState.BUFFERING) {
            forceMaxQuality();
            setTimeout(forceMaxQuality, 250);
            setTimeout(forceMaxQuality, 900);
            if (desiredTHSub) tryEnableThaiCaptions();
          }
        },
        onError: (e) => console.warn('[watch-party] YT error', e?.data),
      },
    });
  }

  async function ensurePlayer() {
    await loadYTApi();
    if (!yt) createPlayer();
  }

  async function waitUntilReady(maxMs = 7000) {
    const start = Date.now();
    while (!(ytReady && yt)) {
      if (Date.now() - start > maxMs) throw new Error('YT ready timeout');
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  // ---------- Audio ----------
  function isMutedUI() { return els.mute?.getAttribute('data-muted') === '1'; }

  function setMutedUI(muted) {
    if (!els.mute) return;
    els.mute.setAttribute('data-muted', muted ? '1' : '0');
    els.mute.textContent = muted ? '🔇' : '🔊';
    if (els.vol) els.vol.disabled = muted;
  }

  function loadAudioPrefs() {
    const v = Number(localStorage.getItem(LS_VOL));
    const m = localStorage.getItem(LS_MUTED);
    if (Number.isFinite(v)) lastVolume = Math.max(0, Math.min(100, v));
    if (els.vol) els.vol.value = String(lastVolume);
    if (els.volText) els.volText.textContent = `${lastVolume}%`;
    setMutedUI(m === '1');
  }

  function saveAudioPrefs() {
    try {
      localStorage.setItem(LS_VOL, String(lastVolume));
      localStorage.setItem(LS_MUTED, isMutedUI() ? '1' : '0');
    } catch (_) {}
  }

  function applyAudioToPlayer() {
    if (!ytReady || !yt) return;
    try {
      yt.setVolume(lastVolume);
      if (isMutedUI()) yt.mute();
      else yt.unMute();
    } catch (_) {}
  }

  function setVolume(v) {
    lastVolume = Math.max(0, Math.min(100, Number(v) || 0));
    if (els.volText) els.volText.textContent = `${lastVolume}%`;
    if (ytReady && yt && !isMutedUI()) {
      try { yt.setVolume(lastVolume); } catch (_) {}
    }
    saveAudioPrefs();
  }

  function toggleMute() {
    const nowMuted = !isMutedUI();
    setMutedUI(nowMuted);
    if (ytReady && yt) {
      try {
        if (nowMuted) yt.mute();
        else { yt.unMute(); yt.setVolume(lastVolume); }
      } catch (_) {}
    }
    saveAudioPrefs();
  }

  // ---------- Quality ----------
  function pickBestQuality() {
    if (!ytReady || !yt) return 'highres';
    try {
      const levels = typeof yt.getAvailableQualityLevels === 'function' ? yt.getAvailableQualityLevels() || [] : [];
      for (const q of QUALITY_ORDER) if (levels.includes(q)) return q;
    } catch (_) {}
    return 'highres';
  }

  function forceMaxQuality() {
    if (!ytReady || !yt) return;
    const q = pickBestQuality();
    safeCall(() => yt.setPlaybackQualityRange(q));
    safeCall(() => yt.setPlaybackQuality(q));
  }

  // ---------- Getters ----------
  function getCurrentTime() {
    if (!ytReady || !yt) return 0;
    try { return Number(yt.getCurrentTime()) || 0; } catch (_) { return 0; }
  }

  function getDuration() {
    if (!ytReady || !yt) return 0;
    try { return Number(yt.getDuration()) || 0; } catch (_) { return 0; }
  }

  function isPlayerPlaying() {
    if (!ytReady || !yt) return false;
    try {
      const s = yt.getPlayerState();
      return s === window.YT.PlayerState.PLAYING || s === window.YT.PlayerState.BUFFERING;
    } catch (_) { return false; }
  }

  function setPlaybackRateSafe(r) {
    if (!ytReady || !yt) return;
    const rate = Math.max(0.9, Math.min(1.1, r));
    try {
      const cur = yt.getPlaybackRate?.();
      if (cur && Math.abs(cur - rate) < 0.01) return;
    } catch (_) {}
    safeCall(() => yt.setPlaybackRate(rate));
  }

  // ---------- Load video ----------
  async function loadVideo(id) {
    const vid = String(id || '').trim();
    if (!vid) return;

    currentVideoId = vid;
    document.body.classList.add('wp-hasVideo');

    await ensurePlayer();
    await waitUntilReady(7000);

    try { requestAnimationFrame(fitPlayer); } catch (_) {}

    safeCall(() => yt.loadVideoById({ videoId: vid, startSeconds: 0, suggestedQuality: 'highres' }));
    setTimeout(fitPlayer, 120);
    setTimeout(forceMaxQuality, 250);
    setTimeout(applyAudioToPlayer, 160);

    if (desiredTHSub) setTimeout(tryEnableThaiCaptions, 350);
  }

  // ---------- Ultra sync ----------
  function expectedTimeFromState(st) {
    const base = Math.max(0, Number(st.t) || 0);
    const serverTs = Number(st.ts) || 0;
    if (!st.isPlaying || !serverTs) return base;
    const elapsed = (nowServerMs() - serverTs) / 1000;
    return Math.max(0, base + Math.max(0, elapsed));
  }

  function hardApply(st) {
    if (!ytReady || !yt) return;

    const wantPlay = !!st.isPlaying;
    const target = expectedTimeFromState(st);

    safeCall(() => yt.seekTo(target, true));

    if (wantPlay) setTimeout(() => safeCall(() => yt.playVideo()), 40);
    else setTimeout(() => safeCall(() => yt.pauseVideo()), 40);

    setPlaybackRateSafe(1.0);
    setTimeout(forceMaxQuality, 120);
    setTimeout(forceMaxQuality, 650);

    if (desiredTHSub) setTimeout(tryEnableThaiCaptions, 200);
  }

  let lockTimer = null;
  function startLockLoop() {
    if (lockTimer) return;
    lockTimer = setInterval(() => {
      const st = applyServerState.__last;
      if (!st || !ytReady || !yt) return;
      if (isScrubbing) return;

      const wantPlay = !!st.isPlaying;
      const target = expectedTimeFromState(st);
      const cur = getCurrentTime();
      const drift = target - cur;

      if (!wantPlay) {
        setPlaybackRateSafe(1.0);
        if (Math.abs(drift) > 0.16) safeCall(() => yt.seekTo(target, true));
        return;
      }

      const abs = Math.abs(drift);
      if (abs > 1.8) {
        setPlaybackRateSafe(1.0);
        safeCall(() => yt.seekTo(target, true));
        return;
      }

      const rate = 1.0 + drift * 0.08;
      setPlaybackRateSafe(rate);
    }, 250);
  }

  function applyServerState(st) {
    if (!st) return;

    const seq = Number(st.seq);
    if (!Number.isNaN(seq) && seq >= 0) {
      if (seq <= lastSeq) return;
      lastSeq = seq;
    }

    if (isScrubbing) return;

    const url = String(st.url || '');
    const vid = parseYouTubeId(url) || null;

    if (vid && vid !== currentVideoId) {
      loadVideo(vid)
        .then(() => setTimeout(() => hardApply(st), 150))
        .catch(() => {});
      return;
    }

    if (!ytReady || !yt) return;

    if (!applyServerState.__didInitialSnap) {
      applyServerState.__didInitialSnap = true;
      hardApply(st);
      return;
    }

    const nowPlaying = isPlayerPlaying();
    const wantPlay = !!st.isPlaying;
    if (wantPlay && !nowPlaying) safeCall(() => yt.playVideo());
    if (!wantPlay && nowPlaying) safeCall(() => yt.pauseVideo());
  }

  applyServerState.__last = null;
  applyServerState.__didInitialSnap = false;

  // ---------- Set -> play immediately ----------
  let __pendingSetPlay = null;
  function setUrlFromInput() {
    const id = parseYouTubeId(els.url?.value || '');
    if (!id) {
      showUrlError('ลิงก์ไม่ถูกต้อง — ใส่ได้เฉพาะ YouTube เท่านั้น');
      return;
    }
    showUrlError('');
    __pendingSetPlay = { vid: id, startedAt: Date.now() };
    socket.emit('wp:set_url', { url: normalizeYouTubeUrl(id), provider: 'youtube' });
  }

  function requestFullscreen() {
    const el = els.playerWrap;
    if (!el) return;
    const doc = document;
    if (!doc.fullscreenElement) el.requestFullscreen?.();
    else doc.exitFullscreen?.();
  }

  // ---------- Scrub ----------
  function bindScrub() {
    if (!els.scrub) return;

    const scrubStart = () => {
      if (!ytReady || !yt) return;
      if (isScrubbing) return;

      isScrubbing = true;
      suppressScrub = true;

      scrubWasPlaying = isPlayerPlaying();

      const t = getCurrentTime();
      safeCall(() => yt.pauseVideo());
      setPlaybackRateSafe(1.0);

      socket.emit('wp:pause', { t });
    };

    const scrubPreview = () => {
      const dur = getDuration();
      const t = dur ? ((Number(els.scrub.value) || 0) / 1000) * dur : 0;
      if (els.timeCur) els.timeCur.textContent = fmtTime(t);
    };

    let lastCommitAt = 0;
    const scrubCommit = () => {
      const now = Date.now();
      if (!isScrubbing) return;
      if (now - lastCommitAt < 120) return;
      lastCommitAt = now;

      isScrubbing = false;
      suppressScrub = false;

      const dur = getDuration();
      const v = Number(els.scrub.value) || 0;
      const t = dur ? (v / 1000) * dur : 0;

      socket.emit('wp:seek', { t });
      if (scrubWasPlaying) socket.emit('wp:play', { t });
    };

    els.scrub.addEventListener('pointerdown', (e) => {
      try { els.scrub.setPointerCapture?.(e.pointerId); } catch (_) {}
      scrubStart();
    });
    els.scrub.addEventListener('input', scrubPreview);
    els.scrub.addEventListener('pointerup', scrubCommit);
    els.scrub.addEventListener('change', scrubCommit);
    els.scrub.addEventListener('pointercancel', scrubCommit);
    els.scrub.addEventListener('lostpointercapture', scrubCommit);
  }

  // ---------- Friends invite (private) ----------
  async function loadFriends() {
    if (!els.friends) return;
    try {
      const r = await fetch('/api/friends/list', { credentials: 'include' });
      const data = await r.json();
      const friends = data?.friends || [];

      els.friends.innerHTML = '';
      if (!friends.length) {
        els.friends.innerHTML = '<div class="wp-help">ยังไม่มีเพื่อน</div>';
        return;
      }

      friends.forEach((f) => {
        const row = document.createElement('label');
        row.className = 'wp-friendRow';
        row.innerHTML = `<span class="wp-friendName">${escapeHtml(f.username || 'user#' + f.id)}</span>
                         <input type="checkbox" value="${String(f.id)}" />`;
        els.friends.appendChild(row);
      });
    } catch (e) {
      console.warn(e);
      els.friends.innerHTML = '<div class="wp-help wp-help--error">โหลดรายชื่อเพื่อนไม่ได้</div>';
    }
  }

  async function inviteSelected() {
    if (!els.friends || !els.invite) return;

    const checks = [...els.friends.querySelectorAll('input[type="checkbox"]:checked')];
    const friendIds = checks.map((c) => Number(c.value)).filter((n) => Number.isFinite(n));
    if (!friendIds.length) return;

    try {
      const r = await fetch(`/api/watch/rooms/${encodeURIComponent(roomId)}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendIds }),
      });
      const data = await r.json();
      if (data?.ok) {
        els.invite.textContent = 'Invited';
        setTimeout(() => (els.invite.textContent = 'Invite'), 900);
        checks.forEach((c) => (c.checked = false));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // ---------- Tick UI ----------
  let ticking = false;
  function startTick() {
    if (ticking) return;
    ticking = true;

    const loop = () => {
      if (!ytReady || !yt) {
        requestAnimationFrame(loop);
        return;
      }

      const dur = getDuration();
      const cur = getCurrentTime();

      if (els.timeCur) els.timeCur.textContent = fmtTime(cur);
      if (els.timeDur) els.timeDur.textContent = fmtTime(dur);

      if (dur > 0 && els.scrub && !suppressScrub) {
        const v = Math.max(0, Math.min(1000, Math.round((cur / dur) * 1000)));
        els.scrub.value = String(v);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  // ---------- Socket wiring ----------
  function setOnlineCount(n) {
    if (!els.online) return;
    const v = Number(n);
    els.online.textContent = Number.isFinite(v) ? String(v) : '0';
  }

  socket.emit('wp:join', { roomId, k: joinKey });

  socket.on('wp:joined', (payload = {}) => {
    setOnlineCount(payload.membersOnline ?? payload.online);
    if (payload.state) {
      applyServerState.__last = payload.state;
      applyServerState(payload.state);
      startLockLoop();
    }
  });

  socket.on('wp:presence', (payload = {}) => {
    setOnlineCount(payload.membersOnline ?? payload.online);
  });

  socket.on('wp:state', (st) => {
    if (!st) return;

    applyServerState.__last = st;
    applyServerState(st);
    startLockLoop();

    if (__pendingSetPlay) {
      const age = Date.now() - (__pendingSetPlay.startedAt || 0);
      const vid = parseYouTubeId(String(st.url || '')) || null;
      if (age < 5000 && vid && vid === __pendingSetPlay.vid) {
        socket.emit('wp:play', { t: Math.max(0, Number(st.t) || 0) });
        __pendingSetPlay = null;
      } else if (age >= 5000) {
        __pendingSetPlay = null;
      }
    }
  });

  socket.on('wp:error', (e) => showUrlError(e?.message || 'Error'));

  // ---------- UI events ----------
  if (els.set) els.set.addEventListener('click', setUrlFromInput);
  if (els.url) els.url.addEventListener('keydown', (e) => { if (e.key === 'Enter') setUrlFromInput(); });

  if (els.play) els.play.addEventListener('click', () => socket.emit('wp:play', { t: getCurrentTime() }));
  if (els.pause) els.pause.addEventListener('click', () => socket.emit('wp:pause', { t: getCurrentTime() }));
  if (els.sync) els.sync.addEventListener('click', () => socket.emit('wp:ping_state'));
  if (els.fs) els.fs.addEventListener('click', requestFullscreen);

  if (els.subTH) {
    updateSubButtonUI();
    els.subTH.addEventListener('click', () => {
      desiredTHSub = !desiredTHSub;
      updateSubButtonUI();
      if (desiredTHSub) tryEnableThaiCaptions();
      else tryDisableCaptions();
    });
  }

  loadAudioPrefs();
  if (els.vol) els.vol.addEventListener('input', () => setVolume(els.vol.value));
  if (els.mute) els.mute.addEventListener('click', toggleMute);

  bindScrub();

  if (!isPublic) {
    loadFriends();
    if (els.invite) els.invite.addEventListener('click', inviteSelected);
  }

  doTimeSync(8);
  setInterval(() => socket.emit('wp:ping_state'), 3500);

  ensurePlayer().catch(() => {});
})();
