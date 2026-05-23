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

  let matchPairs = [];
  let matchUserPairs = new Map();    // leftIdx → rightIdx
  let matchRightAssigned = new Map(); // rightIdx → leftIdx
  let matchSelectedLeft = null;
  let matchRightsOrder = [];

  // Vocab rows and reading map exposed for flashcards and feedback
  let vocabRows = [];
  let globalReadingMap = {};

  // Flashcard state
  let fcIdx = 0;

  // Lives / combo / wrong-answer review
  let lives = 3;
  let combo = 0;
  let maxCombo = 0;
  let wrongAnswers = [];

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
    // Maternal grandparents (zh base)
    '外公':'wài gōng','外婆':'wài pó',
    // Extra common
    '帮':'bāng','游泳':'yóu yǒng','书包':'shū bāo','铅笔':'qiān bǐ',
    '学习':'xué xí','练习':'liàn xí','复习':'fù xí',
    // Daily routines (zh_extra)
    '吃饭':'chī fàn','睡觉':'shuì jiào','起床':'qǐ chuáng',
    // Home (zh_extra)
    '房间':'fáng jiān','厨房':'chú fáng','卫生间':'wèi shēng jiān',
    // Restaurant (zh_extra)
    '菜单':'cài dān','服务员':'fú wù yuán','买单':'mǎi dān','好吃':'hǎo chī',
    // Classifiers (zh_extra)
    '条':'tiáo','个':'gè',
    // Grammar markers (zh_extra)
    '把':'bǎ','了':'le','过':'guò',
    // Connectors (zh_extra)
    '如果...就...':'rú guǒ...jiù...','因为...所以...':'yīn wèi...suǒ yǐ...',
    '虽然...但是...':'suī rán...dàn shì','尽管...还是':'jǐn guǎn...hái shì',
    '宁可...也不':'nìng kě...yě bù','既然':'jì rán',
    // Chengyu (zh_extra)
    '马到成功':'mǎ dào chéng gōng','一石二鸟':'yī shí èr niǎo',
    '半途而废':'bàn tú ér fèi','活到老学到老':'huó dào lǎo xué dào lǎo',
    // Formal / work (zh_extra)
    '您好':'nín hǎo','请问':'qǐng wèn','合同':'hé tóng','会议':'huì yì','不得不':'bù dé bù',
    // HSK5/6 (zh_extra2)
    '与其...不如':'yǔ qí...bù rú','既然...就':'jì rán...jiù',
    '之所以...是因为':'zhī suǒ yǐ...shì yīn wèi',
    '据报道':'jù bào dào','舆论':'yú lùn','可持续':'kě chí xù','下行压力':'xià háng yā lì',
    '综上所述':'zōng shàng suǒ shù','诚然':'chéng rán','反之':'fǎn zhī','鉴于':'jiàn yú',
    '不可思议':'bù kě sī yì','实事求是':'shí shì qiú shì',
    '与时俱进':'yǔ shí jù jìn','无可厚非':'wú kě hòu fēi',
    '不失为':'bù shī wéi','毋庸置疑':'wú yōng zhì yí',
    '言简意赅':'yán jiǎn yì gāi','姑且不论':'gū qiě bù lùn',
    '曲折':'qū zhé','沧桑':'cāng sāng','字里行间':'zì lǐ háng jiān','苦中作乐':'kǔ zhōng zuò lè',
    // Phrases from zh_extra3
    '大红花':'dà hóng huā','小白猫':'xiǎo bái māo',
    '黑色的车':'hēi sè de chē','黄色的大书':'huáng sè de dà shū',
    // Transport & directions (zh_extra4)
    '公共汽车':'gōng gòng qì chē','出租车':'chū zū chē','高铁':'gāo tiě',
    '左转':'zuǒ zhuǎn','一直走':'yī zhí zǒu','对面':'duì miàn',
    '然后':'rán hòu','路口':'lù kǒu','星期天':'xīng qī tiān','怎么样':'zěn me yàng',
    // Sports & hobbies (zh_extra4)
    '踢足球':'tī zú qiú','打篮球':'dǎ lán qiú','打乒乓球':'dǎ pīng pāng qiú',
    '听音乐':'tīng yīn yuè','画画':'huà huà','弹钢琴':'tán gāng qín',
    '好主意':'hǎo zhǔ yì','更喜欢':'gèng xǐ huān',
    // Resultative verbs & connectors (zh_extra4)
    '做好':'zuò hǎo','买到':'mǎi dào','除了...还':'chú le...hái'
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
    'しゅう':'shuu','まいばん':'maiban','いっかい':'ikkai','さんかい':'sankai',
    // Alternate number readings (ja base)
    'なな':'nana','よん':'yon','きゅう':'kyuu',
    // Katakana individual chars (ja_extra3)
    'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
    // Missing demonstratives / question words
    'どれ':'dore',
    // Body parts not yet mapped
    'あたま':'atama',
    // Time approximation
    '～ごろ':'~goro',
    // Direction kanji (ja_extra4)
    '上':'ue','下':'shita','左':'hidari','中':'naka',
    // Day element kanji + reading pairs (ja_extra4)
    '月 (月曜日)':'tsuki (getsuyoubi)','火 (火曜日)':'hi (kayoubi)',
    '木 (木曜日)':'ki (mokuyoubi)','土 (土曜日)':'tsuchi (doyoubi)',
    // N2 vocabulary (ja_extra4)
    '普及':'fukyuu','移住':'ijuu','検討':'kentou','慎重':'shinchou',
    // N1/N2 grammar patterns (ja_extra2)
    'にもかかわらず':'ni mo kakawarazu','に反して':'ni han shite',
    'に加えて':'ni kuwaete','をめぐって':'wo megutte',
    'に際して':'ni saishite','を契機に':'wo keiki ni',
    'に基づいて':'ni motozuite','とともに':'to tomo ni',
    'いかんにかかわらず':'ikan ni kakawarazu','をもって':'wo motte',
    'ならでは':'nara dewa','に足る':'ni taru',
    '建前':'tatemae','本音':'honne','忖度':'sontaku','侘び寂び':'wabi-sabi',
    'に先立って':'ni sakidatte','をよそに':'wo yoso ni',
    'ともなると':'to mo naru to','かたわら':'katawara'
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

    if (startBtn) startBtn.textContent = 'เริ่มทำแบบทดสอบ →';
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
    // Reset game state
    lives = 3; combo = 0; maxCombo = 0; wrongAnswers = [];
    const heartsEl = document.getElementById('hearts-display');
    if (heartsEl) heartsEl.classList.remove('hidden');
    updateHeartsDisplay();
    renderExercise();
  }

  if (startBtn) {
    startBtn.addEventListener('click', startExercises);
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
    matchPairs = [];
    matchUserPairs = new Map();
    matchRightAssigned = new Map();
    matchSelectedLeft = null;
    matchRightsOrder = [];
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
    const origCorrectIdx = parseInt(d.correct_index !== undefined ? d.correct_index : d.correct);
    const correctText = d.options[origCorrectIdx];
    const shuffledOpts = shuffle([...d.options]);
    const newCorrectIdx = shuffledOpts.indexOf(correctText);
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    answerArea.innerHTML = `<div class="mc-options">${shuffledOpts.map((o, i) =>
      `<button class="mc-option" data-idx="${i}"><span class="mc-num">${i+1}</span>${esc(o)}</button>`
    ).join('')}</div>`;
    answerArea.dataset.correctIdx = newCorrectIdx;
    answerArea.dataset.correctText = correctText;
    answerArea.dataset.prompt = prompt;
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
    const correctIdx = parseInt(answerArea.dataset.correctIdx);
    const correctText = answerArea.dataset.correctText;
    const prompt = answerArea.dataset.prompt || '';
    const correct = parseInt(userAnswer) === correctIdx;
    if (correct) score++;
    showFeedback(correct, correctText, prompt);
    answerArea.querySelectorAll('.mc-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      else if (String(i) === String(userAnswer)) btn.classList.add('wrong');
    });
  }

  // ── Fill Blank ───────────────────────────────────────────────────────
  function renderFillBlank(ex) {
    const d = ex.data;
    if (d.options && d.options.length) {
      const prompt = d.sentence || d.prompt || '';
      exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
      const origCorrectIdx = parseInt(d.correct_index !== undefined ? d.correct_index : d.correct);
      const correctText = d.options[origCorrectIdx];
      const shuffledOpts = shuffle([...d.options]);
      const newCorrectIdx = shuffledOpts.indexOf(correctText);
      answerArea.innerHTML = `<div class="mc-options">${shuffledOpts.map((o, i) =>
        `<button class="mc-option" data-idx="${i}"><span class="mc-num">${i+1}</span>${esc(o)}</button>`
      ).join('')}</div>`;
      answerArea.dataset.correctIdx = newCorrectIdx;
      answerArea.dataset.correctText = correctText;
      answerArea.dataset.prompt = prompt;
      answerArea.querySelectorAll('.mc-option').forEach(btn => {
        btn.addEventListener('click', () => {
          answerArea.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          userAnswer = btn.dataset.idx;
          checkBtn.disabled = false;
        });
      });
    } else {
      const prompt = d.prompt || d.sentence || '';
      exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
      answerArea.innerHTML = `<input id="fill-input" class="translate-input" type="text" placeholder="พิมพ์คำตอบ... (Enter เพื่อตรวจ)" autocomplete="off" />`;
      const inp = document.getElementById('fill-input');
      inp.focus();
      inp.addEventListener('input', () => { userAnswer = inp.value.trim(); checkBtn.disabled = !userAnswer; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !checkBtn.disabled && !checked) doCheck(); });
    }
  }

  function checkFillBlank(ex) {
    const d = ex.data;
    if (d.options && d.options.length) {
      const correctIdx = parseInt(answerArea.dataset.correctIdx);
      const correctText = answerArea.dataset.correctText;
      const prompt = answerArea.dataset.prompt || '';
      const correct = parseInt(userAnswer) === correctIdx;
      if (correct) score++;
      showFeedback(correct, correctText, prompt);
      answerArea.querySelectorAll('.mc-option').forEach((btn, i) => {
        btn.disabled = true;
        if (i === correctIdx) btn.classList.add('correct');
        else if (String(i) === String(userAnswer)) btn.classList.add('wrong');
      });
    } else {
      const correct = normalize(userAnswer) === normalize(d.answer);
      if (correct) score++;
      const prompt = d.prompt || d.sentence || '';
      showFeedback(correct, d.answer, prompt);
      const inp = document.getElementById('fill-input');
      if (inp) inp.disabled = true;
    }
  }

  // ── Word Order ───────────────────────────────────────────────────────
  function renderWordOrder(ex) {
    const d = ex.data;
    const prompt = d.prompt || d.instruction || '';
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    const shuffled = d.words.slice().sort(() => Math.random() - 0.5);
    answerArea.innerHTML = `
      <div id="answer-slots" class="answer-slots"></div>
      <div id="word-bank" class="word-bank">${shuffled.map((w, i) =>
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
    const prompt = ex.data.translation || ex.data.instruction || '';
    showFeedback(correct, ex.data.answer, prompt);
    document.querySelectorAll('.word-chip, .answer-chip').forEach(b => b.disabled = true);
  }

  // ── Translate ────────────────────────────────────────────────────────
  function renderTranslate(ex) {
    const d = ex.data;
    const prompt = d.prompt || '';
    const hint = d.hint ? `<div class="ex-hint">${esc(d.hint)}</div>` : '';
    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>${hint}`;
    answerArea.innerHTML = `<textarea id="translate-input" class="translate-input" rows="2" placeholder="พิมพ์คำแปล... (Enter เพื่อตรวจ)"></textarea>`;
    const inp = document.getElementById('translate-input');
    inp.focus();
    inp.addEventListener('input', () => { userAnswer = inp.value.trim(); checkBtn.disabled = !userAnswer; });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !checkBtn.disabled && !checked) { e.preventDefault(); doCheck(); }
    });
  }

  function checkTranslate(ex) {
    const d = ex.data;
    const answers = [d.answer, ...(d.alternatives || [])].filter(Boolean);
    const correct = answers.some(a => normalize(userAnswer) === normalize(a));
    if (correct) score++;
    showFeedback(correct, d.answer, d.prompt || '');
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
    matchUserPairs = new Map();
    matchRightAssigned = new Map();
    matchSelectedLeft = null;
    matchRightsOrder = shuffle(matchPairs.map((_, i) => i));

    exerciseCard.innerHTML = `<div class="ex-prompt">${esc(prompt)}</div>`;
    renderMatchGrid();
    userAnswer = null;
    checkBtn.disabled = true;
  }

  function renderMatchGrid() {
    const leftHtml = matchPairs.map((p, i) => {
      const paired = matchUserPairs.has(i);
      const colorCls = paired ? ` match-color-${matchUserPairs.get(i) % 6}` : '';
      const selCls = matchSelectedLeft === i ? ' selected' : '';
      return `<button class="match-item match-left${colorCls}${selCls}" data-side="left" data-idx="${i}">${esc(p.left)}</button>`;
    }).join('');

    const rightHtml = matchRightsOrder.map(ri => {
      const paired = matchRightAssigned.has(ri);
      const colorCls = paired ? ` match-color-${ri % 6}` : '';
      return `<button class="match-item match-right${colorCls}" data-side="right" data-idx="${ri}">${esc(matchPairs[ri].right)}</button>`;
    }).join('');

    answerArea.innerHTML = `<div class="match-cols">
      <div class="match-col" id="match-left">${leftHtml}</div>
      <div class="match-col" id="match-right">${rightHtml}</div>
    </div>`;

    answerArea.querySelectorAll('.match-item[data-side="left"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.idx);
        matchSelectedLeft = (matchSelectedLeft === i) ? null : i;
        renderMatchGrid();
      });
    });
    answerArea.querySelectorAll('.match-item[data-side="right"]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (matchSelectedLeft === null) return;
        const i = matchSelectedLeft;
        const j = parseInt(btn.dataset.idx);
        // Unlink old right from this left
        if (matchUserPairs.has(i)) matchRightAssigned.delete(matchUserPairs.get(i));
        // Unlink old left from this right
        if (matchRightAssigned.has(j)) matchUserPairs.delete(matchRightAssigned.get(j));
        matchUserPairs.set(i, j);
        matchRightAssigned.set(j, i);
        matchSelectedLeft = null;
        renderMatchGrid();
        checkBtn.disabled = matchUserPairs.size < matchPairs.length;
        if (matchUserPairs.size === matchPairs.length) userAnswer = 'ready';
      });
    });
  }

  function checkMatchPairs() {
    const wrongPairs = [];
    matchUserPairs.forEach((rightIdx, leftIdx) => {
      if (leftIdx !== rightIdx) wrongPairs.push(`${matchPairs[leftIdx].left} → ${matchPairs[leftIdx].right}`);
    });
    const allCorrect = wrongPairs.length === 0;
    if (allCorrect) score++;

    // Mark correct / wrong visually
    answerArea.querySelectorAll('.match-item[data-side="left"]').forEach(btn => {
      btn.disabled = true;
      const li = parseInt(btn.dataset.idx);
      btn.classList.remove('selected');
      if (matchUserPairs.has(li)) btn.classList.add(li === matchUserPairs.get(li) ? 'matched' : 'match-wrong');
    });
    answerArea.querySelectorAll('.match-item[data-side="right"]').forEach(btn => {
      btn.disabled = true;
      const ri = parseInt(btn.dataset.idx);
      btn.classList.remove('selected');
      if (matchRightAssigned.has(ri)) btn.classList.add(ri === matchRightAssigned.get(ri) ? 'matched' : 'match-wrong');
    });

    const correctAnswer = wrongPairs.length > 0 ? wrongPairs.join(' | ') : '';
    showFeedback(allCorrect, correctAnswer, 'จับคู่คำศัพท์');
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

  const correctMessages = ['ถูกต้อง! 🎉', 'เยี่ยมมาก! ✨', 'ใช่เลย! 🔥', 'สุดยอด! 💪', 'Perfect! ⭐'];
  const wrongMessages  = ['ยังไม่ถูก', 'ลองใหม่นะ', 'เกือบแล้ว!', 'จำไว้เลย!'];

  function showFeedback(correct, correctAnswer, promptText) {
    // Update lives & combo
    if (!correct) {
      lives = Math.max(0, lives - 1);
      updateHeartsDisplay();
      if (promptText && correctAnswer) {
        wrongAnswers.push({ prompt: promptText, correctAnswer });
      }
    }
    updateComboDisplay(correct);

    feedbackPanel.className = 'show ' + (correct ? 'correct' : 'wrong');
    const msg = correct
      ? correctMessages[Math.floor(Math.random() * correctMessages.length)]
      : wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    feedbackHeader.innerHTML = `<span id="feedback-icon">${correct ? '✓' : '✗'}</span><span id="feedback-text">${msg}</span>`;

    let bodyHtml = '';
    if (!correct && correctAnswer) {
      bodyHtml += `<div class="fb-answer">คำตอบที่ถูก: <strong>${esc(correctAnswer)}</strong><button class="speak-btn fb-speak-btn" data-word="${esc(correctAnswer)}" title="ฟังเสียง">🔊</button></div>`;
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
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const titles = ['ฝึกต่อนะ 💙', 'ทำได้ดี! 👍', 'เยี่ยมมาก! 🎉'];

    container.classList.add('hidden');
    completionScreen.classList.remove('hidden');

    document.getElementById('result-stars').innerHTML = Array.from({length: 3}, (_, i) =>
      `<span class="comp-star ${i < stars ? 'comp-star-on' : 'comp-star-off'}">★</span>`
    ).join('');
    document.getElementById('result-title').textContent   = titles[stars - 1];
    document.getElementById('result-score').textContent   = `คะแนน: ${score} / ${exercises.length}`;
    document.getElementById('result-pct').textContent     = `ความแม่นยำ: ${pct}%`;
    document.getElementById('result-xp').textContent      = `XP ที่ได้: +${xpEarned} (รวม ${totalXp.toLocaleString()} XP)`;
    if (maxCombo >= 3) {
      document.getElementById('result-streak').textContent = `Combo สูงสุด: 🔥 ${maxCombo}x  |  Streak: ${streak} วัน`;
    } else {
      document.getElementById('result-streak').textContent  = `Streak: ${streak} วัน`;
    }
    document.getElementById('result-level').textContent   = `Level: ${level}`;
    document.getElementById('back-learn-btn').href        = `/learn/${langCode}`;

    // Wrong answers review
    const reviewSection = document.getElementById('wrong-review-section');
    if (reviewSection && wrongAnswers.length > 0) {
      reviewSection.innerHTML = `
        <div class="wrong-review">
          <div class="wrong-review-title">📝 ทบทวนข้อที่ตอบผิด (${wrongAnswers.length} ข้อ)</div>
          ${wrongAnswers.map(wa => `
            <div class="wrong-review-item">
              <div class="wr-prompt">${esc(wa.prompt)}</div>
              <div class="wr-answer">
                <span class="wr-correct-label">✓</span>
                <strong>${esc(wa.correctAnswer)}</strong>
                <button class="speak-btn" data-word="${esc(wa.correctAnswer)}" title="ฟังเสียง">🔊</button>
              </div>
            </div>
          `).join('')}
        </div>`;
      reviewSection.addEventListener('click', e => {
        const btn = e.target.closest('.speak-btn');
        if (btn) speak(btn.dataset.word, langCode);
      });
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  function normalize(s) { return String(s).toLowerCase().trim().replace(/\s+/g, ' '); }
  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Text-to-Speech ────────────────────────────────────────────────────
  var currentAudio = null;
  function speak(text, lang) {
    if (!text) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const audio = new Audio('/api/tts?text=' + encodeURIComponent(text) + '&lang=' + encodeURIComponent(lang));
    currentAudio = audio;
    audio.play().catch(() => {});
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

  document.getElementById('retry-btn')?.addEventListener('click', () => {
    window.location.reload();
  });

  // ── Hearts & Combo helpers ───────────────────────────────────────────
  function updateHeartsDisplay() {
    const el = document.getElementById('hearts-display');
    if (!el) return;
    el.innerHTML = Array.from({length: 3}, (_, i) =>
      `<span class="heart ${i < lives ? 'heart-alive' : 'heart-dead'}">♥</span>`
    ).join('');
  }

  function updateComboDisplay(correct) {
    if (correct) { combo++; if (combo > maxCombo) maxCombo = combo; }
    else { combo = 0; }
    const el = document.getElementById('combo-display');
    if (!el) return;
    if (combo >= 3) {
      el.textContent = '🔥 ' + combo + 'x combo!';
      el.className = 'combo-display combo-active';
    } else {
      el.textContent = '';
      el.className = 'combo-display';
    }
  }

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toUpperCase();
    const inInput = tag === 'TEXTAREA';

    // Enter / Space in flashcard (not in inputs)
    if (!inInput && (e.key === ' ' || (e.key === 'Enter' && tag !== 'BUTTON'))) {
      if (fcScreen && !fcScreen.classList.contains('hidden')) {
        e.preventDefault();
        const reveal = document.getElementById('fc-reveal-btn');
        const next   = document.getElementById('fc-next-btn');
        const done   = document.getElementById('fc-done-btn');
        if (reveal && !reveal.classList.contains('hidden')) reveal.click();
        else if (next && !next.classList.contains('hidden')) next.click();
        else if (done && !done.classList.contains('hidden')) done.click();
        return;
      }
    }

    // Enter = check or continue (anywhere)
    if (e.key === 'Enter' && tag !== 'BUTTON') {
      if (feedbackPanel.classList.contains('show')) {
        e.preventDefault(); continueBtn.click(); return;
      }
      if (!inInput && exerciseArea && !exerciseArea.classList.contains('hidden') && !checkBtn.disabled && !checked) {
        e.preventDefault(); doCheck(); return;
      }
    }

    // Escape = exit
    if (e.key === 'Escape') {
      document.getElementById('exit-btn')?.click();
    }

    // 1-4 for MC options
    if (['1','2','3','4'].includes(e.key) && !feedbackPanel.classList.contains('show') && !inInput) {
      const opts = answerArea.querySelectorAll('.mc-option:not([disabled])');
      const idx = parseInt(e.key) - 1;
      if (opts[idx]) opts[idx].click();
    }
  });

  init();
})();
