'use strict';

// English unit 9: C2 — Mastery
module.exports = [
  {
    title: 'Mastery English',
    description: 'Rhetoric · Literary devices · Nuanced register — ระดับเชี่ยวชาญ',
    icon: '👑',
    order_num: 9,
    level: 'C2',
    grammar_note: 'ระดับ C2 — การใช้ภาษาอย่างเชี่ยวชาญ:\n\nRhetorical devices:\n• Metaphor: "Time is money" (เปรียบเปรย)\n• Irony: พูดตรงข้ามความหมายจริง "Oh great, another meeting!"\n• Understatement: "It\'s not bad" = ดีมาก\n• Hyperbole: "I\'ve told you a million times"\n\nRegister — ระดับภาษา:\n• Formal: "I would be grateful if you could..."\n• Neutral: "Could you please..."\n• Informal: "Can you..."\n• Colloquial: "Gimme a hand?"\n\nSubjunctive mood (ความปรารถนา/สมมติ):\n• "I wish I were taller." (ไม่ใช่ was)\n• "If I were you, I would..."',
    cultural_note: 'C2 คือระดับที่คนพูดภาษาอังกฤษเป็นภาษาที่สองมักจะเรียกว่า "near-native" แต่ native speakers ก็ยังสังเกตเห็น subtle differences ได้ — เช่น การใช้ collocation ผิด ("strong tea" ไม่ใช่ "powerful tea") ซึ่งเป็นสิ่งที่ต้องอ่านและฟังมากๆ ถึงจะซึมซับได้',
    lessons: [
      {
        title: 'Rhetorical Devices',
        order_num: 1,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"Time flies when you\'re having fun." — ประโยคนี้ใช้ device อะไร?', options: ['Simile', 'Metaphor', 'Hyperbole', 'Irony'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Oh great, the meeting is cancelled... again." — น้ำเสียงนี้คือ?', options: ['Enthusiasm', 'Irony/Sarcasm', 'Understatement', 'Alliteration'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"It\'s a bit chilly today." (said during a blizzard) — คือ?', options: ['Hyperbole', 'Metaphor', 'Understatement', 'Personification'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"I\'ve told you a million times!" — คือ?', options: ['Metaphor', 'Simile', 'Hyperbole', 'Irony'], correct: 2 } },
          { type: 'translate', data: { prompt: 'การพูดน้อยกว่าความเป็นจริงเพื่อเน้น', hint: 'underst...', answer: 'understatement', alternatives: [] } },
          { type: 'translate', data: { prompt: 'การพูดตรงข้ามความหมายที่แท้จริง', hint: 'iron...', answer: 'irony', alternatives: ['sarcasm'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ device กับตัวอย่าง', pairs: [{ left: 'metaphor', right: '"Life is a journey"' }, { left: 'hyperbole', right: '"I\'m starving to death"' }, { left: 'simile', right: '"Fast as lightning"' }, { left: 'irony', right: '"Oh, perfect timing!"' }] } },
          { type: 'fill_blank', data: { sentence: '"She has a heart of gold." — "heart of gold" คือ ___ ที่หมายถึงคนใจดี', translation: 'metaphor — เปรียบเทียบโดยตรง', options: ['simile', 'metaphor', 'irony', 'hyperbole'], correct: 1 } },
        ]
      },
      {
        title: 'Advanced Writing Register',
        order_num: 2,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: 'ประโยคไหน formal ที่สุด?', options: ['Can you send me the file?', 'Send me the file.', 'I would be grateful if you could forward the document.', 'Could you send the file?'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Gimme a hand" เป็น register แบบไหน?', options: ['Formal', 'Neutral', 'Colloquial', 'Academic'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'Academic writing ควรหลีกเลี่ยงอะไร?', options: ['Passive voice', 'Contractions (it\'s, don\'t)', 'Complex sentences', 'Technical terms'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"The results suggest that..." เป็นโครงสร้าง?', options: ['Colloquial hedging', 'Academic hedging', 'Informal opinion', 'Direct claim'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ระดับภาษา (formal/informal)', hint: 'reg...', answer: 'register', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ formal กับ informal', pairs: [{ left: 'commence', right: 'start' }, { left: 'terminate', right: 'end' }, { left: 'facilitate', right: 'help' }, { left: 'obtain', right: 'get' }] } },
          { type: 'fill_blank', data: { sentence: 'In academic writing: "The study ___ that sleep deprivation affects cognition."', translation: 'ใช้ hedging verb เพื่อไม่ยืนยันแน่ชัด', options: ['proves', 'suggests', 'knows', 'says'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค formal', translation: 'ฉันจะขอบคุณมากหากคุณตอบกลับโดยเร็ว', words: ['I', 'would', 'appreciate', 'a', 'prompt', 'response'], answer: 'I would appreciate a prompt response' } },
        ]
      },
      {
        title: 'Nuance & Collocation',
        order_num: 3,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"___ tea" — คำไหนถูก?', options: ['powerful tea', 'strong tea', 'heavy tea', 'big tea'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Make" หรือ "do" — "___ a decision"?', options: ['do a decision', 'make a decision', 'take a decision (UK)', 'both make and take'], correct: 3 } },
          { type: 'multiple_choice', data: { question: '"I wish I ___ taller." — Subjunctive?', options: ['was', 'were', 'am', 'be'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If I ___ you, I would apologize." — Subjunctive?', options: ['was', 'am', 'were', 'be'], correct: 2 } },
          { type: 'translate', data: { prompt: 'คำที่มักใช้คู่กัน (เช่น strong coffee)', hint: 'coll...', answer: 'collocation', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ collocations', pairs: [{ left: 'heavy', right: 'traffic / rain / smoker' }, { left: 'strong', right: 'coffee / tea / wind' }, { left: 'make', right: 'a mistake / a decision / an effort' }, { left: 'do', right: 'homework / damage / business' }] } },
          { type: 'fill_blank', data: { sentence: '"She ___ a living as a freelance writer." — ใช้ make หรือ do?', translation: 'earn a living — make a living', options: ['does', 'makes', 'takes', 'gets'], correct: 1 } },
          { type: 'fill_blank', data: { sentence: '"The report ___ that the policy had unintended consequences." — hedging', translation: 'แสดงผลการวิจัยอย่างระมัดระวัง', options: ['knows', 'proves', 'indicates', 'says definitely'], correct: 2 } },
        ]
      }
    ]
  }
];
