'use strict';

// Japanese units 5-8: Elementary → Intermediate → Advanced
module.exports = [
  {
    title: 'กริยาและประโยคง่าย',
    description: 'กริยา verb groups และการสร้างประโยคเบื้องต้น',
    icon: '🔤',
    order_num: 90,
    level: 'N4',
    grammar_note: 'กริยา 3 กลุ่ม:\n\n① Group 1 (う-verbs): เปลี่ยน u→i + ます\n• かく(kaku)→かきます · のむ→のみます · はなす→はなします\n\n② Group 2 (る-verbs): ตัด る + ます\n• たべる→たべます · みる→みます\n\n③ Irregular: する→します · くる→きます\n\nรูปปฏิเสธ: ます→ません\nรูปอดีต: ます→ました · ません→ませんでした',
    cultural_note: 'ในภาษาญี่ปุ่น กริยาอยู่ท้ายประโยคเสมอ: わたしは りんごを たべます (ฉัน แอปเปิ้ล กิน) — ตรงข้ามกับภาษาไทยและอังกฤษ',
    lessons: [
      {
        title: 'กริยากลุ่ม 1 (う-verbs)',
        order_num: 1,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "กริยาใดต่อไปนี้เป็น Group 2 (る-verb) ที่แท้จริง?", options: ['かく (kaku)', 'のむ (nomu)', 'たべる (taberu)', 'はなす (hanasu)'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "masu-form ของ 'かく (to write)' คือ?", options: ['かきます', 'かくます', 'かけます', 'かいます'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "ประโยคใดถูกต้อง? (ฉันไปโรงเรียน)", options: ['わたしは がっこうを いきます。', 'わたしは がっこうに いきます。', 'わたしを がっこうに いきます。', 'わたしが がっこうで いきます。'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันกินข้าว', hint: 'ごはんを', answer: 'ごはんを たべます', alternatives: ['ごはんをたべます'] } },
          { type: 'translate', data: { prompt: 'คุณดื่มน้ำไหม?', hint: 'みずを　のみますか', answer: 'みずを のみますか', alternatives: ['みずをのみますか'] } },
          { type: 'fill_blank', data: { sentence: 'まいにち がっこうに ___。', translation: 'ทุกวันฉันไปโรงเรียน', options: ['のみます', 'いきます', 'たべます', 'みます'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคภาษาญี่ปุ่น', translation: 'ฉันดูทีวีทุกคืน', words: ['まいばん', 'テレビを', 'みます', 'わたしは'], answer: 'わたしは まいばん テレビを みます' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่กริยากับความหมาย', pairs: [{ left: 'たべます', right: 'กิน' }, { left: 'のみます', right: 'ดื่ม' }, { left: 'いきます', right: 'ไป' }, { left: 'みます', right: 'ดู' }] } }
        ]
      },
      {
        title: 'กริยากลุ่ม 2 (る-verbs) และ Negative',
        order_num: 2,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "'おきます' (okimasu) แปลว่าอะไร?", options: ['นอน', 'ตื่นนอน', 'อาบน้ำ', 'แต่งตัว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "Negative ของ 'たべます' คือ?", options: ['たべません', 'たべないます', 'たべくない', 'たべずます'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'わたしは さかなを たべません' แปลว่าอะไร?", options: ['ฉันชอบปลา', 'ฉันไม่กินปลา', 'ฉันกินปลา', 'ฉันซื้อปลา'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันไม่ดื่มเหล้า', hint: 'negative form', answer: 'わたしは おさけを のみません' } },
          { type: 'translate', data: { prompt: 'เธอตื่นนอนทุกเช้าตี 6', hint: 'おきます', answer: 'かのじょは まいあさ ろくじに おきます' } },
          { type: 'fill_blank', data: { sentence: 'わたしは コーヒーを ___。(ไม่ดื่มกาแฟ)', translation: 'ฉันไม่ดื่มกาแฟ', options: ['のみます', 'のみません', 'たべます', 'みます'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันไม่ไปทำงานวันเสาร์', words: ['どようびに', 'わたしは', 'しごとに', 'いきません'], answer: 'わたしは どようびに しごとに いきません' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ positive กับ negative', pairs: [{ left: 'たべます', right: 'たべません' }, { left: 'いきます', right: 'いきません' }, { left: 'のみます', right: 'のみません' }, { left: 'みます', right: 'みません' }] } }
        ]
      },
      {
        title: 'Past Tense (ました) และ Questions',
        order_num: 3,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "Past tense ของ 'いきます' คือ?", options: ['いきました', 'いきましん', 'いきたです', 'いきだした'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'きのう なにを たべましたか' แปลว่าอะไร?", options: ['วันนี้คุณกินอะไร?', 'เมื่อวานคุณกินอะไร?', 'คุณชอบกินอะไร?', 'คุณกินอะไรพรุ่งนี้?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'はい、たべました' แปลว่า?", options: ['ไม่ได้กิน', 'ใช่ กินแล้ว', 'อาจจะกิน', 'กำลังกิน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เมื่อวานฉันดูหนัง', hint: 'past tense', answer: 'きのう えいがを みました' } },
          { type: 'translate', data: { prompt: 'คุณไปโตเกียวไหม? (ถามอดีต)', hint: 'past question', answer: 'とうきょうに いきましたか' } },
          { type: 'fill_blank', data: { sentence: 'きのう ともだちに ___。(โทรหาเพื่อน)', translation: 'เมื่อวานฉันโทรหาเพื่อน', options: ['でんわしました', 'でんわします', 'でんわしません', 'でんわしましょう'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'เมื่อคืนฉันเรียนภาษาญี่ปุ่น', words: ['ゆうべ', 'にほんごを', 'わたしは', 'べんきょうしました'], answer: 'わたしは ゆうべ にほんごを べんきょうしました' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ present กับ past', pairs: [{ left: 'たべます', right: 'たべました' }, { left: 'いきます', right: 'いきました' }, { left: 'みます', right: 'みました' }, { left: 'かいます', right: 'かいました' }] } }
        ]
      }
    ]
  },

  {
    title: 'Particles & Grammar',
    description: 'อนุภาค は・が・を・に・で และโครงสร้างสำคัญ',
    icon: '⚙️',
    order_num: 100,
    level: 'N4',
    grammar_note: 'อนุภาค (Particles) — หัวใจของภาษาญี่ปุ่น:\n\n• は (wa) = Topic marker "เรื่องที่พูดถึง"\n  わたしは がくせいです。= ฉัน(topic) เป็นนักเรียน\n\n• が (ga) = Subject marker "ผู้กระทำ"\n  ねこが います。= มีแมว(subject)อยู่\n\n• を (wo) = Object marker "สิ่งที่ถูกกระทำ"\n  りんごを たべます。= กินแอปเปิ้ล\n\n• に (ni) = Direction / Time / Target\n  がっこうに いきます。= ไปโรงเรียน\n\n• で (de) = Place of action / Means\n  バスで いきます。= ไปด้วยรถบัส',
    cultural_note: 'は vs が ใช้ยากที่สุดในภาษาญี่ปุ่น — Rule of thumb: は ใช้เมื่อเป็น topic ที่รู้จักกันแล้ว, が ใช้เมื่อแนะนำสิ่งใหม่หรือเน้น subject',
    lessons: [
      {
        title: 'Particles は・が・を',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "อนุภาค 'を' ใช้ทำอะไร?", options: ['บอกตำแหน่ง', 'บอก topic', 'บอก direct object', 'บอก subject ใหม่'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "ประโยคใดถูกต้อง?", options: ['わたしが ほんを よみます。', 'わたしを ほんが よみます。', 'わたしに ほんを よみます。', 'わたしで ほんを よみます。'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'が' ต่างจาก 'は' อย่างไรในประโยคนี้?", options: ['は=topic/contrast, が=neutral subject', 'ไม่ต่างกัน', 'が=object, は=subject', 'ใช้แทนกันได้เสมอ'], correct: 0 } },
          { type: 'translate', data: { prompt: 'ฉันอ่านหนังสือ (は)', hint: 'topic marker', answer: 'わたしは ほんを よみます' } },
          { type: 'translate', data: { prompt: 'ใครกิน? ฉันกิน! (が)', hint: 'subject marker', answer: 'わたしが たべます' } },
          { type: 'fill_blank', data: { sentence: 'これ___ なんですか。(นี่คืออะไร?)', translation: 'นี่คืออะไร?', options: ['は', 'が', 'を', 'に'], correct: 0 } },
          { type: 'fill_blank', data: { sentence: 'みず___ のみます。(ดื่มน้ำ)', translation: 'ดื่มน้ำ', options: ['は', 'が', 'を', 'に'], correct: 2 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อนุภาคกับการใช้งาน', pairs: [{ left: 'は', right: 'topic/สิ่งที่พูดถึง' }, { left: 'が', right: 'subject (เน้น)' }, { left: 'を', right: 'direct object' }, { left: 'も', right: 'ด้วย/เช่นกัน' }] } }
        ]
      },
      {
        title: 'Particles に・で・へ・と',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "'としょかんで べんきょうします' — 'で' บอกอะไร?", options: ['ทิศทาง', 'สถานที่ทำกิจกรรม', 'เวลา', 'วิธีการ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'に' ใช้บอกอะไรในประโยค 'うちに かえります'?", options: ['เวลา', 'เครื่องมือ', 'จุดหมาย/ทิศทาง', 'สถานที่ทำกิจกรรม'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'ともだちと いきます' — 'と' บอกอะไร?", options: ['เวลา', 'สถานที่', 'ไปกับใคร', 'วิธีเดินทาง'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ฉันไปกับเพื่อน', hint: 'ともだちと', answer: 'ともだちと いきます' } },
          { type: 'translate', data: { prompt: 'เรียนที่ห้องสมุด', hint: 'としょかんで', answer: 'としょかんで べんきょうします' } },
          { type: 'fill_blank', data: { sentence: 'バスで がっこう___ いきます。(ไปโรงเรียนด้วยรถเมล์)', translation: 'ไปโรงเรียนด้วยรถเมล์', options: ['で', 'が', 'に', 'を'], correct: 2 } },
          { type: 'fill_blank', data: { sentence: 'かぞく___ レストランで たべました。(กินข้าวกับครอบครัวที่ร้านอาหาร)', translation: 'กินข้าวกับครอบครัวที่ร้านอาหาร', options: ['に', 'と', 'で', 'が'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันไปห้องสมุดกับเพื่อนทุกวันเสาร์', words: ['どようびに', 'ともだちと', 'としょかんに', 'いきます', 'わたしは'], answer: 'わたしは どようびに ともだちと としょかんに いきます' } }
        ]
      },
      {
        title: 'Te-form & Connecting Sentences',
        order_num: 3,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "Te-form ของ 'たべます' คือ?", options: ['たべて', 'たべた', 'たべく', 'たべたい'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'〜てから' ใช้เพื่ออะไร?", options: ['บอกเหตุผล', 'บอกลำดับก่อนหลัง', 'บอกความปรารถนา', 'บอกการขอ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'〜てください' ใช้สำหรับ?", options: ['ห้ามทำ', 'ขอร้องให้ทำ', 'ทำอยู่ตอนนี้', 'อยากทำ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'กรุณานั่งลง (ขอร้อง)', hint: 'すわる→すわって', answer: 'すわってください' } },
          { type: 'translate', data: { prompt: 'หลังจากกินแล้ว ฉันนอน', hint: 'てから', answer: 'たべてから ねます' } },
          { type: 'fill_blank', data: { sentence: 'てを ___ から、たべてください。(ล้างมือก่อนกิน)', translation: 'ล้างมือก่อนแล้วกิน', options: ['あらいます', 'あらって', 'あらった', 'あらう'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'กรุณาช่วยเปิดหน้าต่างด้วย', words: ['まどを', 'あけて', 'ください'], answer: 'まどを あけて ください' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ dictionary form กับ te-form', pairs: [{ left: 'たべます', right: 'たべて' }, { left: 'いきます', right: 'いって' }, { left: 'のみます', right: 'のんで' }, { left: 'みます', right: 'みて' }] } }
        ]
      }
    ]
  },

  {
    title: 'Daily Conversations',
    description: 'สนทนาในชีวิตประจำวัน — ช้อปปิ้ง, ร้านอาหาร, โทรศัพท์',
    icon: '💬',
    order_num: 120,
    level: 'N3',
    grammar_note: 'โครงสร้างสำคัญระดับ N3:\n\n• て-form ต่อกริยา: たべて、のんで、ねます (กิน ดื่ม แล้วนอน)\n\n• たい = ต้องการ/อยาก:\n  すしを たべたい。= อยากกินซูชิ\n\n• ～てください = ขอให้ทำ:\n  ちょっと まってください。= รอสักครู่นะ\n\n• ～てもいいですか = ขออนุญาต:\n  はいってもいいですか？= ขอเข้าไปได้ไหม?\n\n• から / ので = เพราะว่า (เหตุผล)',
    cultural_note: 'ในร้านอาหารญี่ปุ่น เรียกพนักงานด้วย "すみません!" ไม่ใช่โบกมือ และไม่ต้องทิป — ถือว่าหยาบคายในญี่ปุ่น',
    lessons: [
      {
        title: 'ที่ร้านอาหาร',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "จะสั่งอาหารอย่างไรในภาษาญี่ปุ่น?", options: ['これ、たべます', 'これを ください', 'これが たべたい', 'これは いいです'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'おかいけい おねがいします' หมายถึงอะไร?", options: ['ขอเมนูหน่อย', 'ขอเก้าอี้หน่อย', 'ขอเก็บเงินด้วย', 'ขอน้ำหน่อย'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'〜を ひとつ ください' แปลว่าอะไร?", options: ['ขอ…สองอัน', 'ขอ…หนึ่งอัน', 'ไม่ต้องการ…', 'ขอดู…หน่อย'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ขอน้ำหนึ่งแก้ว', hint: 'みずを', answer: 'みずを ひとつ ください' } },
          { type: 'translate', data: { prompt: 'นี่อร่อยมาก', hint: 'おいしい', answer: 'これは とても おいしいです', alternatives: ['とても おいしいです'] } },
          { type: 'fill_blank', data: { sentence: 'すみません、メニューを ___ ください。(ขอเมนูหน่อย)', translation: 'ขอโทษนะ ขอเมนูหน่อยได้ไหม', options: ['みて', 'みせて', 'あげて', 'くれて'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคสั่งอาหาร', translation: 'ขอราเมนหนึ่งชามและเบียร์หนึ่งขวด', words: ['ラーメンを', 'ひとつと', 'ビールを', 'ひとつ', 'ください'], answer: 'ラーメンを ひとつと ビールを ひとつ ください' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคร้านอาหาร', pairs: [{ left: 'いらっしゃいませ', right: 'ยินดีต้อนรับ' }, { left: 'おかいけい', right: 'เก็บเงิน/บิล' }, { left: 'おいしい', right: 'อร่อย' }, { left: 'からい', right: 'เผ็ด' }] } }
        ]
      },
      {
        title: 'ช้อปปิ้งและการซื้อของ',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "'これは いくらですか' แปลว่าอะไร?", options: ['นี่คืออะไร?', 'นี่ราคาเท่าไหร่?', 'คุณมีนี่ไหม?', 'นี่ขนาดไหน?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'もっと やすい ものは ありますか' หมายถึงอะไร?", options: ['มีสิ่งที่ถูกกว่านี้ไหม?', 'มีสิ่งที่แพงกว่าไหม?', 'ราคาเท่าไหร่?', 'ลดได้ไหม?'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'これを ください' กับ 'これに します' ต่างกันอย่างไร?", options: ['ไม่ต่างกัน', 'ください=ขอเลย, にします=ตัดสินใจเลือก', 'ください=แพง, にします=ถูก', 'ください=formal, にします=informal'], correct: 1 } },
          { type: 'translate', data: { prompt: 'มีสีดำไหม?', hint: 'くろい', answer: 'くろい いろは ありますか', alternatives: ['くろは ありますか'] } },
          { type: 'translate', data: { prompt: 'ผมจะเอาอันนี้', hint: 'これにします', answer: 'これに します' } },
          { type: 'fill_blank', data: { sentence: 'このシャツは ___ ですか。(ราคาเท่าไหร่?)', translation: 'เสื้อตัวนี้ราคาเท่าไหร่?', options: ['なに', 'だれ', 'いくら', 'どこ'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคช้อปปิ้ง', translation: 'ขนาด M มีไหม?', words: ['Mサイズは', 'ありますか'], answer: 'Mサイズは ありますか' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำช้อปปิ้ง', pairs: [{ left: 'たかい', right: 'แพง' }, { left: 'やすい', right: 'ถูก' }, { left: 'おおきい', right: 'ใหญ่' }, { left: 'ちいさい', right: 'เล็ก' }] } }
        ]
      },
      {
        title: 'สนทนาทั่วไปและสำนวน',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: "'〜と おもいます' ใช้สำหรับอะไร?", options: ['บอกเวลา', 'บอกความคิดเห็น', 'บอกตำแหน่ง', 'บอกคำสั่ง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'〜かもしれません' หมายถึงอะไร?", options: ['แน่ใจ 100%', 'อาจจะ/เป็นไปได้', 'ไม่ใช่แน่ๆ', 'ต้องแน่นอน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'〜たいです' ใช้สำหรับ?", options: ['บอกว่าชอบ', 'บอกความต้องการอยากทำ', 'บอกว่าเก่ง', 'บอกอดีต'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันคิดว่าเขาเก่งมาก', hint: 'とおもいます', answer: 'かれは とても じょうずだと おもいます' } },
          { type: 'translate', data: { prompt: 'ฉันอยากไปญี่ปุ่น', hint: 'たいです', answer: 'にほんに いきたいです' } },
          { type: 'fill_blank', data: { sentence: 'あした あめが ふる ___ しれません。(อาจจะฝนตกพรุ่งนี้)', translation: 'พรุ่งนี้อาจจะฝนตก', options: ['かも', 'でも', 'だから', 'ので'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันอยากกินซูชิที่ญี่ปุ่น', words: ['にほんで', 'すしを', 'たべたいです', 'わたしは'], answer: 'わたしは にほんで すしを たべたいです' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สำนวนกับความหมาย', pairs: [{ left: 'たいです', right: 'อยากทำ' }, { left: 'かもしれません', right: 'อาจจะ' }, { left: 'とおもいます', right: 'ฉันคิดว่า' }, { left: 'てもいいです', right: 'ทำได้' }] } }
        ]
      }
    ]
  },

  {
    title: 'Keigo & Advanced',
    description: 'ภาษาสุภาพ (เกโกะ) และไวยากรณ์ขั้นสูง',
    icon: '🎎',
    order_num: 130,
    level: 'N3',
    grammar_note: 'Keigo (敬語) ภาษาสุภาพ 3 ระดับ:\n\n① 丁寧語 (Teineigo) = สุภาพทั่วไป: ます/です\n\n② 尊敬語 (Sonkeigo) = ยกย่องผู้อื่น:\n• いる → いらっしゃる\n• 食べる → 召し上がる\n• 言う → おっしゃる\n\n③ 謙譲語 (Kenjougo) = ถ่อมตัว:\n• いる → おります\n• 食べる → いただく\n• 言う → 申す\n\nใช้ Keigo กับ: หัวหน้า ลูกค้า ผู้สูงอายุ',
    cultural_note: 'Keigo ไม่ใช่แค่ภาษา — มันสะท้อน hierarchy ของสังคมญี่ปุ่น ที่ทำงานญี่ปุ่นคุณต้องพูด Keigo กับหัวหน้าตลอดเวลา แม้จะรู้จักกันนาน',
    lessons: [
      {
        title: 'Keigo เบื้องต้น (ภาษาสุภาพ)',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: "Keigo แบบ 'ていねい語' คืออะไร?", options: ['ภาษาสแลง', 'ภาษาสุภาพพื้นฐาน (ます/です)', 'ภาษาราชการมาก', 'ภาษาเด็ก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'いただきます' (ก่อนกิน) มาจาก keigo แบบใด?", options: ['sonkeigo', 'kenjogo', 'teineigo', 'futsugo'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "Humble form ของ 'いきます' ใน keigo คือ?", options: ['いらっしゃいます', 'まいります', 'おいでになります', 'いかれます'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันจะไป (humble)', hint: 'まいります', answer: 'まいります' } },
          { type: 'translate', data: { prompt: 'คุณจะไปไหน? (honorific)', hint: 'いらっしゃいます', answer: 'どちらに いらっしゃいますか' } },
          { type: 'fill_blank', data: { sentence: 'しょうしょう おまち ___ (กรุณารอสักครู่)', translation: 'กรุณารอสักครู่', options: ['ください', 'ます', 'です', 'くださいませ'], correct: 3 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค keigo', translation: 'ขอบคุณมากที่ได้พบกัน', words: ['おあいできて', 'こうえいです', 'たいへん'], answer: 'たいへん おあいできて こうえいです' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ normal กับ keigo', pairs: [{ left: 'いきます', right: 'まいります (humble)' }, { left: 'います', right: 'おります (humble)' }, { left: 'いいます', right: 'もうします (humble)' }, { left: 'もらいます', right: 'いただきます (humble)' }] } }
        ]
      },
      {
        title: 'Conditional & Complex Grammar',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: "'〜たら' ใช้สำหรับอะไร?", options: ['เหตุผล', 'เงื่อนไข (ถ้า...แล้ว)', 'ความปรารถนา', 'ห้ามทำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'〜ば' ต่างจาก '〜たら' อย่างไร?", options: ['ไม่ต่างกัน', 'ば=เงื่อนไขทั่วไป, たら=จบแล้วถึง', 'ば=อดีต, たら=อนาคต', 'ば=negative, たら=positive'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'〜のに' บอกอะไร?", options: ['เหตุผลปกติ', 'ความขัดแย้ง/ผิดคาด', 'เงื่อนไข', 'คำสั่ง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ถ้าฝนตก ฉันจะไม่ออกไป', hint: 'あめがふったら', answer: 'あめが ふったら、でかけません' } },
          { type: 'translate', data: { prompt: 'ทั้งที่เรียนเยอะ แต่สอบตก', hint: 'のに', answer: 'こんなに べんきょうしたのに、しけんに おちました' } },
          { type: 'fill_blank', data: { sentence: 'もっと はやく くれば、まにあった ___。(ถ้ามาเร็วกว่านี้ คงทัน)', translation: 'ถ้ามาเร็วกว่านี้ก็คงทัน', options: ['のに', 'から', 'ので', 'が'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค conditional', translation: 'ถ้าคุณมีเวลา ลองมาเที่ยวบ้านฉันสิ', words: ['じかんが', 'あったら', 'うちに', 'きてください'], answer: 'じかんが あったら うちに きてください' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับความหมาย', pairs: [{ left: 'たら', right: 'ถ้า...แล้ว (sequential)' }, { left: 'のに', right: 'ทั้งที่... แต่... (ผิดคาด)' }, { left: 'ので', right: 'เพราะว่า (objective)' }, { left: 'ながら', right: 'ขณะที่ (ทำพร้อมกัน)' }] } }
        ]
      },
      {
        title: 'JLPT N4 Vocabulary & Review',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: "'けいけん' (経験) แปลว่าอะไร?", options: ['เวลา', 'ประสบการณ์', 'ความสนใจ', 'ความสามารถ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'しゅみ' (趣味) แปลว่าอะไร?", options: ['อาชีพ', 'ครอบครัว', 'งานอดิเรก', 'ความฝัน'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'〜について' ใช้สำหรับอะไร?", options: ['บอกเวลา', 'บอกเรื่องราว/เกี่ยวกับ', 'บอกตำแหน่ง', 'บอกเหตุผล'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันสนใจเรื่องวัฒนธรรมญี่ปุ่น', hint: 'きょうみがあります', answer: 'にほんの ぶんかに きょうみが あります' } },
          { type: 'translate', data: { prompt: 'คุณมีประสบการณ์ทำงานไหม?', hint: 'しごとのけいけん', answer: 'しごとの けいけんは ありますか' } },
          { type: 'fill_blank', data: { sentence: 'にほんの れきし___ しらべています。(ศึกษาเกี่ยวกับประวัติศาสตร์ญี่ปุ่น)', translation: 'กำลังศึกษาเรื่องประวัติศาสตร์ญี่ปุ่น', options: ['が', 'を', 'について', 'に'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคขั้นสูง', translation: 'ฉันอยากเข้าใจวัฒนธรรมญี่ปุ่นให้ลึกซึ้งยิ่งขึ้น', words: ['にほんの', 'ぶんかを', 'もっと', 'ふかく', 'りかいしたいです'], answer: 'にほんの ぶんかを もっと ふかく りかいしたいです' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำ N4', pairs: [{ left: 'けいけん', right: 'ประสบการณ์' }, { left: 'きかい', right: 'โอกาส' }, { left: 'もくひょう', right: 'เป้าหมาย' }, { left: 'どりょく', right: 'ความพยายาม' }] } }
        ]
      }
    ]
  }
];
