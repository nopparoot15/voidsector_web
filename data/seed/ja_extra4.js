'use strict';

// Japanese units 15-17: Kanji N5, N3 Advanced Grammar, N2 Writing & Reading
module.exports = [
  {
    title: '基本漢字 N5 (Kanji พื้นฐาน)',
    description: 'ตัวเลขในคันจิ · เวลาและธรรมชาติ · คน & ทิศทาง — JLPT N5 Kanji',
    icon: '漢',
    order_num: 15,
    level: 'N5',
    grammar_note: 'คันจิ N5 ที่ต้องรู้ (80 ตัว):\n\nตัวเลข:\n一(いち)二(に)三(さん)四(し)五(ご)\n六(ろく)七(しち)八(はち)九(く)十(じゅう)\n百(ひゃく)千(せん)万(まん)\n\nเวลาและธรรมชาติ:\n日(にち/ひ)月(つき)火(か)水(すい)木(もく)金(きん)土(ど)\n年(ねん)時(じ)分(ふん)山(やま)川(かわ)\n\nคนและทิศทาง:\n人(ひと)男(おとこ)女(おんな)子(こ)\n上(うえ)下(した)左(ひだり)右(みぎ)中(なか)\n大(おお)小(ちい)口(くち)',
    cultural_note: 'คันจิมาจากอักษรจีน แต่ญี่ปุ่นปรับการออกเสียงใหม่เป็น 2 แบบ: 音読み (おんよみ = on-yomi) ใช้เสียงจีนโบราณ เช่น 日→にち, 月→がつ และ 訓読み (くんよみ = kun-yomi) ใช้เสียงญี่ปุ่นดั้งเดิม เช่น 日→ひ, 月→つき การจำทั้งสองแบบเป็นสิ่งที่ผู้เรียนต้องค่อยๆ สะสม',
    lessons: [
      {
        title: 'ตัวเลขในคันจิ (数字)',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"三" อ่านว่าอะไร?', options: ['いち', 'に', 'さん', 'し'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"百" หมายถึงเลขอะไร?', options: ['10', '100', '1000', '10000'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"七月" (しちがつ) หมายถึง?', options: ['7 วัน', 'เดือน 7 (กรกฎาคม)', '7 ปี', 'วันอาทิตย์'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"二十三" (にじゅうさん) คือเลขอะไร?', options: ['23', '203', '32', '230'], correct: 0 } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "หนึ่ง"', hint: 'いち', answer: '一', alternatives: [] } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "สิบ"', hint: 'じゅう', answer: '十', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คันจิกับการอ่าน', pairs: [{ left: '一', right: 'いち — หนึ่ง' }, { left: '五', right: 'ご — ห้า' }, { left: '百', right: 'ひゃく — ร้อย' }, { left: '千', right: 'せん — พัน' }] } },
          { type: 'fill_blank', data: { sentence: '"___ 月 ___ 日" — วันที่ 15 เดือน 3 (15日3月 → เรียงเป็น 3月15日)', translation: 'สาม / สิบห้า', options: ['三 / 十五', '十五 / 三', '三 / 五', '三十 / 五'], correct: 0 } },
        ]
      },
      {
        title: 'เวลาและธรรมชาติ (日・月・山・川)',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"月曜日" (げつようび) หมายถึง?', options: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'เดือน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"水曜日" ชื่อวันนี้ใช้คันจิที่แปลว่าอะไร?', options: ['ไฟ', 'น้ำ', 'ดิน', 'ลม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"日本語" อ่านว่าอะไร?', options: ['にほん', 'にほんご', 'にっぽんご', 'にほんじん'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"山田さん" — 山 อ่านแบบ kun-yomi ว่า?', options: ['さん', 'やま', 'かわ', 'うみ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "วัน / ดวงอาทิตย์"', hint: 'にち / ひ', answer: '日', alternatives: [] } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "ภูเขา"', hint: 'やま', answer: '山', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คันจิวันในสัปดาห์กับความหมาย', pairs: [{ left: '月 (月曜日)', right: 'moon — วันจันทร์' }, { left: '火 (火曜日)', right: 'fire — วันอังคาร' }, { left: '木 (木曜日)', right: 'tree / wood — วันพฤหัสบดี' }, { left: '土 (土曜日)', right: 'earth / soil — วันเสาร์' }] } },
          { type: 'fill_blank', data: { sentence: '"___ 曜日 は やすみ です" — วันอาทิตย์เป็นวันหยุด', translation: 'にち = อาทิตย์', options: ['月', '火', '日', '土'], correct: 2 } },
        ]
      },
      {
        title: 'คน ทิศทาง และขนาด',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"男の子" (おとこのこ) หมายถึง?', options: ['เด็กผู้หญิง', 'เด็กผู้ชาย', 'ผู้ชายผู้ใหญ่', 'เด็กทั่วไป'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"上" (うえ) หมายถึง?', options: ['ล่าง', 'ข้างๆ', 'บน / ด้านบน', 'ซ้าย'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"右" (みぎ) หมายถึง?', options: ['ซ้าย', 'ขวา', 'หน้า', 'หลัง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"大人" (おとな) หมายถึง?', options: ['เด็ก', 'ผู้ใหญ่', 'คนแก่', 'คนดัง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "คน"', hint: 'ひと', answer: '人', alternatives: [] } },
          { type: 'translate', data: { prompt: 'คันจิสำหรับ "ขวา"', hint: 'みぎ', answer: '右', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คันจิกับความหมาย', pairs: [{ left: '上', right: 'บน / ด้านบน' }, { left: '下', right: 'ล่าง / ด้านล่าง' }, { left: '左', right: 'ซ้าย' }, { left: '中', right: 'กลาง / ใน' }] } },
          { type: 'fill_blank', data: { sentence: '"つくえ の ___ に ほん が あります" — หนังสืออยู่บนโต๊ะ', translation: 'うえ = บน', options: ['下', '中', '上', '左'], correct: 2 } },
        ]
      }
    ]
  },
  {
    title: 'N3 ไวยากรณ์ขั้นสูง',
    description: 'のに・ながら・ため · によって・に対して · ようになる — N3 Grammar Patterns',
    icon: '📖',
    order_num: 16,
    level: 'N3',
    grammar_note: 'รูปแบบไวยากรณ์ N3 สำคัญ:\n\n① ～のに — ทั้งๆ ที่ / แสดงความผิดหวัง\n   • 勉強したのに、試験に落ちた。(ทั้งๆ ที่เรียน ก็ยังสอบตก)\n\n② ～ながら — ขณะเดียวกัน / ทำสองอย่างพร้อมกัน\n   • 音楽を聴きながら、勉強する。(ฟังเพลงไปด้วยขณะเรียน)\n\n③ ～ために — เพื่อ / เพราะ\n   • 日本語を勉強するために、日本に来た。\n\n④ ～によって — ขึ้นอยู่กับ / โดย (passive)\n   • 結果は人によって違う。(ผลลัพธ์ต่างกันแล้วแต่คน)',
    cultural_note: 'ไวยากรณ์ N3 เป็นจุดที่ผู้เรียนหลายคนติดขัดนานที่สุด เพราะโครงสร้างซับซ้อนขึ้นมากและมีคำที่หน้าตาคล้ายกันแต่ความหมายต่างกัน เช่น のに กับ ために ทั้งคู่มี "ni" แต่ความหมายต่างกันโดยสิ้นเชิง การอ่านภาษาญี่ปุ่นจริงๆ เยอะๆ คือวิธีที่ดีที่สุด',
    lessons: [
      {
        title: '～のに / ～ながら / ～ばかり',
        order_num: 1,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"早起きした_に、電車に乗り遅れた" — ใช้อะไรในช่องว่าง?', options: ['のに', 'ながら', 'ため', 'によって'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"音楽を聴き___勉強するのは難しい" — ทำสองอย่างพร้อมกัน', options: ['のに', 'ながら', 'ばかり', 'ため'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"彼はゲームばかりしている" หมายถึง?', options: ['เขาไม่เล่นเกมเลย', 'เขาเล่นเกมบ้างนิดหน่อย', 'เขาแต่เล่นเกมตลอดเวลา', 'เขาเล่นเกมเก่งมาก'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '～のに ใช้แสดงอะไร?', options: ['ความประหลาดใจเชิงบวก', 'ความผิดหวัง / ทั้งๆ ที่', 'สาเหตุ', 'การทำสองอย่างพร้อมกัน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ทั้งๆ ที่ฉันบอกแล้ว (のに)', hint: 'いったのに', answer: 'いったのに', alternatives: ['言ったのに'] } },
          { type: 'translate', data: { prompt: 'ขณะที่เดิน (ながら)', hint: 'あるきながら', answer: 'あるきながら', alternatives: ['歩きながら'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับความหมาย', pairs: [{ left: '～のに', right: 'ทั้งๆ ที่... (ผิดหวัง)' }, { left: '～ながら', right: 'ขณะเดียวกัน / ทำพร้อมกัน' }, { left: '～ばかり', right: 'แต่... เท่านั้น (เสมอ)' }, { left: '～けど', right: 'แต่ว่า / อย่างไรก็ตาม' }] } },
          { type: 'fill_blank', data: { sentence: '"雨が降っている___、彼女は傘を持って行かなかった" — ทั้งๆ ที่ฝนตก', translation: 'のに = ทั้งๆ ที่ (ผิดหวัง)', options: ['のに', 'ながら', 'ために', 'ばかり'], correct: 0 } },
        ]
      },
      {
        title: '～ために / ～によって / ～に対して',
        order_num: 2,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"日本語を話せるようになる___、毎日練習している" — ใช้อะไร?', options: ['のに', 'ために', 'ながら', 'ばかり'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"この作品はモーツァルト___作られた" — ใช้อะไร (passive by)?', options: ['によって', 'に対して', 'ために', 'のに'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"先生の意見___、学生たちは反論した" — ใช้อะไร (against/toward)?', options: ['によって', 'に対して', 'ながら', 'ばかり'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"によって" มีความหมายได้กี่แบบ?', options: ['1 แบบ (by = ถูกกระทำ)', '2 แบบ (by passive + depending on)', '3 แบบ', 'เหมือนกับ によっては เท่านั้น'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เพื่อสุขภาพ (ために)', hint: 'けんこうのために', answer: 'けんこうのために', alternatives: ['健康のために'] } },
          { type: 'translate', data: { prompt: 'ขึ้นอยู่กับสภาพอากาศ (によって)', hint: 'てんきによって', answer: 'てんきによって', alternatives: ['天気によって'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับตัวอย่าง', pairs: [{ left: '～ために (purpose)', right: '日本語を学ぶために (เพื่อเรียน)' }, { left: '～によって (passive)', right: '彼によって書かれた (เขียนโดยเขา)' }, { left: '～によって (depends)', right: '人によって違う (ต่างกันแล้วแต่คน)' }, { left: '～に対して (toward)', right: '意見に対して反論 (โต้แย้งความเห็น)' }] } },
          { type: 'fill_blank', data: { sentence: '"健康___、毎朝ジョギングをしています" — เพื่อสุขภาพ', translation: 'のために = เพื่อ', options: ['のに', 'のために', 'によって', 'に対して'], correct: 1 } },
        ]
      },
      {
        title: '～ようになる / ～ことになる / ～わけ',
        order_num: 3,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"毎日練習して、泳げる___なった" — สามารถว่ายน้ำได้แล้ว (ค่อยๆ เปลี่ยน)', options: ['ように', 'ことに', 'わけに', 'ためになった'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"来月から大阪に転勤する___なった" — มีการตัดสินใจ/กำหนดจากภายนอก', options: ['ようになった', 'ことになった', 'わけになった', 'ためになった'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"そういう___か" — ใช้ わけ ในความหมายอะไร?', options: ['เหตุผล / ที่มา', 'ความเป็นไปได้', 'การอนุญาต', 'คำสั่ง'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"日本に3年住んでいたから、日本語が話せるのは当然の___だ"', options: ['ことに', 'わけ', 'ために', 'のに'], correct: 1 } },
          { type: 'translate', data: { prompt: 'สามารถอ่านภาษาญี่ปุ่นได้แล้ว (ようになった)', hint: 'よめるようになった', answer: 'よめるようになった', alternatives: ['読めるようになった'] } },
          { type: 'translate', data: { prompt: 'กลายเป็นว่าต้องเดินทาง (ことになった)', hint: 'たびするようになった / たびすることになった', answer: 'たびすることになった', alternatives: ['旅することになった'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับความหมาย', pairs: [{ left: '～ようになった', right: 'ค่อยๆ เปลี่ยนมาสามารถ/ทำได้' }, { left: '～ことになった', right: 'มีการตัดสินใจ/กำหนดจากภายนอก' }, { left: '～わけだ', right: 'นั่นก็เป็นเหตุผล / เข้าใจแล้ว' }, { left: '～わけではない', right: 'ไม่ได้หมายความว่า...' }] } },
          { type: 'fill_blank', data: { sentence: '"6ヶ月日本語を勉強したから、少し話せる___だ" — เป็นเรื่องสมเหตุสมผล', translation: 'わけ = เหตุผล / ที่มา', options: ['ように', 'ことに', 'わけ', 'ために'], correct: 2 } },
        ]
      }
    ]
  },
  {
    title: 'N2 การเขียนและอ่าน',
    description: '～に関して · ～をはじめ · อ่านประโยคซับซ้อน — N2 Writing & Reading',
    icon: '✍️',
    order_num: 17,
    level: 'N2',
    grammar_note: 'ไวยากรณ์ N2 — ภาษาทางการและเขียน:\n\n① ～に関して / ～について — เกี่ยวกับ (に関して ทางการกว่า)\n   • 環境問題に関して話し合う。(ถกเรื่องปัญหาสิ่งแวดล้อม)\n\n② ～をはじめ(として) — ตั้งแต่... ไปจนถึง / รวมถึง\n   • 東京をはじめ、大阪や京都も人気だ。\n\n③ ～に加えて — นอกจาก... ยังมี\n   • 技術に加えて、コミュニケーションも重要だ。\n\n④ ～にわたって — ตลอดช่วงเวลา / ทั่วพื้นที่\n   • 3年にわたる研究 (การวิจัยที่ใช้เวลา 3 ปี)',
    cultural_note: 'N2 คือระดับที่บริษัทญี่ปุ่นหลายแห่งต้องการสำหรับพนักงานชาวต่างชาติ โดยเฉพาะงานที่ต้องเขียนรายงานหรือสื่อสารกับ clients ญี่ปุ่น — ความสามารถในการเขียน ～に関して และ ～にわたる ได้ถูกต้องแสดงถึงระดับภาษาที่สูง',
    lessons: [
      {
        title: '～に関して / ～について / ～にわたって',
        order_num: 1,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"この件___ご意見をお聞かせください" — formal มากที่สุดคือ?', options: ['について', 'に関して', 'に対して', 'のことで'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"5年___の研究により、新薬が開発された" — ตลอด 5 ปี', options: ['について', 'によって', 'にわたる', 'に関する'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"に関して" กับ "について" ต่างกันอย่างไร?', options: ['ไม่ต่างกันเลย', 'に関して ทางการและเป็นลายลักษณ์อักษรมากกว่า', 'について ใช้เฉพาะในคำถาม', 'に関して ใช้กับสิ่งของเท่านั้น'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"全国にわたる調査" หมายถึง?', options: ['การสำรวจที่ใช้เวลายาวนาน', 'การสำรวจทั่วประเทศ', 'การสำรวจของรัฐ', 'การสำรวจในท้องถิ่น'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เกี่ยวกับปัญหานี้ (formal)', hint: 'このもんだいにかんして', answer: 'このもんだいにかんして', alternatives: ['この問題に関して'] } },
          { type: 'translate', data: { prompt: 'ตลอด 10 ปี', hint: 'じゅうねんにわたって', answer: 'じゅうねんにわたって', alternatives: ['10年にわたって'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับความหมาย', pairs: [{ left: '～に関して', right: 'เกี่ยวกับ (formal/เขียน)' }, { left: '～について', right: 'เกี่ยวกับ (ทั่วไป)' }, { left: '～にわたって', right: 'ตลอดช่วง / ทั่วพื้นที่' }, { left: '～に関する + N', right: 'เกี่ยวกับ + นาม (คุณศัพท์)' }] } },
          { type: 'fill_blank', data: { sentence: '"地球温暖化___の報告書が発表された" — รายงานเกี่ยวกับภาวะโลกร้อน (formal)', translation: 'に関する = เกี่ยวกับ (ขยายนาม)', options: ['についての', 'に関する', 'によっての', 'にわたる'], correct: 1 } },
        ]
      },
      {
        title: '～をはじめ / ～に加えて / ～に伴って',
        order_num: 2,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"東京___、大阪や福岡でも開催される" — "รวมถึง Tokyo เป็นต้น"', options: ['について', 'をはじめ', 'に加えて', 'にわたり'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"技術___、コミュニケーション能力も重要だ" — "นอกจาก...ยังมี"', options: ['をはじめ', 'に加えて', 'にわたり', 'に関して'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"人口増加___、住宅不足も深刻化している" — ไปพร้อมกับ', options: ['をはじめ', 'に加えて', 'に伴って', 'に関して'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"をはじめとして" ใช้เพื่อ?', options: ['แสดงสาเหตุ', 'ยกตัวอย่างหลักแล้วบอกว่ามีอื่นด้วย', 'แสดงความขัดแย้ง', 'บอกเวลา'], correct: 1 } },
          { type: 'translate', data: { prompt: 'รวมถึงโตเกียวเป็นต้น (をはじめ)', hint: 'とうきょうをはじめ', answer: 'とうきょうをはじめ', alternatives: ['東京をはじめ'] } },
          { type: 'translate', data: { prompt: 'นอกจากนั้น / เพิ่มเติม (に加えて)', hint: 'にくわえて', answer: 'にくわえて', alternatives: ['に加えて'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่รูปแบบกับความหมาย', pairs: [{ left: '～をはじめ', right: 'รวมถึง X เป็นต้น (ยกตัวอย่างแรก)' }, { left: '～に加えて', right: 'นอกจาก X ยังมี Y' }, { left: '～に伴って', right: 'ไปพร้อมกับ / ตามที่ X เพิ่ม' }, { left: '～にもかかわらず', right: 'ทั้งๆ ที่ (N2 formal)' }] } },
          { type: 'fill_blank', data: { sentence: '"少子化___、労働力不足が深刻な問題になっている" — ไปพร้อมกับปัญหาอัตราการเกิดต่ำ', translation: 'に伴って = ไปพร้อมกับ', options: ['をはじめ', 'に加えて', 'に伴って', 'に関して'], correct: 2 } },
        ]
      },
      {
        title: 'อ่านประโยค N2 (読解)',
        order_num: 3,
        xp_reward: 40,
        exercises: [
          { type: 'multiple_choice', data: { question: '読: "近年、リモートワークの普及に伴い、都市部から地方への移住者が増加している。" — ประเด็นหลักคือ?', options: ['คนเมืองย้ายไปต่างจังหวัดเพิ่มขึ้นเพราะ remote work', 'remote work ลดลง', 'คนชนบทย้ายเข้าเมือง', 'ประชากรเมืองเพิ่มขึ้น'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"普及に伴い" หมายถึง?', options: ['เนื่องจากการแพร่หลาย', 'แม้ว่าจะแพร่หลาย', 'ตามที่แพร่หลายมากขึ้น', 'ก่อนที่จะแพร่หลาย'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"増加している" อยู่ในรูปแบบไหน?', options: ['Past tense', 'Present Progressive (te-form + いる)', 'Future', 'Passive'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '読: "この問題に関して、さまざまな立場からの意見を踏まえた上で、慎重に検討する必要がある。" — ความหมายคือ?', options: ['ต้องตัดสินใจเร็วๆ', 'ต้องพิจารณาอย่างรอบคอบโดยฟังหลายมุมมอง', 'ปัญหานี้แก้ไม่ได้', 'ควรเพิกเฉยต่อปัญหา'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ปัญหาสิ่งแวดล้อม', hint: 'かんきょうもんだい', answer: 'かんきょうもんだい', alternatives: ['環境問題'] } },
          { type: 'translate', data: { prompt: 'การพิจารณาอย่างรอบคอบ', hint: 'しんちょうにけんとう', answer: 'しんちょうにけんとう', alternatives: ['慎重に検討'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำ N2 กับความหมาย', pairs: [{ left: '普及', right: 'การแพร่หลาย' }, { left: '移住', right: 'การย้ายถิ่นฐาน' }, { left: '検討', right: 'การพิจารณา / ทบทวน' }, { left: '慎重', right: 'รอบคอบ / ระมัดระวัง' }] } },
          { type: 'fill_blank', data: { sentence: '"___の立場から考えると、この政策には問題がある" — จากมุมมองต่างๆ', translation: 'さまざまな = หลากหลาย', options: ['ひとつ', 'さまざまな', 'すべての', 'ある'], correct: 1 } },
        ]
      }
    ]
  }
];
