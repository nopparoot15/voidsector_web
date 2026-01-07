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
    if (pts.length < 4) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const x1 = pts[0] * w;
    const y1 = pts[1] * h;
    const x2 = pts[2] * w;
    const y2 = pts[3] * h;

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
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawText(evt) {
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

  socket.on('wb:stroke', (evt) => {
    history.push(evt);
    applyEvent(evt);
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
    canvas.setPointerCapture?.(e.pointerId);
  }

  function onMove(e) {
    if (!drawing || !prev) return;
    const cur = normPos(e);
    const evt = {
      tool,
      color: colorEl?.value || '#00ffff',
      size: Number(sizeEl?.value) || 3,
      points: [prev.x, prev.y, cur.x, cur.y]
    };
    // optimistic local draw
    const local = { t: 'stroke', ...evt };
    history.push(local);
    drawStroke(local);
    socket.emit('wb:stroke', evt);
    prev = cur;
  }

  function onUp() {
    drawing = false;
    prev = null;
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
        if (window.Swal) {
          Swal.fire({ icon: 'error', title: 'Invite ไม่สำเร็จ', text: 'ตรวจสอบว่าเป็นเจ้าของห้อง และเพื่อนอยู่ใน list', background: '#0b0f14', color: '#e6f7ff' });
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
