/* public/js/watch-party.js
 * YouTube-only Watch Party (custom controls)
 * - Sync: play/pause/seek/url via Socket.IO
 * - Audio: local-only (not synced)
 */

(function(){
  const roomId = String(window.WP_ROOM_ID || '');
  const isPublic = !!window.WP_IS_PUBLIC;
  const joinKey = String(window.WP_JOIN_KEY || '');
  const socket = window.VS_SOCKET;

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

    quality: document.getElementById('wpQuality'),
    subTH: document.getElementById('wpSubTH'),
    fs: document.getElementById('wpFullscreen'),

    mute: document.getElementById('wpMute'),
    vol: document.getElementById('wpVol'),
    volText: document.getElementById('wpVolText'),

    friends: document.getElementById('wpFriends'),
    invite: document.getElementById('wpInvite'),
  };

  function fitPlayer(){
    if (!els.playerWrap || !yt || typeof yt.setSize !== 'function') return;
    const r = els.playerWrap.getBoundingClientRect();
    // YT API expects numbers
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    try { yt.setSize(w, h); } catch (e) {}
  }

  window.addEventListener('resize', () => {
    // throttle resize a bit
    clearTimeout(window.__wpResizeT);
    window.__wpResizeT = setTimeout(fitPlayer, 120);
  });



  // -------------------------
  // Share link (public/private)
  // -------------------------
  function buildShareUrl(){
    const origin = window.location.origin;
    if (roomId === 'public' || isPublic) return `${origin}/watch/public`;
    // private room uses /watch/r/:id?k=...
    const base = `${origin}/watch/r/${encodeURIComponent(roomId)}`;
    return joinKey ? `${base}?k=${encodeURIComponent(joinKey)}` : base;
  }
  if (els.share) els.share.value = buildShareUrl();
  if (els.copy) els.copy.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(els.share.value || '');
      els.copy.textContent = 'Copied';
      setTimeout(()=>els.copy.textContent='Copy', 900);
    }catch(_){}
  });

  // -------------------------
  // YouTube helpers
  // -------------------------
  function parseYouTubeId(input){
    const s = String(input || '').trim();
    if (!s) return null;

    // If user pasted just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

    try{
      const u = new URL(s);
      const host = u.hostname.replace(/^www\./,'').toLowerCase();

      // youtu.be/<id>
      if (host === 'youtu.be'){
        const id = u.pathname.split('/').filter(Boolean)[0];
        return (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) ? id : null;
      }

      // youtube.com
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com'){
        // /watch?v=<id>
        const v = u.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

        // /shorts/<id> or /embed/<id> or /live/<id>
        const parts = u.pathname.split('/').filter(Boolean);
        const idx = parts.findIndex(p => ['shorts','embed','live'].includes(p));
        if (idx >= 0 && parts[idx+1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx+1])) return parts[idx+1];
      }
      return null;
    }catch(_){
      return null;
    }
  }

  function normalizeYouTubeUrl(id){
    return `https://www.youtube.com/watch?v=${id}`;
  }

  function showUrlError(msg){
    if (!els.urlError) return;
    if (!msg){
      els.urlError.style.display = 'none';
      els.urlError.textContent = '';
      return;
    }
    els.urlError.style.display = 'block';
    els.urlError.textContent = msg;
  }

  // -------------------------
  // Player state (local-only audio)
  // -------------------------
  const LS_VOL = `vs_wp_vol_${roomId}`;
  const LS_MUTED = `vs_wp_muted_${roomId}`;
  let lastVolume = 80;

  function loadAudioPrefs(){
    const v = Number(localStorage.getItem(LS_VOL));
    const m = localStorage.getItem(LS_MUTED);
    if (Number.isFinite(v)) lastVolume = Math.max(0, Math.min(100, v));
    if (els.vol) els.vol.value = String(lastVolume);
    if (els.volText) els.volText.textContent = `${lastVolume}%`;
    if (m === '1') setMutedUI(true); else setMutedUI(false);
  }

  function saveAudioPrefs(){
    try{
      localStorage.setItem(LS_VOL, String(lastVolume));
      localStorage.setItem(LS_MUTED, isMutedUI() ? '1' : '0');
    }catch(_){}
  }

  function isMutedUI(){
    return els.mute?.getAttribute('data-muted') === '1';
  }
  function setMutedUI(muted){
    if (!els.mute) return;
    els.mute.setAttribute('data-muted', muted ? '1' : '0');
    els.mute.textContent = muted ? '🔇' : '🔊';
    if (els.vol) els.vol.disabled = muted;
  }

  function fmtTime(sec){
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec/60);
    const s = sec%60;
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  // -------------------------
  // YouTube IFrame API integration
  // -------------------------
  let yt = null;

  let ytApiPromise = null;
  function loadYTApi(){
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve, reject)=>{
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = ()=>reject(new Error('YT API failed'));
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = ()=>{
        try{ if (typeof prev === 'function') prev(); }catch(_){}
        resolve();
      };
      document.head.appendChild(s);
    });
    return ytApiPromise;
  }
  async function ensurePlayer(){
    await loadYTApi();
    if (!yt) createPlayer();
  }

  let ytReady = false;
  let currentVideoId = null;
  let suppressScrub = false;
  let lastStateFromServer = null;
  let desiredQuality = 'auto';
  let desiredTHSub = false;

  // Ensure api is ready
  window.onYouTubeIframeAPIReady = function(){
    createPlayer();
  };

  function createPlayer(){
    if (yt) return;
    yt = new YT.Player('wpPlayer', {
      videoId: '',
      playerVars:{
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        disablekb: 1,
        iv_load_policy: 3,
        cc_load_policy: 1,
        cc_lang_pref: 'th',
        hl: 'th',

      },
      events: {
        onReady: () => {
          ytReady = true;
          applyAudioToPlayer();
          fitPlayer();
          refreshQualityList();
          tick();
          // ask current room state
          socket.emit('wp:ping_state');
        },
        onStateChange: () => {
          // refresh quality list after playback begins
          refreshQualityList();
          // best-effort apply desired quality when playing
          if (desiredQuality && desiredQuality !== 'auto') applyQuality(desiredQuality, true);
        },
        onError: (e) => {
          console.warn('YT error', e?.data);
        }
      }
    });
  }

  function applyAudioToPlayer(){
    if (!ytReady || !yt) return;
    try{
      yt.setVolume(lastVolume);
      if (isMutedUI()) yt.mute(); else yt.unMute();
    }catch(_){}
  }

  function setVolume(v){
    lastVolume = Math.max(0, Math.min(100, Number(v) || 0));
    if (els.volText) els.volText.textContent = `${lastVolume}%`;
    if (ytReady && yt && !isMutedUI()){
      try{ yt.setVolume(lastVolume); }catch(_){}
    }
    saveAudioPrefs();
  }

  function toggleMute(){
    const now = !isMutedUI();
    setMutedUI(now);
    if (ytReady && yt){
      try{
        if (now) yt.mute(); else { yt.unMute(); yt.setVolume(lastVolume); }
      }catch(_){}
    }
    saveAudioPrefs();
  }

  // -------------------------
  // Quality + Captions (best-effort)
  // -------------------------
  function refreshQualityList(){
    if (!els.quality) return;
    if (!ytReady || !yt) return;
    let levels = [];
    try{ levels = yt.getAvailableQualityLevels() || []; }catch(_){}
    // Build options
    const keep = new Set(['auto', ...levels]);
    // remove stale
    [...els.quality.options].forEach(opt=>{
      if (!keep.has(opt.value)) els.quality.removeChild(opt);
    });
    // add missing
    const existing = new Set([...els.quality.options].map(o=>o.value));
    levels.forEach(l=>{
      if (!existing.has(l)){
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        els.quality.appendChild(opt);
      }
    });
  }

  function applyQuality(q, retry){
    if (!ytReady || !yt) return;
    if (!q || q === 'auto') return;
    try{
      // Range first (helps on some players)
      yt.setPlaybackQualityRange(q);
    }catch(_){}
    try{
      yt.setPlaybackQuality(q);
    }catch(_){}
    if (retry){
      setTimeout(()=>{ try{ yt.setPlaybackQualityRange(q); yt.setPlaybackQuality(q); }catch(_){} }, 450);
      setTimeout(()=>{ try{ yt.setPlaybackQualityRange(q); yt.setPlaybackQuality(q); }catch(_){} }, 1200);
    }
  }

  
  function setTHSub(enabled){
    desiredTHSub = !!enabled;
    // UI optimistic (will be corrected)
    if (els.subTH){
      els.subTH.setAttribute('data-on', desiredTHSub ? '1' : '0');
      els.subTH.textContent = desiredTHSub ? 'TH Sub: ON' : 'TH Sub';
    }
    if (!ytReady || !yt) return;

    try{
      yt.loadModule('captions');
      if (desiredTHSub){
        // Try Thai normal, then Thai auto-generated (asr)
        try{ yt.setOption('captions', 'track', { languageCode: 'th' }); }catch(_){}
        try{ yt.setOption('captions', 'reload', true); }catch(_){}
        setTimeout(()=>{
          try{
            const cur = yt.getOption('captions','track') || {};
            const ok = (cur && (cur.languageCode === 'th'));
            if (!ok){
              try{ yt.setOption('captions','track', { languageCode:'th', kind:'asr' }); }catch(_){}
              try{ yt.setOption('captions','reload', true); }catch(_){}
            }
          }catch(_){}
        }, 150);
      }else{
        try{ yt.setOption('captions', 'track', {}); }catch(_){}
        try{ yt.setOption('captions', 'reload', true); }catch(_){}
      }

      // Verify after a moment; if no captions available, revert button to OFF (no hints per request)
      setTimeout(()=>{
        if (!els.subTH) return;
        if (!desiredTHSub) return;
        try{
          const cur = yt.getOption('captions','track') || {};
          const ok = (cur && cur.languageCode === 'th');
          if (!ok){
            desiredTHSub = false;
            els.subTH.setAttribute('data-on','0');
            els.subTH.textContent = 'TH Sub';
          }
        }catch(_){
          desiredTHSub = false;
          els.subTH.setAttribute('data-on','0');
          els.subTH.textContent = 'TH Sub';
        }
      }, 600);

    }catch(_){}
  }


  // -------------------------
  // Sync (server-authoritative)
  // -------------------------
  function getCurrentTime(){
    if (!ytReady || !yt) return 0;
    try{ return Number(yt.getCurrentTime()) || 0; }catch(_){ return 0; }
  }
  function getDuration(){
    if (!ytReady || !yt) return 0;
    try{ return Number(yt.getDuration()) || 0; }catch(_){ return 0; }
  }

  
  async function loadVideo(id){
    const vid = String(id || '').trim();
    if (!vid) return;
    currentVideoId = vid;
    document.body.classList.add('wp-hasVideo');

    try{
      await ensurePlayer();
    }catch(_){
      return;
    }
    // Wait until ready
    const waitReady = async ()=>{
      if (ytReady && yt) return;
      await new Promise(r=>setTimeout(r, 60));
      return waitReady();
    };
    await waitReady();

    try{
      yt.loadVideoById({ videoId: vid, startSeconds: 0 });
    }catch(_){
      try{ yt.cueVideoById({ videoId: vid, startSeconds: 0 }); }catch(__){}
    }

    // Re-apply user prefs after load
    setTimeout(()=> applyQuality(desiredQuality, true), 650);
    setTimeout(()=> setTHSub(desiredTHSub), 750);
  }


  function applyServerState(st){
    lastStateFromServer = st;
    const url = String(st?.url || '');
    const vid = parseYouTubeId(url) || null;

    if (vid && vid !== currentVideoId){
      loadVideo(vid);
    }

    // play/pause
    if (ytReady && yt){
      const wantPlay = !!st?.isPlaying;
      const nowState = (()=>{ try{ return yt.getPlayerState(); }catch(_){ return -1; }})();
      const nowPlay = (nowState === YT.PlayerState.PLAYING);
      if (wantPlay && !nowPlay){
        try{ yt.playVideo(); }catch(_){}
      }
      if (!wantPlay && nowPlay){
        try{ yt.pauseVideo(); }catch(_){}
      }

      // drift correction
      const t = Number(st?.t) || 0;
      const cur = getCurrentTime();
      const drift = Math.abs(cur - t);
      if (drift > 0.45){
        try{ yt.seekTo(t, true); }catch(_){}
      }
    }
  }

  // -------------------------
  // UI actions -> emit events
  // -------------------------
  function setUrlFromInput(){
    const id = parseYouTubeId(els.url?.value || '');
    if (!id){
      showUrlError('ลิงก์ไม่ถูกต้อง — ใส่ได้เฉพาะ YouTube เท่านั้น');
      return;
    }
    showUrlError('');
    socket.emit('wp:set_url', { url: normalizeYouTubeUrl(id), provider: 'youtube' });
  }

  // seek throttling (avoid spam while dragging)
  let seekRAF = null;
  let lastSeekEmit = 0;
  function emitSeekFromScrub(){
    if (!ytReady || !yt) return;
    const dur = getDuration();
    if (!dur) return;
    const v = Number(els.scrub.value) || 0;
    const t = (v/1000) * dur;
    const now = Date.now();
    if (now - lastSeekEmit < 120) return;
    lastSeekEmit = now;
    socket.emit('wp:seek', { t });
  }

  function requestFullscreen(){
    const el = els.playerWrap;
    if (!el) return;
    const doc = document;
    if (!doc.fullscreenElement){
      el.requestFullscreen?.();
    }else{
      doc.exitFullscreen?.();
    }
  }

  // -------------------------
  // Friends invite (private)
  // -------------------------
  async function loadFriends(){
    if (!els.friends) return;
    try{
      const r = await fetch('/api/friends/list', { credentials:'include' });
      const data = await r.json();
      const friends = data?.friends || [];
      els.friends.innerHTML = '';
      if (!friends.length){
        els.friends.innerHTML = '<div class="wp-help">ยังไม่มีเพื่อน</div>';
        return;
      }
      friends.forEach(f=>{
        const row = document.createElement('label');
        row.className = 'wp-friendRow';
        row.innerHTML = `<span class="wp-friendName">${escapeHtml(f.username || ('user#'+f.id))}</span>
                         <input type="checkbox" value="${String(f.id)}" />`;
        els.friends.appendChild(row);
      });
    }catch(e){
      console.warn(e);
      els.friends.innerHTML = '<div class="wp-help wp-help--error">โหลดรายชื่อเพื่อนไม่ได้</div>';
    }
  }

  async function inviteSelected(){
    const checks = els.friends ? [...els.friends.querySelectorAll('input[type="checkbox"]:checked')] : [];
    const friendIds = checks.map(c=>Number(c.value)).filter(n=>Number.isFinite(n));
    if (!friendIds.length) return;
    try{
      const r = await fetch(`/api/watch/rooms/${encodeURIComponent(roomId)}/invite`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body: JSON.stringify({ friendIds })
      });
      const data = await r.json();
      if (data?.ok){
        els.invite.textContent = 'Invited';
        setTimeout(()=>els.invite.textContent='Invite', 900);
        checks.forEach(c=>c.checked=false);
      }
    }catch(e){ console.warn(e); }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  // -------------------------
  // Loop: update scrub/time
  // -------------------------
  function tick(){
    if (!ytReady || !yt){
      requestAnimationFrame(tick);
      return;
    }
    const dur = getDuration();
    const cur = getCurrentTime();
    if (els.timeCur) els.timeCur.textContent = fmtTime(cur);
    if (els.timeDur) els.timeDur.textContent = fmtTime(dur);

    if (dur > 0 && els.scrub && !suppressScrub){
      const v = Math.max(0, Math.min(1000, Math.round((cur/dur)*1000)));
      els.scrub.value = String(v);
    }
    requestAnimationFrame(tick);
  }

  // -------------------------
  // Socket wiring
  // -------------------------
  if (!socket){
    console.error('VS_SOCKET not found');
    return;
  }

  socket.emit('wp:join', { roomId, k: joinKey });

  socket.on('wp:presence', ({ online }={})=>{
    if (els.online) els.online.textContent = String(Number(online)||0);
  });

  socket.on('wp:state', (st)=>{
    applyServerState(st || {});
  });

  socket.on('wp:error', (e)=>{
    showUrlError(e?.message || 'Error');
  });

  // -------------------------
  // UI events
  // -------------------------
  if (els.set) els.set.addEventListener('click', setUrlFromInput);
  if (els.url) els.url.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') setUrlFromInput();
  });

  if (els.play) els.play.addEventListener('click', ()=>{
    socket.emit('wp:play', { t: getCurrentTime() });
  });
  if (els.pause) els.pause.addEventListener('click', ()=>{
    socket.emit('wp:pause', { t: getCurrentTime() });
  });
  if (els.sync) els.sync.addEventListener('click', ()=>{
    socket.emit('wp:ping_state');
  });

  if (els.scrub){
    els.scrub.addEventListener('input', ()=>{
      // show time preview locally without emitting constantly
      suppressScrub = true;
      const dur = getDuration();
      const t = dur ? ((Number(els.scrub.value)||0)/1000)*dur : 0;
      if (els.timeCur) els.timeCur.textContent = fmtTime(t);
    });
    els.scrub.addEventListener('change', ()=>{
      suppressScrub = false;
      emitSeekFromScrub();
    });
  }

  if (els.quality){
    els.quality.addEventListener('change', ()=>{
      desiredQuality = els.quality.value || 'auto';
      if (desiredQuality !== 'auto') applyQuality(desiredQuality, true);
    });
  }

  if (els.subTH){
    els.subTH.addEventListener('click', ()=>{
      setTHSub(!desiredTHSub);
    });
  }

  if (els.fs) els.fs.addEventListener('click', requestFullscreen);

  loadAudioPrefs();
  if (els.vol){
    els.vol.addEventListener('input', ()=> setVolume(els.vol.value));
  }
  if (els.mute){
    els.mute.addEventListener('click', toggleMute);
  }

  if (!isPublic){
    loadFriends();
    if (els.invite) els.invite.addEventListener('click', inviteSelected);
  }
})();
