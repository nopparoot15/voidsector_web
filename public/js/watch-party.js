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
  };

  // Build share link
  (function(){
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    const base = `${window.location.origin}/watch/r/${encodeURIComponent(roomId)}`;
    els.share.value = (!isPublic && k) ? `${base}?k=${encodeURIComponent(k)}` : base;
    els.copy?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(els.share.value); } catch(e){}
    });
  })();

  const socket = window.VS_SOCKET || window.io?.();
  if (!socket) return;

  function join(){
    const params = new URLSearchParams(window.location.search);
    const k = params.get('k') || params.get('key') || joinKeyFallback;
    socket.emit('wp:join', { roomId, k });
  }
  socket.on('connect', join);
  join();

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
  let ytPlayer = null;
  let html5Video = null;
  let lastRemoteAppliedAt = 0;

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
    ytPlayer = new window.YT.Player('wpYt', {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          els.controls.style.display = '';
        },
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
      socket.emit('wp:play', { t: v.currentTime || 0 });
    };
    const emitPause = () => {
      if (suppressLocalEvents) return;
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
    const urlChanged = (String(st.url||'') !== String(current.url||''));
    if (urlChanged) {
      await mountForUrl(String(st.url||''));
    }

    // Compute "expected" time: t + (now-updatedAt) if playing
    const baseT = Number(st.t) || 0;
    const drift = st.isPlaying ? Math.max(0, (Date.now() - (Number(st.updatedAt)||Date.now()))/1000) : 0;
    const expectedT = baseT + drift;

    suppressLocalEvents = true;
    lastRemoteAppliedAt = Date.now();
    try {
      if (current.provider === 'youtube' && ytPlayer) {
        try {
          ytPlayer.seekTo(expectedT, true);
          if (st.isPlaying) ytPlayer.playVideo(); else ytPlayer.pauseVideo();
        } catch(e){}
      } else if (current.provider === 'html5' && html5Video) {
        try {
          html5Video.currentTime = expectedT;
          if (st.isPlaying) {
            const p = html5Video.play();
            if (p && p.catch) p.catch(()=>{});
          } else {
            html5Video.pause();
          }
        } catch(e){}
      }
      // generic: nothing to control
    } finally {
      setTimeout(() => { suppressLocalEvents = false; }, 200);
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
    socket.emit('wp:set_url', { url, provider: det.provider });
  });

  function getLocalTime(){
    if (current.provider === 'youtube' && ytPlayer) {
      try { return ytPlayer.getCurrentTime() || 0; } catch(e) { return 0; }
    }
    if (current.provider === 'html5' && html5Video) return html5Video.currentTime || 0;
    return 0;
  }

  els.play?.addEventListener('click', () => socket.emit('wp:play', { t: getLocalTime() }));
  els.pause?.addEventListener('click', () => socket.emit('wp:pause', { t: getLocalTime() }));
  els.sync?.addEventListener('click', () => socket.emit('wp:ping_state'));

  // Prevent tight loops if provider emits events after remote apply
  setInterval(() => {
    // if something is controllable and playing, we could drift-correct occasionally (optional)
  }, 5000);
})();
