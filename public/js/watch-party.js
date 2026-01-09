/* public/js/watch-party.js
 * Realtime watch party (YouTube + HTML5). No overlay, no custom scrub, no volume UI, no autoplay unlock.
 * Goal: Let users control via native YouTube controls, and sync play/pause/seek as stably as possible.
 */

(function () {
  const roomId = window.WP_ROOM_ID;
  const isPublic = !!window.WP_IS_PUBLIC;
  const joinKeyFallback = window.WP_JOIN_KEY || "";

  const els = {
    online: document.getElementById("wpOnline"),
    share: document.getElementById("wpShare"),
    copy: document.getElementById("wpCopy"),
    url: document.getElementById("wpUrl"),
    set: document.getElementById("wpSet"),
    player: document.getElementById("wpPlayer"),
    controls: document.getElementById("wpControls"),
    // optional buttons if your page still has them (ok if missing)
    play: document.getElementById("wpPlay"),
    pause: document.getElementById("wpPause"),
    sync: document.getElementById("wpSync"),
    fs: document.getElementById("wpFs"),
    friends: document.getElementById("wpFriends"),
    invite: document.getElementById("wpInvite"),
  };

  if (!roomId || !els.player) return;

  // -------------------------
  // Share link
  // -------------------------
  (function buildShareLink() {
    if (!els.share) return;
    const params = new URLSearchParams(window.location.search);
    const k = params.get("k") || params.get("key") || joinKeyFallback;
    const base =
      String(roomId) === "public"
        ? `${window.location.origin}/watch/public`
        : `${window.location.origin}/watch/r/${encodeURIComponent(roomId)}`;

    els.share.value = !isPublic && k ? `${base}?k=${encodeURIComponent(k)}` : base;

    els.copy?.addEventListener("click", async () => {
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
    if (typeof io === "function") return io({ withCredentials: true });
    return null;
  })();
  if (!socket) return;

  let identified = false;

  function sendHello() {
    try {
      const me = window.VS_ME || {};
      const username = String(me.username || "").trim();
      if (!username) return;
      socket.emit("chat:hello", { userId: me.id || null, username });
    } catch (e) {}
  }

  socket.on("chat:me", () => {
    identified = true;
  });

  // Always try to identify on connect/reconnect.
  socket.on("connect", () => {
    sendHello();
    setTimeout(ensureJoined, 60);
  });
  // If already connected:
  sendHello();

  // Robust join loop (some pages connect before identity is ready)
  let __wpJoined = false;

  function join() {
    const params = new URLSearchParams(window.location.search);
    const k = params.get("k") || params.get("key") || joinKeyFallback;
    socket.emit("wp:join", { roomId, k });
  }

  function ensureJoined() {
    if (__wpJoined) return;
    if (!socket.connected) return;

    if (!identified) {
      sendHello();
      setTimeout(ensureJoined, 250);
      return;
    }
    join();
    setTimeout(ensureJoined, 900);
  }

  if (socket.connected) setTimeout(ensureJoined, 60);

  socket.on("wp:error", (e) => {
    try {
      console.warn("[watchparty]", e?.message || e);
    } catch (_) {}
  });

  socket.on("wp:presence", (p) => {
    if (els.online) els.online.textContent = String(p?.membersOnline || p?.count || 0);
  });

  // -------------------------
  // Provider detection
  // -------------------------
  function detectProvider(url) {
    const u = String(url || "").trim();
    if (!u) return { provider: "generic", id: null };

    const lower = u.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)(\?|#|$)/)) return { provider: "html5", id: null };

    // YouTube
    try {
      const uu = new URL(u);
      if (uu.hostname.includes("youtu.be")) {
        const id = uu.pathname.replace(/^\//, "").split("/")[0];
        if (id) return { provider: "youtube", id };
      }
      if (uu.hostname.includes("youtube.com")) {
        const id = uu.searchParams.get("v");
        if (id) return { provider: "youtube", id };
      }
    } catch (e) {}

    if (lower.includes("vimeo.com")) return { provider: "vimeo", id: null };
    return { provider: "generic", id: null };
  }

  // -------------------------
  // Player state
  // -------------------------
  let current = { url: "", provider: "generic", id: null };
  let ytPlayer = null;
  let ytReady = false;
  let html5Video = null;

  let suppressLocalEvents = false;
  let lastRemoteAppliedAt = 0;
  let lastUrlSetAt = 0;

  // last server truth
  let lastState = null;
  let desiredPlaying = null; // boolean

  function escapeAttr(s) {
    return String(s).replace(/["<>&]/g, (m) => ({ '"': "&quot;", "<": "&lt;", ">": "&gt;", "&": "&amp;" }[m]));
  }

  function clearPlayer() {
    if (ytPlayer) {
      try {
        ytPlayer.destroy();
      } catch (e) {}
      ytPlayer = null;
    }
    ytReady = false;

    if (html5Video) {
      try {
        html5Video.pause();
      } catch (e) {}
      try {
        html5Video.remove();
      } catch (e) {}
      html5Video = null;
    }
    els.player.innerHTML = "";
    if (els.controls) els.controls.style.display = "";
  }

  // -------------------------
  // Fullscreen (optional button)
  // -------------------------
  (function setupFullscreen() {
    const btn = els.fs;
    if (!btn) return;

    const wrap = document.getElementById("wpPlayerWrap") || els.player;

    function fsElement() {
      return document.fullscreenElement || document.webkitFullscreenElement;
    }
    function setBtn() {
      const on = !!fsElement();
      btn.textContent = on ? "🗗" : "⛶";
      btn.title = on ? "Exit Fullscreen" : "Fullscreen";
    }

    async function enter() {
      // iOS: only <video> can go fullscreen
      if (html5Video && typeof html5Video.webkitEnterFullscreen === "function") {
        try {
          html5Video.webkitEnterFullscreen();
          return;
        } catch (e) {}
      }
      const el = wrap || document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } catch (e) {}
      setBtn();
    }

    async function exit() {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } catch (e) {}
      setBtn();
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (fsElement()) exit();
      else enter();
    });

    document.addEventListener("fullscreenchange", setBtn);
    document.addEventListener("webkitfullscreenchange", setBtn);
    setBtn();
  })();

  // -------------------------
  // YouTube API loader
  // -------------------------
  function ensureYouTubeAPI() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (window.__WP_YT_LOADING) return window.__WP_YT_LOADING;

    window.__WP_YT_LOADING = new Promise((resolve) => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try {
          if (typeof prev === "function") prev();
        } catch (_) {}
        resolve();
      };

      setTimeout(resolve, 6000);
    });

    return window.__WP_YT_LOADING;
  }

  function getLocalTime() {
    if (current.provider === "youtube" && ytPlayer && ytReady && typeof ytPlayer.getCurrentTime === "function") {
      try {
        return Number(ytPlayer.getCurrentTime() || 0);
      } catch (e) {
        return 0;
      }
    }
    if (current.provider === "html5" && html5Video) return Number(html5Video.currentTime || 0);
    return 0;
  }

  // -------------------------
  // Mount players
  // -------------------------
  async function mountYouTube(videoId) {
    await ensureYouTubeAPI();
    clearPlayer();

    const div = document.createElement("div");
    div.id = "wpYt";
    els.player.appendChild(div);

    ytReady = false;

    ytPlayer = new window.YT.Player("wpYt", {
      videoId,
      playerVars: { rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          ytReady = true;
          // apply state if already known
          if (lastState) applyState(lastState);
        },
        onStateChange: (evt) => {
          if (suppressLocalEvents) return;
          if (!ytPlayer || !ytReady) return;

          // 1=PLAYING, 2=PAUSED
          const st = evt?.data;
          const t = getLocalTime();
          const now = Date.now();

          // Ignore "reconcile" right after remote apply
          if (now - lastRemoteAppliedAt < 850) return;

          // Autoplay-policy window right after setting URL:
          // If server expects playing but YT pauses at t~0 immediately, don't broadcast pause.
          const inAutoplayWindow = now - lastUrlSetAt < 1800;

          if (st === 2) {
            if (desiredPlaying === true && inAutoplayWindow && t <= 1.0) return;
            socket.emit("wp:pause", { t });
            return;
          }

          if (st === 1) {
            socket.emit("wp:play", { t });
            return;
          }
        },
      },
    });
  }

  function mountHtml5(url) {
    clearPlayer();

    const v = document.createElement("video");
    v.src = url;
    v.controls = true;
    v.playsInline = true;
    v.style.width = "100%";
    v.style.maxHeight = "70vh";
    v.style.borderRadius = "12px";
    els.player.appendChild(v);

    html5Video = v;

    v.addEventListener("play", () => {
      if (suppressLocalEvents) return;
      if (Date.now() - lastRemoteAppliedAt < 850) return;
      socket.emit("wp:play", { t: v.currentTime || 0 });
    });

    v.addEventListener("pause", () => {
      if (suppressLocalEvents) return;
      if (Date.now() - lastRemoteAppliedAt < 850) return;
      socket.emit("wp:pause", { t: v.currentTime || 0 });
    });

    v.addEventListener("seeked", () => {
      if (suppressLocalEvents) return;
      socket.emit("wp:seek", { t: v.currentTime || 0 });
    });
  }

  function mountGeneric(url) {
    clearPlayer();

    const box = document.createElement("div");
    box.className = "wp-generic";
    box.innerHTML = `
      <div style="color:#e6f7ff;font-weight:700;margin-bottom:8px">ไม่สามารถควบคุมเว็บนี้ได้โดยตรง</div>
      <div style="color:#9aa7b3;font-size:13px;line-height:1.4">
        ถ้าเว็บปลายทาง <b>อนุญาตให้ embed</b> จะพยายามแสดงด้านล่าง • ถ้าไม่ขึ้น ให้เปิดลิงก์ในแท็บใหม่ แล้วใช้ปุ่ม <b>Sync</b> เพื่อซิงก์เวลา
      </div>
      <a href="${escapeAttr(url)}" target="_blank" rel="noopener" class="wp-open">Open in new tab</a>
    `;

    const frame = document.createElement("iframe");
    frame.src = url;
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.referrerPolicy = "no-referrer";
    frame.sandbox = "allow-scripts allow-same-origin allow-presentation allow-popups allow-forms";
    frame.className = "wp-iframe";

    els.player.appendChild(box);
    els.player.appendChild(frame);
  }

  async function mountForUrl(url) {
    const det = detectProvider(url);
    current = { url, provider: det.provider, id: det.id };

    if (!url) {
      clearPlayer();
      return;
    }
    if (det.provider === "youtube" && det.id) return mountYouTube(det.id);
    if (det.provider === "html5") return mountHtml5(url);
    return mountGeneric(url);
  }

  // -------------------------
  // Apply state from server (authoritative)
  // -------------------------
  async function applyState(st) {
    if (!st) return;
    lastState = st;
    desiredPlaying = !!st.isPlaying;

    const newUrl = String(st.url || "");
    if (newUrl && newUrl !== current.url) {
      await mountForUrl(newUrl);
    }

    // If YT not ready yet, wait for onReady to re-apply
    if (current.provider === "youtube" && ytPlayer && !ytReady) return;

    const baseT = Number(st.t) || 0;

    suppressLocalEvents = true;
    lastRemoteAppliedAt = Date.now();

    try {
      if (current.provider === "youtube" && ytPlayer && ytReady) {
        if (!st.isPlaying) {
          // Pause: do NOT seek (avoid weird resume)
          try {
            ytPlayer.pauseVideo();
          } catch (e) {}
        } else {
          // Play: seek only if far off to reduce jitter
          const cur = getLocalTime();
          const diff = Math.abs(cur - baseT);
          if (diff > 0.9) {
            try {
              ytPlayer.seekTo(baseT, true);
            } catch (e) {}
          }
          try {
            ytPlayer.playVideo();
          } catch (e) {}
        }
      } else if (current.provider === "html5" && html5Video) {
        if (!st.isPlaying) {
          // paused: snap more precisely
          if (Math.abs(getLocalTime() - baseT) > 0.2) html5Video.currentTime = baseT;
          html5Video.pause();
        } else {
          // playing: snap if far
          if (Math.abs(getLocalTime() - baseT) > 0.9) html5Video.currentTime = baseT;
          const p = html5Video.play();
          if (p && p.catch) p.catch(() => {});
        }
      }
    } finally {
      setTimeout(() => {
        suppressLocalEvents = false;
      }, 450);
    }
  }

  socket.on("wp:joined", (j) => {
    __wpJoined = true;
    if (els.online) els.online.textContent = String(j?.membersOnline || 0);
    applyState(j?.state);
  });

  socket.on("wp:state", applyState);

  // -------------------------
  // Detect YouTube seeks via native controls (best-effort)
  // -------------------------
  let ytLastT = 0;
  let ytLastAt = Date.now();
  let lastSeekEmitAt = 0;

  setInterval(() => {
    if (suppressLocalEvents) return;
    if (current.provider !== "youtube" || !ytPlayer || !ytReady) return;

    try {
      const now = Date.now();
      const cur = getLocalTime();
      const dt = (now - ytLastAt) / 1000;
      const jump = Math.abs(cur - ytLastT);

      // If time jumps a lot compared to normal progression -> treat as seek/scrub
      if (dt > 0.12 && jump > 0.85) {
        if (now - lastSeekEmitAt > 160) {
          lastSeekEmitAt = now;
          socket.emit("wp:seek", { t: cur });
        }
      }

      ytLastT = cur;
      ytLastAt = now;
    } catch (e) {}
  }, 250);

  // -------------------------
  // UI actions (Set + optional buttons)
  // -------------------------
  els.set?.addEventListener("click", () => {
    const url = String(els.url?.value || "").trim();
    if (!url) return;
    lastUrlSetAt = Date.now();

    // Optimistic mount for immediate feedback
    try {
      mountForUrl(url);
    } catch (e) {}

    const det = detectProvider(url);
    socket.emit("wp:set_url", { url, provider: det.provider });
  });

  // Optional: if your page still has these buttons, keep them working
  els.play?.addEventListener("click", () => {
    const t = getLocalTime();
    socket.emit("wp:play", { t });
  });
  els.pause?.addEventListener("click", () => {
    const t = getLocalTime();
    socket.emit("wp:pause", { t });
  });
  els.sync?.addEventListener("click", () => {
    socket.emit("wp:ping_state");
  });

  // -------------------------
  // Private room: invite UI (unchanged)
  // -------------------------
  if (!isPublic) {
    async function loadFriends() {
      if (!els.friends) return;
      try {
        const r = await fetch("/api/friends/list");
        const j = await r.json();
        if (!j.ok) throw new Error("no_friends");
        const friends = Array.isArray(j.friends) ? j.friends : [];
        if (friends.length === 0) {
          els.friends.innerHTML = '<div style="color:#9aa7b3;font-size:12px;padding:8px;">ยังไม่มีเพื่อน</div>';
          return;
        }
        els.friends.innerHTML = friends
          .map((f) => {
            const av = f.avatar_path ? f.avatar_path : "/uploads/avatars/default.png";
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
          .join("");
      } catch (e) {
        els.friends.innerHTML = '<div style="color:#ffb3ff;font-size:12px;padding:8px;">โหลดรายชื่อเพื่อนไม่สำเร็จ</div>';
      }
    }

    els.invite?.addEventListener("click", async () => {
      const picks = Array.from(document.querySelectorAll(".wp-friendPick:checked"))
        .map((i) => Number(i.value))
        .filter(Boolean);

      if (picks.length === 0) {
        return window.Swal
          ? Swal.fire({ icon: "info", title: "เลือกเพื่อนก่อน", background: "#0b0f14", color: "#e6f7ff" })
          : alert("Pick friends");
      }

      els.invite.disabled = true;
      try {
        const resp = await fetch(`/api/watch/rooms/${encodeURIComponent(roomId)}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendIds: picks }),
        });
        const j = await resp.json();
        if (!j.ok) throw j;
        if (window.Swal) {
          Swal.fire({
            icon: "success",
            title: "Invite สำเร็จ",
            text: `เพิ่ม ${j.added} คน`,
            timer: 1200,
            showConfirmButton: false,
            background: "#0b0f14",
            color: "#e6f7ff",
          });
        }
      } catch (e) {
        const reason = e && (e.reason || e.message) ? String(e.reason || e.message) : "invite_failed";
        const msgMap = {
          not_owner: "ต้องเป็นเจ้าของห้องเท่านั้นถึงจะเชิญได้",
          not_friends: "คนที่เลือกยังไม่ได้เป็นเพื่อนของคุณ",
          no_targets: "กรุณาเลือกเพื่อนอย่างน้อย 1 คน",
          not_found: "ไม่พบห้องนี้",
          server_error: "เซิร์ฟเวอร์มีปัญหา ลองใหม่อีกครั้ง",
        };
        const text = msgMap[reason] || "เชิญไม่สำเร็จ ลองใหม่อีกครั้ง";
        if (window.Swal) Swal.fire({ icon: "error", title: "Invite ไม่สำเร็จ", text, background: "#0b0f14", color: "#e6f7ff" });
        else alert(text);
      } finally {
        els.invite.disabled = false;
      }
    });

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
    }

    loadFriends();
  }
})();
