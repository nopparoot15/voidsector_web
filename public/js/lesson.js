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

  let matchSelected = { left: null, right: null };
  let matchPairs = [];
  let matchDone = new Set();

  const introScreen    = document.getElementById('intro-screen');
  const exerciseArea   = document.getElementById('exercise-area');
  const startBtn       = document.getElementById('start-exercises-btn');
  const lessonTitleEl  = document.getElementById('intro-lesson-title');
  const vocabTableBody = document.getElementById('vocab-table-body');
  const exerciseCard   = document.getElementById('exercise-card');
  const answerArea     = document.getElementById('answer-area');
  const checkBtn       = document.getElementById('check-btn');
  const progressBar    = document.getElementById('progress-bar');
  const progressText   = document.getElementById('progress-text');
  const feedbackPanel  = document.getElementById('feedback-panel');
  const feedbackHeader = document.getElementById('feedback-header');
  const feedbackAnswer = document.getElementById('feedback-answer');
  const continueBtn    = document.getElementById('continue-btn');
  const completionScreen = document.getElementById('completion-screen');

  async function init() {
    try {
      const res = await fetch(`/api/lesson/${lessonId}`);
      const data = await res.json();
      exercises = data.exercises || [];
      const lesson = data.lesson || {};

      if (lessonTitleEl) lessonTitleEl.textContent = lesson.title || '';

      // Grammar note
      if (lesson.grammar_note) {
        const sec = document.getElementById('grammar-note-section');
        const txt = document.getElementById('grammar-note-text');
        if (sec && txt) { txt.textContent = lesson.grammar_note; sec.classList.remove('hidden'); }
      }

      // Cultural note
      if (lesson.cultural_note) {
        const sec = document.getElementById('cultural-note-section');
        const txt = document.getElementById('cultural-note-text');
        if (sec && txt) { txt.textContent = lesson.cultural_note; sec.classList.remove('hidden'); }
      }

      buildVocabTable(exercises);
      showIntro();
    } catch (e) {
      if (introScreen) introScreen.classList.add('hidden');
      if (exerciseArea) exerciseArea.classList.remove('hidden');
      exerciseCard.innerHTML = '<p style="color:var(--error)">โหลดบทเรียนไม่ได้ ลองใหม่อีกครั้ง</p>';
    }
  }

  // ── Intro / Vocab table ─────────────────────────────────────────────
  function buildVocabTable(exs) {
    if (!vocabTableBody) return;
    const rows = [];
    const seen = new Set();
    const hasThai = s => /[฀-๿]/.test(s);

    // Build reading lookup from translate exercises so match_pairs can share readings
    const readingMap = {};
    if (langCode !== 'en') {
      for (const ex of exs) {
        if (ex.type === 'translate') {
          const w = String(ex.data.answer || '').trim();
          const h = String(ex.data.hint || '').trim();
          if (w && h) readingMap[w] = h;
        }
      }
    }

    for (const ex of exs) {
      const d = ex.data;
      if (ex.type === 'match_pairs') {
        const pairs = (d.pairs || []).map(p =>
          Array.isArray(p) ? { left: p[0], right: p[1] } : { left: p.left, right: p.right }
        );
        for (const p of pairs) {
          // skip antonym/English-only pairs — only include if meaning contains Thai
          if (!hasThai(p.right)) continue;
          const key = p.left + '|' + p.right;
          if (!seen.has(key)) {
            seen.add(key);
            rows.push({ word: p.left, reading: readingMap[p.left] || '', meaning: p.right });
          }
        }
      } else if (ex.type === 'translate') {
        const word = String(d.answer || '').trim();
        const meaning = String(d.prompt || '').trim();
        const rawHint = String(d.hint || '').trim();
        // skip if word or meaning looks like a sentence (too long)
        if (!word || word.length > 60 || meaning.length > 80) continue;
        // meaning must contain Thai to be a real translation
        if (!hasThai(meaning)) continue;
        // reading only makes sense for JA/ZH; for EN hints are Thai category descriptions
        const reading = (langCode === 'en') ? '' : rawHint;
        const key = word + '|' + meaning;
        if (!seen.has(key)) {
          seen.add(key);
          rows.push({ word, reading, meaning });
        }
      }
    }

    if (!rows.length) {
      vocabTableBody.closest('.vocab-section').classList.add('hidden');
      return;
    }

    vocabTableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="vocab-word">${esc(r.word)}</td>
        <td class="vocab-reading">${esc(r.reading)}</td>
        <td class="vocab-meaning">${esc(r.meaning)}</td>
      </tr>
    `).join('');
  }

  function showIntro() {
    if (introScreen) introScreen.classList.remove('hidden');
    if (exerciseArea) exerciseArea.classList.add('hidden');
    updateProgress();
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (introScreen) introScreen.classList.add('hidden');
      if (exerciseArea) exerciseArea.classList.remove('hidden');
      document.body.classList.add('exercise-mode');
      window.scrollTo(0, 0);
      renderExercise();
    });
  }

  // ── Exercise loop ────────────────────────────────────────────────────
  function updateProgress() {
    const pct = exercises.length ? Math.round((current / exercises.length) * 100) : 0;
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

  // ── Multiple Choice ──────────────────────────────────────────────────
  function renderMC(ex) {
    const d = ex.data;
    const prompt = d.prompt || d.question || '';
    const correctIdx = d.correct_index !== undefined ? d.correct_index : d.correct;
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    answerArea.innerHTML = `<div class="mc-options">${d.options.map((o, i) =>
      `<button class="mc-option" data-idx="${i}">${esc(o)}</button>`
    ).join('')}</div>`;
    answerArea.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => {
        answerArea.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        userAnswer = btn.dataset.idx;
        checkBtn.disabled = false;
      });
    });
    checkBtn.dataset.correctIdx = correctIdx;
  }

  function checkMC(ex) {
    const d = ex.data;
    const correctIdx = d.correct_index !== undefined ? d.correct_index : d.correct;
    const correct = parseInt(userAnswer) === parseInt(correctIdx);
    if (correct) score++;
    showFeedback(correct, d.options[correctIdx]);
    answerArea.querySelectorAll('.mc-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === parseInt(correctIdx)) btn.classList.add('correct');
      else if (String(i) === String(userAnswer)) btn.classList.add('wrong');
    });
  }

  // ── Fill Blank ───────────────────────────────────────────────────────
  function renderFillBlank(ex) {
    const d = ex.data;
    if (d.options && d.options.length) {
      const prompt = d.sentence || d.prompt || '';
      exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
      const correctIdx = d.correct_index !== undefined ? d.correct_index : d.correct;
      answerArea.innerHTML = `<div class="mc-options">${d.options.map((o, i) =>
        `<button class="mc-option" data-idx="${i}">${esc(o)}</button>`
      ).join('')}</div>`;
      answerArea.querySelectorAll('.mc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          answerArea.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          userAnswer = btn.dataset.idx;
          checkBtn.disabled = false;
        });
      });
      checkBtn.dataset.correctIdx = correctIdx;
    } else {
      const prompt = d.prompt || d.sentence || '';
      exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
      answerArea.innerHTML = `<input id="fill-input" class="translate-input" type="text" placeholder="พิมพ์คำตอบ..." autocomplete="off" />`;
      const inp = document.getElementById('fill-input');
      inp.focus();
      inp.addEventListener('input', () => { userAnswer = inp.value.trim(); checkBtn.disabled = !userAnswer; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !checkBtn.disabled && !checked) doCheck(); });
    }
  }

  function checkFillBlank(ex) {
    const d = ex.data;
    if (d.options && d.options.length) {
      const correctIdx = d.correct_index !== undefined ? d.correct_index : d.correct;
      const correct = parseInt(userAnswer) === parseInt(correctIdx);
      if (correct) score++;
      showFeedback(correct, d.options[correctIdx]);
      answerArea.querySelectorAll('.mc-option').forEach((btn, i) => {
        btn.disabled = true;
        if (i === parseInt(correctIdx)) btn.classList.add('correct');
        else if (String(i) === String(userAnswer)) btn.classList.add('wrong');
      });
    } else {
      const correct = normalize(userAnswer) === normalize(d.answer);
      if (correct) score++;
      showFeedback(correct, d.answer);
      const inp = document.getElementById('fill-input');
      if (inp) inp.disabled = true;
    }
  }

  // ── Word Order ───────────────────────────────────────────────────────
  function renderWordOrder(ex) {
    const d = ex.data;
    const prompt = d.prompt || d.instruction || '';
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    answerArea.innerHTML = `
      <div id="answer-slots" class="answer-slots"></div>
      <div id="word-bank" class="word-bank">${d.words.map((w, i) =>
        `<button class="word-chip" data-word="${esc(w)}" data-idx="${i}">${esc(w)}</button>`
      ).join('')}</div>`;
    answerArea.querySelectorAll('.word-chip').forEach(btn => {
      btn.addEventListener('click', () => wordChipClick(btn));
    });
  }

  function wordChipClick(btn) {
    if (btn.classList.contains('used')) return;
    btn.classList.add('used');
    const slots = document.getElementById('answer-slots');
    const chip = document.createElement('button');
    chip.className = 'word-chip answer-chip';
    chip.textContent = btn.dataset.word;
    chip.addEventListener('click', () => {
      chip.remove();
      btn.classList.remove('used');
      updateWordOrderCheck();
    });
    slots.appendChild(chip);
    updateWordOrderCheck();
  }

  function updateWordOrderCheck() {
    const chips = document.getElementById('answer-slots').querySelectorAll('.answer-chip');
    userAnswer = Array.from(chips).map(c => c.textContent).join(' ');
    checkBtn.disabled = chips.length === 0;
  }

  function checkWordOrder(ex) {
    const correct = normalize(userAnswer) === normalize(ex.data.answer);
    if (correct) score++;
    showFeedback(correct, ex.data.answer);
    document.querySelectorAll('.word-chip, .answer-chip').forEach(b => b.disabled = true);
  }

  // ── Translate ────────────────────────────────────────────────────────
  function renderTranslate(ex) {
    const d = ex.data;
    const prompt = d.prompt || '';
    const hint = d.hint ? `<div class="ex-hint">${esc(d.hint)}</div>` : '';
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>${hint}`;
    answerArea.innerHTML = `<textarea id="translate-input" class="translate-input" rows="3" placeholder="พิมพ์คำแปล..."></textarea>`;
    const inp = document.getElementById('translate-input');
    inp.focus();
    inp.addEventListener('input', () => { userAnswer = inp.value.trim(); checkBtn.disabled = !userAnswer; });
  }

  function checkTranslate(ex) {
    const d = ex.data;
    const answers = [d.answer, ...(d.alternatives || [])].filter(Boolean);
    const correct = answers.some(a => normalize(userAnswer) === normalize(a));
    if (correct) score++;
    showFeedback(correct, d.answer);
    const inp = document.getElementById('translate-input');
    if (inp) inp.disabled = true;
  }

  // ── Match Pairs ──────────────────────────────────────────────────────
  function renderMatchPairs(ex) {
    const d = ex.data;
    const prompt = d.prompt || d.instruction || 'จับคู่คำศัพท์';
    matchPairs = (d.pairs || []).map(p =>
      Array.isArray(p) ? { left: p[0], right: p[1] } : { left: p.left, right: p.right }
    );

    const lefts = matchPairs.map((p, i) => ({ text: p.left, idx: i }));
    const rights = shuffle(matchPairs.map((p, i) => ({ text: p.right, idx: i })));

    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    answerArea.innerHTML = `<div class="match-cols">
      <div class="match-col" id="match-left">${lefts.map(l =>
        `<button class="match-item" data-side="left" data-idx="${l.idx}">${esc(l.text)}</button>`
      ).join('')}</div>
      <div class="match-col" id="match-right">${rights.map(r =>
        `<button class="match-item" data-side="right" data-idx="${r.idx}">${esc(r.text)}</button>`
      ).join('')}</div>
    </div>`;

    answerArea.querySelectorAll('.match-item').forEach(btn => {
      btn.addEventListener('click', () => matchClick(btn));
    });
    userAnswer = 'pending';
    checkBtn.disabled = true;
  }

  function matchClick(btn) {
    if (btn.disabled || btn.classList.contains('matched')) return;
    const side = btn.dataset.side;
    const idx = parseInt(btn.dataset.idx);

    const prev = answerArea.querySelector(`.match-item[data-side="${side}"].selected`);
    if (prev) prev.classList.remove('selected');
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
          setTimeout(doCheck, 300);
        }
      } else {
        lBtn.classList.remove('selected'); lBtn.classList.add('shake');
        rBtn.classList.remove('selected'); rBtn.classList.add('shake');
        setTimeout(() => { lBtn.classList.remove('shake'); rBtn.classList.remove('shake'); }, 500);
      }
      matchSelected = { left: null, right: null };
    }
  }

  function checkMatchPairs() {
    showFeedback(matchDone.size === matchPairs.length, '');
  }

  // ── Check & Feedback ─────────────────────────────────────────────────
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
    feedbackAnswer.textContent = (!correct && correctAnswer) ? `คำตอบ: ${correctAnswer}` : '';
    continueBtn.textContent = current + 1 >= exercises.length ? 'ดูผลลัพธ์' : 'ถัดไป →';
  }

  continueBtn.addEventListener('click', () => {
    feedbackPanel.className = '';
    current++;
    setTimeout(renderExercise, 300);
  });

  // ── Completion ───────────────────────────────────────────────────────
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
      totalXp  = data.total_xp  || 0;
      streak   = data.streak    || 0;
      level    = data.level     || 1;
    } catch (e) { /* ignore */ }

    const pct = exercises.length ? Math.round((score / exercises.length) * 100) : 0;
    container.classList.add('hidden');
    completionScreen.classList.remove('hidden');
    document.getElementById('result-score').textContent   = `คะแนน: ${score} / ${exercises.length}`;
    document.getElementById('result-pct').textContent     = `ความแม่นยำ: ${pct}%`;
    document.getElementById('result-xp').textContent      = `XP ที่ได้: +${xpEarned}`;
    document.getElementById('result-streak').textContent  = `Streak: ${streak} วัน 🔥`;
    document.getElementById('result-level').textContent   = `Level: ${level}`;
    document.getElementById('back-learn-btn').href        = `/learn/${langCode}`;
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function normalize(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }
  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  document.getElementById('exit-btn')?.addEventListener('click', () => {
    if (confirm('ออกจากบทเรียน? ความคืบหน้าจะไม่ถูกบันทึก')) {
      window.location.href = `/learn/${langCode}`;
    }
  });

  init();
})();
