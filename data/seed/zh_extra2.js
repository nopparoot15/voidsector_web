'use strict';

// Chinese units 9-10: HSK5, HSK6
module.exports = [
  {
    title: 'HSK5 Advanced Chinese',
    description: '新闻·正式写作·复杂句型 — ระดับสูง',
    icon: '📡',
    order_num: 140,
    level: 'HSK5',
    grammar_note: 'โครงสร้าง HSK5 สำคัญ:\n\n• 尽管...还是/仍然... = ถึงแม้ว่า...ก็ยังคง\n  尽管很累，她还是坚持完成了工作。\n\n• 既然...就... = เมื่อ(สิ่งนั้น)เป็นจริงแล้ว...ก็...\n  既然你来了，就好好休息吧。\n\n• 无论...都... = ไม่ว่า...ก็...\n  无论多忙，都要照顾好自己。\n\n• 之所以...是因为... = ที่...เป็นเพราะ\n  之所以成功，是因为努力。\n\n• 与其...不如... = แทนที่จะ...ไม่ดีกว่า...\n  与其抱怨，不如行动。',
    cultural_note: 'HSK5 เทียบเท่า B2-C1 ของ CEFR — สามารถดูหนัง อ่านนิยาย ฟังข่าวภาษาจีนได้โดยไม่ต้องใช้พจนานุกรม ในจีนแผ่นดินใหญ่ HSK5 มักใช้เป็นเงื่อนไขรับนักศึกษาต่างชาติในระดับปริญญาโท',
    lessons: [
      {
        title: 'Complex Connectives',
        order_num: 1,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"尽管很累，她还是坚持了" หมายความว่า?', options: ['เพราะเหนื่อยจึงหยุด', 'ถึงแม้เหนื่อยก็ยังทำต่อ', 'เหนื่อยมากจนทำไม่ได้', 'เหนื่อยแล้วพัก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"与其抱怨，不如行动" หมายความว่า?', options: ['ทั้งบ่นทั้งลงมือทำ', 'แทนที่จะบ่น ไม่ดีกว่าลงมือทำ', 'บ่นแล้วค่อยทำ', 'อย่าบ่นอย่าทำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"之所以失败，是因为准备不足" หมายความว่า?', options: ['ความล้มเหลวไม่มีสาเหตุ', 'ที่ล้มเหลวเป็นเพราะเตรียมไม่พอ', 'เตรียมพอแต่ก็ล้มเหลว', 'จะล้มเหลวต่อไป'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"无论多忙，都要..." หมายความว่า?', options: ['ถ้าไม่ยุ่งก็...', 'ไม่ว่าจะยุ่งแค่ไหน ก็ต้อง...', 'ยุ่งมากเกินไปจน...', 'เพราะยุ่งจึง...'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ถึงแม้ว่า...ก็ยังคง (HSK5)', hint: '尽管...还是', answer: '尽管', alternatives: [] } },
          { type: 'translate', data: { prompt: 'แทนที่จะ...ไม่ดีกว่า... (HSK5)', hint: '与其...不如', answer: '与其', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่โครงสร้างกับความหมาย', pairs: [{ left: '尽管...还是', right: 'ถึงแม้ว่า...ก็ยังคง' }, { left: '与其...不如', right: 'แทนที่จะ...ไม่ดีกว่า' }, { left: '既然...就', right: 'เมื่อ...แล้วก็...' }, { left: '之所以...是因为', right: 'ที่...เป็นเพราะ' }] } },
          { type: 'fill_blank', data: { sentence: '___多努力，___能成功。(ไม่ว่าจะพยายามมากแค่ไหน ก็สำเร็จได้)', translation: 'ไม่ว่าจะพยายามมากแค่ไหน ก็สามารถสำเร็จได้', options: ['尽管...还是', '无论...都', '与其...不如', '既然...就'], correct: 1 } },
        ]
      },
      {
        title: 'News & Media Language',
        order_num: 2,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"据报道" (jù bàodào) ใช้เพื่ออะไร?', options: ['แสดงความคิดเห็น', 'อ้างอิงรายงาน/ข่าว', 'ปฏิเสธข่าว', 'ขอข้อมูล'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"舆论" (yúlùn) หมายความว่า?', options: ['ข่าวปลอม', 'ความเห็นสาธารณะ/กระแสสังคม', 'รัฐบาล', 'สื่อ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"可持续发展" (kě chíxù fāzhǎn) คือ?', options: ['การพัฒนาอย่างรวดเร็ว', 'การพัฒนาอย่างยั่งยืน', 'การหยุดพัฒนา', 'การพัฒนาชั่วคราว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"经济下行压力" หมายความว่า?', options: ['เศรษฐกิจกำลังเติบโต', 'แรงกดดันจากเศรษฐกิจชะลอตัว', 'เศรษฐกิจคงที่', 'ไม่มีแรงกดดัน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ตามรายงาน (ภาษาข่าว)', hint: 'jù bàodào', answer: '据报道', alternatives: [] } },
          { type: 'translate', data: { prompt: 'การพัฒนาอย่างยั่งยืน', hint: 'kě chíxù fāzhǎn', answer: '可持续发展', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ศัพท์ข่าวกับความหมาย', pairs: [{ left: '据报道', right: 'ตามรายงาน' }, { left: '舆论', right: 'ความเห็นสาธารณะ' }, { left: '可持续', right: 'ยั่งยืน' }, { left: '下行压力', right: 'แรงกดดันขาลง' }] } },
          { type: 'fill_blank', data: { sentence: '___，该公司宣布裁员百人。(ตามรายงาน)', translation: 'ตามรายงาน บริษัทดังกล่าวประกาศเลิกจ้างพนักงาน 100 คน', options: ['无论', '据报道', '与其', '尽管'], correct: 1 } },
        ]
      },
      {
        title: 'Formal Writing Patterns',
        order_num: 3,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"综上所述" ใช้ตรงไหนในการเขียน?', options: ['เริ่มต้น', 'กลางเรื่อง', 'สรุปตอนท้าย', 'ยกตัวอย่าง'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"诚然" (chéngrán) หมายความว่า?', options: ['อย่างไรก็ตาม', 'แน่นอนว่า / ถูกต้องที่ว่า', 'ในทางตรงกันข้าม', 'ดังนั้น'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"反之" (fǎnzhī) หมายความว่า?', options: ['ดังนั้น', 'ในทางตรงกันข้าม', 'นอกจากนั้น', 'เพราะว่า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"鉴于" (jiànyú) หมายความว่า?', options: ['เพื่อ', 'โดยพิจารณาจาก / เนื่องจาก', 'แม้ว่า', 'นอกจาก'], correct: 1 } },
          { type: 'translate', data: { prompt: 'โดยสรุปแล้ว / สรุปทั้งหมด (formal)', hint: 'zōng shàng suǒ shù', answer: '综上所述', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ในทางตรงกันข้าม (formal)', hint: 'fǎnzhī', answer: '反之', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ discourse marker กับความหมาย', pairs: [{ left: '综上所述', right: 'โดยสรุป' }, { left: '诚然', right: 'แน่นอนว่า' }, { left: '反之', right: 'ในทางตรงกันข้าม' }, { left: '鉴于', right: 'เนื่องจาก' }] } },
          { type: 'fill_blank', data: { sentence: '___以上所有证据，我们得出结论。(เนื่องจากพิจารณาจาก)', translation: 'เนื่องจากพิจารณาหลักฐานทั้งหมดข้างต้น เราสรุปได้ว่า', options: ['综上所述', '诚然', '鉴于', '反之'], correct: 2 } },
        ]
      }
    ]
  },
  {
    title: 'HSK6 Mastery Chinese',
    description: '文学·古典·专业汉语 — ระดับเชี่ยวชาญ',
    icon: '🐉',
    order_num: 150,
    level: 'HSK6',
    grammar_note: 'ระดับ HSK6 — เชี่ยวชาญภาษาจีน:\n\n• 文言文 element (ภาษาจีนคลาสสิก):\n  之(zhī) = ของ (คลาสสิก) เช่น 君子之道\n  乎(hū) = คำถาม/อุทาน\n  也(yě) = ยืนยัน (ท้ายประโยค)\n\n• 四字格 / Chéngyǔ — สำนวน 4 พยางค์:\n  "不可思议" = น่าอัศจรรย์\n  "实事求是" = ยึดถือความเป็นจริง\n  "与时俱进" = ก้าวทันกับยุคสมัย\n\n• Formal hedge:\n  "不失为..." = ถือว่าเป็น... ที่ดีได้\n  "无可厚非" = ไม่อาจตำหนิได้',
    cultural_note: 'HSK6 คือระดับสูงสุดของ HSK ผู้ที่ผ่านสามารถใช้ภาษาจีนได้อย่างคล่องแคล่วในทุกบริบท รวมถึงวรรณกรรม กฎหมาย และวิชาการ ในประเทศจีน มหาวิทยาลัยชั้นนำใช้ HSK6 เป็นเงื่อนไขเข้าเรียน รวมถึงใช้เป็นเอกสารประกอบการขอสัญชาติจีน',
    lessons: [
      {
        title: 'Classical Chinese Elements',
        order_num: 1,
        xp_reward: 40,
        exercises: [
          { type: 'multiple_choice', data: { question: '"不可思议" หมายความว่า?', options: ['ธรรมดา', 'น่าอัศจรรย์ / เหลือเชื่อ', 'น่าเบื่อ', 'อันตราย'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"实事求是" (shí shì qiú shì) หมายความว่า?', options: ['สร้างเรื่องราว', 'ยึดถือความเป็นจริง / เข้าใจข้อเท็จจริง', 'ปฏิเสธความจริง', 'แสวงหาความสุข'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"与时俱进" หมายความว่า?', options: ['ยึดติดกับอดีต', 'ก้าวทันกับยุคสมัย', 'ปฏิเสธการเปลี่ยนแปลง', 'ช้ากว่าเวลา'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"无可厚非" หมายความว่า?', options: ['ควรตำหนิอย่างยิ่ง', 'ไม่อาจตำหนิได้ / เข้าใจได้', 'ยอมรับไม่ได้', 'ต้องแก้ไข'], correct: 1 } },
          { type: 'translate', data: { prompt: 'น่าอัศจรรย์ / เหลือเชื่อ (成语)', hint: 'bù kě sī yì', answer: '不可思议', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ก้าวทันกับยุคสมัย (成语)', hint: 'yǔ shí jù jìn', answer: '与时俱进', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ 成语 กับความหมาย', pairs: [{ left: '不可思议', right: 'เหลือเชื่อ/น่าอัศจรรย์' }, { left: '实事求是', right: 'ยึดความเป็นจริง' }, { left: '与时俱进', right: 'ก้าวทันยุคสมัย' }, { left: '无可厚非', right: 'ไม่อาจตำหนิได้' }] } },
          { type: 'fill_blank', data: { sentence: '他做出的决定___，大家都表示理解。(ไม่อาจตำหนิได้)', translation: 'การตัดสินใจของเขาถือว่าเข้าใจได้ ทุกคนต่างก็เข้าใจ', options: ['不可思议', '与时俱进', '无可厚非', '实事求是'], correct: 2 } },
        ]
      },
      {
        title: 'Academic & Professional Language',
        order_num: 2,
        xp_reward: 40,
        exercises: [
          { type: 'multiple_choice', data: { question: '"不失为" (bù shī wéi) หมายความว่า?', options: ['ไม่ได้เป็น', 'ถือว่าเป็น...ที่ดีได้ / ก็ไม่แย่', 'แย่มาก', 'สมบูรณ์แบบ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"姑且不论" (gū qiě bú lùn) หมายความว่า?', options: ['ถกเถียงเรื่องนี้', 'โดยไม่พูดถึง... / สมมติว่า', 'ตรงกันข้าม', 'เนื่องจาก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"毋庸置疑" (wú yōng zhì yí) หมายความว่า?', options: ['น่าสงสัยมาก', 'ไม่ต้องสงสัยเลย / แน่นอนที่สุด', 'อาจจะ', 'ไม่แน่ใจ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"言简意赅" (yán jiǎn yì gāi) หมายความว่า?', options: ['พูดยาวมาก', 'กระชับและครบถ้วน', 'ไม่ครบถ้วน', 'คลุมเครือ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ไม่ต้องสงสัยเลย (formal)', hint: 'wú yōng zhì yí', answer: '毋庸置疑', alternatives: [] } },
          { type: 'translate', data: { prompt: 'กระชับและครบถ้วน (ภาษาวรรณคดี)', hint: 'yán jiǎn yì gāi', answer: '言简意赅', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ formal expression กับความหมาย', pairs: [{ left: '不失为', right: 'ถือว่าเป็น...ที่ดีได้' }, { left: '毋庸置疑', right: 'ไม่ต้องสงสัยเลย' }, { left: '言简意赅', right: 'กระชับและครบถ้วน' }, { left: '姑且不论', right: 'โดยไม่พูดถึง...' }] } },
          { type: 'fill_blank', data: { sentence: '这个方案___一个可行的选择。(ถือว่าเป็นตัวเลือกที่ดีได้)', translation: 'แผนนี้ถือว่าเป็นตัวเลือกที่ทำได้จริง', options: ['无可厚非', '不失为', '毋庸置疑', '言简意赅'], correct: 1 } },
        ]
      },
      {
        title: 'Literary Comprehension',
        order_num: 3,
        xp_reward: 45,
        exercises: [
          { type: 'multiple_choice', data: { question: '"曲折" (qūzhé) ในบริบทวรรณกรรมหมายถึง?', options: ['ตรงไปตรงมา', 'คดเคี้ยว / มีความซับซ้อน', 'เรียบง่าย', 'รวดเร็ว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"沧桑" (cāngsāng) หมายความว่า?', options: ['สดใส', 'ผ่านการเปลี่ยนแปลงมามาก / ร่องรอยกาลเวลา', 'ใหม่', 'สวยงาม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"字里行间" (zì lǐ háng jiān) หมายความว่า?', options: ['ตัวอักษรสวยงาม', 'ระหว่างบรรทัด / นัยที่ซ่อนอยู่', 'เขียนไม่ชัด', 'พิมพ์ผิด'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"苦中作乐" (kǔ zhōng zuò lè) หมายความว่า?', options: ['ทุกข์ทรมาน', 'หาความสุขท่ามกลางความยากลำบาก', 'ปฏิเสธความทุกข์', 'ไม่สนใจสิ่งใด'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ร่องรอยกาลเวลา / ผ่านมามาก (วรรณกรรม)', hint: 'cāngsāng', answer: '沧桑', alternatives: [] } },
          { type: 'translate', data: { prompt: 'หาความสุขท่ามกลางความยากลำบาก', hint: 'kǔ zhōng zuò lè', answer: '苦中作乐', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ literary term กับความหมาย', pairs: [{ left: '曲折', right: 'คดเคี้ยว/ซับซ้อน' }, { left: '沧桑', right: 'ร่องรอยกาลเวลา' }, { left: '字里行间', right: 'นัยระหว่างบรรทัด' }, { left: '苦中作乐', right: 'สุขท่ามกลางทุกข์' }] } },
          { type: 'fill_blank', data: { sentence: '她的脸上写满了___，岁月的痕迹清晰可见。(ร่องรอยกาลเวลา)', translation: 'บนใบหน้าของเธอเต็มไปด้วยร่องรอยของกาลเวลา มองเห็นได้ชัดเจน', options: ['曲折', '字里行间', '沧桑', '苦中作乐'], correct: 2 } },
        ]
      }
    ]
  }
];
