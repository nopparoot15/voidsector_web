'use strict';

// English units 13-16: Health B1, Jobs B1, Opinions B2, Conditionals B2
module.exports = [
  {
    title: 'Health & Body',
    description: 'Body Parts · Illnesses · At the Doctor — สุขภาพและร่างกาย',
    icon: '🏥',
    order_num: 13,
    level: 'B1',
    grammar_note: 'ภาษาสุขภาพที่ต้องรู้ B1:\n\nSymptoms — อาการ:\n• I have a headache / stomachache / sore throat.\n• I feel dizzy / nauseous / exhausted.\n• My arm hurts. / I\'ve hurt my back.\n\nAt the doctor:\n• "What seems to be the problem?" → อาการเป็นอย่างไร?\n• "How long have you had these symptoms?" → มีอาการมานานแค่ไหน?\n• "Take this twice a day." → กินยานี้วันละสองครั้ง\n\nPresent Perfect for symptoms:\n• "I\'ve been feeling tired all week." — ใช้ have been + -ing',
    cultural_note: 'ในอังกฤษ ระบบสาธารณสุข NHS เป็นของรัฐและฟรีสำหรับประชาชน — แต่ต้องนัด GP (General Practitioner = แพทย์ประจำตัว) ก่อน ไม่สามารถเดินเข้าโรงพยาบาลโดยตรงได้ยกเว้น emergency ซึ่งต่างจากไทยมาก',
    lessons: [
      {
        title: 'Body Parts',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"Lungs" อยู่ในส่วนไหนของร่างกาย?', options: ['หัว', 'หน้าอก / ทรวงอก', 'ท้อง', 'ขา'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Wrist" คืออะไร?', options: ['ข้อศอก', 'ข้อมือ', 'ข้อเท้า', 'หัวเข่า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"She broke her ___." — ถ้าล้มแล้วกระดูกขาหัก?', options: ['lung', 'kidney', 'leg', 'liver'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"The brain controls all body functions." — brain คืออะไร?', options: ['หัวใจ', 'สมอง', 'ปอด', 'ตับ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ข้อเท้า', hint: 'ank...', answer: 'ankle', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ไหล่', hint: 'sho...', answer: 'shoulder', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อวัยวะกับความหมาย', pairs: [{ left: 'heart', right: 'หัวใจ' }, { left: 'lungs', right: 'ปอด' }, { left: 'kidney', right: 'ไต' }, { left: 'spine', right: 'กระดูกสันหลัง' }] } },
          { type: 'fill_blank', data: { sentence: 'She twisted her ___ while running and had to stop.', translation: 'บิดข้อเท้า', options: ['wrist', 'ankle', 'knee', 'elbow'], correct: 1 } },
        ]
      },
      {
        title: 'Illnesses & Symptoms',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"I have a temperature of 39°C." หมายความว่า?', options: ['อุณหภูมิห้องสูง', 'มีไข้', 'อากาศร้อน', 'ปวดหัว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"She feels nauseous." หมายถึง?', options: ['เวียนหัว', 'คลื่นไส้อยากอาเจียน', 'ปวดหลัง', 'ล้ามาก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'อาการไหนเป็นอาการของ flu (ไข้หวัดใหญ่)?', options: ['broken leg', 'high fever and body aches', 'toothache', 'sunburn'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"He has been coughing all night." — ใช้ tense ไหน?', options: ['Present Simple', 'Past Simple', 'Present Perfect Continuous', 'Future Simple'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ไข้หวัด (common cold)', hint: 'a col...', answer: 'a cold', alternatives: ['cold'] } },
          { type: 'translate', data: { prompt: 'ปวดหัว', hint: 'a headac...', answer: 'a headache', alternatives: ['headache'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อาการกับความหมาย', pairs: [{ left: 'fever', right: 'ไข้' }, { left: 'cough', right: 'ไอ' }, { left: 'rash', right: 'ผื่น' }, { left: 'dizzy', right: 'เวียนหัว' }] } },
          { type: 'fill_blank', data: { sentence: '"I\'ve had a ___ throat since yesterday — it hurts to swallow."', translation: 'sore throat = เจ็บคอ', options: ['broken', 'sore', 'weak', 'stiff'], correct: 1 } },
        ]
      },
      {
        title: 'At the Doctor',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"What seems to be the problem?" — แพทย์ถามเพื่ออะไร?', options: ['ถามชื่อผู้ป่วย', 'ถามว่าเจ็บป่วยอะไร', 'ถามประวัติยา', 'ถามเรื่องค่าใช้จ่าย'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Take one tablet three times a day after meals." หมายถึง?', options: ['กินยาเม็ดละ 3 เม็ด', 'กินยา 1 เม็ด วันละ 3 ครั้งหลังอาหาร', 'กินยา 3 วัน', 'กินยาก่อนอาหาร 3 ครั้ง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"The doctor referred me to a specialist." — specialist คือ?', options: ['แพทย์ทั่วไป', 'แพทย์ผู้เชี่ยวชาญเฉพาะทาง', 'พยาบาล', 'เภสัชกร'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Are you allergic to any medication?" — allergic แปลว่า?', options: ['เสพติด', 'แพ้', 'ทนได้', 'ชอบ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ใบสั่งยา', hint: 'pres...', answer: 'prescription', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ห้องฉุกเฉิน', hint: 'emerg...', answer: 'emergency room', alternatives: ['A&E', 'ER'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'prescription', right: 'ใบสั่งยา' }, { left: 'diagnosis', right: 'การวินิจฉัยโรค' }, { left: 'symptom', right: 'อาการ' }, { left: 'ward', right: 'หอผู้ป่วยในโรงพยาบาล' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคที่หมอ', translation: 'คุณมีอาการนี้มานานแค่ไหนแล้ว?', words: ['How', 'long', 'have', 'you', 'had', 'these', 'symptoms', '?'], answer: 'How long have you had these symptoms ?' } },
        ]
      }
    ]
  },
  {
    title: 'Jobs & Work',
    description: 'Professions · Workplace · Job Interviews — อาชีพและการทำงาน',
    icon: '💼',
    order_num: 14,
    level: 'B1',
    grammar_note: 'ภาษาการทำงาน B1:\n\nJob descriptions:\n• "She works as a teacher." (as + อาชีพ)\n• "He is in charge of marketing." (in charge of = รับผิดชอบ)\n• "I\'m responsible for client accounts."\n\nJob interview phrases:\n• "I have 5 years of experience in..."\n• "My greatest strength is..."\n• "I\'m looking for a challenging role."\n\nWorkplace language:\n• deadline = วันกำหนดส่งงาน\n• meeting = การประชุม\n• overtime = ทำงานล่วงเวลา\n• resign / quit = ลาออก',
    cultural_note: 'การสัมภาษณ์งานในตะวันตก มักถามแบบ "Tell me about a time when..." (Behavioural Interview) ซึ่งต้องตอบด้วย STAR method: Situation → Task → Action → Result ต่างจากไทยที่มักถามตรงๆ เกี่ยวกับความสามารถ',
    lessons: [
      {
        title: 'Professions & Workplaces',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"Accountant" คืออาชีพอะไร?', options: ['ทนายความ', 'นักบัญชี', 'สถาปนิก', 'วิศวกร'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"She works as a surgeon at City Hospital." — surgeon คือ?', options: ['พยาบาล', 'ศัลยแพทย์', 'นักรังสีวิทยา', 'เภสัชกร'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"He is self-employed." หมายถึง?', options: ['มีนายจ้าง', 'ว่างงาน', 'ทำธุรกิจส่วนตัว / ฟรีแลนซ์', 'ทำงานนอกเวลา'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"The IT department is on the third floor." — department คือ?', options: ['ชั้น', 'แผนก', 'บริษัท', 'ห้อง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'วิศวกร', hint: 'eng...', answer: 'engineer', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ทนายความ', hint: 'law...', answer: 'lawyer', alternatives: ['attorney', 'solicitor'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อาชีพกับความหมาย', pairs: [{ left: 'architect', right: 'สถาปนิก' }, { left: 'accountant', right: 'นักบัญชี' }, { left: 'surgeon', right: 'ศัลยแพทย์' }, { left: 'journalist', right: 'นักข่าว' }] } },
          { type: 'fill_blank', data: { sentence: 'She ___ as a graphic designer for a marketing agency.', translation: 'works as = ทำงานในตำแหน่ง', options: ['is', 'works', 'does', 'makes'], correct: 1 } },
        ]
      },
      {
        title: 'Workplace Vocabulary',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '"The deadline for this report is Friday." — deadline คือ?', options: ['การประชุม', 'วันกำหนดส่ง', 'ผู้รับผิดชอบ', 'หัวข้อรายงาน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"He had to work overtime last night." หมายถึง?', options: ['ทำงานที่บ้าน', 'ทำงานล่วงเวลา', 'ทำงานพาร์ทไทม์', 'ทำงานจากระยะไกล'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"She handed in her resignation." หมายถึง?', options: ['ส่งรายงาน', 'ยื่นใบลาออก', 'ขอขึ้นเงินเดือน', 'ขอลาพักร้อน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Remote work" หมายถึง?', options: ['ทำงานในออฟฟิศ', 'ทำงานต่างประเทศ', 'ทำงานจากที่บ้าน / ทางไกล', 'ทำงานกลางคืน'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ลาออก (จากงาน)', hint: 'res...', answer: 'resign', alternatives: ['quit'] } },
          { type: 'translate', data: { prompt: 'วันหยุดพักร้อน', hint: 'annual lea...', answer: 'annual leave', alternatives: ['holiday', 'vacation'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: 'deadline', right: 'วันกำหนดส่งงาน' }, { left: 'overtime', right: 'ทำงานล่วงเวลา' }, { left: 'promotion', right: 'การเลื่อนตำแหน่ง' }, { left: 'payslip', right: 'สลิปเงินเดือน' }] } },
          { type: 'fill_blank', data: { sentence: '"She was ___ to Senior Manager after three years of excellent performance."', translation: 'เลื่อนตำแหน่ง', options: ['hired', 'fired', 'promoted', 'transferred'], correct: 2 } },
        ]
      },
      {
        title: 'Job Interviews',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"What are your strengths?" — ตอบอย่างไรที่เหมาะสม?', options: ['I don\'t have any weaknesses.', 'I\'m a fast learner and I work well under pressure.', 'I need a high salary.', 'I don\'t know.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I have 3 years of experience ___ project management."', options: ['at', 'for', 'in', 'on'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Why do you want to work here?" — คำตอบที่ดีที่สุดคือ?', options: ['Because I need money.', 'I admire the company\'s innovation and mission.', 'My friend told me to apply.', 'Because your office is near my home.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Do you have any questions for us?" — ตอบอย่างไรดี?', options: ['No, that\'s all.', 'What are the opportunities for growth in this role?', 'How much is the salary?', 'Can I work from home?'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ประวัติย่อ / CV', hint: 'res...', answer: 'resume', alternatives: ['CV', 'curriculum vitae'] } },
          { type: 'translate', data: { prompt: 'จุดแข็ง', hint: 'streng...', answer: 'strength', alternatives: ['strengths'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำ interview กับความหมาย', pairs: [{ left: 'applicant', right: 'ผู้สมัครงาน' }, { left: 'qualification', right: 'คุณสมบัติ / วุฒิการศึกษา' }, { left: 'reference', right: 'ผู้รับรอง / ข้อมูลอ้างอิง' }, { left: 'probation', right: 'ช่วงทดลองงาน' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค interview', translation: 'ฉันมีประสบการณ์ 5 ปีด้านการตลาด', words: ['I', 'have', '5', 'years', 'of', 'experience', 'in', 'marketing'], answer: 'I have 5 years of experience in marketing' } },
        ]
      }
    ]
  },
  {
    title: 'Opinions & Society',
    description: 'Expressing Views · News · Social Issues — ความคิดเห็นและสังคม',
    icon: '🗣️',
    order_num: 15,
    level: 'B2',
    grammar_note: 'การแสดงความคิดเห็น B2:\n\nHedging — พูดอย่างระมัดระวัง:\n• "I believe / I think / I feel that..."\n• "It seems to me that..."\n• "As far as I know..."\n• "In my opinion / From my perspective..."\n\nContrasting:\n• "Although X, Y..." / "Despite X, Y..."\n• "On the one hand... On the other hand..."\n• "However / Nevertheless / Nonetheless"\n\nAgreeing / Disagreeing:\n• "I\'d have to agree with..." / "I\'m not sure I agree..."\n• "That\'s a fair point, but..." / "I see where you\'re coming from, however..."',
    cultural_note: 'การถกเถียงแบบตะวันตกเน้น "argue your point" อย่างตรงๆ และมีข้อมูลรองรับ ต่างจากวัฒนธรรมไทยที่เน้นการรักษาหน้า — ในห้องเรียนหรือการประชุมตะวันตก การโต้แย้งด้วยเหตุผลถือว่าเป็น critical thinking ที่ดี ไม่ใช่ความไม่สุภาพ',
    lessons: [
      {
        title: 'Expressing Opinions',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: 'ประโยคไหน "hedged opinion" ที่เหมาะสม?', options: ['This is 100% correct.', 'Everyone agrees that...', 'It seems to me that this policy may have unintended consequences.', 'You are wrong.'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"On the one hand, it saves time. On the other hand, ___." — แนวทางต่อไป?', options: ['it is perfect.', 'it raises privacy concerns.', 'everyone loves it.', 'there is no problem.'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I see where you\'re coming from, however..." หมายถึง?', options: ['ฉันเห็นด้วย 100%', 'ฉันไม่เข้าใจ', 'ฉันเข้าใจมุมมองคุณ แต่ยังไม่เห็นด้วย', 'ฉันไม่สนใจ'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Despite the challenges, the project was a success." — ใช้ despite เพื่ออะไร?', options: ['อธิบายสาเหตุ', 'แสดงความขัดแย้ง', 'ให้ตัวอย่าง', 'เพิ่มข้อมูล'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ในความคิดฉัน...', hint: 'in my op...', answer: 'in my opinion', alternatives: ['from my perspective', 'in my view'] } },
          { type: 'translate', data: { prompt: 'ถึงกระนั้น / อย่างไรก็ตาม', hint: 'neverth...', answer: 'nevertheless', alternatives: ['nonetheless', 'however'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ discourse marker กับความหมาย', pairs: [{ left: 'nevertheless', right: 'ถึงกระนั้น' }, { left: 'furthermore', right: 'นอกจากนี้' }, { left: 'consequently', right: 'ดังนั้น / ผลที่ตามมา' }, { left: 'whereas', right: 'ในขณะที่ (ตรงข้าม)' }] } },
          { type: 'fill_blank', data: { sentence: '"___ remote work has many benefits, it can lead to feelings of isolation."', translation: 'แสดงความขัดแย้ง', options: ['Because', 'Although', 'Since', 'Unless'], correct: 1 } },
        ]
      },
      {
        title: 'News & Current Events',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"Breaking news" หมายถึง?', options: ['ข่าวเก่า', 'ข่าวด่วน / ข่าวล่าสุด', 'ข่าวกีฬา', 'ข่าวปลอม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"The prime minister called an election." — เรียก election เพื่ออะไร?', options: ['ให้มีการเลือกตั้ง', 'ยกเลิกรัฐสภา', 'ออกกฎหมายใหม่', 'เรียกประชุม'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"According to official figures, inflation has risen to 5%." — according to หมายถึง?', options: ['ตามที่ ... กล่าว / รายงาน', 'ตามความคิดของ', 'ตามที่คาดการณ์', 'ตรงกันข้ามกับ'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"Authorities are investigating the incident." — authorities คือ?', options: ['นักข่าว', 'เจ้าหน้าที่ / หน่วยงานที่เกี่ยวข้อง', 'ประชาชนทั่วไป', 'นักการเมือง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ข่าวปลอม', hint: 'fake...', answer: 'fake news', alternatives: ['misinformation', 'disinformation'] } },
          { type: 'translate', data: { prompt: 'ภาวะเศรษฐกิจถดถอย', hint: 'reces...', answer: 'recession', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำข่าวกับความหมาย', pairs: [{ left: 'inflation', right: 'อัตราเงินเฟ้อ' }, { left: 'summit', right: 'การประชุมสุดยอดผู้นำ' }, { left: 'sanction', right: 'การคว่ำบาตร' }, { left: 'treaty', right: 'สนธิสัญญา' }] } },
          { type: 'fill_blank', data: { sentence: '"___ to the UN report, global temperatures have risen by 1.5°C over the past century."', translation: 'ตามที่รายงานระบุ', options: ['Due', 'According', 'Based', 'Owing'], correct: 1 } },
        ]
      },
      {
        title: 'Discussing Social Issues',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"Inequality" หมายถึง?', options: ['ความเท่าเทียม', 'ความไม่เท่าเทียม', 'คุณภาพสูง', 'ความยุติธรรม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"Climate change poses a significant threat to biodiversity." — poses a threat หมายถึง?', options: ['แก้ปัญหา', 'ก่อให้เกิดภัยคุกคาม', 'ลดความเสี่ยง', 'เพิ่มความหลากหลาย'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'ประโยคไหน "formal" ที่สุดสำหรับการเขียนความเห็น?', options: ['I think this is really bad.', 'This is totally unfair.', 'This policy disproportionately affects low-income households.', 'Everyone hates this law.'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"Sustainable development" หมายถึง?', options: ['การพัฒนาอย่างรวดเร็ว', 'การพัฒนาที่ยั่งยืนโดยไม่ทำลายสิ่งแวดล้อม', 'การพัฒนาเทคโนโลยี', 'การพัฒนาเมือง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ความยากจน', hint: 'pov...', answer: 'poverty', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ความเท่าเทียมทางเพศ', hint: 'gender eq...', answer: 'gender equality', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำประเด็นสังคมกับความหมาย', pairs: [{ left: 'inequality', right: 'ความไม่เท่าเทียม' }, { left: 'discrimination', right: 'การเลือกปฏิบัติ' }, { left: 'sustainability', right: 'ความยั่งยืน' }, { left: 'welfare', right: 'สวัสดิการ' }] } },
          { type: 'fill_blank', data: { sentence: '"___ unemployment is falling, wages have not kept pace with the cost of living."', translation: 'แม้ว่าการว่างงานลดลง แต่ค่าจ้างยังไม่ตามทัน', options: ['Because', 'Since', 'Although', 'So'], correct: 2 } },
        ]
      }
    ]
  },
  {
    title: 'Conditionals & Hypotheticals',
    description: 'Zero & First · Second & Third · Mixed Conditionals — ประโยคเงื่อนไข',
    icon: '🔀',
    order_num: 16,
    level: 'B2',
    grammar_note: 'Conditional sentences — ประโยคเงื่อนไข:\n\nZero: If + Present, Present (ความจริงทั่วไป)\n• "If you heat water to 100°C, it boils."\n\nFirst: If + Present, will + V (ความเป็นไปได้จริง)\n• "If it rains, I will stay home."\n\nSecond: If + Past, would + V (สมมติ — ไม่น่าเกิดขึ้น)\n• "If I won the lottery, I would travel the world."\n• NOTE: "If I were you..." (ไม่ใช่ was)\n\nThird: If + Past Perfect, would have + V3 (เสียใจกับอดีต)\n• "If I had studied harder, I would have passed."\n\nMixed: ผสม 2nd+3rd หรือ 3rd+2nd',
    cultural_note: '"If I were you" เป็น subjunctive mood ที่ native speakers ใช้เสมอ — หลายคนพูดผิดว่า "if I was you" ซึ่งพบได้ในภาษาพูด แต่ใน formal / written English ต้องใช้ "were" ทุกครั้ง',
    lessons: [
      {
        title: 'Zero & First Conditional',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"If you ___ (mix) red and blue, you get purple." — Zero conditional?', options: ['mixed', 'mix', 'will mix', 'would mix'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If she ___ the bus, she will be late." — First conditional?', options: ['misses', 'will miss', 'missed', 'would miss'], correct: 0 } },
          { type: 'multiple_choice', data: { question: 'Zero conditional ใช้เมื่อไหร่?', options: ['เหตุการณ์ในอดีต', 'ความจริงทั่วไป / วิทยาศาสตร์', 'ความฝันที่ไม่จริง', 'เหตุการณ์ในอนาคตที่แน่นอน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If it ___ tomorrow, we ___ cancel the picnic." — First conditional?', options: ['rains / will', 'will rain / would', 'rained / would', 'rain / will'], correct: 0 } },
          { type: 'translate', data: { prompt: 'ถ้าคุณเรียนหนัก คุณจะผ่าน (first conditional)', hint: 'If you study...', answer: 'If you study hard, you will pass', alternatives: ["If you study hard, you'll pass"] } },
          { type: 'fill_blank', data: { sentence: '"If you ___ (not water) plants regularly, they die." — Zero conditional', translation: 'ความจริงทั่วไป', options: ['don\'t water', 'won\'t water', 'didn\'t water', 'hadn\'t watered'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ conditional type กับการใช้งาน', pairs: [{ left: 'Zero conditional', right: 'ความจริงทั่วไป / ทางวิทยาศาสตร์' }, { left: 'First conditional', right: 'เหตุการณ์ที่เป็นไปได้ในอนาคต' }, { left: 'Second conditional', right: 'สมมติการณ์ที่ไม่น่าเป็นจริง' }, { left: 'Third conditional', right: 'เสียใจกับสิ่งที่เกิดขึ้นในอดีต' }] } },
          { type: 'fill_blank', data: { sentence: '"If you heat ice, it ___ melt." — Zero conditional', translation: 'ความจริงทางวิทยาศาสตร์', options: ['will', 'would', 'had', 'has'], correct: 0 } },
        ]
      },
      {
        title: 'Second & Third Conditional',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"If I ___ a million dollars, I would donate half." — Second conditional?', options: ['have', 'had', 'will have', 'would have'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If I were you, I ___ apologise." — Second conditional?', options: ['will', 'would', 'had', 'would have'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If she had left earlier, she ___ the meeting." — Third conditional?', options: ['wouldn\'t miss', 'wouldn\'t have missed', 'won\'t miss', 'didn\'t miss'], correct: 1 } },
          { type: 'multiple_choice', data: { question: 'Third conditional บอกอะไร?', options: ['สิ่งที่จะเกิดขึ้นแน่นอน', 'สิ่งที่เสียใจกับอดีต ถ้าสถานการณ์ต่างออกไป', 'ความจริงทั่วไป', 'คำสั่ง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ถ้าฉันเป็นคุณ ฉันจะขอโทษ (second cond.)', hint: 'If I were you...', answer: 'If I were you, I would apologise', alternatives: ['If I were you, I would apologize'] } },
          { type: 'translate', data: { prompt: 'ถ้าเขาได้ยิน เขาคงโกรธ (third cond.)', hint: 'If he had heard...', answer: 'If he had heard, he would have been angry', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับ conditional type', pairs: [{ left: 'If I had more time, I would learn piano.', right: 'Second conditional — สมมติปัจจุบัน' }, { left: 'If she had studied, she would have passed.', right: 'Third conditional — เสียใจกับอดีต' }, { left: 'If you press this button, the door opens.', right: 'Zero conditional — ความจริงทั่วไป' }, { left: 'If it rains, we will cancel.', right: 'First conditional — อนาคตที่เป็นไปได้' }] } },
          { type: 'fill_blank', data: { sentence: '"If they ___ (invest) in renewable energy earlier, we ___ (not face) this crisis now."', translation: 'Third conditional — เสียใจกับอดีต', options: ['had invested / wouldn\'t be facing', 'invested / won\'t face', 'would invest / don\'t face', 'have invested / won\'t have faced'], correct: 0 } },
        ]
      },
      {
        title: 'Mixed Conditionals & Wishes',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"If I had taken that job, I would be rich now." — นี่คือ?', options: ['First conditional', 'Third conditional', 'Mixed conditional (3rd→2nd)', 'Zero conditional'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"I wish I ___ speak French." — expressing a present wish?', options: ['can', 'could', 'will', 'would'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"I wish I ___ studied harder." — expressing regret about past?', options: ['have', 'had', 'would have', 'could have'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"If only it ___ stop raining!" — expressing?', options: ['ความจริง', 'ความต้องการให้บางอย่างหยุด', 'ข้อเท็จจริง', 'อนาคต'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันอยากพูดภาษาอังกฤษได้คล่อง (wish - present)', hint: 'I wish I could...', answer: 'I wish I could speak English fluently', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ฉันเสียใจที่ไม่ได้ไปงานปาร์ตี้ (wish - past)', hint: 'I wish I had...', answer: 'I wish I had gone to the party', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยค wish กับความหมาย', pairs: [{ left: 'I wish I were taller.', right: 'อยากสูงกว่านี้ (ปัจจุบัน)' }, { left: 'I wish I had saved more money.', right: 'เสียใจที่ไม่ได้เก็บเงิน (อดีต)' }, { left: 'I wish you would stop.', right: 'อยากให้คนอื่นทำ/หยุดทำ' }, { left: 'If only I had known!', right: 'เสียดายมากที่ไม่รู้ตั้งแต่แรก' }] } },
          { type: 'fill_blank', data: { sentence: '"If I ___ (not lose) my passport, I ___ (be) in Paris right now."', translation: 'Mixed: past condition → present result', options: ['hadn\'t lost / would be', 'didn\'t lose / would be', 'hadn\'t lost / will be', 'didn\'t lose / am'], correct: 0 } },
        ]
      }
    ]
  }
];
