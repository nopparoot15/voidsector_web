'use strict';

module.exports = {
  code: 'zh',
  name: 'Chinese',
  native_name: '中文',
  flag: '🇨🇳',
  units: [
    {
      title: 'Basic Characters',
      description: 'ตัวอักษรจีนพื้นฐาน',
      icon: '字',
      order_num: 1,
      lessons: [
        {
          title: 'คำพื้นฐาน',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '人 (rén) แปลว่าอะไร?', options: ['น้ำ', 'ไฟ', 'คน', 'ดี'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '大 (dà) แปลว่าอะไร?', options: ['เล็ก', 'ใหญ่', 'ดี', 'น้ำ'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '小 (xiǎo) แปลว่าอะไร?', options: ['ใหญ่', 'คน', 'เล็ก', 'น้ำ'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '好 (hǎo) แปลว่าอะไร?', options: ['คน', 'ดี', 'ใหญ่', 'เล็ก'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '水 (shuǐ) แปลว่าอะไร?', options: ['ไฟ', 'ดี', 'คน', 'น้ำ'], correct: 3 } },
            { type: 'translate', data: { prompt: 'คน (จีน)', hint: 'rén', answer: '人', alternatives: [] } },
            { type: 'translate', data: { prompt: 'น้ำ (จีน)', hint: 'shuǐ', answer: '水', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่อักษรจีนกับความหมาย', pairs: [{ left: '人', right: 'คน' }, { left: '大', right: 'ใหญ่' }, { left: '小', right: 'เล็ก' }, { left: '水', right: 'น้ำ' }] } }
          ]
        },
        {
          title: 'ธรรมชาติ',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '山 (shān) แปลว่าอะไร?', options: ['ไฟ', 'ภูเขา', 'วัน', 'น้ำ'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '火 (huǒ) แปลว่าอะไร?', options: ['น้ำ', 'ภูเขา', 'ไฟ', 'ดวงอาทิตย์'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '日 (rì) แปลว่าอะไร?', options: ['ดวงจันทร์', 'ดาว', 'ดวงอาทิตย์ / วัน', 'ฟ้า'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '月 (yuè) แปลว่าอะไร?', options: ['ดวงอาทิตย์', 'ไฟ', 'ภูเขา', 'ดวงจันทร์ / เดือน'], correct: 3 } },
            { type: 'multiple_choice', data: { question: '天 (tiān) แปลว่าอะไร?', options: ['น้ำ', 'ไฟ', 'ฟ้า / วัน', 'ภูเขา'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ภูเขา (จีน)', hint: 'shān', answer: '山', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ไฟ (จีน)', hint: 'huǒ', answer: '火', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่อักษรจีนกับความหมาย', pairs: [{ left: '山', right: 'ภูเขา' }, { left: '火', right: 'ไฟ' }, { left: '日', right: 'ดวงอาทิตย์' }, { left: '月', right: 'ดวงจันทร์' }] } }
          ]
        },
        {
          title: 'ทบทวนและขยาย',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: '爱 (ài) แปลว่าอะไร?', options: ['ดี', 'สวย', 'รัก', 'ใหญ่'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '美 (měi) แปลว่าอะไร?', options: ['รัก', 'สวย / สวยงาม', 'ดี', 'เล็ก'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดหมายถึง "ดวงอาทิตย์"?', options: ['月', '天', '日', '火'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'ตัวอักษรใดหมายถึง "น้ำ"?', options: ['火', '水', '山', '日'], correct: 1 } },
            { type: 'translate', data: { prompt: 'รัก (จีน)', hint: 'ài', answer: '爱', alternatives: [] } },
            { type: 'translate', data: { prompt: 'สวย (จีน)', hint: 'měi', answer: '美', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '我 ___ (ài) 你。', translation: 'ฉันรักคุณ', options: ['好', '爱', '大', '小'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่อักษรจีนทั้งหมด', pairs: [{ left: '好', right: 'ดี' }, { left: '爱', right: 'รัก' }, { left: '天', right: 'ฟ้า' }, { left: '美', right: 'สวย' }] } }
          ]
        }
      ]
    },
    {
      title: 'Greetings',
      description: 'คำทักทายภาษาจีน',
      icon: '🤝',
      order_num: 2,
      lessons: [
        {
          title: 'สวัสดีและลาก่อน',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '你好 (nǐ hǎo) แปลว่าอะไร?', options: ['ลาก่อน', 'ขอบคุณ', 'สวัสดี', 'ขอโทษ'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '再见 (zàijiàn) แปลว่าอะไร?', options: ['สวัสดี', 'ลาก่อน', 'ขอบคุณ', 'ยินดี'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '早上好 (zǎoshang hǎo) แปลว่าอะไร?', options: ['สวัสดีตอนเย็น', 'สวัสดีตอนเช้า', 'สวัสดีตอนกลางวัน', 'ราตรีสวัสดิ์'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '晚上好 (wǎnshang hǎo) แปลว่าอะไร?', options: ['สวัสดีตอนเช้า', 'สวัสดีตอนกลางวัน', 'สวัสดีตอนเย็น', 'ราตรีสวัสดิ์'], correct: 2 } },
            { type: 'translate', data: { prompt: 'สวัสดี (จีน)', hint: 'nǐ hǎo', answer: '你好', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ลาก่อน (จีน)', hint: 'zàijiàn', answer: '再见', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '___ (nǐ hǎo)! 你叫什么名字?', translation: 'สวัสดี! คุณชื่ออะไร?', options: ['再见', '谢谢', '你好', '对不起'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำทักทายกับความหมาย', pairs: [{ left: '你好', right: 'สวัสดี' }, { left: '再见', right: 'ลาก่อน' }, { left: '早上好', right: 'สวัสดีตอนเช้า' }, { left: '晚上好', right: 'สวัสดีตอนเย็น' }] } }
          ]
        },
        {
          title: 'ขอบคุณและขอโทษ',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '谢谢 (xièxiè) แปลว่าอะไร?', options: ['ขอโทษ', 'ยินดี', 'ขอบคุณ', 'สวัสดี'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '不客气 (bù kèqi) แปลว่าอะไร?', options: ['ขอโทษ', 'ขอบคุณ', 'สวัสดี', 'ยินดี / ไม่เป็นไร'], correct: 3 } },
            { type: 'multiple_choice', data: { question: '对不起 (duìbuqǐ) แปลว่าอะไร?', options: ['ขอบคุณ', 'ยินดี', 'ขอโทษ', 'สวัสดี'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '没关系 (méi guānxi) แปลว่าอะไร?', options: ['ขอโทษ', 'ขอบคุณ', 'ไม่เป็นไร', 'สวัสดี'], correct: 2 } },
            { type: 'translate', data: { prompt: 'ขอบคุณ (จีน)', hint: 'xièxiè', answer: '谢谢', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ขอโทษ (จีน)', hint: 'duìbuqǐ', answer: '对不起', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'A: 谢谢! B: ___!', translation: 'ก: ขอบคุณ! ข: ยินดี!', options: ['对不起', '你好', '不客气', '再见'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '谢谢', right: 'ขอบคุณ' }, { left: '不客气', right: 'ยินดี' }, { left: '对不起', right: 'ขอโทษ' }, { left: '没关系', right: 'ไม่เป็นไร' }] } }
          ]
        },
        {
          title: 'ใช่ ไม่ใช่ และคำถาม',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: '是 (shì) แปลว่าอะไร?', options: ['ไม่ใช่', 'ใช่ / เป็น', 'ดี', 'ขอบคุณ'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '不是 (bù shì) แปลว่าอะไร?', options: ['ใช่', 'ไม่ใช่ / ไม่เป็น', 'ดี', 'ขอบคุณ'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '你好吗 (nǐ hǎo ma) แปลว่าอะไร?', options: ['คุณชื่ออะไร?', 'คุณอายุเท่าไหร่?', 'คุณสบายดีไหม?', 'คุณมาจากไหน?'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '我很好 (wǒ hěn hǎo) แปลว่าอะไร?', options: ['ฉันไม่สบาย', 'ฉันสบายดี', 'ฉันหิว', 'ฉันเหนื่อย'], correct: 1 } },
            { type: 'translate', data: { prompt: 'ใช่ (จีน)', hint: 'shì', answer: '是', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ไม่ใช่ (จีน)', hint: 'bù shì', answer: '不是', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: 'A: 你好吗? B: 我 ___ 好。', translation: 'ก: สบายดีไหม? ข: ฉันสบายดี', options: ['不', '很', '是', '好'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '是', right: 'ใช่' }, { left: '不是', right: 'ไม่ใช่' }, { left: '你好吗', right: 'สบายดีไหม' }, { left: '我很好', right: 'ฉันสบายดี' }] } }
          ]
        }
      ]
    },
    {
      title: 'Numbers',
      description: 'ตัวเลขภาษาจีน',
      icon: '🔢',
      order_num: 3,
      lessons: [
        {
          title: '1 ถึง 5',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '一 (yī) แปลว่าอะไร?', options: ['สาม', 'หนึ่ง', 'สอง', 'สี่'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '二 (èr) แปลว่าอะไร?', options: ['หนึ่ง', 'สาม', 'สอง', 'สี่'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'เลข 3 ภาษาจีนคือ?', options: ['一', '二', '三', '四'], correct: 2 } },
            { type: 'multiple_choice', data: { question: 'เลข 4 ภาษาจีนคือ?', options: ['三', '四', '五', '二'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '五 (wǔ) แปลว่าอะไร?', options: ['สี่', 'สาม', 'ห้า', 'สอง'], correct: 2 } },
            { type: 'translate', data: { prompt: 'หนึ่ง (จีน)', hint: 'yī', answer: '一', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ห้า (จีน)', hint: 'wǔ', answer: '五', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขจีนกับความหมาย', pairs: [{ left: '一', right: '1' }, { left: '二', right: '2' }, { left: '三', right: '3' }, { left: '五', right: '5' }] } }
          ]
        },
        {
          title: '6 ถึง 10',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '六 (liù) แปลว่าอะไร?', options: ['เจ็ด', 'แปด', 'หก', 'เก้า'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '七 (qī) แปลว่าอะไร?', options: ['หก', 'เจ็ด', 'แปด', 'เก้า'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'เลข 8 ภาษาจีนคือ?', options: ['七', '八', '九', '六'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'เลข 10 ภาษาจีนคือ?', options: ['九', '十', '八', '七'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '九 (jiǔ) แปลว่าอะไร?', options: ['เจ็ด', 'แปด', 'เก้า', 'สิบ'], correct: 2 } },
            { type: 'translate', data: { prompt: 'แปด (จีน)', hint: 'bā', answer: '八', alternatives: [] } },
            { type: 'translate', data: { prompt: 'สิบ (จีน)', hint: 'shí', answer: '十', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขจีนกับความหมาย', pairs: [{ left: '六', right: '6' }, { left: '七', right: '7' }, { left: '八', right: '8' }, { left: '十', right: '10' }] } }
          ]
        },
        {
          title: 'นับในบริบท',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: '我有三个苹果。 แปลว่า?', options: ['ฉันมีแอปเปิ้ลสองลูก', 'ฉันมีแอปเปิ้ลสามลูก', 'ฉันมีแอปเปิ้ลสี่ลูก', 'ฉันมีแอปเปิ้ลห้าลูก'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '八 + 二 = ?', options: ['九', '十', '七', '六'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '十 - 三 = ?', options: ['八', '七', '六', '五'], correct: 1 } },
            { type: 'multiple_choice', data: { question: 'ตัวเลข "9" ภาษาจีนเขียนอย่างไร?', options: ['八', '九', '十', '七'], correct: 1 } },
            { type: 'translate', data: { prompt: 'เก้า (จีน)', hint: 'jiǔ', answer: '九', alternatives: [] } },
            { type: 'translate', data: { prompt: 'หก (จีน)', hint: 'liù', answer: '六', alternatives: [] } },
            { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเลขจีนทั้งหมด', pairs: [{ left: '四', right: '4' }, { left: '九', right: '9' }, { left: '六', right: '6' }, { left: '八', right: '8' }] } },
            { type: 'multiple_choice', data: { question: '五 + 五 = ?', options: ['八', '九', '十', '七'], correct: 2 } }
          ]
        }
      ]
    },
    {
      title: 'Family',
      description: 'คำเรียกสมาชิกในครอบครัว',
      icon: '👨‍👩‍👧‍👦',
      order_num: 4,
      lessons: [
        {
          title: 'พ่อแม่',
          order_num: 1,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '爸爸 (bàba) แปลว่าอะไร?', options: ['แม่', 'พ่อ', 'ปู่', 'ตา'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '妈妈 (māma) แปลว่าอะไร?', options: ['พ่อ', 'แม่', 'ย่า', 'ยาย'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '父母 (fùmǔ) แปลว่าอะไร?', options: ['ปู่ย่า', 'พ่อแม่', 'ตายาย', 'พี่น้อง'], correct: 1 } },
            { type: 'multiple_choice', data: { question: '家 (jiā) แปลว่าอะไร?', options: ['ครอบครัว / บ้าน', 'โรงเรียน', 'ทำงาน', 'ร้านอาหาร'], correct: 0 } },
            { type: 'translate', data: { prompt: 'พ่อ (จีน)', hint: 'bàba', answer: '爸爸', alternatives: [] } },
            { type: 'translate', data: { prompt: 'แม่ (จีน)', hint: 'māma', answer: '妈妈', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '我的 ___ (bàba) 很高。', translation: 'พ่อของฉันสูงมาก', options: ['妈妈', '爸爸', '父母', '家'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '爸爸', right: 'พ่อ' }, { left: '妈妈', right: 'แม่' }, { left: '父母', right: 'พ่อแม่' }, { left: '家', right: 'บ้าน' }] } }
          ]
        },
        {
          title: 'พี่น้อง',
          order_num: 2,
          xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { question: '哥哥 (gēgē) แปลว่าอะไร?', options: ['น้องชาย', 'พี่สาว', 'พี่ชาย', 'น้องสาว'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '姐姐 (jiějie) แปลว่าอะไร?', options: ['พี่ชาย', 'น้องสาว', 'น้องชาย', 'พี่สาว'], correct: 3 } },
            { type: 'multiple_choice', data: { question: '弟弟 (dìdi) แปลว่าอะไร?', options: ['พี่ชาย', 'พี่สาว', 'น้องชาย', 'น้องสาว'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '妹妹 (mèimei) แปลว่าอะไร?', options: ['พี่สาว', 'น้องชาย', 'พี่ชาย', 'น้องสาว'], correct: 3 } },
            { type: 'translate', data: { prompt: 'พี่ชาย (จีน)', hint: 'gēgē', answer: '哥哥', alternatives: [] } },
            { type: 'translate', data: { prompt: 'น้องสาว (จีน)', hint: 'mèimei', answer: '妹妹', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '我有一个 ___ (gēgē) 。', translation: 'ฉันมีพี่ชายหนึ่งคน', options: ['妹妹', '弟弟', '哥哥', '姐姐'], correct: 2 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '哥哥', right: 'พี่ชาย' }, { left: '姐姐', right: 'พี่สาว' }, { left: '弟弟', right: 'น้องชาย' }, { left: '妹妹', right: 'น้องสาว' }] } }
          ]
        },
        {
          title: 'ปู่ย่าตายาย',
          order_num: 3,
          xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { question: '爷爷 (yéyé) แปลว่าอะไร?', options: ['ย่า', 'ตา', 'ปู่', 'ยาย'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '奶奶 (nǎinai) แปลว่าอะไร?', options: ['ปู่', 'ตา', 'ยาย', 'ย่า'], correct: 3 } },
            { type: 'multiple_choice', data: { question: '外公 (wàigōng) แปลว่าอะไร?', options: ['ปู่', 'ย่า', 'ตา', 'ยาย'], correct: 2 } },
            { type: 'multiple_choice', data: { question: '外婆 (wàipó) แปลว่าอะไร?', options: ['ปู่', 'ตา', 'ย่า', 'ยาย'], correct: 3 } },
            { type: 'translate', data: { prompt: 'ปู่ (จีน พ่อฝ่ายพ่อ)', hint: 'yéyé', answer: '爷爷', alternatives: [] } },
            { type: 'translate', data: { prompt: 'ยาย (จีน แม่ฝ่ายแม่)', hint: 'wàipó', answer: '外婆', alternatives: [] } },
            { type: 'fill_blank', data: { sentence: '我的 ___ (nǎinai) 喜欢做饭。', translation: 'ย่าของฉันชอบทำอาหาร', options: ['爷爷', '奶奶', '外公', '外婆'], correct: 1 } },
            { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '爷爷', right: 'ปู่' }, { left: '奶奶', right: 'ย่า' }, { left: '外公', right: 'ตา' }, { left: '外婆', right: 'ยาย' }] } }
          ]
        }
      ]
    }
  ],
  vocab: [
    { word: '人', reading: 'rén', translation: 'คน', example: '这个人很好。', example_translation: 'คนนี้ดีมาก', tags: ['basic'] },
    { word: '大', reading: 'dà', translation: 'ใหญ่', example: '这是一个大房子。', example_translation: 'นี่คือบ้านหลังใหญ่', tags: ['adjective'] },
    { word: '小', reading: 'xiǎo', translation: 'เล็ก', example: '这只猫很小。', example_translation: 'แมวตัวนี้เล็กมาก', tags: ['adjective'] },
    { word: '好', reading: 'hǎo', translation: 'ดี', example: '你好!', example_translation: 'สวัสดี!', tags: ['adjective'] },
    { word: '水', reading: 'shuǐ', translation: 'น้ำ', example: '我喝水。', example_translation: 'ฉันดื่มน้ำ', tags: ['basic'] },
    { word: '山', reading: 'shān', translation: 'ภูเขา', example: '那座山很高。', example_translation: 'ภูเขาลูกนั้นสูงมาก', tags: ['nature'] },
    { word: '火', reading: 'huǒ', translation: 'ไฟ', example: '火很危险。', example_translation: 'ไฟอันตราย', tags: ['nature'] },
    { word: '日', reading: 'rì', translation: 'ดวงอาทิตย์ / วัน', example: '今日天气很好。', example_translation: 'วันนี้อากาศดีมาก', tags: ['nature'] },
    { word: '月', reading: 'yuè', translation: 'ดวงจันทร์ / เดือน', example: '今天的月亮很美。', example_translation: 'ดวงจันทร์คืนนี้สวยมาก', tags: ['nature'] },
    { word: '天', reading: 'tiān', translation: 'ฟ้า / วัน', example: '今天天气很好。', example_translation: 'วันนี้อากาศดีมาก', tags: ['nature'] },
    { word: '爱', reading: 'ài', translation: 'รัก', example: '我爱你。', example_translation: 'ฉันรักคุณ', tags: ['basic'] },
    { word: '美', reading: 'měi', translation: 'สวย / สวยงาม', example: '这朵花很美。', example_translation: 'ดอกไม้ดอกนี้สวยมาก', tags: ['adjective'] },
    { word: '你好', reading: 'nǐ hǎo', translation: 'สวัสดี', example: '你好，很高兴认识你！', example_translation: 'สวัสดี ยินดีที่ได้รู้จัก!', tags: ['greeting'] },
    { word: '再见', reading: 'zàijiàn', translation: 'ลาก่อน', example: '再见，明天见！', example_translation: 'ลาก่อน เจอกันพรุ่งนี้!', tags: ['greeting'] },
    { word: '早上好', reading: 'zǎoshang hǎo', translation: 'สวัสดีตอนเช้า', example: '早上好，今天天气不错！', example_translation: 'สวัสดีตอนเช้า วันนี้อากาศดีนะ!', tags: ['greeting'] },
    { word: '晚上好', reading: 'wǎnshang hǎo', translation: 'สวัสดีตอนเย็น', example: '晚上好，你吃饭了吗？', example_translation: 'สวัสดีตอนเย็น คุณกินข้าวแล้วไหม?', tags: ['greeting'] },
    { word: '谢谢', reading: 'xièxiè', translation: 'ขอบคุณ', example: '谢谢你的帮助！', example_translation: 'ขอบคุณที่ช่วยเหลือ!', tags: ['polite'] },
    { word: '不客气', reading: 'bù kèqi', translation: 'ยินดี / ไม่เป็นไร', example: 'A: 谢谢 B: 不客气', example_translation: 'ก: ขอบคุณ ข: ยินดี', tags: ['polite'] },
    { word: '对不起', reading: 'duìbuqǐ', translation: 'ขอโทษ', example: '对不起，我来晚了。', example_translation: 'ขอโทษที่มาสาย', tags: ['polite'] },
    { word: '没关系', reading: 'méi guānxi', translation: 'ไม่เป็นไร', example: '没关系，没事！', example_translation: 'ไม่เป็นไร ไม่มีอะไรหรอก!', tags: ['polite'] },
    { word: '是', reading: 'shì', translation: 'ใช่ / เป็น', example: '我是学生。', example_translation: 'ฉันเป็นนักเรียน', tags: ['basic'] },
    { word: '不是', reading: 'bù shì', translation: 'ไม่ใช่', example: '我不是老师。', example_translation: 'ฉันไม่ใช่ครู', tags: ['basic'] },
    { word: '一', reading: 'yī', translation: 'หนึ่ง (1)', example: '我有一个苹果。', example_translation: 'ฉันมีแอปเปิ้ลหนึ่งลูก', tags: ['number'] },
    { word: '二', reading: 'èr', translation: 'สอง (2)', example: '二加二等于四。', example_translation: 'สองบวกสองเท่ากับสี่', tags: ['number'] },
    { word: '三', reading: 'sān', translation: 'สาม (3)', example: '我有三只猫。', example_translation: 'ฉันมีแมวสามตัว', tags: ['number'] },
    { word: '四', reading: 'sì', translation: 'สี่ (4)', example: '四月是春天。', example_translation: 'เดือนเมษายนเป็นฤดูใบไม้ผลิ', tags: ['number'] },
    { word: '五', reading: 'wǔ', translation: 'ห้า (5)', example: '我有五本书。', example_translation: 'ฉันมีหนังสือห้าเล่ม', tags: ['number'] },
    { word: '六', reading: 'liù', translation: 'หก (6)', example: '六月很热。', example_translation: 'เดือนมิถุนายนร้อนมาก', tags: ['number'] },
    { word: '七', reading: 'qī', translation: 'เจ็ด (7)', example: '一周有七天。', example_translation: 'หนึ่งสัปดาห์มีเจ็ดวัน', tags: ['number'] },
    { word: '八', reading: 'bā', translation: 'แปด (8)', example: '八月是夏天。', example_translation: 'เดือนสิงหาคมเป็นฤดูร้อน', tags: ['number'] },
    { word: '九', reading: 'jiǔ', translation: 'เก้า (9)', example: '九加一等于十。', example_translation: 'เก้าบวกหนึ่งเท่ากับสิบ', tags: ['number'] },
    { word: '十', reading: 'shí', translation: 'สิบ (10)', example: '十月是秋天。', example_translation: 'เดือนตุลาคมเป็นฤดูใบไม้ร่วง', tags: ['number'] },
    { word: '爸爸', reading: 'bàba', translation: 'พ่อ', example: '我的爸爸是医生。', example_translation: 'พ่อของฉันเป็นหมอ', tags: ['family'] },
    { word: '妈妈', reading: 'māma', translation: 'แม่', example: '我的妈妈做饭很好吃。', example_translation: 'แม่ของฉันทำอาหารอร่อยมาก', tags: ['family'] },
    { word: '父母', reading: 'fùmǔ', translation: 'พ่อแม่', example: '我爱我的父母。', example_translation: 'ฉันรักพ่อแม่ของฉัน', tags: ['family'] },
    { word: '家', reading: 'jiā', translation: 'บ้าน / ครอบครัว', example: '我的家很大。', example_translation: 'บ้านของฉันใหญ่มาก', tags: ['family'] },
    { word: '哥哥', reading: 'gēgē', translation: 'พี่ชาย', example: '我的哥哥很高。', example_translation: 'พี่ชายของฉันสูงมาก', tags: ['family'] },
    { word: '姐姐', reading: 'jiějie', translation: 'พี่สาว', example: '我的姐姐很漂亮。', example_translation: 'พี่สาวของฉันสวยมาก', tags: ['family'] },
    { word: '弟弟', reading: 'dìdi', translation: 'น้องชาย', example: '我的弟弟喜欢踢足球。', example_translation: 'น้องชายของฉันชอบเล่นฟุตบอล', tags: ['family'] },
    { word: '妹妹', reading: 'mèimei', translation: 'น้องสาว', example: '我的妹妹很可爱。', example_translation: 'น้องสาวของฉันน่ารักมาก', tags: ['family'] },
    { word: '爷爷', reading: 'yéyé', translation: 'ปู่ (พ่อของพ่อ)', example: '我的爷爷喜欢钓鱼。', example_translation: 'ปู่ของฉันชอบตกปลา', tags: ['family'] },
    { word: '奶奶', reading: 'nǎinai', translation: 'ย่า (แม่ของพ่อ)', example: '奶奶做的饺子很好吃。', example_translation: 'เกี๊ยวที่ย่าทำอร่อยมาก', tags: ['family'] },
    { word: '外公', reading: 'wàigōng', translation: 'ตา (พ่อของแม่)', example: '外公喜欢看书。', example_translation: 'ตาของฉันชอบอ่านหนังสือ', tags: ['family'] },
    { word: '外婆', reading: 'wàipó', translation: 'ยาย (แม่ของแม่)', example: '外婆做菜很好吃。', example_translation: 'อาหารที่ยายทำอร่อยมาก', tags: ['family'] }
  ]
};
