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

// ---- Smooth stroke renderer ----
function strokeStyleFrom(evt) {
  const size = Number(evt.size) || 3;
  const color = String(evt.color || '#00ffff');
  const isEraser = String(evt.tool || 'pen') === 'eraser';
  return { size, color, isEraser };
}

function beginStrokeStyle(style) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = style.size;
  if (style.isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 0;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = style.color;
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 6;
  }
}

function endStrokeStyle() {
  ctx.restore();
}

function mid(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pxPoint(p) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  return { x: p.x * w, y: p.y * h };
}

// Render a full polyline (history redraw) with quadratic smoothing.
function drawStroke(evt) {
  const pts = Array.isArray(evt.points) ? evt.points : [];
  if (pts.length < 4 || (pts.length % 2) !== 0) return;
  const style = strokeStyleFrom(evt);
  beginStrokeStyle(style);

  // Convert to px once for determinism
  const p0 = pxPoint({ x: pts[0], y: pts[1] });
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);

  // With only 2 points, just lineTo.
  if (pts.length === 4) {
    const p1 = pxPoint({ x: pts[2], y: pts[3] });
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    endStrokeStyle();
    return;
  }

  // Smooth path: quadraticCurveTo(prev, mid(prev,next))
  let prev = pxPoint({ x: pts[0], y: pts[1] });
  let curr = pxPoint({ x: pts[2], y: pts[3] });
  let lastMid = mid(prev, curr);
  ctx.lineTo(lastMid.x, lastMid.y);

  for (let i = 4; i < pts.length; i += 2) {
    const next = pxPoint({ x: pts[i], y: pts[i + 1] });
    const m = mid(curr, next);
    ctx.quadraticCurveTo(curr.x, curr.y, m.x, m.y);
    prev = curr;
    curr = next;
    lastMid = m;
  }
  // Finish to the last point
  ctx.quadraticCurveTo(curr.x, curr.y, curr.x, curr.y);
  ctx.stroke();
  endStrokeStyle();
}

// Incremental smooth renderer for live strokes (local + remote)
function makeLiveStrokeState(style) {
  return { style, n: 0, last: null, prev: null, lastMid: null };
}

