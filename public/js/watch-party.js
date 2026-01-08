/* public/js/watch-party.js
 * Realtime watch party (best-effort cross-platform).
 * Full control for:
 *  - YouTube (IFrame API)
 *  - Direct HTML5 media (mp4/webm/ogg)
 * For other sites, we embed if allowed, otherwise users can open in new tab and use Sync for timestamps.
 */

(function(){
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
    unlock: document.getElementById('wpUnlock'),
    unlockBtn: document.getElementById('wpUnlockBtn'),
    friends: document.getElementById('wpFriends'),
    invite: document.getElementById('wpInvite'),
  };

  // Build share link
  (function(){
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    const base = (String(roomId) === 'public')
      ? `${window.location.origin}/watch/public`
      : `${window.location.origin}/watch/r/${encodeURIComponent(roomId)}`;
    els.share.value = (!isPublic && k) ? `${base}?k=${encodeURIComponent(k)}` : base;
    els.copy?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(els.share.value); } catch(e){}
    });
  })();

  const socket = window.VS_SOCKET || window.io?.();
  if (!socket) return;

  // Track recent user gestures so we don't broadcast "autoplay-block" pauses as real pauses.
  // Browsers can pause/deny playback without user intent; we only propagate play/pause when
  // the user likely initiated it (click/key) or when it's not immediately after a remote apply.
  let lastUserGestureAt = 0;
  let lastCommandAt = 0;
  let lastUrlSetAt = 0;
  function markCommand(){ lastCommandAt = Date.now(); }
  function markGesture(){ lastUserGestureAt = Date.now(); }
  // Interaction with the controls/player area counts as a gesture
  ['pointerdown','mousedown','touchstart','keydown'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const t = e.target;
      // only count gestures inside the watch UI
      if (t && (t.closest?.('#wpControls') || t.closest?.('#wpPlayer') || t.id === 'wpUnlockBtn')) markGesture();
    }, { passive: true });
  });

  // -------------------------
  // Time sync (server clock) to reduce jitter/drift
  // -------------------------
  let __wpTimeOffsetMs = 0; // serverNow ~= Date.now() + offset
  let __wpTimeSynced = false;
  let __wpTimeSyncInit = false;
  let __wpTimeSyncRunning = false;

  function nowServerMs() {
    return Date.now() + (__wpTimeOffsetMs || 0);
  }

  function median(arr){
    const a = arr.slice().sort((x,y)=>x-y);
    const m = Math.floor(a.length/2);
    return a.length ? (a.length % 2 ? a[m] : (a[m-1]+a[m])/2) : 0;
  }

  function startTimeSync(samples = 7){
    if (__wpTimeSynced) return;
    // Avoid registering duplicate listeners / running multiple concurrent sync loops.
    if (__wpTimeSyncRunning) return;
    __wpTimeSyncRunning = true;

    const offsets = [];
    let done = 0;

    function ping(){
      const t0 = Date.now();
      socket.emit('wp:time_sync', { t0 });
      // safety timeout in case reply lost
      setTimeout(() => {
        if (done >= samples) return;
        // try again
        if (done < samples) ping();
      }, 800);
    }

    if (!__wpTimeSyncInit) {
      __wpTimeSyncInit = true;
      socket.on('wp:time_sync', (m) => {
      try{
        const t1 = Date.now();
        const t0 = Number(m?.t0) || 0;
        const ts = Number(m?.ts) || 0; // server timestamp
        if (!t0 || !ts) return;
        // offset = server - midpoint(client)
        const off = ts - ((t0 + t1) / 2);
        if (Number.isFinite(off)) offsets.push(off);
        done += 1;
        if (done < samples) ping();
        else {
          __wpTimeOffsetMs = median(offsets);
          __wpTimeSynced = true;
          __wpTimeSyncRunning = false;
        }
      } catch(e){}
      });
    }

    ping();
  }

  function join(){
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    socket.emit('wp:join', { roomId, k });
  }
  // Only join after we have a socket connection; avoid double-join / double-sync.
  socket.on('connect', () => { startTimeSync(); join(); });
  if (socket.connected) { startTimeSync(); join(); }

  socket.on('wp:presence', (p) => {
    if (els.online) els.online.textContent = String(p?.membersOnline || p?.count || 0);
  });

  // -------------------------
  // Provider detection
  // -------------------------
  function detectProvider(url){
    const u = String(url || '').trim();
    if (!u) return { provider:'generic', id:null };
    const lower = u.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)(\?|#|$)/)) return { provider:'html5', id:null };
    // YouTube
    try {
      const uu = new URL(u);
      if (uu.hostname.includes('youtu.be')) {
        const id = uu.pathname.replace(/^\//,'').split('/')[0];
        if (id) return { provider:'youtube', id };
      }
      if (uu.hostname.includes('youtube.com')) {
        const id = uu.searchParams.get('v');
        if (id) return { provider:'youtube', id };
      }
    } catch(e){}
    // Vimeo (we embed but no full control here without extra lib)
    if (lower.includes('vimeo.com')) return { provider:'vimeo', id:null };
    return { provider:'generic', id:null };
  }

  // -------------------------
  // Player implementations
  // -------------------------
  let current = { url:'', provider:'generic' };
  let suppressLocalEvents = false;
  let localIntent = { type: null, at: 0 };
  function setIntent(type){ localIntent = { type, at: Date.now() }; }

  let ytPlayer = null;
  let html5Video = null;
  let lastRemoteAppliedAt = 0;
  let lastState = null;
  let desiredPlaying = null; // mirrors lastState.isPlaying (server truth)
  let pendingState = null;
  let ytReady = false;

  function showUnlock(show) {
    if (!els.unlock) return;
    els.unlock.style.display = show ? '' : 'none';
  }

  function clearPlayer(){
    if (ytPlayer) {
      try { ytPlayer.destroy(); } catch(e){}
      ytPlayer = null;
    }
    if (html5Video) {
      try { html5Video.pause(); } catch(e){}
      html5Video.remove();
      html5Video = null;
    }
    if (els.player) els.player.innerHTML = '';
    els.controls.style.display = 'none';
  }

  function ensureYouTubeAPI(){
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (window.__WP_YT_LOADING) return window.__WP_YT_LOADING;
    window.__WP_YT_LOADING = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve();
      // fallback timeout
      setTimeout(resolve, 5000);
    });
    return window.__WP_YT_LOADING;
  }

  async function mountYouTube(videoId){
    await ensureYouTubeAPI();
    clearPlayer();
    const div = document.createElement('div');
    div.id = 'wpYt';
    els.player.appendChild(div);
    ytReady = false;
    ytPlayer = new window.YT.Player('wpYt', {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          ytReady = true;
          els.controls.style.display = '';
          // Apply latest state that arrived before player was ready
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
            const t = ytPlayer?.getCurrentTime ? (ytPlayer.getCurrentTime() || 0) : 0;

            // If server says we should be paused, and YouTube flips to PLAYING, force it back to pause unless we explicitly intended to play.
            const now = Date.now();
            const intentAge = now - (localIntent?.at || 0);
            const intentType = localIntent?.type || null;
            if (st === 1 && desiredPlaying === false) {
              if (!(intentType === 'play' && intentAge < 1400)) {
                try { ytPlayer.pauseVideo(); } catch (e) {}
                return;
              }
            }


            // 1=PLAYING, 2=PAUSED
            const now = Date.now();
            const sinceRemote = now - (lastRemoteAppliedAt || 0);
            const sinceCmd = now - (lastCommandAt || 0);
            const sinceUrl = now - (lastUrlSetAt || 0);

            // Ignore reconcile events right after we applied remote state or issued a command.
            if (sinceRemote < 900 || sinceCmd < 900) return;

            // Heuristic: right after setting a new URL, YouTube may bounce states due to autoplay policy/buffering.
            // Don't treat those as user-intent.
            const inAutoplayWindow = sinceUrl >= 0 && sinceUrl < 1800;

            if (st === 2) {
              // PAUSED: right after setting URL YouTube may pause due to autoplay policy.
              // Ignore only very-early pauses near the start; otherwise treat as user intent (even inside iframe controls).
              if (desiredPlaying === true && inAutoplayWindow && (t <= 1.0)) return;
              socket.emit('wp:pause', { t });
              return;
            }
            if (st === 1) {
              // PLAYING: only propagate if this looks like intentional play (explicit play intent OR server previously paused).
              const now2 = Date.now();
              const intentAge2 = now2 - (localIntent?.at || 0);
              const intentType2 = localIntent?.type || null;
              const sinceRemote2 = now2 - (lastRemoteAppliedAt || 0);
              if ((intentType2 === 'play' && intentAge2 < 1600) || (desiredPlaying === false && sinceRemote2 > 800)) {
                socket.emit('wp:play', { t });
              }
              return;
            }
          } catch(e){}
        }
      }
    });
  }

  function mountHtml5(url){
    clearPlayer();
    const v = document.createElement('video');
    v.src = url;
    v.controls = true;
    v.playsInline = true;
    v.style.width = '100%';
    v.style.maxHeight = '70vh';
    v.style.borderRadius = '12px';
    els.player.appendChild(v);
    html5Video = v;
    els.controls.style.display = '';

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
  }

  function mountGeneric(url){
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
    els.player.appendChild(box);
    els.player.appendChild(frame);
    els.controls.style.display = '';
  }

  function escapeAttr(s){
    return String(s).replace(/["<>&]/g, m => ({'"':'&quot;','<':'&lt;','>':'&gt;','&':'&amp;'}[m]));
  }

  async function mountForUrl(url){
    const det = detectProvider(url);
    current = { url, provider: det.provider, id: det.id };
    if (!url) { clearPlayer(); return; }
    if (det.provider === 'youtube' && det.id) return mountYouTube(det.id);
    if (det.provider === 'html5') return mountHtml5(url);
    return mountGeneric(url);
  }

  // -------------------------
  // Apply state from server
  // -------------------------
  async function applyState(st){
    if (!st) return;
    lastState = st;
    desiredPlaying = !!st.isPlaying;
    const urlChanged = (String(st.url||'') !== String(current.url||''));
    if (urlChanged) {
      await mountForUrl(String(st.url||''));
    }

    // If YouTube not ready yet, postpone
    if (current.provider === 'youtube' && ytPlayer && !ytReady) {
      pendingState = st;
      return;
    }

    // Compute "expected" time using server clock: t + (serverNow-updatedAt) if playing
    const baseT = Number(st.t) || 0;
    const serverNow = nowServerMs();
    const drift = st.isPlaying ? Math.max(0, (serverNow - (Number(st.updatedAt) || serverNow)) / 1000) : 0;
    const expectedT = baseT + drift;

    const curT = getLocalTime();
    const diff = expectedT - curT;
    const absDiff = Math.abs(diff);

    function setRate(rate) {
      rate = Math.max(0.75, Math.min(1.25, rate));
      try {
        if (current.provider === 'html5' && html5Video) html5Video.playbackRate = rate;
        if (current.provider === 'youtube' && ytPlayer && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(rate);
      } catch (e) {}
    }

    suppressLocalEvents = true;
    lastRemoteAppliedAt = Date.now();
    try {
      if (current.provider === 'youtube' && ytPlayer) {
        try {
          // Pause is sacred: when paused, do NOT seek or change rate (YouTube can resume unexpectedly).
          if (!st.isPlaying) {
            try { markCommand(); ytPlayer.pauseVideo(); } catch (e) {}
            try { ytPlayer.setPlaybackRate && ytPlayer.setPlaybackRate(1.0); } catch (e) {}
            showUnlock(false);
          } else {
            // Playing: snap only if we're far off. Otherwise let it run (event-based sync).
            if (absDiff > 0.9) {
              try { markCommand(); ytPlayer.seekTo(expectedT, true); } catch (e) {}
            }
            try { markCommand(); markCommand(); ytPlayer.playVideo(); } catch (e) {}
            // Autoplay may be blocked; show unlock prompt if it doesn't start.
            setTimeout(() => {
              try {
                const stt = ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : 0;
                if (stt !== 1) showUnlock(true);
              } catch (e) {}
            }, 350);
          }
        } catch (e) {}
      } else if (current.provider === 'html5' && html5Video) {
        try {
          if (!st.isPlaying) {
            // Paused: keep exact frame, ok to snap
            if (absDiff > 0.15) html5Video.currentTime = expectedT;
            html5Video.pause();
            setRate(1.0);
            showUnlock(false);
          } else {
            // Playing: avoid frequent snaps -> smooth with playbackRate; snap only if far
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
            if (p && p.catch) p.catch(() => { showUnlock(true); });
            else showUnlock(false);
          }
        } catch (e) {}
      }
      // generic: nothing to control
    } finally {
      setTimeout(() => { suppressLocalEvents = false; }, 600);
    }
  }

  socket.on('wp:joined', (j) => {
    if (els.online) els.online.textContent = String(j?.membersOnline || 0);
    applyState(j?.state);
  });
  socket.on('wp:state', applyState);

  // -------------------------
  // UI actions
  // -------------------------
  els.set?.addEventListener('click', () => {
    const url = String(els.url.value || '').trim();
    const det = detectProvider(url);
    lastUrlSetAt = Date.now();
    socket.emit('wp:set_url', { url, provider: det.provider });
  });

  // Unlock autoplay once per client (best-effort)
  els.unlockBtn?.addEventListener('click', async () => {
    showUnlock(false);
    try {
      if (current.provider === 'youtube' && ytPlayer) {
        markCommand(); ytPlayer.playVideo();
      } else if (current.provider === 'html5' && html5Video) {
        const p = html5Video.play();
        if (p && p.catch) await p.catch(()=>{});
      }
    } catch(e){}
    // Re-sync after gesture
    if (lastState) applyState(lastState);
    socket.emit('wp:ping_state');
  });

  function getLocalTime(){
    if (current.provider === 'youtube' && ytPlayer) {
      try { return ytPlayer.getCurrentTime() || 0; } catch(e) { return 0; }
    }
    if (current.provider === 'html5' && html5Video) return html5Video.currentTime || 0;
    return 0;
  }

  els.play?.addEventListener('click', () => { markGesture(); setIntent('play'); suppressLocalEvents = true; setTimeout(()=>{suppressLocalEvents=false;}, 450); socket.emit('wp:play', { t: getLocalTime() }); });
  els.pause?.addEventListener('click', () => { markGesture(); setIntent('pause'); suppressLocalEvents = true; setTimeout(()=>{suppressLocalEvents=false;}, 650); socket.emit('wp:pause', { t: getLocalTime() }); });
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
      const picks = Array.from(document.querySelectorAll('.wp-friendPick:checked')).map(i => Number(i.value)).filter(Boolean);
      if (picks.length === 0) {
        return window.Swal ? Swal.fire({ icon: 'info', title: 'เลือกเพื่อนก่อน', background: '#0b0f14', color: '#e6f7ff' }) : alert('Pick friends');
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

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }
    loadFriends();
  }

  // -------------------------
  // Smooth drift correction (v7-style)
  // - Small drift: gently correct using playbackRate (HTML5 + YouTube if supported)
  // - Large drift: hard seek
  // Runs only while PLAYING; when paused, we do not touch the player to avoid YouTube glitches.
  function serverNowMs(){ return Date.now() + (__wpTimeOffsetMs || 0); }
  function expectedFromState(st){
    const baseT = Number(st?.t) || 0;
    if (!st?.isPlaying) return baseT;
    const updatedAt = Number(st?.updatedAt) || Date.now();
    const delta = (serverNowMs() - updatedAt) / 1000;
    return Math.max(0, baseT + delta);
  }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function setRate(r){
    r = clamp(r, 0.75, 1.25);
    try{
      if (current.provider === 'youtube' && ytPlayer && ytPlayer.setPlaybackRate) ytPlayer.setPlaybackRate(r);
      if (html5Video) html5Video.playbackRate = r;
    } catch(e){}
  }
  let lastRateBumpAt = 0;
  setInterval(() => {
    try{
      if (!lastState || !lastState.isPlaying) return;
      // don't fight right after applying remote state
      if (Date.now() - (lastRemoteAppliedAt || 0) < 700) return;

      const expected = expectedFromState(lastState);
      const cur = getLocalTime();
      if (!Number.isFinite(expected) || !Number.isFinite(cur)) return;
      const diff = expected - cur;
      const ad = Math.abs(diff);

      // Hard-seek only if far off
      if (ad > 1.25) {
        if (current.provider === 'youtube' && ytPlayer) {
          try { markCommand(); ytPlayer.seekTo(expected, true); } catch(e){}
        } else if (html5Video) {
          try { html5Video.currentTime = expected; } catch(e){}
        }
        setRate(1.0);
        return;
      }

      // Gentle correction
      if (ad > 0.18) {
        const bump = diff > 0 ? 1.05 : 0.95;
        setRate(bump);
        lastRateBumpAt = Date.now();
      } else {
        // return to normal after a short time
        if (Date.now() - lastRateBumpAt > 900) setRate(1.0);
      }
    } catch(e){}
  }, 800);

// Detect YouTube seeks made via the native player UI (best-effort)
  let ytLastT = 0;
  let ytLastAt = Date.now();
  setInterval(() => {
    if (suppressLocalEvents) return;
    if (current.provider !== 'youtube' || !ytPlayer || !ytReady) return;
    try {
      const now = Date.now();
      const cur = ytPlayer.getCurrentTime ? (ytPlayer.getCurrentTime() || 0) : 0;
      const dt = (now - ytLastAt) / 1000;
      const jump = Math.abs(cur - ytLastT);
      // If time jumps more than ~1.5s compared to expected flow, treat as seek
      if (dt > 0.4 && jump > 1.6) {
        socket.emit('wp:seek', { t: cur });
      }
      ytLastT = cur;
      ytLastAt = now;
    } catch(e){}
  }, 900);
})();
