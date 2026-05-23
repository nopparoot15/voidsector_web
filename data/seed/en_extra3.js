'use strict';

// English units 10-12: A1 Basic Grammar, A2 Daily Routines, A2 Time & Calendar
module.exports = [
  {
    title: 'Basic Grammar',
    description: 'To Be · To Have · Simple Questions — ไวยากรณ์พื้นฐาน',
    icon: '📝',
    order_num: 30,
    level: 'A1',
    grammar_note: 'ไวยากรณ์พื้นฐาน A1:\n\nTo Be (am/is/are):\n• I am a student.\n• She is tall.\n• They are friends.\n\nTo Have (have/has):\n• I have a dog. / She has a cat.\n\nSimple Questions:\n• Are you a teacher? → Yes, I am. / No, I\'m not.\n• Is he happy? → Yes, he is.\n• Do you have a pen? → Yes, I do.',
    cultural_note: 'ในภาษาอังกฤษ "to be" ใช้บ่อยมากในชีวิตประจำวัน ต่างจากภาษาไทยที่มักละกริยา "เป็น" ได้ — เช่น "เธอสวย" แต่ภาษาอังกฤษต้องมี "She IS beautiful" ห้ามละ is/am/are เป็นอันขาด',
    lessons: [
      {
        title: 'To Be — am / is / are',
        order_num: 1,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '"I ___ a student." — เติมคำอะไร?', options: ['is', 'are', 'am', 'be'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"They ___ my friends." — เติมคำอะไร?', options: ['am', 'is', 'are', 'be'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"She ___ a doctor." — เติมคำอะไร?', options: ['am', 'is', 'are', 'be'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'ประโยคไหนถูก?', options: ['He are happy.', 'I is tall.', 'We am students.', 'You are my friend.'], correct: 3 } },
          { type: 'translate', data: { prompt: 'ฉันเป็นนักเรียน', hint: 'I am...', answer: 'I am a student', alternatives: ["I'm a student"] } },
          { type: 'translate', data: { prompt: 'พวกเขาเป็นครู', hint: 'They are...', answer: 'They are teachers', alternatives: ['They are a teacher'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประธานกับ to be ที่ถูก', pairs: [{ left: 'I', right: 'am (ใช้กับ I เท่านั้น)' }, { left: 'she / he / it', right: 'is (เอกพจน์ที่ 3)' }, { left: 'you / we / they', right: 'are (พหูพจน์/ที่ 2)' }, { left: "I'm not", right: 'ปฏิเสธของ I am' }] } },
          { type: 'fill_blank', data: { sentence: '"___ you a teacher?" — "Yes, I ___."', translation: 'ถามและตอบด้วย to be', options: ['Are / am', 'Is / is', 'Am / are', 'Do / do'], correct: 0 } },
        ]
      },
      {
        title: 'To Have — have / has',
        order_num: 2,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '"She ___ a cat." — have หรือ has?', options: ['have', 'has', 'is', 'are'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I ___ two brothers." — have หรือ has?', options: ['has', 'have', 'am', 'is'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"He ___ a new phone." — have หรือ has?', options: ['have', 'had', 'has', 'is'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'ประโยคไหนถูก?', options: ['They has a car.', 'She have a dog.', 'We have three children.', 'He have money.'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ฉันมีสุนัขหนึ่งตัว', hint: 'I have...', answer: 'I have a dog', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เขามีน้องสาวสองคน', hint: 'He has...', answer: 'He has two sisters', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประธานกับรูป have/has', pairs: [{ left: 'I / you / we / they', right: 'have (ทุกคนยกเว้นที่ 3)' }, { left: 'he / she / it', right: 'has (บุรุษที่ 3 เอกพจน์)' }, { left: 'Do you have...?', right: 'คำถาม have สำหรับ I/you/we/they' }, { left: 'Does she have...?', right: 'คำถาม has สำหรับ he/she/it' }] } },
          { type: 'fill_blank', data: { sentence: '"___ she ___ a brother?" — "Yes, she ___."', translation: 'ถามและตอบด้วย have/has', options: ['Does / have / does', 'Do / have / do', 'Is / has / is', 'Does / has / has'], correct: 0 } },
        ]
      },
      {
        title: 'Simple Yes/No Questions',
        order_num: 3,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: 'ถามว่า "คุณเป็นนักเรียนไหม?" ภาษาอังกฤษคือ?', options: ['You are a student?', 'Are you a student?', 'Is you a student?', 'Do you a student?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Are you hungry?" — ตอบปฏิเสธคือ?', options: ["No, I aren't.", "No, I isn't.", "No, I'm not.", 'No, I am not hungry me.'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Is she your sister?" — ตอบยืนยันคือ?', options: ['Yes, she is.', 'Yes, she are.', 'Yes, she has.', 'Yes, she does.'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"Do they have a car?" — ตอบปฏิเสธคือ?', options: ["No, they don't.", "No, they doesn't.", "No, they aren't.", "No, they isn't."], correct: 0 } },
          { type: 'translate', data: { prompt: 'เขาเป็นครูไหม?', hint: 'Is he...?', answer: 'Is he a teacher?', alternatives: [] } },
          { type: 'translate', data: { prompt: 'พวกเขามีรถไหม?', hint: 'Do they...?', answer: 'Do they have a car?', alternatives: [] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคคำถาม', translation: 'คุณมีพี่ชายไหม?', words: ['Do', 'you', 'have', 'a', 'brother', '?'], answer: 'Do you have a brother ?' } },
          { type: 'fill_blank', data: { sentence: '"___ your parents teachers?" — "Yes, they ___."', translation: 'ถาม to be — พหูพจน์', options: ['Are / are', 'Is / is', 'Do / do', 'Have / have'], correct: 0 } },
        ]
      }
    ]
  },
  {
    title: 'Daily Routines',
    description: 'Morning Routine · Evening Activities · Telling Time — กิจวัตรประจำวัน',
    icon: '🌅',
    order_num: 60,
    level: 'A2',
    grammar_note: 'Present Simple — กิจวัตรประจำวัน:\n\nโครงสร้าง: Subject + V1 (s/es กับ he/she/it)\n• I wake up at 7 AM.\n• She wakes up at 6 AM.\n\nTime expressions:\n• every day / every morning / on weekdays\n• at 7 o\'clock / at half past 8 / at quarter to 9\n• before / after / then / first / next / finally\n\nFrequency adverbs:\n• always > usually > often > sometimes > rarely > never',
    cultural_note: 'ชาวตะวันตกมักใช้ระบบ 12 ชั่วโมง (AM/PM) ในชีวิตประจำวัน ต่างจากไทยที่ใช้ทั้ง 24 ชั่วโมงและระบบไทย (บ่ายสองโมง) — "half past" = ครึ่ง, "quarter to" = 15 นาทีก่อน เป็นคำที่ native speakers ใช้ในการสนทนาทั่วไป',
    lessons: [
      {
        title: 'Morning Routine',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"I ___ up at 7 AM every day." — เติมกริยาอะไร?', options: ['wake', 'wakes', 'woke', 'waking'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"She ___ breakfast before going to work." — เติมกริยาอะไร?', options: ['eat', 'ate', 'eating', 'eats'], correct: 3 } },
          { type: 'multiple_choice', data: { question: '"He ___ his teeth after breakfast." — เติมกริยาอะไร?', options: ['brush', 'brushes', 'brushed', 'brushing'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'ลำดับกิจวัตรตอนเช้าที่สมเหตุสมผลคือ?', options: ['Go to work → Wake up → Have breakfast', 'Wake up → Have breakfast → Go to work', 'Have breakfast → Go to work → Wake up', 'Go to work → Have breakfast → Wake up'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ตื่นนอน', hint: 'wake...', answer: 'wake up', alternatives: ['get up'] } },
          { type: 'translate', data: { prompt: 'อาบน้ำ', hint: 'take a...', answer: 'take a shower', alternatives: ['have a shower'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'wake up', right: 'ตื่นนอน' }, { left: 'get dressed', right: 'แต่งตัว' }, { left: 'brush teeth', right: 'แปรงฟัน' }, { left: 'have breakfast', right: 'กินอาหารเช้า' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันอาบน้ำทุกเช้า', words: ['I', 'take', 'a', 'shower', 'every', 'morning'], answer: 'I take a shower every morning' } },
        ]
      },
      {
        title: 'Evening Activities',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"After dinner, she usually ___ TV." — เติมอะไร?', options: ['watch', 'watches', 'watching', 'watched'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I ___ to bed at 11 PM on weekdays." — เติมอะไร?', options: ['go', 'goes', 'going', 'went'], correct: 0 } },
          { type: 'multiple_choice', data: { question: 'คำว่า "relaxes" ใช้กับประธานอะไร?', options: ['I', 'You', 'They', 'She'], correct: 3 } },
          { type: 'multiple_choice', data: { question: '"On weekends, he ___ stays up past midnight." — frequency word?', options: ['always', 'never', 'sometimes', 'usually'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ดูโทรทัศน์', hint: 'watch...', answer: 'watch TV', alternatives: ['watch television'] } },
          { type: 'translate', data: { prompt: 'เข้านอน', hint: 'go to...', answer: 'go to bed', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'cook dinner', right: 'ทำอาหารเย็น' }, { left: 'do homework', right: 'ทำการบ้าน' }, { left: 'read a book', right: 'อ่านหนังสือ' }, { left: 'go to bed', right: 'เข้านอน' }] } },
          { type: 'fill_blank', data: { sentence: '"She ___ reads before bed. It\'s her favourite habit."', translation: 'บ่งบอกนิสัยที่ทำเป็นประจำ', options: ['never', 'always', 'rarely', 'sometimes'], correct: 1 } },
        ]
      },
      {
        title: 'Telling the Time',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"8:30" อ่านว่าอะไรในภาษาอังกฤษแบบ native?', options: ['eight thirty', 'half past eight', 'eight and half', 'both A and B'], correct: 3 } },
          { type: 'multiple_choice', data: { question: '"Quarter to nine" หมายถึงเวลาอะไร?', options: ['9:15', '9:45', '8:45', '8:15'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"It\'s 7 AM." — "AM" หมายถึงอะไร?', options: ['ช่วงบ่าย', 'ช่วงเย็น', 'ช่วงเช้า (ก่อนเที่ยง)', 'เที่ยงคืน'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"What time do you ___ up?" — เติมอะไร?', options: ['wake', 'wakes', 'waking', 'woke'], correct: 0 } },
          { type: 'translate', data: { prompt: 'ตอนเช้า (ก่อนเที่ยง)', hint: 'AM / in the...', answer: 'in the morning', alternatives: ['AM'] } },
          { type: 'translate', data: { prompt: 'ตอนบ่าย (หลังเที่ยง)', hint: 'in the...', answer: 'in the afternoon', alternatives: ['PM'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่เวลากับการอ่าน', pairs: [{ left: '3:15', right: 'quarter past three (สิบห้านาทีหลังสาม)' }, { left: '3:45', right: 'quarter to four (สิบห้านาทีก่อนสี่)' }, { left: '3:30', right: 'half past three (สามครึ่ง)' }, { left: '3:00', right: "three o'clock (สามนาฬิกาตรง)" }] } },
          { type: 'fill_blank', data: { sentence: '"The class starts ___ half ___ nine." → 9:30', translation: 'at half past nine', options: ['at / past', 'in / after', 'on / to', 'at / to'], correct: 0 } },
        ]
      }
    ]
  },
  {
    title: 'Time & Calendar',
    description: 'Days of Week · Months & Seasons · Dates — เวลาและปฏิทิน',
    icon: '📅',
    order_num: 70,
    level: 'A2',
    grammar_note: 'Prepositions of time — คำบุพบทบอกเวลา:\n\n• ON — วันและวันที่: on Monday, on 5th July\n• IN — เดือน ปี ฤดู ช่วงเวลา: in January, in 2024, in summer, in the morning\n• AT — เวลาแน่นอน ช่วงเวลาสั้น: at 3 PM, at noon, at night\n\nDates:\n• "the 5th of July" / "July 5th"\n• Ordinal: 1st, 2nd, 3rd, 4th, 5th...',
    cultural_note: 'รูปแบบวันที่ต่างกันระหว่างอเมริกา (Month/Day/Year → 7/4/2024) กับอังกฤษ (Day/Month/Year → 4/7/2024) ซึ่งสร้างความสับสนมาก เวลาเขียนเป็นทางการจึงนิยมเขียนเต็มเช่น "4th July 2024" หรือ "July 4, 2024" เพื่อหลีกเลี่ยงความกำกวม',
    lessons: [
      {
        title: 'Days of the Week',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: 'วันทำงาน "weekdays" หมายถึงวันอะไร?', options: ['Saturday & Sunday', 'Monday to Friday', 'Monday to Saturday', 'Sunday to Thursday'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I have a meeting ___ Monday." — ใช้ preposition ไหน?', options: ['in', 'at', 'on', 'by'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"See you ___ the weekend!" — ใช้ preposition ไหน?', options: ['on', 'in', 'at', 'by'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'วันไหนมาหลัง Wednesday?', options: ['Tuesday', 'Monday', 'Thursday', 'Sunday'], correct: 2 } },
          { type: 'translate', data: { prompt: 'วันจันทร์', hint: 'Mon...', answer: 'Monday', alternatives: [] } },
          { type: 'translate', data: { prompt: 'วันศุกร์', hint: 'Fri...', answer: 'Friday', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่วันภาษาอังกฤษกับภาษาไทย', pairs: [{ left: 'Tuesday', right: 'วันอังคาร' }, { left: 'Thursday', right: 'วันพฤหัสบดี' }, { left: 'Saturday', right: 'วันเสาร์' }, { left: 'Sunday', right: 'วันอาทิตย์' }] } },
          { type: 'fill_blank', data: { sentence: '"The gym is closed ___ Sundays." — ใช้ preposition ไหน?', translation: 'วันเฉพาะเจาะจงใช้ on', options: ['in', 'on', 'at', 'by'], correct: 1 } },
        ]
      },
      {
        title: 'Months & Seasons',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"My birthday is ___ July." — ใช้ preposition ไหน?', options: ['on', 'at', 'in', 'by'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Summer" ในประเทศตะวันตกคือช่วงไหน?', options: ['December–February', 'March–May', 'June–August', 'September–November'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'เดือนอะไรอยู่ระหว่าง October กับ December?', options: ['August', 'September', 'November', 'January'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"We go skiing ___ winter every year." — ใช้ preposition ไหน?', options: ['on', 'at', 'in', 'by'], correct: 2 } },
          { type: 'translate', data: { prompt: 'เดือนกุมภาพันธ์', hint: 'Feb...', answer: 'February', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ฤดูใบไม้ร่วง (ใบไม้เปลี่ยนสี)', hint: 'aut... / fall', answer: 'autumn', alternatives: ['fall'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่เดือนกับฤดูกาล (ซีกโลกเหนือ)', pairs: [{ left: 'December / January / February', right: 'winter — ฤดูหนาว' }, { left: 'March / April / May', right: 'spring — ฤดูใบไม้ผลิ' }, { left: 'June / July / August', right: 'summer — ฤดูร้อน' }, { left: 'September / October / November', right: 'autumn — ฤดูใบไม้ร่วง' }] } },
          { type: 'fill_blank', data: { sentence: '"The festival is ___ the 25th of December." — ใช้ on กับวันที่', translation: 'on + วันที่เฉพาะ', options: ['in', 'at', 'on', 'by'], correct: 2 } },
        ]
      },
      {
        title: 'Saying Dates',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"1st" อ่านว่าอะไร?', options: ['one', 'first', 'oneth', 'once'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"July 4, 2024" ในรูปแบบอเมริกาคือ (Month/Day/Year) → เขียนเป็นตัวเลขว่าอย่างไร?', options: ['4/7/2024', '7/4/2024', '2024/4/7', '4/2024/7'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"What\'s the date today?" — ตอบอย่างไร?', options: ["Today is Monday.", "It's the 15th of June.", 'It is summer.', "It's 3 o'clock."], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"22nd" อ่านว่าอะไร?', options: ['twenty-two', 'twenty-second', 'two-twenty', 'twenty-twoth'], correct: 1 } },
          { type: 'translate', data: { prompt: 'วันที่ 3 (ordinal)', hint: 'th...', answer: 'third', alternatives: ['3rd'] } },
          { type: 'translate', data: { prompt: 'วันที่ 2 (ordinal)', hint: 'sec...', answer: 'second', alternatives: ['2nd'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ cardinal กับ ordinal', pairs: [{ left: 'one (1)', right: 'first — ที่หนึ่ง' }, { left: 'two (2)', right: 'second — ที่สอง' }, { left: 'three (3)', right: 'third — ที่สาม' }, { left: 'five (5)', right: 'fifth — ที่ห้า (irregular!)' }] } },
          { type: 'word_order', data: { instruction: 'เรียงวันที่แบบอังกฤษ', translation: 'วันที่ 5 เดือนมีนาคม 2025', words: ['the', '5th', 'of', 'March', '2025'], answer: 'the 5th of March 2025' } },
        ]
      }
    ]
  }
];
