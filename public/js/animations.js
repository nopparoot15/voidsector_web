(() => {
  // ── Scroll reveal ────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  const REVEAL_SELECTORS = [
    '.hub-card', '.lang-card', '.feature-card', '.stat-card',
    '.lang-select-card', '.hobby-card', '.unit-card',
    '.lesson-item', '.lb-card', '.learn-cat-card', '.lang-grid .lang-select-card'
  ];

  function initReveal() {
    REVEAL_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.92) {
          el.setAttribute('data-reveal', '');
          el.style.transitionDelay = ((i % 5) * 0.07) + 's';
          revealObserver.observe(el);
        }
      });
    });
  }

  // ── Stat counter animation ───────────────────────────────────
  function animateCounter(el) {
    const raw = el.textContent.trim();
    const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num < 2) return;
    const prefix = raw.match(/^[^0-9]*/)?.[0] || '';
    const suffix = raw.match(/[^0-9]*$/)?.[0] || '';
    const duration = Math.min(900, num * 1.5);
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          animateCounter(el);
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  // ── Init ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initReveal(); initCounters(); });
  } else {
    initReveal();
    initCounters();
  }
})();
