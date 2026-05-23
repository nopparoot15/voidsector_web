(() => {
  let expression = '';
  let justEvaluated = false;

  const exprLineEl = document.getElementById('calc-expr-line');
  const mainLineEl = document.getElementById('calc-main-line');
  const histEl     = document.getElementById('calc-hist');
  if (!mainLineEl) return;

  // ── Math helpers ─────────────────────────────────────────────────────
  function toMathExpr(s) {
    return s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  }

  function fmt(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') {
      if (!isFinite(v)) return 'Error';
      const r = +parseFloat(v.toPrecision(12));
      return String(r);
    }
    if (typeof v === 'object' && typeof v.toString === 'function') return v.toString();
    return String(v);
  }

  function tryEval(s) {
    try {
      if (!s.trim() || !window.math) return null;
      const result = window.math.evaluate(toMathExpr(s), {});
      const f = fmt(result);
      return f || null;
    } catch { return null; }
  }

  // ── Display ──────────────────────────────────────────────────────────
  function updateDisplay() {
    if (justEvaluated) return; // evaluate() already set both lines
    const disp = expression || '0';
    mainLineEl.textContent = disp;
    mainLineEl.className = 'calc-main-line';

    if (expression) {
      const preview = tryEval(expression);
      exprLineEl.textContent = preview ? '= ' + preview : '';
      exprLineEl.className = preview ? 'calc-expr-line calc-expr--preview' : 'calc-expr-line';
    } else {
      exprLineEl.textContent = '';
      exprLineEl.className = 'calc-expr-line';
    }

    // Shrink font if long
    mainLineEl.classList.toggle('calc-main-line--sm', disp.length > 14);
    mainLineEl.classList.toggle('calc-main-line--xs', disp.length > 22);
  }

  // ── History ──────────────────────────────────────────────────────────
  function addHistory(q, a) {
    if (!histEl) return;
    const item = document.createElement('div');
    item.className = 'calc-hist-item';
    item.innerHTML =
      `<span class="chi-q">${esc(q)}</span>` +
      `<span class="chi-eq">=</span>` +
      `<span class="chi-a">${esc(a)}</span>`;
    item.addEventListener('click', () => {
      expression = q;
      justEvaluated = false;
      updateDisplay();
    });
    histEl.prepend(item);
    while (histEl.children.length > 8) histEl.removeChild(histEl.lastChild);
  }

  // ── Evaluate ─────────────────────────────────────────────────────────
  function evaluate() {
    if (!expression) return;
    const ans = tryEval(expression);
    if (!ans) {
      exprLineEl.textContent = expression;
      exprLineEl.className = 'calc-expr-line';
      mainLineEl.textContent = 'Error';
      mainLineEl.className = 'calc-main-line calc-main--error';
      justEvaluated = true;
      return;
    }
    addHistory(expression, ans);
    exprLineEl.textContent = expression + ' =';
    exprLineEl.className = 'calc-expr-line';
    mainLineEl.textContent = ans;
    mainLineEl.className = 'calc-main-line calc-main--answer';
    mainLineEl.classList.toggle('calc-main-line--sm', ans.length > 14);
    mainLineEl.classList.toggle('calc-main-line--xs', ans.length > 22);
    expression = ans;
    justEvaluated = true;
  }

  // ── Actions ──────────────────────────────────────────────────────────
  function handleAction(action) {
    switch (action) {
      case 'clear':
        expression = '';
        justEvaluated = false;
        updateDisplay();
        break;

      case 'del':
        if (justEvaluated) { expression = ''; justEvaluated = false; }
        else { expression = expression.slice(0, -1); }
        updateDisplay();
        break;

      case 'eval':
        evaluate();
        break;

      case 'negate':
        if (justEvaluated) justEvaluated = false;
        if (!expression || expression === '0') break;
        if (/^-?\d+(\.\d+)?$/.test(expression)) {
          expression = expression.startsWith('-') ? expression.slice(1) : '-' + expression;
        } else if (expression.startsWith('-(') && expression.endsWith(')')) {
          expression = expression.slice(2, -1);
        } else {
          expression = '-(' + expression + ')';
        }
        updateDisplay();
        break;

      default: {
        // After evaluation: number → start fresh; operator → continue from result
        if (justEvaluated) {
          const isOp = /^[+\-−×÷^%]$/.test(action);
          if (!isOp) expression = '';
          justEvaluated = false;
        }
        // Auto-close: add closing ) when function is fully typed
        expression += action;
        updateDisplay();
        break;
      }
    }
  }

  // ── Button clicks ─────────────────────────────────────────────────────
  document.querySelectorAll('.cb').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
  });

  // ── Keyboard support ──────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const map = {
      'Enter': 'eval', '=': 'eval',
      'Backspace': 'del', 'Delete': 'clear', 'Escape': 'clear',
      '*': '×', '/': '÷', '-': '−',
      '+': '+', '.': '.', '%': '%',
      '(': '(', ')': ')', '^': '^',
    };
    const act = map[e.key];
    if (act) { e.preventDefault(); handleAction(act); return; }
    if (/^[0-9]$/.test(e.key)) { handleAction(e.key); return; }
  });

  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  updateDisplay();
})();
