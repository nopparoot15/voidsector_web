// Global image lightbox — works for any .post-image click
(() => {
  if (window.__VS_LIGHTBOX__) return;
  window.__VS_LIGHTBOX__ = true;

  // Build overlay once
  const overlay = document.createElement('div');
  overlay.id = 'vs-lightbox';
  overlay.innerHTML = `
    <div class="vlb-backdrop"></div>
    <button class="vlb-close" aria-label="ปิด">✕</button>
    <div class="vlb-content">
      <img class="vlb-img" src="" alt="">
    </div>
  `;
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.vlb-img');

  function open(src) {
    img.src = src;
    overlay.classList.add('vlb-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('vlb-open');
    document.body.style.overflow = '';
    // Delay clearing src so close animation plays
    setTimeout(() => { img.src = ''; }, 250);
  }

  // Click on post image → open
  document.addEventListener('click', e => {
    const target = e.target.closest('.post-image');
    if (target && target.src) { open(target.src); return; }
    // Click backdrop or close btn → close
    if (e.target.closest('.vlb-close') || e.target.classList.contains('vlb-backdrop')) close();
  });

  // Keyboard: Escape → close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('vlb-open')) close();
  });
})();
