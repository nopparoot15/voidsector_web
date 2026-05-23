'use strict';

// Chinese units 13-15: Transport HSK3, Hobbies HSK3, HSK4 Grammar
module.exports = [
  {
    title: '交通和方向 (การเดินทางและทิศทาง)',
    description: 'การเดินทาง · การบอกทิศทาง · ขอความช่วยเหลือ — Transport & Directions HSK3',
    icon: '🚌',
    order_num: 100,
    level: 'HSK3',
    grammar_note: 'การแสดงทิศทางและการเดินทาง HSK3:\n\n① 怎么去...? — ไปที่... ได้อย่างไร?\n   • 怎么去火车站？(ไปสถานีรถไฟยังไง?)\n\n② 坐 + ยานพาหนะ = นั่ง...\n   • 坐公共汽车 (นั่งรถบัส)\n   • 坐地铁 (นั่งรถไฟใต้ดิน)\n   • 坐飞机 (นั่งเครื่องบิน)\n\n③ ทิศทาง: 左转 (เลี้ยวซ้าย) 右转 (เลี้ยวขวา) 直走 (เดินตรงไป)\n\n④ 大概 / 大约 — ประมาณ\n   • 大概走十分钟。(เดินประมาณ 10 นาที)',
    cultural_note: 'ระบบขนส่งสาธารณะในจีน โดยเฉพาะรถไฟความเร็วสูง (高铁 gāo tiě) เชื่อมโยงเมืองใหญ่ทั่วประเทศ — ซื้อตั๋วผ่าน app 12306 และสแกน ID card เข้าขึ้นรถได้เลย 高铁 เร็วสูงสุดถึง 350 กม./ชม. ปัจจุบันจีนมีเครือข่ายรถไฟความเร็วสูงยาวที่สุดในโลก',
    lessons: [
      {
        title: 'ยานพาหนะและการเดินทาง',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"坐地铁去" หมายถึง?', options: ['ไปด้วยรถบัส', 'ไปด้วยรถไฟใต้ดิน', 'ไปด้วยแท็กซี่', 'ไปด้วยเท้า'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"你怎么去公司?" หมายถึง?', options: ['บริษัทคุณอยู่ที่ไหน?', 'คุณทำงานที่บริษัทไหน?', 'คุณไปบริษัทยังไง?', 'คุณเดินทางนานแค่ไหน?'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"打车" (dǎ chē) หมายถึง?', options: ['ขับรถ', 'เรียกแท็กซี่', 'ซ่อมรถ', 'ล้างรถ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"从这里到火车站大概多远?" — ถามอะไร?', options: ['ถามเวลา', 'ถามระยะทาง', 'ถามค่าโดยสาร', 'ถามทิศทาง'], correct: 1 } },
          { type: 'translate', data: { prompt: 'รถไฟใต้ดิน', hint: 'dì tiě', answer: '地铁', alternatives: [] } },
          { type: 'translate', data: { prompt: 'สนามบิน', hint: 'jī chǎng', answer: '机场', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ยานพาหนะกับความหมาย', pairs: [{ left: '公共汽车', right: 'รถบัสสาธารณะ' }, { left: '地铁', right: 'รถไฟใต้ดิน' }, { left: '出租车', right: 'แท็กซี่' }, { left: '高铁', right: 'รถไฟความเร็วสูง' }] } },
          { type: 'fill_blank', data: { sentence: '"我每天___地铁去上班，大概半个小时。"', translation: 'นั่งรถไฟใต้ดินไปทำงาน', options: ['开', '坐', '走', '骑'], correct: 1 } },
        ]
      },
      {
        title: 'การบอกทิศทาง',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"一直走" หมายถึง?', options: ['เลี้ยวซ้าย', 'เลี้ยวขวา', 'เดินตรงไป', 'หยุดที่นี่'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"在路口左转" หมายถึง?', options: ['เดินตรงไปที่แยก', 'เลี้ยวซ้ายที่สี่แยก', 'เลี้ยวขวาที่สี่แยก', 'ข้ามถนนที่สี่แยก'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"银行就在超市旁边。" แปลว่า?', options: ['ธนาคารอยู่ตรงข้ามซูเปอร์มาร์เก็ต', 'ธนาคารอยู่ข้างๆ ซูเปอร์มาร์เก็ต', 'ธนาคารอยู่ใกล้ซูเปอร์มาร์เก็ตมาก', 'ธนาคารอยู่ในซูเปอร์มาร์เก็ต'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"离这里不远" หมายถึง?', options: ['ไกลจากที่นี่', 'ไม่ไกลจากที่นี่', 'ห่างไกลมาก', 'อยู่ที่นี่เลย'], correct: 1 } },
          { type: 'translate', data: { prompt: 'เลี้ยวขวา', hint: 'yòu zhuǎn', answer: '右转', alternatives: [] } },
          { type: 'translate', data: { prompt: 'สี่แยก', hint: 'shí zì lù kǒu', answer: '十字路口', alternatives: ['路口'] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำทิศทางกับความหมาย', pairs: [{ left: '左转', right: 'เลี้ยวซ้าย' }, { left: '右转', right: 'เลี้ยวขวา' }, { left: '一直走', right: 'เดินตรงไป' }, { left: '对面', right: 'ตรงข้าม' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคบอกทาง', translation: 'เดินตรงไปแล้วเลี้ยวซ้ายที่สี่แยก', words: ['一直走', '然后', '在', '路口', '左转'], answer: '一直走 然后 在 路口 左转' } },
        ]
      },
      {
        title: 'การขอความช่วยเหลือและซื้อตั๋ว',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"请问，去故宫怎么走?" — ถามอะไร?', options: ['ถามราคา', 'ถามวันเปิด', 'ถามทิศทาง', 'ถามระยะเวลา'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"一张去北京的票多少钱?" แปลว่า?', options: ['ตั๋วไปปักกิ่งใบหนึ่งราคาเท่าไหร่?', 'ตั๋วจากปักกิ่งราคาเท่าไหร่?', 'มีตั๋วไปปักกิ่งไหม?', 'ตั๋วปักกิ่งขายที่ไหน?'], correct: 0 } },
          { type: 'multiple_choice', data: { question: '"请问附近有地铁站吗?" หมายถึง?', options: ['สถานีรถไฟใต้ดินอยู่ที่ไหน?', 'แถวนี้มีสถานีรถไฟใต้ดินไหม?', 'ไปสถานีรถไฟยังไง?', 'รถไฟใต้ดินแถวนี้ดีไหม?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"在哪里换乘?" — ถามอะไร?', options: ['ถามราคา', 'ถามเวลาออกเดินทาง', 'ถามจุดเปลี่ยนสาย', 'ถามปลายทาง'], correct: 2 } },
          { type: 'translate', data: { prompt: 'ตั๋วหนึ่งใบ', hint: 'yī zhāng piào', answer: '一张票', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เปลี่ยนสาย / ต่อรถ', hint: 'huàn chéng', answer: '换乘', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับความหมาย', pairs: [{ left: '请问，附近有...吗?', right: 'ขอถาม แถวนี้มี... ไหม?' }, { left: '怎么走?', right: 'ไปยังไง / เดินทางยังไง?' }, { left: '在哪里换乘?', right: 'เปลี่ยนสายที่ไหน?' }, { left: '需要多长时间?', right: 'ใช้เวลานานแค่ไหน?' }] } },
          { type: 'fill_blank', data: { sentence: '"请问，去天安门广场___坐几路公共汽车?"', translation: 'ต้องนั่งรถสายอะไร', options: ['应该', '可能', '一定', '不用'], correct: 0 } },
        ]
      }
    ]
  },
  {
    title: '爱好和娱乐 (งานอดิเรกและบันเทิง)',
    description: 'กีฬา · บันเทิง · การแสดงความชอบ — Hobbies & Entertainment HSK3',
    icon: '⚽',
    order_num: 110,
    level: 'HSK3',
    grammar_note: 'การแสดงความชอบ HSK3:\n\n① 喜欢 + V/N — ชอบ...\n   • 我喜欢踢足球。(ฉันชอบเตะฟุตบอล)\n\n② 更喜欢 — ชอบ...มากกว่า\n   • 我更喜欢游泳。(ฉันชอบว่ายน้ำมากกว่า)\n\n③ 一起 + V — ทำด้วยกัน\n   • 一起去打篮球吧！(ไปตีบาสด้วยกันนะ!)\n\n④ 经常 / 有时候 / 很少 — บ่อยๆ / บางครั้ง / ไม่ค่อย\n   • 我经常去健身房。(ฉันไปยิมบ่อยๆ)',
    cultural_note: 'กีฬายอดนิยมในจีน: 乒乓球 (ปิงปอง) เป็น "กีฬาประจำชาติ" ของจีน, 篮球 (บาสเกตบอล) ได้รับความนิยมสูงมากในหมู่คนรุ่นใหม่ และ 太极拳 (ไทชิ) ที่เห็นผู้สูงอายุเล่นในสวนสาธารณะตอนเช้าทุกวัน — ซึ่งเป็นภาพที่ทั่วไปมากในเมืองจีน',
    lessons: [
      {
        title: 'กีฬาและกิจกรรม',
        order_num: 1,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"踢足球" หมายถึง?', options: ['ตีเทนนิส', 'เตะฟุตบอล', 'ตีบาสเกตบอล', 'ว่ายน้ำ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"打篮球" หมายถึง?', options: ['เตะฟุตบอล', 'ว่ายน้ำ', 'เล่นบาสเกตบอล', 'เล่นเทนนิส'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"我经常去健身房锻炼身体。" แปลว่า?', options: ['ฉันไม่ค่อยออกกำลังกาย', 'ฉันไปยิมออกกำลังกายบ่อยๆ', 'ฉันเพิ่งเริ่มออกกำลังกาย', 'ฉันออกกำลังกายที่บ้าน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"锻炼身体" หมายถึง?', options: ['ลดน้ำหนัก', 'ออกกำลังกาย', 'พักผ่อน', 'กินอาหารเพื่อสุขภาพ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ว่ายน้ำ', hint: 'yóu yǒng', answer: '游泳', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ยิม / ฟิตเนส', hint: 'jiàn shēn fáng', answer: '健身房', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่คำกีฬากับความหมาย', pairs: [{ left: '踢足球', right: 'เตะฟุตบอล' }, { left: '打篮球', right: 'เล่นบาสเกตบอล' }, { left: '游泳', right: 'ว่ายน้ำ' }, { left: '打乒乓球', right: 'เล่นปิงปอง' }] } },
          { type: 'fill_blank', data: { sentence: '"我___打网球，每周两次。"', translation: 'ชอบเล่นเทนนิส', options: ['想', '喜欢', '能', '要'], correct: 1 } },
        ]
      },
      {
        title: 'ดนตรีและบันเทิง',
        order_num: 2,
        xp_reward: 25,
        exercises: [
          { type: 'multiple_choice', data: { question: '"看电影" หมายถึง?', options: ['ฟังเพลง', 'ดูหนัง', 'ดูทีวี', 'อ่านหนังสือ'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"他喜欢听古典音乐。" แปลว่า?', options: ['เขาชอบดูหนัง', 'เขาชอบฟังดนตรีป็อป', 'เขาชอบฟังดนตรีคลาสสิก', 'เขาชอบเล่นดนตรี'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"你周末一般做什么?" — ถามอะไร?', options: ['ถามงานอาชีพ', 'ถามกิจกรรมช่วงสุดสัปดาห์', 'ถามแผนการเดินทาง', 'ถามเรื่องครอบครัว'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"我很少看电视，更喜欢看书。" — 更喜欢 หมายถึง?', options: ['ก็ชอบ', 'ชอบมากกว่า', 'ไม่ค่อยชอบ', 'เพิ่งเริ่มชอบ'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ดูหนัง', hint: 'kàn diàn yǐng', answer: '看电影', alternatives: [] } },
          { type: 'translate', data: { prompt: 'เล่นกีตาร์', hint: 'tán jí tā', answer: '弹吉他', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่กิจกรรมกับความหมาย', pairs: [{ left: '看电影', right: 'ดูหนัง' }, { left: '听音乐', right: 'ฟังเพลง' }, { left: '画画', right: 'วาดรูป' }, { left: '弹钢琴', right: 'เล่นเปียโน' }] } },
          { type: 'fill_blank', data: { sentence: '"他___听音乐，___看电视。"', translation: 'ชอบฟังเพลงมากกว่าดูทีวี', options: ['更喜欢 / 不太喜欢', '喜欢 / 也喜欢', '不喜欢 / 喜欢', '很少 / 经常'], correct: 0 } },
        ]
      },
      {
        title: 'แสดงความชอบและการชวนออกไป',
        order_num: 3,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"这个周末，我们一起去爬山，怎么样?" — ชวนทำอะไร?', options: ['ไปดูหนัง', 'ไปปีนเขา', 'ไปว่ายน้ำ', 'ไปช้อปปิ้ง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"好主意！" หมายถึง?', options: ['ไม่เป็นไร', 'ไอเดียดีมาก!', 'ไม่ได้ครับ', 'ลองดูก็ได้'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"你对什么感兴趣?" หมายถึง?', options: ['คุณทำอาชีพอะไร?', 'คุณสนใจอะไร?', 'คุณชอบกินอะไร?', 'คุณอยู่ที่ไหน?'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"我对中国历史很感兴趣。" แปลว่า?', options: ['ฉันรู้เรื่องประวัติศาสตร์จีนมาก', 'ฉันสนใจประวัติศาสตร์จีนมาก', 'ฉันกำลังเรียนประวัติศาสตร์จีน', 'ฉันอยากไปจีน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ปีนเขา / เดินป่า', hint: 'pá shān', answer: '爬山', alternatives: [] } },
          { type: 'translate', data: { prompt: 'สนใจ... (对...感兴趣)', hint: 'duì...gǎn xìng qù', answer: '对...感兴趣', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับความหมาย', pairs: [{ left: '一起去...吧！', right: 'ไป...ด้วยกันนะ! (ชวน)' }, { left: '好主意！', right: 'ไอเดียดีมาก!' }, { left: '对...感兴趣', right: 'สนใจ...' }, { left: '更喜欢', right: 'ชอบ...มากกว่า' }] } },
          { type: 'word_order', data: { instruction: 'เรียงประโยคชวนเพื่อน', translation: 'วันอาทิตย์ไปดูหนังด้วยกันไหม?', words: ['星期天', '我们', '一起', '去', '看电影', '怎么样', '？'], answer: '星期天 我们 一起 去 看电影 怎么样 ？' } },
        ]
      }
    ]
  },
  {
    title: 'HSK4 ไวยากรณ์ขั้นสูง',
    description: 'กริยาสำเร็จผล · 把/被 เชิงลึก · ประโยคซับซ้อน — HSK4 Grammar',
    icon: '🎓',
    order_num: 130,
    level: 'HSK4',
    grammar_note: 'ไวยากรณ์ HSK4 สำคัญ:\n\n① Resultative Complement (结果补语)\n   • 写完 = เขียนเสร็จ (V + 完)\n   • 做好 = ทำดี / เสร็จดี (V + 好)\n   • 听懂 = ฟังแล้วเข้าใจ (V + 懂)\n   • 买到 = ซื้อได้ (V + 到)\n\n② 把 sentence — กระทำต่อสิ่งใดสิ่งหนึ่ง:\n   • 我把作业做完了。(ฉันทำการบ้านเสร็จแล้ว)\n\n③ 被 passive — ถูกกระทำ:\n   • 书被他借走了。(หนังสือถูกเขายืมไป)',
    cultural_note: 'HSK4 ตรงกับระดับ B2 ของ CEFR และเทียบเท่าภาษาจีนที่ใช้ในชีวิตประจำวันได้อย่างคล่องแคล่ว HSK4 ต้องรู้คำศัพท์ประมาณ 1200 คำ — ผู้ที่ผ่าน HSK4 มักสามารถทำงานในสภาพแวดล้อมที่ใช้ภาษาจีนได้',
    lessons: [
      {
        title: 'กริยาสำเร็จผล (结果补语)',
        order_num: 1,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"我把作业写完了" หมายถึง?', options: ['ฉันกำลังเขียนการบ้าน', 'ฉันเขียนการบ้านเสร็จแล้ว', 'ฉันยังไม่ได้เขียนการบ้าน', 'ฉันต้องเขียนการบ้าน'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"听懂了吗?" — 懂 ที่ตามหลัง 听 หมายถึง?', options: ['ฟังเสร็จแล้ว', 'ฟังแล้วเข้าใจ', 'ฟังได้ยิน', 'ฟังถูกต้อง'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"买到票了！" หมายถึง?', options: ['ยังไม่ได้ซื้อตั๋ว', 'ซื้อตั๋วไม่ได้', 'ซื้อตั๋วได้แล้ว!', 'ตั๋วหมดแล้ว'], correct: 2 } },
          { type: 'multiple_choice', data: { question: '"他说得很清楚，你听懂了吗?" — 结果补语 ในประโยคนี้คือ?', options: ['说', '很', '清楚', '懂'], correct: 3 } },
          { type: 'translate', data: { prompt: 'เขียนเสร็จ', hint: 'xiě wán', answer: '写完', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ฟังแล้วเข้าใจ', hint: 'tīng dǒng', answer: '听懂', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่กริยาสำเร็จผลกับความหมาย', pairs: [{ left: '写完', right: 'เขียนเสร็จ' }, { left: '做好', right: 'ทำดี / ทำเสร็จดี' }, { left: '听懂', right: 'ฟังแล้วเข้าใจ' }, { left: '买到', right: 'ซื้อได้สำเร็จ' }] } },
          { type: 'fill_blank', data: { sentence: '"我已经把报告___了，可以提交了。"', translation: 'เขียนรายงานเสร็จแล้ว', options: ['写完', '写好', '看完', '做完'], correct: 0 } },
        ]
      },
      {
        title: '把 และ 被 เชิงลึก',
        order_num: 2,
        xp_reward: 30,
        exercises: [
          { type: 'multiple_choice', data: { question: '"我把书放在桌子上了。" โครงสร้างประโยคนี้คือ?', options: ['ประโยคถาม', '把 sentence (กระทำต่อสิ่งของ)', '被 passive', 'ประโยคทั่วไป'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"钱包被小偷偷走了。" หมายถึง?', options: ['ฉันขโมยกระเป๋าเงิน', 'กระเป๋าเงินถูกขโมยไป', 'ฉันหากระเป๋าเงินได้', 'กระเป๋าเงินหาย'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"把" ในประโยค 把 structure ทำหน้าที่อะไร?', options: ['บ่งบอกการกระทำที่สำเร็จ', 'นำ object มาอยู่ก่อนกริยา', 'แสดง passive', 'แสดงเวลา'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"他把那本书看完了。" — ใครทำอะไรกับอะไร?', options: ['หนังสืออ่านเขา', 'เขาอ่านหนังสือเล่มนั้นจนจบ', 'หนังสือถูกซื้อโดยเขา', 'เขาให้หนังสือไป'], correct: 1 } },
          { type: 'translate', data: { prompt: 'ฉันทิ้งขยะแล้ว (把...扔掉)', hint: 'wǒ bǎ lā jī rēng diào le', answer: '我把垃圾扔掉了', alternatives: [] } },
          { type: 'translate', data: { prompt: 'รถถูกซ่อมแล้ว (被)', hint: 'chē bèi xiū hǎo le', answer: '车被修好了', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ประโยคกับโครงสร้าง', pairs: [{ left: '我把作业做完了', right: '把 sentence — กระทำต่อสิ่งของ' }, { left: '作业被我做完了', right: '被 passive — สิ่งของถูกกระทำ' }, { left: '我做完了作业', right: 'ประโยคทั่วไป (SVO)' }, { left: '作业做完了', right: 'ประโยคไม่ระบุผู้กระทำ' }] } },
          { type: 'fill_blank', data: { sentence: '"请___窗户关上，外面太冷了。"', translation: 'ปิดหน้าต่าง (把 structure)', options: ['被', '把', '让', '叫'], correct: 1 } },
        ]
      },
      {
        title: 'ประโยคซับซ้อน HSK4',
        order_num: 3,
        xp_reward: 35,
        exercises: [
          { type: 'multiple_choice', data: { question: '"只要努力，就能成功。" หมายถึง?', options: ['ต้องพยายามมาก', 'ตราบใดที่พยายาม ก็สำเร็จได้', 'พยายามแล้วไม่สำเร็จ', 'ต้องสำเร็จก่อนจึงพยายาม'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"虽然很贵，但是质量很好。" — 虽然...但是 หมายถึง?', options: ['เพราะ... ดังนั้น...', 'แม้ว่า... แต่...', 'ถ้า... ก็...', 'ทั้ง... และ...'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"既然你来了，就多待一会儿吧。" — 既然 หมายถึง?', options: ['ก่อนที่จะ...', 'ในเมื่อ... / เมื่อ...', 'แม้ว่า...', 'ถ้า...'], correct: 1 } },
          { type: 'multiple_choice', data: { question: '"除了英语，他还会说法语和西班牙语。" แปลว่า?', options: ['เขาพูดได้แค่ภาษาอังกฤษ', 'นอกจากภาษาอังกฤษ เขายังพูดฝรั่งเศสและสเปนได้', 'เขาไม่พูดภาษาอังกฤษ', 'เขาพูดได้เฉพาะฝรั่งเศสและสเปน'], correct: 1 } },
          { type: 'translate', data: { prompt: 'แม้ว่า... แต่... (虽然...但是)', hint: 'suī rán...dàn shì', answer: '虽然...但是', alternatives: [] } },
          { type: 'translate', data: { prompt: 'ตราบใดที่... ก็... (只要...就)', hint: 'zhǐ yào...jiù', answer: '只要...就', alternatives: [] } },
          { type: 'match_pairs', data: { instruction: 'จับคู่ตัวเชื่อมกับความหมาย', pairs: [{ left: '虽然...但是', right: 'แม้ว่า... แต่...' }, { left: '只要...就', right: 'ตราบใดที่... ก็...' }, { left: '既然...就', right: 'ในเมื่อ... ก็...' }, { left: '除了...还', right: 'นอกจาก... ยังมี...' }] } },
          { type: 'fill_blank', data: { sentence: '"___你不喜欢，就不要勉强自己了。"', translation: 'ในเมื่อคุณไม่ชอบ ก็ไม่ต้องฝืน', options: ['虽然', '只要', '既然', '除了'], correct: 2 } },
        ]
      }
    ]
  }
];
