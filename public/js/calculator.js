(() => {
  const expr = document.getElementById('expr');
  const run = document.getElementById('run');
  const out = document.getElementById('out');
  const hist = document.getElementById('hist');
  if (!expr || !run || !out || !hist) return;

  function fmt(v) {
    try {
      if (v && typeof v === 'object' && typeof v.toString === 'function') return v.toString();
      return String(v);
    } catch { return String(v); }
  }

  function addHistory(q, a) {
    const item = document.createElement('div');
    item.className = 'vs-calc__item';
    item.innerHTML = `<div class="q">${escapeHtml(q)}</div><div class="a">${escapeHtml(a)}</div>`;
    item.addEventListener('click', () => { expr.value = q; expr.focus(); });
    hist.prepend(item);
  }

  function escapeHtml(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function evaluate() {
    const q = String(expr.value || '').trim();
    if (!q) return;
    try {
      if (!window.math) throw new Error('mathjs not loaded');
      // Use a fresh scope per evaluation (no arbitrary JS execution)
      const scope = {};
      const result = window.math.evaluate(q, scope);
      const ans = fmt(result);
      out.textContent = ans;
      addHistory(q, ans);
    } catch (e) {
      out.textContent = 'Error: ' + (e?.message || e);
    }
  }

  run.addEventListener('click', evaluate);
  expr.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); evaluate(); }
  });

  // demo
  expr.value = 'sqrt(2)^2 + sin(pi/2)';
  evaluate();
})();