function liveStrokeAddPoint(state, pNorm) {
  if (!state) return;
  const p = pxPoint(pNorm);
  const style = state.style;

  beginStrokeStyle(style);
  ctx.beginPath();

  if (state.n === 0) {
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    state.n = 1;
    state.last = p;
    endStrokeStyle();
    return;
  }

  if (state.n === 1) {
    // First segment
    const prev = state.last;
    const m = mid(prev, p);
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
    state.n = 2;
    state.prev = prev;
    state.last = p;
    state.lastMid = m;
    endStrokeStyle();
    return;
  }

  // Continue quadratic from lastMid using control = last, end = mid(last, new)
  const last = state.last;
  const lastMid = state.lastMid || last;
  const m = mid(last, p);
  ctx.moveTo(lastMid.x, lastMid.y);
  ctx.quadraticCurveTo(last.x, last.y, m.x, m.y);
  ctx.stroke();
  state.prev = last;
  state.last = p;
  state.lastMid = m;
  state.n += 1;
  endStrokeStyle();
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
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('k') || params.get('key') || '';
    const joinKey = urlKey || (window.WB_JOIN_KEY || '');
    socket.emit('wb:join', { roomId, k: joinKey });
  }

  socket.on('connect', join);
  join();

  socket.on('wb:init', ({ history: h } = {}) => {
    history = Array.isArray(h) ? h : [];
    resize();
  });

  // Track strokes that are being rendered live (points streamed while drawing)
  const liveStrokeIds = new Set();
  const liveStates = new Map(); // strokeId -> incremental state

  // Live stroke points (not persisted; used so others see the line while you drag)
  socket.on('wb:stroke_part', (evt) => {
    if (!evt || typeof evt !== 'object') return;
    if (!evt.id || !Array.isArray(evt.points) || evt.points.length < 2) return;
    if ((evt.points.length % 2) !== 0) return;

    // don't render your own streamed points (you already draw locally)
    const meId = window.VS_ME && window.VS_ME.id ? Number(window.VS_ME.id) : 0;
    const uid = Number(evt.userId || 0);
    if (uid && meId && uid === meId) return;

    const sid = String(evt.id);
    liveStrokeIds.add(sid);
    let st = liveStates.get(sid);
    if (!st) {
      st = makeLiveStrokeState(strokeStyleFrom(evt));
      liveStates.set(sid, st);
    }

    // Points are streamed as a small batch: [x1,y1,x2,y2,...]
    // Add streamed points; if there are occasional gaps, interpolate lightly so the stroke stays continuous.
    for (let i = 0; i < evt.points.length; i += 2) {
      const x = Number(evt.points[i]);
      const y = Number(evt.points[i + 1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      const p = { x, y };
      const last = st._lastNorm;
      if (last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0.003) {
          const steps = Math.min(8, Math.ceil(dist / 0.002));
          for (let s = 1; s < steps; s++) {
            liveStrokeAddPoint(st, { x: last.x + dx*(s/steps), y: last.y + dy*(s/steps) });
          }
        }
      }
      liveStrokeAddPoint(st, p);
      st._lastNorm = p;
    }
  });

  socket.on('wb:stroke', (evt) => {
    // If we already rendered this stroke live via wb:stroke_part, don't redraw (prevents double-bright lines)
    if (evt && evt.id && liveStrokeIds.has(String(evt.id))) {
      const sid = String(evt.id);
      liveStrokeIds.delete(sid);
      liveStates.delete(sid);
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
  // Local incremental smooth renderer (use the same pipeline as remote so strokes match closely)
  let localLiveState = null;

  // Streaming: batch points at ~60fps for ultra-smooth remote rendering.
  let pendingPts = []; // flat [x,y,x,y,...] (norm coords)
  let _flushRaf = 0;
  let _lastFlush = 0;
  let _lastQueued = null;
  let _lastQueuedAt = 0;


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

  // ---- Ultra-smooth realtime stroke streaming ----
  // We stream *points* in small batches at ~60fps. Remote clients render incrementally
  // using the same quadratic smoothing pipeline as the local drawer, so strokes match closely.
  function q(v) {
    // Quantize to reduce tiny float diffs between machines while keeping smoothness.
    return Math.round(v * 10000) / 10000;
  }

  function queuePoint(p) {
    pendingPts.push(q(p.x), q(p.y));
  }

  function flushPoints(force) {
    if (!strokeId || pendingPts.length < 2) return;
    const now = performance.now();
    if (!force && (now - _lastFlush) < 16) return; // ~60fps
    _lastFlush = now;
    const payload = pendingPts.splice(0, Math.min(pendingPts.length, 120)); // up to 60 points
    if (payload.length < 2) return;
    socket.emit('wb:stroke_part', {
      id: strokeId,
      t: 'stroke',
      tool,
      color: colorEl?.value || '#00ffff',
      size: Number(sizeEl?.value) || 3,
      points: payload,
    });
  }

  function rafFlush() {
    if (!drawing) return;
    flushPoints(false);
    _flushRaf = requestAnimationFrame(rafFlush);
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
    // local stroke renderer + streaming init
    localLiveState = makeLiveStrokeState(strokeStyleFrom({ tool, color: colorEl?.value, size: Number(sizeEl?.value) || 3 }));
    pendingPts = [];
    _lastQueued = prev;
    _lastQueuedAt = performance.now();
    queuePoint(prev);
    // draw the first point locally (same pipeline as remote)
    liveStrokeAddPoint(localLiveState, prev);
    // start streaming loop and force-flush first point immediately
    cancelAnimationFrame(_flushRaf);
    _flushRaf = requestAnimationFrame(rafFlush);
    flushPoints(true);
    canvas.setPointerCapture?.(e.pointerId);
    emitCursor(prev.x, prev.y, true);
  }

  function onMove(e) {
    if (!drawing || !prev) return;
    const cur = normPos(e);
    // Deterministic pipeline: render locally using the same sampled points we stream.
    // This makes local vs remote strokes match much more closely.
    const now = performance.now();
    const moved = !_lastQueued ? 999 : (Math.abs(cur.x - _lastQueued.x) + Math.abs(cur.y - _lastQueued.y));
    const timeOk = (now - _lastQueuedAt) > 16; // at least 60fps point cadence
    const distOk = moved > 0.00008; // very small threshold for smoothness
    if (timeOk || distOk) {
      _lastQueuedAt = now;
      _lastQueued = cur;
      queuePoint(cur);
      if (strokePts.length < 8190) strokePts.push(cur.x, cur.y);
      liveStrokeAddPoint(localLiveState, cur);
    }

    prev = cur;
    emitCursor(cur.x, cur.y, true);
  }

  function onUp() {
    if (drawing && strokePts && strokePts.length >= 4) {
      // flush any remaining streamed points (tail)
      flushPoints(true);
      cancelAnimationFrame(_flushRaf);
      const evt = {
        id: strokeId,
        tool,
        username: (window.VS_ME && window.VS_ME.username) ? String(window.VS_ME.username).slice(0,32) : '',
        color: colorEl?.value || '#00ffff',
        size: Number(sizeEl?.value) || 3,
        // quantize the stored polyline so remote redraw matches closely
        points: strokePts.map((v) => q(Number(v) || 0)).slice(0, 4096)
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
    localLiveState = null;
    pendingPts = [];
    _lastQueued = null;
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
      const params = new URLSearchParams(window.location.search);
      const k = params.get('k') || params.get('key') || (window.WB_JOIN_KEY || '');
      const base = `${window.location.origin}/whiteboard/r/${encodeURIComponent(roomId)}`;
      shareEl.value = k ? `${base}?k=${encodeURIComponent(k)}` : base;
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
        const r = await fetch('/friends/list', { credentials: 'include' });
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
