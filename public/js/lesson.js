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

  // Vocab rows and reading map exposed for flashcards and feedback
  let vocabRows = [];
  let globalReadingMap = {};

  // Flashcard state
  let fcIdx = 0;

  const introScreen    = document.getElementById('intro-screen');
  const fcScreen       = document.getElementById('flashcard-screen');
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
  const feedbackBody   = document.getElementById('feedback-body');
  const continueBtn    = document.getElementById('continue-btn');
  const completionScreen = document.getElementById('completion-screen');

  async function init() {
    try {
      const res = await fetch(`/api/lesson/${lessonId}`);
      const data = await res.json();
      exercises = data.exercises || [];
      const lesson = data.lesson || {};

      if (lessonTitleEl) lessonTitleEl.textContent = lesson.title || '';

      // Grammar note — render as structured HTML
      if (lesson.grammar_note) {
        const sec = document.getElementById('grammar-note-section');
        const txt = document.getElementById('grammar-note-text');
        if (sec && txt) { txt.innerHTML = renderGrammarNote(lesson.grammar_note); sec.classList.remove('hidden'); }
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

  // ── Static reading fallbacks ──────────────────────────────────────────
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
    '一起':'yī qǐ','一下':'yī xià','一些':'yī xiē','一样':'yī yàng',
    // Colors & shapes (zh_extra3)
    '红色':'hóng sè','白色':'bái sè','黑色':'hēi sè','黄色':'huáng sè','绿色':'lǜ sè','蓝色':'lán sè',
    '红':'hóng','白':'bái','黑':'hēi','黄':'huáng','绿':'lǜ','蓝':'lán',
    '多':'duō','少':'shǎo','大的':'dà de','小的':'xiǎo de',
    // School & work (zh_extra3)
    '作业':'zuò yè','同学':'tóng xué','想':'xiǎng','能':'néng',
    '上班':'shàng bān','下班':'xià bān','上学':'shàng xué','下课':'xià kè',
    // Demonstratives & question
    '这':'zhè','那':'nà','哪':'nǎ','颜色':'yán sè',
    // Descriptions
    '可爱':'kě ài','漂亮':'piào liang','一点儿':'yī diǎnr',
    // Body
    '头':'tóu','手':'shǒu','脚':'jiǎo','眼睛':'yǎn jīng','耳朵':'ěr duo','嘴':'zuǐ','鼻子':'bí zi',
    // Extra common
    '帮':'bāng','游泳':'yóu yǒng','书包':'shū bāo','铅笔':'qiān bǐ',
    '学习':'xué xí','练习':'liàn xí','复习':'fù xí'
  };

  var JA_ROMAJI = {
    // Greetings & Politeness
    'おはようございます':'ohayou gozaimasu','おはよう':'ohayou','こんにちは':'konnichiwa',
    'こんばんは':'konbanwa','おやすみ':'oyasumi','おやすみなさい':'oyasumi nasai',
    'さようなら':'sayounara','またね':'mata ne','じゃあね':'jaa ne',
    'ありがとうございます':'arigatou gozaimasu','ありがとう':'arigatou',
    'どういたしまして':'douitashimashite','すみません':'sumimasen',
    'ごめんなさい':'gomen nasai','はい':'hai','いいえ':'iie',
    'どうぞ':'douzo','どうも':'doumo','よろしくおねがいします':'yoroshiku onegaishimasu',
    'はじめまして':'hajimemashite','おげんきですか':'ogenki desu ka',
    'げんきです':'genki desu','わかりました':'wakarimashita','わかりません':'wakarimasen',
    'そうです':'sou desu','ちがいます':'chigaimasu',
    // Numbers
    'いち':'ichi','に':'ni','さん':'san','し':'shi','ご':'go',
    'ろく':'roku','しち':'shichi','はち':'hachi','く':'ku','じゅう':'juu',
    'ひゃく':'hyaku','せん':'sen','まん':'man',
    // Animals & Nature
    'いぬ':'inu','ねこ':'neko','とり':'tori','さかな':'sakana','うま':'uma',
    'はな':'hana','き':'ki','やま':'yama','かわ':'kawa','うみ':'umi','そら':'sora',
    // Food & Drink
    'たべもの':'tabemono','のみもの':'nomimono','みず':'mizu','おちゃ':'ocha',
    'コーヒー':'koohii','ごはん':'gohan','パン':'pan','にく':'niku','やさい':'yasai',
    'すし':'sushi','ラーメン':'raamen','てんぷら':'tenpura','たまご':'tamago',
    'くだもの':'kudamono','りんご':'ringo','バナナ':'banana','みかん':'mikan',
    // Places
    'がっこう':'gakkou','かいしゃ':'kaisha','びょういん':'byouin','みせ':'mise',
    'レストラン':'resutoran','えき':'eki','くうこう':'kuukou','ホテル':'hoteru',
    'としょかん':'toshokan','ゆうびんきょく':'yuubinkyoku','ぎんこう':'ginkou',
    // Family
    'ちち':'chichi','はは':'haha','あに':'ani','あね':'ane','おとうと':'otouto',
    'いもうと':'imouto','そふ':'sofu','そぼ':'sobo','かぞく':'kazoku',
    'おとうさん':'otousan','おかあさん':'okaasan','おにいさん':'oniisan',
    'おねえさん':'oneesan','おとうとさん':'otoutosan','いもうとさん':'imoutosan',
    // People
    'ともだち':'tomodachi','せんせい':'sensei','がくせい':'gakusei',
    'わたし':'watashi','あなた':'anata','かれ':'kare','かのじょ':'kanojo',
    'かれら':'karera','わたしたち':'watashitachi',
    // Adjectives
    'たかい':'takai','ひくい':'hikui','おおきい':'ookii','ちいさい':'chiisai',
    'あたらしい':'atarashii','ふるい':'furui','たのしい':'tanoshii','むずかしい':'muzukashii',
    'おもしろい':'omoshiroi','つまらない':'tsumaranai','きれい':'kirei','きたない':'kitanai',
    'おいしい':'oishii','まずい':'mazui','あつい':'atsui','さむい':'samui',
    'やすい':'yasui','たのしい':'tanoshii','うれしい':'ureshii',
    'かなしい':'kanashii','こわい':'kowai','いそがしい':'isogashii',
    'げんき':'genki','しずか':'shizuka','にぎやか':'nigiyaka','べんり':'benri',
    // Verbs (dictionary form)
    'たべる':'taberu','のむ':'nomu','みる':'miru','きく':'kiku',
    'いく':'iku','くる':'kuru','かう':'kau','かえる':'kaeru',
    'はなす':'hanasu','よむ':'yomu','かく':'kaku','べんきょうする':'benkyou suru',
    'おきる':'okiru','ねる':'neru','しごとする':'shigoto suru',
    // Verbs (masu form)
    'たべます':'tabemasu','のみます':'nomimasu','いきます':'ikimasu','みます':'mimasu',
    'かいます':'kaimasu','かえります':'kaerimasu','おきます':'okimasu',
    'ねます':'nemasu','はなします':'hanashimasu','よみます':'yomimasu',
    'かきます':'kakimasu','べんきょうします':'benkyou shimasu','します':'shimasu',
    'きます':'kimasu','いらっしゃいます':'irasshaimasu',
    // Verbs (special)
    'いらっしゃいませ':'irasshaimase',
    // Time
    'きょう':'kyou','あした':'ashita','きのう':'kinou','あさ':'asa','ひる':'hiru','よる':'yoru',
    'いま':'ima','まえ':'mae','あと':'ato','まいにち':'mainichi','まいあさ':'maiasa',
    'まいばん':'maiban','らいしゅう':'raishuu','せんしゅう':'senshuu',
    'げつようび':'getsuyoubi','かようび':'kayoubi','すいようび':'suiyoubi',
    'もくようび':'mokuyoubi','きんようび':'kin-youbi','どようび':'doyoubi','にちようび':'nichiyoubi',
    // Countries & Language
    'にほん':'nihon','タイ':'tai','にほんご':'nihongo','えいご':'eigo','ちゅうごく':'chuugoku',
    // Pronouns & Demonstratives
    'これ':'kore','それ':'sore','あれ':'are','ここ':'koko','そこ':'soko','あそこ':'asoko',
    'この':'kono','その':'sono','あの':'ano',
    // Question words
    'なに':'nani','いつ':'itsu','どこ':'doko','だれ':'dare','どうして':'doushite',
    'いくら':'ikura','いくつ':'ikutsu','どう':'dou','どんな':'donna',
    // Common expressions
    'すき':'suki','きらい':'kirai','じょうず':'jouzu','へた':'heta',
    'からい':'karai','あまい':'amai','しょっぱい':'shoppai',
    // Particles (for vocab table)
    'は':'wa (topic)','が':'ga (subject)','を':'wo (object)','に':'ni (direction/time)','で':'de (place/means)',
    'も':'mo (also)','と':'to (and/with)','の':'no (possessive)','か':'ka (question)',
    // Shopping
    'おかいけい':'okaikei','いくらですか':'ikura desu ka','やすい':'yasui',
    // Grammar patterns (N4+)
    'たいです':'tai desu','かもしれません':'kamoshiremasen','とおもいます':'to omoimasu',
    'てもいいです':'temo ii desu','なければなりません':'nakereba narimasen',
    'けいけん':'keiken','きかい':'kikai','もくひょう':'mokuhyou','どりょく':'doryoku',
    // Business (N2+)
    'かねます':'kanemasu','さいわいです':'saiwai desu','おせわになっております':'osewa ni natte orimasu',
    // Colors — い-adjectives (ja_extra3)
    'あかい':'akai','しろい':'shiroi','くろい':'kuroi','きいろい':'kiiroi','あおい':'aoi',
    'みどり':'midori','みどりいろ':'midori iro',
    // Katakana loanwords (ja_extra3)
    'テレビ':'terebi','カメラ':'kamera','タクシー':'takushii','スーパー':'suupaa',
    'コンピューター':'konpyuutaa','バス':'basu','テスト':'tesuto','コンビニ':'konbini',
    'アイスクリーム':'aisu kuriimu','ジュース':'juusu','ミルク':'miruku',
    // Existence verbs
    'あります':'arimasu','います':'imasu',
    // Body parts
    'からだ':'karada','め':'me','て':'te','あし':'ashi','くち':'kuchi','かみ':'kami','みみ':'mimi',
    // Objects (classroom/daily)
    'ほん':'hon','えんぴつ':'enpitsu','かばん':'kaban','かぎ':'kagi',
    'つくえ':'tsukue','いす':'isu','にわ':'niwa','なか':'naka','うえ':'ue',
    // Time expressions
    'ごぜん':'gozen','ごご':'gogo','ちょうど':'choudo','じかん':'jikan','ごろ':'goro',
    // Planning/schedule
    'よてい':'yotei','やくそく':'yakusoku','ひま':'hima','あいます':'aimasu',
    // Sentence pattern words
    'がくせい':'gakusei','せんせい':'sensei',
    // Frequency
    'しゅう':'shuu','まいばん':'maiban','いっかい':'ikkai','さんかい':'sankai'
  };

  // ── Intro / Vocab table ─────────────────────────────────────────────
  function buildVocabTable(exs) {
    if (!vocabTableBody) return;
    const rows = [];
    const seenWords = new Set();
    // U+0E00-U+0E7F = Thai block
    const hasThai = s => { for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if (c >= 0x0E00 && c <= 0x0E7F) return true; } return false; };
    // U+3040-U+30FF = hiragana/katakana, U+4E00-U+9FFF = CJK — if hint has these, it's NOT romaji/pinyin
    const hasJpChar = s => { for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if ((c >= 0x3040 && c <= 0x30FF) || (c >= 0x4E00 && c <= 0x9FFF)) return true; } return false; };

    // Build reading lookup: static fallbacks first, lesson's translate hints override
    var readingMap = {};
    if (langCode === 'zh') { for (var k in ZH_PINYIN) readingMap[k] = ZH_PINYIN[k]; }
    if (langCode === 'ja') { for (var k in JA_ROMAJI) readingMap[k] = JA_ROMAJI[k]; }
    if (langCode !== 'en') {
      for (const ex of exs) {
        if (ex.type !== 'translate') continue;
        const w = String(ex.data.answer || '').trim();
        const h = String(ex.data.hint || '').trim();
        // Only store as reading if hint is romaji/pinyin (no Japanese/Chinese characters)
        if (w && h && !hasJpChar(h)) readingMap[w] = h;
      }
    }

    // Pass 1: translate exercises (word + reading + meaning explicit)
    for (const ex of exs) {
      if (ex.type !== 'translate') continue;
      const d = ex.data;
      const word = String(d.answer || '').trim();
      const meaning = String(d.prompt || '').trim();
      if (!word || word.length > 60 || meaning.length > 80) continue;
      if (langCode === 'ja' && word.includes(' ')) continue; // skip JA sentence-level entries
      if (seenWords.has(word)) continue;
      seenWords.add(word);
      rows.push({ word, reading: langCode === 'en' ? '' : (readingMap[word] || ''), meaning });
    }

    // Pass 2: match_pairs — add words not covered by translate
    for (const ex of exs) {
      if (ex.type !== 'match_pairs') continue;
      const pairs = (ex.data.pairs || []).map(p =>
        Array.isArray(p) ? { left: p[0], right: p[1] } : { left: p.left, right: p.right }
      );
      for (const p of pairs) {
        const word = String(p.left || '').trim();
        const meaning = String(p.right || '').trim();
        if (!word || !meaning) continue;
        if (!hasThai(meaning)) continue; // only show pairs that have Thai meaning
        if (seenWords.has(word)) continue;
        seenWords.add(word);
        rows.push({ word, reading: langCode === 'en' ? '' : (readingMap[word] || ''), meaning });
      }
    }

    // Expose for flashcards and feedback
    vocabRows = rows;
    globalReadingMap = readingMap;

    if (!rows.length) {
      vocabTableBody.closest('.vocab-section').classList.add('hidden');
      return;
    }

    const readingTh = document.getElementById('reading-th');
    if (readingTh) readingTh.style.display = langCode === 'en' ? 'none' : '';

    vocabTableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="vocab-word">
          <span class="vocab-word-cell">
            <span>${esc(r.word)}</span>
            <button class="speak-btn" data-word="${esc(r.word)}" title="ฟังเสียง">🔊</button>
          </span>
        </td>
        ${langCode !== 'en' ? '<td class="vocab-reading">' + esc(r.reading) + '</td>' : ''}
        <td class="vocab-meaning">${esc(r.meaning)}</td>
      </tr>
    `).join('');

    // Update start button label based on whether flashcards are available
    if (startBtn) startBtn.textContent = 'ศึกษาคำศัพท์ก่อนเริ่ม →';
  }

  function showIntro() {
    if (introScreen) introScreen.classList.remove('hidden');
    if (fcScreen) fcScreen.classList.add('hidden');
    if (exerciseArea) exerciseArea.classList.add('hidden');
    updateProgress();
  }

  // ── Flashcard Phase ──────────────────────────────────────────────────
  function startFlashcards() {
    if (!vocabRows.length) { startExercises(); return; }
    if (introScreen) introScreen.classList.add('hidden');
    if (fcScreen) fcScreen.classList.remove('hidden');
    fcIdx = 0;
    renderFlashcard();
  }

  function renderFlashcard() {
    const card = vocabRows[fcIdx];
    const isLast = fcIdx === vocabRows.length - 1;

    document.getElementById('fc-word').textContent = card.word;
    document.getElementById('fc-reading').textContent = card.reading || '';
    const fcSpeakBtn = document.getElementById('fc-speak-btn');
    if (fcSpeakBtn) fcSpeakBtn.dataset.word = card.word;

    const meaningEl = document.getElementById('fc-meaning');
    const dividerEl = document.getElementById('fc-divider');
    meaningEl.textContent = card.meaning;
    meaningEl.classList.add('hidden');
    dividerEl.classList.add('hidden');

    document.getElementById('fc-reveal-btn').classList.remove('hidden');
    document.getElementById('fc-next-btn').classList.add('hidden');
    document.getElementById('fc-done-btn').classList.add('hidden');

    const total = vocabRows.length;
    document.getElementById('fc-counter').textContent = `${fcIdx + 1} / ${total}`;
    document.getElementById('fc-prog-bar').style.width = `${(fcIdx / total) * 100}%`;

    const labels = { en: 'English', ja: '日本語', zh: '中文' };
    document.getElementById('fc-lang-label').textContent = labels[langCode] || langCode.toUpperCase();

    const tipEl = document.getElementById('fc-tip');
    if (card.reading && langCode === 'zh') tipEl.textContent = `พินอิน: ${card.reading}`;
    else if (card.reading && langCode === 'ja') tipEl.textContent = `โรมาจิ: ${card.reading}`;
    else tipEl.textContent = '';
  }

  document.getElementById('fc-reveal-btn')?.addEventListener('click', () => {
    document.getElementById('fc-meaning').classList.remove('hidden');
    document.getElementById('fc-divider').classList.remove('hidden');
    document.getElementById('fc-reveal-btn').classList.add('hidden');
    const isLast = fcIdx === vocabRows.length - 1;
    if (isLast) {
      document.getElementById('fc-done-btn').classList.remove('hidden');
    } else {
      document.getElementById('fc-next-btn').classList.remove('hidden');
    }
  });

  document.getElementById('fc-next-btn')?.addEventListener('click', () => {
    fcIdx++;
    if (fcIdx < vocabRows.length) renderFlashcard();
    else startExercises();
  });

  document.getElementById('fc-done-btn')?.addEventListener('click', startExercises);
  document.getElementById('fc-skip-btn')?.addEventListener('click', startExercises);

  function startExercises() {
    if (introScreen) introScreen.classList.add('hidden');
    if (fcScreen) fcScreen.classList.add('hidden');
    if (exerciseArea) exerciseArea.classList.remove('hidden');
    document.body.classList.add('exercise-mode');
    window.scrollTo(0, 0);
    renderExercise();
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (vocabRows.length > 0) startFlashcards();
      else startExercises();
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
    feedbackHeader.innerHTML = `<span id="feedback-icon">${correct ? '✓' : '✗'}</span><span id="feedback-text">${correct ? 'ถูกต้อง!' : 'ยังไม่ถูก'}</span>`;
    let bodyHtml = '';
    if (!correct && correctAnswer) {
      bodyHtml += `<div class="fb-answer">คำตอบ: <strong>${esc(correctAnswer)}</strong><button class="speak-btn fb-speak-btn" data-word="${esc(correctAnswer)}" title="ฟังเสียง">🔊</button></div>`;
      if (langCode !== 'en') {
        const reading = globalReadingMap[correctAnswer];
        if (reading) bodyHtml += `<div class="fb-reading">${esc(reading)}</div>`;
      }
    }
    if (feedbackBody) feedbackBody.innerHTML = bodyHtml;
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
    document.getElementById('result-xp').textContent      = `XP ที่ได้: +${xpEarned} (รวม ${totalXp} XP)`;
    document.getElementById('result-streak').textContent  = `Streak: ${streak} วัน`;
    document.getElementById('result-level').textContent   = `Level: ${level}`;
    document.getElementById('back-learn-btn').href        = `/learn/${langCode}`;
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function normalize(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }
  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Text-to-Speech ────────────────────────────────────────────────────
  function speak(text, lang) {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;

    // Chrome can get stuck in paused state
    if (synth.paused) synth.resume();

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'ja' ? 'ja-JP' : lang === 'zh' ? 'zh-CN' : 'en-US';
      utter.rate = 0.85;
      synth.speak(utter);
    };

    // Chrome bug: cancel() + immediate speak() = silent. Wait 100ms after cancel.
    if (synth.speaking) {
      synth.cancel();
      setTimeout(doSpeak, 100);
    } else {
      doSpeak();
    }
  }

  // Delegated TTS click handler for vocab table and feedback panel
  vocabTableBody && vocabTableBody.addEventListener('click', e => {
    const btn = e.target.closest('.speak-btn');
    if (btn) speak(btn.dataset.word, langCode);
  });
  feedbackBody && feedbackBody.addEventListener('click', e => {
    const btn = e.target.closest('.speak-btn');
    if (btn) speak(btn.dataset.word, langCode);
  });
  document.getElementById('fc-speak-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('fc-speak-btn');
    if (btn && btn.dataset.word) speak(btn.dataset.word, langCode);
  });

  // Convert raw grammar note text (bullet `•`, `①②③` sections) to structured HTML
  function renderGrammarNote(text) {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    for (const line of lines) {
      const t = line.trim();
      if (!t) { html += '<div class="gn-spacer"></div>'; continue; }
      if (t.startsWith('•')) {
        html += `<div class="gn-item"><span class="gn-dot">▸</span><span class="gn-item-text">${esc(t.slice(1).trim())}</span></div>`;
      } else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(t) || (t.endsWith(':') && t.length < 60 && !t.startsWith(' '))) {
        html += `<div class="gn-header">${esc(t)}</div>`;
      } else {
        html += `<div class="gn-text">${esc(t)}</div>`;
      }
    }
    return html;
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
