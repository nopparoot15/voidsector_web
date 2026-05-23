'use strict';

module.exports = {
  code: 'en',
  name: 'English',
  native_name: 'English',
  flag: '🇬🇧',
  units: [
    {
      title: 'Greetings',
      description: 'คำทักทายพื้นฐานที่ใช้ทุกวัน',
      icon: '👋',
      order_num: 1,
      level: 'A1',
      grammar_note: 'คำทักทายพื้นฐาน:\n• Hello / Hi = สวัสดี (Hi ไม่ทางการกว่า)\n• Goodbye / Bye = ลาก่อน\n• Thank you / Thanks = ขอบคุณ\n• Sorry / Excuse me = ขอโทษ\n• Please = กรุณา\n\nรูปประโยค: [คำทักทาย], my name is [ชื่อ]. เช่น Hello, my name is Sara.',
      cultural_note: 'คนอังกฤษและอเมริกันจะทักทายกันด้วย "How are you?" หรือ "How\'s it going?" แต่ไม่ได้ถามจริง — ตอบแค่ "Fine, thanks!" หรือ "Good, you?" ก็พอ',
      lessons: [
        {
          title: 'Hello & Goodbye',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Hello' แปลว่าอะไร?", options: ['สวัสดี', 'ลาก่อน', 'ขอบคุณ', 'กรุณา'], correct: 0 } },
            { type: 'multiple_choice', data: { question: "'Goodbye' แปลว่าอะไร?", options: ['สวัสดี', 'ลาก่อน', 'ยินดี', 'ขอโทษ'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "คำใดหมายถึง 'สวัสดี' (ทักทายไม่เป็นทางการ)?", options: ['Bye', 'Hi', 'Sorry', 'No'], correct: 1 } },
            { type: 'translate', data: { prompt: 'สวัสดี', hint: 'การทักทาย', answer: 'hello', alternatives: ['hi', 'hey'] } },
            { type: 'translate', data: { prompt: 'ลาก่อน', hint: 'การอำลา', answer: 'goodbye', alternatives: ['bye', 'see you'] } },
            { type: 'fill_blank', data: { sentence: '___, my name is Sara.', translation: 'สวัสดี ฉันชื่อซาร่า', options: ['Goodbye', 'Hello', 'Sorry', 'No'], correct: 1 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'สวัสดี ยินดีที่ได้รู้จัก', words: ['Hello', 'nice', 'to', 'meet', 'you'], answer: 'Hello nice to meet you' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'hello', right: 'สวัสดี' }, { left: 'bye', right: 'ลาก่อน' }, { left: 'hi', right: 'หวัดดี' }, { left: 'goodbye', right: 'ลาก่อน (ทางการ)' }] } }
          ]
        },
        {
          title: 'Polite Words',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Thank you' แปลว่าอะไร?", options: ['กรุณา', 'ขอบคุณ', 'ขอโทษ', 'ยินดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Please' แปลว่าอะไร?", options: ['ขอบคุณ', 'ยินดี', 'กรุณา / ได้โปรด', 'ขอโทษ'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Sorry' แปลว่าอะไร?", options: ['ขอบคุณ', 'กรุณา', 'ยินดี', 'ขอโทษ'], correct: 3 } },
            { type: 'multiple_choice', data: { question: "ตอบรับ 'Thank you' อย่างไร?", options: ['Sorry', 'Please', "You're welcome", 'Goodbye'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ขอบคุณ', hint: 'คำขอบคุณ', answer: 'thank you', alternatives: ['thanks'] } },
            { type: 'translate', data: { prompt: 'ขอโทษ', hint: 'คำขอโทษ', answer: 'sorry', alternatives: ['excuse me', 'i am sorry'] } },
            { type: 'fill_blank', data: { sentence: '___, can you help me?', translation: 'กรุณา คุณช่วยฉันได้ไหม', options: ['Goodbye', 'Sorry', 'Please', 'Thanks'], correct: 2 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'ขอบคุณมากนะ', words: ['Thank', 'you', 'so', 'much'], answer: 'Thank you so much' } }
          ]
        },
        {
          title: 'Yes & No',
          order_num: 3,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Yes' แปลว่าอะไร?", options: ['ไม่ใช่', 'ใช่', 'โอเค', 'ดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'No' แปลว่าอะไร?", options: ['ใช่', 'ไม่ใช่', 'ดีมาก', 'โอเค'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Okay' แปลว่าอะไร?", options: ['ไม่ใช่', 'โอเค / ตกลง', 'ขอบคุณ', 'ขอโทษ'], correct: 1 } },
            { type: 'translate', data: { prompt: 'ใช่', hint: 'การยืนยัน', answer: 'yes', alternatives: ['yeah', 'yep'] } },
            { type: 'translate', data: { prompt: 'ไม่ใช่', hint: 'การปฏิเสธ', answer: 'no', alternatives: ['nope'] } },
            { type: 'fill_blank', data: { sentence: 'A: Are you happy? B: ___, I am!', translation: 'ก: คุณมีความสุขไหม? ข: ใช่ ฉันมีความสุข!', options: ['No', 'Sorry', 'Yes', 'Please'], correct: 2 } },
            { type: 'fill_blank', data: { sentence: 'A: Is this your bag? B: ___, it is not.', translation: 'ก: นี่กระเป๋าคุณไหม? ข: ไม่ใช่', options: ['Yes', 'No', 'Okay', 'Good'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'yes', right: 'ใช่' }, { left: 'no', right: 'ไม่ใช่' }, { left: 'okay', right: 'โอเค' }, { left: 'good', right: 'ดี' }] } }
          ]
        }
      ]
    },
    {
      title: 'Numbers',
      description: 'ตัวเลข 1 ถึง 10',
      icon: '🔢',
      order_num: 2,
      level: 'A1',
      grammar_note: 'ตัวเลข 1-10:\none · two · three · four · five · six · seven · eight · nine · ten\n\nถามจำนวน: How many [คำนามพหูพจน์]? เช่น How many cats? → Three cats.\nตัวเลขอยู่หน้าคำนาม: two dogs, five books',
      cultural_note: 'ตัวเลข 13 (thirteen) และ 30 (thirty) ออกเสียงใกล้เคียงกัน ฟังให้ดี — 13 เน้น -TEEN, 30 เน้น THIR-',
      lessons: [
        {
          title: '1 to 5',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'One' แปลว่าอะไร?", options: ['สอง', 'หนึ่ง', 'สาม', 'สี่'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Three' แปลว่าอะไร?", options: ['สอง', 'สี่', 'สาม', 'ห้า'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "เลข 2 ภาษาอังกฤษคือ?", options: ['one', 'three', 'two', 'four'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "เลข 5 ภาษาอังกฤษคือ?", options: ['four', 'three', 'two', 'five'], correct: 3 } },
            { type: 'translate', data: { prompt: 'หนึ่ง', hint: 'ตัวเลข', answer: 'one', alternatives: ['1'] } },
            { type: 'translate', data: { prompt: 'สี่', hint: 'ตัวเลข', answer: 'four', alternatives: ['4'] } },
            { type: 'fill_blank', data: { sentence: 'I have ___ cats.', translation: 'ฉันมีแมวสามตัว', options: ['one', 'three', 'five', 'four'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขกับคำ', pairs: [{ left: 'one', right: 'หนึ่ง' }, { left: 'two', right: 'สอง' }, { left: 'three', right: 'สาม' }, { left: 'four', right: 'สี่' }] } }
          ]
        },
        {
          title: '6 to 10',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Six' แปลว่าอะไร?", options: ['เจ็ด', 'แปด', 'หก', 'เก้า'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Nine' แปลว่าอะไร?", options: ['หก', 'เจ็ด', 'แปด', 'เก้า'], correct: 3 } },
            { type: 'multiple_choice', data: { question: "เลข 10 ภาษาอังกฤษคือ?", options: ['eight', 'nine', 'six', 'ten'], correct: 3 } },
            { type: 'multiple_choice', data: { question: "เลข 7 ภาษาอังกฤษคือ?", options: ['nine', 'seven', 'six', 'eight'], correct: 1 } },
            { type: 'translate', data: { prompt: 'แปด', hint: 'ตัวเลข', answer: 'eight', alternatives: ['8'] } },
            { type: 'translate', data: { prompt: 'สิบ', hint: 'ตัวเลข', answer: 'ten', alternatives: ['10'] } },
            { type: 'fill_blank', data: { sentence: 'She is ___ years old.', translation: 'เธออายุแปดปี', options: ['six', 'seven', 'eight', 'nine'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขกับคำ', pairs: [{ left: 'six', right: 'หก' }, { left: 'seven', right: 'เจ็ด' }, { left: 'eight', right: 'แปด' }, { left: 'ten', right: 'สิบ' }] } }
          ]
        },
        {
          title: 'Count Together',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: "'I have five dogs.' หมายความว่าอะไร?", options: ['ฉันมีสุนัขสามตัว', 'ฉันมีสุนัขสี่ตัว', 'ฉันมีสุนัขห้าตัว', 'ฉันมีสุนัขหกตัว'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "ฉันมีแมวสองตัว ภาษาอังกฤษคือ?", options: ['I have one cat.', 'I have two cats.', 'I have three cats.', 'I have four cats.'], correct: 1 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'ฉันเห็นนกสิบตัว', words: ['I', 'see', 'ten', 'birds'], answer: 'I see ten birds' } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'เธอมีดินสอเจ็ดแท่ง', words: ['She', 'has', 'seven', 'pencils'], answer: 'She has seven pencils' } },
            { type: 'fill_blank', data: { sentence: 'There are ___ apples on the table.', translation: 'มีแอปเปิ้ลหกลูกอยู่บนโต๊ะ', options: ['four', 'five', 'six', 'seven'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ฉันมีหนังสือสามเล่ม', hint: 'ประโยค I have...', answer: 'I have three books', alternatives: [] } },
            { type: 'multiple_choice', data: { question: "'Eight plus two equals ten.' แปลว่า?", options: ['แปดลบสองเท่ากับหก', 'แปดบวกสองเท่ากับสิบ', 'แปดคูณสองเท่ากับสิบ', 'แปดหารสองเท่ากับสี่'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขกับคำ', pairs: [{ left: 'five', right: 'ห้า' }, { left: 'nine', right: 'เก้า' }, { left: 'six', right: 'หก' }, { left: 'three', right: 'สาม' }] } }
          ]
        }
      ]
    },
    {
      title: 'Animals',
      description: 'สัตว์รอบตัวเรา',
      icon: '🐾',
      order_num: 3,
      level: 'A2',
      grammar_note: 'คำนามเอกพจน์/พหูพจน์:\n• a/an + เอกพจน์: a cat, an elephant\n• เติม -s/-es: cats, dogs, foxes\n• ผิดปกติ: mouse→mice, fish→fish\n\nคำคุณศัพท์อยู่หน้าคำนาม: a big dog, a small cat\nกริยา to be: The dog is big. The cats are small.',
      cultural_note: 'สัตว์เลี้ยงยอดนิยมในอังกฤษ/อเมริกาคือสุนัขและแมว — มักถูกมองเป็นสมาชิกครอบครัว ไม่ใช่แค่สัตว์เลี้ยง',
      lessons: [
        {
          title: 'Pets',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Cat' แปลว่าอะไร?", options: ['สุนัข', 'ปลา', 'แมว', 'กระต่าย'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Dog' แปลว่าอะไร?", options: ['แมว', 'สุนัข', 'กระต่าย', 'ปลา'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Fish' แปลว่าอะไร?", options: ['กระต่าย', 'สุนัข', 'แมว', 'ปลา'], correct: 3 } },
            { type: 'translate', data: { prompt: 'กระต่าย', hint: 'สัตว์เลี้ยง', answer: 'rabbit', alternatives: ['bunny'] } },
            { type: 'translate', data: { prompt: 'แมว', hint: 'สัตว์เลี้ยง', answer: 'cat', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'My ___ is very cute.', translation: 'สุนัขของฉันน่ารักมาก', options: ['fish', 'dog', 'cat', 'rabbit'], correct: 1 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'ฉันมีแมวสองตัวและสุนัขหนึ่งตัว', words: ['I', 'have', 'two', 'cats', 'and', 'one', 'dog'], answer: 'I have two cats and one dog' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่สัตว์กับความหมาย', pairs: [{ left: 'cat', right: 'แมว' }, { left: 'dog', right: 'สุนัข' }, { left: 'fish', right: 'ปลา' }, { left: 'rabbit', right: 'กระต่าย' }] } }
          ]
        },
        {
          title: 'Wild Animals',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Elephant' แปลว่าอะไร?", options: ['เสือ', 'ลิง', 'ช้าง', 'นก'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Tiger' แปลว่าอะไร?", options: ['ช้าง', 'เสือ', 'ลิง', 'นก'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Bird' แปลว่าอะไร?", options: ['นก', 'ลิง', 'ช้าง', 'เสือ'], correct: 0 } },
            { type: 'translate', data: { prompt: 'ลิง', hint: 'สัตว์ป่า', answer: 'monkey', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ช้าง', hint: 'สัตว์ขนาดใหญ่', answer: 'elephant', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'The ___ is very big.', translation: 'ช้างตัวนั้นตัวใหญ่มาก', options: ['bird', 'monkey', 'elephant', 'tiger'], correct: 2 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'เสือวิ่งเร็วมาก', words: ['The', 'tiger', 'runs', 'very', 'fast'], answer: 'The tiger runs very fast' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่สัตว์กับความหมาย', pairs: [{ left: 'elephant', right: 'ช้าง' }, { left: 'tiger', right: 'เสือ' }, { left: 'monkey', right: 'ลิง' }, { left: 'bird', right: 'นก' }] } }
          ]
        },
        {
          title: 'Describe Animals',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Big' แปลว่าอะไร?", options: ['เล็ก', 'เร็ว', 'ช้า', 'ใหญ่'], correct: 3 } },
            { type: 'multiple_choice', data: { question: "'Small' แปลว่าอะไร?", options: ['เล็ก', 'ใหญ่', 'เร็ว', 'น่ารัก'], correct: 0 } },
            { type: 'multiple_choice', data: { question: "The rabbit is ___. (กระต่ายตัวเล็ก)", options: ['big', 'fast', 'small', 'slow'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "The elephant is ___. (ช้างตัวใหญ่)", options: ['small', 'big', 'fast', 'cute'], correct: 1 } },
            { type: 'translate', data: { prompt: 'น่ารัก', hint: 'คุณสมบัติ', answer: 'cute', alternatives: ['adorable'] } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'นกตัวเล็กน่ารัก', words: ['The', 'small', 'bird', 'is', 'cute'], answer: 'The small bird is cute' } },
            { type: 'fill_blank', data: { sentence: 'The ___ elephant is in the forest.', translation: 'ช้างตัวใหญ่อยู่ในป่า', options: ['small', 'big', 'fast', 'cute'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำคุณศัพท์', pairs: [{ left: 'big', right: 'ใหญ่' }, { left: 'small', right: 'เล็ก' }, { left: 'fast', right: 'เร็ว' }, { left: 'cute', right: 'น่ารัก' }] } }
          ]
        }
      ]
    },
    {
      title: 'Food & Drinks',
      description: 'อาหารและเครื่องดื่ม',
      icon: '🍜',
      order_num: 4,
      level: 'A2',
      grammar_note: 'สั่งอาหาร/ถามความชอบ:\n• I\'d like... / Can I have...? = ขอ...\n• Would you like...? = อยากได้...ไหม?\n• I like / I don\'t like + noun\n\nนับไม่ได้ (uncountable): water, rice, milk → some water, a glass of milk\nนับได้ (countable): apple → an apple, two apples',
      cultural_note: 'ในร้านอาหารอังกฤษ/อเมริกา ทิปประมาณ 15-20% เป็นมารยาทปกติ และพนักงานจะไม่เติมน้ำให้อัตโนมัติ ต้องขอเอง',
      lessons: [
        {
          title: 'Fruits',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Apple' แปลว่าอะไร?", options: ['กล้วย', 'ส้ม', 'มะม่วง', 'แอปเปิ้ล'], correct: 3 } },
            { type: 'multiple_choice', data: { question: "'Banana' แปลว่าอะไร?", options: ['ส้ม', 'กล้วย', 'แอปเปิ้ล', 'มะม่วง'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Mango' แปลว่าอะไร?", options: ['กล้วย', 'แอปเปิ้ล', 'มะม่วง', 'ส้ม'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ส้ม', hint: 'ผลไม้', answer: 'orange', alternatives: [] } },
            { type: 'translate', data: { prompt: 'มะม่วง', hint: 'ผลไม้ไทย', answer: 'mango', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'I eat a red ___ every day.', translation: 'ฉันกินแอปเปิ้ลสีแดงทุกวัน', options: ['banana', 'orange', 'apple', 'mango'], correct: 2 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'เธอชอบกล้วยและมะม่วง', words: ['She', 'likes', 'bananas', 'and', 'mangoes'], answer: 'She likes bananas and mangoes' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ผลไม้กับความหมาย', pairs: [{ left: 'apple', right: 'แอปเปิ้ล' }, { left: 'banana', right: 'กล้วย' }, { left: 'orange', right: 'ส้ม' }, { left: 'mango', right: 'มะม่วง' }] } }
          ]
        },
        {
          title: 'Drinks',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: "'Water' แปลว่าอะไร?", options: ['นม', 'กาแฟ', 'น้ำ', 'น้ำผลไม้'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Milk' แปลว่าอะไร?", options: ['น้ำ', 'นม', 'กาแฟ', 'น้ำผลไม้'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Coffee' แปลว่าอะไร?", options: ['นม', 'น้ำ', 'น้ำผลไม้', 'กาแฟ'], correct: 3 } },
            { type: 'translate', data: { prompt: 'น้ำผลไม้', hint: 'เครื่องดื่ม', answer: 'juice', alternatives: ['fruit juice'] } },
            { type: 'translate', data: { prompt: 'นม', hint: 'เครื่องดื่ม', answer: 'milk', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'I drink ___ every morning.', translation: 'ฉันดื่มกาแฟทุกเช้า', options: ['milk', 'juice', 'water', 'coffee'], correct: 3 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'ฉันดื่มน้ำและนม', words: ['I', 'drink', 'water', 'and', 'milk'], answer: 'I drink water and milk' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่เครื่องดื่มกับความหมาย', pairs: [{ left: 'water', right: 'น้ำ' }, { left: 'milk', right: 'นม' }, { left: 'juice', right: 'น้ำผลไม้' }, { left: 'coffee', right: 'กาแฟ' }] } }
          ]
        },
        {
          title: 'Meals',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: "'I eat rice.' หมายความว่าอะไร?", options: ['ฉันดื่มน้ำ', 'ฉันกินขนมปัง', 'ฉันกินข้าว', 'ฉันกินผลไม้'], correct: 2 } },
            { type: 'multiple_choice', data: { question: "'Eat' แปลว่าอะไร?", options: ['ดื่ม', 'กิน', 'วิ่ง', 'นอน'], correct: 1 } },
            { type: 'multiple_choice', data: { question: "'Drink' แปลว่าอะไร?", options: ['กิน', 'นอน', 'ดื่ม', 'วิ่ง'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ฉันกินข้าว', hint: 'ประโยค I eat...', answer: 'I eat rice', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ฉันดื่มน้ำ', hint: 'ประโยค I drink...', answer: 'I drink water', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'I ___ an apple for breakfast.', translation: 'ฉันกินแอปเปิ้ลตอนเช้า', options: ['drink', 'sleep', 'eat', 'run'], correct: 2 } },
            { type: 'word_order', data: { instruction: 'เรียงคำให้ถูกต้อง', translation: 'เขากินกล้วยและดื่มนม', words: ['He', 'eats', 'a', 'banana', 'and', 'drinks', 'milk'], answer: 'He eats a banana and drinks milk' } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'eat', right: 'กิน' }, { left: 'drink', right: 'ดื่ม' }, { left: 'rice', right: 'ข้าว' }, { left: 'breakfast', right: 'อาหารเช้า' }] } }
          ]
        }
      ]
    }
  ],
  vocab: [
    { word: 'hello', reading: null, translation: 'สวัสดี', example: 'Hello, how are you?', example_translation: 'สวัสดี คุณเป็นยังไงบ้าง?', tags: ['greeting'] },
    { word: 'goodbye', reading: null, translation: 'ลาก่อน', example: 'Goodbye, see you tomorrow!', example_translation: 'ลาก่อน แล้วเจอกันพรุ่งนี้!', tags: ['greeting'] },
    { word: 'hi', reading: null, translation: 'หวัดดี', example: 'Hi! I am Tom.', example_translation: 'หวัดดี ฉันชื่อทอม', tags: ['greeting'] },
    { word: 'bye', reading: null, translation: 'บาย / ลาก่อน', example: 'Bye! Take care.', example_translation: 'บาย! ดูแลตัวเองด้วย', tags: ['greeting'] },
    { word: 'thank you', reading: null, translation: 'ขอบคุณ', example: 'Thank you for your help.', example_translation: 'ขอบคุณที่ช่วยเหลือ', tags: ['polite'] },
    { word: 'please', reading: null, translation: 'กรุณา / ได้โปรด', example: 'Please help me.', example_translation: 'กรุณาช่วยฉันด้วย', tags: ['polite'] },
    { word: 'sorry', reading: null, translation: 'ขอโทษ', example: 'Sorry, I am late.', example_translation: 'ขอโทษที่มาสาย', tags: ['polite'] },
    { word: "you're welcome", reading: null, translation: 'ยินดี', example: "You're welcome!", example_translation: 'ยินดีเลย!', tags: ['polite'] },
    { word: 'yes', reading: null, translation: 'ใช่', example: 'Yes, I understand.', example_translation: 'ใช่ ฉันเข้าใจ', tags: ['basic'] },
    { word: 'no', reading: null, translation: 'ไม่ใช่', example: 'No, thank you.', example_translation: 'ไม่ต้องขอบคุณ', tags: ['basic'] },
    { word: 'okay', reading: null, translation: 'โอเค / ตกลง', example: 'Okay, let us go.', example_translation: 'โอเค ไปกันเถอะ', tags: ['basic'] },
    { word: 'good', reading: null, translation: 'ดี', example: 'That is a good idea.', example_translation: 'นั่นเป็นความคิดที่ดี', tags: ['basic'] },
    { word: 'one', reading: null, translation: 'หนึ่ง', example: 'I have one brother.', example_translation: 'ฉันมีพี่ชายหนึ่งคน', tags: ['number'] },
    { word: 'two', reading: null, translation: 'สอง', example: 'I have two sisters.', example_translation: 'ฉันมีพี่สาวสองคน', tags: ['number'] },
    { word: 'three', reading: null, translation: 'สาม', example: 'There are three cats.', example_translation: 'มีแมวสามตัว', tags: ['number'] },
    { word: 'four', reading: null, translation: 'สี่', example: 'I have four books.', example_translation: 'ฉันมีหนังสือสี่เล่ม', tags: ['number'] },
    { word: 'five', reading: null, translation: 'ห้า', example: 'She has five dogs.', example_translation: 'เธอมีสุนัขห้าตัว', tags: ['number'] },
    { word: 'six', reading: null, translation: 'หก', example: 'There are six eggs.', example_translation: 'มีไข่หกฟอง', tags: ['number'] },
    { word: 'seven', reading: null, translation: 'เจ็ด', example: 'I see seven birds.', example_translation: 'ฉันเห็นนกเจ็ดตัว', tags: ['number'] },
    { word: 'eight', reading: null, translation: 'แปด', example: 'She is eight years old.', example_translation: 'เธออายุแปดปี', tags: ['number'] },
    { word: 'nine', reading: null, translation: 'เก้า', example: 'I have nine pencils.', example_translation: 'ฉันมีดินสอเก้าแท่ง', tags: ['number'] },
    { word: 'ten', reading: null, translation: 'สิบ', example: 'There are ten students.', example_translation: 'มีนักเรียนสิบคน', tags: ['number'] },
    { word: 'cat', reading: null, translation: 'แมว', example: 'My cat is very cute.', example_translation: 'แมวของฉันน่ารักมาก', tags: ['animal'] },
    { word: 'dog', reading: null, translation: 'สุนัข', example: 'The dog runs fast.', example_translation: 'สุนัขวิ่งเร็ว', tags: ['animal'] },
    { word: 'fish', reading: null, translation: 'ปลา', example: 'I have a red fish.', example_translation: 'ฉันมีปลาสีแดง', tags: ['animal'] },
    { word: 'rabbit', reading: null, translation: 'กระต่าย', example: 'The rabbit is small.', example_translation: 'กระต่ายตัวเล็ก', tags: ['animal'] },
    { word: 'elephant', reading: null, translation: 'ช้าง', example: 'The elephant is very big.', example_translation: 'ช้างตัวใหญ่มาก', tags: ['animal'] },
    { word: 'tiger', reading: null, translation: 'เสือ', example: 'The tiger is fast.', example_translation: 'เสือวิ่งเร็ว', tags: ['animal'] },
    { word: 'monkey', reading: null, translation: 'ลิง', example: 'The monkey is funny.', example_translation: 'ลิงตลก', tags: ['animal'] },
    { word: 'bird', reading: null, translation: 'นก', example: 'The bird sings.', example_translation: 'นกร้องเพลง', tags: ['animal'] },
    { word: 'apple', reading: null, translation: 'แอปเปิ้ล', example: 'I eat an apple a day.', example_translation: 'ฉันกินแอปเปิ้ลวันละลูก', tags: ['food'] },
    { word: 'banana', reading: null, translation: 'กล้วย', example: 'The monkey eats a banana.', example_translation: 'ลิงกินกล้วย', tags: ['food'] },
    { word: 'orange', reading: null, translation: 'ส้ม', example: 'Orange juice is sweet.', example_translation: 'น้ำส้มหวาน', tags: ['food'] },
    { word: 'mango', reading: null, translation: 'มะม่วง', example: 'Mango is my favourite fruit.', example_translation: 'มะม่วงเป็นผลไม้ที่ฉันชอบที่สุด', tags: ['food'] },
    { word: 'water', reading: null, translation: 'น้ำ', example: 'I drink water every day.', example_translation: 'ฉันดื่มน้ำทุกวัน', tags: ['drink'] },
    { word: 'milk', reading: null, translation: 'นม', example: 'Children drink milk.', example_translation: 'เด็กๆ ดื่มนม', tags: ['drink'] },
    { word: 'juice', reading: null, translation: 'น้ำผลไม้', example: 'I drink orange juice.', example_translation: 'ฉันดื่มน้ำส้ม', tags: ['drink'] },
    { word: 'coffee', reading: null, translation: 'กาแฟ', example: 'I drink coffee every morning.', example_translation: 'ฉันดื่มกาแฟทุกเช้า', tags: ['drink'] },
    { word: 'eat', reading: null, translation: 'กิน', example: 'I eat rice for lunch.', example_translation: 'ฉันกินข้าวตอนกลางวัน', tags: ['verb'] },
    { word: 'drink', reading: null, translation: 'ดื่ม', example: 'She drinks milk.', example_translation: 'เธอดื่มนม', tags: ['verb'] },
    { word: 'rice', reading: null, translation: 'ข้าว', example: 'Thai people eat rice every day.', example_translation: 'คนไทยกินข้าวทุกวัน', tags: ['food'] },
    { word: 'big', reading: null, translation: 'ใหญ่', example: 'The elephant is big.', example_translation: 'ช้างตัวใหญ่', tags: ['adjective'] },
    { word: 'small', reading: null, translation: 'เล็ก', example: 'The rabbit is small.', example_translation: 'กระต่ายตัวเล็ก', tags: ['adjective'] },
    { word: 'fast', reading: null, translation: 'เร็ว', example: 'The tiger is fast.', example_translation: 'เสือวิ่งเร็ว', tags: ['adjective'] },
    { word: 'cute', reading: null, translation: 'น่ารัก', example: 'My cat is cute.', example_translation: 'แมวของฉันน่ารัก', tags: ['adjective'] }
  ]
};
