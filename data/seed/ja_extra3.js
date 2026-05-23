'use strict';

// Japanese units 11-14: Katakana N5, Sentence Patterns N5, Colors & Things N5, Time & Schedule N4
module.exports = [
  {
    title: 'คาตาคานะ (カタカナ)',
    description: 'A-O · Ka-Sa-Ta · คำยืม 外来語 — อักษรคาตาคานะ',
    icon: 'カ',
    order_num: 20,
    level: 'N5',
    grammar_note: 'คาตาคานะ (カタカナ) — ใช้สำหรับ:\n\n1. คำยืมจากต่างประเทศ (外来語 がいらいご)\n   • テレビ = television\n   • コーヒー = coffee\n   • パン = bread (จากโปรตุเกส)\n\n2. ชื่อต่างชาติ: アメリカ, タイ, スミス\n\n3. เสียงสัตว์/เอฟเฟกต์: ワンワン (เสียงสุนัข)\n\nรูปร่างต่างจากฮิรางานะ — แข็งกว่า มีมุมมากกว่า',
    cultural_note: 'ญี่ปุ่นยืมคำภาษาอังกฤษมาใช้เยอะมาก แต่ออกเสียงเปลี่ยนไปตามระบบเสียงญี่ปุ่น เช่น "McDonald\'s" → マクドナルド (Makudonarudo), "convenience store" → コンビニ (konbini) — ถ้าอ่านคาตาคานะออก จะเริ่มเดาคำยืมได้เลย ซึ่งช่วยขยาย vocabulary ได้เร็วมาก',
    lessons: [
      {
        title: 'คาตาคานะ ア行 ～ オ行 (A–O)',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: 'ア อ่านว่าอะไร?', options: ['i', 'u', 'a', 'e'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'コーヒー คือ?', options: ['tea', 'coffee', 'juice', 'milk'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'テレビ คือ?', options: ['radio', 'computer', 'telephone', 'television'], correct: 3 } },
          { type: 'multiple_choice', data: { question: 'คำว่า "ice cream" ในคาตาคานะคือ?', options: ['アイスクリーム', 'アイスカリーム', 'エイスクリーム', 'アイスグリーン'], correct: 0 } },
          { type: 'translate', data: { prompt: 'คาตาคานะ: ア', hint: 'a...', answer: 'a', alternatives: ['อา'] } },
          { type: 'translate', data: { prompt: 'คาตาคานะ: エ', hint: 'e...', answer: 'e', alternatives: ['เอะ'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คาตาคานะกับเสียงอ่าน', pairs: [{ left: 'ア', right: 'เสียง a (อา)' }, { left: 'イ', right: 'เสียง i (อิ)' }, { left: 'ウ', right: 'เสียง u (อุ)' }, { left: 'オ', right: 'เสียง o (โอ)' }] } },
          { type: 'fill_blank', data: { sentence: '"___ ください" (Please give me coffee) → ___ = コーヒー', translation: 'ขอกาแฟหน่อย', options: ['チャ', 'コーヒー', 'ジュース', 'ミルク'], correct: 1 } },
        ]
      },
      {
        title: 'คาตาคานะ カ・サ・タ行',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: 'カメラ คือ?', options: ['car', 'computer', 'camera', 'calendar'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'タクシー คือ?', options: ['bus', 'train', 'taxi', 'ticket'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'スーパー คือ?', options: ['subway', 'supermarket', 'sports', 'super hero'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"computer" เขียนคาตาคานะว่า?', options: ['コンピューター', 'コムプーター', 'カンピューター', 'コンピタ'], correct: 0 } },
          { type: 'translate', data: { prompt: 'คาตาคานะ: カ', hint: 'ka...', answer: 'ka', alternatives: ['กะ'] } },
          { type: 'translate', data: { prompt: 'คาตาคานะ: サ', hint: 'sa...', answer: 'sa', alternatives: ['ซะ'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำยืมกับความหมาย', pairs: [{ left: 'カメラ', right: 'กล้อง (camera)' }, { left: 'タクシー', right: 'แท็กซี่ (taxi)' }, { left: 'スーパー', right: 'ซูเปอร์มาร์เก็ต' }, { left: 'コーヒー', right: 'กาแฟ (coffee)' }] } },
          { type: 'fill_blank', data: { sentence: '"___ に のります" (I take a taxi) — คำยืมในประโยค', translation: 'タクシーにのります = ขึ้นแท็กซี่', options: ['バス', 'タクシー', 'でんしゃ', 'カメラ'], correct: 1 } },
        ]
      },
      {
        title: 'คำยืม 外来語 (Gairaigo)',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: 'パン (pan) มาจากภาษาอะไร?', options: ['English', 'French', 'Portuguese', 'German'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'アイスクリーム คือ?', options: ['snow cone', 'frozen yogurt', 'ice cream', 'sorbet'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'テスト คือ?', options: ['taste', 'test/exam', 'taste test', 'text'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"convenience store" ในภาษาญี่ปุ่นพูดว่า?', options: ['コンベニエンスストア', 'コンビニ', 'ストア', 'スーパー'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ขนมปัง (คำยืมจากโปรตุเกส)', hint: 'パン', answer: 'パン', alternatives: ['pan'] } },
          { type: 'translate', data: { prompt: 'ไอศกรีม', hint: 'アイス...', answer: 'アイスクリーム', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำยืมกับความหมาย', pairs: [{ left: 'テスト', right: 'การสอบ / ทดสอบ' }, { left: 'バス', right: 'รถบัส (bus)' }, { left: 'パン', right: 'ขนมปัง' }, { left: 'コンビニ', right: 'ร้านสะดวกซื้อ' }] } },
          { type: 'fill_blank', data: { sentence: '"___ を たべます" → กินขนมปัง', translation: 'パンをたべます', options: ['ごはん', 'パン', 'すし', 'ラーメン'], correct: 1 } },
        ]
      }
    ]
  },
  {
    title: 'รูปประโยค N5',
    description: 'X は Y です · の possession · あります/います — โครงสร้างประโยคพื้นฐาน',
    icon: '🔤',
    order_num: 50,
    level: 'N5',
    grammar_note: 'โครงสร้างประโยคพื้นฐาน N5:\n\n① X は Y です — X คือ Y\n   • これは ほん です。(This is a book.)\n   • わたしは がくせい です。(I am a student.)\n\n② の — possession / description\n   • わたし の ほん (my book)\n   • にほん の くるま (Japanese car)\n\n③ あります / います\n   • あります = มี / อยู่ (สิ่งไม่มีชีวิต)\n   • います = มี / อยู่ (คน, สัตว์)',
    cultural_note: 'は (wa) ออกเสียงว่า "วะ" ไม่ใช่ "ฮะ" เมื่อใช้เป็น topic marker — นี่เป็น quirk ของภาษาญี่ปุ่นที่ผู้เรียนมักสับสน เช่น は ปกติอ่าน "ฮะ" แต่เมื่อเป็น particle อ่าน "วะ" เสมอ',
    lessons: [
      {
        title: 'X は Y です',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"わたし ___ がくせい です" — particle ไหน?', options: ['が', 'を', 'は', 'に'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"これは ほん です" แปลว่า?', options: ['I have a book.', 'This is a book.', 'There is a book.', 'He has a book.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"これは ほん です か" — คำลงท้าย か หมายถึง?', options: ['ยืนยัน', 'ปฏิเสธ', 'คำถาม', 'ขอบคุณ'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"それは なん です か" แปลว่า?', options: ['Where is that?', 'Who is that?', 'What is that?', 'How much is that?'], correct: 2 } },
          { type: 'translate', data: { prompt: 'นี่คืออะไร? (ใช้ これ)', hint: 'これは なん...', answer: 'これは なん です か', alternatives: ['これはなんですか'] } },
          { type: 'translate', data: { prompt: 'ฉันเป็นนักเรียน', hint: 'わたしは...', answer: 'わたしは がくせい です', alternatives: ['わたしはがくせいです'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'これ', right: 'นี่ (ใกล้ผู้พูด)' }, { left: 'それ', right: 'นั่น (ใกล้ผู้ฟัง)' }, { left: 'あれ', right: 'โน่น (ไกลทั้งคู่)' }, { left: 'どれ', right: 'อันไหน? (คำถาม)' }] } },
          { type: 'fill_blank', data: { sentence: '"___ は やまだ さん です か" → "はい、そう です"', translation: 'あなた = คุณ', options: ['あれ', 'あなた', 'これ', 'どれ'], correct: 1 } },
        ]
      },
      {
        title: 'の — possession',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"わたし の ほん" หมายถึงอะไร?', options: ["I am a book.", "your book", "my book", "a book for me"], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"にほん の くるま" หมายถึงอะไร?', options: ['car in Japan', 'Japanese car', 'driving in Japan', 'car to Japan'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"これは だれ の かばん です か" แปลว่า?', options: ["Where is this bag?", "What is in this bag?", "Whose bag is this?", "Is this a bag?"], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"たなか さん の でんわ" หมายถึง?', options: ["Tanaka's phone", "phone to Tanaka", "phone from Tanaka", "phone like Tanaka"], correct: 0 } },
          { type: 'translate', data: { prompt: 'หนังสือของฉัน', hint: 'わたしの...', answer: 'わたしの ほん', alternatives: ['わたしのほん'] } },
          { type: 'translate', data: { prompt: 'ครูของโรงเรียน', hint: 'がっこうの...', answer: 'がっこうの せんせい', alternatives: ['がっこうのせんせい'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ の phrase กับความหมาย', pairs: [{ left: 'わたしの ほん', right: 'หนังสือของฉัน' }, { left: 'にほんの くるま', right: 'รถญี่ปุ่น' }, { left: 'がっこうの せんせい', right: 'ครูของโรงเรียน' }, { left: 'だれの かばん', right: 'กระเป๋าของใคร?' }] } },
          { type: 'fill_blank', data: { sentence: '"これは ___ の えんぴつ です か" → "はい、わたし の えんぴつ です"', translation: 'だれ = ใคร', options: ['なに', 'どこ', 'だれ', 'いつ'], correct: 2 } },
        ]
      },
      {
        title: 'あります / います',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"ねこ が ___ います" — ใช้ あります หรือ います?', options: ['あります', 'います', 'both are ok', 'neither'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"つくえ の うえ に ほん が ___ " — ใช้อะไร?', options: ['います', 'あります', 'です', 'ます'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"こうえん に こども が ___" — ใช้อะไร?', options: ['あります', 'います', 'です', 'ます'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"きょうしつ に いす が ___ か" → "はい、あります" แปลว่า?', options: ['Is there a chair in the classroom? Yes, there is.', 'Where is the classroom chair?', 'How many chairs are in the classroom?', 'The classroom has a chair.'], correct: 0 } },
          { type: 'translate', data: { prompt: 'มีหนังสืออยู่บนโต๊ะ (สิ่งไม่มีชีวิต)', hint: 'つくえのうえに ほんが...', answer: 'つくえの うえに ほんが あります', alternatives: ['つくえのうえにほんがあります'] } },
          { type: 'translate', data: { prompt: 'มีแมวอยู่ในสวน (สัตว์)', hint: 'にわに ねこが...', answer: 'にわに ねこが います', alternatives: ['にわにねこがいます'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่กับกริยาที่ถูกต้อง', pairs: [{ left: 'ねこ (แมว)', right: 'います — สัตว์/คนใช้ います' }, { left: 'ほん (หนังสือ)', right: 'あります — สิ่งของใช้ あります' }, { left: 'せんせい (ครู)', right: 'います — คนใช้ います' }, { left: 'くるま (รถ)', right: 'あります — ยานพาหนะใช้ あります' }] } },
          { type: 'fill_blank', data: { sentence: '"えき の ちかく に コンビニ が ___" — ร้านสะดวกซื้ออยู่ใกล้สถานี', translation: 'สิ่งของ → あります', options: ['います', 'あります', 'です', 'ます'], correct: 1 } },
        ]
      }
    ]
  },
  {
    title: 'สีและสิ่งของ N5',
    description: 'สี · อวัยวะ · สิ่งของรอบตัว — Colors & Common Things',
    icon: '🎨',
    order_num: 60,
    level: 'N5',
    grammar_note: 'คุณศัพท์ในภาษาญี่ปุ่น (N5):\n\nい-adjective: ลงท้ายด้วย い\n• あかい (สีแดง) / しろい (สีขาว)\n• おおきい (ใหญ่) / ちいさい (เล็ก)\n\nการใช้ขยายนาม:\n• あかい くるま = รถสีแดง\n• おおきい いぬ = สุนัขตัวใหญ่\n\nNoun form (ตัดท้าย い → ลง さ):\n• あかい → あか (สีแดง as a noun)\n• いぬ の め は くろい = ดวงตาของสุนัขสีดำ',
    cultural_note: 'ในญี่ปุ่น สี "青 (あお)" หมายถึงทั้งสีน้ำเงินและสีเขียวในบางบริบท เช่น สัญญาณไฟจราจรสีเขียวเรียกว่า 青信号 (あおしんごう = ไฟสีเขียว/น้ำเงิน) ซึ่งเป็นรอยต่อทางประวัติศาสตร์ที่ภาษาญี่ปุ่นโบราณแยก "เขียว" ออกจาก "น้ำเงิน" ได้ไม่ชัด',
    lessons: [
      {
        title: 'สีพื้นฐาน (いろ)',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"あかい" หมายถึงสีอะไร?', options: ['สีเขียว', 'สีน้ำเงิน', 'สีแดง', 'สีเหลือง'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"あおい" ในบริบทไฟจราจรหมายถึง?', options: ['สีแดง', 'สีเขียว/น้ำเงิน', 'สีเหลือง', 'สีขาว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"しろい くるま" หมายถึง?', options: ['black car', 'blue car', 'white car', 'red car'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"きいろい バナナ" ถูกหรือไม่?', options: ['ถูก — บานาน่าสีเหลือง', 'ผิด — ควรใช้ きいろ', 'ผิด — ควรใช้ おうごんいろ', 'ถูก แต่เขียนผิด'], correct: 0 } },
          { type: 'translate', data: { prompt: 'สีแดง (い-adj)', hint: 'あか...', answer: 'あかい', alternatives: ['あか'] } },
          { type: 'translate', data: { prompt: 'สีดำ (い-adj)', hint: 'くろ...', answer: 'くろい', alternatives: ['くろ'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำสีกับภาษาไทย', pairs: [{ left: 'あかい', right: 'สีแดง' }, { left: 'しろい', right: 'สีขาว' }, { left: 'くろい', right: 'สีดำ' }, { left: 'きいろい', right: 'สีเหลือง' }] } },
          { type: 'fill_blank', data: { sentence: '"___ い ねこ が います" → มีแมวสีขาวอยู่', translation: 'しろ = ขาว', options: ['あか', 'しろ', 'くろ', 'あお'], correct: 1 } },
        ]
      },
      {
        title: 'อวัยวะร่างกาย (からだ)',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"め" หมายถึงอะไร?', options: ['หู', 'ปาก', 'ตา', 'จมูก'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"て" หมายถึงอะไร?', options: ['เท้า', 'มือ', 'แขน', 'ขา'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"あたま が いたい" หมายถึง?', options: ['I have a stomachache.', 'I have a headache.', 'I have a backache.', 'My leg hurts.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"かみ" ในบริบทร่างกายหมายถึง?', options: ['กระดาษ', 'ผม/ขน', 'พระเจ้า', 'บน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ตา (อวัยวะ)', hint: 'め', answer: 'め', alternatives: ['目'] } },
          { type: 'translate', data: { prompt: 'มือ (อวัยวะ)', hint: 'て', answer: 'て', alternatives: ['手'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อวัยวะกับความหมาย', pairs: [{ left: 'あたま', right: 'หัว' }, { left: 'て', right: 'มือ' }, { left: 'あし', right: 'เท้า / ขา' }, { left: 'はな', right: 'จมูก' }] } },
          { type: 'fill_blank', data: { sentence: '"___ が おおきい ですね" → ดวงตาใหญ่จัง', translation: 'め = ตา', options: ['て', 'はな', 'め', 'くち'], correct: 2 } },
        ]
      },
      {
        title: 'สิ่งของรอบตัว (もの)',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"でんわ" หมายถึงอะไร?', options: ['television', 'telephone', 'telegram', 'tender'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"かばん" หมายถึงอะไร?', options: ['umbrella', 'wallet', 'bag', 'hat'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"えんぴつ" หมายถึงอะไร?', options: ['pen', 'pencil', 'ruler', 'eraser'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"つくえ の うえ に なにが ありますか" หมายถึง?', options: ['What is under the desk?', 'What is on the desk?', 'Where is the desk?', 'Whose desk is it?'], correct: 1 } },
          { type: 'translate', data: { prompt: 'กระเป๋า', hint: 'かば...', answer: 'かばん', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ดินสอ', hint: 'えん...', answer: 'えんぴつ', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สิ่งของกับความหมาย', pairs: [{ left: 'ほん', right: 'หนังสือ' }, { left: 'えんぴつ', right: 'ดินสอ' }, { left: 'かばん', right: 'กระเป๋า' }, { left: 'かぎ', right: 'กุญแจ' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'มีกุญแจอยู่ในกระเป๋า', words: ['かばん', 'の', 'なか', 'に', 'かぎ', 'が', 'あります'], answer: 'かばん の なか に かぎ が あります' } },
        ]
      }
    ]
  },
  {
    title: 'เวลาและตารางเวลา N4',
    description: 'บอกเวลา · วันและความถี่ · การนัดหมาย — Time & Schedule',
    icon: '🕐',
    order_num: 110,
    level: 'N4',
    grammar_note: 'เวลาใน N4:\n\n① บอกเวลา: ～時 (じ) ～分 (ふん/ぷん)\n   • 7時30分 = しちじ さんじゅっぷん\n   • 午前 (ごぜん) = AM / 午後 (ごご) = PM\n\n② ～に (time particle): "に" บอกเวลาที่เจาะจง\n   • 7時に おきます = ตื่นตอน 7 โมง\n\n③ ～ごろ (approximately)\n   • 7時ごろ = ประมาณ 7 โมง\n\n④ Frequency:\n   • 週に3回 = 3 ครั้งต่อสัปดาห์\n   • 毎日 (まいにち) = ทุกวัน',
    cultural_note: 'ชาวญี่ปุ่นให้ความสำคัญกับ punctuality มาก การตรงต่อเวลาถือเป็นมารยาทพื้นฐาน — รถไฟญี่ปุ่นมีชื่อเสียงด้านตรงเวลาสุดๆ ถ้าช้าแม้แต่นาทีเดียวต้องขอโทษ การนัดหมายจึงมักระบุเวลาแน่ชัดพร้อม ～ごろ (approximately) เมื่อยังไม่แน่นอน 100%',
    lessons: [
      {
        title: 'บอกเวลา (じかん)',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"ごぜん しちじ" หมายถึงเวลาอะไร?', options: ['7 PM', '7 AM', '17:00', '7:30 AM'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"くじ はん" หมายถึงเวลาอะไร?', options: ['9:00', '9:15', '9:30', '8:30'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"ごご にじ に かいぎ が あります" แปลว่า?', options: ['The meeting is at 2 AM.', 'The meeting is at 2 PM.', 'There was a meeting at 2.', 'The meeting is tomorrow at 2.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"～時ごろ" หมายถึงอะไร?', options: ['exactly at ~ o\'clock', 'before ~ o\'clock', 'approximately ~ o\'clock', 'after ~ o\'clock'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ตอนบ่าย 3 โมง (ใช้ ごご)', hint: 'ごごさんじ', answer: 'ごご さんじ', alternatives: ['ごごさんじ', '午後3時'] } },
          { type: 'translate', data: { prompt: 'ประมาณ 8 โมงเช้า (ใช้ ごろ)', hint: 'ごぜんはちじごろ', answer: 'ごぜん はちじ ごろ', alternatives: ['ごぜんはちじごろ'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำเวลากับความหมาย', pairs: [{ left: 'ごぜん', right: 'ช่วงเช้า (AM)' }, { left: 'ごご', right: 'ช่วงบ่าย (PM)' }, { left: '～ごろ', right: 'ประมาณ...' }, { left: 'ちょうど', right: 'ตรงๆ เป๊ะๆ' }] } },
          { type: 'fill_blank', data: { sentence: '"まいあさ ___ じ に おきます" → ตื่นนอนตอน 6 โมงทุกเช้า', translation: 'ろく = หก', options: ['しち', 'はち', 'ろく', 'く'], correct: 2 } },
        ]
      },
      {
        title: 'วันในสัปดาห์และความถี่',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"もくようび" คือวันอะไร?', options: ['วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"まいにち にほんご を べんきょうします" แปลว่า?', options: ['I study Japanese sometimes.', 'I study Japanese every day.', 'I studied Japanese yesterday.', 'I will study Japanese tomorrow.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"しゅう に いっかい" หมายถึงอะไร?', options: ['once a month', 'once a week', 'twice a week', 'every day'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"どようび と にちようび" คือ?', options: ['Monday and Tuesday', 'Friday and Saturday', 'Saturday and Sunday', 'Thursday and Friday'], correct: 2 } },
          { type: 'translate', data: { prompt: 'วันอังคาร', hint: 'かようび', answer: 'かようび', alternatives: ['火曜日'] } },
          { type: 'translate', data: { prompt: 'ทุกวัน', hint: 'まいにち', answer: 'まいにち', alternatives: ['毎日'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่วันกับภาษาไทย', pairs: [{ left: 'げつようび', right: 'วันจันทร์' }, { left: 'すいようび', right: 'วันพุธ' }, { left: 'きんようび', right: 'วันศุกร์' }, { left: 'にちようび', right: 'วันอาทิตย์' }] } },
          { type: 'fill_blank', data: { sentence: '"___ に さんかい ジムに いきます" → ไปยิม 3 ครั้งต่อสัปดาห์', translation: 'しゅう = สัปดาห์', options: ['つき', 'しゅう', 'まいにち', 'ねん'], correct: 1 } },
        ]
      },
      {
        title: 'การนัดหมาย (よてい・やくそく)',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"あした ひまですか" หมายถึงอะไร?', options: ['Are you busy tomorrow?', 'Are you free tomorrow?', 'What are you doing tomorrow?', 'Do you work tomorrow?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"～よてい です" หมายถึงอะไร?', options: ['I did...', 'I want to...', 'I plan to / I am scheduled to...', 'I can...'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"いっしょに ひるごはんを たべませんか" หมายถึงอะไร?', options: ["I won't eat lunch with you.", 'Why don\'t we eat lunch together?', 'I already ate lunch.', 'Do you want to eat lunch alone?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"やくそく を やぶりました" หมายถึง?', options: ['I kept my promise.', 'I made a promise.', 'I broke my promise.', 'I forgot my promise.'], correct: 2 } },
          { type: 'translate', data: { prompt: 'แผนการ / ตารางเวลา', hint: 'よてい', answer: 'よてい', alternatives: ['予定'] } },
          { type: 'translate', data: { prompt: 'นัดหมาย / สัญญา', hint: 'やくそく', answer: 'やくそく', alternatives: ['約束'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'よてい', right: 'แผนการ / ตารางเวลา' }, { left: 'やくそく', right: 'สัญญา / นัดหมาย' }, { left: 'ひま', right: 'ว่าง (ไม่มีงาน)' }, { left: 'いそがしい', right: 'ยุ่ง / มีงานเยอะ' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคนัดหมาย', translation: 'พรุ่งนี้ตอน 3 โมงเย็น เราเจอกันไหม?', words: ['あした', 'ごご', 'さんじ', 'に', 'あいませんか'], answer: 'あした ごご さんじ に あいませんか' } },
        ]
      }
    ]
  }
];
