(function () {
  const container = document.getElementById('lesson-container');
  if (!container) return;

  const lessonId = container.dataset.lessonId;
  const langCode = container.dataset.langCode;

  let exercises = [];
  let current = 0;
  let score = 0;
  let userAnswer = null;
  let checked = false;

  // Match-pairs state
  let matchSelected = { left: null, right: null };
  let matchPairs = [];
  let matchDone = new Set();

  const exerciseCard = document.getElementById('exercise-card');
  const answerArea = document.getElementById('answer-area');
  const checkBtn = document.getElementById('check-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const feedbackPanel = document.getElementById('feedback-panel');
  const feedbackHeader = document.getElementById('feedback-header');
  const feedbackAnswer = document.getElementById('feedback-answer');
  const continueBtn = document.getElementById('continue-btn');
  const completionScreen = document.getElementById('completion-screen');

  async function init() {
    const res = await fetch(`/api/lesson/${lessonId}`);
    const data = await res.json();
    exercises = data.exercises || [];
    renderExercise();
  }

  function updateProgress() {
    const pct = Math.round((current / exercises.length) * 100);
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressText) progressText.textContent = `${current} / ${exercises.length}`;
  }

  function renderExercise() {
    if (current >= exercises.length) { showCompletion(); return; }
    userAnswer = null;
    checked = false;
    matchSelected = { left: null, right: null };
    matchPairs = [];
    matchDone = new Set();
    checkBtn.disabled = true;
    feedbackPanel.className = '';
    updateProgress();

    const ex = exercises[current];
    switch (ex.type) {
      case 'multiple_choice': renderMC(ex); break;
      case 'fill_blank':      renderFillBlank(ex); break;
      case 'word_order':      renderWordOrder(ex); break;
      case 'translate':       renderTranslate(ex); break;
      case 'match_pairs':     renderMatchPairs(ex); break;
      default: current++; renderExercise();
    }
  }

  // ── Multiple Choice ──────────────────────────────────────────────
  function renderMC(ex) {
    exerciseCard.innerHTML = `<div class="ex-prompt">${ex.data.prompt}</div>`;
    answerArea.innerHTML = `<div class="mc-options">${ex.data.options.map((o, i) =>
      `<button class="mc-option" data-idx="${i}">${o}</button>`
    ).join('')}</div>`;

    answerArea.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => {
        answerArea.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        userAnswer = btn.dataset.idx;
        checkBtn.disabled = false;
      });
    });
  }

  function checkMC(ex) {
    const correct = String(ex.data.correct_index) === String(userAnswer);
    if (correct) score++;
    showFeedback(correct, ex.data.options[ex.data.correct_index]);
    answerArea.querySelectorAll('.mc-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === ex.data.correct_index) btn.classList.add('correct');
      else if (String(i) === String(userAnswer)) btn.classList.add('wrong');
    });
  }

  // ── Fill Blank ───────────────────────────────────────────────────
  function renderFillBlank(ex) {
    exerciseCard.innerHTML = `<div class="ex-prompt">${ex.data.prompt}</div>`;
    answerArea.innerHTML = `<input id="fill-input" class="translate-input" type="text" placeholder="พิมพ์คำตอบ..." autocomplete="off" />`;
    const inp = document.getElementById('fill-input');
    inp.focus();
    inp.addEventListener('input', () => {
      userAnswer = inp.value.trim();
      checkBtn.disabled = userAnswer.length === 0;
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !checkBtn.disabled && !checked) doCheck(); });
  }

  function checkFillBlank(ex) {
    const correct = normalize(userAnswer) === normalize(ex.data.answer);
    if (correct) score++;
    showFeedback(correct, ex.data.answer);
    document.getElementById('fill-input').disabled = true;
  }

  // ── Word Order ───────────────────────────────────────────────────
  function renderWordOrder(ex) {
    exerciseCard.innerHTML = `<div class="ex-prompt">${ex.data.prompt}</div>`;
    const words = ex.data.words;
    answerArea.innerHTML = `
      <div id="answer-slots" class="answer-slots"></div>
      <div id="word-bank" class="word-bank">${words.map((w, i) =>
        `<button class="word-chip" data-word="${w}" data-idx="${i}">${w}</button>`
      ).join('')}</div>`;

    answerArea.querySelectorAll('.word-chip').forEach(btn => {
      btn.addEventListener('click', () => wordChipClick(btn, ex));
    });
  }

  function wordChipClick(btn, ex) {
    if (btn.classList.contains('used')) return;
    btn.classList.add('used');
    const slots = document.getElementById('answer-slots');
    const chip = document.createElement('button');
    chip.className = 'word-chip answer-chip';
    chip.textContent = btn.dataset.word;
    chip.dataset.src = btn.dataset.idx;
    chip.addEventListener('click', () => {
      chip.remove();
      btn.classList.remove('used');
      updateWordOrderCheck(ex);
    });
    slots.appendChild(chip);
    updateWordOrderCheck(ex);
  }

  function updateWordOrderCheck(ex) {
    const slots = document.getElementById('answer-slots');
    const chips = slots.querySelectorAll('.answer-chip');
    userAnswer = Array.from(chips).map(c => c.textContent).join(' ');
    checkBtn.disabled = chips.length === 0;
  }

  function checkWordOrder(ex) {
    const correct = normalize(userAnswer) === normalize(ex.data.answer);
    if (correct) score++;
    showFeedback(correct, ex.data.answer);
    document.querySelectorAll('.word-chip, .answer-chip').forEach(b => b.disabled = true);
  }

  // ── Translate ────────────────────────────────────────────────────
  function renderTranslate(ex) {
    exerciseCard.innerHTML = `<div class="ex-prompt">${ex.data.prompt}</div>`;
    answerArea.innerHTML = `<textarea id="translate-input" class="translate-input" rows="3" placeholder="พิมพ์คำแปล..."></textarea>`;
    const inp = document.getElementById('translate-input');
    inp.focus();
    inp.addEventListener('input', () => {
      userAnswer = inp.value.trim();
      checkBtn.disabled = userAnswer.length === 0;
    });
  }

  function checkTranslate(ex) {
    const answers = Array.isArray(ex.data.answer) ? ex.data.answer : [ex.data.answer];
    const correct = answers.some(a => normalize(userAnswer) === normalize(a));
    if (correct) score++;
    showFeedback(correct, answers[0]);
    document.getElementById('translate-input').disabled = true;
  }

  // ── Match Pairs ──────────────────────────────────────────────────
  function renderMatchPairs(ex) {
    exerciseCard.innerHTML = `<div class="ex-prompt">${ex.data.prompt || 'จับคู่คำศัพท์'}</div>`;
    const pairs = ex.data.pairs;
    matchPairs = pairs;
    const lefts = pairs.map((p, i) => ({ text: p[0], idx: i }));
    const rights = shuffle(pairs.map((p, i) => ({ text: p[1], idx: i })));

    answerArea.innerHTML = `<div class="match-cols">
      <div class="match-col" id="match-left">${lefts.map(l =>
        `<button class="match-item" data-side="left" data-idx="${l.idx}">${l.text}</button>`
      ).join('')}</div>
      <div class="match-col" id="match-right">${rights.map(r =>
        `<button class="match-item" data-side="right" data-idx="${r.idx}">${r.text}</button>`
      ).join('')}</div>
    </div>`;

    answerArea.querySelectorAll('.match-item').forEach(btn => {
      btn.addEventListener('click', () => matchClick(btn, ex));
    });
    userAnswer = 'pending';
  }

  function matchClick(btn, ex) {
    if (btn.disabled || btn.classList.contains('matched')) return;
    const side = btn.dataset.side;
    const idx = parseInt(btn.dataset.idx);

    if (matchSelected[side] !== null) {
      answerArea.querySelector(`.match-item[data-side="${side}"][data-idx="${matchSelected[side]}"]`)?.classList.remove('selected');
    }
    matchSelected[side] = idx;
    btn.classList.add('selected');

    if (matchSelected.left !== null && matchSelected.right !== null) {
      const lIdx = matchSelected.left;
      const rIdx = matchSelected.right;
      const lBtn = answerArea.querySelector(`.match-item[data-side="left"][data-idx="${lIdx}"]`);
      const rBtn = answerArea.querySelector(`.match-item[data-side="right"][data-idx="${rIdx}"]`);

      if (lIdx === rIdx) {
        lBtn.classList.remove('selected'); lBtn.classList.add('matched'); lBtn.disabled = true;
        rBtn.classList.remove('selected'); rBtn.classList.add('matched'); rBtn.disabled = true;
        matchDone.add(lIdx);
        if (matchDone.size === matchPairs.length) {
          score++;
          userAnswer = 'done';
          checkBtn.disabled = false;
          checkBtn.click();
        }
      } else {
        lBtn.classList.remove('selected'); lBtn.classList.add('shake');
        rBtn.classList.remove('selected'); rBtn.classList.add('shake');
        setTimeout(() => { lBtn.classList.remove('shake'); rBtn.classList.remove('shake'); }, 500);
      }
      matchSelected = { left: null, right: null };
    }
  }

  function checkMatchPairs(ex) {
    showFeedback(matchDone.size === matchPairs.length, '');
  }

  // ── Check & Feedback ─────────────────────────────────────────────
  checkBtn.addEventListener('click', doCheck);

  function doCheck() {
    if (checked) return;
    checked = true;
    checkBtn.disabled = true;
    const ex = exercises[current];
    switch (ex.type) {
      case 'multiple_choice': checkMC(ex); break;
      case 'fill_blank':      checkFillBlank(ex); break;
      case 'word_order':      checkWordOrder(ex); break;
      case 'translate':       checkTranslate(ex); break;
      case 'match_pairs':     checkMatchPairs(ex); break;
    }
  }

  function showFeedback(correct, correctAnswer) {
    feedbackPanel.className = 'show ' + (correct ? 'correct' : 'wrong');
    feedbackHeader.textContent = correct ? '✓ ถูกต้อง!' : '✗ ยังไม่ถูก';
    feedbackAnswer.textContent = correct ? '' : `คำตอบ: ${correctAnswer}`;
    continueBtn.textContent = current + 1 >= exercises.length ? 'ดูผลลัพธ์' : 'ถัดไป →';
  }

  continueBtn.addEventListener('click', () => {
    feedbackPanel.className = '';
    current++;
    setTimeout(renderExercise, 300);
  });

  // ── Completion ───────────────────────────────────────────────────
  async function showCompletion() {
    updateProgress();
    let xpEarned = 0, totalXp = 0, streak = 0, level = 1;
    try {
      const res = await fetch(`/api/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, total: exercises.length })
      });
      const data = await res.json();
      xpEarned = data.xp_earned || 0;
      totalXp = data.total_xp || 0;
      streak = data.streak || 0;
      level = data.level || 1;
    } catch (e) { /* ignore */ }

    const pct = exercises.length ? Math.round((score / exercises.length) * 100) : 0;
    container.classList.add('hidden');
    completionScreen.classList.remove('hidden');

    document.getElementById('result-score').textContent = `คะแนน: ${score} / ${exercises.length}`;
    document.getElementById('result-pct').textContent = `ความแม่นยำ: ${pct}%`;
    document.getElementById('result-xp').textContent = `XP ที่ได้: +${xpEarned}`;
    document.getElementById('result-streak').textContent = `Streak: ${streak} วัน 🔥`;
    document.getElementById('result-level').textContent = `Level: ${level}`;
    document.getElementById('back-learn-btn').href = `/learn/${langCode}`;
  }

  // ── Helpers ──────────────────────────────────────────────────────
  function normalize(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }
  function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  document.getElementById('exit-btn')?.addEventListener('click', () => {
    if (confirm('ออกจากบทเรียน? ความคืบหน้าจะไม่ถูกบันทึก')) {
      window.location.href = `/learn/${langCode}`;
    }
  });

  init();
})();
