'use strict';

module.exports = {
  code: 'ja',
  name: 'Japanese',
  native_name: '日本語',
  flag: '🇯🇵',
  units: [
    {
      title: 'Hiragana',
      description: 'ตัวอักษรฮิรางานะพื้นฐาน',
      icon: 'あ',
      order_num: 1,
      lessons: [
        {
          title: 'สระ (Vowels)',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'あ อ่านว่าอะไร?', options: ['i', 'u', 'a', 'e'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'い อ่านว่าอะไร?', options: ['a', 'i', 'u', 'o'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'う อ่านว่าอะไร?', options: ['e', 'o', 'a', 'u'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดอ่านว่า "e"?', options: ['あ', 'い', 'う', 'え'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดอ่านว่า "o"?', options: ['え', 'お', 'あ', 'い'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'お อ่านว่าอะไร?', options: ['a', 'u', 'e', 'o'], correct: 3 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ฮิรางานะกับเสียง', pairs: [{ left: 'あ', right: 'a' }, { left: 'い', right: 'i' }, { left: 'う', right: 'u' }, { left: 'え', right: 'e' }] } },
            { type: 'multiple_choice', data: { question: 'え แปลว่าเสียงอะไรในภาษาไทย?', options: ['อะ', 'อิ', 'อุ', 'เอ'], correct: 3 } }
          ]
        },
        {
          title: 'แถว K (K-row)',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'か อ่านว่าอะไร?', options: ['ki', 'ku', 'ka', 'ke'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'き อ่านว่าอะไร?', options: ['ka', 'ki', 'ku', 'ko'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'く อ่านว่าอะไร?', options: ['ke', 'ko', 'ki', 'ku'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดอ่านว่า "ke"?', options: ['か', 'き', 'け', 'こ'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดอ่านว่า "ko"?', options: ['か', 'け', 'こ', 'き'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ฮิรางานะกับเสียง', pairs: [{ left: 'か', right: 'ka' }, { left: 'き', right: 'ki' }, { left: 'く', right: 'ku' }, { left: 'こ', right: 'ko' }] } },
            { type: 'multiple_choice', data: { question: 'こ อ่านว่าอะไร?', options: ['ka', 'ki', 'ku', 'ko'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'け แปลว่าเสียงอะไร?', options: ['คา', 'คิ', 'คุ', 'เค'], correct: 3 } }
          ]
        },
        {
          title: 'ทบทวน A + K',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: 'あか อ่านว่าอะไร? (สีแดง)', options: ['iku', 'aka', 'uke', 'eki'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'いく อ่านว่าอะไร? (ไป)', options: ['aku', 'iku', 'uke', 'oki'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดไม่ใช่ฮิรางานะแถว A?', options: ['あ', 'い', 'か', 'お'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดไม่ใช่ฮิรางานะแถว K?', options: ['か', 'え', 'き', 'く'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ฮิรางานะกับเสียง', pairs: [{ left: 'お', right: 'o' }, { left: 'く', right: 'ku' }, { left: 'え', right: 'e' }, { left: 'こ', right: 'ko' }] } },
            { type: 'multiple_choice', data: { question: 'คำว่า あおい (aoi) แปลว่า?', options: ['แดง', 'เขียว', 'น้ำเงิน / ฟ้า', 'เหลือง'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'คำว่า かお (kao) แปลว่า?', options: ['มือ', 'หน้า', 'ขา', 'หัว'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่เสียงกับฮิรางานะ', pairs: [{ left: 'a', right: 'あ' }, { left: 'ki', right: 'き' }, { left: 'u', right: 'う' }, { left: 'ke', right: 'け' }] } }
          ]
        }
      ]
    },
    {
      title: 'Greetings',
      description: 'คำทักทายภาษาญี่ปุ่น',
      icon: '🙏',
      order_num: 2,
      lessons: [
        {
          title: 'คำทักทายตามเวลา',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'おはよう (ohayou) แปลว่าอะไร?', options: ['สวัสดีตอนเย็น', 'สวัสดีตอนเช้า', 'สวัสดีตอนกลางวัน', 'ราตรีสวัสดิ์'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'こんにちは (konnichiwa) แปลว่าอะไร?', options: ['สวัสดีตอนเช้า', 'ราตรีสวัสดิ์', 'สวัสดีตอนกลางวัน', 'สวัสดีตอนเย็น'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'こんばんは (konbanwa) แปลว่าอะไร?', options: ['สวัสดีตอนเช้า', 'สวัสดีตอนกลางวัน', 'ราตรีสวัสดิ์', 'สวัสดีตอนเย็น'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'おやすみ (oyasumi) แปลว่าอะไร?', options: ['สวัสดีตอนเช้า', 'สวัสดีตอนกลางวัน', 'สวัสดีตอนเย็น', 'ราตรีสวัสดิ์'], correct: 3 } },
            { type: 'translate', data: { prompt: 'สวัสดีตอนเช้า (ญี่ปุ่น)', hint: 'ohayou', answer: 'おはよう', alternatives: ['おはようございます'] } },
            { type: 'translate', data: { prompt: 'สวัสดีตอนกลางวัน (ญี่ปุ่น)', hint: 'konnichiwa', answer: 'こんにちは', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '___ (konnichiwa)! คุณเป็นยังไงบ้าง?', translation: 'สวัสดีตอนกลางวัน!', options: ['おやすみ', 'おはよう', 'こんにちは', 'こんばんは'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำทักทายกับเวลา', pairs: [{ left: 'おはよう', right: 'ตอนเช้า' }, { left: 'こんにちは', right: 'ตอนกลางวัน' }, { left: 'こんばんは', right: 'ตอนเย็น' }, { left: 'おやすみ', right: 'ก่อนนอน' }] } }
          ]
        },
        {
          title: 'ขอบคุณและขอโทษ',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'ありがとう (arigatou) แปลว่าอะไร?', options: ['ขอโทษ', 'ยินดี', 'ขอบคุณ', 'สวัสดี'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'すみません (sumimasen) แปลว่าอะไร?', options: ['ขอบคุณ', 'ขอโทษ / ขอความกรุณา', 'ยินดี', 'สวัสดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'どういたしまして (douitashimashite) แปลว่าอะไร?', options: ['ขอโทษ', 'ขอบคุณ', 'ยินดี / ไม่เป็นไร', 'สวัสดี'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'ごめんなさい (gomen nasai) แปลว่าอะไร?', options: ['ขอบคุณ', 'ขอโทษ (ระดับสูง)', 'ยินดี', 'ลาก่อน'], correct: 1 } },
            { type: 'translate', data: { prompt: 'ขอบคุณ (ญี่ปุ่น)', hint: 'arigatou', answer: 'ありがとう', alternatives: ['ありがとうございます'] } },
            { type: 'translate', data: { prompt: 'ขอโทษ (ญี่ปุ่น ไม่เป็นทางการ)', hint: 'gomen', answer: 'ごめんなさい', alternatives: ['すみません'] } },
            { type: 'fill_blank', data: { sentence: 'A: ありがとう! B: ___!', translation: 'ก: ขอบคุณ! ข: ยินดี!', options: ['すみません', 'こんにちは', 'どういたしまして', 'おはよう'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'ありがとう', right: 'ขอบคุณ' }, { left: 'すみません', right: 'ขอโทษ' }, { left: 'どういたしまして', right: 'ยินดี' }, { left: 'ごめんなさい', right: 'ขอโทษมากๆ' }] } }
          ]
        },
        {
          title: 'ใช่และไม่ใช่',
          order_num: 3,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'はい (hai) แปลว่าอะไร?', options: ['ไม่ใช่', 'ใช่', 'โอเค', 'ดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'いいえ (iie) แปลว่าอะไร?', options: ['ใช่', 'ไม่ใช่', 'โอเค', 'ดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'そうです (sou desu) แปลว่าอะไร?', options: ['ไม่ใช่แล้ว', 'ใช่แล้ว / นั่นแหละ', 'ขอบคุณ', 'สวัสดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ちがいます (chigaimasu) แปลว่าอะไร?', options: ['ใช่', 'ไม่ใช่ / ผิด', 'โอเค', 'ดี'], correct: 1 } },
            { type: 'translate', data: { prompt: 'ใช่ (ญี่ปุ่น)', hint: 'hai', answer: 'はい', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ไม่ใช่ (ญี่ปุ่น)', hint: 'iie', answer: 'いいえ', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'A: これはねこですか? B: ___, そうです。', translation: 'ก: นี่คือแมวใช่ไหม? ข: ใช่ ใช่แล้ว', options: ['いいえ', 'はい', 'ありがとう', 'すみません'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'はい', right: 'ใช่' }, { left: 'いいえ', right: 'ไม่ใช่' }, { left: 'そうです', right: 'ใช่แล้ว' }, { left: 'ちがいます', right: 'ไม่ใช่ (ผิด)' }] } }
          ]
        }
      ]
    },
    {
      title: 'Numbers',
      description: 'ตัวเลขภาษาญี่ปุ่น',
      icon: '🔢',
      order_num: 3,
      lessons: [
        {
          title: '1 ถึง 5',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'いち (ichi) แปลว่าอะไร?', options: ['สาม', 'หนึ่ง', 'สอง', 'สี่'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'に (ni) แปลว่าอะไร?', options: ['หนึ่ง', 'สาม', 'สอง', 'สี่'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'เลข 3 ภาษาญี่ปุ่นคือ?', options: ['いち', 'に', 'さん', 'し'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'เลข 4 ภาษาญี่ปุ่นคือ?', options: ['さん', 'よん/し', 'ご', 'に'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ご (go) แปลว่าอะไร?', options: ['สี่', 'สาม', 'ห้า', 'หก'], correct: 2 } },
            { type: 'translate', data: { prompt: 'หนึ่ง (ญี่ปุ่น)', hint: 'ichi', answer: 'いち', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ห้า (ญี่ปุ่น)', hint: 'go', answer: 'ご', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขญี่ปุ่นกับความหมาย', pairs: [{ left: 'いち', right: '1' }, { left: 'に', right: '2' }, { left: 'さん', right: '3' }, { left: 'ご', right: '5' }] } }
          ]
        },
        {
          title: '6 ถึง 10',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'ろく (roku) แปลว่าอะไร?', options: ['เจ็ด', 'แปด', 'หก', 'เก้า'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'なな (nana) แปลว่าอะไร?', options: ['หก', 'เจ็ด', 'แปด', 'เก้า'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'เลข 8 ภาษาญี่ปุ่นคือ?', options: ['なな', 'はち', 'きゅう', 'ろく'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'เลข 10 ภาษาญี่ปุ่นคือ?', options: ['きゅう', 'じゅう', 'はち', 'なな'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'きゅう (kyuu) แปลว่าอะไร?', options: ['เจ็ด', 'แปด', 'เก้า', 'สิบ'], correct: 2 } },
            { type: 'translate', data: { prompt: 'แปด (ญี่ปุ่น)', hint: 'hachi', answer: 'はち', alternatives: [] } },
            { type: 'translate', data: { prompt: 'สิบ (ญี่ปุ่น)', hint: 'juu', answer: 'じゅう', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขญี่ปุ่นกับความหมาย', pairs: [{ left: 'ろく', right: '6' }, { left: 'なな', right: '7' }, { left: 'はち', right: '8' }, { left: 'じゅう', right: '10' }] } }
          ]
        },
        {
          title: 'นับในบริบท',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: 'ねこが さん ひき います。 แปลว่า?', options: ['มีแมวหนึ่งตัว', 'มีแมวสองตัว', 'มีแมวสามตัว', 'มีแมวสี่ตัว'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'เลข "9" ภาษาญี่ปุ่นเขียนอย่างไร?', options: ['はち', 'きゅう', 'じゅう', 'なな'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'いち + いち = ?', options: ['いち', 'に', 'さん', 'し'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ご + ご = ?', options: ['ろく', 'なな', 'はち', 'じゅう'], correct: 3 } },
            { type: 'translate', data: { prompt: 'เก้า (ญี่ปุ่น)', hint: 'kyuu', answer: 'きゅう', alternatives: [] } },
            { type: 'translate', data: { prompt: 'หก (ญี่ปุ่น)', hint: 'roku', answer: 'ろく', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขทั้งหมด', pairs: [{ left: 'よん', right: '4' }, { left: 'きゅう', right: '9' }, { left: 'ろく', right: '6' }, { left: 'はち', right: '8' }] } },
            { type: 'multiple_choice', data: { question: 'じゅう - さん = ?', options: ['なな', 'はち', 'ろく', 'ご'], correct: 0 } }
          ]
        }
      ]
    },
    {
      title: 'Adjectives',
      description: 'คำคุณศัพท์ภาษาญี่ปุ่น',
      icon: '💬',
      order_num: 4,
      lessons: [
        {
          title: 'รสชาติและขนาด',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'おいしい (oishii) แปลว่าอะไร?', options: ['ไม่อร่อย', 'อร่อย', 'ใหญ่', 'เล็ก'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'まずい (mazui) แปลว่าอะไร?', options: ['อร่อย', 'ใหญ่', 'ไม่อร่อย', 'เล็ก'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'おおきい (ookii) แปลว่าอะไร?', options: ['เล็ก', 'น่ารัก', 'ใหญ่', 'สวย'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'ちいさい (chiisai) แปลว่าอะไร?', options: ['ใหญ่', 'เล็ก', 'สวย', 'น่ารัก'], correct: 1 } },
            { type: 'translate', data: { prompt: 'อร่อย (ญี่ปุ่น)', hint: 'oishii', answer: 'おいしい', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ใหญ่ (ญี่ปุ่น)', hint: 'ookii', answer: 'おおきい', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'このラーメンは ___ (oishii) ですね!', translation: 'ราเมนนี้อร่อยจริงๆ!', options: ['まずい', 'ちいさい', 'おいしい', 'おおきい'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำคุณศัพท์กับความหมาย', pairs: [{ left: 'おいしい', right: 'อร่อย' }, { left: 'まずい', right: 'ไม่อร่อย' }, { left: 'おおきい', right: 'ใหญ่' }, { left: 'ちいさい', right: 'เล็ก' }] } }
          ]
        },
        {
          title: 'ราคาและอุณหภูมิ',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: 'たかい (takai) แปลว่าอะไร?', options: ['ถูก', 'ร้อน', 'หนาว', 'แพง'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'やすい (yasui) แปลว่าอะไร?', options: ['แพง', 'ถูก / ราคาไม่แพง', 'ร้อน', 'หนาว'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'あつい (atsui) แปลว่าอะไร?', options: ['หนาว', 'แพง', 'ถูก', 'ร้อน'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'さむい (samui) แปลว่าอะไร?', options: ['ร้อน', 'แพง', 'หนาว', 'ถูก'], correct: 2 } },
            { type: 'translate', data: { prompt: 'แพง (ญี่ปุ่น)', hint: 'takai', answer: 'たかい', alternatives: [] } },
            { type: 'translate', data: { prompt: 'หนาว (ญี่ปุ่น)', hint: 'samui', answer: 'さむい', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'きょうは ___ (samui) ですね。', translation: 'วันนี้หนาวนะ', options: ['たかい', 'あつい', 'さむい', 'やすい'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'たかい', right: 'แพง' }, { left: 'やすい', right: 'ถูก' }, { left: 'あつい', right: 'ร้อน' }, { left: 'さむい', right: 'หนาว' }] } }
          ]
        },
        {
          title: 'ความรู้สึก',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: 'うれしい (ureshii) แปลว่าอะไร?', options: ['เศร้า', 'น่ากลัว', 'มีความสุข / ดีใจ', 'สนุก'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'かなしい (kanashii) แปลว่าอะไร?', options: ['มีความสุข', 'เศร้า', 'สนุก', 'น่ากลัว'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'こわい (kowai) แปลว่าอะไร?', options: ['มีความสุข', 'สนุก', 'เศร้า', 'น่ากลัว'], correct: 3 } },
            { type: 'multiple_choice', data: { question: 'たのしい (tanoshii) แปลว่าอะไร?', options: ['เศร้า', 'น่ากลัว', 'มีความสุข', 'สนุก'], correct: 3 } },
            { type: 'translate', data: { prompt: 'มีความสุข (ญี่ปุ่น)', hint: 'ureshii', answer: 'うれしい', alternatives: [] } },
            { type: 'translate', data: { prompt: 'สนุก (ญี่ปุ่น)', hint: 'tanoshii', answer: 'たのしい', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'パーティーは ___ (tanoshii) です!', translation: 'งานปาร์ตี้สนุกมาก!', options: ['かなしい', 'こわい', 'うれしい', 'たのしい'], correct: 3 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ความรู้สึกกับความหมาย', pairs: [{ left: 'うれしい', right: 'มีความสุข' }, { left: 'かなしい', right: 'เศร้า' }, { left: 'こわい', right: 'น่ากลัว' }, { left: 'たのしい', right: 'สนุก' }] } }
          ]
        }
      ]
    }
  ],
  vocab: [
    { word: 'あ', reading: 'a', translation: 'อ่า (สระ a)', example: 'あおい', example_translation: 'สีน้ำเงิน', tags: ['hiragana'] },
    { word: 'い', reading: 'i', translation: 'อิ (สระ i)', example: 'いぬ', example_translation: 'สุนัข', tags: ['hiragana'] },
    { word: 'う', reading: 'u', translation: 'อุ (สระ u)', example: 'うえ', example_translation: 'ข้างบน', tags: ['hiragana'] },
    { word: 'え', reading: 'e', translation: 'เอ (สระ e)', example: 'えき', example_translation: 'สถานีรถไฟ', tags: ['hiragana'] },
    { word: 'お', reading: 'o', translation: 'โอ (สระ o)', example: 'おかあさん', example_translation: 'แม่', tags: ['hiragana'] },
    { word: 'か', reading: 'ka', translation: 'คา', example: 'かお', example_translation: 'หน้า', tags: ['hiragana'] },
    { word: 'き', reading: 'ki', translation: 'คิ', example: 'きいろ', example_translation: 'สีเหลือง', tags: ['hiragana'] },
    { word: 'く', reading: 'ku', translation: 'คุ', example: 'くに', example_translation: 'ประเทศ', tags: ['hiragana'] },
    { word: 'け', reading: 'ke', translation: 'เค', example: 'けいさつ', example_translation: 'ตำรวจ', tags: ['hiragana'] },
    { word: 'こ', reading: 'ko', translation: 'โค', example: 'こども', example_translation: 'เด็ก', tags: ['hiragana'] },
    { word: 'おはよう', reading: 'ohayou', translation: 'สวัสดีตอนเช้า', example: 'おはよう! きょうはいいてんきですね。', example_translation: 'สวัสดีตอนเช้า! วันนี้อากาศดีนะ', tags: ['greeting'] },
    { word: 'こんにちは', reading: 'konnichiwa', translation: 'สวัสดีตอนกลางวัน', example: 'こんにちは、げんきですか?', example_translation: 'สวัสดีตอนกลางวัน คุณเป็นยังไงบ้าง?', tags: ['greeting'] },
    { word: 'こんばんは', reading: 'konbanwa', translation: 'สวัสดีตอนเย็น', example: 'こんばんは、おひさしぶりです。', example_translation: 'สวัสดีตอนเย็น ไม่ได้เจอกันนานเลย', tags: ['greeting'] },
    { word: 'おやすみ', reading: 'oyasumi', translation: 'ราตรีสวัสดิ์', example: 'おやすみなさい。', example_translation: 'ราตรีสวัสดิ์', tags: ['greeting'] },
    { word: 'ありがとう', reading: 'arigatou', translation: 'ขอบคุณ', example: 'ありがとうございます!', example_translation: 'ขอบคุณมากครับ/ค่ะ', tags: ['polite'] },
    { word: 'すみません', reading: 'sumimasen', translation: 'ขอโทษ / ขอความกรุณา', example: 'すみません、えきはどこですか?', example_translation: 'ขอโทษ สถานีอยู่ที่ไหนครับ?', tags: ['polite'] },
    { word: 'どういたしまして', reading: 'douitashimashite', translation: 'ยินดี / ไม่เป็นไร', example: 'A: ありがとう B: どういたしまして', example_translation: 'ก: ขอบคุณ ข: ยินดี', tags: ['polite'] },
    { word: 'ごめんなさい', reading: 'gomen nasai', translation: 'ขอโทษ (ระดับสูง)', example: 'ごめんなさい、おそくなりました。', example_translation: 'ขอโทษที่มาสาย', tags: ['polite'] },
    { word: 'はい', reading: 'hai', translation: 'ใช่', example: 'はい、そうです。', example_translation: 'ใช่ ใช่แล้ว', tags: ['basic'] },
    { word: 'いいえ', reading: 'iie', translation: 'ไม่ใช่', example: 'いいえ、ちがいます。', example_translation: 'ไม่ใช่ ผิดแล้ว', tags: ['basic'] },
    { word: 'いち', reading: 'ichi', translation: 'หนึ่ง (1)', example: 'いちまい', example_translation: 'หนึ่งแผ่น', tags: ['number'] },
    { word: 'に', reading: 'ni', translation: 'สอง (2)', example: 'にほん', example_translation: 'ญี่ปุ่น', tags: ['number'] },
    { word: 'さん', reading: 'san', translation: 'สาม (3)', example: 'さんにん', example_translation: 'สามคน', tags: ['number'] },
    { word: 'よん', reading: 'yon', translation: 'สี่ (4)', example: 'よんじゅう', example_translation: 'สี่สิบ', tags: ['number'] },
    { word: 'ご', reading: 'go', translation: 'ห้า (5)', example: 'ごふん', example_translation: 'ห้านาที', tags: ['number'] },
    { word: 'ろく', reading: 'roku', translation: 'หก (6)', example: 'ろくじ', example_translation: 'หกโมง', tags: ['number'] },
    { word: 'なな', reading: 'nana', translation: 'เจ็ด (7)', example: 'ななにん', example_translation: 'เจ็ดคน', tags: ['number'] },
    { word: 'はち', reading: 'hachi', translation: 'แปด (8)', example: 'はちじ', example_translation: 'แปดโมง', tags: ['number'] },
    { word: 'きゅう', reading: 'kyuu', translation: 'เก้า (9)', example: 'きゅうふん', example_translation: 'เก้านาที', tags: ['number'] },
    { word: 'じゅう', reading: 'juu', translation: 'สิบ (10)', example: 'じゅうえん', example_translation: 'สิบเยน', tags: ['number'] },
    { word: 'おいしい', reading: 'oishii', translation: 'อร่อย', example: 'このすしはおいしいです。', example_translation: 'ซูชิตัวนี้อร่อย', tags: ['adjective'] },
    { word: 'まずい', reading: 'mazui', translation: 'ไม่อร่อย', example: 'このりょうりはまずいです。', example_translation: 'อาหารนี้ไม่อร่อย', tags: ['adjective'] },
    { word: 'おおきい', reading: 'ookii', translation: 'ใหญ่', example: 'おおきいいえ', example_translation: 'บ้านหลังใหญ่', tags: ['adjective'] },
    { word: 'ちいさい', reading: 'chiisai', translation: 'เล็ก', example: 'ちいさいねこ', example_translation: 'แมวตัวเล็ก', tags: ['adjective'] },
    { word: 'たかい', reading: 'takai', translation: 'แพง', example: 'このくるまはたかいです。', example_translation: 'รถคันนี้แพง', tags: ['adjective'] },
    { word: 'やすい', reading: 'yasui', translation: 'ถูก / ราคาไม่แพง', example: 'このほんはやすいです。', example_translation: 'หนังสือเล่มนี้ราคาไม่แพง', tags: ['adjective'] },
    { word: 'あつい', reading: 'atsui', translation: 'ร้อน', example: 'きょうはあついですね。', example_translation: 'วันนี้ร้อนนะ', tags: ['adjective'] },
    { word: 'さむい', reading: 'samui', translation: 'หนาว', example: 'ふゆはさむいです。', example_translation: 'ฤดูหนาวหนาว', tags: ['adjective'] },
    { word: 'うれしい', reading: 'ureshii', translation: 'มีความสุข / ดีใจ', example: 'あなたにあえてうれしいです。', example_translation: 'ดีใจที่ได้พบคุณ', tags: ['adjective'] },
    { word: 'かなしい', reading: 'kanashii', translation: 'เศร้า', example: 'かなしいえいが', example_translation: 'ภาพยนตร์ที่เศร้า', tags: ['adjective'] },
    { word: 'こわい', reading: 'kowai', translation: 'น่ากลัว', example: 'このえいがはこわいです。', example_translation: 'ภาพยนตร์เรื่องนี้น่ากลัว', tags: ['adjective'] },
    { word: 'たのしい', reading: 'tanoshii', translation: 'สนุก', example: 'にほんごはたのしいです。', example_translation: 'ภาษาญี่ปุ่นสนุก', tags: ['adjective'] }
  ]
};
