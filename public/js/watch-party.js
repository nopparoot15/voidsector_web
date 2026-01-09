/* public/js/watch-party.js
 * YouTube-only Watch Party (custom controls)
 * - Sync: play/pause/seek/url via Socket.IO (server-authoritative)
 * - Audio, quality, captions: local-only (not synced)
 *
 * Captions note:
 * - YouTube IFrame API often ignores runtime caption toggles for some videos/browsers.
 * - So TH Sub uses best-effort:
 *    1) try setOption('captions','track', {languageCode:'th'})
 *    2) fallback: rebuild the player with cc_load_policy=1 (more reliable)
 */

(function () {
  'use strict';

  // -------------------------
  // Basics
  // -------------------------
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
    player: document.getElementById('wpPlayer'),

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

  // -------------------------
  // Share link (public/private)
  // -------------------------
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

  // -------------------------
  // UI helpers
  // -------------------------
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

  // -------------------------
  // YouTube URL helpers
  // -------------------------
  function parseYouTubeId(input) {
    const s = String(input || '').trim();
    if (!s) return null;

    // raw video id
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

    try {
      const u = new URL(s);
      const host = u.hostname.replace(/^www\./, '').toLowerCase();

      // youtu.be/<id>
      if (host === 'youtu.be') {
        const id = u.pathname.split('/').filter(Boolean)[0];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }

      // youtube.com / m.youtube.com / music.youtube.com
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

  // -------------------------
  // YouTube IFrame API integration
  // -------------------------
  let yt = null;
  let ytReady = false;
  let currentVideoId = null;

  // server ordering
  let lastSeq = -1;

  // local interaction flags
  let isScrubbing = false;
  let scrubWasPlaying = false;
  let suppressScrub = false;

  // captions (local-only)
  let desiredTHSub = false;

  // audio prefs (local-only)
  const LS_VOL = `vs_wp_vol_${roomId}`;
  const LS_MUTED = `vs_wp_muted_${roomId}`;
  let lastVolume = 80;

  // quality (local-only)
  const QUALITY_ORDER = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];

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
        try {
          if (typeof prev === 'function') prev();
        } catch (_) {}
        resolve();
      };

      document.head.appendChild(s);
    });

    return ytApiPromise;
  }

  function fitPlayer() {
    if (!els.playerWrap || !yt || typeof yt.setSize !== 'function') return;
    const r = els.playerWrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    try {
      yt.setSize(w, h);
    } catch (_) {}
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

        // captions default (more reliable than runtime toggling)
        cc_load_policy: desiredTHSub ? 1 : 0,
        cc_lang_pref: 'th',
        hl: 'th',
      },
      events: {
        onReady: () => {
          ytReady = true;
          applyAudioToPlayer();
          fitPlayer();
          forceMaxQuality();
          startTick();

          // Ask server state (or restore after rebuild via loadVideo)
          socket.emit('wp:ping_state');
        },
        onStateChange: (ev) => {
          const st = ev && typeof ev.data === 'number' ? ev.data : null;
          if (st === window.YT.PlayerState.PLAYING || st === window.YT.PlayerState.BUFFERING) {
            forceMaxQuality();
            setTimeout(forceMaxQuality, 250);
            setTimeout(forceMaxQuality, 900);

            // try captions after playback begins
            if (desiredTHSub) setTimeout(tryEnableThaiCaptionsOnce, 120);
          }
        },
        onError: (e) => {
          console.warn('[watch-party] YT error', e?.data);
        },
      },
    });
  }

  async function ensurePlayer() {
    await loadYTApi();
    if (!yt) createPlayer();
  }

  async function waitUntilReady(maxMs = 6000) {
    const start = Date.now();
    while (!(ytReady && yt)) {
      if (Date.now() - start > maxMs) throw new Error('YT ready timeout');
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  async function rebuildPlayerAndRestore() {
    // Rebuild to apply cc_load_policy reliably
    const keepId = currentVideoId;
    const t = getCurrentTime();
    const wasPlaying = isPlayerPlaying();

    try {
      if (yt && typeof yt.destroy === 'function') yt.destroy();
    } catch (_) {}

    yt = null;
    ytReady = false;

    await ensurePlayer();
    await waitUntilReady(6000);

    if (keepId) {
      currentVideoId = keepId;
      try {
        yt.loadVideoById({ videoId: keepId, startSeconds: Math.max(0, t), suggestedQuality: 'highres' });
      } catch (_) {}

      if (!wasPlaying) {
        setTimeout(() => { try { yt.pauseVideo(); } catch (_) {} }, 100);
      }

      setTimeout(applyAudioToPlayer, 140);
      setTimeout(forceMaxQuality, 220);
      setTimeout(fitPlayer, 220);
      if (desiredTHSub) setTimeout(tryEnableThaiCaptionsOnce, 320);
    }
  }

  // -------------------------
  // Audio (local-only)
  // -------------------------
  function isMutedUI() {
    return els.mute?.getAttribute('data-muted') === '1';
  }

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

  // -------------------------
  // Quality (local-only)
  // -------------------------
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
    try { yt.setPlaybackQualityRange(q); } catch (_) {}
    try { yt.setPlaybackQuality(q); } catch (_) {}
  }

  // -------------------------
  // Captions (local-only best-effort)
  // -------------------------
  function tryEnableThaiCaptionsOnce() {
    if (!ytReady || !yt) return false;
    try {
      yt.loadModule('captions');
      try { yt.setOption('captions', 'track', { languageCode: 'th' }); } catch (_) {}
      try { yt.setOption('captions', 'reload', true); } catch (_) {}
      return true;
    } catch (_) {
      return false;
    }
  }

  function captionsLooksThai() {
    if (!ytReady || !yt) return false;
    try {
      const cur = yt.getOption('captions', 'track') || {};
      return !!(cur && cur.languageCode === 'th');
    } catch (_) {
      return false;
    }
  }

  async function setTHSub(enabled) {
    desiredTHSub = !!enabled;
    updateSubButtonUI();

    if (!ytReady || !yt) return;

    if (desiredTHSub) {
      tryEnableThaiCaptionsOnce();

      // If still not applied, fallback rebuild (cc_load_policy=1)
      setTimeout(() => {
        if (!desiredTHSub) return;
        if (captionsLooksThai()) return;
        rebuildPlayerAndRestore().catch(() => {});
      }, 650);
    } else {
      // Try turning off
      try {
        yt.loadModule('captions');
        try { yt.setOption('captions', 'track', {}); } catch (_) {}
        try { yt.setOption('captions', 'reload', true); } catch (_) {}
      } catch (_) {}

      // Fallback rebuild (cc_load_policy=0)
      setTimeout(() => {
        if (desiredTHSub) return;
        rebuildPlayerAndRestore().catch(() => {});
      }, 450);
    }
  }

  // -------------------------
  // Player getters
  // -------------------------
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
    } catch (_) {
      return false;
    }
  }

  // -------------------------
  // Load video (local)
  // -------------------------
  async function loadVideo(id) {
    const vid = String(id || '').trim();
    if (!vid) return;

    currentVideoId = vid;
    document.body.classList.add('wp-hasVideo');

    try {
      await ensurePlayer();
      await waitUntilReady(6000);
    } catch (e) {
      console.warn('[watch-party] ensurePlayer failed', e);
      return;
    }

    try { requestAnimationFrame(fitPlayer); } catch (_) {}

    try {
      yt.loadVideoById({ videoId: vid, startSeconds: 0, suggestedQuality: 'highres' });
    } catch (_) {
      try { yt.cueVideoById({ videoId: vid, startSeconds: 0, suggestedQuality: 'highres' }); } catch (__) {}
    }

    setTimeout(fitPlayer, 80);
    setTimeout(fitPlayer, 400);

    setTimeout(applyAudioToPlayer, 140);
    setTimeout(forceMaxQuality, 240);
    if (desiredTHSub) setTimeout(tryEnableThaiCaptionsOnce, 320);
  }

  // -------------------------
  // Server-authoritative sync
  // -------------------------
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

    if (vid && vid !== currentVideoId) loadVideo(vid);

    if (!ytReady || !yt) return;

    const wantPlay = !!st.isPlaying;
    const t = Math.max(0, Number(st.t) || 0);

    const cur = getCurrentTime();
    const drift = Math.abs(cur - t);
    const SHOULD_SEEK = drift > 0.25;

    let didSeek = false;
    if (SHOULD_SEEK) {
      try { yt.seekTo(t, true); didSeek = true; } catch (_) {}
    }

    const nowPlaying = isPlayerPlaying();

    if (wantPlay && !nowPlaying) {
      setTimeout(() => { try { yt.playVideo(); } catch (_) {} }, didSeek ? 60 : 0);
    } else if (!wantPlay && nowPlaying) {
      try { yt.pauseVideo(); } catch (_) {}
    }

    if (wantPlay || didSeek) {
      setTimeout(forceMaxQuality, 80);
      setTimeout(forceMaxQuality, 350);
      setTimeout(forceMaxQuality, 900);
      if (desiredTHSub) setTimeout(tryEnableThaiCaptionsOnce, 140);
    }
  }

  // -------------------------
  // UI actions -> emit
  // -------------------------
  function setUrlFromInput() {
    const id = parseYouTubeId(els.url?.value || '');
    if (!id) {
      showUrlError('ลิงก์ไม่ถูกต้อง — ใส่ได้เฉพาะ YouTube เท่านั้น');
      return;
    }
    showUrlError('');
    socket.emit('wp:set_url', { url: normalizeYouTubeUrl(id), provider: 'youtube' });
  }

  function requestFullscreen() {
    const el = els.playerWrap;
    if (!el) return;
    const doc = document;
    if (!doc.fullscreenElement) el.requestFullscreen?.();
    else doc.exitFullscreen?.();
  }

  // -------------------------
  // Scrub (stable pointer events)
  // -------------------------
  function bindScrub() {
    if (!els.scrub) return;

    const scrubStart = () => {
      if (!ytReady || !yt) return;
      if (isScrubbing) return;

      isScrubbing = true;
      suppressScrub = true;
      scrubWasPlaying = isPlayerPlaying();

      const t = getCurrentTime();
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

    els.scrub.addEventListener('pointerdown', scrubStart);
    els.scrub.addEventListener('input', scrubPreview);
    els.scrub.addEventListener('pointerup', scrubCommit);
    els.scrub.addEventListener('change', scrubCommit);
    els.scrub.addEventListener('pointercancel', scrubCommit);
    els.scrub.addEventListener('lostpointercapture', scrubCommit);
  }

  // -------------------------
  // Friends invite (private)
  // -------------------------
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

  // -------------------------
  // Loop: update scrub/time
  // -------------------------
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

  // -------------------------
  // Socket wiring
  // -------------------------
  function setOnlineCount(n) {
    if (!els.online) return;
    const v = Number(n);
    els.online.textContent = Number.isFinite(v) ? String(v) : '0';
  }

  socket.emit('wp:join', { roomId, k: joinKey });

  socket.on('wp:joined', (payload = {}) => {
    setOnlineCount(payload.membersOnline ?? payload.online);
    if (payload.state) applyServerState(payload.state);
  });

  socket.on('wp:presence', (payload = {}) => {
    setOnlineCount(payload.membersOnline ?? payload.online);
  });

  socket.on('wp:state', (st) => {
    applyServerState(st || {});
  });

  socket.on('wp:error', (e) => {
    showUrlError(e?.message || 'Error');
  });

  // -------------------------
  // UI events
  // -------------------------
  if (els.set) els.set.addEventListener('click', setUrlFromInput);
  if (els.url) {
    els.url.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setUrlFromInput();
    });
  }

  if (els.play) els.play.addEventListener('click', () => socket.emit('wp:play', { t: getCurrentTime() }));
  if (els.pause) els.pause.addEventListener('click', () => socket.emit('wp:pause', { t: getCurrentTime() }));
  if (els.sync) els.sync.addEventListener('click', () => socket.emit('wp:ping_state'));

  if (els.subTH) {
    updateSubButtonUI();
    els.subTH.addEventListener('click', () => setTHSub(!desiredTHSub));
  }

  if (els.fs) els.fs.addEventListener('click', requestFullscreen);

  loadAudioPrefs();
  if (els.vol) els.vol.addEventListener('input', () => setVolume(els.vol.value));
  if (els.mute) els.mute.addEventListener('click', toggleMute);

  bindScrub();

  if (!isPublic) {
    loadFriends();
    if (els.invite) els.invite.addEventListener('click', inviteSelected);
  }

  // Preload YT API + create player early
  ensurePlayer().catch(() => {});
})();
