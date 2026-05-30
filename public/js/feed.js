(() => {
  const list = document.getElementById('feedList');
  const form = document.getElementById('feedForm');
  const status = document.getElementById('feedStatus');

  const escapeHtml = esc;

  function timeAgo(iso){
    const t = new Date(iso);
    const s = Math.floor((Date.now() - t.getTime())/1000);
    if (!isFinite(s)) return '';
    if (s < 60) return `${s}s`;
    const m = Math.floor(s/60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m/60);
    if (h < 48) return `${h}h`;
    const d = Math.floor(h/24);
    return `${d}d`;
  }

  function renderMedia(m){
    const url = m.url;
    const mime = (m.mime || '').toLowerCase();
    const name = m.name || 'file';

    if (mime.startsWith('image/')) {
      return `<div class="vs-media"><img src="${escapeHtml(url)}" alt="" /></div>`;
    }
    if (mime.startsWith('video/')) {
      return `<div class="vs-media"><video src="${escapeHtml(url)}" controls></video></div>`;
    }
    if (mime.startsWith('audio/')) {
      return `<div class="vs-media"><audio src="${escapeHtml(url)}" controls></audio></div>`;
    }
    return `<div class="vs-media"><a href="${escapeHtml(url)}" target="_blank" rel="noopener">📎 ${escapeHtml(name)}</a></div>`;
  }

  function renderPost(p){
    const media = Array.isArray(p.media) ? p.media : [];
    return `
      <article class="vs-card vs-post" data-post-id="${p.id}">
        <div class="vs-post__meta">
          <div class="vs-post__user">${escapeHtml(p.username)}</div>
          <div class="vs-post__time">${timeAgo(p.updated_at || p.created_at)}</div>
        </div>
        ${p.text ? `<div class="vs-post__text">${escapeHtml(p.text)}</div>` : ''}
        ${media.length ? `<div class="vs-post__media">${media.map(renderMedia).join('')}</div>` : ''}
      </article>
    `;
  }

  async function loadLatest(){
    const r = await fetch('/api/feed?limit=30', { headers: { 'Accept': 'application/json' } });
    const j = await r.json();
    if (!j.ok) return;
    const posts = j.posts || [];
    list.innerHTML = posts.map(renderPost).join('');
  }

  function bootInitial(){
    const init = window.VS_FEED_POSTS || [];
    list.innerHTML = init.map(renderPost).join('');
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'กำลังโพสต์...';

      const fd = new FormData(form);
      const r = await fetch('/api/feed', { method: 'POST', body: fd });
      const j = await r.json().catch(() => ({}));

      if (!r.ok || !j.ok) {
        status.textContent = 'โพสต์ไม่สำเร็จ';
        return;
      }

      form.reset();
      status.textContent = 'โพสต์สำเร็จ';
      await loadLatest();
      setTimeout(() => (status.textContent = ''), 1200);
    });
  }

  bootInitial();
})();
