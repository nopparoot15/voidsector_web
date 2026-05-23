'use strict';

// English units 5-8: Elementary → Intermediate → Advanced
module.exports = [
  {
    title: 'Family & People',
    description: 'คนในครอบครัว บุคลิก และความสัมพันธ์',
    icon: '👨‍👩‍👧',
    order_num: 80,
    level: 'B1',
    grammar_note: 'สรรพนามแสดงความเป็นเจ้าของ:\n• I → my (My mother is a nurse.)\n• He → his / She → her / They → their\n\nPresent Simple สำหรับข้อเท็จจริง:\n• She works at a hospital.\n• My parents live in Bangkok.\n\nใช้ look like เพื่อบรรยายลักษณะ: She looks like her mother.',
    cultural_note: 'ในวัฒนธรรมตะวันตก การถามเรื่องอายุ น้ำหนัก หรือเงินเดือนถือว่า "too personal" — หลีกเลี่ยงในการสนทนากับคนที่เพิ่งรู้จัก',
    lessons: [
      {
        title: 'Family Members',
        order_num: 1,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "My sister just had a baby boy. I am now the baby's ___.", options: ['cousin', 'nephew', 'grandson', 'brother'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "Which sentence is grammatically correct?", options: ["My brothers works at the same office.", "My brother work at the bank.", "My brother works at the bank.", "My brother are a teacher."], correct: 2 } },
          { type: 'multiple_choice', data: { question: "Emma visits them every Sunday. They are 72 and 75 years old and love sharing stories from the past. Who does she visit?", options: ['her cousins', 'her grandparents', 'her friends', 'her neighbours'], correct: 1 } },
          { type: 'translate', data: { prompt: 'พ่อ', hint: 'parent (male)', answer: 'father', alternatives: ['dad'] } },
          { type: 'translate', data: { prompt: 'พี่สาว / น้องสาว', hint: 'sibling (female)', answer: 'sister' } },
          { type: 'fill_blank', data: { sentence: 'My ___ is a doctor. She works at a hospital.', translation: 'พี่สาวฉันเป็นแพทย์ เธอทำงานที่โรงพยาบาล', options: ['brother', 'sister', 'father', 'son'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคให้ถูกต้อง', translation: 'ฉันมีน้องชายสองคนและพี่สาวหนึ่งคน', words: ['I', 'have', 'two', 'brothers', 'and', 'one', 'sister'], answer: 'I have two brothers and one sister' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'mother', right: 'แม่' }, { left: 'father', right: 'พ่อ' }, { left: 'sister', right: 'พี่สาว/น้องสาว' }, { left: 'brother', right: 'พี่ชาย/น้องชาย' }] } }
        ]
      },
      {
        title: 'Describing People',
        order_num: 2,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "He is 198 cm and plays professional basketball. People always comment on how ___ he is.", options: ['short', 'tall', 'quiet', 'shy'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "She finished the exam in 10 minutes and scored 100%. Her teacher described her as the most ___ student in the school.", options: ['lazy', 'rude', 'intelligent', 'boring'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "My grandfather is 82 and retired 17 years ago. He is certainly not young — he is quite ___.", options: ['new', 'old', 'small', 'fast'], correct: 1 } },
          { type: 'translate', data: { prompt: 'สวยงาม (ผู้หญิง)', hint: 'adjective', answer: 'beautiful', alternatives: ['pretty', 'gorgeous'] } },
          { type: 'translate', data: { prompt: 'เป็นมิตร', hint: 'personality', answer: 'friendly', alternatives: ['kind'] } },
          { type: 'fill_blank', data: { sentence: 'She is very ___ and always helps others.', translation: 'เธอใจดีมากและคอยช่วยเหลือคนอื่นเสมอ', options: ['rude', 'selfish', 'kind', 'lazy'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคให้ถูกต้อง', translation: 'เพื่อนของฉันตัวสูง ผมสีดำ และมีตาสีน้ำตาล', words: ['My', 'friend', 'is', 'tall', 'with', 'black', 'hair'], answer: 'My friend is tall with black hair' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'tall', right: 'สูง' }, { left: 'young', right: 'อ่อน / เด็ก' }, { left: 'smart', right: 'ฉลาด' }, { left: 'kind', right: 'ใจดี' }] } }
        ]
      },
      {
        title: 'Relationships & Feelings',
        order_num: 3,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "'Happy' แปลว่าอะไร?", options: ['เศร้า', 'โกรธ', 'มีความสุข', 'กลัว'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'I miss you' แปลว่าอะไร?", options: ['ฉันรักคุณ', 'ฉันคิดถึงคุณ', 'ฉันเกลียดคุณ', 'ฉันรู้จักคุณ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "คำใดแสดงความรู้สึก 'กังวล'?", options: ['excited', 'nervous', 'bored', 'proud'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันรู้สึกเหนื่อย', hint: 'feeling tired', answer: 'I feel tired', alternatives: ['I am tired'] } },
          { type: 'translate', data: { prompt: 'เขาโกรธมาก', hint: 'very angry', answer: 'He is very angry' } },
          { type: 'fill_blank', data: { sentence: 'She felt ___ when she failed the exam.', translation: 'เธอรู้สึกเสียใจเมื่อสอบตก', options: ['happy', 'excited', 'disappointed', 'proud'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันดีใจมากที่ได้พบคุณอีกครั้ง', words: ['I', 'am', 'so', 'happy', 'to', 'see', 'you', 'again'], answer: 'I am so happy to see you again' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ความรู้สึก', pairs: [{ left: 'happy', right: 'มีความสุข' }, { left: 'sad', right: 'เศร้า' }, { left: 'angry', right: 'โกรธ' }, { left: 'scared', right: 'กลัว' }] } }
        ]
      }
    ]
  },

  {
    title: 'Travel & Places',
    description: 'สถานที่ทิศทาง และการเดินทาง',
    icon: '✈️',
    order_num: 90,
    level: 'B1',
    grammar_note: 'Prepositions of place:\n• in = ใน (in the city, in Thailand)\n• at = ณ จุดที่ระบุ (at the airport, at school)\n• on = บน (on the left, on the bus)\n• next to / near / opposite = ถัดจาก/ใกล้/ตรงข้าม\n\nขอทาง: Excuse me, how do I get to...?\nบอกทาง: Go straight, turn left/right, it\'s on your left.',
    cultural_note: 'ในสหราชอาณาจักรขับรถทางซ้าย ส่วนอเมริกาขับทางขวา เวลาถามทางต้องระวังเรื่องนี้ด้วย',
    lessons: [
      {
        title: 'Places Around Town',
        order_num: 1,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "Sarah broke her leg in a car accident and needs emergency surgery. Where should she go immediately?", options: ['pharmacy', 'gym', 'hospital', 'hotel'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "You need to buy vegetables, bread, and cleaning supplies for the week. Which place has all of these?", options: ['bank', 'library', 'supermarket', 'post office'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "Where do you borrow books? At the ___.", options: ['gym', 'library', 'pharmacy', 'post office'], correct: 1 } },
          { type: 'translate', data: { prompt: 'สนามบิน', hint: 'transportation hub', answer: 'airport' } },
          { type: 'translate', data: { prompt: 'ธนาคาร', hint: 'financial institution', answer: 'bank' } },
          { type: 'fill_blank', data: { sentence: 'Excuse me, where is the nearest ___? I need to get some money.', translation: 'ขอโทษ ATM ที่ใกล้ที่สุดอยู่ที่ไหน ฉันต้องการถอนเงิน', options: ['library', 'gym', 'ATM', 'park'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'โรงพยาบาลอยู่ตรงข้ามกับสวนสาธารณะ', words: ['The', 'hospital', 'is', 'across', 'from', 'the', 'park'], answer: 'The hospital is across from the park' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สถานที่กับคำอธิบาย', pairs: [{ left: 'airport', right: 'สนามบิน' }, { left: 'hospital', right: 'โรงพยาบาล' }, { left: 'library', right: 'ห้องสมุด' }, { left: 'pharmacy', right: 'ร้านขายยา' }] } }
        ]
      },
      {
        title: 'Directions',
        order_num: 2,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: "You are facing north. The guide says 'turn left.' Now you are facing ___.", options: ['north', 'south', 'east', 'west'], correct: 3 } },
          { type: 'multiple_choice', data: { question: "\"Go ___ for 200 metres, then turn right at the traffic light.\" Which word completes the direction?", options: ['back', 'left', 'straight', 'right'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "คำว่า 'next to' หมายถึงอะไร?", options: ['ตรงข้าม', 'ข้างๆ', 'หลัง', 'บน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เลี้ยวขวาที่ไฟแดง', hint: 'direction instruction', answer: 'turn right at the traffic light' } },
          { type: 'translate', data: { prompt: 'ตรงข้ามกับ...', hint: 'opposite position', answer: 'across from', alternatives: ['opposite'] } },
          { type: 'fill_blank', data: { sentence: 'Go ___ for two blocks, then turn right.', translation: 'ตรงไปสองช่วงตึก แล้วเลี้ยวขวา', options: ['left', 'back', 'straight', 'right'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ธนาคารอยู่ถัดจากร้านกาแฟ', words: ['The', 'bank', 'is', 'next', 'to', 'the', 'coffee', 'shop'], answer: 'The bank is next to the coffee shop' } },
          { type: 'translate', data: { prompt: 'ฉันหลงทาง คุณช่วยฉันได้ไหม?', hint: 'asking for help', answer: 'I am lost. Can you help me?', alternatives: ["I'm lost. Can you help me?"] } }
        ]
      },
      {
        title: 'At the Airport & Hotel',
        order_num: 3,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "'Check-in' ที่สนามบินหมายถึงอะไร?", options: ['ลงทะเบียนขึ้นเครื่อง', 'ซื้อตั๋ว', 'รับกระเป๋า', 'เปลี่ยนเงิน'], correct: 0 } },
          { type: 'multiple_choice', data: { question: "'Boarding pass' คืออะไร?", options: ['หนังสือเดินทาง', 'ใบขึ้นเครื่อง', 'ใบสั่งยา', 'ใบเสร็จ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "How do you ask for a room at a hotel?", options: ["I'd like to book a room, please.", 'Give me a room now.', 'Room! Room!', 'Where is the room?'], correct: 0 } },
          { type: 'translate', data: { prompt: 'ฉันมีการจองห้องไว้', hint: 'hotel check-in', answer: 'I have a reservation', alternatives: ['I have a booking'] } },
          { type: 'translate', data: { prompt: 'กระเป๋าเดินทาง', hint: 'luggage', answer: 'suitcase', alternatives: ['luggage', 'bag'] } },
          { type: 'fill_blank', data: { sentence: 'Could I have a ___ room, please? I need to work.', translation: 'ขอห้องที่เงียบหน่อยได้ไหม ฉันต้องทำงาน', options: ['noisy', 'quiet', 'dirty', 'small'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันต้องการเช็คเอาท์พรุ่งนี้เช้า', words: ['I', 'would', 'like', 'to', 'check', 'out', 'tomorrow', 'morning'], answer: 'I would like to check out tomorrow morning' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำศัพท์', pairs: [{ left: 'passport', right: 'หนังสือเดินทาง' }, { left: 'flight', right: 'เที่ยวบิน' }, { left: 'departure', right: 'ขาออก' }, { left: 'arrival', right: 'ขาเข้า' }] } }
        ]
      }
    ]
  },

  {
    title: 'Grammar: Tenses',
    description: 'Present, Past, Future — การใช้กาลอย่างถูกต้อง',
    icon: '📝',
    order_num: 120,
    level: 'B2',
    grammar_note: 'กาลสำคัญ:\n• Present Simple: I work (ปกติ/ความจริง)\n• Present Continuous: I am working (กำลังทำอยู่ตอนนี้)\n• Past Simple: I worked / I went (จบแล้ว)\n• Past Continuous: I was working when... (กำลังทำอยู่ขณะที่...)\n• Future will: I will go (ตัดสินใจตอนนี้)\n• Future going to: I\'m going to go (วางแผนไว้แล้ว)\n• Present Perfect: I have worked here for 3 years (เชื่อมอดีต-ปัจจุบัน)',
    cultural_note: 'Present Perfect ใช้บ่อยในภาษาอังกฤษแบบอังกฤษ (British) มากกว่าแบบอเมริกัน เช่น "I\'ve just eaten" (UK) vs "I just ate" (US)',
    lessons: [
      {
        title: 'Present Simple & Continuous',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "ประโยคใดใช้ Present Simple ถูกต้อง?", options: ['She eating lunch now.', 'She eats lunch every day.', 'She eaten lunch.', 'She will eats lunch.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "ประโยคใดใช้ Present Continuous ถูกต้อง?", options: ['I am study now.', 'I studying now.', 'I am studying now.', 'I studys now.'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "He ___ to work every day by bus.", options: ['is going', 'goes', 'go', 'going'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เธอกำลังอ่านหนังสืออยู่ตอนนี้', hint: 'present continuous', answer: 'She is reading a book now', alternatives: ["She's reading a book now"] } },
          { type: 'translate', data: { prompt: 'ฉันตื่นนอนตีหกทุกวัน', hint: 'present simple - habit', answer: 'I wake up at six every day' } },
          { type: 'fill_blank', data: { sentence: 'They ___ football every weekend.', translation: 'พวกเขาเล่นฟุตบอลทุกสุดสัปดาห์', options: ['is playing', 'plays', 'play', 'played'], correct: 2 } },
          { type: 'fill_blank', data: { sentence: 'Look! The baby ___.', translation: 'ดูสิ! เด็กทารกกำลังร้องไห้', options: ['cry', 'cries', 'is crying', 'cried'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'พวกเขากำลังเรียนภาษาอังกฤษอยู่ในตอนนี้', words: ['They', 'are', 'learning', 'English', 'right', 'now'], answer: 'They are learning English right now' } }
        ]
      },
      {
        title: 'Past Simple & Past Continuous',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "ประโยคใดใช้ Past Simple ถูกต้อง?", options: ['She go to school yesterday.', 'She went to school yesterday.', 'She goed to school yesterday.', 'She going to school yesterday.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "Past tense ของ 'buy' คือ?", options: ['buyed', 'buys', 'bought', 'buy'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "While I ___ TV, the phone rang.", options: ['watched', 'watch', 'was watching', 'am watching'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ฉันกินข้าวเช้าเมื่อเช้านี้', hint: 'past simple', answer: 'I had breakfast this morning', alternatives: ['I ate breakfast this morning'] } },
          { type: 'translate', data: { prompt: 'เขาไม่ไปทำงานเมื่อวานนี้', hint: 'past simple negative', answer: 'He did not go to work yesterday', alternatives: ["He didn't go to work yesterday"] } },
          { type: 'fill_blank', data: { sentence: 'I ___ a great movie last night.', translation: 'ฉันดูหนังที่ยอดเยี่ยมเมื่อคืน', options: ['see', 'seeing', 'saw', 'seen'], correct: 2 } },
          { type: 'fill_blank', data: { sentence: 'When I arrived, she ___ on the phone.', translation: 'ตอนที่ฉันมาถึง เธอกำลังคุยโทรศัพท์อยู่', options: ['talks', 'talked', 'was talking', 'has talked'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันได้พบเพื่อนเก่าเมื่อวานนี้', words: ['I', 'met', 'an', 'old', 'friend', 'yesterday'], answer: 'I met an old friend yesterday' } }
        ]
      },
      {
        title: 'Future Tenses',
        order_num: 3,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: "'Will' ใช้เพื่ออะไร?", options: ['เหตุการณ์ในอดีต', 'การตัดสินใจทันทีและการทำนาย', 'เหตุการณ์ปัจจุบัน', 'นิสัยที่ทำเป็นประจำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "ประโยคใดใช้ 'going to' ถูกต้อง (แผนที่วางไว้)?", options: ["I will going to study.", "I'm going to study tonight.", 'I go to study tonight.', 'I going study tonight.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "It's very cloudy. I think it ___ rain.", options: ['is going to', 'will going to', 'rained', 'rains'], correct: 0 } },
          { type: 'translate', data: { prompt: 'ฉันจะไปเชียงใหม่สัปดาห์หน้า (แผนที่วางไว้)', hint: 'going to', answer: "I'm going to go to Chiang Mai next week", alternatives: ['I am going to Chiang Mai next week'] } },
          { type: 'translate', data: { prompt: 'ฉันจะช่วยคุณ (ตัดสินใจทันที)', hint: 'will', answer: 'I will help you' } },
          { type: 'fill_blank', data: { sentence: 'Don\'t worry, I ___ call you when I arrive.', translation: 'ไม่ต้องกังวล ฉันจะโทรหาคุณเมื่อฉันมาถึง', options: ["'m going to", 'will', 'am', 'was'], correct: 1 } },
          { type: 'fill_blank', data: { sentence: 'She ___ attend the meeting tomorrow. She already told the boss.', translation: 'เธอจะเข้าร่วมประชุมพรุ่งนี้ เธอบอกเจ้านายไปแล้ว', options: ['wills', 'is going to', 'goes', 'went'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันกำลังจะเรียนภาษาญี่ปุ่นปีหน้า', words: ['I', 'am', 'going', 'to', 'learn', 'Japanese', 'next', 'year'], answer: 'I am going to learn Japanese next year' } }
        ]
      }
    ]
  },

  {
    title: 'Advanced English',
    description: 'Idioms · Business · Academic — ระดับสูง',
    icon: '🏆',
    order_num: 140,
    level: 'C1',
    grammar_note: 'Idioms = สำนวนที่ความหมายไม่ตรงตัว:\n• "Break a leg" = โชคดี (ไม่ใช่หักขา)\n• "Hit the sack" = เข้านอน\n• "Beat around the bush" = พูดอ้อมค้อม\n\nPhrasal verbs = กริยา+คำบุพบท:\n• give up = ยอมแพ้ · look up = ค้นหา · run out of = หมด\n\nPassive voice (Academic):\n• Active: They conducted the study.\n• Passive: The study was conducted.',
    cultural_note: 'ภาษาอังกฤษธุรกิจ (Business English) เน้นความตรงไปตรงมา ไม่อ้อมค้อม เช่น "I\'ll get back to you by Friday" ดีกว่า "Maybe I could possibly consider..."',
    lessons: [
      {
        title: 'Idioms & Phrasal Verbs',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: "'Break a leg' หมายความว่าอะไร?", options: ['หักขา', 'โชคดีนะ', 'หนีไปเลย', 'ทำลายอะไรบางอย่าง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'It's raining cats and dogs' หมายถึงอะไร?", options: ['สัตว์กำลังตกลงมา', 'ฝนตกหนักมาก', 'อากาศแปลก', 'แมวกับสุนัขชอบฝน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'Give up' หมายความว่าอะไร?", options: ['มอบของขวัญ', 'ยอมแพ้/เลิก', 'เพิ่มขึ้น', 'ให้กลับคืน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เลิกสูบบุหรี่ (phrasal verb)', hint: 'give up', answer: 'give up smoking', alternatives: ['quit smoking'] } },
          { type: 'translate', data: { prompt: 'hit the nail on the head หมายถึง', hint: 'idiom meaning', answer: 'say exactly the right thing', alternatives: ['be exactly right', 'พูดถูกต้องทุกอย่าง'] } },
          { type: 'fill_blank', data: { sentence: 'She\'s been under the weather lately. She has a cold.', translation: 'เธอไม่สบายในช่วงนี้ เธอเป็นหวัด — "under the weather" หมายถึง ___', options: ['ไม่สบาย', 'อยู่กลางแจ้ง', 'ชอบฝน', 'เดินทาง'], correct: 0 } },
          { type: 'fill_blank', data: { sentence: 'I ran ___ my old teacher at the supermarket yesterday.', translation: 'ฉันบังเอิญพบครูเก่าของฉันที่ซูเปอร์มาร์เก็ตเมื่อวาน', options: ['away', 'out of', 'into', 'over'], correct: 2 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ idiom กับความหมาย', pairs: [{ left: 'break a leg', right: 'โชคดี' }, { left: 'give up', right: 'ยอมแพ้' }, { left: 'look up to', right: 'เคารพนับถือ' }, { left: 'run out of', right: 'หมด' }] } }
        ]
      },
      {
        title: 'Business English',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: "การเริ่มอีเมลทางการอย่างไรถูกต้อง?", options: ["Hey!", "What's up?", 'Dear Mr./Ms. [Name],', 'To whom:'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'Could you please send me the report by Friday?' เป็นรูปแบบภาษาแบบใด?", options: ['ไม่เป็นทางการ', 'หยาบคาย', 'สุภาพและเป็นทางการ', 'คำสั่ง'], correct: 2 } },
          { type: 'multiple_choice', data: { question: "'I'd like to schedule a meeting' หมายถึงอะไร?", options: ['ฉันต้องการยกเลิกประชุม', 'ฉันต้องการนัดประชุม', 'ฉันไม่ชอบประชุม', 'ประชุมเสร็จแล้ว'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ตามที่พูดคุยกันไว้', hint: 'business email phrase', answer: 'as discussed', alternatives: ['as per our discussion'] } },
          { type: 'translate', data: { prompt: 'กรุณาแจ้งให้ทราบหากมีคำถาม', hint: 'closing business email', answer: 'please let me know if you have any questions', alternatives: ["don't hesitate to contact me if you have questions"] } },
          { type: 'fill_blank', data: { sentence: 'I am writing to ___ my application for the Marketing Manager position.', translation: 'ฉันเขียนจดหมายนี้เพื่อสมัครตำแหน่ง Marketing Manager', options: ['refuse', 'submit', 'delete', 'ignore'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคธุรกิจ', translation: 'ฉันมองหาโอกาสในการพบปะกับคุณ', words: ['I', 'look', 'forward', 'to', 'meeting', 'with', 'you'], answer: 'I look forward to meeting with you' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำศัพท์ธุรกิจ', pairs: [{ left: 'deadline', right: 'กำหนดเวลา' }, { left: 'agenda', right: 'วาระการประชุม' }, { left: 'invoice', right: 'ใบแจ้งหนี้' }, { left: 'proposal', right: 'ข้อเสนอ' }] } }
        ]
      },
      {
        title: 'Academic & Complex Structures',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: "ประโยค Conditional Type 2 ใดถูกต้อง?", options: ['If I will win, I celebrate.', 'If I won, I would celebrate.', 'If I win, I will celebrate.', 'If I won, I will celebrate.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "'Despite' ใช้อย่างไร?", options: ['Despite she was tired, she worked.', 'Despite being tired, she worked.', 'Despite of tired, she worked.', 'Despite that tired, she worked.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: "ประโยค Passive Voice ใดถูกต้อง?", options: ['The report wrote by her.', 'The report is written by her.', 'The report writing by her.', 'Her write the report.'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ถ้าฉันเป็นคุณ ฉันจะขอโทษเขา', hint: 'conditional type 2', answer: 'If I were you, I would apologize to him' } },
          { type: 'translate', data: { prompt: 'ปัญหานี้ต้องได้รับการแก้ไข', hint: 'passive voice - must', answer: 'This problem must be solved' } },
          { type: 'fill_blank', data: { sentence: '___ the heavy traffic, she arrived on time.', translation: 'แม้จะมีรถติด แต่เธอก็มาถึงทันเวลา', options: ['Because of', 'Due to', 'Despite', 'Although'], correct: 2 } },
          { type: 'fill_blank', data: { sentence: 'Not only ___ she speak English, but she also speaks Japanese.', translation: 'เธอไม่เพียงแต่พูดภาษาอังกฤษได้ แต่ยังพูดภาษาญี่ปุ่นได้ด้วย', options: ['does', 'do', 'is', 'has'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค advanced', translation: 'เป็นที่ชัดเจนว่าการเปลี่ยนแปลงสภาพภูมิอากาศเป็นปัญหาเร่งด่วน', words: ['It', 'is', 'clear', 'that', 'climate', 'change', 'is', 'an', 'urgent', 'issue'], answer: 'It is clear that climate change is an urgent issue' } }
        ]
      }
    ]
  }
];
