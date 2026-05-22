'use strict';

module.exports = [
  // Unit 5: Family & Daily Life
  {
    title: 'ครอบครัวและชีวิตประจำวัน',
    description: '家庭和日常生活',
    icon: '👨‍👩‍👧',
    order_num: 5,
    lessons: [
      {
        title: 'สมาชิกในครอบครัว',
        order_num: 1,
        xp_reward: 12,
        exercises: [
          { type: 'multiple_choice', data: { question: '爸爸 (bàba) แปลว่าอะไร?', options: ['แม่', 'พ่อ', 'พี่ชาย', 'น้องสาว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '妈妈 (māma) แปลว่าอะไร?', options: ['พ่อ', 'ยาย', 'แม่', 'ลูก'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '哥哥 (gēge) แปลว่าอะไร?', options: ['น้องชาย', 'พี่ชาย', 'น้องสาว', 'พี่สาว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '妹妹 (mèimei) แปลว่าอะไร?', options: ['พี่สาว', 'น้องชาย', 'น้องสาว', 'ลูกสาว'], correct: 2 } },
          { type: 'translate', data: { prompt: 'พ่อ (จีน)', hint: 'bàba', answer: '爸爸', alternatives: ['父亲'] } },
          { type: 'translate', data: { prompt: 'แม่ (จีน)', hint: 'māma', answer: '妈妈', alternatives: ['母亲'] } },
          { type: 'fill_blank', data: { sentence: '我有一个_____(哥哥/弟弟/妹妹)', options: ['哥哥', '弟弟', '妹妹', '爸爸'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำครอบครัว', pairs: [{ left: '爸爸', right: 'พ่อ' }, { left: '妈妈', right: 'แม่' }, { left: '哥哥', right: 'พี่ชาย' }, { left: '妹妹', right: 'น้องสาว' }] } }
        ]
      },
      {
        title: 'กิจวัตรประจำวัน',
        order_num: 2,
        xp_reward: 12,
        exercises: [
          { type: 'multiple_choice', data: { question: '早上 (zǎoshang) แปลว่าอะไร?', options: ['ตอนบ่าย', 'ตอนเช้า', 'ตอนเย็น', 'กลางคืน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '吃饭 (chīfàn) แปลว่าอะไร?', options: ['ดื่มน้ำ', 'นอนหลับ', 'กินข้าว', 'ออกกำลัง'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '睡觉 (shuìjiào) แปลว่าอะไร?', options: ['กินข้าว', 'ตื่นนอน', 'นอนหลับ', 'อ่านหนังสือ'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: ฉันกินข้าวเช้า', words: ['我', '早上', '吃饭'], answer: '我早上吃饭' } },
          { type: 'translate', data: { prompt: 'กินข้าว (จีน)', hint: 'chīfàn', answer: '吃饭', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ตอนเช้า (จีน)', hint: 'zǎoshang', answer: '早上', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '我每天_____(早上/吃饭/睡觉)起床', options: ['早上', '吃饭', '睡觉', '晚上'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่กิจวัตร', pairs: [{ left: '早上', right: 'ตอนเช้า' }, { left: '吃饭', right: 'กินข้าว' }, { left: '睡觉', right: 'นอนหลับ' }, { left: '起床', right: 'ตื่นนอน' }] } }
        ]
      },
      {
        title: 'ที่อยู่อาศัย',
        order_num: 3,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '家 (jiā) แปลว่าอะไร?', options: ['โรงเรียน', 'บ้าน', 'ตลาด', 'ร้านอาหาร'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '房间 (fángjiān) แปลว่าอะไร?', options: ['บ้าน', 'ห้อง', 'ครัว', 'สวน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '厨房 (chúfáng) แปลว่าอะไร?', options: ['ห้องนอน', 'ห้องน้ำ', 'ครัว', 'ห้องนั่งเล่น'], correct: 2 } },
          { type: 'translate', data: { prompt: 'บ้าน (จีน)', hint: 'jiā', answer: '家', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ครัว (จีน)', hint: 'chúfáng', answer: '厨房', alternatives: [] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: บ้านฉันมี 3 ห้อง', words: ['我家', '有', '三个', '房间'], answer: '我家有三个房间' } },
          { type: 'fill_blank', data: { sentence: '我在_____(家/房间/厨房)里做饭', options: ['家', '房间', '厨房', '学校'], correct: 2 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สถานที่ในบ้าน', pairs: [{ left: '家', right: 'บ้าน' }, { left: '房间', right: 'ห้อง' }, { left: '厨房', right: 'ครัว' }, { left: '卫生间', right: 'ห้องน้ำ' }] } }
        ]
      }
    ]
  },

  // Unit 6: Shopping & Food
  {
    title: 'ช้อปปิ้งและอาหาร',
    description: '购物与美食',
    icon: '🛒',
    order_num: 6,
    lessons: [
      {
        title: 'ที่ตลาดและร้านค้า',
        order_num: 1,
        xp_reward: 12,
        exercises: [
          { type: 'multiple_choice', data: { question: '多少钱 (duōshao qián) แปลว่าอะไร?', options: ['แพงมาก', 'ราคาเท่าไร', 'ไม่แพง', 'ลดราคา'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '便宜 (piányí) แปลว่าอะไร?', options: ['แพง', 'ถูก', 'ปานกลาง', 'ฟรี'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '贵 (guì) แปลว่าอะไร?', options: ['ถูก', 'แพง', 'ดี', 'ใหม่'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ราคาเท่าไร? (จีน)', hint: 'duōshao qián', answer: '多少钱', alternatives: ['多少钱？'] } },
          { type: 'translate', data: { prompt: 'ถูก (ราคา) (จีน)', hint: 'piányí', answer: '便宜', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '这个_____(多少/便宜/贵)钱?', options: ['多少', '便宜', '贵', '好'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: สินค้านี้แพงมาก', words: ['这个', '东西', '很', '贵'], answer: '这个东西很贵' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำช้อปปิ้ง', pairs: [{ left: '多少钱', right: 'ราคาเท่าไร' }, { left: '便宜', right: 'ถูก' }, { left: '贵', right: 'แพง' }, { left: '买', right: 'ซื้อ' }] } }
        ]
      },
      {
        title: 'อาหารจีน',
        order_num: 2,
        xp_reward: 12,
        exercises: [
          { type: 'multiple_choice', data: { question: '米饭 (mǐfàn) แปลว่าอะไร?', options: ['ก๋วยเตี๋ยว', 'ข้าวสุก', 'ขนมปัง', 'โจ๊ก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '面条 (miàntiáo) แปลว่าอะไร?', options: ['ข้าว', 'เส้นก๋วยเตี๋ยว', 'ซาลาเปา', 'ขนมจีน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '好吃 (hǎochī) แปลว่าอะไร?', options: ['อิ่มแล้ว', 'อร่อย', 'หิว', 'ไม่ชอบ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ข้าวสุก (จีน)', hint: 'mǐfàn', answer: '米饭', alternatives: [] } },
          { type: 'translate', data: { prompt: 'อร่อย (จีน)', hint: 'hǎochī', answer: '好吃', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '这个_____(米饭/面条/饺子)很好吃', options: ['米饭', '面条', '饺子', '包子'], correct: 2 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: ฉันอยากกินก๋วยเตี๋ยว', words: ['我', '想', '吃', '面条'], answer: '我想吃面条' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่อาหารจีน', pairs: [{ left: '米饭', right: 'ข้าวสุก' }, { left: '面条', right: 'ก๋วยเตี๋ยว' }, { left: '饺子', right: 'เกี๊ยว' }, { left: '包子', right: 'ซาลาเปา' }] } }
        ]
      },
      {
        title: 'ในร้านอาหาร',
        order_num: 3,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '菜单 (càidān) แปลว่าอะไร?', options: ['ใบเสร็จ', 'เมนูอาหาร', 'ช้อน', 'โต๊ะ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '服务员 (fúwùyuán) แปลว่าอะไร?', options: ['แม่ครัว', 'พนักงานเสิร์ฟ', 'เจ้าของร้าน', 'ลูกค้า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '买单 (mǎidān) หมายถึงอะไร?', options: ['สั่งอาหาร', 'เรียกบิล', 'ขอน้ำ', 'ขอเพิ่ม'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เมนู (จีน)', hint: 'càidān', answer: '菜单', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เรียกบิล (จีน)', hint: 'mǎidān', answer: '买单', alternatives: ['结账'] } },
          { type: 'fill_blank', data: { sentence: '服务员，请给我_____(菜单/筷子/水)', options: ['菜单', '筷子', '水', '杯子'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: ขอบิลด้วย', words: ['请', '给', '我', '买单'], answer: '请给我买单' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำในร้านอาหาร', pairs: [{ left: '菜单', right: 'เมนู' }, { left: '服务员', right: 'พนักงาน' }, { left: '买单', right: 'เรียกบิล' }, { left: '好吃', right: 'อร่อย' }] } }
        ]
      }
    ]
  },

  // Unit 7: Grammar - Measure Words & Sentence Patterns
  {
    title: 'ไวยากรณ์จีน',
    description: '量词与句型',
    icon: '📐',
    order_num: 7,
    lessons: [
      {
        title: 'ลักษณนาม (量词)',
        order_num: 1,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '一___书 (หนังสือ 1 เล่ม) ใช้ลักษณนามอะไร?', options: ['条', '本', '张', '个'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '一___狗 (สุนัข 1 ตัว) ใช้ลักษณนามอะไร?', options: ['本', '张', '条', '个'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '一___纸 (กระดาษ 1 แผ่น) ใช้ลักษณนามอะไร?', options: ['个', '张', '条', '本'], correct: 1 } },
          { type: 'fill_blank', data: { sentence: '我有两___苹果', options: ['个', '本', '条', '张'], correct: 0 } },
          { type: 'translate', data: { prompt: 'หนังสือ 3 เล่ม (จีน)', hint: 'sān běn shū', answer: '三本书', alternatives: [] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: ฉันมีสุนัข 2 ตัว', words: ['我', '有', '两条', '狗'], answer: '我有两条狗' } },
          { type: 'fill_blank', data: { sentence: '桌子上有一___纸', options: ['张', '本', '个', '条'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ลักษณนาม', pairs: [{ left: '本', right: 'หนังสือ/สมุด' }, { left: '条', right: 'สัตว์/สิ่งยาว' }, { left: '张', right: 'แผ่น/หน้า' }, { left: '个', right: 'ทั่วไป' }] } }
        ]
      },
      {
        title: 'ประโยค 把 และ 被',
        order_num: 2,
        xp_reward: 15,
        exercises: [
          { type: 'multiple_choice', data: { question: '把 (bǎ) ใช้เพื่ออะไร?', options: ['ประธานทำให้กรรม', 'กรรมทำให้ประธาน', 'คำถาม', 'การปฏิเสธ'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '我把书放在桌子上 แปลว่าอะไร?', options: ['หนังสืออยู่บนโต๊ะ', 'ฉันวางหนังสือบนโต๊ะ', 'โต๊ะมีหนังสือ', 'หนังสือหล่นจากโต๊ะ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '被 (bèi) ใช้ในรูปแบบใด?', options: ['ประโยคบอกเล่า', 'ประโยค passive', 'ประโยคคำถาม', 'ประโยคเงื่อนไข'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันกินแอปเปิ้ลหมดแล้ว (把)', hint: 'Wǒ bǎ píngguǒ chī wán le', answer: '我把苹果吃完了', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '我___书放在包里了', options: ['把', '被', '在', '和'], correct: 0 } },
          { type: 'fill_blank', data: { sentence: '书___我拿走了', options: ['被', '把', '在', '和'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค把: ฉันล้างจาน', words: ['我', '把', '碗', '洗好了'], answer: '我把碗洗好了' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่โครงสร้างประโยค', pairs: [{ left: '把', right: 'ประธาน → กรรม' }, { left: '被', right: 'passive voice' }, { left: '了', right: 'บอกว่าเสร็จแล้ว' }, { left: '过', right: 'เคยทำมาก่อน' }] } }
        ]
      },
      {
        title: 'ประโยคเปรียบเทียบและเงื่อนไข',
        order_num: 3,
        xp_reward: 18,
        exercises: [
          { type: 'multiple_choice', data: { question: 'A比B+形容词 หมายถึงอะไร?', options: ['A เหมือน B', 'A มากกว่า B', 'A น้อยกว่า B', 'A เท่ากับ B'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '苹果比香蕉贵 แปลว่าอะไร?', options: ['กล้วยแพงกว่าแอปเปิ้ล', 'แอปเปิ้ลแพงกว่ากล้วย', 'แอปเปิ้ลถูกกว่ากล้วย', 'ราคาเท่ากัน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '如果...就... ใช้สำหรับอะไร?', options: ['เปรียบเทียบ', 'ประโยคเงื่อนไข ถ้า...ก็...', 'การปฏิเสธ', 'คำถาม'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เขาสูงกว่าฉัน (จีน)', hint: 'tā bǐ wǒ gāo', answer: '他比我高', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '他___我高', options: ['比', '被', '把', '和'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคเงื่อนไข: ถ้าฝนตก ฉันจะไม่ออกไป', words: ['如果', '下雨', '我', '就', '不出门'], answer: '如果下雨我就不出门' } },
          { type: 'fill_blank', data: { sentence: '如果你努力，_____会成功', options: ['就', '比', '被', '把'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่โครงสร้างไวยากรณ์', pairs: [{ left: 'A比B+adj', right: 'A มากกว่า B' }, { left: '如果...就...', right: 'ถ้า...ก็...' }, { left: '虽然...但是...', right: 'ถึงแม้...แต่...' }, { left: '因为...所以...', right: 'เพราะ...ดังนั้น...' }] } }
        ]
      }
    ]
  },

  // Unit 8: Advanced Chinese
  {
    title: 'จีนขั้นสูง',
    description: '高级汉语',
    icon: '🏆',
    order_num: 8,
    lessons: [
      {
        title: 'สำนวนและสุภาษิตจีน',
        order_num: 1,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '马到成功 (mǎdào chénggōng) หมายถึงอะไร?', options: ['ม้าวิ่งเร็ว', 'ประสบความสำเร็จทันที', 'ทำงานหนัก', 'รอคอยนาน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '一石二鸟 (yīshí èrniǎo) ตรงกับสำนวนไทยใด?', options: ['นกสองตัวในมือ', 'ยิงปืนนัดเดียวได้นกสองตัว', 'จับปลาสองมือ', 'หมาสองตัวชนกัน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '半途而废 (bàntú ér fèi) หมายถึงอะไร?', options: ['ทำสำเร็จครึ่งทาง', 'ทำค้างคา / เลิกกลางคัน', 'เดินทางไกล', 'ขยันมาก'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ยิงปืนนัดเดียวได้นกสองตัว (จีน)', hint: 'yīshí èrniǎo', answer: '一石二鸟', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '做事不要_____(半途而废/马到成功/一步一个脚印)', options: ['半途而废', '马到成功', '一步一个脚印', '加油'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '活到老，学到老 แปลว่าอะไร?', options: ['เรียนจนตาย', 'เรียนรู้ตลอดชีวิต', 'แก่แล้วยังเรียน', 'เรียนเมื่อยังเด็ก'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงสุภาษิต: ไม่เจ็บปวดไม่ได้กำไร', words: ['没有', '付出', '就', '没有', '收获'], answer: '没有付出就没有收获' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่สำนวนจีน', pairs: [{ left: '马到成功', right: 'สำเร็จทันที' }, { left: '一石二鸟', right: 'ได้สองต่อ' }, { left: '半途而废', right: 'เลิกกลางคัน' }, { left: '活到老学到老', right: 'เรียนรู้ตลอดชีวิต' }] } }
        ]
      },
      {
        title: 'ภาษาทางการและธุรกิจ',
        order_num: 2,
        xp_reward: 20,
        exercises: [
          { type: 'multiple_choice', data: { question: '您好 (nín hǎo) ต่างจาก 你好 อย่างไร?', options: ['ความหมายต่างกัน', '您好 สุภาพกว่า', '你好 สุภาพกว่า', 'ใช้แทนกันได้เลย'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '请问 (qǐngwèn) ใช้เมื่อไร?', options: ['ขอบคุณ', 'ขอโทษ', 'ขอถามหน่อย', 'ลาก่อน'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '合同 (hétong) แปลว่าอะไร?', options: ['ราคา', 'สัญญา/คอนแทรค', 'ประชุม', 'รายงาน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ขอถามหน่อย (จีน)', hint: 'qǐngwèn', answer: '请问', alternatives: [] } },
          { type: 'translate', data: { prompt: 'สัญญา (ธุรกิจ) (จีน)', hint: 'hétong', answer: '合同', alternatives: ['契约'] } },
          { type: 'fill_blank', data: { sentence: '___请坐，我们开始会议吧', options: ['您好', '你好', '喂', '哦'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคทางการ: ขอโทษที่รบกวน', words: ['不好意思', '打扰', '您', '了'], answer: '不好意思打扰您了' } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำทางการ', pairs: [{ left: '您好', right: 'สวัสดี (สุภาพ)' }, { left: '请问', right: 'ขอถาม' }, { left: '合同', right: 'สัญญา' }, { left: '会议', right: 'การประชุม' }] } }
        ]
      },
      {
        title: 'HSK 4-5 & ภาษาซับซ้อน',
        order_num: 3,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '尽管...还是... หมายถึงอะไร?', options: ['เพราะ...ดังนั้น...', 'ถึงแม้...ก็ยังคง...', 'ถ้า...ก็...', 'ทั้งที่...แต่...'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '不得不 (bùdébù) แปลว่าอะไร?', options: ['ไม่สามารถ', 'ต้องทำ (จำเป็น)', 'ไม่อยากทำ', 'ไม่รู้จะทำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '既然 (jìrán) ใช้เพื่ออะไร?', options: ['เพิ่มเติม', 'เนื่องจาก/ในเมื่อ (เป็นที่ทราบกัน)', 'ทันทีที่', 'แม้ว่า'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ต้องทำ (จำใจ) (จีน)', hint: 'bùdébù', answer: '不得不', alternatives: [] } },
          { type: 'fill_blank', data: { sentence: '我___去工作，虽然我很累', options: ['不得不', '如果', '因为', '但是'], correct: 0 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค: เนื่องจากเธอมาแล้ว เราก็เริ่มได้', words: ['既然', '你', '来了', '我们', '就', '开始吧'], answer: '既然你来了我们就开始吧' } },
          { type: 'fill_blank', data: { sentence: '尽管下雨，他_____来了', options: ['还是', '就是', '也是', '但是'], correct: 0 } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ไวยากรณ์ขั้นสูง', pairs: [{ left: '不得不', right: 'จำต้องทำ' }, { left: '既然', right: 'เนื่องจาก/ในเมื่อ' }, { left: '尽管...还是', right: 'ถึงแม้...ก็ยัง' }, { left: '宁可...也不', right: 'ยอม...แทนที่จะ' }] } }
        ]
      }
    ]
  }
];
