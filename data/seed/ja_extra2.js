'use strict';

// Japanese units 9-10: N2, N1
module.exports = [
  {
    title: 'N2 Grammar & Reading',
    description: 'ไวยากรณ์ซับซ้อน · อ่านข้อความทั่วไป · สอบ JLPT N2',
    icon: '📰',
    order_num: 9,
    level: 'N2',
    grammar_note: 'โครงสร้าง N2 สำคัญ:\n\n• 〜にもかかわらず = ถึงแม้ว่า... ก็ตาม\n  雨にもかかわらず、出かけた。\n\n• 〜をめぐって = เกี่ยวกับ/ประเด็น\n  予算をめぐって議論した。\n\n• 〜に反して = ตรงกันข้ามกับ\n  予想に反して、試験は難しかった。\n\n• 〜に加えて = นอกจาก...แล้วยังมี\n  英語に加えて、日本語も話せる。\n\n• 〜ざるを得ない = ไม่อาจไม่... / จำเป็นต้อง\n  認めざるを得ない。= ต้องยอมรับ',
    cultural_note: 'JLPT N2 เป็นระดับที่บริษัทญี่ปุ่นส่วนใหญ่ต้องการสำหรับพนักงานต่างชาติ — สามารถอ่านข่าว เข้าใจการประชุม และเขียนอีเมลธุรกิจได้ ระดับนี้เปิดประตูสู่การทำงานในญี่ปุ่นได้จริง',
    lessons: [
      {
        title: 'Concessive & Contrast Structures',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"雨にもかかわらず出かけた" หมายความว่า?', options: ['เพราะฝนตกจึงออกไป', 'ถึงแม้ฝนตกก็ยังออกไป', 'ฝนตกแล้วก็กลับมา', 'ไม่ออกไปเพราะฝน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜にもかかわらず" คล้ายกับโครงสร้างไหน?', options: ['〜から', '〜のに / 〜ても', '〜ために', '〜ながら'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"予想に反して" หมายความว่า?', options: ['ตามที่คาดไว้', 'ตรงกันข้ามกับที่คาด', 'เหมือนกับที่คาด', 'ก่อนที่จะคาด'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜ざるを得ない" แสดงความหมายว่า?', options: ['ต้องการ', 'ไม่อยากแต่จำเป็นต้อง', 'สามารถ', 'พยายาม'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ถึงแม้ว่า...ก็ตาม (N2 grammar)', hint: 'にもかかわらず', answer: 'にもかかわらず', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ไม่อาจไม่ทำ / จำเป็นต้อง (N2)', hint: 'ざるを得ない', answer: 'ざるを得ない', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่โครงสร้างกับความหมาย', pairs: [{ left: 'にもかかわらず', right: 'ถึงแม้ว่า' }, { left: 'に反して', right: 'ตรงกันข้ามกับ' }, { left: 'に加えて', right: 'นอกจากนั้นยังมี' }, { left: 'をめぐって', right: 'เกี่ยวกับประเด็น' }] } },
          { type: 'fill_blank', data: { sentence: '彼女は忙しい_____、いつも助けてくれる。(ถึงแม้ว่าจะยุ่ง)', translation: 'ถึงแม้ว่าเธอจะยุ่ง เธอก็ช่วยเสมอ', options: ['から', 'ので', 'にもかかわらず', 'ために'], correct: 2 } },
        ]
      },
      {
        title: 'Formal Expressions & Business',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"ご確認のほどよろしくお願いいたします" ใช้ในบริบทใด?', options: ['สนทนากับเพื่อน', 'อีเมลธุรกิจ', 'พูดกับตัวเอง', 'บทกวี'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜かねます" หมายความว่า?', options: ['สามารถ', 'ไม่อาจทำได้ (สุภาพ)', 'ต้องการ', 'กำลังทำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"お世話になっております" ใช้เพื่ออะไร?', options: ['แสดงความขอบคุณในธุรกิจ', 'ขอโทษ', 'ลาออก', 'สั่งอาหาร'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"〜ていただければ幸いです" มีความหมายว่า?', options: ['ฉันทำให้แล้ว', 'ฉันจะขอบคุณมากถ้าคุณ...', 'ฉันขอโทษ', 'ฉันไม่เข้าใจ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ไม่อาจทำได้ (ปฏิเสธสุภาพ)', hint: 'かねます', answer: 'かねます', alternatives: ['いたしかねます'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ภาษาธุรกิจกับความหมาย', pairs: [{ left: 'お世話になっております', right: 'ขอบคุณที่ดูแลเสมอมา' }, { left: 'ご確認ください', right: 'กรุณาตรวจสอบด้วย' }, { left: 'かねます', right: 'ไม่อาจทำได้ (สุภาพ)' }, { left: '幸いです', right: 'จะเป็นพระคุณ' }] } },
          { type: 'fill_blank', data: { sentence: '申し訳ございませんが、その件はお引き受け_____。', translation: 'ขออภัย เรื่องนั้นไม่อาจรับได้', options: ['できます', 'かねます', 'します', 'いたします'], correct: 1 } },
          { type: 'word_order', data: { instruction: 'เรียงประโยค business email', translation: 'กรุณาตรวจสอบและแจ้งกลับด้วย', words: ['ご確認', 'の', 'ほど', 'よろしく', 'お願い', 'いたします'], answer: 'ご確認 の ほど よろしく お願い いたします' } },
        ]
      },
      {
        title: 'Reading Comprehension',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"〜に際して" หมายความว่า?', options: ['หลังจาก', 'ในโอกาสที่ / เมื่อ', 'เพราะว่า', 'ถ้า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜を契機に" หมายความว่า?', options: ['เพราะ', 'ถึงแม้', 'โดยใช้...เป็นจุดเปลี่ยน', 'หลังจาก'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"〜に基づいて" หมายความว่า?', options: ['โดยอิงตาม / ตามพื้นฐานของ', 'ก่อน', 'นอกจาก', 'ตรงข้ามกับ'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"〜とともに" หมายความว่า?', options: ['ถึงแม้', 'ก่อน', 'พร้อมกับ / ไปพร้อมกับ', 'เพราะ'], correct: 2 } },
          { type: 'translate', data: { prompt: 'โดยอิงตาม (N2)', hint: 'に基づいて', answer: 'に基づいて', alternatives: [] } },
          { type: 'translate', data: { prompt: 'โดยใช้...เป็นจุดเปลี่ยน', hint: 'を契機に', answer: 'を契機に', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่โครงสร้างกับความหมาย', pairs: [{ left: 'に際して', right: 'ในโอกาสที่' }, { left: 'を契機に', right: 'เป็นจุดเปลี่ยน' }, { left: 'に基づいて', right: 'อิงตาม' }, { left: 'とともに', right: 'พร้อมกับ' }] } },
          { type: 'fill_blank', data: { sentence: 'データ_____、この結論を出した。(อิงตามข้อมูล)', translation: 'สรุปผลโดยอิงตามข้อมูล', options: ['をめぐって', 'に基づいて', 'にもかかわらず', 'に反して'], correct: 1 } },
        ]
      }
    ]
  },
  {
    title: 'N1 Advanced Mastery',
    description: 'ไวยากรณ์ขั้นสูง · สำนวนวรรณกรรม · สอบ JLPT N1',
    icon: '🎌',
    order_num: 10,
    level: 'N1',
    grammar_note: 'โครงสร้าง N1 ขั้นสูง:\n\n• 〜いかんにかかわらず = ไม่ว่า...จะเป็นอย่างไร\n  結果いかんにかかわらず、全力を尽くす。\n\n• 〜をもって = ด้วย... / โดยอาศัย\n  本日をもって退職いたします。= ขอลาออก ณ วันนี้\n\n• 〜ならでは = เฉพาะเจาะจง / มีเฉพาะ\n  日本ならではの文化 = วัฒนธรรมที่มีเฉพาะในญี่ปุ่น\n\n• 〜に足る = เพียงพอที่จะ / ควรค่าแก่การ\n  信頼するに足る人物 = บุคคลที่ควรค่าแก่การไว้วางใจ\n\n• 〜もさることながら = แน่นอนว่า...แต่ยิ่งกว่านั้น\n  実力もさることながら、人柄が大切だ。',
    cultural_note: 'JLPT N1 เป็นระดับสูงสุด — ผู้สอบผ่านสามารถอ่านหนังสือพิมพ์ เขียนรายงานวิชาการ และทำงานเป็นล่ามได้ ในญี่ปุ่นมักใช้เป็นหลักฐานประกอบการสมัครงานระดับสูง หรือขอ permanent residency',
    lessons: [
      {
        title: 'Classical & Literary Grammar',
        order_num: 1,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"本日をもって退職いたします" หมายความว่า?', options: ['วันนี้เริ่มงาน', 'ขอลาออก ณ วันนี้', 'ขออนุญาตลา', 'ขอเลื่อนตำแหน่ง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"日本ならではの文化" หมายความว่า?', options: ['วัฒนธรรมจากต่างประเทศในญี่ปุ่น', 'วัฒนธรรมที่มีเฉพาะในญี่ปุ่น', 'วัฒนธรรมญี่ปุ่นที่เสื่อมหาย', 'วัฒนธรรมญี่ปุ่นในอดีต'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜に足る" หมายความว่า?', options: ['ไม่เพียงพอ', 'เพียงพอที่จะ / ควรค่าแก่การ', 'เกินกว่า', 'จำเป็นต้อง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"実力もさることながら、人柄が大切だ" หมายความว่า?', options: ['ความสามารถสำคัญที่สุด', 'บุคลิกสำคัญกว่าความสามารถ', 'ความสามารถแน่นอนว่าสำคัญ แต่บุคลิกก็สำคัญยิ่งกว่า', 'ทั้งคู่ไม่สำคัญ'], correct: 2 } },
          { type: 'translate', data: { prompt: 'มีเฉพาะ / เป็นเอกลักษณ์ของ (N1)', hint: 'ならでは', answer: 'ならでは', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ด้วย... / โดยอาศัย / ณ (N1 formal)', hint: 'をもって', answer: 'をもって', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ N1 grammar กับความหมาย', pairs: [{ left: 'いかんにかかわらず', right: 'ไม่ว่าจะเป็นอย่างไร' }, { left: 'をもって', right: 'ด้วย / ณ' }, { left: 'ならでは', right: 'เฉพาะเจาะจง' }, { left: 'に足る', right: 'ควรค่าแก่การ' }] } },
          { type: 'fill_blank', data: { sentence: '結果_____、最善を尽くすべきだ。(ไม่ว่าผลจะเป็นอย่างไร)', translation: 'ไม่ว่าผลจะเป็นอย่างไร ควรทำเต็มที่', options: ['にもかかわらず', 'いかんにかかわらず', 'に基づいて', 'をもって'], correct: 1 } },
        ]
      },
      {
        title: 'Specialized Vocabulary',
        order_num: 2,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"忖度" (そんたく) หมายความว่า?', options: ['ประชุม', 'คาดเดาความรู้สึกผู้อื่นและทำตาม', 'ขอโทษ', 'เตรียมการ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"建前" (たてまえ) vs "本音" (ほんね) คืออะไร?', options: ['ประตูหน้า vs ประตูหลัง', 'ความคิดเห็นสาธารณะ vs ความรู้สึกจริง', 'ที่ทำงาน vs บ้าน', 'ภาษาเขียน vs พูด'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"一期一会" (いちごいちえ) หมายความว่า?', options: ['ประชุมครั้งเดียว', 'การพบกันครั้งนี้อาจเป็นครั้งเดียวในชีวิต', 'ตลอดชีวิต', 'ทุกวัน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"侘び寂び" (わびさび) เป็นแนวคิดด้านใด?', options: ['อาหาร', 'ความงามในความเรียบง่ายและชั่วคราว', 'ดนตรี', 'การทหาร'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ความคิดเห็นจริงๆ (ตรงข้าม 建前)', hint: 'ほんね', answer: '本音', alternatives: ['ほんね'] } },
          { type: 'translate', data: { prompt: 'การพบกันครั้งเดียวในชีวิต (สำนวน)', hint: 'いちごいちえ', answer: '一期一会', alternatives: ['いちごいちえ'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกับความหมาย', pairs: [{ left: '建前', right: 'ความคิดเห็นสาธารณะ' }, { left: '本音', right: 'ความรู้สึกจริง' }, { left: '忖度', right: 'คาดเดาใจผู้อื่น' }, { left: '侘び寂び', right: 'ความงามในความเรียบง่าย' }] } },
          { type: 'fill_blank', data: { sentence: '日本のビジネス文化では「___」を読む力が重要とされる。(忖度)', translation: 'ในวัฒนธรรมธุรกิจญี่ปุ่น ทักษะการ "อ่านใจ" ถือว่าสำคัญ', options: ['本音', '侘び寂び', '忖度', '一期一会'], correct: 2 } },
        ]
      },
      {
        title: 'Advanced Discourse',
        order_num: 3,
        xp_reward: 40,
        exercises: [
          { type: 'multiple_choice', data: { question: '"〜に先立って" หมายความว่า?', options: ['หลังจาก', 'ก่อนที่จะ', 'เพราะ', 'แม้ว่า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜をよそに" หมายความว่า?', options: ['พร้อมกับ', 'โดยไม่สนใจ / ไม่แยแส', 'เพื่อ', 'ตามที่'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜ともなると" หมายความว่า?', options: ['ถ้า', 'เมื่อถึงระดับ/ขั้น...แล้ว', 'เพราะ', 'แม้ว่า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"〜かたわら" หมายความว่า?', options: ['แทนที่', 'ในขณะเดียวกัน / ควบคู่ไปกับ', 'ก่อน', 'หลัง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ก่อนที่จะ (N1 formal)', hint: 'に先立って', answer: 'に先立って', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ในขณะเดียวกัน (ทำสองอย่างพร้อมกัน)', hint: 'かたわら', answer: 'かたわら', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ N1 grammar', pairs: [{ left: 'に先立って', right: 'ก่อนที่จะ' }, { left: 'をよそに', right: 'โดยไม่แยแส' }, { left: 'ともなると', right: 'เมื่อถึงระดับ' }, { left: 'かたわら', right: 'ควบคู่ไปด้วย' }] } },
          { type: 'fill_blank', data: { sentence: '彼は仕事の___、小説も書いている。(ควบคู่กับงาน)', translation: 'เขาเขียนนิยายควบคู่ไปกับการทำงานด้วย', options: ['に先立って', 'をよそに', 'かたわら', 'ともなると'], correct: 2 } },
        ]
      }
    ]
  }
];
