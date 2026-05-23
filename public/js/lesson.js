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

  // ── Static reading fallback for ZH characters not covered by translate exercises ──
  var ZH_PINYIN = {
    '人':'rén','大':'dà','小':'xiǎo','好':'hǎo','水':'shuǐ','山':'shān','火':'huǒ',
    '日':'rì','月':'yuè','天':'tiān','爱':'ài','美':'měi','木':'mù','土':'tǔ',
    '金':'jīn','风':'fēng','云':'yún','雨':'yǔ','花':'huā','草':'cǎo','树':'shù',
    '你好':'nǐ hǎo','再见':'zài jiàn','早上好':'zǎo shang hǎo','晚上好':'wǎn shang hǎo',
    '谢谢':'xiè xie','不客气':'bú kè qi','对不起':'duì bu qǐ','没关系':'méi guān xi',
    '是':'shì','不是':'bú shì','你好吗':'nǐ hǎo ma','我很好':'wǒ hěn hǎo',
    '一':'yī','二':'èr','三':'sān','四':'sì','五':'wǔ',
    '六':'liù','七':'qī','八':'bā','九':'jiǔ','十':'shí','百':'bǎi','千':'qiān',
    '爸爸':'bà ba','妈妈':'mā ma','哥哥':'gē ge','姐姐':'jiě jie',
    '弟弟':'dì di','妹妹':'mèi mei','爷爷':'yé ye','奶奶':'nǎi nai',
    '父母':'fù mǔ','家':'jiā','我':'wǒ','你':'nǐ','他':'tā','她':'tā','我们':'wǒ men',
    '吃':'chī','喝':'hē','说':'shuō','看':'kàn','听':'tīng','走':'zǒu',
    '来':'lái','去':'qù','买':'mǎi','卖':'mài','要':'yào','有':'yǒu',
    '在':'zài','是的':'shì de','不':'bù','很':'hěn','也':'yě','都':'dōu',
    '今天':'jīn tiān','明天':'míng tiān','昨天':'zuó tiān','每天':'měi tiān',
    '早上':'zǎo shang','中午':'zhōng wǔ','晚上':'wǎn shang','上午':'shàng wǔ','下午':'xià wǔ',
    '苹果':'píng guǒ','香蕉':'xiāng jiāo','水果':'shuǐ guǒ','蔬菜':'shū cài',
    '米饭':'mǐ fàn','面条':'miàn tiáo','饺子':'jiǎo zi','包子':'bāo zi',
    '中国':'Zhōng guó','北京':'Běi jīng','上海':'Shàng hǎi','泰国':'Tài guó',
    '学校':'xué xiào','工作':'gōng zuò','书':'shū','笔':'bǐ','电脑':'diàn nǎo',
    '手机':'shǒu jī','朋友':'péng you','老师':'lǎo shī','学生':'xué shēng',
    '医院':'yī yuàn','商店':'shāng diàn','餐厅':'cān tīng','公司':'gōng sī',
    '喜欢':'xǐ huān','知道':'zhī dào','觉得':'jué de','认为':'rèn wéi',
    '高兴':'gāo xìng','快乐':'kuài lè','难过':'nán guò','生气':'shēng qì',
    '漂亮':'piào liang','便宜':'pián yi','贵':'guì','多少钱':'duō shao qián',
    '太贵了':'tài guì le','一点儿':'yī diǎnr','还好':'hái hǎo',
    '一起':'yī qǐ','一下':'yī xià','一些':'yī xiē','一样':'yī yàng'
  };

  // ── Intro / Vocab table ─────────────────────────────────────────────
  function buildVocabTable(exs) {
    if (!vocabTableBody) return;
    const rows = [];
    const seen = new Set();
    // Thai block U+0E00-U+0E7F — charCodeAt avoids any regex encoding issues
    const hasThai = s => { for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c >= 0x0E00 && c <= 0x0E7F) return true; } return false; };
    // Pure lowercase romaji check — used to skip JA hiragana phonetic drills (あ→a)
    const isPureRomaji = s => /^[a-z]+$/.test(s.trim());

    // Build reading lookup: start with static fallback, then translate exercises override
    var readingMap = {};
    if (langCode === 'zh') {
      for (var k in ZH_PINYIN) readingMap[k] = ZH_PINYIN[k];
    }
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
          const r = String(p.right || '').trim();
          // EN: skip antonym/English-only pairs (right has no Thai)
          if (langCode === 'en' && !hasThai(r)) continue;
          // JA: skip pure hiragana phonetic drills (right is pure romaji like 'a', 'ka')
          if (langCode === 'ja' && isPureRomaji(r)) continue;
          // Must have some meaningful meaning to show
          if (!r) continue;
          const key = p.left + '|' + r;
          if (!seen.has(key)) {
            seen.add(key);
            rows.push({ word: p.left, reading: readingMap[p.left] || '', meaning: r });
          }
        }
      } else if (ex.type === 'translate') {
        const word = String(d.answer || '').trim();
        const meaning = String(d.prompt || '').trim();
        const rawHint = String(d.hint || '').trim();
        // skip if too long (sentence-level entries)
        if (!word || word.length > 60 || meaning.length > 80) continue;
        // for EN: reading column stays empty (hint is a Thai category label, not phonetics)
        // for JA/ZH: hint is romaji/pinyin — show it
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

    // Hide reading column header for EN (always empty)
    const readingTh = vocabTableBody.closest('table').querySelector('thead th:nth-child(2)');
    if (readingTh) readingTh.style.display = langCode === 'en' ? 'none' : '';

    vocabTableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="vocab-word">${esc(r.word)}</td>
        ${langCode !== 'en' ? '<td class="vocab-reading">' + esc(r.reading) + '</td>' : ''}
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
