(function () {
  const page = document.getElementById('placement-page');
  if (!page) return;
  const lang = page.dataset.lang || PT_LANG;

  // ── Question banks ─────────────────────────────────────────────────────
  const BANKS = {
    en: [
      // A1 (3 questions)
      { level: 'A1', q: '"Hello" แปลว่าอะไร?', opts: ['สวัสดี', 'ลาก่อน', 'ขอบคุณ', 'ขอโทษ'], ans: 0 },
      { level: 'A1', q: 'เลือกตัวเลขที่ถูกต้อง: 5', opts: ['three', 'four', 'five', 'six'], ans: 2 },
      { level: 'A1', q: 'The cat ___ small.', opts: ['am', 'is', 'are', 'be'], ans: 1 },
      // A2 (3 questions)
      { level: 'A2', q: '"Yesterday I ___ to school."', opts: ['go', 'goes', 'went', 'going'], ans: 2 },
      { level: 'A2', q: 'Plural ของ "box" คืออะไร?', opts: ['boxs', 'boxen', 'boxes', 'box'], ans: 2 },
      { level: 'A2', q: '"I ___ coffee every morning." (นิสัย)', opts: ['drink', 'am drinking', 'drank', 'drunk'], ans: 0 },
      // B1 (3 questions)
      { level: 'B1', q: '"She has lived here ___ 5 years."', opts: ['since', 'for', 'during', 'while'], ans: 1 },
      { level: 'B1', q: '"The film was ___ boring I fell asleep."', opts: ['very', 'too', 'so', 'such'], ans: 2 },
      { level: 'B1', q: '"If it rains tomorrow, I ___ stay home."', opts: ['will', 'would', 'had', 'am'], ans: 0 },
      // B2 (3 questions)
      { level: 'B2', q: '"Despite ___ tired, she continued working."', opts: ['to be', 'being', 'been', 'be'], ans: 1 },
      { level: 'B2', q: '"The project ___ by next Friday." (ให้ถูกต้อง)', opts: ['will complete', 'will have been completed', 'completes', 'completed'], ans: 1 },
      { level: 'B2', q: '"She regrets ___ the opportunity."', opts: ['miss', 'to miss', 'missing', 'missed'], ans: 2 },
      // C1 (3 questions)
      { level: 'C1', q: '"The new policy is ___." (คลุมเครือ ตีความได้หลายทาง)', opts: ['ambiguous', 'ambivalent', 'ambidextrous', 'arbitrary'], ans: 0 },
      { level: 'C1', q: '"He beat around the ___." (idiom)', opts: ['tree', 'bush', 'grass', 'field'], ans: 1 },
      { level: 'C1', q: '"___ the economic challenges, the company managed to thrive."', opts: ['Despite', 'Although', 'Notwithstanding', 'Nevertheless'], ans: 2 },
    ],
    ja: [
      // N5 (5 questions)
      { level: 'N5', q: '"あ" อ่านว่าอะไร?', opts: ['i', 'u', 'a', 'e'], ans: 2 },
      { level: 'N5', q: '"おはようございます" ใช้เมื่อไหร่?', opts: ['กลางคืน', 'ตอนเช้า', 'กลางวัน', 'ลาก่อน'], ans: 1 },
      { level: 'N5', q: '"七" (なな) คือเลขอะไร?', opts: ['5', '6', '7', '8'], ans: 2 },
      { level: 'N5', q: '"おいしい" แปลว่าอะไร?', opts: ['สวย', 'อร่อย', 'แพง', 'ใหญ่'], ans: 1 },
      { level: 'N5', q: '"わたしは がくせい ___。" เติมอะไร?', opts: ['が', 'は', 'を', 'です'], ans: 3 },
      // N4 (5 questions)
      { level: 'N4', q: '"たべる" → ます-form คืออะไร?', opts: ['たべます', 'たべる', 'たべない', 'たべて'], ans: 0 },
      { level: 'N4', q: 'Particle อะไรแสดง Object ของกริยา?', opts: ['は', 'が', 'を', 'で'], ans: 2 },
      { level: 'N4', q: '"がっこうに いきます" หมายความว่า?', opts: ['เรียนที่โรงเรียน', 'ไปโรงเรียน', 'อยู่ที่โรงเรียน', 'ออกจากโรงเรียน'], ans: 1 },
      { level: 'N4', q: '"みる" (Group 2) → ます-form?', opts: ['みます', 'みいます', 'みります', 'みつます'], ans: 0 },
      { level: 'N4', q: '"て-form" ของ "たべる" คืออะไร?', opts: ['たべて', 'たべる', 'たべた', 'たべない'], ans: 0 },
      // N3 (5 questions)
      { level: 'N3', q: '"すしを たべたい" หมายความว่า?', opts: ['กินซูชิ', 'อยากกินซูชิ', 'กินซูชิแล้ว', 'ไม่กินซูชิ'], ans: 1 },
      { level: 'N3', q: '"はいって もいいですか?" คือการทำอะไร?', opts: ['ขอโทษ', 'ขออนุญาต', 'ขอบคุณ', 'บอกทาง'], ans: 1 },
      { level: 'N3', q: '"いらっしゃる" คือ Keigo ของคำว่าอะไร?', opts: ['たべる', 'いく', 'いる/くる/いく', 'する'], ans: 2 },
      { level: 'N3', q: '"〜から" ในประโยค "あめだから、いえにいます" หมายความว่า?', opts: ['ถึงแม้ว่า', 'เพราะว่า', 'ถ้าว่า', 'เมื่อ'], ans: 1 },
      { level: 'N3', q: '"申す" คือ Keigo รูปแบบใด?', opts: ['尊敬語', '謙譲語', '丁寧語', 'ปกติ'], ans: 1 },
    ],
    zh: [
      // HSK1 (4 questions)
      { level: 'HSK1', q: '"你好" อ่านว่าอะไร?', opts: ['wǒ hǎo', 'nǐ hǎo', 'tā hǎo', 'hǎo nǐ'], ans: 1 },
      { level: 'HSK1', q: '"三" คือเลขอะไร?', opts: ['1', '2', '3', '4'], ans: 2 },
      { level: 'HSK1', q: '"谢谢" แปลว่าอะไร?', opts: ['ขอโทษ', 'สวัสดี', 'ขอบคุณ', 'ไม่เป็นไร'], ans: 2 },
      { level: 'HSK1', q: '"水" อ่านว่าอะไร?', opts: ['huǒ', 'shuǐ', 'shān', 'rén'], ans: 1 },
      // HSK2 (3 questions)
      { level: 'HSK2', q: '"的" ในประโยค "我的书" ทำหน้าที่อะไร?', opts: ['กริยา', 'แสดงความเป็นเจ้าของ', 'คำถาม', 'ปฏิเสธ'], ans: 1 },
      { level: 'HSK2', q: '"我在吃饭" หมายความว่า?', opts: ['ฉันกินข้าว(ปกติ)', 'ฉันกำลังกินข้าวอยู่', 'ฉันกินข้าวแล้ว', 'ฉันจะกินข้าว'], ans: 1 },
      { level: 'HSK2', q: '"今天" แปลว่าอะไร?', opts: ['เมื่อวาน', 'วันนี้', 'พรุ่งนี้', 'ทุกวัน'], ans: 1 },
      // HSK3 (4 questions)
      { level: 'HSK3', q: '"苹果比香蕉贵" หมายความว่า?', opts: ['แอปเปิ้ลราคาเท่ากับกล้วย', 'แอปเปิ้ลแพงกว่ากล้วย', 'กล้วยแพงกว่าแอปเปิ้ล', 'ทั้งคู่ราคาเท่ากัน'], ans: 1 },
      { level: 'HSK3', q: 'เติม 量词: 一___书', opts: ['个', '本', '杯', '张'], ans: 1 },
      { level: 'HSK3', q: '"多少钱?" ใช้เพื่อ?', opts: ['ถามเวลา', 'ถามราคา', 'ถามจำนวน', 'ถามสถานที่'], ans: 1 },
      // HSK4 (4 questions)
      { level: 'HSK4', q: '"马到成功" เป็นสำนวนประเภทใด?', opts: ['คำถาม', '成语', 'Particle', 'คำปฏิเสธ'], ans: 1 },
      { level: 'HSK4', q: '"虽然...但是..." ใช้แสดงความสัมพันธ์แบบไหน?', opts: ['เหตุและผล', 'ยกเว้น/แม้ว่า-แต่', 'เงื่อนไข', 'เวลา'], ans: 1 },
      { level: 'HSK4', q: '"书被他拿走了" เป็นโครงสร้างอะไร?', opts: ['把-structure', '被-passive', 'คำถาม', 'Measure word'], ans: 1 },
    ],
  };

  // Level ordering and descriptions
  const LEVELS = {
    en: ['A1', 'A2', 'B1', 'B2', 'C1'],
    ja: ['N5', 'N4', 'N3'],
    zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4'],
  };

  const LEVEL_DESC = {
    A1: 'ผู้เริ่มต้น — เริ่มจากคำศัพท์และประโยคง่ายๆ',
    A2: 'ขั้นต้น — รู้คำศัพท์พื้นฐาน เข้าใจประโยคง่ายๆ',
    B1: 'ระดับกลาง — สื่อสารในชีวิตประจำวันได้',
    B2: 'ระดับกลางบน — พูดคุยเรื่องหลากหลาย เข้าใจไวยากรณ์ซับซ้อน',
    C1: 'ขั้นสูง — ใช้ภาษาได้คล่องแคล่ว เข้าใจสำนวนและ nuance',
    N5: 'ผู้เริ่มต้น — รู้จักฮิรางานะ คาตากานะ และคำพื้นฐาน',
    N4: 'ขั้นต้น — เข้าใจประโยคพื้นฐาน กริยา particles',
    N3: 'ระดับกลาง — สนทนาได้ เข้าใจ Keigo เบื้องต้น',
    HSK1: 'ผู้เริ่มต้น — รู้ตัวอักษรพื้นฐานและคำทักทาย',
    HSK2: 'ขั้นต้น — สื่อสารเรื่องง่ายๆ ในชีวิตประจำวัน',
    HSK3: 'ระดับกลาง — พูดคุยเรื่องทั่วไป เข้าใจโครงสร้างพื้นฐาน',
    HSK4: 'ระดับสูง — สนทนาเรื่องซับซ้อน สำนวนและธุรกิจ',
  };

  const LANG_NAMES = { en: '🇬🇧 English', ja: '🇯🇵 Japanese', zh: '🇨🇳 Chinese' };

  // Set lang title
  const titleEl = document.getElementById('pt-lang-title');
  if (titleEl) titleEl.textContent = `Placement Test — ${LANG_NAMES[lang] || lang}`;

  const questions = BANKS[lang] || [];
  let current = 0;
  let correct = 0;
  let lastCorrectIdx = -1;

  const startScreen = document.getElementById('pt-start');
  const quizScreen = document.getElementById('pt-quiz');
  const resultScreen = document.getElementById('pt-result');
  const ptBar = document.getElementById('pt-bar');
  const ptCounter = document.getElementById('pt-counter');
  const ptLevelTag = document.getElementById('pt-level-tag');
  const ptQuestion = document.getElementById('pt-question');
  const ptOptions = document.getElementById('pt-options');

  document.getElementById('pt-start-btn').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
  });

  document.getElementById('pt-retry').addEventListener('click', () => {
    current = 0; correct = 0; lastCorrectIdx = -1;
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
  });

  function showQuestion() {
    if (current >= questions.length) { showResult(); return; }
    const q = questions[current];
    const pct = Math.round((current / questions.length) * 100);
    ptBar.style.width = pct + '%';
    ptCounter.textContent = `${current + 1} / ${questions.length}`;
    ptLevelTag.textContent = q.level;
    ptLevelTag.className = `pt-level-tag pt-level-tag--${q.level.toLowerCase().replace(/\s/g, '')}`;
    ptQuestion.textContent = q.q;
    ptOptions.innerHTML = q.opts.map((opt, i) =>
      `<button class="pt-opt" data-idx="${i}">${opt}</button>`
    ).join('');
    ptOptions.querySelectorAll('.pt-opt').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.idx)));
    });
  }

  function selectAnswer(idx) {
    const q = questions[current];
    const btns = ptOptions.querySelectorAll('.pt-opt');
    btns.forEach(b => b.disabled = true);
    btns[q.ans].classList.add('pt-opt--correct');
    if (idx === q.ans) {
      correct++;
      lastCorrectIdx = current;
      btns[idx].classList.add('pt-opt--correct');
    } else {
      btns[idx].classList.add('pt-opt--wrong');
    }
    setTimeout(() => { current++; showQuestion(); }, 900);
  }

  function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Determine level from score
    const levels = LEVELS[lang] || ['A1'];
    const total = questions.length;
    const pct = total ? correct / total : 0;
    let levelIdx;
    if (pct >= 0.87) levelIdx = levels.length - 1;
    else if (pct >= 0.70) levelIdx = Math.min(levels.length - 2, Math.floor(pct * levels.length));
    else if (pct >= 0.50) levelIdx = Math.max(0, Math.floor(pct * levels.length) - 1);
    else if (pct >= 0.25) levelIdx = Math.max(0, Math.floor(pct * (levels.length - 1)));
    else levelIdx = 0;

    // Also cap based on last question answered correctly
    const levelByQ = Math.floor((lastCorrectIdx / questions.length) * levels.length);
    levelIdx = Math.min(levelIdx, Math.max(0, levelByQ));

    const recommendedLevel = levels[levelIdx] || levels[0];

    document.getElementById('pt-result-level').textContent = recommendedLevel;
    document.getElementById('pt-result-desc').textContent = LEVEL_DESC[recommendedLevel] || '';
    document.getElementById('pt-result-score').textContent = `ตอบถูก ${correct} จาก ${total} ข้อ (${Math.round(pct * 100)}%)`;

    const goBtn = document.getElementById('pt-go-learn');
    goBtn.href = `/learn/${lang}`;
    goBtn.textContent = `เริ่มเรียนระดับ ${recommendedLevel} →`;

    localStorage.setItem(`vs_placement_${lang}`, recommendedLevel);
  }
})();
