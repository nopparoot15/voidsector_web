'use strict';

// Chinese units 11-12: Colors & Shapes HSK1, School & Daily Life HSK2
module.exports = [
  {
    title: '颜色和形状 (สีและรูปร่าง)',
    description: 'สีพื้นฐาน · ขนาดและรูปทรง · ความหมายทางวัฒนธรรม — Colors & Shapes',
    icon: '🔴',
    order_num: 11,
    level: 'HSK1',
    grammar_note: 'คุณศัพท์สีในภาษาจีน:\n\n① สี + 的 + นาม = [สี]ของ...\n   • 红色的花 (hóng sè de huā) = ดอกไม้สีแดง\n   • 白色的猫 (bái sè de māo) = แมวสีขาว\n\n② หรือใช้ สี + นาม โดยตรง (ไม่มี 的):\n   • 红花 (hóng huā) = ดอกไม้แดง (พบในภาษาที่เป็นทางการมากกว่า)\n\n③ 这是 + สี = นี่คือสี...\n   • 这是红色。(This is red.)\n\nขนาด:\n• 大 (dà) = ใหญ่ / 小 (xiǎo) = เล็ก',
    cultural_note: 'สีในวัฒนธรรมจีนมีความหมายลึกซึ้ง:\n• 红 (แดง) = โชคดี ความสุข งานแต่งงาน ปีใหม่จีน\n• 白 (ขาว) = ความตาย ความโศกเศร้า (ตรงข้ามกับตะวันตก)\n• 黄 (เหลือง) = ราชวงศ์ จักรพรรดิ (ในอดีต ห้ามสวมชุดเหลืองนอกจากจักรพรรดิ)\n• 黑 (ดำ) = เป็นกลาง แต่บางบริบทหมายถึงสิ่งไม่ดี',
    lessons: [
      {
        title: 'สีพื้นฐาน (基本颜色)',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"红色 (hóng sè)" หมายถึงสีอะไร?', options: ['สีน้ำเงิน', 'สีแดง', 'สีเขียว', 'สีส้ม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"在中国，白色常用于___场合" ใช้สีขาวในโอกาสอะไร?', options: ['งานแต่งงาน', 'งานศพ', 'วันเกิด', 'เทศกาลปีใหม่'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"黑色 (hēi sè)" หมายถึงสีอะไร?', options: ['สีเทา', 'สีน้ำตาล', 'สีดำ', 'สีม่วง'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"这朵花是红色的。" แปลว่า?', options: ['ดอกไม้นี้คือดอกกุหลาบ', 'ดอกไม้นี้สีแดง', 'ฉันชอบดอกไม้แดง', 'ดอกไม้สีแดงสวยงาม'], correct: 1 } },
          { type: 'translate', data: { prompt: 'สีแดง', hint: 'hóng sè', answer: '红色', alternatives: ['红'] } },
          { type: 'translate', data: { prompt: 'สีขาว', hint: 'bái sè', answer: '白色', alternatives: ['白'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สีกับความหมาย', pairs: [{ left: '红色', right: 'สีแดง — โชคดี / ปีใหม่' }, { left: '白色', right: 'สีขาว — ความตาย (ในวัฒนธรรมจีน)' }, { left: '黑色', right: 'สีดำ' }, { left: '黄色', right: 'สีเหลือง — สีจักรพรรดิ' }] } },
          { type: 'fill_blank', data: { sentence: '"这只猫是___色的。" — แมวตัวนี้สีดำ', translation: '黑 = ดำ', options: ['红', '白', '黑', '黄'], correct: 2 } },
        ]
      },
      {
        title: 'ขนาดและรูปร่าง (大小形状)',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"大 (dà)" หมายถึงอะไร?', options: ['เล็ก', 'ใหญ่', 'กลม', 'สั้น'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"这个苹果很大。" แปลว่า?', options: ['แอปเปิ้ลนี้แพง', 'แอปเปิ้ลนี้อร่อย', 'แอปเปิ้ลนี้ใหญ่มาก', 'แอปเปิ้ลนี้หนัก'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"小狗 (xiǎo gǒu)" หมายถึง?', options: ['สุนัขใหญ่', 'สุนัขตัวเล็ก / ลูกหมา', 'สุนัขดุ', 'สุนัขสีดำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '大 กับ 小 เป็น?', options: ['คำพ้องความหมาย', 'คำตรงข้าม', 'คำเหมือนกัน', 'ไม่มีความสัมพันธ์กัน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ใหญ่', hint: 'dà', answer: '大', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เล็ก', hint: 'xiǎo', answer: '小', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คุณศัพท์กับความหมาย', pairs: [{ left: '大', right: 'ใหญ่' }, { left: '小', right: 'เล็ก' }, { left: '多', right: 'มาก' }, { left: '少', right: 'น้อย' }] } },
          { type: 'fill_blank', data: { sentence: '"这个包很___。我放不下所有东西。" — กระเป๋าใบนี้เล็กมาก', translation: '小 = เล็ก', options: ['大', '小', '多', '好'], correct: 1 } },
        ]
      },
      {
        title: 'การอธิบายโดยใช้สีและขนาด',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"红色的大苹果" หมายถึง?', options: ['แอปเปิ้ลแดงใหญ่', 'แอปเปิ้ลแดงเล็ก', 'แอปเปิ้ลน้ำเงิน', 'ดอกไม้แดงใหญ่'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"那只小白猫很可爱。" แปลว่า?', options: ['แมวขาวตัวใหญ่น่ารัก', 'แมวขาวตัวเล็กน่ารักมาก', 'สุนัขขาวตัวเล็ก', 'แมวดำน่ารัก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"这是什么颜色？" แปลว่า?', options: ['นี่คืออะไร?', 'นี่สีอะไร?', 'นี่ขนาดไหน?', 'นี่ราคาเท่าไหร่?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'ลำดับที่ถูกต้องในจีนคือ?', options: ['大红色的包 (ขนาด-สี-的-นาม)', '红色大的包', '的红色大包', '包大红色的'], correct: 0 } },
          { type: 'translate', data: { prompt: 'แมวสีดำตัวเล็ก', hint: '小黑...', answer: '小黑猫', alternatives: ['小的黑猫', '黑色的小猫'] } },
          { type: 'translate', data: { prompt: 'นี่สีอะไร?', hint: '这是什么颜色', answer: '这是什么颜色？', alternatives: ['这是什么颜色'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับความหมาย', pairs: [{ left: '大红花', right: 'ดอกไม้แดงใหญ่' }, { left: '小白猫', right: 'แมวขาวตัวเล็ก' }, { left: '黑色的车', right: 'รถสีดำ' }, { left: '黄色的大书', right: 'หนังสือเหลืองเล่มใหญ่' }] } },
          { type: 'fill_blank', data: { sentence: '"我想要一个___色的大包。" — อยากได้กระเป๋าสีแดงใบใหญ่', translation: '红 = แดง', options: ['黑', '白', '红', '黄'], correct: 2 } },
        ]
      }
    ]
  },
  {
    title: '学校和日常生活 (โรงเรียนและชีวิตประจำวัน)',
    description: 'คำศัพท์โรงเรียน · 想/能 · ตารางเวลาประจำวัน — School & Daily Life',
    icon: '🏫',
    order_num: 12,
    level: 'HSK2',
    grammar_note: 'Modal verbs สำคัญ HSK2:\n\n① 想 (xiǎng) = อยากจะ... (ความต้องการ)\n   • 我想喝水。(I want to drink water.)\n   • 我想去中国。(I want to go to China.)\n\n② 能 (néng) = สามารถ... (ความสามารถ/ความเป็นไปได้)\n   • 我能说中文。(I can speak Chinese.)\n   • 你能帮我吗？(Can you help me?)\n\n③ 上班 (shàng bān) = ไปทำงาน / 下班 (xià bān) = เลิกงาน\n④ 上学 (shàng xué) = ไปโรงเรียน',
    cultural_note: 'ระบบการศึกษาจีน (中国教育): ประถม 6 ปี → มัธยมต้น 3 ปี → มัธยมปลาย 3 ปี → มหาวิทยาลัย — นักเรียนจีนต้องสอบ 高考 (gāo kǎo) ซึ่งเป็นการสอบเข้ามหาวิทยาลัยที่โหดที่สุดในโลก ผลการสอบมีผลต่ออนาคตทั้งชีวิต นักเรียนมักเรียนหนักมาก โดยเฉพาะช่วง ม.ปลาย',
    lessons: [
      {
        title: 'คำศัพท์โรงเรียน (学校词汇)',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"老师 (lǎo shī)" หมายถึงอะไร?', options: ['นักเรียน', 'ครู / อาจารย์', 'โรงเรียน', 'การบ้าน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"作业 (zuò yè)" หมายถึงอะไร?', options: ['ชั้นเรียน', 'การสอบ', 'การบ้าน', 'หนังสือ'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"我有很多作业。" แปลว่า?', options: ['ฉันมีหนังสือเยอะ', 'ฉันมีการบ้านเยอะมาก', 'ฉันชอบโรงเรียน', 'ฉันมีเพื่อนเยอะ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"同学 (tóng xué)" หมายถึงอะไร?', options: ['ครู', 'เพื่อนร่วมชั้น', 'พ่อแม่', 'นักเรียน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ครู / อาจารย์', hint: 'lǎo shī', answer: '老师', alternatives: [] } },
          { type: 'translate', data: { prompt: 'การบ้าน', hint: 'zuò yè', answer: '作业', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำศัพท์กับความหมาย', pairs: [{ left: '老师', right: 'ครู / อาจารย์' }, { left: '学生', right: 'นักเรียน' }, { left: '作业', right: 'การบ้าน' }, { left: '同学', right: 'เพื่อนร่วมชั้น' }] } },
          { type: 'fill_blank', data: { sentence: '"我的___很好，他教我们很多。" — ครูของฉันเก่งมาก', translation: '老师 = ครู', options: ['同学', '作业', '老师', '书'], correct: 2 } },
        ]
      },
      {
        title: '想 (อยากจะ) และ 能 (สามารถ)',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"我想学中文。" แปลว่า?', options: ['ฉันเรียนภาษาจีน', 'ฉันอยากเรียนภาษาจีน', 'ฉันสามารถเรียนภาษาจีนได้', 'ฉันไม่ชอบเรียนภาษาจีน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"你能说英语吗？" แปลว่า?', options: ['คุณอยากพูดภาษาอังกฤษไหม?', 'คุณพูดภาษาอังกฤษไหม?', 'คุณสามารถพูดภาษาอังกฤษได้ไหม?', 'คุณชอบภาษาอังกฤษไหม?'], correct: 2 } },
          { type: 'multiple_choice', data: { question: 'ความต่างระหว่าง 想 กับ 能 คือ?', options: ['ไม่ต่างกัน', '想 = อยาก / 能 = สามารถ', '想 = สามารถ / 能 = อยาก', 'ใช้แทนกันได้เสมอ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"我能帮你。" แปลว่า?', options: ['ฉันอยากช่วยคุณ', 'ฉันช่วยคุณไม่ได้', 'ฉันสามารถช่วยคุณได้', 'ฉันต้องการความช่วยเหลือ'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ฉันอยากไปจีน', hint: '我想去...', answer: '我想去中国', alternatives: ['我想去中國'] } },
          { type: 'translate', data: { prompt: 'คุณสามารถช่วยฉันได้ไหม?', hint: '你能帮我...', answer: '你能帮我吗', alternatives: ['你能帮我吗？'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับความหมาย', pairs: [{ left: '我想喝水', right: 'ฉันอยากดื่มน้ำ (ความต้องการ)' }, { left: '我能游泳', right: 'ฉันว่ายน้ำเป็น (ความสามารถ)' }, { left: '你能来吗', right: 'คุณมาได้ไหม? (ความเป็นไปได้)' }, { left: '她想买书', right: 'เธออยากซื้อหนังสือ' }] } },
          { type: 'fill_blank', data: { sentence: '"我___说一点儿中文，但是不太好。" — ฉันพูดภาษาจีนได้นิดหน่อย', translation: '能 = สามารถ', options: ['想', '能', '有', '是'], correct: 1 } },
        ]
      },
      {
        title: 'ตารางเวลาประจำวัน (日程)',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"上班 (shàng bān)" หมายถึงอะไร?', options: ['เลิกงาน', 'ไปทำงาน', 'ทำงานที่บ้าน', 'วันหยุด'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"下班 (xià bān)" หมายถึงอะไร?', options: ['ไปทำงาน', 'พักเที่ยง', 'เลิกงาน', 'ล่วงเวลา'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"他每天早上七点上班。" แปลว่า?', options: ['เขาเริ่มงานตอน 7 โมงเย็นทุกวัน', 'เขาไปทำงานตอน 7 โมงเช้าทุกวัน', 'เขาเลิกงานตอน 7 โมงเช้า', 'เขาตื่นนอนตอน 7 โมงเช้า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"上学 (shàng xué)" หมายถึงอะไร?', options: ['เรียนหนังสือ', 'ไปโรงเรียน', 'ออกจากโรงเรียน', 'โรงเรียน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ไปทำงาน', hint: 'shàng bān', answer: '上班', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เลิกงาน', hint: 'xià bān', answer: '下班', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '上班', right: 'ไปทำงาน / เริ่มงาน' }, { left: '下班', right: 'เลิกงาน' }, { left: '上学', right: 'ไปโรงเรียน' }, { left: '下课', right: 'เลิกเรียน (หมดชั่วโมง)' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค', translation: 'ฉันเลิกงานตอน 6 โมงเย็นทุกวัน', words: ['我', '每天', '下午', '六点', '下班'], answer: '我 每天 下午 六点 下班' } },
        ]
      }
    ]
  }
];
