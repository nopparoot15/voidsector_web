/* public/js/watch-party.js
 * VOIDSECTOR Watch Party (stable, best-effort realtime)
 *
 * Goals:
 * - Use custom controls under the player (Play/Pause, Volume, Detailed scrub)
 * - Keep the room in sync using server-authoritative state (t, isPlaying, updatedAt)
 * - Support:
 *    - YouTube (IFrame API) : full control + quality selection
 *    - Direct media files (mp4/webm/ogg) : full control + chapters(track kind=chapters) markers
 *    - Other sites : embed if allowed, otherwise open in new tab; sync is timestamp-only
 * - True fullscreen: wrapper fills viewport regardless of aspect ratio
 *
 * Notes:
 * - YouTube chapters/marks are NOT exposed via IFrame API. We provide manual +Mark.
 * - Quality is per-user (not synced) because different users may prefer different qualities.
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
    playerWrap: document.getElementById('wpPlayerWrap'),
    controls: document.getElementById('wpControls'),
    play: document.getElementById('wpPlay'),
    pause: document.getElementById('wpPause'),
    sync: document.getElementById('wpSync'),
    mute: document.getElementById('wpMute'),
    vol: document.getElementById('wpVol'),
    volVal: document.getElementById('wpVolVal'),
    fs: document.getElementById('wpFs'),
    qualityWrap: document.getElementById('wpQWrap'),
    quality: document.getElementById('wpQuality'),
    mark: document.getElementById('wpMark'),
    scrubWrap: document.getElementById('wpScrubWrap'),
    scrub: document.getElementById('wpScrub'),
    timeCur: document.getElementById('wpTimeCur'),
    timeDur: document.getElementById('wpTimeDur'),
    marksDatalist: document.getElementById('wpMarks'),
    marksBar: document.getElementById('wpMarksBar'),
    marksList: document.getElementById('wpMarksList'),
    // private room invite
    friends: document.getElementById('wpFriends'),
    invite: document.getElementById('wpInvite'),
  };

  // ----------------------------
  // Build share link
  // ----------------------------
  (function buildShare() {
    if (!els.share) return;
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    const base = String(roomId) === 'public'
      ? `${window.location.origin}/watch/public`
      : `${window.location.origin}/watch/r/${encodeURIComponent(roomId)}`;
    els.share.value = (!isPublic && k) ? `${base}?k=${encodeURIComponent(k)}` : base;
    els.copy?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(els.share.value); } catch (e) {}
    });
  })();

  // ----------------------------
  // Socket
  // ----------------------------
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
  socket.on('chat:me', () => { identified = true; });
  socket.on('connect', sendHello);
  sendHello();

  // ----------------------------
  // Server time sync (clock skew)
  // ----------------------------
  let serverOffsetMs = 0; // serverNow ~= Date.now() + serverOffsetMs
  let timeSyncDone = false;
  let timeSyncRunning = false;
  let timeSyncListenerInit = false;

  function serverNowMs() { return Date.now() + (serverOffsetMs || 0); }
  function median(arr) {
    const a = arr.slice().sort((x, y) => x - y);
    const m = Math.floor(a.length / 2);
    return a.length ? (a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2) : 0;
  }
  function startTimeSync(samples = 7) {
    if (timeSyncDone || timeSyncRunning) return;
    timeSyncRunning = true;
    const offsets = [];
    let done = 0;

    function ping() {
      const t0 = Date.now();
      socket.emit('wp:time_sync', { t0 });
      setTimeout(() => {
        if (done >= samples) return;
        ping();
      }, 900);
    }

    if (!timeSyncListenerInit) {
      timeSyncListenerInit = true;
      socket.on('wp:time_sync', (m) => {
        try {
          const t1 = Date.now();
          const t0 = Number(m?.t0) || 0;
          const ts = Number(m?.ts) || 0;
          if (!t0 || !ts) return;
          const off = ts - ((t0 + t1) / 2);
          if (Number.isFinite(off)) offsets.push(off);
          done += 1;
          if (done >= samples) {
            serverOffsetMs = median(offsets);
            timeSyncDone = true;
            timeSyncRunning = false;
          }
        } catch (e) {}
      });
    }

    ping();
  }

  // ----------------------------
  // Join room (robust)
  // ----------------------------
  let joined = false;
  function joinRoom() {
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    socket.emit('wp:join', { roomId, k });
  }
  function ensureJoined() {
    if (joined) return;
    if (!socket.connected) return;
    if (!identified) {
      sendHello();
      setTimeout(ensureJoined, 250);
      return;
    }
    startTimeSync();
    joinRoom();
    setTimeout(ensureJoined, 900);
  }
  socket.on('connect', () => setTimeout(ensureJoined, 60));
  if (socket.connected) setTimeout(ensureJoined, 60);

  socket.on('wp:error', (e) => {
    try { console.warn('[watchparty]', e?.message || e); } catch (err) {}
  });
  socket.on('wp:presence', (p) => {
    if (els.online) els.online.textContent = String(p?.membersOnline || p?.count || 0);
  });

  // ----------------------------
  // Provider detection
  // ----------------------------
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

  // ----------------------------
  // Local volume (not synced)
  // ----------------------------
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
      const icon = (userMuted || userVolume === 0) ? '🔇' : (userVolume < 40 ? '🔈' : '🔊');
      els.mute.textContent = icon;
    }
  }

  // ----------------------------
  // Player implementations
  // ----------------------------
  let current = { url: '', provider: 'generic', id: null };
  let ytPlayer = null;
  let ytReady = false;
  let html5Video = null;
  let lastRemoteAppliedAt = 0;
  let suppressLocalEvents = false;

  // Server-authoritative state
  let lastState = null;
  let desiredPlaying = null;
  let pendingState = null;

  function clearPlayer() {
    try {
      if (ytPlayer) {
        ytPlayer.destroy();
        ytPlayer = null;
      }
    } catch (e) {}
    ytReady = false;

    if (html5Video) {
      try { html5Video.pause(); } catch (e) {}
      try { html5Video.remove(); } catch (e) {}
      html5Video = null;
    }
    if (els.player) els.player.innerHTML = '';
    if (els.qualityWrap) els.qualityWrap.style.display = 'none';
    if (els.controls) els.controls.style.display = 'none';
    clearMarks();
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
  applyVolumeToPlayer();
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

  // --- Fullscreen ---
  (function initFullscreen() {
    const btn = els.fs;
    if (!btn) return;
    const wrap = els.playerWrap || els.player || document.documentElement;
    function fsElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }
    function setBtn() {
      const on = !!fsElement();
      btn.textContent = on ? '🗗' : '⛶';
      btn.title = on ? 'Exit Fullscreen' : 'Fullscreen';
    }
    async function enter() {
      // iOS Safari: only <video> can go fullscreen
      if (html5Video && typeof html5Video.webkitEnterFullscreen === 'function') {
        try { html5Video.webkitEnterFullscreen(); return; } catch (e) {}
      }
      try {
        if (wrap.requestFullscreen) await wrap.requestFullscreen();
        else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
        else if (wrap.mozRequestFullScreen) wrap.mozRequestFullScreen();
        else if (wrap.msRequestFullscreen) wrap.msRequestFullscreen();
      } catch (e) {}
      setBtn();
    }
    async function exit() {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      } catch (e) {}
      setBtn();
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (fsElement()) exit(); else enter();
    });
    document.addEventListener('fullscreenchange', setBtn);
    document.addEventListener('webkitfullscreenchange', setBtn);
    setBtn();
  })();

  // --- YouTube API loader ---
  function ensureYouTubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (window.__WP_YT_LOADING) return window.__WP_YT_LOADING;
    window.__WP_YT_LOADING = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try { if (typeof prev === 'function') prev(); } catch (e) {}
        resolve();
      };
      setTimeout(resolve, 5000);
    });
    return window.__WP_YT_LOADING;
  }

  function setupQualityMenu() {
    if (!els.quality || !els.qualityWrap) return;
    if (!ytPlayer || !ytReady || typeof ytPlayer.getAvailableQualityLevels !== 'function') {
      els.qualityWrap.style.display = 'none';
      return;
    }
    try {
      const levels = ytPlayer.getAvailableQualityLevels() || [];
      if (!Array.isArray(levels) || levels.length === 0) {
        els.qualityWrap.style.display = 'none';
        return;
      }
      // Sort: higher first (rough heuristic)
      const order = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'auto'];
      const uniq = Array.from(new Set(levels));
      uniq.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      els.quality.innerHTML = uniq.map(q => `<option value="${q}">${q}</option>`).join('');
      els.qualityWrap.style.display = '';
      // set current
      const cur = (typeof ytPlayer.getPlaybackQuality === 'function') ? ytPlayer.getPlaybackQuality() : '';
      if (cur) els.quality.value = cur;
    } catch (e) {
      els.qualityWrap.style.display = 'none';
    }
  }

  els.quality?.addEventListener('change', () => {
    if (!ytPlayer || !ytReady) return;
    try {
      const q = String(els.quality.value || '');
      if (q && ytPlayer.setPlaybackQuality) ytPlayer.setPlaybackQuality(q);
    } catch (e) {}
  });

  async function mountYouTube(videoId) {
    await ensureYouTubeAPI();
    clearPlayer();
    const div = document.createElement('div');
    div.id = 'wpYt';
    els.player.appendChild(div);
    ytReady = false;

    ytPlayer = new window.YT.Player('wpYt', {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          ytReady = true;
          if (els.controls) els.controls.style.display = '';
          applyVolumeToPlayer();
          setupQualityMenu();
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
            if (!ytPlayer || !ytReady) return;
            const t = Number(ytPlayer.getCurrentTime?.() || 0);
            const sinceRemote = Date.now() - (lastRemoteAppliedAt || 0);
            if (sinceRemote < 900) return; // ignore right after remote apply

            // User used native UI: propagate play/pause best-effort
            // 1=PLAYING, 2=PAUSED
            if (st === 2) socket.emit('wp:pause', { t });
            if (st === 1) socket.emit('wp:play', { t });
          } catch (e) {}
        },
      },
    });
  }

  function mountHtml5(url) {
    clearPlayer();
    const v = document.createElement('video');
    v.src = url;
    v.controls = false; // use our controls
    v.playsInline = true;
    v.preload = 'metadata';
    v.style.width = '100%';
    v.style.height = '100%';
    v.style.objectFit = 'contain';
    v.setAttribute('webkit-playsinline', '');
    els.player.appendChild(v);
    html5Video = v;
    if (els.controls) els.controls.style.display = '';
    applyVolumeToPlayer();

    // chapters markers (if provided by the file via a <track kind="chapters">)
    v.addEventListener('loadedmetadata', () => {
      tryLoadChaptersFromTracks();
    });

    // propagate local interactions
    v.addEventListener('play', () => {
      if (suppressLocalEvents) return;
      const sinceRemote = Date.now() - (lastRemoteAppliedAt || 0);
      if (sinceRemote < 900) return;
      socket.emit('wp:play', { t: v.currentTime || 0 });
    });
    v.addEventListener('pause', () => {
      if (suppressLocalEvents) return;
      const sinceRemote = Date.now() - (lastRemoteAppliedAt || 0);
      if (sinceRemote < 900) return;
      socket.emit('wp:pause', { t: v.currentTime || 0 });
    });
    v.addEventListener('seeked', () => {
      if (suppressLocalEvents) return;
      socket.emit('wp:seek', { t: v.currentTime || 0 });
    });
  }

  function mountGeneric(url) {
    clearPlayer();
    const box = document.createElement('div');
    box.className = 'wp-generic';
    box.innerHTML = `
      <div style="color:#e6f7ff;font-weight:800;margin-bottom:8px">ไม่สามารถควบคุมเว็บนี้ได้โดยตรง</div>
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
    els.player.appendChild(box);
    els.player.appendChild(frame);
    if (els.controls) els.controls.style.display = '';
  }

  function escapeAttr(s) {
    return String(s).replace(/["<>&]/g, (m) => ({ '"': '&quot;', '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]));
  }

  async function mountForUrl(url) {
    const det = detectProvider(url);
    current = { url, provider: det.provider, id: det.id };
    if (!url) { clearPlayer(); return; }
    if (det.provider === 'youtube' && det.id) return mountYouTube(det.id);
    if (det.provider === 'html5') return mountHtml5(url);
    return mountGeneric(url);
  }

  // ----------------------------
  // Marks (chapters/manual)
  // ----------------------------
  let marks = []; // {t:number,label:string}
  function clearMarks() {
    marks = [];
    if (els.marksDatalist) els.marksDatalist.innerHTML = '';
    if (els.marksBar) els.marksBar.innerHTML = '';
    if (els.marksList) {
      els.marksList.innerHTML = '';
      els.marksList.style.display = 'none';
    }
  }
  function addMark(t, label) {
    const tt = Math.max(0, Number(t) || 0);
    const lab = String(label || '').trim() || formatTime(tt);
    marks.push({ t: tt, label: lab });
    marks.sort((a, b) => a.t - b.t);
    renderMarks();
  }
  function renderMarks() {
    const dur = getDuration();
    if (!dur || dur <= 0.1) return;
    if (els.marksDatalist) {
      // datalist ticks (some browsers show, some don't)
      els.marksDatalist.innerHTML = marks.map(m => `<option value="${m.t.toFixed(2)}" label="${escapeAttr(m.label)}"></option>`).join('');
    }
    if (els.marksBar) {
      els.marksBar.innerHTML = marks.map(m => {
        const left = (m.t / dur) * 100;
        return `<i style="left:${left.toFixed(3)}%"></i>`;
      }).join('');
    }
    if (els.marksList) {
      if (marks.length) {
        els.marksList.style.display = '';
        els.marksList.innerHTML = marks.map(m => {
          const txt = `${formatTime(m.t)}${m.label && m.label !== formatTime(m.t) ? ' • ' + escapeHtml(m.label) : ''}`;
          return `<button type="button" data-t="${m.t}">${txt}</button>`;
        }).join('');
        els.marksList.querySelectorAll('button').forEach(b => {
          b.addEventListener('click', () => {
            const t = Number(b.getAttribute('data-t') || 0);
            if (Number.isFinite(t)) emitSeek(t, true);
          });
        });
      } else {
        els.marksList.style.display = 'none';
      }
    }
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function tryLoadChaptersFromTracks() {
    if (!html5Video) return;
    clearMarks();
    try {
      const tracks = Array.from(html5Video.textTracks || []);
      const chapters = tracks.find(t => t.kind === 'chapters') || tracks.find(t => t.kind === 'metadata');
      if (!chapters) return;
      chapters.mode = 'hidden';
      const cues = Array.from(chapters.cues || []);
      cues.forEach(c => {
        const t = Number(c.startTime) || 0;
        const label = (c.text || '').trim();
        addMark(t, label);
      });
    } catch (e) {}
  }

  els.mark?.addEventListener('click', () => {
    const t = getLocalTime();
    // For YouTube we cannot fetch chapters; provide manual mark.
    addMark(t, 'Mark');
  });

  // ----------------------------
  // Time helpers
  // ----------------------------
  function formatTime(sec) {
    const s = Math.max(0, Math.floor(Number(sec || 0)));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  }
  function getLocalTime() {
    if (current.provider === 'youtube' && ytPlayer && ytReady) {
      try { return Number(ytPlayer.getCurrentTime?.() || 0); } catch (e) { return 0; }
    }
    if (current.provider === 'html5' && html5Video) return Number(html5Video.currentTime || 0);
    return 0;
  }
  function getDuration() {
    try {
      if (current.provider === 'youtube' && ytPlayer && ytReady) return Number(ytPlayer.getDuration?.() || 0);
      if (current.provider === 'html5' && html5Video) return Number(html5Video.duration || 0);
    } catch (e) {}
    return 0;
  }

  // ----------------------------
  // Apply server state
  // ----------------------------
  function expectedTimeFromState(st) {
    const baseT = Number(st?.t) || 0;
    if (!st?.isPlaying) return baseT;
    const updatedAt = Number(st?.updatedAt) || serverNowMs();
    const dt = Math.max(0, (serverNowMs() - updatedAt) / 1000);
    return Math.max(0, baseT + dt);
  }

  async function applyState(st) {
    if (!st) return;
    lastState = st;
    desiredPlaying = !!st.isPlaying;

    const url = String(st.url || '');
    const urlChanged = url !== String(current.url || '');
    if (urlChanged) {
      await mountForUrl(url);
    }

    if (current.provider === 'youtube' && ytPlayer && !ytReady) {
      pendingState = st;
      return;
    }

    const expected = expectedTimeFromState(st);
    const cur = getLocalTime();
    const diff = expected - cur;
    const absDiff = Math.abs(diff);

    suppressLocalEvents = true;
    lastRemoteAppliedAt = Date.now();
    try {
      if (current.provider === 'youtube' && ytPlayer && ytReady) {
        // IMPORTANT: If paused, keep pause stable; only snap time if far.
        if (!st.isPlaying) {
          try { ytPlayer.pauseVideo(); } catch (e) {}
          if (absDiff > 0.45) {
            try { ytPlayer.seekTo(expected, true); } catch (e) {}
          }
          try { ytPlayer.setPlaybackRate?.(1.0); } catch (e) {}
        } else {
          if (absDiff > 0.9) {
            try { ytPlayer.seekTo(expected, true); } catch (e) {}
          }
          try { ytPlayer.playVideo(); } catch (e) {}
        }
        setupQualityMenu();
        applyVolumeToPlayer();
      } else if (current.provider === 'html5' && html5Video) {
        if (!st.isPlaying) {
          if (absDiff > 0.12) html5Video.currentTime = expected;
          html5Video.pause();
          html5Video.playbackRate = 1.0;
        } else {
          if (absDiff > 1.0) {
            html5Video.currentTime = expected;
            html5Video.playbackRate = 1.0;
          }
          const p = html5Video.play();
          if (p && p.catch) p.catch(() => {});
        }
        applyVolumeToPlayer();
      }
    } finally {
      setTimeout(() => { suppressLocalEvents = false; }, 600);
    }
  }

  socket.on('wp:joined', (j) => {
    joined = true;
    if (els.online) els.online.textContent = String(j?.membersOnline || 0);
    applyState(j?.state);
  });
  socket.on('wp:state', applyState);

  // ----------------------------
  // UI actions
  // ----------------------------
  els.set?.addEventListener('click', () => {
    const url = String(els.url?.value || '').trim();
    const det = detectProvider(url);
    // show immediately
    try { mountForUrl(url); } catch (e) {}
    socket.emit('wp:set_url', { url, provider: det.provider });
  });

  function emitSeek(t, alsoPlay) {
    const tt = Math.max(0, Number(t) || 0);
    socket.emit('wp:seek', { t: tt });
    if (alsoPlay) socket.emit('wp:play', { t: tt });
  }

  els.play?.addEventListener('click', () => {
    socket.emit('wp:play', { t: getLocalTime() });
  });
  els.pause?.addEventListener('click', () => {
    socket.emit('wp:pause', { t: getLocalTime() });
  });
  els.sync?.addEventListener('click', () => socket.emit('wp:ping_state'));

  // ----------------------------
  // Scrub: detailed seek (seconds, step=0.01)
  // ----------------------------
  let scrubDragging = false;
  let scrubWasPlaying = false;
  let scrubLastEmitAt = 0;

  function updateScrubUI() {
    const dur = getDuration();
    if (dur > 0.25) {
      if (els.scrubWrap) els.scrubWrap.style.display = '';
      if (els.scrub) {
        els.scrub.max = String(dur);
        els.scrub.step = '0.01';
      }
      if (els.timeDur) els.timeDur.textContent = formatTime(dur);
      const cur = getLocalTime();
      if (els.timeCur) els.timeCur.textContent = formatTime(cur);
      if (!scrubDragging && els.scrub) {
        els.scrub.value = String(Math.max(0, Math.min(dur, cur)));
      }
      // marks need duration
      renderMarks();
    } else {
      if (els.scrubWrap) els.scrubWrap.style.display = 'none';
    }
  }

  els.scrub?.addEventListener('pointerdown', () => {
    scrubDragging = true;
    scrubWasPlaying = !!(lastState && lastState.isPlaying);
  });
  window.addEventListener('pointerup', () => {
    if (!scrubDragging) return;
    scrubDragging = false;
    const t = Number(els.scrub?.value || 0);
    if (!Number.isFinite(t)) return;
    emitSeek(t, scrubWasPlaying);
  });
  els.scrub?.addEventListener('input', () => {
    if (!scrubDragging) return;
    const t = Number(els.scrub?.value || 0);
    if (els.timeCur) els.timeCur.textContent = formatTime(t);
    const now = Date.now();
    if (now - scrubLastEmitAt > 140) {
      scrubLastEmitAt = now;
      socket.emit('wp:seek', { t });
    }
  });

  setInterval(updateScrubUI, 250);

  // ----------------------------
  // Drift correction (while playing)
  // - Small drift: playbackRate nudge (HTML5 + YouTube if supported)
  // - Large drift: hard seek
  // ----------------------------
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function setRate(r) {
    r = clamp(r, 0.75, 1.25);
    try {
      if (current.provider === 'youtube' && ytPlayer && ytReady && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(r);
      if (current.provider === 'html5' && html5Video) html5Video.playbackRate = r;
    } catch (e) {}
  }
  let lastRateBumpAt = 0;
  setInterval(() => {
    try {
      if (!lastState || !lastState.isPlaying) return;
      if (Date.now() - (lastRemoteAppliedAt || 0) < 700) return;
      const expected = expectedTimeFromState(lastState);
      const cur = getLocalTime();
      if (!Number.isFinite(expected) || !Number.isFinite(cur)) return;
      const diff = expected - cur;
      const ad = Math.abs(diff);

      if (ad > 1.25) {
        if (current.provider === 'youtube' && ytPlayer && ytReady) {
          try { ytPlayer.seekTo(expected, true); } catch (e) {}
        } else if (current.provider === 'html5' && html5Video) {
          try { html5Video.currentTime = expected; } catch (e) {}
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

  // ----------------------------
  // Private room: invite friends (existing endpoint)
  // ----------------------------
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
        els.friends.innerHTML = friends.map(f => {
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
        }).join('');
      } catch (e) {
        els.friends.innerHTML = '<div style="color:#ffb3ff;font-size:12px;padding:8px;">โหลดรายชื่อเพื่อนไม่สำเร็จ</div>';
      }
    }

    els.invite?.addEventListener('click', async () => {
      const picks = Array.from(document.querySelectorAll('.wp-friendPick:checked'))
        .map(i => Number(i.value)).filter(Boolean);
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
          Swal.fire({ icon: 'success', title: 'Invite สำเร็จ', text: `เพิ่ม ${j.added} คน`, timer: 1200, showConfirmButton: false, background: '#0b0f14', color: '#e6f7ff' });
        }
      } catch (e) {
        const reason = (e && (e.reason || e.message)) ? String(e.reason || e.message) : 'invite_failed';
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

    loadFriends();
  }

})();
