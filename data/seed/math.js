'use strict';

module.exports = {
  code: 'math',
  name: 'Mathematics',
  native_name: 'คณิตศาสตร์',
  flag: '📐',
  vocab: [],
  units: [

    // ═══════════════════════════════ ป.ต้น ════════════════════════════════

    {
      order_num: 10,
      title: 'จำนวนและการนับ',
      description: 'จำนวนนับ 1–100 การอ่านและเปรียบเทียบ',
      icon: '🔢',
      level: 'ป.ต้น',
      grammar_note: `จำนวนนับ (Natural Numbers):
• จำนวนนับ คือ 1, 2, 3, 4, 5, ... ไปเรื่อยๆ ไม่มีที่สิ้นสุด
• จำนวนคู่ (Even) หารด้วย 2 ลงตัว เช่น 2, 4, 6, 8, 10
• จำนวนคี่ (Odd) หารด้วย 2 ไม่ลงตัว เช่น 1, 3, 5, 7, 9

การเปรียบเทียบจำนวน:
• > หมายถึง มากกว่า เช่น 8 > 5
• < หมายถึง น้อยกว่า เช่น 3 < 7
• = หมายถึง เท่ากับ เช่น 10 = 10

การอ่านตัวเลข (Thai):
• 1=หนึ่ง, 2=สอง, 3=สาม, 4=สี่, 5=ห้า
• 6=หก, 7=เจ็ด, 8=แปด, 9=เก้า, 10=สิบ
• 11=สิบเอ็ด, 12=สิบสอง, 20=ยี่สิบ, 100=หนึ่งร้อย`,
      lessons: [
        {
          order_num: 1, title: 'จำนวน 1–20', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ตัวเลขใดมีค่ามากที่สุด?', options: ['7','12','5','9'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '8 + 5 = ?', options: ['12','13','14','11'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '__ + 4 = 9', options: ['3','4','5','6'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '15 - __ = 8', options: ['5','6','7','8'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ตัวเลขกับคำอ่าน', pairs: [['7','เจ็ด'],['9','เก้า'],['12','สิบสอง'],['15','สิบห้า'],['20','ยี่สิบ']] } },
            { type: 'multiple_choice', data: { prompt: 'จำนวนที่น้อยกว่า 10 คือ?', options: ['11','15','8','20'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'หลังจาก 17 คือเลขอะไร?', answer: '18' } },
            { type: 'multiple_choice', data: { prompt: '3 × 4 = ?', options: ['10','11','12','13'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'จำนวน 21–100', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '30 + 40 = ?', options: ['60','70','80','50'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '100 - 35 = ?', options: ['55','65','75','45'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '50 + __ = 80', options: ['20','25','30','35'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ตัวเลขกับคำอ่าน', pairs: [['25','ยี่สิบห้า'],['40','สี่สิบ'],['63','หกสิบสาม'],['78','เจ็ดสิบแปด'],['100','หนึ่งร้อย']] } },
            { type: 'multiple_choice', data: { prompt: 'ตัวเลขคู่คือข้อใด?', options: ['33','47','62','85'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ตัวเลขคี่คือข้อใด?', options: ['24','36','51','88'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '5 × 10 = ?', answer: '50' } },
            { type: 'multiple_choice', data: { prompt: 'จำนวนใดอยู่ระหว่าง 45 กับ 55?', options: ['40','44','50','58'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'เปรียบเทียบจำนวน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ข้อใดถูกต้อง?', options: ['7 > 9','15 < 10','20 > 18','5 = 6'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '35 ___ 53 ใช้เครื่องหมายใด?', options: ['>','=','<','≥'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '42 ___ 24 ใช้เครื่องหมาย', options: ['>','<','=','≠'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ความหมาย', pairs: [['>','มากกว่า'],['<','น้อยกว่า'],['=','เท่ากับ'],['≠','ไม่เท่ากับ']] } },
            { type: 'multiple_choice', data: { prompt: 'จำนวนใดน้อยที่สุด?', options: ['62','26','46','64'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'จำนวนใดมากที่สุด?', options: ['89','98','79','97'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'เรียงจากน้อยไปมาก: 5, 2, 8, 1 → 1, 2, __, 8', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: '99 + 1 = ?', options: ['99','100','101','110'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 20,
      title: 'การบวกและการลบ',
      description: 'บวกและลบจำนวนเต็มหลักเดียวถึงสามหลัก',
      icon: '➕',
      level: 'ป.ต้น',
      grammar_note: `การบวก (+):
• a + b = ผลบวก
• สับเปลี่ยนได้: 3 + 5 = 5 + 3 = 8
• จัดหมู่ได้: (2+3)+4 = 2+(3+4) = 9
• ตัวอย่าง: 23 + 45 = 68, 124 + 256 = 380

การลบ (−):
• a − b = ผลลบ
• ลบไม่สับเปลี่ยน: 10 − 3 ≠ 3 − 10
• ตรวจสอบ: 68 − 23 = 45 → 45 + 23 = 68
• ตัวอย่าง: 100 − 37 = 63, 500 − 123 = 377

เทคนิคคิดในใจ:
• บวก 9 = บวก 10 แล้วลบ 1: 45 + 9 = 54
• ลบ 8 = ลบ 10 แล้วบวก 2: 52 − 8 = 44`,
      lessons: [
        {
          order_num: 1, title: 'การบวก', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '23 + 45 = ?', options: ['67','68','69','70'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '56 + 37 = ?', options: ['83','93','73','63'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '124 + 256 = ?', answer: '380' } },
            { type: 'fill_blank', data: { sentence: '__ + 48 = 100', options: ['42','52','62','72'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'มีแอปเปิ้ล 15 ผล ซื้อมาอีก 27 ผล รวมมีกี่ผล?', options: ['40','41','42','43'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โจทย์กับคำตอบ', pairs: [['10+10','20'],['25+25','50'],['33+17','50'],['44+56','100']] } },
            { type: 'fill_blank', data: { prompt: '365 + 100 = ?', answer: '465' } },
            { type: 'multiple_choice', data: { prompt: '99 + 99 = ?', options: ['196','197','198','199'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'การลบ', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '85 - 42 = ?', options: ['41','42','43','44'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '100 - 63 = ?', options: ['37','38','39','36'], correct_index: 0 } },
            { type: 'fill_blank', data: { prompt: '500 - 123 = ?', answer: '377' } },
            { type: 'fill_blank', data: { sentence: '200 - __ = 150', options: ['40','50','60','70'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'มีลูกบอล 50 ลูก แจกไป 18 ลูก เหลือกี่ลูก?', options: ['30','31','32','33'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โจทย์กับคำตอบ', pairs: [['20-5','15'],['50-20','30'],['100-1','99'],['75-25','50']] } },
            { type: 'fill_blank', data: { prompt: '1000 - 999 = ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: '63 - 27 = ?', options: ['34','35','36','37'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'โจทย์ปัญหาบวกและลบ', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'มีนักเรียน 35 คน มาสาย 8 คน มาตรงเวลากี่คน?', options: ['25','26','27','28'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ซื้อของราคา 120 บาท จ่าย 200 บาท ทอนเงินเท่าไร?', options: ['70','80','90','100'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ห้องมีเก้าอี้ 40 ตัว นำออก 15 ตัว เหลือกี่ตัว?', answer: '25' } },
            { type: 'multiple_choice', data: { prompt: 'ต้นไม้สูง 45 ซม. โตขึ้น 18 ซม. ตอนนี้สูงกี่ซม.?', options: ['61','62','63','64'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'โรงงานผลิตสินค้า 300 ชิ้น ขายไป 175 ชิ้น เหลือกี่ชิ้น?', answer: '125' } },
            { type: 'multiple_choice', data: { prompt: 'ยายมีเงิน 500 บาท ใช้ไป 235 บาท เหลือเงินเท่าไร?', options: ['255','265','275','285'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'รถ A วิ่ง 250 กม. รถ B วิ่ง 180 กม. รวมกี่กม.?', answer: '430' } },
            { type: 'multiple_choice', data: { prompt: 'ซื้อไข่ 24 ฟอง กินไป 9 ฟอง เหลือกี่ฟอง?', options: ['13','14','15','16'], correct_index: 2 } },
          ]
        },
      ]
    },

    {
      order_num: 30,
      title: 'การคูณ',
      description: 'สูตรคูณแม่ 1–12 และการคูณหลายหลัก',
      icon: '✖️',
      level: 'ป.ต้น',
      grammar_note: `การคูณ (×):
• a × b = บวก a ซ้ำกัน b ครั้ง
• 3 × 4 = 3 + 3 + 3 + 3 = 12
• สับเปลี่ยนได้: 3 × 4 = 4 × 3 = 12

สูตรคูณที่ควรจำ:
• แม่ 2: 2,4,6,8,10,12,14,16,18,20
• แม่ 5: 5,10,15,20,25,30,35,40,45,50
• แม่ 9: 9,18,27,36,45,54,63,72,81,90
• n × 0 = 0, n × 1 = n เสมอ

การคูณหลายหลัก:
• 12 × 5: (10 × 5) + (2 × 5) = 50 + 10 = 60
• 25 × 4: (20 × 4) + (5 × 4) = 80 + 20 = 100
• ตรวจสอบ: หารด้วยตัวคูณต้องได้ตัวตั้ง`,
      lessons: [
        {
          order_num: 1, title: 'สูตรคูณแม่ 2–5', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '3 × 4 = ?', options: ['10','11','12','13'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '5 × 7 = ?', options: ['30','33','35','37'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '2 × __ = 16', options: ['6','7','8','9'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ × 5 = 25', options: ['3','4','5','6'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โจทย์คูณกับคำตอบ', pairs: [['2×6','12'],['3×7','21'],['4×8','32'],['5×9','45']] } },
            { type: 'multiple_choice', data: { prompt: '4 × 4 = ?', options: ['14','16','18','20'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '3 × 9 = ?', answer: '27' } },
            { type: 'multiple_choice', data: { prompt: 'ซื้อของ 5 ชิ้น ชิ้นละ 4 บาท จ่ายทั้งหมด?', options: ['18','20','22','24'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'สูตรคูณแม่ 6–12', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '6 × 7 = ?', options: ['40','42','44','46'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '8 × 9 = ?', options: ['70','72','74','76'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '7 × __ = 63', options: ['7','8','9','10'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '11 × 11 = ?', options: ['111','121','131','141'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '12 × 12 = ?', answer: '144' } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โจทย์คูณกับคำตอบ', pairs: [['6×8','48'],['7×7','49'],['9×9','81'],['12×6','72']] } },
            { type: 'multiple_choice', data: { prompt: '8 × 8 = ?', options: ['60','62','64','66'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '9 × 7 = ?', answer: '63' } },
          ]
        },
        {
          order_num: 3, title: 'การคูณหลายหลัก', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '12 × 5 = ?', options: ['55','60','65','70'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '25 × 4 = ?', options: ['90','95','100','105'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '15 × 6 = ?', answer: '90' } },
            { type: 'multiple_choice', data: { prompt: '20 × 7 = ?', options: ['120','130','140','150'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ × 8 = 96', options: ['10','11','12','13'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ถุงหนึ่งมีส้ม 12 ผล มี 8 ถุง รวมกี่ผล?', options: ['86','96','106','116'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '30 × 9 = ?', answer: '270' } },
            { type: 'multiple_choice', data: { prompt: '11 × 9 = ?', options: ['97','99','101','103'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 40,
      title: 'การหาร',
      description: 'การหารลงตัวและการหารมีเศษ',
      icon: '➗',
      level: 'ป.ต้น',
      grammar_note: `การหาร (÷):
• a ÷ b = แบ่ง a ออกเป็น b กลุ่มเท่าๆ กัน
• 20 ÷ 4 = 5 (20 แบ่งเป็น 4 กลุ่ม กลุ่มละ 5)
• ตรวจสอบ: 5 × 4 = 20 ✓

การหารมีเศษ:
• a ÷ b = ผลหาร เศษ r
• 17 ÷ 5 = 3 เศษ 2 (เพราะ 3×5=15, 17−15=2)
• ตรวจสอบ: (ผลหาร × ตัวหาร) + เศษ = ตัวตั้ง
• 3×5 + 2 = 17 ✓

กฎสำคัญ:
• หารด้วย 0 ไม่ได้ (undefined)
• 0 ÷ n = 0 เสมอ (n ≠ 0)
• n ÷ 1 = n เสมอ
• n ÷ n = 1 เสมอ (n ≠ 0)`,
      lessons: [
        {
          order_num: 1, title: 'การหารพื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '20 ÷ 4 = ?', options: ['3','4','5','6'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '36 ÷ 6 = ?', options: ['4','5','6','7'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ ÷ 7 = 7', options: ['42','49','56','63'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '81 ÷ 9 = ?', answer: '9' } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โจทย์หารกับคำตอบ', pairs: [['18÷3','6'],['24÷4','6'],['35÷5','7'],['48÷8','6']] } },
            { type: 'multiple_choice', data: { prompt: '56 ÷ 8 = ?', options: ['5','6','7','8'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '100 ÷ 10 = ?', answer: '10' } },
            { type: 'multiple_choice', data: { prompt: 'มีขนม 40 ชิ้น แจกให้เด็ก 8 คน เท่ากัน คนละกี่ชิ้น?', options: ['3','4','5','6'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'การหารมีเศษ', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '17 ÷ 5 = ? เศษ ?', options: ['3 เศษ 1','3 เศษ 2','4 เศษ 1','2 เศษ 7'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '25 ÷ 4 = ? เศษ ?', options: ['5 เศษ 5','6 เศษ 1','7 เศษ 0','4 เศษ 9'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '23 ÷ 7 = 3 เศษ ?', answer: '2' } },
            { type: 'multiple_choice', data: { prompt: '31 ÷ 6 = ? เศษ ?', options: ['5 เศษ 1','4 เศษ 7','6 เศษ 0','3 เศษ 13'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: '20 ÷ 3 = 6 เศษ __', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'แบ่งลูกกวาด 27 ชิ้นให้เด็ก 4 คนเท่ากัน เหลือเศษกี่ชิ้น?', options: ['1','2','3','4'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '50 ÷ 7 = 7 เศษ ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: '19 ÷ 5 เศษเท่ากับ?', options: ['2','3','4','1'], correct_index: 3 } },
          ]
        },
        {
          order_num: 3, title: 'โจทย์ปัญหาคูณและหาร', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'แม่ซื้อไข่ 6 แผง แผงละ 30 ฟอง รวมกี่ฟอง?', options: ['160','170','180','190'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'มีดินสอ 72 แท่ง ใส่กล่องกล่องละ 8 แท่ง ใส่ได้กี่กล่อง?', options: ['7','8','9','10'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ราคาส้ม 5 บาทต่อผล ซื้อ 12 ผล จ่ายเงิน?', answer: '60' } },
            { type: 'multiple_choice', data: { prompt: 'แบ่งเค้ก 48 ชิ้นให้ 6 คนเท่ากัน คนละกี่ชิ้น?', options: ['6','7','8','9'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'รถวิ่ง 60 กม./ชม. วิ่ง 3 ชั่วโมง ไปได้กี่กม.?', answer: '180' } },
            { type: 'multiple_choice', data: { prompt: 'ห้องมีโต๊ะ 5 แถว แถวละ 7 ตัว มีโต๊ะทั้งหมดกี่ตัว?', options: ['30','33','35','37'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'มีดอกไม้ 90 ดอก จัดแจกัน แจกันละ 9 ดอก ได้กี่แจกัน?', answer: '10' } },
            { type: 'multiple_choice', data: { prompt: '7 × 8 ÷ 4 = ?', options: ['12','14','16','18'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ═══════════════════════════════ ป.ปลาย ════════════════════════════════

    {
      order_num: 50,
      title: 'เศษส่วน',
      description: 'ความหมาย การเปรียบเทียบ และการคำนวณเศษส่วน',
      icon: '½',
      level: 'ป.ปลาย',
      grammar_note: `เศษส่วน (Fraction) = ตัวเศษ/ตัวส่วน:
• ตัวเศษ (Numerator) = จำนวนส่วนที่มี
• ตัวส่วน (Denominator) = จำนวนส่วนทั้งหมด
• เช่น 3/4 = มี 3 ส่วน จากทั้งหมด 4 ส่วน

เศษส่วนเท่ากัน:
• คูณหรือหารตัวเศษและตัวส่วนด้วยเลขเดียวกัน
• 1/2 = 2/4 = 3/6 = 4/8

การบวกลบเศษส่วน:
• ตัวส่วนเท่ากัน: 1/5 + 2/5 = 3/5
• ตัวส่วนต่างกัน: หา ค.ร.น. ก่อน
• 1/2 + 1/3 = 3/6 + 2/6 = 5/6

การคูณหารเศษส่วน:
• คูณ: 2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2
• หาร: กลับเศษส่วนตัวหารแล้วคูณ
• 2/3 ÷ 1/4 = 2/3 × 4/1 = 8/3`,
      lessons: [
        {
          order_num: 1, title: 'ความหมายของเศษส่วน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'เศษส่วน 3/4 หมายถึงอะไร?', options: ['3 จาก 4 ส่วน','4 จาก 3 ส่วน','3 คูณ 4','3 หาร 4 เศษ 0'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เศษส่วนกับคำอ่าน', pairs: [['1/2','หนึ่งส่วนสอง'],['1/3','หนึ่งส่วนสาม'],['3/4','สามส่วนสี่'],['2/5','สองส่วนห้า']] } },
            { type: 'multiple_choice', data: { prompt: 'เศษส่วนใดมีค่าเท่ากับ 1/2?', options: ['2/3','2/4','3/5','4/6'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'เศษส่วนใดมีค่ามากกว่า 1/2?', options: ['1/3','2/5','3/4','1/4'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '2/4 = __/2', options: ['1','2','3','4'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'พิซซ่า 1 ถาด แบ่ง 8 ชิ้น กิน 3 ชิ้น เหลือเศษส่วนเท่าไร?', options: ['3/8','5/8','3/5','8/5'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'เศษส่วน 6/6 มีค่าเท่ากับเลขอะไร?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'เศษส่วนใดมีค่าน้อยกว่า 1/4?', options: ['1/2','1/3','1/5','2/3'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'บวกและลบเศษส่วน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '1/4 + 2/4 = ?', options: ['2/4','3/4','3/8','1/2'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '5/6 - 2/6 = ?', options: ['3/6','3/12','7/6','1/2'], correct_index: 0 } },
            { type: 'fill_blank', data: { prompt: '1/3 + 1/3 = ?', answer: '2/3' } },
            { type: 'multiple_choice', data: { prompt: '1/2 + 1/4 = ?', options: ['2/6','2/4','3/4','3/6'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '3/5 - 1/5 = __', options: ['1/5','2/5','4/5','2/10'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '1/3 + 1/6 = ?', options: ['2/9','1/2','3/9','2/6'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '7/8 - 3/8 = ?', answer: '4/8' } },
            { type: 'multiple_choice', data: { prompt: 'กินขนม 2/5 ของถาด เพื่อนกิน 1/5 รวมกินไปกี่ส่วน?', options: ['1/5','2/5','3/5','4/5'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'คูณและหารเศษส่วน', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '1/2 × 1/2 = ?', options: ['1','1/2','1/4','2/4'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '2/3 × 3/4 = ?', options: ['5/7','6/12','6/7','5/12'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '1/2 × 6 = ?', answer: '3' } },
            { type: 'multiple_choice', data: { prompt: '3/4 ÷ 3 = ?', options: ['9/4','1/4','3/12','4/3'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '2/3 × __ = 4/3', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '1/3 ÷ 1/3 = ?', options: ['1/9','1/6','1','3'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '3/5 × 10 = ?', answer: '6' } },
            { type: 'multiple_choice', data: { prompt: '2/5 ÷ 2 = ?', options: ['4/5','1/5','2/10','4/10'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 60,
      title: 'ทศนิยม',
      description: 'ทศนิยม 1–3 ตำแหน่ง การบวกลบคูณหาร',
      icon: '🔣',
      level: 'ป.ปลาย',
      grammar_note: `ทศนิยม (Decimal):
• ใช้จุดทศนิยม (.) แบ่งจำนวนเต็มกับเศษ
• 3.14 = 3 + 1/10 + 4/100
• หลักทศนิยม: ทศ (0.1), ร้อย (0.01), พัน (0.001)

การแปลงเศษส่วน ↔ ทศนิยม:
• 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75
• 1/10 = 0.1, 1/100 = 0.01
• ทศนิยม → เศษส่วน: 0.3 = 3/10

การบวกลบทศนิยม:
• จัดตำแหน่งจุดทศนิยมให้ตรงกัน
• 2.50 + 1.30 = 3.80, 5.00 − 2.35 = 2.65

การคูณหารทศนิยม:
• คูณ: นับตำแหน่งทศนิยมรวมกัน
• 0.3 × 0.3 = 0.09 (ทศนิยม 2 ตำแหน่ง)
• หารด้วย 10 = เลื่อนจุดซ้าย 1 ตำแหน่ง`,
      lessons: [
        {
          order_num: 1, title: 'ความหมายทศนิยม', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '0.5 เท่ากับเศษส่วนใด?', options: ['1/4','1/2','1/3','2/3'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '0.25 เท่ากับเศษส่วนใด?', options: ['1/5','2/5','1/4','3/4'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ทศนิยมกับเศษส่วน', pairs: [['0.1','1/10'],['0.5','1/2'],['0.25','1/4'],['0.75','3/4']] } },
            { type: 'multiple_choice', data: { prompt: 'ทศนิยมใดมีค่ามากที่สุด?', options: ['0.3','0.03','0.33','0.033'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '1/4 = 0.__', answer: '25' } },
            { type: 'multiple_choice', data: { prompt: '3/10 เขียนเป็นทศนิยมได้ว่า?', options: ['3.0','0.3','0.03','30.0'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '0.__ = 1/2', options: ['5','50','500','0.5'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ทศนิยมใดมีค่าน้อยที่สุด?', options: ['0.7','0.07','0.007','7.0'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'บวกและลบทศนิยม', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '0.5 + 0.3 = ?', options: ['0.7','0.8','0.9','1.0'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '1.2 + 0.8 = ?', options: ['1.8','1.9','2.0','2.1'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '3.5 - 1.2 = ?', answer: '2.3' } },
            { type: 'multiple_choice', data: { prompt: '2.7 - 0.9 = ?', options: ['1.6','1.7','1.8','1.9'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '1.5 + __ = 3.0', options: ['1.0','1.5','2.0','2.5'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '5.0 - 2.5 = ?', options: ['2.0','2.5','3.0','3.5'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '0.75 + 0.25 = ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: '10.5 - 3.8 = ?', options: ['6.3','6.7','7.3','7.7'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'คูณและหารทศนิยม', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '0.5 × 4 = ?', options: ['1.5','2.0','2.5','3.0'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '1.2 × 3 = ?', options: ['3.2','3.4','3.6','3.8'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '2.5 × 2 = ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: '4.8 ÷ 2 = ?', options: ['2.2','2.4','2.6','2.8'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '__ × 0.1 = 0.5', options: ['5','50','0.5','0.05'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '6.0 ÷ 0.5 = ?', options: ['3','6','12','30'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '0.3 × 0.3 = ?', answer: '0.09' } },
            { type: 'multiple_choice', data: { prompt: 'ราคาน้ำมัน 1.5 บาท/ลิตร เติม 4 ลิตร จ่ายเงิน?', options: ['5','6','7','8'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 70,
      title: 'เปอร์เซ็นต์',
      description: 'ความหมาย การคำนวณ และโจทย์ประยุกต์',
      icon: '%',
      level: 'ป.ปลาย',
      grammar_note: `เปอร์เซ็นต์ (%):
• % = ส่วนร้อย (per hundred)
• 50% = 50/100 = 0.5 = ครึ่งหนึ่ง
• 100% = ทั้งหมด, 0% = ไม่มีเลย

สูตรสำคัญ:
• r% ของ A = (r/100) × A
• 20% ของ 50 = (20/100) × 50 = 10
• A คือกี่% ของ B = (A/B) × 100

การลดราคาและเพิ่มราคา:
• ลด r%: ราคาใหม่ = ราคาเดิม × (1 − r/100)
• เพิ่ม r%: ราคาใหม่ = ราคาเดิม × (1 + r/100)
• ลด 20% จาก 500 บาท = 500 × 0.8 = 400 บาท

ตัวอย่าง:
• ได้คะแนน 45/50 = (45÷50)×100 = 90%
• เงิน 2000, ดอกเบี้ย 5% = 2000×0.05 = 100 บาท`,
      lessons: [
        {
          order_num: 1, title: 'ความหมายของเปอร์เซ็นต์', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '50% เท่ากับเศษส่วนใด?', options: ['1/4','1/2','3/4','1/5'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '25% เท่ากับทศนิยมใด?', options: ['0.025','0.25','2.5','25'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เปอร์เซ็นต์กับเศษส่วน', pairs: [['10%','1/10'],['20%','1/5'],['50%','1/2'],['100%','1/1']] } },
            { type: 'fill_blank', data: { prompt: '1/4 = ___%', answer: '25' } },
            { type: 'multiple_choice', data: { prompt: '0.75 = ___%', options: ['7.5','75','750','0.75'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '80% = __ / 100', options: ['8','80','800','0.8'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '100% ของ 50 คือ?', options: ['5','25','50','100'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '200% = เลขทศนิยม?', answer: '2' } },
          ]
        },
        {
          order_num: 2, title: 'คำนวณเปอร์เซ็นต์', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '50% ของ 80 = ?', options: ['30','40','50','60'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '25% ของ 200 = ?', options: ['25','40','50','75'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '10% ของ 350 = ?', answer: '35' } },
            { type: 'multiple_choice', data: { prompt: '20 คือกี่เปอร์เซ็นต์ของ 100?', options: ['2%','10%','20%','25%'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ % ของ 50 = 25', options: ['25','50','75','100'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '75% ของ 40 = ?', options: ['25','30','35','40'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '5% ของ 200 = ?', answer: '10' } },
            { type: 'multiple_choice', data: { prompt: '15 คือกี่เปอร์เซ็นต์ของ 60?', options: ['15%','20%','25%','30%'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'โจทย์ประยุกต์เปอร์เซ็นต์', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ลดราคา 20% จากราคา 500 บาท จ่ายเงินเท่าไร?', options: ['380','400','420','450'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ได้คะแนน 45 จาก 50 คะแนน คิดเป็นกี่เปอร์เซ็นต์?', options: ['80%','85%','90%','95%'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'สินค้าราคา 1000 บาท ลด 30% ราคาหลังลดเท่าไร?', answer: '700' } },
            { type: 'multiple_choice', data: { prompt: 'เงินฝาก 2000 บาท ดอกเบี้ย 5% ต่อปี ได้ดอกเบี้ยเท่าไร?', options: ['50','80','100','120'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'นักเรียน 40 คน มาเรียน 36 คน คิดเป็นกี่เปอร์เซ็นต์?', answer: '90' } },
            { type: 'multiple_choice', data: { prompt: 'ราคาเดิม 800 บาท ลด 10% ลดไปเท่าไร?', options: ['60','70','80','90'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ซื้อของ 250 บาท ได้ส่วนลด 20% จ่ายเงินเท่าไร?', answer: '200' } },
            { type: 'multiple_choice', data: { prompt: 'ราคา 120 บาท เพิ่มขึ้น 25% ราคาใหม่เท่าไร?', options: ['140','145','150','155'], correct_index: 2 } },
          ]
        },
      ]
    },

    {
      order_num: 80,
      title: 'อัตราส่วนและสัดส่วน',
      description: 'อัตราส่วน สัดส่วน และการนำไปใช้',
      icon: '⚖️',
      level: 'ป.ปลาย',
      grammar_note: `อัตราส่วน (Ratio):
• a:b = การเปรียบเทียบ a กับ b
• ลดรูป: 6:4 = 3:2 (หารด้วย ห.ร.ม.)
• 3:2 ≠ 2:3 (ลำดับสำคัญ)

อัตราส่วนที่เท่ากัน:
• 1:2 = 2:4 = 3:6 = 4:8
• คูณหรือหารทั้งสองข้างด้วยเลขเดียวกัน

สัดส่วน (Proportion):
• a:b = c:d ↔ a×d = b×c (คูณไขว้)
• 2:3 = x:12 → 2×12 = 3x → x = 8

การประยุกต์:
• อัตราเร็ว: ระยะทาง = ความเร็ว × เวลา
• ราคาต่อหน่วย: 3 ชิ้น/120 บาท → 1 ชิ้น/40 บาท
• Scale: แผนที่ 1:10000 → 1 ซม. = 100 เมตร`,
      lessons: [
        {
          order_num: 1, title: 'อัตราส่วน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'อัตราส่วน 2:4 ลดรูปสุดได้ว่า?', options: ['1:3','1:2','2:1','4:2'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ส้ม 6 ผล ฝรั่ง 4 ผล อัตราส่วนคือ?', options: ['4:6','6:4','2:3','3:2'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: '3:9 = 1:__', options: ['2','3','4','6'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่อัตราส่วนที่เท่ากัน', pairs: [['1:2','3:6'],['2:3','4:6'],['1:4','2:8'],['3:5','6:10']] } },
            { type: 'multiple_choice', data: { prompt: 'อัตราส่วน 10:25 ลดรูปสุดได้ว่า?', options: ['1:2','2:5','2:3','4:10'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'อัตราส่วน 12:8 ลดรูปสุดคือ?', answer: '3:2' } },
            { type: 'multiple_choice', data: { prompt: 'อัตราส่วนใดเท่ากับ 1:3?', options: ['2:5','3:9','4:8','5:12'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '5:__ = 1:4', options: ['10','15','20','25'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'สัดส่วนและการประยุกต์', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ถ้า 2:3 = x:12 แล้ว x = ?', options: ['6','7','8','9'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '3:5 = 9:__', options: ['10','12','15','18'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ทำงาน 3 คน เสร็จใน 6 วัน ถ้าเพิ่มเป็น 6 คน เสร็จในกี่วัน?', options: ['2','3','4','12'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'แผนที่ scale 1:10000 ระยะ 5 ซม. = กี่ กม.?', answer: '0.5' } },
            { type: 'multiple_choice', data: { prompt: 'ส่วนผสมน้ำตาล:แป้ง = 2:3 ถ้าใช้น้ำตาล 4 ถ้วย ต้องใช้แป้งกี่ถ้วย?', options: ['4','5','6','7'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ถ้า 1 โหล = 12 ชิ้น 5 โหล = ? ชิ้น', answer: '60' } },
            { type: 'multiple_choice', data: { prompt: 'อัตราแลกเปลี่ยน 1 USD = 35 THB ดังนั้น 10 USD = ? THB', options: ['300','325','350','375'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'x:4 = 6:8 แล้ว x = __', options: ['2','3','4','6'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'โจทย์อัตราส่วนประยุกต์', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'รถวิ่ง 60 กม./ชม. ใช้เวลา 3 ชั่วโมง วิ่งได้กี่กม.?', options: ['160','170','180','190'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ซื้อกาแฟ 3 แก้ว 120 บาท 5 แก้วราคาเท่าไร?', answer: '200' } },
            { type: 'multiple_choice', data: { prompt: 'ต้นไม้สูง 2 เมตร เงา 3 เมตร เสาไฟสูง 6 เมตร เงายาวกี่เมตร?', options: ['7','8','9','10'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'กำแพงยาว 10 เมตร ทาสี 2 คน ใช้เวลา 4 ชม. ถ้า 4 คน ใช้เวลาเท่าไร?', answer: '2' } },
            { type: 'multiple_choice', data: { prompt: 'ผสมสีแดง:น้ำเงิน = 1:2 ถ้าใช้สีแดง 3 ลิตร ต้องใช้สีน้ำเงินกี่ลิตร?', options: ['4','6','8','10'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'แบ่งเงิน 1200 บาท ในอัตราส่วน 1:2 แต่ละส่วนได้เท่าไร?', answer: '400' } },
            { type: 'multiple_choice', data: { prompt: 'ทำชิ้นงาน 1 เครื่องใช้เวลา 5 นาที 12 เครื่องใช้เวลากี่นาที?', options: ['50','55','60','65'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ซื้อน้ำตาล 2 กก. ราคา 40 บาท 5 กก. ราคาเท่าไร?', answer: '100' } },
          ]
        },
      ]
    },

    // ═══════════════════════════════ ม.ต้น ════════════════════════════════

    {
      order_num: 90,
      title: 'พีชคณิตพื้นฐาน',
      description: 'ตัวแปร นิพจน์ และการดำเนินการพื้นฐาน',
      icon: '🔡',
      level: 'ม.ต้น',
      grammar_note: `ตัวแปรและนิพจน์:
• ตัวแปร (Variable) คือสัญลักษณ์แทนจำนวน เช่น x, y, n
• นิพจน์ (Expression): 2x + 3, x² − 1, 3y
• ถ้า x = 5 แล้ว 2x + 3 = 2(5) + 3 = 13

การแทนค่า:
• แทน x = 4 ใน x² + 2x = 16 + 8 = 24
• แทน a=3, b=2 ใน 2a − b = 6 − 2 = 4

อสมการ (Inequality):
• x > 3 หมายถึง x มีค่ามากกว่า 3
• x ≤ 5 หมายถึง x มีค่าน้อยกว่าหรือเท่ากับ 5
• เมื่อคูณ/หารด้วยลบ ต้องกลับทิศเครื่องหมาย
• −2x > 6 → x < −3

ลำดับการดำเนินการ (PEMDAS):
• วงเล็บ → เลขชี้กำลัง → คูณ/หาร → บวก/ลบ`,
      lessons: [
        {
          order_num: 1, title: 'ตัวแปรและนิพจน์', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ถ้า x = 3 แล้ว 2x = ?', options: ['5','6','7','8'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ถ้า a = 4 แล้ว a² = ?', options: ['8','12','16','20'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'ถ้า x = 5 แล้ว x + 3 = __', options: ['7','8','9','10'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่นิพจน์กับความหมาย', pairs: [['2x','x บวก x'],['x²','x คูณ x'],['x/2','x หาร 2'],['x-1','x ลบ 1']] } },
            { type: 'multiple_choice', data: { prompt: 'ถ้า n = 7 แล้ว 3n - 1 = ?', options: ['18','20','21','22'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ถ้า y = 2 แล้ว y³ = ?', answer: '8' } },
            { type: 'multiple_choice', data: { prompt: 'นิพจน์ใดมีค่ามากที่สุดเมื่อ x = 3?', options: ['x+5','2x','x²','3x-1'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'ถ้า a = 6 และ b = 2 แล้ว a/b = __', options: ['2','3','4','6'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'การแก้สมการพื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x + 5 = 12 แล้ว x = ?', options: ['5','6','7','8'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '2x = 18 แล้ว x = ?', options: ['7','8','9','10'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'x - 4 = 9 แล้ว x = __', options: ['5','11','13','14'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '3x = 21 แล้ว x = ?', answer: '7' } },
            { type: 'multiple_choice', data: { prompt: 'x/4 = 5 แล้ว x = ?', options: ['9','15','20','25'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '2x + 1 = 11 แล้ว x = __', options: ['4','5','6','7'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '5x - 3 = 22 แล้ว x = ?', options: ['3','4','5','6'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'x² = 25 แล้ว x = ?', answer: '5' } },
          ]
        },
        {
          order_num: 3, title: 'อสมการและการประยุกต์', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x + 3 > 7 แล้ว x มีค่าอย่างไร?', options: ['x < 4','x > 4','x = 4','x ≤ 4'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '2x ≤ 10 แล้ว x มีค่าอย่างไร?', options: ['x < 5','x > 5','x ≤ 5','x ≥ 5'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'x - 2 < 6 แล้ว x < __', options: ['4','6','8','10'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'คำตอบของ 3x > 15 คือ?', options: ['x > 3','x > 5','x < 5','x < 3'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'อายุ x ปี อีก 5 ปีจะมากกว่า 20 ปี สมการคือ?', options: ['x > 15','x + 5 > 20','x - 5 > 20','5x > 20'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ซื้อของได้ไม่เกิน 100 บาท แต่ละชิ้น 25 บาท ซื้อได้สูงสุดกี่ชิ้น?', answer: '4' } },
            { type: 'multiple_choice', data: { prompt: 'x/3 ≥ 4 แล้ว x ≥ ?', options: ['7','10','12','15'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '2x + 3 ≤ 13 แล้ว x ≤ __', options: ['3','4','5','8'], correct_index: 2 } },
          ]
        },
      ]
    },

    {
      order_num: 100,
      title: 'สมการเชิงเส้น',
      description: 'สมการตัวแปรเดียว ระบบสมการ และโจทย์ปัญหา',
      icon: '📈',
      level: 'ม.ต้น',
      grammar_note: `สมการเชิงเส้น (Linear Equation):
• รูปทั่วไป: ax + b = c โดยที่ a ≠ 0
• วิธีแก้: ทำการย้ายพจน์และหารออก เช่น 3x + 2 = 14 → 3x = 12 → x = 4

ขั้นตอนแก้สมการ:
• ① ย้ายตัวเลขไปด้านหนึ่ง ตัวแปรไปอีกด้านหนึ่ง
• ② หารด้วยสัมประสิทธิ์ของตัวแปร
• ③ ตรวจสอบโดยแทนค่ากลับเข้าสมการ

ระบบสมการสองตัวแปร:
• วิธีแทนค่า (Substitution): แก้หาตัวแปรหนึ่งแล้วแทนสมการอื่น
• วิธีกำจัดตัวแปร (Elimination): บวก/ลบสมการเพื่อยกเลิกตัวแปรหนึ่ง
• ตัวอย่าง: x + y = 5, x - y = 1 → 2x = 6 → x = 3, y = 2`,
      lessons: [
        {
          order_num: 1, title: 'สมการตัวแปรเดียว', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '3x + 2 = 14 แล้ว x = ?', options: ['3','4','5','6'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: '4x - 8 = 12 แล้ว x = ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: '7 - 2x = 1 แล้ว x = ?', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '5(x - 1) = 20 แล้ว x = __', options: ['4','5','6','7'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '(x + 3)/2 = 4 แล้ว x = ?', options: ['3','4','5','6'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '2x + 5 = 3x - 1 แล้ว x = ?', answer: '6' } },
            { type: 'multiple_choice', data: { prompt: '3(2x - 4) = 12 แล้ว x = ?', options: ['2','3','4','5'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'x/3 + 2 = 5 แล้ว x = __', options: ['3','6','9','12'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'ระบบสมการสองตัวแปร', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x + y = 5 และ x - y = 1 แล้ว x = ?', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'x + y = 10 และ 2x - y = 5 แล้ว x = ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: '2x + y = 8 และ x + y = 5 แล้ว x = ?', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'x + y = 7 และ x - y = 3 แล้ว y = __', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '3x + y = 11 และ x + y = 5 แล้ว y = ?', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'x = 2y และ x + y = 9 แล้ว y = ?', answer: '3' } },
            { type: 'multiple_choice', data: { prompt: '2x = y และ x + y = 6 แล้ว x = ?', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'x + 2y = 8 และ x - y = 2 แล้ว x = __', options: ['2','3','4','5'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'โจทย์ปัญหาสมการ', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'อายุพ่อมากกว่าลูก 25 ปี รวมอายุ 55 ปี ลูกอายุเท่าไร?', options: ['13','15','17','20'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ตัวเลขสองจำนวนรวมกัน 20 ต่างกัน 4 ตัวเลขที่มากกว่าคือ?', answer: '12' } },
            { type: 'multiple_choice', data: { prompt: 'มีไก่และวัวรวม 10 ตัว มีขา 28 ขา มีวัวกี่ตัว?', options: ['3','4','5','6'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ซื้อปากกา x ด้าม ราคาด้ามละ 15 บาท จ่าย 90 บาท x = ?', answer: '6' } },
            { type: 'multiple_choice', data: { prompt: 'น้ำในถัง 2 ใบ รวม 50 ลิตร ใบแรกมากกว่าใบสอง 10 ลิตร ใบแรกมีกี่ลิตร?', options: ['25','30','35','40'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ตัวเลขสามเท่าของ x บวก 4 เท่ากับ 19 แล้ว x = ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: 'รถ A วิ่ง 60 กม./ชม. รถ B วิ่ง 80 กม./ชม. ออกพร้อมกัน 3 ชม. ต่างกันกี่กม.?', options: ['50','60','70','80'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'สี่เหลี่ยมมีด้านกว้าง x และด้านยาว x+3 พื้นที่ 40 ตร.ซม. x = ?', answer: '5' } },
          ]
        },
      ]
    },

    {
      order_num: 110,
      title: 'เรขาคณิต',
      description: 'มุม รูปสี่เหลี่ยม สามเหลี่ยม วงกลม และพื้นที่',
      icon: '📐',
      level: 'ม.ต้น',
      grammar_note: `มุม (Angles):
• มุมแหลม < 90°  •  มุมฉาก = 90°  •  มุมป้าน > 90°  •  มุมตรง = 180°
• มุมภายในสามเหลี่ยมรวมกัน = 180°

พื้นที่รูปทรง:
• สามเหลี่ยม: A = ½ × ฐาน × สูง
• สี่เหลี่ยมผืนผ้า: A = กว้าง × ยาว
• สี่เหลี่ยมจัตุรัส: A = ด้าน²
• วงกลม: A = πr²  •  เส้นรอบวง = 2πr

ปริมาตรทรงสามมิติ:
• ทรงสี่เหลี่ยม: V = กว้าง × ยาว × สูง
• ทรงกระบอก: V = πr²h
• ทรงกลม: V = 4/3 πr³
• (π ≈ 3.14159)`,
      lessons: [
        {
          order_num: 1, title: 'มุมและสามเหลี่ยม', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'มุมภายในของสามเหลี่ยมรวมกันเท่ากับ?', options: ['90°','180°','270°','360°'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'สามเหลี่ยมมีมุม 60° 70° มุมที่สามเท่ากับ?', options: ['40°','50°','60°','70°'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'สามเหลี่ยมมีมุม 45° 90° มุมที่สามเท่ากับ?', answer: '45' } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ชื่อมุมกับขนาด', pairs: [['มุมฉาก','90°'],['มุมป้าน','> 90°'],['มุมแหลม','< 90°'],['มุมตรง','180°']] } },
            { type: 'multiple_choice', data: { prompt: 'สามเหลี่ยมด้านเท่ามุมแต่ละมุมเท่ากับ?', options: ['45°','60°','90°','120°'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'สามเหลี่ยมมีฐาน 6 ซม. สูง 4 ซม. พื้นที่เท่ากับ?', answer: '12' } },
            { type: 'multiple_choice', data: { prompt: 'สามเหลี่ยมมีฐาน 10 ซม. สูง 8 ซม. พื้นที่เท่ากับ?', options: ['35','40','45','50'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'สามเหลี่ยมพื้นที่ 24 ตร.ซม. ฐาน 8 ซม. สูง __ ซม.', options: ['4','5','6','8'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'รูปสี่เหลี่ยม', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'สี่เหลี่ยมผืนผ้ากว้าง 5 ยาว 8 พื้นที่เท่ากับ?', options: ['35','40','45','50'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'สี่เหลี่ยมจัตุรัสด้าน 7 ซม. พื้นที่เท่ากับ?', answer: '49' } },
            { type: 'multiple_choice', data: { prompt: 'สี่เหลี่ยมผืนผ้ากว้าง 6 ยาว 9 เส้นรอบรูปเท่ากับ?', options: ['28','30','32','34'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'สี่เหลี่ยมจัตุรัสพื้นที่ 64 ตร.ซม. ด้านยาว __ ซม.', options: ['6','7','8','9'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'สี่เหลี่ยมขนมเปียกปูนเส้นทแยงมุม 6 และ 8 ซม. พื้นที่เท่ากับ?', options: ['20','24','28','32'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่รูปสี่เหลี่ยมกับสมบัติ', pairs: [['จัตุรัส','ด้านเท่าทุกด้าน'],['ผืนผ้า','มุมฉากทุกมุม'],['ขนมเปียกปูน','เส้นทแยงมุมตั้งฉาก'],['คางหมู','มีด้านขนานคู่เดียว']] } },
            { type: 'fill_blank', data: { prompt: 'สี่เหลี่ยมพื้นผ้าพื้นที่ 48 ตร.ซม. กว้าง 6 ซม. ยาว?', answer: '8' } },
            { type: 'multiple_choice', data: { prompt: 'สี่เหลี่ยมด้านขนานฐาน 10 ซม. สูง 6 ซม. พื้นที่เท่ากับ?', options: ['55','60','65','70'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'วงกลมและปริมาตร', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'วงกลมรัศมี 7 ซม. เส้นรอบวง ≈ ? (π ≈ 3.14)', options: ['42.98','43.96','44.94','45.92'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'วงกลมเส้นผ่านศูนย์กลาง 10 ซม. พื้นที่ ≈ ? (π ≈ 3.14)', answer: '78.5' } },
            { type: 'multiple_choice', data: { prompt: 'วงกลมรัศมี 5 ซม. พื้นที่ ≈ ? (π ≈ 3.14)', options: ['68.5','73.5','78.5','83.5'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'กล่องสี่เหลี่ยม กว้าง 3 ยาว 4 สูง 5 ปริมาตร = __', options: ['50','55','60','65'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ทรงกระบอกรัศมี 2 สูง 10 ปริมาตร ≈ ? (π ≈ 3.14)', options: ['115.5','125.6','135.7','145.8'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่สูตรกับรูปทรง', pairs: [['πr²','พื้นที่วงกลม'],['4/3πr³','ปริมาตรทรงกลม'],['πr²h','ปริมาตรทรงกระบอก'],['lwh','ปริมาตรทรงสี่เหลี่ยม']] } },
            { type: 'fill_blank', data: { prompt: 'สระน้ำกว้าง 4 ยาว 6 ลึก 2 เมตร จุน้ำได้ ? ลูกบาศก์เมตร', answer: '48' } },
            { type: 'multiple_choice', data: { prompt: 'ทรงกลมรัศมี 3 ซม. ปริมาตร ≈ ? (π ≈ 3.14)', options: ['100.5','111.6','113.0','120.5'], correct_index: 2 } },
          ]
        },
      ]
    },

    {
      order_num: 120,
      title: 'สถิติและความน่าจะเป็น',
      description: 'ค่าเฉลี่ย มัธยฐาน ฐานนิยม และความน่าจะเป็นพื้นฐาน',
      icon: '📊',
      level: 'ม.ต้น',
      grammar_note: `ค่ากลางทางสถิติ:
• ค่าเฉลี่ย (Mean) = ผลรวมข้อมูลทั้งหมด ÷ จำนวนข้อมูล
• มัธยฐาน (Median) = ค่ากลางเมื่อเรียงข้อมูลจากน้อยไปมาก
• ฐานนิยม (Mode) = ค่าที่ปรากฏบ่อยที่สุดในชุดข้อมูล
• พิสัย (Range) = ค่าสูงสุด − ค่าต่ำสุด

ความน่าจะเป็น (Probability):
• P(A) = จำนวนผลลัพธ์ที่ต้องการ ÷ จำนวนผลลัพธ์ทั้งหมด
• 0 ≤ P(A) ≤ 1 เสมอ
• P(เหตุการณ์แน่นอน) = 1
• P(เหตุการณ์เป็นไปไม่ได้) = 0
• ตัวอย่าง: โยนเหรียญ P(หัว) = 1/2`,
      lessons: [
        {
          order_num: 1, title: 'ค่ากลางทางสถิติ', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ค่าเฉลี่ยของ 4, 6, 8, 10, 12 คือ?', options: ['7','8','9','10'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'มัธยฐานของ 3, 5, 7, 9, 11 คือ?', answer: '7' } },
            { type: 'multiple_choice', data: { prompt: 'ฐานนิยมของ 2, 3, 3, 4, 5, 3, 6 คือ?', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ค่าเฉลี่ยของ 10, 20, 30, 40, 50 คือ?', answer: '30' } },
            { type: 'multiple_choice', data: { prompt: 'มัธยฐานของ 1, 3, 5, 7 คือ? (จำนวนคู่)', options: ['3','4','5','6'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำกับความหมาย', pairs: [['ค่าเฉลี่ย','ผลรวม÷จำนวน'],['มัธยฐาน','ค่ากลางเมื่อเรียงลำดับ'],['ฐานนิยม','ค่าที่ปรากฏบ่อยสุด'],['พิสัย','ค่าสูงสุด-ค่าต่ำสุด']] } },
            { type: 'fill_blank', data: { prompt: 'คะแนน 6 คน: 70,80,90,60,75,85 ค่าเฉลี่ยคือ?', answer: '76.67' } },
            { type: 'multiple_choice', data: { prompt: 'พิสัยของ 5, 12, 8, 20, 3 คือ?', options: ['15','17','19','21'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'ความน่าจะเป็น', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'โยนเหรียญ 1 เหรียญ ความน่าจะเป็นที่ได้หัวคือ?', options: ['1/4','1/3','1/2','1'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'โยนลูกเต๋า ความน่าจะเป็นที่ได้เลข 4 คือ?', options: ['1/3','1/4','1/6','1/2'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ถุงมีลูกบอลแดง 3 ใบ น้ำเงิน 2 ใบ ความน่าจะเป็นจับแดงได้ = ?/5', answer: '3' } },
            { type: 'multiple_choice', data: { prompt: 'ไพ่ 52 ใบ จั่วไพ่หัวใจ ความน่าจะเป็นคือ?', options: ['1/52','1/26','1/13','1/4'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: 'โยนเหรียญ 2 ครั้ง P(HH) = __/4', options: ['1','2','3','4'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'เหตุการณ์ที่เป็นไปไม่ได้มีความน่าจะเป็นเท่าไร?', options: ['0','1/2','1','∞'], correct_index: 0 } },
            { type: 'fill_blank', data: { prompt: 'เหตุการณ์แน่นอนมีความน่าจะเป็นเท่ากับ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'โยนลูกเต๋า P(เลขคู่) = ?', options: ['1/6','1/4','1/3','1/2'], correct_index: 3 } },
          ]
        },
        {
          order_num: 3, title: 'การนำเสนอข้อมูล', xp_reward: 10,
          exercises: [
            { type: 'match_pairs', data: { prompt: 'จับคู่กราฟกับการใช้งาน', pairs: [['แผนภูมิแท่ง','เปรียบเทียบปริมาณ'],['กราฟเส้น','แสดงแนวโน้มตามเวลา'],['แผนภูมิวงกลม','แสดงสัดส่วนทั้งหมด'],['ฮิสโตแกรม','กระจายของข้อมูล']] } },
            { type: 'multiple_choice', data: { prompt: 'ข้อมูล: A=30% B=25% C=45% ส่วนใดในแผนภูมิวงกลมใหญ่ที่สุด?', options: ['A','B','C','เท่ากัน'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'นักเรียน 40 คน ชอบฟุตบอล 25% คิดเป็น ? คน', answer: '10' } },
            { type: 'multiple_choice', data: { prompt: 'ข้อมูลที่แสดงได้ดีด้วยกราฟเส้นคือ?', options: ['สีที่ชอบ','อุณหภูมิรายวัน','ชนิดผลไม้','สัญชาตินักเรียน'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'ตารางความถี่: A=5, B=8, C=7 รวมทั้งหมด ? คน', answer: '20' } },
            { type: 'multiple_choice', data: { prompt: 'กราฟแท่งสูงที่สุด หมายความว่า?', options: ['ค่าน้อยที่สุด','ค่ามากที่สุด','ค่าเฉลี่ย','ค่ากลาง'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'ข้อมูล 5 ค่า รวม 100 ค่าเฉลี่ย = __', options: ['10','15','20','25'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'แผนภูมิวงกลมมีค่าในภาพรวมเท่ากับ?', options: ['50%','75%','100%','200%'], correct_index: 2 } },
          ]
        },
      ]
    },

    // ═══════════════════════════════ ม.ปลาย ════════════════════════════════

    {
      order_num: 130,
      title: 'ฟังก์ชัน',
      description: 'โดเมน เรนจ์ กราฟ และฟังก์ชันประเภทต่างๆ',
      icon: '📉',
      level: 'ม.ปลาย',
      grammar_note: `ฟังก์ชัน (Function):
• ฟังก์ชัน f: A → B คือความสัมพันธ์ที่ทุกสมาชิกใน A จับคู่กับสมาชิกใน B ได้หนึ่งตัวเดียว
• โดเมน (Domain) = เซตของค่า x ที่ฟังก์ชันรับได้
• เรนจ์ (Range) = เซตของค่า f(x) ที่เกิดขึ้นจริง

ประเภทฟังก์ชัน:
• ฟังก์ชันเชิงเส้น: f(x) = ax + b กราฟเป็นเส้นตรง
• ฟังก์ชันกำลังสอง: f(x) = ax² + bx + c กราฟเป็นพาราโบลา
• ฟังก์ชันเอกซ์โพเนนเชียล: f(x) = aˣ (a > 0, a ≠ 1)
• ฟังก์ชันลอการิทึม: f(x) = log_a(x) ผกผันกับ aˣ

ฟังก์ชันผกผัน (Inverse Function):
• f⁻¹(x) คือฟังก์ชันที่ f(f⁻¹(x)) = x
• หาได้โดยสลับ x กับ y แล้วแก้หา y`,
      lessons: [
        {
          order_num: 1, title: 'ความหมายและชนิดของฟังก์ชัน', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'f(x) = 2x + 1 ถ้า x = 3 แล้ว f(3) = ?', options: ['5','6','7','8'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x² ถ้า x = 4 แล้ว f(4) = ?', answer: '16' } },
            { type: 'multiple_choice', data: { prompt: 'ฟังก์ชัน f(x) = 3x - 2 โดเมนคือ?', options: ['x > 0','x ≥ 0','จำนวนจริงทั้งหมด','x ≠ 0'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = √x โดเมนคือ?', options: ['x > 0','x ≥ 0','จำนวนจริงทั้งหมด','x < 0'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'f(x) = 2x f(5) = __', options: ['8','10','12','14'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชันกับชนิด', pairs: [['f(x)=2x+3','ฟังก์ชันเชิงเส้น'],['f(x)=x²','ฟังก์ชันกำลังสอง'],['f(x)=2ˣ','ฟังก์ชันเอกซ์โพเนนเชียล'],['f(x)=log x','ฟังก์ชันลอการิทึม']] } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x² - 4 ค่า f(0) = ?', answer: '-4' } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = 1/x โดเมนคือ?', options: ['x > 0','x ≥ 0','x ≠ 0','จำนวนจริงทั้งหมด'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'ฟังก์ชันกำลังสองและกราฟ', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'กราฟ f(x) = x² มีรูปร่างอย่างไร?', options: ['เส้นตรง','พาราโบลาเปิดบน','พาราโบลาเปิดล่าง','วงกลม'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = -x² มีค่าสูงสุดที่?', options: ['x=0, f=1','x=0, f=0','x=1, f=1','x=-1, f=0'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x² + 2x + 1 = (x + ?)²', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = (x-2)² + 3 จุดยอดอยู่ที่?', options: ['(2,3)','(3,2)','(-2,3)','(2,-3)'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'f(x) = x² - 6x + 9 = (x - __)²', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = 2x² จุดตัดแกน x คือ?', options: ['x=1','x=2','x=0','x=-1'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x² - 4 รากของสมการ x² - 4 = 0 คือ x = ±?', answer: '2' } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = -(x-1)² + 4 ค่าสูงสุดคือ?', options: ['1','2','3','4'], correct_index: 3 } },
          ]
        },
        {
          order_num: 3, title: 'ฟังก์ชันผกผันและคอมโพสิต', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'f(x) = 2x + 4 ฟังก์ชันผกผัน f⁻¹(x) = ?', options: ['(x-4)/2','(x+4)/2','2x-4','x/2-4'], correct_index: 0 } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x + 5 แล้ว f⁻¹(x) = x - ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = 3x g(x) = x + 1 แล้ว f(g(2)) = ?', options: ['7','8','9','10'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'f(x) = x² g(x) = x + 1 แล้ว g(f(3)) = __', options: ['8','9','10','11'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'f(x) = 2x f⁻¹(8) = ?', options: ['2','4','8','16'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'f(x) = x/3 + 1 แล้ว f⁻¹(x) = 3(x - ?)', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'ถ้า f(f⁻¹(x)) = ?', options: ['0','1','x','x²'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'f(x) = 2x+1 g(x) = x-1 แล้ว f(g(x)) = 2x + __', options: ['-1','0','1','2'], correct_index: 0 } },
          ]
        },
      ]
    },

    {
      order_num: 140,
      title: 'ตรีโกณมิติ',
      description: 'sin cos tan และการประยุกต์ใช้',
      icon: '📏',
      level: 'ม.ปลาย',
      grammar_note: `อัตราส่วนตรีโกณมิติ (Trigonometric Ratios):
• sin θ = ด้านตรงข้าม / ด้านตรง (hypotenuse)
• cos θ = ด้านชิดมุม / ด้านตรง
• tan θ = ด้านตรงข้าม / ด้านชิดมุม = sin θ / cos θ

ค่ามาตรฐาน:
• sin 30° = 1/2  •  cos 30° = √3/2  •  tan 30° = 1/√3
• sin 45° = √2/2  •  cos 45° = √2/2  •  tan 45° = 1
• sin 60° = √3/2  •  cos 60° = 1/2  •  tan 60° = √3
• sin 90° = 1  •  cos 90° = 0  •  cos 0° = 1

เอกลักษณ์ตรีโกณมิติ:
• sin²θ + cos²θ = 1
• 1 + tan²θ = sec²θ
• กฎ cosine: c² = a² + b² − 2ab cos C`,
      lessons: [
        {
          order_num: 1, title: 'sin cos tan พื้นฐาน', xp_reward: 15,
          exercises: [
            { type: 'match_pairs', data: { prompt: 'จับคู่อัตราส่วนตรีโกณมิติ', pairs: [['sin θ','ตรงข้าม/ด้านตรง'],['cos θ','ชิด/ด้านตรง'],['tan θ','ตรงข้าม/ชิด'],['cot θ','ชิด/ตรงข้าม']] } },
            { type: 'multiple_choice', data: { prompt: 'sin 30° = ?', options: ['1/4','1/3','1/2','√3/2'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'cos 60° = ?', options: ['√3/2','1/2','1','0'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'tan 45° = ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'sin 90° = ?', options: ['0','1/2','√2/2','1'], correct_index: 3 } },
            { type: 'fill_blank', data: { prompt: 'cos 0° = ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'sin 45° = ?', options: ['1/2','√2/2','√3/2','1'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'cos 90° = __', options: ['-1','0','1','√2/2'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'เอกลักษณ์ตรีโกณมิติ', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'sin²θ + cos²θ = ?', options: ['0','1/2','1','2'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ถ้า sin θ = 3/5 แล้ว cos θ = ?/5', answer: '4' } },
            { type: 'multiple_choice', data: { prompt: 'tan θ = sin θ / ?', options: ['tan θ','cot θ','cos θ','sec θ'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '1 + tan²θ = __', options: ['cos²θ','sin²θ','sec²θ','csc²θ'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'ถ้า cos θ = 0 แล้ว θ = ?', options: ['0°','30°','60°','90°'], correct_index: 3 } },
            { type: 'fill_blank', data: { prompt: 'ถ้า sin θ = 1/2 มุม θ เป็นกี่องศา?', answer: '30' } },
            { type: 'multiple_choice', data: { prompt: 'sec θ = 1/? ', options: ['sin θ','cos θ','tan θ','cot θ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'sin²θ = 1 - __', options: ['sin²θ','tan²θ','cos²θ','sec²θ'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'การประยุกต์ตรีโกณมิติ', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ต้นไม้สูง ห่าง 10 เมตร มุมเงย 45° ต้นไม้สูงกี่เมตร?', options: ['5','10','15','20'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'บันไดยาว 5 เมตร ทำมุม 60° กับพื้น ถึงความสูงกี่เมตร? (sin60°=√3/2≈0.87)', answer: '4.35' } },
            { type: 'multiple_choice', data: { prompt: 'กฎ sine: a/sin A = b/sin B = ?', options: ['c/sin C','c/cos C','c × sin C','sin C/c'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'กฎ cosine: c² = a² + b² - 2ab cos C เมื่อ C=90° สูตรเป็น?', options: ['c=a+b','c²=a²-b²','c²=a²+b²','c²=2ab'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'ถ้า a=3, b=4, C=90° แล้ว c = ?', answer: '5' } },
            { type: 'multiple_choice', data: { prompt: 'พื้นที่สามเหลี่ยม = (1/2)ab sin C ถ้า a=6 b=8 C=30° พื้นที่ = ?', options: ['10','12','14','16'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'เรือแล่น 100 เมตร มุมจากจุดเริ่ม 30° ระยะห่างตั้งฉาก = ? เมตร (sin30°=0.5)', answer: '50' } },
            { type: 'multiple_choice', data: { prompt: 'ความสูงอาคาร หากมุมเงยเป็น 60° จากระยะ 20 เมตร (tan60°=√3≈1.73) สูง?', options: ['30','34.6','40','43.2'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 150,
      title: 'แคลคูลัสเบื้องต้น',
      description: 'ลิมิต อนุพันธ์ และอินทิกรัลพื้นฐาน',
      icon: '∫',
      level: 'ม.ปลาย',
      grammar_note: `ลิมิต (Limit):
• lim(x→a) f(x) = L หมายความว่า f(x) เข้าใกล้ L เมื่อ x เข้าใกล้ a
• lim(x→∞) 1/x = 0  •  lim(x→0) sin(x)/x = 1

อนุพันธ์ (Derivative):
• d/dx (c) = 0  (ค่าคงที่)
• d/dx (xⁿ) = nxⁿ⁻¹  (กฎกำลัง)
• d/dx (sin x) = cos x
• d/dx (cos x) = -sin x
• d/dx (eˣ) = eˣ
• ตัวอย่าง: d/dx (3x² + 2x) = 6x + 2

อินทิกรัล (Integral):
• ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)
• ∫ eˣ dx = eˣ + C
• ∫ₐᵇ f(x) dx = F(b) − F(a) (อินทิกรัลจำกัดเขต)`,
      lessons: [
        {
          order_num: 1, title: 'ลิมิต', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'lim(x→2) (x + 3) = ?', options: ['4','5','6','7'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: 'lim(x→0) (x² + 1) = ?', answer: '1' } },
            { type: 'multiple_choice', data: { prompt: 'lim(x→3) (x² - 9)/(x-3) = ?', options: ['3','6','9','0'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'lim(x→∞) 1/x = ?', options: ['∞','1','-1','0'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: 'lim(x→1) (x² - 1)/(x-1) = __', options: ['0','1','2','3'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'lim(x→0) sin(x)/x = ?', options: ['0','1/2','1','∞'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: 'lim(x→2) (3x - 2) = ?', answer: '4' } },
            { type: 'multiple_choice', data: { prompt: 'ลิมิตต่อเนื่องคือ lim(x→a) f(x) = ?', options: ['0','∞','f(a)','a'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'อนุพันธ์', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: "d/dx (x²) = ?", options: ['x','2x','x²','2x²'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: "d/dx (x³) = ?", answer: '3x²' } },
            { type: 'multiple_choice', data: { prompt: "d/dx (5x) = ?", options: ['5','5x','x','1'], correct_index: 0 } },
            { type: 'fill_blank', data: { prompt: "d/dx (c) = ? (c คือค่าคงที่)", answer: '0' } },
            { type: 'multiple_choice', data: { prompt: "d/dx (x² + 3x + 2) = ?", options: ['2x+2','2x+3','x+3','2x+3x'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: "d/dx (xⁿ) = nx^(n-__)", options: ['0','1','2','3'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: "d/dx (sin x) = ?", options: ['-sin x','cos x','-cos x','tan x'], correct_index: 1 } },
            { type: 'fill_blank', data: { prompt: "d/dx (eˣ) = ?", answer: 'eˣ' } },
          ]
        },
        {
          order_num: 3, title: 'อินทิกรัล', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '∫ 2x dx = ?', options: ['x','x²','2x²','x² + C'], correct_index: 3 } },
            { type: 'fill_blank', data: { prompt: '∫ 3 dx = ?', answer: '3x + C' } },
            { type: 'multiple_choice', data: { prompt: '∫ x² dx = ?', options: ['x³','x³/3','x³/3 + C','3x'], correct_index: 2 } },
            { type: 'fill_blank', data: { prompt: '∫₀¹ x dx = ?', answer: '0.5' } },
            { type: 'multiple_choice', data: { prompt: '∫ (2x + 1) dx = ?', options: ['x² + C','x² + x + C','2x² + C','2 + C'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชันกับอินทิกรัล', pairs: [['∫xⁿdx','xⁿ⁺¹/(n+1)+C'],['∫eˣdx','eˣ+C'],['∫sin x dx','-cos x+C'],['∫cos x dx','sin x+C']] } },
            { type: 'fill_blank', data: { prompt: '∫₀² 2x dx = ?', answer: '4' } },
            { type: 'multiple_choice', data: { prompt: '∫ 1/x dx = ?', options: ['1/x² + C','ln|x| + C','x + C','-1/x² + C'], correct_index: 1 } },
          ]
        },
      ]
    },

  ]
};
