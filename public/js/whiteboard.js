(function () {
  const roomId = window.WB_ROOM_ID;
  const isPublic = !!window.WB_IS_PUBLIC;

  const canvas = document.getElementById('wbCanvas');
  const onlineEl = document.getElementById('wbOnline');
  const toolPen = document.getElementById('toolPen');
  const toolEraser = document.getElementById('toolEraser');
  const toolText = document.getElementById('toolText');
  const colorEl = document.getElementById('wbColor');
  const sizeEl = document.getElementById('wbSize');
  const clearBtn = document.getElementById('wbClear');

  if (!canvas || !roomId) return;

  const ctx = canvas.getContext('2d', { alpha: true });

  let tool = 'pen';

  function setTool(next) {
    tool = next;
    for (const b of [toolPen, toolEraser, toolText]) {
      if (!b) continue;
      b.classList.toggle('is-active', b.dataset.tool === tool);
    }
  }
  setTool('pen');

  function resize() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(520, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // redraw from history cache if present
    redrawAll();
  }

  window.addEventListener('resize', () => {
    // debounce
    clearTimeout(resize._t);
    resize._t = setTimeout(resize, 80);
  });

  // -------- history cache --------
  let history = [];

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

function drawStroke(evt) {
  const pts = Array.isArray(evt.points) ? evt.points : [];
  if (pts.length < 4 || (pts.length % 2) !== 0) return;

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const size = Number(evt.size) || 3;
  const color = String(evt.color || '#00ffff');
  const isEraser = String(evt.tool || 'pen') === 'eraser';

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size;
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
  }

  ctx.beginPath();
  ctx.moveTo(pts[0] * w, pts[1] * h);
  for (let i = 2; i < pts.length; i += 2) {
    ctx.lineTo(pts[i] * w, pts[i + 1] * h);
  }
  ctx.stroke();
  ctx.restore();

}

function drawText
(evt) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const x = (Number(evt.x) || 0) * w;
    const y = (Number(evt.y) || 0) * h;
    const text = String(evt.text || '');
    if (!text) return;
    const size = Number(evt.size) || 18;
    const color = String(evt.color || '#e6f7ff');
    const font = String(evt.font || "Orbitron, ui-sans-serif");

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
    ctx.textBaseline = 'top';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function applyEvent(evt) {
    if (!evt || typeof evt !== 'object') return;
    if (evt.t === 'stroke') drawStroke(evt);
    if (evt.t === 'text') drawText(evt);
  }

  function redrawAll() {
    clearCanvas();
    for (const evt of history) applyEvent(evt);
  }

  // -------- socket --------
  const socket = window.VS_SOCKET || window.io?.();
  if (!socket) return;

  function join() {
    socket.emit('wb:join', { roomId });
  }

  socket.on('connect', join);
  join();

  socket.on('wb:init', ({ history: h } = {}) => {
    history = Array.isArray(h) ? h : [];
    resize();
  });

  // Track strokes that are being rendered live (segments streamed while drawing)
  const liveStrokeIds = new Set();

  // Live stroke segments (not persisted; used so others see the line while you drag)
  socket.on('wb:stroke_part', (evt) => {
    if (!evt || typeof evt !== 'object') return;
    if (!evt.id || !Array.isArray(evt.points) || evt.points.length < 4) return;
    // don't render your own streamed segments (you already draw locally)
    const meId = window.VS_ME && window.VS_ME.id ? Number(window.VS_ME.id) : 0;
    const uid = Number(evt.userId || 0);
    if (uid && meId && uid === meId) return;
    liveStrokeIds.add(String(evt.id));
    drawStroke(evt);
  });

  socket.on('wb:stroke', (evt) => {
    // If we already rendered this stroke live via wb:stroke_part, don't redraw (prevents double-bright lines)
    if (evt && evt.id && liveStrokeIds.has(String(evt.id))) {
      liveStrokeIds.delete(String(evt.id));
      history.push(evt);
      return;
    }
    history.push(evt);
    applyEvent(evt);
  });

  socket.on('wb:undo', ({ id } = {}) => {
    const rid = String(id || '');
    if (!rid) return;
    const idx = history.findIndex((e) => e && e.id === rid);
    if (idx >= 0) {
      history.splice(idx, 1);
      redrawAll();
    }
  });

  socket.on('wb:text', (evt) => {
    history.push(evt);
    applyEvent(evt);
  });

  socket.on('wb:clear', () => {
    history = [];
    redrawAll();
  });

  socket.on('wb:presence', (p = {}) => {
    const n = Number(p.membersOnline ?? p.count ?? 0);
    if (onlineEl) onlineEl.textContent = String(n);
  });

  // -------- realtime cursor tags (others only; shown only while drawing) --------
  const cursorsEl = document.getElementById('wbCursors');
  const activeCursors = new Map(); // userId -> {el, last, drawing}

  function ensureCursorEl(userId, username, color) {
    if (!cursorsEl) return null;
    let item = activeCursors.get(userId);
    if (!item) {
      const el = document.createElement('div');
      el.className = 'wb-cursorTag';
      el.innerHTML = `
        <span class="dot"></span>
        <span class="name"></span>
      `;
      cursorsEl.appendChild(el);
      item = { el, last: 0, drawing: false };
      activeCursors.set(userId, item);
    }
    const el = item.el;
    el.style.setProperty('--accent', color || '#00ffff');
    el.querySelector('.name').textContent = username || 'user';
    return item;
  }

  function placeCursorEl(item, x, y) {
    if (!item || !item.el || !cursorsEl) return;
    const rect = canvas.getBoundingClientRect();
    const px = x * rect.width;
    const py = y * rect.height;
    // Use left/top for positioning so CSS transforms can be reserved for the neon offset + scale animation
    item.el.style.left = `${px}px`;
    item.el.style.top = `${py}px`;
  }

  // Receive cursor updates from others
  socket.on('wb:cursor', (evt) => {
    if (!evt || typeof evt !== 'object') return;
    const meId = window.VS_ME && window.VS_ME.id ? Number(window.VS_ME.id) : 0;
    const uid = Number(evt.userId || 0);
    if (!uid || uid === meId) return;

    const drawing = !!evt.drawing;
    const item = ensureCursorEl(uid, String(evt.username || '').slice(0, 32), String(evt.color || '#00ffff'));
    if (!item) return;

    item.last = Date.now();
    item.drawing = drawing;

    if (drawing) {
      item.el.classList.add('is-visible');
      placeCursorEl(item, Number(evt.x) || 0, Number(evt.y) || 0);
    } else {
      // fade out
      item.el.classList.add('is-fading');
      item.el.classList.remove('is-visible');
      setTimeout(() => item.el.classList.remove('is-fading'), 220);
    }
  });


  // remove stale cursor tags if someone disconnects mid-stroke
  setInterval(() => {
    const now = Date.now();
    for (const [uid, item] of activeCursors.entries()) {
      if (!item) continue;
      if (item.drawing && (now - item.last) > 900) {
        item.drawing = false;
        item.el.classList.remove('is-visible');
      }
    }
  }, 400);


  socket.on('wb:error', (e) => {
    const msg = String(e?.message || 'Whiteboard error');
    if (window.Swal) {
      Swal.fire({
        icon: 'error',
        title: 'Whiteboard',
        text: msg,
        background: '#0b0f14',
        color: '#e6f7ff'
      }).then(() => {
        window.location.href = '/whiteboard';
      });
    } else {
      alert(msg);
      window.location.href = '/whiteboard';
    }
  });

  // -------- interactions --------
  function normPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  }

  let drawing = false;
  let prev = null;
  let strokePts = [];
  let strokeId = null;
  let strokeStartedAt = 0;


  // Throttled cursor broadcast (to let others see who is drawing, without leaving tags on the final stroke)
  let _lastCursorSend = 0;
  function emitCursor(x, y, drawingFlag) {
    const now = Date.now();
    // throttle move updates
    if (drawingFlag && (now - _lastCursorSend) < 45) return;
    _lastCursorSend = now;
    socket.emit('wb:cursor', {
      x, y,
      drawing: !!drawingFlag,
      color: colorEl?.value || '#00ffff'
    });
  }

  // Throttled live-stroke broadcast so others can see the line while you drag
  let _lastPartSend = 0;
  function emitStrokePart(from, to) {
    const now = Date.now();
    if ((now - _lastPartSend) < 35) return;
    _lastPartSend = now;
    socket.emit('wb:stroke_part', {
      id: strokeId,
      t: 'stroke',
      tool,
      color: colorEl?.value || '#00ffff',
      size: Number(sizeEl?.value) || 3,
      points: [from.x, from.y, to.x, to.y]
    });
  }



  function onDown(e) {
    if (tool === 'text') {
      const p = normPos(e);
      const t = prompt('พิมพ์ข้อความ:');
      if (!t) return;
      const evt = {
        x: p.x,
        y: p.y,
        text: t,
        size: 18,
        color: colorEl?.value || '#e6f7ff',
        font: 'Orbitron, ui-sans-serif'
      };
      socket.emit('wb:text', evt);
      // locally optimistic
      const local = { t: 'text', ...evt };
      history.push(local);
      applyEvent(local);
      return;
    }

    drawing = true;
    prev = normPos(e);
    strokePts = [prev.x, prev.y];
    strokeId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    strokeStartedAt = Date.now();
    canvas.setPointerCapture?.(e.pointerId);
    emitCursor(prev.x, prev.y, true);
  }

  function onMove(e) {
    if (!drawing || !prev) return;
    const from = prev;
    const cur = normPos(e);
    // draw incremental segment locally for responsiveness
    const seg = {
      t: 'stroke',
      tool,
      color: colorEl?.value || '#00ffff',
      size: Number(sizeEl?.value) || 3,
      points: [from.x, from.y, cur.x, cur.y]
    };
    drawStroke(seg);

    // stream this segment to others (they will render it live, but it won't be persisted until wb:stroke on pointerup)
    emitStrokePart(from, cur);
    // accumulate polyline
    strokePts.push(cur.x, cur.y);
    prev = cur;
    emitCursor(cur.x, cur.y, true);
  }

  function onUp() {
    if (drawing && strokePts && strokePts.length >= 4) {
      const evt = {
        id: strokeId,
        tool,
        username: (window.VS_ME && window.VS_ME.username) ? String(window.VS_ME.username).slice(0,32) : '',
        color: colorEl?.value || '#00ffff',
        size: Number(sizeEl?.value) || 3,
        points: strokePts.slice(0, 2048)
      };
      const local = { t: 'stroke', ...evt };
      history.push(local);
      socket.emit('wb:stroke', evt);
    }
    // tell others to hide the tag for this user
    if (prev) emitCursor(prev.x, prev.y, false);
    else if (strokePts && strokePts.length >= 2) emitCursor(strokePts[strokePts.length-2], strokePts[strokePts.length-1], false);
    else emitCursor(0, 0, false);
    drawing = false;
    prev = null;
    strokePts = [];
    strokeId = null;
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', () => { if (drawing) onUp(); });

  toolPen?.addEventListener('click', () => setTool('pen'));
  toolEraser?.addEventListener('click', () => setTool('eraser'));
  toolText?.addEventListener('click', () => setTool('text'));

  clearBtn?.addEventListener('click', () => {
    if (!confirm('ล้างกระดานทั้งหมด?')) return;
    socket.emit('wb:clear');
  });

  // Ctrl+Z undo last stroke (yours) — synced for everyone
  window.addEventListener('keydown', (e) => {
    const key = String(e.key || '').toLowerCase();
    if (!(e.ctrlKey || e.metaKey) || key !== 'z' || e.shiftKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) ? document.activeElement.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;
    e.preventDefault();
    socket.emit('wb:undo', {}, (resp) => {
      if (resp && resp.ok === false && resp.reason === 'nothing_to_undo') {
        // silent
      }
    });
  });

  // -------- private room: invite UI --------
  if (!isPublic) {
    const listEl = document.getElementById('wbFriends');
    const inviteBtn = document.getElementById('wbInvite');
    const shareEl = document.getElementById('wbShare');
    const copyBtn = document.getElementById('wbCopy');

    if (shareEl) {
      shareEl.value = `${window.location.origin}/whiteboard/r/${encodeURIComponent(roomId)}`;
    }
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareEl.value);
        if (window.Swal) {
          Swal.fire({ icon: 'success', title: 'Copied', timer: 900, showConfirmButton: false, background: '#0b0f14', color: '#e6f7ff' });
        }
      } catch (e) {
        // ignore
      }
    });

    async function loadFriends() {
      if (!listEl) return;
      try {
        const r = await fetch('/api/friends/list');
        const j = await r.json();
        if (!j.ok) throw new Error('no_friends');
        const friends = Array.isArray(j.friends) ? j.friends : [];
        if (friends.length === 0) {
          listEl.innerHTML = '<div style="color:#9aa7b3; font-size:12px; padding:8px;">ยังไม่มีเพื่อน</div>';
          return;
        }
        listEl.innerHTML = friends.map(f => {
          const av = f.avatar_path ? f.avatar_path : '/uploads/avatars/default.png';
          return `
            <label class="wb-friend">
              <div class="wb-friend__left">
                <img class="wb-avatar" src="${av}" alt="" onerror="this.style.display='none'" />
                <div class="wb-name">${escapeHtml(f.username)}</div>
              </div>
              <input type="checkbox" class="wb-friendPick" value="${f.id}" />
            </label>
          `;
        }).join('');
      } catch (e) {
        listEl.innerHTML = '<div style="color:#ffb3ff; font-size:12px; padding:8px;">โหลดรายชื่อเพื่อนไม่สำเร็จ</div>';
      }
    }

    inviteBtn?.addEventListener('click', async () => {
      const picks = Array.from(document.querySelectorAll('.wb-friendPick:checked')).map(i => Number(i.value)).filter(Boolean);
      if (picks.length === 0) {
        return window.Swal ? Swal.fire({ icon: 'info', title: 'เลือกเพื่อนก่อน', background: '#0b0f14', color: '#e6f7ff' }) : alert('Pick friends');
      }
      inviteBtn.disabled = true;
      try {
        const j = await new Promise((resolve, reject) => {
          const t = setTimeout(() => reject({ reason: 'timeout' }), 6000);
          socket.emit('wb:invite', { roomId, friendIds: picks }, (resp) => {
            clearTimeout(t);
            if (!resp || resp.ok === false) return reject(resp || { reason: 'invite_failed' });
            resolve(resp);
          });
        });
        if (window.Swal) {
          Swal.fire({ icon: 'success', title: 'Invite สำเร็จ', text: `เพิ่ม ${j.added} คน`, timer: 1200, showConfirmButton: false, background: '#0b0f14', color: '#e6f7ff' });
        }
      } catch (e) {
        const reason = (e && (e.reason || e.message)) ? String(e.reason || e.message) : 'invite_failed';
        const msgMap = {
          not_owner: 'ต้องเป็นเจ้าของห้องเท่านั้นถึงจะเชิญได้',
          not_friends: 'คนที่เลือกยังไม่ได้เป็นเพื่อนของคุณ',
          room_required: 'ไม่พบรหัสห้อง',
          not_found: 'ไม่พบห้องนี้',
          no_targets: 'กรุณาเลือกเพื่อนอย่างน้อย 1 คน',
          not_identified: 'ยังระบุตัวตนไม่สำเร็จ (ลองรีเฟรชหน้า หรือออก-เข้าใหม่)',
          timeout: 'เชื่อมต่อช้าเกินไป ลองใหม่อีกครั้ง',
          server_error: 'เซิร์ฟเวอร์มีปัญหา ลองใหม่อีกครั้ง',
        };
        const text = msgMap[reason] || 'เชิญไม่สำเร็จ ลองใหม่อีกครั้ง';
        if (window.Swal) {
          Swal.fire({ icon: 'error', title: 'Invite ไม่สำเร็จ', text, background: '#0b0f14', color: '#e6f7ff' });
        } else {
          alert(text);
        }
      } finally {
        inviteBtn.disabled = false;
      }
    });

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    loadFriends();
  }

  // initial
  resize();
})();
