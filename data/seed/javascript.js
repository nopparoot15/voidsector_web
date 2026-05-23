'use strict';

module.exports = {
  code: 'js',
  name: 'JavaScript',
  native_name: 'JavaScript',
  flag: '🌐',
  vocab: [],
  units: [

    // ══════════════════════════ BEGINNER ══════════════════════════════

    {
      order_num: 10,
      title: 'Variables & Data Types',
      description: 'ตัวแปรและชนิดข้อมูลพื้นฐานใน JavaScript',
      icon: '📦',
      level: 'Beginner',
      grammar_note: `ตัวแปร (Variables):
• let — ตัวแปรเปลี่ยนค่าได้ ขอบเขต block
• const — ค่าคงที่ เปลี่ยนค่าไม่ได้ (แต่ object/array เพิ่ม property ได้)
• var — รูปแบบเก่า หลีกเลี่ยงใน modern JS (function scope, hoisting)

ชนิดข้อมูลพื้นฐาน:
• string: "hello" หรือ 'hello' หรือ \`template\`
• number: 42, 3.14, NaN, Infinity
• boolean: true / false
• null — ค่าว่างที่ตั้งใจกำหนด
• undefined — ยังไม่มีค่า
• object: { key: value }
• array: [1, 2, 3]

typeof x คืนชนิดเป็น string เช่น "number", "string", "boolean"`,
      lessons: [
        {
          order_num: 1, title: 'let, const และ var', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'คำสำคัญไหนประกาศค่าคงที่?', options: ['var','let','const','def'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ name = "Alice";  // เปลี่ยนค่าได้', options: ['let','const','var','set'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'typeof 42 ได้ผลอะไร?', options: ['"int"','"number"','"float"','42'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ค่ากับชนิดข้อมูล', pairs: [['"hello"','string'],['true','boolean'],['null','null'],['{}','object']] } },
            { type: 'multiple_choice', data: { prompt: 'ข้อใดถูกต้องเกี่ยวกับ const?', options: ['เปลี่ยนค่าได้เสมอ','เปลี่ยนค่า primitive ไม่ได้ แต่ push object ได้','ทำงานเหมือน var','ห้ามใช้กับ object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'console.__(42);  // แสดงผล', options: ['log','print','write','out'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ตัวแปรที่ประกาศ let แต่ยังไม่กำหนดค่า มีค่าอะไร?', options: ['null','0','""','undefined'], correct_index: 3 } },
            { type: 'multiple_choice', data: { prompt: 'var ต่างจาก let ตรงไหน?', options: ['var เร็วกว่า','var มี function scope / hoisting, let มี block scope','var ใช้ const ไม่ได้','var ใช้ใน module เท่านั้น'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'String, Number, Boolean', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '"Hello" + " " + "World" ได้ผลอะไร?', options: ['"Hello World"','Error','undefined','NaN'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'const msg = `Hello, ${__}!`;\n// template literal', options: ['name','$name','{name}','(name)'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Number("42") ได้ผลอะไร?', options: ['"42"','42',0,NaN], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'NaN === NaN ได้ผลอะไร?', options: ['true','false','NaN','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '"hello".__(0, 3)  // ได้ "hel"', options: ['slice','cut','substr','trim'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับผลลัพธ์', pairs: [['"hi".toUpperCase()','HI'],['"  hi  ".trim()','hi'],['String(99)','"99"'],['parseInt("3.7")',3]] } },
            { type: 'multiple_choice', data: { prompt: '"5" + 3 ได้อะไร?', options: ['8','"53"','Error','undefined'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Boolean(0) ได้อะไร?', options: ['true','false','0','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Arrays & Objects', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '[1,2,3].length ได้เท่าไร?', options: ['2','3','4','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const arr = [1,2,3];\narr.__(4);  // เพิ่มท้าย', options: ['push','add','append','insert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'const person = {name:"Ali",age:20}; person.name ได้อะไร?', options: ['"Ali"','Ali','20','undefined'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3].includes(2) ได้อะไร?', options: ['false','true','2','1'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const [a, b] = [10, 20];\n// __ destructuring', options: ['array','object','spread','rest'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['arr.pop()','ลบท้าย'],['arr.shift()','ลบหน้า'],['arr.splice(i,n)','ลบที่ตำแหน่ง'],['arr.reverse()','กลับลำดับ']] } },
            { type: 'multiple_choice', data: { prompt: 'Object.keys({a:1,b:2}) ได้อะไร?', options: ['[1,2]','["a","b"]','{a,b}','undefined'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '[...arr1, ...arr2] ทำอะไร?', options: ['คูณ array','รวม 2 array ด้วย spread','กรอง array','เรียง array'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 20,
      title: 'Control Flow',
      description: 'เงื่อนไข ลูป และการควบคุมการทำงาน',
      icon: '🔀',
      level: 'Beginner',
      grammar_note: `Conditionals:
• if (condition) { } else if { } else { }
• ternary: condition ? valueIfTrue : valueIfFalse
• switch (val) { case x: break; default: }
• Nullish coalescing: val ?? "default" (ใช้ default เมื่อ null/undefined)
• Optional chaining: obj?.prop?.nested (ไม่ throw ถ้า null)

Loops:
• for (let i=0; i<n; i++) { }
• while (condition) { }
• do { } while (condition)
• for...of — iterate array/iterable
• for...in — iterate object keys
• break/continue ทำงานเหมือน Python`,
      lessons: [
        {
          order_num: 1, title: 'If / Else และ Ternary', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x > 5 ? "big" : "small"  ถ้า x=3 ได้อะไร?', options: ['"big"','"small"','true','false'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if (x === 0) {\n  console.log("zero");\n} __ {\n  console.log("not zero");\n}', options: ['else','elif','otherwise','or'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '=== ต่างจาก == อย่างไร?', options: ['ไม่ต่างกัน','=== เช็คทั้งค่าและชนิด','== เร็วกว่า','=== ใช้กับ string เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'null ?? "default" ได้อะไร?', options: ['null','"default"','false','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const name = user?.__;\n// ไม่ throw ถ้า user เป็น null', options: ['name','getName()','(name)','{name}'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'switch statement ต้องใช้คำสำคัญอะไรเพื่อออกจาก case?', options: ['exit','stop','break','return'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ operator กับความหมาย', pairs: [['&&','AND'],['||','OR'],['!','NOT'],['??','Nullish coalescing']] } },
            { type: 'multiple_choice', data: { prompt: 'falsy values ใน JS มีอะไรบ้าง?', options: ['null, undefined, 0, "", false, NaN','null และ undefined เท่านั้น','false เท่านั้น','0 และ false เท่านั้น'], correct_index: 0 } },
          ]
        },
        {
          order_num: 2, title: 'Loops', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'for (let i=0; i<3; i++) วนกี่รอบ?', options: ['2','3','4','0'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for (__ item of [1,2,3]) {\n  console.log(item);\n}', options: ['let','const','var','the'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'for...in วนซ้ำอะไรของ object?', options: ['values','keys','entries','length'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'break ใน loop ทำอะไร?', options: ['ข้ามรอบนั้น','ออกจาก loop','หยุดโปรแกรม','ข้ามไปรอบถัดไป'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'let i = 0;\n__(i < 5) {\n  i++;\n}', options: ['while','loop','for','repeat'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'continue ใน loop ทำอะไร?', options: ['ออกจาก loop','ข้ามรอบนี้ไปรอบถัดไป','หยุดโปรแกรม','วนซ้ำไม่สิ้นสุด'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ loop กับการใช้งาน', pairs: [['for...of','iterate array'],['for...in','iterate object keys'],['while','เงื่อนไขไม่รู้จำนวนรอบ'],['do...while','รันก่อนแล้วค่อยเช็ค']] } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3].forEach(x => console.log(x)) ทำอะไร?', options: ['กรอง array','แสดงทุกค่า','สร้าง array ใหม่','นับ array'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Error Handling', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'try { } catch (e) { } ใช้ทำอะไร?', options: ['ทดสอบ performance','จับ error ไม่ให้โปรแกรมพัง','สร้าง loop','เช็คชนิดข้อมูล'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'try {\n  JSON.parse("bad");\n} __ (e) {\n  console.log(e.message);\n}', options: ['catch','except','error','handle'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'finally block ทำงานเมื่อใด?', options: ['เฉพาะตอน error','เฉพาะตอนสำเร็จ','เสมอ ไม่ว่า error หรือไม่','ไม่ทำงาน'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'throw new Error("oops") ทำอะไร?', options: ['แสดง "oops"','ปิดโปรแกรม','โยน error object','สร้าง warning'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'throw new __(\"Invalid input\");', options: ['Error','Exception','Throw','Problem'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'e.message ใน catch block คืออะไร?', options: ['ชื่อ error','ข้อความ error','stack trace','error code'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Error type กับสาเหตุ', pairs: [['TypeError','ใช้ค่าผิดชนิด'],['ReferenceError','ใช้ตัวแปรที่ไม่มี'],['SyntaxError','โค้ดผิด syntax'],['RangeError','ค่านอกช่วงที่ถูกต้อง']] } },
            { type: 'multiple_choice', data: { prompt: 'JSON.parse(JSON.stringify(obj)) ทำอะไร?', options: ['ลบ obj','deep clone object','validate JSON','แปลง obj เป็น string เท่านั้น'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 30,
      title: 'Functions',
      description: 'ฟังก์ชัน arrow function และ closures',
      icon: '⚙️',
      level: 'Beginner',
      grammar_note: `การประกาศฟังก์ชัน:
• function declaration: function name(params) { return val; }
• function expression: const f = function(params) { };
• arrow function: const f = (params) => value;
  — ไม่มี this ของตัวเอง
  — ถ้า body บรรทัดเดียวไม่ต้อง { } และ return
• default params: function f(x = 10) { }
• rest params: function f(...args) { } — args เป็น array
• spread: f(...array) ขยาย array เป็น arguments

Closures:
• ฟังก์ชันที่ "จำ" ตัวแปรของ scope แม่
• ใช้สร้าง private state หรือ factory functions`,
      lessons: [
        {
          order_num: 1, title: 'Function Declaration & Arrow', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'const f = x => x * 2; f(5) ได้อะไร?', options: ['5','10','25','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function greet(name = "World") {\n  return `Hello, ${__}!`;\n}', options: ['name','$name','"name"','(name)'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Arrow function ต่างจาก function ธรรมดาอย่างไร?', options: ['เร็วกว่า','ไม่มี this ของตัวเอง','return ไม่ได้','ใช้ async ไม่ได้'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function sum(...__) {\n  return args.reduce((a,b) => a+b, 0);\n}', options: ['args','params','values','nums'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'function ที่ไม่มี return ได้ค่าอะไร?', options: ['null','0','undefined','false'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'Closure คืออะไร?', options: ['การปิด loop','ฟังก์ชันที่จำ scope แม่ไว้','การ return function','การประกาศตัวแปรใน loop'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่รูปแบบ function', pairs: [['() => expr','arrow ค่าเดียว'],['(a,b) => a+b','arrow 2 param'],['function f(){}','declaration'],['const f = function(){}','expression']] } },
            { type: 'multiple_choice', data: { prompt: 'Math.max(...[1,5,3]) ได้อะไร?', options: ['1','3','5','[1,5,3]'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'Higher-Order Functions', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '[1,2,3].map(x => x*2) ได้อะไร?', options: ['[1,2,3]','[2,4,6]','6','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[1,2,3,4].__(x => x % 2 === 0)  // ได้ [2,4]', options: ['filter','map','find','select'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3].reduce((acc,x) => acc+x, 0) ได้อะไร?', options: ['0','3','6','[6]'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3].find(x => x > 1) ได้อะไร?', options: ['[2,3]','2','true','1'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[3,1,2].__(( a, b) => a - b)  // เรียงน้อยไปมาก', options: ['sort','order','arrange','rank'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3].every(x => x > 0) ได้อะไร?', options: ['false','true','[true,true,true]','3'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['map','แปลงทุกค่า'],['filter','กรองตามเงื่อนไข'],['reduce','สะสมเป็นค่าเดียว'],['some','มีอย่างน้อยหนึ่งค่าตรง']] } },
            { type: 'multiple_choice', data: { prompt: '[1,[2,[3]]].flat(Infinity) ได้อะไร?', options: ['[1,[2,[3]]]','[1,2,[3]]','[1,2,3]','Error'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'Scope & Closures', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Block scope หมายความว่า?', options: ['ตัวแปรใช้ได้ทั้ง file','ตัวแปรใช้ได้ใน {} เท่านั้น','ตัวแปรใช้ได้ใน function','ตัวแปรเปลี่ยนไม่ได้'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function makeCounter() {\n  let n = 0;\n  return () => ++__;\n}', options: ['n','count','i','val'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Hoisting ของ var คืออะไร?', options: ['var ลบค่าตัวเอง','การที่ var ถูกยก declaration ขึ้นไปบน scope','var ใช้ได้แค่ใน loop','var เป็น global เสมอ'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'IIFE คืออะไร?', options: ['Immediately Invoked Function Expression','ฟังก์ชันที่ return object','async function','function ใน class'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: '(function() {\n  console.log("IIFE");\n})__;  // เรียกทันที', options: ['()','{}','[]',';'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Closure ใช้สร้างอะไรได้บ้าง?', options: ['private state, factory functions, memoization','เฉพาะ event handlers','เฉพาะ loop','เฉพาะ DOM'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำศัพท์กับความหมาย', pairs: [['scope','ขอบเขตที่ตัวแปรใช้ได้'],['closure','ฟังก์ชันจำ outer scope'],['hoisting','ยก declaration ขึ้นบน'],['lexical scope','scope กำหนดที่เขียนโค้ด']] } },
            { type: 'multiple_choice', data: { prompt: 'globalThis ใน JS คืออะไร?', options: ['window เสมอ','global object ที่ใช้ได้ทุก environment','undefined ใน Node','this ใน function'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 40,
      title: 'DOM & Events',
      description: 'จัดการ HTML ด้วย JavaScript และ event handling',
      icon: '🖥️',
      level: 'Beginner',
      grammar_note: `DOM (Document Object Model):
• document.getElementById("id") — หา element ด้วย ID
• document.querySelector(".cls") — CSS selector (คืน 1 ชิ้น)
• document.querySelectorAll("p") — CSS selector (คืน NodeList)
• el.textContent = "text" — เปลี่ยนข้อความ
• el.innerHTML = "<b>bold</b>" — เปลี่ยน HTML
• el.classList.add/remove/toggle("class")
• el.style.color = "red" — เปลี่ยน inline style
• document.createElement("div") + parent.appendChild(el)

Events:
• el.addEventListener("click", handler)
• event.preventDefault() — ยกเลิก default action
• event.stopPropagation() — หยุด bubbling
• Event delegation: ใส่ listener บน parent แทน children`,
      lessons: [
        {
          order_num: 1, title: 'DOM Selection & Manipulation', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'document.querySelector("#app") หาอะไร?', options: ['class "app"','id "app"','tag "app"','attribute "app"'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const btn = document.getElementById("__");', options: ['myBtn','#myBtn','.myBtn','[myBtn]'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'el.textContent = "Hi" ทำอะไร?', options: ['อ่านข้อความ','เปลี่ยนข้อความใน element','เพิ่ม class','สร้าง element'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'el.classList.toggle("active") ทำอะไร?', options: ['เพิ่ม class เสมอ','ลบ class เสมอ','เพิ่มถ้าไม่มี ลบถ้ามี','ตรวจว่ามี class'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'const div = document.createElement("__");\ndocument.body.appendChild(div);', options: ['div','DIV','"div"','<div>'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'innerHTML ต่างจาก textContent อย่างไร?', options: ['ไม่ต่างกัน','innerHTML parse HTML tags ด้วย','textContent เร็วกว่าเสมอ','textContent รับ HTML ได้'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['querySelector','CSS selector คืน 1 element'],['querySelectorAll','CSS selector คืน NodeList'],['getElementById','หาด้วย id'],['getElementsByClassName','หาด้วย class']] } },
            { type: 'multiple_choice', data: { prompt: 'el.remove() ทำอะไร?', options: ['ซ่อน element','ลบ element ออกจาก DOM','ล้าง style','ลบ event listener'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Event Handling', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'el.addEventListener("click", fn) ทำอะไร?', options: ['เรียก fn ทันที','ผูก fn เมื่อ element ถูกคลิก','สร้าง event','ลบ event listener'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'btn.addEventListener("click", function(e) {\n  e.__();\n  // ยกเลิก default\n});', options: ['preventDefault','stop','cancel','block'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Event bubbling คืออะไร?', options: ['event เกิดซ้ำ','event ลอยขึ้นจาก child ไป parent','event ถูกยกเลิก','event ถูกสร้างใหม่'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Event delegation คือ?', options: ['ส่ง event ไป server','ใส่ listener บน parent แทน children แต่ละตัว','ลบ listener','event ซ้อนกัน'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'document.addEventListener("DOMContentLoaded", () => {\n  // __ เมื่อ DOM พร้อม\n});', options: ['รัน','init','start','begin'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'e.target ใน event handler คืออะไร?', options: ['event object','element ที่ถูกคลิกจริงๆ','parent element','document'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ event กับการใช้งาน', pairs: [['click','คลิก mouse'],['input','พิมพ์ใน input'],['submit','ส่ง form'],['keydown','กดปุ่ม keyboard']] } },
            { type: 'multiple_choice', data: { prompt: 'removeEventListener ต้องการอะไร?', options: ['ชื่อ event อย่างเดียว','ชื่อ event และ reference ฟังก์ชันเดียวกัน','ไม่ต้องใส่ argument','element id'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Forms & User Input', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'input.value คืออะไร?', options: ['ชนิดของ input','ค่าที่ผู้ใช้พิมพ์ใน input','id ของ input','placeholder'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'form.addEventListener("submit", (e) => {\n  e.__();\n  // ป้องกัน page reload\n});', options: ['preventDefault','stopPropagation','cancel','stop'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'checkbox.checked คืออะไร?', options: ['"checked"','true/false ว่า checked ไหม','ค่าของ checkbox','id ของ checkbox'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'input.focus() ทำอะไร?', options: ['ลบค่า input','ย้าย cursor ไปที่ input','ซ่อน input','submit form'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const val = document.getElementById("name").__;\n// อ่านค่าที่พิมพ์', options: ['value','text','content','data'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'select.value ของ <select> คืออะไร?', options: ['ชื่อ select','option ที่ถูกเลือก value','จำนวน option','index ที่เลือก'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ input type กับการใช้งาน', pairs: [['text','พิมพ์ข้อความ'],['checkbox','เลือกได้หลายอย่าง'],['radio','เลือกได้อย่างเดียว'],['range','เลื่อน slider']] } },
            { type: 'multiple_choice', data: { prompt: 'FormData ใช้ทำอะไร?', options: ['validate form','เก็บและส่งข้อมูล form ได้ง่าย รวม file','สร้าง form','ลบ form'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 50,
      title: 'Async JavaScript',
      description: 'Promise, async/await และการจัดการ asynchronous',
      icon: '⏳',
      level: 'Beginner',
      grammar_note: `Asynchronous JavaScript:
• Callback — รูปแบบเก่า เกิด "callback hell" ถ้าซ้อนกันมาก
• Promise — object แทน "ผลลัพธ์ในอนาคต"
  — new Promise((resolve, reject) => { ... })
  — .then(result => ...).catch(err => ...).finally(() => ...)
• async/await — syntax น้ำตาลบน Promise อ่านง่ายกว่า
  — async function f() { const r = await promise; }
  — ต้องใช้ try/catch จับ error
• fetch API — HTTP request แบบ async
  — fetch(url).then(r => r.json()).then(data => ...)`,
      lessons: [
        {
          order_num: 1, title: 'Promise', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Promise มี state กี่อย่าง?', options: ['2','3','4','5'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const p = new Promise((resolve, __) => {\n  resolve("ok");\n});', options: ['reject','catch','error','fail'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'p.then(r => ...) ทำงานเมื่อ?', options: ['เสมอ','Promise fulfilled','Promise rejected','Promise pending'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Promise.all([p1,p2,p3]) ทำอะไร?', options: ['รัน sequence','รอทุก promise เสร็จพร้อมกัน','ยกเลิกทั้งหมด','รันแค่ตัวแรก'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'fetch(url)\n  .then(r => r.__())\n  .then(data => console.log(data));', options: ['json','text','parse','data'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Promise.race([p1,p2]) ทำอะไร?', options: ['รอทุกตัว','ใช้ผลแรกที่เสร็จ','ยกเลิกทั้งหมด','เลือกตัวที่เร็วที่สุด แล้วยกเลิกตัวอื่น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Promise state กับความหมาย', pairs: [['pending','ยังรออยู่'],['fulfilled','สำเร็จ'],['rejected','ล้มเหลว'],['settled','fulfilled หรือ rejected']] } },
            { type: 'multiple_choice', data: { prompt: '.catch(e => ...) จับอะไร?', options: ['ทุก event','Promise rejected','syntax error','network error เท่านั้น'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Async / Await', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'async function ส่งคืนอะไรเสมอ?', options: ['undefined','Promise','string','number'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'async function load() {\n  const data = __ fetch(url);\n  return data.json();\n}', options: ['await','async','yield','defer'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'await สามารถใช้ได้ที่ไหน?', options: ['ทุกที่','ใน async function เท่านั้น (หรือ top-level module)','ใน class เท่านั้น','ใน Promise เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'วิธีจับ error ใน async/await คือ?', options: ['.catch()','try/catch','error()','both .catch and try/catch ใช้ได้'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: 'async function getData() {\n  try {\n    const r = await fetch(url);\n    return await r.json();\n  } __ (e) {\n    console.error(e);\n  }\n}', options: ['catch','except','error','handle'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'await Promise.all([f1(), f2()]) ทำอะไร?', options: ['รัน f1 ก่อน f2','รัน f1 และ f2 พร้อมกัน รอทั้งคู่','ยกเลิกถ้า error','รัน f1 ถ้า error รัน f2'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่รูปแบบกับการใช้งาน', pairs: [['await fetch(url)','ดึงข้อมูล HTTP'],['await resp.json()','แปลงเป็น JS object'],['try/catch + await','จัดการ async error'],['async function','ประกาศ async context']] } },
            { type: 'multiple_choice', data: { prompt: 'Top-level await คืออะไร?', options: ['await นอก function ในโมดูล','await ใน constructor','await ใน loop','await ใน class'], correct_index: 0 } },
          ]
        },
        {
          order_num: 3, title: 'Fetch API & JSON', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'fetch(url) ส่งคืนอะไร?', options: ['data โดยตรง','Promise<Response>','string','object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const resp = await fetch(url);\nconst data = await resp.__();', options: ['json','text','parse','data'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'resp.ok หมายความว่า?', options: ['status = 200 เสมอ','status 200-299','status < 400','ไม่มี error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ส่ง POST ด้วย fetch ต้องทำอย่างไร?', options: ['เพิ่ม ?method=POST ใน URL','ใส่ { method:"POST", body: JSON.stringify(data), headers } ใน options','ใช้ fetch.post()','ไม่สามารถทำได้'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const resp = await fetch(url, {\n  method: "POST",\n  headers: { "Content-Type": "application/__" },\n  body: JSON.stringify(data)\n});', options: ['json','text','form','html'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'JSON.stringify({a:1}) ได้อะไร?', options: ['{a:1}','{"a":1}','a=1','[a,1]'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำสั่งกับการทำงาน', pairs: [['JSON.parse(str)','string → JS object'],['JSON.stringify(obj)','JS object → string'],['resp.json()','response → JS object'],['resp.text()','response → string']] } },
            { type: 'multiple_choice', data: { prompt: 'AbortController ใช้ทำอะไร?', options: ['ยกเลิก fetch request ได้','เร่ง fetch','debug fetch','แคช response'], correct_index: 0 } },
          ]
        },
      ]
    },

    // ══════════════════════════ INTERMEDIATE ══════════════════════════

    {
      order_num: 60,
      title: 'Object-Oriented JavaScript',
      description: 'Class, prototype, inheritance และ OOP ใน JavaScript',
      icon: '🏗️',
      level: 'Intermediate',
      grammar_note: `Classes ใน JavaScript (ES6+):
• class Animal { constructor(name) { this.name = name; } }
• method ใน class: speak() { return \`${this.name} speaks\`; }
• inheritance: class Dog extends Animal { constructor(name) { super(name); } }
• static method: static create(n) { return new Animal(n); }
• private fields (ES2022): #field — ใช้ได้ใน class เท่านั้น
• getter/setter: get name() { } / set name(v) { }

Prototype chain:
• ทุก object มี __proto__ ชี้ไปยัง prototype
• method lookup ไล่ขึ้นตาม prototype chain
• hasOwnProperty(key) เช็คว่า property อยู่บน object เอง`,
      lessons: [
        {
          order_num: 1, title: 'Classes & Constructors', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'constructor() ใน class ทำงานเมื่อใด?', options: ['เรียก method','สร้าง instance ใหม่','extends class','static method'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class Dog extends Animal {\n  constructor(name) {\n    __(name);\n  }\n}', options: ['super','this','Animal','parent'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'static method เรียกใช้ยังไง?', options: ['new Class().method()','Class.method()','this.method()','instance.method()'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '#name ใน class (ES2022) หมายความว่า?', options: ['protected field','private field','static field','public field'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class Circle {\n  get area() {\n    return Math.PI * this.r ** 2;\n  }\n  __ radius(v) { this.r = v; }\n}', options: ['set','get','let','def'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'instanceof ทำอะไร?', options: ['สร้าง instance','เช็คว่า object เป็น instance ของ class ไหม','เรียก constructor','ดู prototype'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำสำคัญกับความหมาย', pairs: [['class','ประกาศ blueprint'],['extends','สืบทอด class'],['super','เรียก parent'],['new','สร้าง instance']] } },
            { type: 'multiple_choice', data: { prompt: 'Method overriding คือ?', options: ['สร้าง method ใหม่','child class ประกาศ method ชื่อเดิมทับ parent','ลบ method','เพิ่ม parameter'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Prototype & this', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'this ใน method ของ object ชี้ไปที่ไหน?', options: ['global object','object ที่เรียก method นั้น','undefined','prototype'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const greet = sayHi.__(person);\n// bind this ให้เป็น person', options: ['bind','call','apply','set'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'fn.call(obj, a, b) ต่างจาก fn.apply(obj, [a,b]) อย่างไร?', options: ['ไม่ต่างกันเลย','call รับ args แยก apply รับ array','call เร็วกว่า','apply เปลี่ยน this ไม่ได้'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Object.create(proto) ทำอะไร?', options: ['copy object','สร้าง object ใหม่ที่มี proto เป็น prototype','สร้าง class','clone object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'Dog.prototype.__ === Animal.prototype;', options: ['__proto__','prototype','constructor','parent'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'hasOwnProperty("key") ต่างจาก "key" in obj อย่างไร?', options: ['ไม่ต่างกัน','hasOwnProperty เช็คเฉพาะ own property, in เช็คทั้ง chain','in เร็วกว่า','hasOwnProperty ต้องการ key เป็น number'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['call','เรียกพร้อมเซ็ต this, args แยก'],['apply','เรียกพร้อมเซ็ต this, args เป็น array'],['bind','สร้าง function ใหม่ผูก this'],['Object.assign','copy properties']] } },
            { type: 'multiple_choice', data: { prompt: 'Arrow function ไม่มี this ของตัวเองหมายความว่า?', options: ['this = null','this ดูจาก enclosing lexical scope','this = window เสมอ','ใช้ this ไม่ได้เลย'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Mixins & Composition', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Object.assign(target, src) ทำอะไร?', options: ['เปรียบ object','copy properties จาก src ไป target','สร้าง class','merge array'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const merged = { ...obj1, ...__ };', options: ['obj2','obj1','target','source'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Mixin pattern คือ?', options: ['single inheritance','นำ behavior จากหลายแหล่งมาผสม','abstract class','interface'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Composition over inheritance หมายความว่า?', options: ['ห้ามใช้ extends','ประกอบ object จาก function เล็กๆ แทนสร้าง hierarchy ลึก','ใช้ mixin แทน class','ห้ามใช้ class'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const flyable = { fly() { return "flying"; } };\nconst bird = __(flyable, { name: "eagle" });', options: ['Object.assign','Object.create','Object.keys','Object.freeze'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Object.freeze(obj) ทำอะไร?', options: ['ลบ obj','ป้องกันการแก้ไข property','ทำ deep copy','serialize เป็น JSON'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่รูปแบบกับความหมาย', pairs: [['inheritance','is-a relationship'],['composition','has-a relationship'],['mixin','reuse behavior'],['delegation','ส่งงานให้ object อื่น']] } },
            { type: 'multiple_choice', data: { prompt: 'Symbol ใน JS ใช้ทำอะไร?', options: ['แทนตัวเลข','สร้าง unique identifier สำหรับ property','แทน string','สร้าง class'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 70,
      title: 'Modules & Tooling',
      description: 'ES Modules, npm, bundlers และ modern JS workflow',
      icon: '📦',
      level: 'Intermediate',
      grammar_note: `ES Modules:
• export const x = 1; / export default function f() {}
• import { x } from './module.js';
• import f from './module.js'; (default import)
• import * as mod from './module.js';
• Dynamic import: const m = await import('./mod.js');

npm & package.json:
• npm init — สร้าง package.json
• npm install <pkg> — ติดตั้ง dependency
• npm install -D <pkg> — dev dependency
• scripts ใน package.json: "start", "build", "test"

Bundlers (Vite, Webpack):
• รวม modules หลายไฟล์เป็น bundle
• Vite: เร็ว dev server ด้วย native ESM
• Tree shaking — ตัดโค้ดที่ไม่ใช้ออก`,
      lessons: [
        {
          order_num: 1, title: 'ES Modules', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'export default ต่างจาก named export อย่างไร?', options: ['ไม่ต่างกัน','default: 1 ไฟล์ 1 ตัว, named: หลายตัวได้','default เร็วกว่า','named ต้อง {} เสมอ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'import { add, __ } from "./math.js";', options: ['subtract','*','default','all'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'import * as utils from "./utils.js" ทำอะไร?', options: ['import default','import ทุก export เป็น object ชื่อ utils','import ไฟล์ทั้งหมด','error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Dynamic import ใช้เมื่อไร?', options: ['เสมอ','โหลด module ตอน runtime เช่น lazy loading','ใน Node.js เท่านั้น','แทน require()'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const mod = await __("./heavy.js");\nmod.doWork();', options: ['import','require','load','fetch'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'type="module" ใน <script> ทำอะไร?', options: ['ทำให้เร็วขึ้น','เปิดใช้ ES module syntax ใน browser','ปิด strict mode','โหลดแบบ async'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ syntax กับการทำงาน', pairs: [['export default f','default export'],['export { a, b }','named export'],['import f from ...','import default'],['import { a } from ...','import named']] } },
            { type: 'multiple_choice', data: { prompt: 'Tree shaking คืออะไร?', options: ['ลบ node_modules','bundler ตัด export ที่ไม่ถูก import ออก','เรียง imports','merge modules'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'npm & Package Management', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'npm install --save-dev jest ทำอะไร?', options: ['ติดตั้ง jest เป็น production dep','ติดตั้ง jest เป็น dev dependency','อัปเดต jest','ลบ jest'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '// package.json\n"scripts": {\n  "start": "node __"\n}', options: ['index.js','server','app','main'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'package-lock.json มีไว้ทำอะไร?', options: ['config npm','lock version ของ dependency ทุกตัว','สำรองข้อมูล','บันทึก error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'npx <cmd> ต่างจาก npm <cmd> อย่างไร?', options: ['ไม่ต่างกัน','npx รัน package โดยไม่ต้องติดตั้ง global','npx เร็วกว่า','npx ใช้กับ local package เท่านั้น'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'npm __ lodash  // ลบ package', options: ['uninstall','remove','delete','rm'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'semver "^1.2.3" หมายความว่า?', options: ['เฉพาะ 1.2.3','ยอม minor/patch ใหม่ (1.x.x)','ยอม patch เท่านั้น (1.2.x)','ทุก version'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ npm command กับการทำงาน', pairs: [['npm init','สร้าง package.json'],['npm install','ติดตั้ง dependencies'],['npm run build','รัน build script'],['npm publish','เผยแพร่ package']] } },
            { type: 'multiple_choice', data: { prompt: '.npmignore มีไว้ทำอะไร?', options: ['ซ่อน secrets','ระบุไฟล์ที่ไม่ publish ไปใน npm','ป้องกันการลบ','config lint'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Vite & Modern Tooling', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Vite เร็วกว่า Webpack ตอน dev เพราะ?', options: ['ใช้ Go','serve native ESM โดยไม่ต้อง bundle ทั้งโปรเจกต์','ใช้ cache มากกว่า','เขียน Python'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'npm create __ @latest  // สร้างโปรเจกต์ Vite', options: ['vite','react','app','project'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Hot Module Replacement (HMR) คือ?', options: ['reload page ทั้งหมด','อัปเดต module ที่เปลี่ยนโดยไม่ reload page','สร้าง module ใหม่','ลบ module'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ESLint ใช้ทำอะไร?', options: ['bundle JS','ตรวจ code style และ potential bugs','run tests','format code เท่านั้น'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'npm run __  // สร้าง production build', options: ['build','start','dev','compile'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Prettier ต่างจาก ESLint อย่างไร?', options: ['ไม่ต่างกัน','Prettier format code เท่านั้น ESLint เช็ค logic ด้วย','Prettier เร็วกว่า','ESLint ทำ format ได้เหมือนกัน'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เครื่องมือกับหน้าที่', pairs: [['Vite','dev server + bundler'],['ESLint','linter ตรวจโค้ด'],['Prettier','formatter จัด style'],['TypeScript','type checking']] } },
            { type: 'multiple_choice', data: { prompt: 'Source map คืออะไร?', options: ['แผนที่โปรแกรม','map โค้ด bundle → โค้ดต้นฉบับ เพื่อ debug','แสดง network request','แผนที่ DOM'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 80,
      title: 'Browser APIs & Storage',
      description: 'Web APIs สำคัญ: localStorage, fetch, Intersection Observer และอื่นๆ',
      icon: '🗄️',
      level: 'Intermediate',
      grammar_note: `Storage APIs:
• localStorage — เก็บข้อมูล string ถาวรใน browser
  setItem(k,v), getItem(k), removeItem(k), clear()
• sessionStorage — เหมือน localStorage แต่หายเมื่อปิด tab
• IndexedDB — database ใน browser สำหรับข้อมูลมาก
• Cookies — ส่งไปกับ HTTP request ทุกครั้ง

Useful Browser APIs:
• navigator.geolocation.getCurrentPosition(cb)
• Intersection Observer — detect element ว่าอยู่ใน viewport
• ResizeObserver — detect element resize
• Web Workers — รัน JS แยก thread ไม่บล็อก UI
• History API: pushState, replaceState, popstate event`,
      lessons: [
        {
          order_num: 1, title: 'localStorage & sessionStorage', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'localStorage ต่างจาก sessionStorage อย่างไร?', options: ['ไม่ต่างกัน','localStorage ถาวร sessionStorage หายเมื่อปิด tab','sessionStorage เร็วกว่า','localStorage ส่งไปกับ request'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'localStorage.__(\"theme\", \"dark\");', options: ['setItem','set','save','store'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'localStorage เก็บข้อมูลชนิดอะไร?', options: ['ทุกชนิด','string เท่านั้น','JSON เท่านั้น','number เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'เก็บ object ใน localStorage ต้องทำอย่างไร?', options: ['เก็บตรงได้เลย','JSON.stringify ก่อนเก็บ JSON.parse ตอนอ่าน','ใช้ indexedDB','ไม่สามารถทำได้'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const theme = localStorage.__(\"theme\");', options: ['getItem','get','read','load'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'localStorage.clear() ทำอะไร?', options: ['ลบ 1 item','ลบทุก item ใน localStorage','ล้าง cookie','reset browser'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ storage กับคุณสมบัติ', pairs: [['localStorage','ถาวร ทุก tab'],['sessionStorage','หายเมื่อปิด tab'],['IndexedDB','database structured data'],['cookies','ส่งกับ HTTP request']] } },
            { type: 'multiple_choice', data: { prompt: 'ขนาด limit ของ localStorage โดยประมาณ?', options: ['1 KB','5 MB','50 MB','ไม่จำกัด'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Intersection & Resize Observers', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'IntersectionObserver ใช้ทำอะไร?', options: ['เช็ค click','detect element เข้า/ออก viewport','วัดขนาด element','ติดตาม scroll position'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const io = new IntersectionObserver(__(entries) {\n  // handle\n});\nio.observe(el);', options: ['callback','function','handler','fn'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Lazy loading images ใช้ API ใด?', options: ['MutationObserver','IntersectionObserver','ResizeObserver','PerformanceObserver'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ResizeObserver ต่างจาก window resize event อย่างไร?', options: ['ไม่ต่างกัน','observe เฉพาะ element ที่กำหนด ไม่ใช่แค่ window','ResizeObserver เร็วกว่า','window resize ใช้ Observer pattern'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const ro = new ResizeObserver(__ => {\n  console.log("resized");\n});\nro.observe(el);', options: ['entries','e','event','change'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'threshold: 0.5 ใน IntersectionObserver หมายถึง?', options: ['50ms delay','fire เมื่อ 50% ของ element อยู่ใน viewport','รอ 50 event','element ต้อง 50px ใน viewport'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Observer กับการใช้งาน', pairs: [['IntersectionObserver','element ใน viewport?'],['ResizeObserver','element ขนาดเปลี่ยน?'],['MutationObserver','DOM เปลี่ยน?'],['PerformanceObserver','timing measurements']] } },
            { type: 'multiple_choice', data: { prompt: 'observer.disconnect() ทำอะไร?', options: ['หยุด observe ทั้งหมด','pause observer','ลบ element','ลบ observer จาก DOM'], correct_index: 0 } },
          ]
        },
        {
          order_num: 3, title: 'Web Workers & History API', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Web Worker ทำงานอย่างไร?', options: ['รันใน main thread','รันใน background thread แยกจาก UI','รันใน server','รันใน iframe'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const worker = new __(\"worker.js\");', options: ['Worker','Thread','Background','Service'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'worker.postMessage(data) ทำอะไร?', options: ['รัน worker','ส่ง data ไปยัง worker','หยุด worker','ดึงผลลัพธ์'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'history.pushState(state, title, url) ทำอะไร?', options: ['reload page','เปลี่ยน URL โดยไม่ reload','ไปหน้าก่อนหน้า','บันทึก bookmark'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'window.addEventListener("__", (e) => {\n  console.log(e.state);\n  // กด back/forward\n});', options: ['popstate','history','navigate','statechange'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Service Worker ต่างจาก Web Worker อย่างไร?', options: ['ไม่ต่างกัน','Service Worker: intercept network, offline; Web Worker: compute','Service Worker ใช้ UI ได้','Web Worker เฉพาะ Node.js'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ API กับการใช้งาน', pairs: [['Web Worker','คำนวณหนักใน background'],['Service Worker','cache และ offline'],['SharedWorker','หลาย tab ใช้ worker ร่วม'],['Worklet','animation/audio processing']] } },
            { type: 'multiple_choice', data: { prompt: 'Transferable objects ใน Worker คืออะไร?', options: ['object ที่ copy ได้','object ที่โอน ownership ได้ (เช่น ArrayBuffer) ไม่ต้อง copy','object พิเศษสำหรับ Worker','class ใน Worker'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 90,
      title: 'TypeScript Basics',
      description: 'Type annotations, interfaces และ generics เบื้องต้น',
      icon: '🔷',
      level: 'Intermediate',
      grammar_note: `TypeScript คือ JavaScript + static type checking:
• ติดตั้ง: npm i -D typescript ts-node
• ไฟล์ .ts / tsconfig.json
• Types: string, number, boolean, null, undefined, any, unknown, never, void

Type annotations:
• let x: number = 5;
• function f(a: string, b: number): boolean { }
• Array: number[] หรือ Array<number>
• Tuple: [string, number]
• Union: string | number
• Optional: param?: string

Interfaces & Types:
• interface User { name: string; age?: number; }
• type Point = { x: number; y: number; }
• Generics: function identity<T>(val: T): T { return val; }`,
      lessons: [
        {
          order_num: 1, title: 'Type Annotations', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'let x: string = 5; ผลอะไร?', options: ['ได้ x=5','Type error: number ≠ string','x เป็น "5"','ได้ undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function greet(name: __): string {\n  return `Hi ${name}`;\n}', options: ['string','String','str','text'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'any type ใน TypeScript คือ?', options: ['ห้ามใช้เสมอ','ปิด type checking สำหรับตัวนั้น','เร็วที่สุด','เหมือน unknown'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'unknown ต่างจาก any อย่างไร?', options: ['ไม่ต่างกัน','unknown ต้อง type-check ก่อนใช้ any ไม่ต้อง','unknown ห้ามกำหนดค่า','any ปลอดภัยกว่า'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'let val: string | __ = null;\n// nullable string', options: ['null','undefined','void','never'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'void return type หมายความว่า?', options: ['คืน null','คืน undefined (function ไม่คืนค่า)','คืน any','ห้าม return'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ type กับความหมาย', pairs: [['string','ข้อความ'],['number','ตัวเลข'],['never','ไม่มีทางถึงได้'],['void','ไม่คืนค่า']] } },
            { type: 'multiple_choice', data: { prompt: 'Type assertion คือ?', options: ['เปลี่ยนชนิด runtime','บอก compiler ว่าเราแน่ใจในชนิด (val as Type)','validate ชนิด','cast แบบ C++'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Interfaces & Types', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'interface User { name: string; age?: number; } age? หมายความว่า?', options: ['age ต้องมี','age เป็น optional','age เป็น null','age เป็น number เสมอ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'interface Animal {\n  name: string;\n  speak(): __;\n}', options: ['void','string','any','undefined'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'type ต่างจาก interface อย่างไร?', options: ['ไม่ต่างกัน','type ทำ union/intersection ได้ง่ายกว่า interface extends ได้ดีกว่า','interface เร็วกว่า','type ใช้กับ object เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Readonly<User> ทำอะไร?', options: ['สร้าง copy','ทำให้ทุก property เปลี่ยนไม่ได้','ซ่อน property','เพิ่ม undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'type Result = __ | { error: string };\n// union type', options: ['{ data: any }','{data}','Data','Result'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Intersection type A & B คือ?', options: ['A หรือ B','A และ B รวมกัน (ต้องมีทุก property)','A ขยาย B','A ลบด้วย B'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ utility type กับการทำงาน', pairs: [['Partial<T>','ทุก prop เป็น optional'],['Required<T>','ทุก prop เป็น required'],['Readonly<T>','ทุก prop เปลี่ยนไม่ได้'],['Pick<T,K>','เลือก property บางส่วน']] } },
            { type: 'multiple_choice', data: { prompt: 'keyof User ได้อะไร (User = {name:string, age:number})?', options: ['"name" | "age"','string | number','["name","age"]','{ name, age }'], correct_index: 0 } },
          ]
        },
        {
          order_num: 3, title: 'Generics', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Generics ใน TypeScript ใช้ทำอะไร?', options: ['ทำให้โค้ดเร็วขึ้น','เขียนโค้ด reusable ที่ type-safe','ลด memory','import module'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function first<__>(arr: T[]): T {\n  return arr[0];\n}', options: ['T','Type','Any','G'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'first<string>(["a","b"]) ได้อะไร?', options: ['"b"','"a"','string','["a","b"]'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Generic constraint <T extends object> หมายความว่า?', options: ['T ต้องเป็น class','T ต้องเป็น object type','T ต้องมี property','T ต้องเป็น array'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'interface Box<__> {\n  value: T;\n}', options: ['T','Type','Any','V'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Promise<string> หมายความว่า?', options: ['Promise ที่คืน string','Promise ชนิด string','string Promise','error type string'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ generic syntax กับความหมาย', pairs: [['<T>','type parameter'],['<T extends U>','T ต้องเป็น subtype U'],['Array<T>','array ของ T'],['Promise<T>','async คืน T']] } },
            { type: 'multiple_choice', data: { prompt: 'ReturnType<typeof fn> ได้อะไร?', options: ['ชื่อ function','type ที่ function คืน','parameter types','void เสมอ'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ══════════════════════════ ADVANCED ══════════════════════════════

    {
      order_num: 100,
      title: 'Advanced Patterns',
      description: 'Design patterns, functional programming และ metaprogramming',
      icon: '🧩',
      level: 'Advanced',
      grammar_note: `Design Patterns ที่ใช้บ่อยใน JS:
• Singleton — instance เดียวทั้งโปรแกรม
• Observer/Event Emitter — subscribe/publish pattern
• Factory — สร้าง object โดยไม่ระบุ class ตรงๆ
• Proxy — intercept object operations (get, set, apply)
• Decorator — เพิ่ม behavior โดยไม่แก้ไข class เดิม

Functional Programming:
• Pure function — output ขึ้นกับ input เท่านั้น ไม่มี side effect
• Immutability — ไม่แก้ไข state เดิม สร้างใหม่แทน
• Currying: f(a)(b)(c) แทน f(a,b,c)
• Function composition: compose(f, g)(x) = f(g(x))

Proxy & Reflect:
• new Proxy(target, { get(t,k) {...}, set(t,k,v) {...} })
• Reflect.get/set/has — เรียก default operation`,
      lessons: [
        {
          order_num: 1, title: 'Design Patterns', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Singleton pattern ใช้ทำอะไร?', options: ['สร้าง object ใหม่ทุกครั้ง','รับประกันว่ามี instance เดียว','สร้าง factory','ทำ clone'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const emitter = new EventEmitter();\nemitter.on("data", __);\nemitter.emit("data", payload);', options: ['handler','event','fn','callback'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Factory pattern คือ?', options: ['เหมือน new Class()','function/method ที่สร้าง object แทนการ new ตรงๆ','pattern สำหรับ async','singleton variation'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Proxy ใน JS ใช้ทำอะไร?', options: ['proxy server','intercept get/set/apply บน object','สร้าง virtual DOM','clone object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const p = new Proxy(target, {\n  get(t, k) { return __ in t ? t[k] : "default"; }\n});', options: ['k','key','prop','name'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Pure function คือ?', options: ['function ที่ใช้ class','function ที่ output ขึ้นกับ input เท่านั้น ไม่มี side effect','async function','function ไม่มี return'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ pattern กับการใช้งาน', pairs: [['Singleton','config/connection เดียว'],['Observer','event system'],['Factory','สร้าง object แบบ abstraction'],['Decorator','เพิ่ม behavior ไม่แก้เดิม']] } },
            { type: 'multiple_choice', data: { prompt: 'Currying คือ?', options: ['ฟังก์ชันคณิตศาสตร์','แปลง f(a,b) → f(a)(b) เพื่อ partial application','copy function','bind function'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Iterators & Generators', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Iterator protocol ต้องมี method อะไร?', options: ['run()','next() ที่คืน { value, done }','iterate()','yield()'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function* counter() {\n  let i = 0;\n  while(true) __ i++;\n}', options: ['yield','return','emit','send'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Generator function ต่างจาก function ธรรมดาอย่างไร?', options: ['เร็วกว่า','หยุดและกลับมาต่อได้ด้วย yield','return ได้หลายครั้ง','ใช้ async ได้เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Symbol.iterator ใช้ทำอะไร?', options: ['ตั้งชื่อ symbol','กำหนด iterator สำหรับ object ให้ใช้กับ for...of ได้','สร้าง unique key','ลบ iterator'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for (const val of __(range(5))) {\n  console.log(val);\n}', options: ['gen','iter','Symbol','async'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'async generator (async function*) ใช้กับอะไร?', options: ['เฉพาะ array','stream ข้อมูล async เช่นอ่านไฟล์ทีละ chunk','ทำให้ generator เร็วขึ้น','ใช้กับ WebSocket เท่านั้น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ concept กับความหมาย', pairs: [['Iterator','object มี next()'],['Iterable','object มี Symbol.iterator'],['Generator','function* ที่ yield'],['AsyncGenerator','async function* ที่ yield']] } },
            { type: 'multiple_choice', data: { prompt: '[...generator()] ทำอะไร?', options: ['ลบ generator','spread ค่าทั้งหมดจาก generator เป็น array','clone generator','รัน generator แค่ครั้งเดียว'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Performance & Testing', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Debounce ใช้ทำอะไร?', options: ['เพิ่ม delay ทุกครั้ง','หน่วงการ call function ล่าสุด ถ้า call ถี่เกินไป','throttle API','queue function'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = __(fn, delay, ...args);\n  };\n}', options: ['setTimeout','setInterval','requestAnimationFrame','schedule'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Throttle ต่างจาก Debounce อย่างไร?', options: ['ไม่ต่างกัน','Throttle จำกัด rate (call ทุก n ms), Debounce รอหยุดก่อน','Throttle เร็วกว่า','Debounce ใช้กับ animation เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'requestAnimationFrame ใช้ทำอะไร?', options: ['setTimeout ที่เร็วกว่า','sync animation กับ browser repaint rate (60fps)','รัน worker','โหลด asset'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'describe("add", () => {\n  __(\"1+1=2\", () => {\n    expect(add(1,1)).toBe(2);\n  });\n});', options: ['it','test','check','assert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Jest mock function (jest.fn()) ใช้ทำอะไร?', options: ['สร้าง real function','แทน function จริงด้วย mock ตรวจ call ได้','benchmark function','lint function'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เทคนิคกับการใช้งาน', pairs: [['Debounce','search input, resize'],['Throttle','scroll, mouse move'],['Memoization','cache ผลลัพธ์ function'],['Lazy loading','โหลด resource ตอนต้องการ']] } },
            { type: 'multiple_choice', data: { prompt: 'Lighthouse ใช้วัดอะไร?', options: ['code coverage','web performance, accessibility, SEO','bundle size เท่านั้น','network latency'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 110,
      title: 'Node.js & Backend',
      description: 'รัน JavaScript ฝั่ง server ด้วย Node.js และ Express',
      icon: '🖥️',
      level: 'Advanced',
      grammar_note: `Node.js:
• JavaScript runtime บน V8 engine ไม่มี browser API
• Event loop — single-threaded non-blocking I/O
• Built-in modules: fs, path, http, crypto, os, events
• require() (CommonJS) หรือ import (ESM)

Express.js:
• npm install express
• const app = express();
• app.get("/path", (req, res) => { res.json(data); })
• Middleware: app.use(fn) — รันทุก request
• Router: express.Router() แยก routes เป็น module
• req.params, req.query, req.body (ต้องมี body-parser)

Useful patterns:
• app.use(express.json()) — parse JSON body
• Error middleware: (err, req, res, next) => { }
• Environment variables: process.env.PORT`,
      lessons: [
        {
          order_num: 1, title: 'Node.js Core', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Node.js ต่างจาก browser JS ตรงไหน?', options: ['ใช้ JavaScript ต่างกัน','ไม่มี DOM/window, มี fs/os/http แทน','เร็วกว่าเสมอ','ใช้ TypeScript เท่านั้น'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const fs = require("__");\nfs.readFileSync("file.txt", "utf8");', options: ['fs','file','io','path'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'process.env.PORT ใช้ทำอะไร?', options: ['เปลี่ยน port','อ่าน environment variable PORT','สร้าง server','ดู OS version'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '__dirname ใน Node คืออะไร?', options: ['root directory','directory ของไฟล์ปัจจุบัน','home directory','node_modules path'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const path = require("path");\nconst full = path.__(\"dir\", \"file.txt\");', options: ['join','concat','combine','merge'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Node.js event loop ทำงานอย่างไร?', options: ['multi-threaded','single-threaded non-blocking I/O ด้วย callback queue','ใช้ Web Workers','blocking I/O'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Node module กับการใช้งาน', pairs: [['fs','อ่าน/เขียนไฟล์'],['path','จัดการ file paths'],['http','สร้าง HTTP server'],['crypto','เข้ารหัสและ hash']] } },
            { type: 'multiple_choice', data: { prompt: 'npm scripts ใน package.json "start": "node index.js" รันยังไง?', options: ['node start','npm start','node npm start','./start'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Express.js', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'app.use(express.json()) ทำอะไร?', options: ['ส่ง JSON response','parse JSON request body','validate JSON','serialize JSON'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'app.get("/users/:id", (req, res) => {\n  const id = req.__.__;\n});', options: ['params.id','query.id','body.id','headers.id'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Middleware ใน Express คืออะไร?', options: ['ตัว app เอง','function (req,res,next) ที่รันก่อน route handler','ไฟล์ config','database connector'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'next() ใน middleware ทำอะไร?', options: ['ปิด server','ส่ง response','ส่งต่อให้ middleware/handler ถัดไป','handle error'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'const router = express.__();\nrouter.get("/", handler);\napp.use("/api", router);', options: ['Router','Route','router','route'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Error handling middleware ใน Express มี signature อะไร?', options: ['(req,res)','(req,res,next)','(err,req,res,next)','(err,res)'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับ HTTP verb', pairs: [['app.get()','GET'],['app.post()','POST'],['app.put()','PUT'],['app.delete()','DELETE']] } },
            { type: 'multiple_choice', data: { prompt: 'res.status(404).json({msg:"Not found"}) ทำอะไร?', options: ['throw error','ส่ง response 404 พร้อม JSON body','redirect','log error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Authentication & Security', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'JWT ย่อมาจากอะไร?', options: ['JavaScript Web Token','JSON Web Token','Java Web Token','JSON Wrapper Type'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const token = jwt.sign({ userId: 1 }, __, { expiresIn: "1h" });', options: ['SECRET','key','password','salt'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'bcrypt ใช้ทำอะไร?', options: ['เข้ารหัส JWT','hash password อย่างปลอดภัย','สร้าง token','encrypt API key'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'CORS คืออะไร?', options: ['security exploit','Cross-Origin Resource Sharing — browser policy สำหรับ cross-domain request','cache system','cookie system'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'app.use(helmet());  // เพิ่ม __ HTTP headers', options: ['security','CORS','auth','cache'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'SQL Injection ป้องกันได้ด้วย?', options: ['เข้ารหัส password','parameterized queries / prepared statements','HTTPS','rate limiting'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่การโจมตีกับการป้องกัน', pairs: [['XSS','sanitize output, CSP'],['CSRF','CSRF token, SameSite cookie'],['SQL Injection','parameterized queries'],['Brute force','rate limiting, lockout']] } },
            { type: 'multiple_choice', data: { prompt: 'Rate limiting ใน Express ใช้ป้องกันอะไร?', options: ['XSS','brute force และ DDoS','SQL injection','CORS issues'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 120,
      title: 'Modern Frameworks: React',
      description: 'React fundamentals, hooks และ state management',
      icon: '⚛️',
      level: 'Advanced',
      grammar_note: `React — UI library โดย Meta:
• Component: function MyComp(props) { return <JSX>; }
• JSX: HTML-like syntax ใน JS — transpile ด้วย Babel/Vite
• Props: ข้อมูลจาก parent → child (read-only)
• State: useState(initialVal) → [val, setVal]
• Effect: useEffect(() => { /* side effect */ }, [deps])
• Refs: useRef() — เข้าถึง DOM หรือเก็บค่าไม่ trigger render

Hooks สำคัญ:
• useState — local state
• useEffect — side effects (fetch, subscription, timer)
• useContext — อ่าน context
• useCallback/useMemo — memoize function/value
• useReducer — state complex ด้วย reducer pattern

Virtual DOM:
• React เปรียบ virtual DOM ก่อน update real DOM (diffing)
• key prop บน list items ช่วย reconciliation`,
      lessons: [
        {
          order_num: 1, title: 'Components & Props', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'React component คืออะไร?', options: ['HTML element','function ที่คืน JSX','class เท่านั้น','CSS module'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function Hello({ name }) {\n  return <h1>Hello, {__}!</h1>;\n}', options: ['name','props.name','{name}','this.name'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Props ใน React คืออะไร?', options: ['state ของ component','ข้อมูลส่งจาก parent ไป child','global variable','event object'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'key prop ใน list มีไว้ทำอะไร?', options: ['CSS class','ช่วย React identify แต่ละ item ในการ reconciliation','ID สำหรับ DOM','index ของ item'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'function App() {\n  return (\n    <__>\n      <H1 /><Nav />\n    </>\n  );\n}', options: ['React.Fragment หรือ <>','div','section','main'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'JSX ต่างจาก HTML อย่างไร?', options: ['ไม่ต่างกัน','ใช้ className แทน class, camelCase events, JavaScript ใน {}','JSX เร็วกว่า','JSX ใช้ใน browser โดยตรง'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำสำคัญกับความหมาย', pairs: [['props','ข้อมูลจาก parent'],['state','ข้อมูลภายใน component'],['JSX','HTML-like syntax ใน JS'],['Virtual DOM','abstraction บน real DOM']] } },
            { type: 'multiple_choice', data: { prompt: 'children prop คืออะไร?', options: ['prop พิเศษ','content ระหว่าง opening/closing tag ของ component','ชื่อ state','array ของ components'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Hooks: useState & useEffect', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'useState ส่งคืนอะไร?', options: ['state เท่านั้น','[value, setter] tuple','object','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const [count, __] = useState(0);', options: ['setCount','updateCount','changeCount','count'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'เมื่อ state เปลี่ยน React ทำอะไร?', options: ['reload page','re-render component ที่มี state นั้น','ไม่ทำอะไร','ลบ component'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'useEffect(fn, []) ทำงานเมื่อใด?', options: ['ทุก render','mount ครั้งเดียว','unmount','ทุกครั้งที่ state เปลี่ยน'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'useEffect(() => {\n  fetch(url).then(...);\n}, [__]);  // รันใหม่เมื่อ url เปลี่ยน', options: ['url','deps','id','data'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Cleanup function ใน useEffect คือ?', options: ['function ที่ return จาก effect ใช้ทำ cleanup เมื่อ unmount/re-run','setstate เพื่อล้าง state','async function','error handler'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ dependency array กับการทำงาน', pairs: [['useEffect(fn)','ทุก render'],['useEffect(fn,[])','mount เท่านั้น'],['useEffect(fn,[x])','เมื่อ x เปลี่ยน'],['return () => cleanup','ตอน unmount/re-run']] } },
            { type: 'multiple_choice', data: { prompt: 'useState setter (setVal) เป็น async หรือ sync?', options: ['sync เสมอ','async — state ไม่เปลี่ยนทันที','sync เฉพาะ event handler','ขึ้นกับ React version'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Context & Performance', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'React Context ใช้แก้ปัญหาอะไร?', options: ['state management ทุกกรณี','prop drilling — ส่ง props ผ่านหลาย level','performance','async state'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const ThemeCtx = React.createContext("light");\n// ใช้ใน component:\nconst theme = __(ThemeCtx);', options: ['useContext','useCtx','readContext','getContext'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'useMemo ใช้ทำอะไร?', options: ['memo component','cache ผลลัพธ์ function ที่ compute หนัก','เก็บ ref','manage side effect'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'useCallback ต่างจาก useMemo อย่างไร?', options: ['ไม่ต่างกัน','useCallback cache function reference, useMemo cache ผลลัพธ์','useCallback เร็วกว่า','useMemo ใช้กับ async'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'const sorted = useMemo(() => {\n  return [...list].sort();\n}, [__]);', options: ['list','deps','data','items'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'React.memo ทำอะไร?', options: ['เพิ่ม memo state','ป้องกัน re-render ถ้า props ไม่เปลี่ยน','เหมือน useMemo','เพิ่ม memoization ให้ hook'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ hook กับการใช้งาน', pairs: [['useState','local state'],['useEffect','side effects'],['useContext','อ่าน context'],['useReducer','state ซับซ้อนด้วย reducer']] } },
            { type: 'multiple_choice', data: { prompt: 'Code splitting ใน React ทำด้วยอะไร?', options: ['React.memo','React.lazy + Suspense','useEffect','useState'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 130,
      title: 'Testing & Deployment',
      description: 'Unit testing, integration testing และ CI/CD สำหรับ JS projects',
      icon: '🚀',
      level: 'Advanced',
      grammar_note: `Testing ใน JavaScript:
• Jest — test runner ยอดนิยม (unit + integration)
• Vitest — Vite-native test runner เร็วกว่า Jest
• Testing Library — test React components จาก user perspective
• Cypress / Playwright — E2E (End-to-End) testing

Jest basics:
• describe("group", () => { it("test", () => { expect(val).toBe(x); }); })
• Matchers: toBe, toEqual, toContain, toThrow, toBeTruthy
• Mock: jest.fn(), jest.mock('./module'), jest.spyOn

Deployment:
• Vercel / Netlify — JAMstack, static + serverless
• Railway / Render — full Node.js backend
• Docker: containerize app
• CI/CD: GitHub Actions — test + deploy on push`,
      lessons: [
        {
          order_num: 1, title: 'Jest Unit Testing', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'expect(2+2).toBe(4) ผ่าน test ไหม?', options: ['ไม่ผ่าน','ผ่าน','error','undefined'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'test("adds correctly", () => {\n  __(add(1,2)).toBe(3);\n});', options: ['expect','assert','check','verify'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'toEqual ต่างจาก toBe อย่างไร?', options: ['ไม่ต่างกัน','toEqual เปรียบ deep equality, toBe เปรียบ reference/primitive','toBe เร็วกว่า','toEqual เฉพาะ array'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'jest.fn() ใช้ทำอะไร?', options: ['สร้าง real function','mock function ที่ track การ call','เร่ง function','async function'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'jest.mock("./api");\nconst api = require("./api");\napi.fetch.__.mockReturnValue(Promise.resolve({data:1}));', options: ['mockReturnValue','return','set','value'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'beforeEach(() => {}) ทำงานเมื่อใด?', options: ['ก่อน test suite เดียว','ก่อนทุก test ใน describe block','หลังทุก test','ก่อน describe เดียว'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ matcher กับการทำงาน', pairs: [['toBe','strict equality'],['toEqual','deep equality'],['toContain','array/string มี item นี้'],['toThrow','function throw error']] } },
            { type: 'multiple_choice', data: { prompt: 'Code coverage หมายความว่า?', options: ['ขนาดโค้ด','% ของ code ที่ถูก execute ระหว่าง tests','test speed','bug count'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Integration & E2E Testing', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Integration test ต่างจาก unit test อย่างไร?', options: ['ไม่ต่างกัน','integration test รวมหลาย unit ทดสอบการทำงานร่วมกัน','integration test เร็วกว่า','unit test ทดสอบ UI'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'import { render, screen } from "@testing-library/__";\nrender(<Button label="Click" />);', options: ['react','dom','jest','enzyme'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'screen.getByText("Submit") ทำอะไร?', options: ['คลิก Submit','หา element ที่มีข้อความ "Submit"','สร้าง button','ส่ง form'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'E2E test คืออะไร?', options: ['test function เดี่ยว','ทดสอบ flow ทั้งหมดจาก user perspective ใน real browser','test API เท่านั้น','test database'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '// Playwright\nawait page.goto("http://localhost:3000");\nawait page.click("__");\n', options: ['text=Submit','#submit','(submit)','Submit'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'fireEvent.click(btn) ใน Testing Library ทำอะไร?', options: ['คลิก real browser','trigger click event บน element','ดู element','scroll ไปที่ element'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เครื่องมือกับการทดสอบ', pairs: [['Jest','unit / integration'],['Cypress','E2E browser automation'],['Playwright','E2E multi-browser'],['MSW','mock API server']] } },
            { type: 'multiple_choice', data: { prompt: 'Snapshot testing ใน Jest คืออะไร?', options: ['screenshot','บันทึกผลลัพธ์ render แล้วเปรียบกับครั้งต่อไป','test ที่เร็วที่สุด','API test'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'CI/CD & Deployment', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'CI/CD ย่อมาจากอะไร?', options: ['Code Integration / Code Deployment','Continuous Integration / Continuous Deployment','Code Inspection / Code Delivery','Container Integration / Container Deployment'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '# .github/workflows/test.yml\non: [__]\njobs:\n  test:\n    runs-on: ubuntu-latest', options: ['push','commit','merge','deploy'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'GitHub Actions ใช้ทำอะไร?', options: ['host code','automate build/test/deploy เมื่อ push','สร้าง PR','review code'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Vercel เหมาะกับโปรเจกต์แบบไหน?', options: ['เฉพาะ Node.js','Frontend/JAMstack, Next.js, static sites','เฉพาะ database','เฉพาะ Docker'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '# Dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\n__ ["node","index.js"]', options: ['CMD','RUN','EXEC','START'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Environment variables ใน production ควรเก็บอย่างไร?', options: ['hardcode ใน .js','ใส่ใน .env ไฟล์ที่ gitignore และ platform secrets','ใน README','ใน package.json'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ platform กับการใช้งาน', pairs: [['Vercel','Next.js / frontend'],['Railway','Node.js backend + DB'],['Cloudflare Workers','edge serverless'],['Docker','containerized app']] } },
            { type: 'multiple_choice', data: { prompt: 'Zero-downtime deployment ทำได้โดย?', options: ['ปิด server แล้วเปิดใหม่','rolling update, blue-green, canary deployment','อัปเดตตรงๆ','ใช้ cache'], correct_index: 1 } },
          ]
        },
      ]
    },

  ]
};
