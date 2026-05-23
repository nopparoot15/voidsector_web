'use strict';

module.exports = {
  code: 'py',
  name: 'Python',
  native_name: 'Python',
  flag: '🐍',
  vocab: [],
  units: [

    // ══════════════════════════ BEGINNER ══════════════════════════════

    {
      order_num: 10,
      title: 'Variables & Data Types',
      description: 'ตัวแปรและชนิดข้อมูลพื้นฐานใน Python',
      icon: '📦',
      level: 'Beginner',
      grammar_note: `ตัวแปร (Variables):
• ตั้งชื่อตัวแปรแล้วใช้ = เพื่อกำหนดค่า: x = 10
• ไม่ต้องประกาศชนิดล่วงหน้า Python รู้เองอัตโนมัติ
• ชื่อตัวแปรใช้ตัวอักษร ตัวเลข และ _ (ห้ามขึ้นต้นด้วยตัวเลข)

ชนิดข้อมูลพื้นฐาน:
• int — จำนวนเต็ม: x = 42
• float — ทศนิยม: pi = 3.14
• str — ข้อความ: name = "Alice"
• bool — ค่าความจริง: is_ok = True / False

ตรวจชนิดข้อมูล:
• type(x) คืนชนิดของตัวแปร เช่น type(42) → <class 'int'>
• isinstance(x, int) คืน True/False`,
      lessons: [
        {
          order_num: 1, title: 'ตัวแปรและการกำหนดค่า', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ผลลัพธ์ของ type(42) คืออะไร?', options: ["<class 'int'>","<class 'str'>","<class 'float'>","<class 'bool'>"], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'x = __ กำหนดค่าจำนวนเต็ม 10 ให้ x', options: ['10','10.0','"10"','True'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ชื่อตัวแปรใดถูกต้อง?', options: ['2name','my_name','my-name','class'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ค่ากับชนิดข้อมูล', pairs: [['42','int'],['3.14','float'],['"hello"','str'],['True','bool']] } },
            { type: 'multiple_choice', data: { prompt: 'x = 5  x = x + 1  x มีค่าเท่าไร?', options: ['4','5','6','11'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'name = __  # กำหนดข้อความ "Alice"', options: ['"Alice"','Alice','(Alice)','{Alice}'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'isinstance(3.14, float) ได้ผลอะไร?', options: ['False','True','None','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Python เป็น dynamically typed หมายความว่า?', options: ['ต้องประกาศชนิดก่อนใช้','ชนิดข้อมูลเปลี่ยนได้ตอน runtime','ตัวแปรลบไม่ได้','ค่าตัวแปรไม่เปลี่ยน'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'String และ Number Operations', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '"Hello" + " " + "World" ได้ผลอะไร?', options: ['"HelloWorld"','"Hello World"','Error','None'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '"Ha" * __ จะได้ "HaHaHa"', options: ['2','3','4','6'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'int("42") ได้ผลอะไร?', options: ['"42"','42.0','42','Error'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '10 / 3 ใน Python 3 ได้ผลอะไร?', options: ['3','3.3333...','3.0','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '10 // 3 = __  # Floor division', options: ['3','3.3','4','3.0'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '10 % 3 ได้ผลอะไร?', options: ['0','1','2','3'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ operator กับความหมาย', pairs: [['**','ยกกำลัง'],['//','หารปัดลง'],['%','เศษจากการหาร'],['+=','บวกแล้วกำหนดค่า']] } },
            { type: 'multiple_choice', data: { prompt: 'str(100) ได้ผลอะไร?', options: ['100','"100"','1,0,0','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Boolean และ None', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'True and False ได้ผลอะไร?', options: ['True','False','None','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'True or False ได้ผลอะไร?', options: ['True','False','None','Error'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'not True = __', options: ['True','False','None','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'bool(0) ได้ผลอะไร?', options: ['True','False','0','None'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'bool("") ได้ผลอะไร?', options: ['True','False','""','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ค่ากับ bool ที่ได้', pairs: [['0','False'],['""','False'],['[]','False'],['1','True']] } },
            { type: 'fill_blank', data: { sentence: 'x = None  # None หมายถึง__', options: ['ค่าว่าง/ไม่มีค่า','False','0','""'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x = None  x is None ได้ผลอะไร?', options: ['False','True','None','Error'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 20,
      title: 'Input & Output',
      description: 'รับและแสดงผลข้อมูล',
      icon: '🖨️',
      level: 'Beginner',
      grammar_note: `print() — แสดงผล:
• print("Hello") → แสดง Hello
• print(x, y) → แสดงหลายค่าคั่นด้วย space
• print(f"ค่า x = {x}") → f-string แทรกตัวแปรใน string
• print("a", "b", sep="-") → กำหนดตัวคั่น: a-b
• print("x", end="") → ไม่ขึ้นบรรทัดใหม่

input() — รับข้อมูล:
• name = input("ชื่อ: ") → รับข้อมูลเป็น str เสมอ
• age = int(input("อายุ: ")) → แปลงเป็น int ก่อนใช้

f-string (formatted string):
• f"สวัสดี {name}" → แทรกตัวแปร name
• f"{3.14:.2f}" → กำหนดทศนิยม 2 ตำแหน่ง
• f"{100:,}" → แสดงเลขพร้อม comma`,
      lessons: [
        {
          order_num: 1, title: 'print() พื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'print("Hello", "World") แสดงผลอะไร?', options: ['HelloWorld','Hello World','Hello,World','Hello\nWorld'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'print("a", "b", sep=__) แสดง a-b', options: ['"-"','","','None','""'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'print("Hi", end="!") แสดงผลอะไร?', options: ['Hi','Hi!','Hi\n!','!Hi'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'x=5  print(f"x={x}") แสดงผลอะไร?', options: ['x={x}','x=x','x=5','f"x=5"'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'f"{3.14159:.2f}" ได้ผล __', options: ['"3.14"','3.14159','3.1','3'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'print() ไม่ใส่ argument แสดงอะไร?', options: ['None','Error','บรรทัดว่าง','0'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ f-string กับผลลัพธ์', pairs: [['{2+3}','5'],['{10/4:.1f}','2.5'],['{True}','True'],['{len("hi")}','2']] } },
            { type: 'multiple_choice', data: { prompt: 'f"{100:,}" ได้ผลอะไร?', options: ['"100"','"100,"','"1,00"','"100" ไม่มีผล'], correct_index: 0 } },
          ]
        },
        {
          order_num: 2, title: 'input() และการแปลงชนิด', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'input() คืนค่าชนิดอะไรเสมอ?', options: ['int','float','str','ขึ้นกับที่พิมพ์'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'age = __(input("อายุ: "))  # แปลงเป็นจำนวนเต็ม', options: ['int','str','float','bool'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x = int(input())  ผู้ใช้พิมพ์ "abc" จะเกิดอะไร?', options: ['x = 0','x = "abc"','ValueError','x = None'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'x = float(input())  ผู้ใช้พิมพ์ "3.14"  x มีค่าเท่าไร?', options: ['"3.14"','3','3.14','314'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'a, b = input().split()  # รับ 2 ค่าพร้อมกัน คั่นด้วย __', options: ['space (ค่าเริ่มต้น)','","','"-"','"|"'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'a,b=input().split() ผู้ใช้พิมพ์ "5 10"  a,b มีค่าอะไร?', options: ['5 และ 10 (int)','5 และ 10 (str)','[5,10]','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชันแปลงชนิด', pairs: [['int("5")','5'],['float("3.14")','3.14'],['str(42)','"42"'],['bool(1)','True']] } },
            { type: 'multiple_choice', data: { prompt: 'x = input("Enter: ")  prompt "Enter: " ทำหน้าที่อะไร?', options: ['ค่า default','แสดงข้อความก่อนรับ input','ชื่อตัวแปร','ไม่มีประโยชน์'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'String Formatting', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '"Hello %s" % "World" ได้ผลอะไร?', options: ['"Hello %s"','"Hello World"','"Hello %World"','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '"{}+{}={}".format(1,2,__) ได้ "1+2=3"', options: ['3','4','1+2','sum'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'f"{\'hello\'.upper()}" ได้ผลอะไร?', options: ['"hello"','"HELLO"','"Hello"','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'len("Python") ได้ผลอะไร?', options: ['5','6','7','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '"hello"[0] = __', options: ['"h"','"e"','"hello"','Error'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '"hello"[-1] ได้ผลอะไร?', options: ['"h"','"e"','"o"','Error'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ string method กับผลลัพธ์', pairs: [['"hi".upper()','HI'],['"HI".lower()','hi'],['"  hi  ".strip()','hi'],['"a,b".split(",")','["a","b"]']] } },
            { type: 'multiple_choice', data: { prompt: '"Python"[1:4] ได้ผลอะไร?', options: ['"Pyt"','"yth"','"ytho"','"ython"'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 30,
      title: 'Conditionals (if/elif/else)',
      description: 'เงื่อนไขและการตัดสินใจ',
      icon: '🔀',
      level: 'Beginner',
      grammar_note: `if / elif / else:
• if condition:  # ถ้าเงื่อนไขเป็น True ทำบล็อกนี้
•     body
• elif condition:  # ถ้าไม่ใช่ข้างบน แต่เงื่อนไขนี้ True
• else:  # กรณีที่ไม่ตรงทั้งหมด

Comparison operators:
• == เท่ากับ  != ไม่เท่ากับ
• < น้อยกว่า  > มากกว่า  <= ≤  >= ≥

Logical operators:
• and — ทั้งคู่จริง  or — อย่างใดอย่างหนึ่งจริง  not — กลับค่า

Ternary (one-line):
• x = "pass" if score >= 50 else "fail"

Indentation สำคัญมาก:
• Python ใช้ย่อหน้า (4 spaces) แทนปีกกา {}`,
      lessons: [
        {
          order_num: 1, title: 'if/else พื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x=10  if x>5: print("big")  แสดงผลอะไร?', options: ['ไม่แสดงอะไร','big','5','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if x == 0:\n    print("zero")\n__:\n    print("not zero")', options: ['else','elif','except','default'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x=3  if x%2==0: print("even") else: print("odd")  แสดงอะไร?', options: ['even','odd','0','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Indentation ใน Python หมายถึงอะไร?', options: ['สวยงาม','กำหนด block ของโค้ด','เหมือน comment','ไม่มีผล'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'x = "A" if score >= 80 __ "B"  # ternary', options: ['else','or','and','elif'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x=5  if x>3 and x<10: print("yes")  แสดงอะไร?', options: ['ไม่แสดง','yes','no','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ operator กับความหมาย', pairs: [['==','เท่ากับ'],['!=','ไม่เท่ากับ'],['>=','มากกว่าหรือเท่า'],['not','กลับค่า bool']] } },
            { type: 'multiple_choice', data: { prompt: 'if 0: print("yes") else: print("no")  แสดงอะไร?', options: ['yes','no','0','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'elif และเงื่อนไขซ้อน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'score=75  if s>=90:"A" elif s>=70:"B" else:"C"  ได้ผลอะไร?', options: ['A','B','C','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if x > 0:\n    if x > 100:\n        print("big")\n    __:\n        print("small")', options: ['else','elif','or','and'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x=5  if x>0 or x<-10: print("yes")  แสดงอะไร?', options: ['ไม่แสดง','yes','False','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'จะมี elif ได้กี่ตัวใน if block เดียว?', options: ['แค่ 1','แค่ 2','ไม่จำกัด','ต้องมี else ก่อน'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ค่ากับผลของ bool()', pairs: [['[]','False'],['[0]','True'],['None','False'],['"0"','True']] } },
            { type: 'fill_blank', data: { sentence: 'x=5  print("pos" if x>0 else __)', options: ['"neg"','"zero"','False','None'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'if not False: print("ok")  แสดงอะไร?', options: ['ไม่แสดง','ok','False','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '"a" in "apple" ได้ผลอะไร?', options: ['False','True','"a"','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Match/Case (Python 3.10+)', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'match/case คล้ายกับอะไรในภาษาอื่น?', options: ['if/else','for loop','try/except','switch/case'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: 'match command:\n    case "quit":\n        exit()\n    case __:\n        print("unknown")', options: ['_','else','*','default'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'case _ ใน match/case หมายถึงอะไร?', options: ['ตัวแปรชื่อ _','default กรณีที่ไม่ตรง','error','skip'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'match x:\n  case 1|2: print("low")  หมายความว่า?', options: ['x==1 หรือ x==2','x==1 และ x==2','bitwise OR','Error'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'match point:\n    case (0, 0):\n        print(__)', options: ['"origin"','"point"','(0,0)','None'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'match/case ใช้ได้ใน Python version ใดขึ้นไป?', options: ['3.8','3.9','3.10','3.11'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ statement กับความหมาย', pairs: [['if/elif/else','เงื่อนไขทั่วไป'],['match/case','pattern matching'],['while','วนซ้ำตามเงื่อนไข'],['for','วนซ้ำตามลำดับ']] } },
            { type: 'multiple_choice', data: { prompt: 'match color:\n  case "red"|"blue": print("cool")  x="blue" แสดงอะไร?', options: ['ไม่แสดง','cool','blue','Error'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 40,
      title: 'Loops (for & while)',
      description: 'การวนซ้ำด้วย for และ while',
      icon: '🔁',
      level: 'Beginner',
      grammar_note: `for loop:
• for i in range(5): → วน 0,1,2,3,4
• for item in list: → วนผ่านแต่ละสมาชิกใน list
• for i, v in enumerate(lst): → ได้ทั้ง index และค่า

range():
• range(n) → 0 ถึง n-1
• range(a, b) → a ถึง b-1
• range(a, b, step) → a ถึง b-1 เพิ่มทีละ step

while loop:
• while condition: → วนจนกว่าเงื่อนไขเป็น False

break / continue / else:
• break → ออกจาก loop ทันที
• continue → ข้ามไปรอบต่อไป
• else: ในลูป → ทำงานเมื่อลูปจบปกติ (ไม่ถูก break)`,
      lessons: [
        {
          order_num: 1, title: 'for loop และ range()', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'range(5) สร้างตัวเลข?', options: ['1,2,3,4,5','0,1,2,3,4','0,1,2,3,4,5','1,2,3,4'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for i in range(__, 10, 2):  # 2,4,6,8', options: ['2','1','0','3'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'for i in "abc": print(i)  แสดงอะไร?', options: ['abc','a b c','a\\nb\\nc','["a","b","c"]'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'sum([1,2,3,4,5]) ได้ผลอะไร?', options: ['10','15','12','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for i, v in __(["a","b","c"]):', options: ['enumerate','zip','range','list'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'len(range(3, 10, 2)) ได้ผลอะไร?', options: ['3','4','5','7'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ range กับตัวเลขที่ได้', pairs: [['range(3)','0,1,2'],['range(1,4)','1,2,3'],['range(0,6,2)','0,2,4'],['range(5,0,-1)','5,4,3,2,1']] } },
            { type: 'multiple_choice', data: { prompt: 'for _ in range(3): print("hi")  แสดง "hi" กี่ครั้ง?', options: ['1','2','3','4'], correct_index: 2 } },
          ]
        },
        {
          order_num: 2, title: 'while, break, continue', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x=0  while x<3: x+=1  x มีค่าเท่าไรหลังลูป?', options: ['0','2','3','4'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'while True:\n    if x>10: __\n    x+=1', options: ['break','continue','return','exit'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'continue ทำอะไรใน loop?', options: ['ออกจาก loop','ข้ามไปรอบต่อไป','หยุดโปรแกรม','คืนค่า None'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'for i in range(5):\n  if i==3: break\n  print(i)  แสดงอะไร?', options: ['0 1 2 3','0 1 2','1 2 3','0 1 2 3 4'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for i in range(5):\n    if i%2==0: __\n    print(i)  # แสดงแค่คี่', options: ['continue','break','pass','skip'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Infinite loop คืออะไร?', options: ['loop ที่วนครั้งเดียว','loop ที่ไม่มีวันหยุด','loop ใน loop','loop เปล่า'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ keyword กับการทำงาน', pairs: [['break','ออกจาก loop ทันที'],['continue','ข้ามรอบนี้'],['pass','ไม่ทำอะไร (placeholder)'],['return','คืนค่าจากฟังก์ชัน']] } },
            { type: 'multiple_choice', data: { prompt: 'while loop ต่างจาก for loop อย่างไร?', options: ['while เร็วกว่า','while วนตามเงื่อนไข ไม่ใช่ลำดับ','while ใช้กับ list ไม่ได้','ไม่ต่าง'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Nested Loops และ List Comprehension เบื้องต้น', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'for i in range(2):\n  for j in range(2):\n    print(i,j)  วนกี่รอบรวม?', options: ['2','3','4','6'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '[x**2 for x in range(4)] = __', options: ['[0,1,4,9]','[1,4,9,16]','[0,1,2,3]','[1,2,3,4]'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[x for x in range(10) if x%2==0] ได้ผลอะไร?', options: ['[1,3,5,7,9]','[0,2,4,6,8]','[0,2,4,6,8,10]','[2,4,6,8,10]'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'List comprehension ดีกว่า for loop ธรรมดาเพราะ?', options: ['เร็วกว่าเสมอ','กระชับกว่า อ่านง่ายกว่า','ใช้ RAM น้อยกว่า','debug ง่ายกว่า'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[str(x) for x in [1,2,3]] = __', options: ['["1","2","3"]','[1,2,3]','["123"]','Error'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'sum([i for i in range(1,5)]) ได้ผลอะไร?', options: ['6','10','15','4'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โครงสร้าง', pairs: [['[expr for x in iter]','list comprehension'],['[expr for x in iter if cond]','filtered comprehension'],['{k:v for k,v in dict}','dict comprehension'],['(expr for x in iter)','generator expression']] } },
            { type: 'multiple_choice', data: { prompt: 'len([x for x in range(100) if x%3==0]) ได้ผลอะไร?', options: ['33','34','32','99'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 50,
      title: 'Lists & Tuples',
      description: 'โครงสร้างข้อมูลเบื้องต้น',
      icon: '📋',
      level: 'Beginner',
      grammar_note: `List:
• lst = [1, 2, 3] — มีลำดับ เปลี่ยนแปลงได้ (mutable)
• lst[0] → เข้าถึงด้วย index (เริ่มที่ 0)
• lst[-1] → index ลบคือนับจากท้าย
• lst[1:3] → slicing ได้ตำแหน่ง 1 และ 2

List methods สำคัญ:
• append(x) — เพิ่มท้าย
• insert(i, x) — แทรกที่ตำแหน่ง i
• remove(x) — ลบค่าแรกที่พบ
• pop(i) — ลบและคืนค่าที่ตำแหน่ง i
• sort() — เรียงลำดับ (in-place)
• len(lst) — จำนวนสมาชิก

Tuple:
• t = (1, 2, 3) — เปลี่ยนแปลงไม่ได้ (immutable)
• ใช้สำหรับข้อมูลที่ไม่ควรเปลี่ยน เช่น พิกัด RGB`,
      lessons: [
        {
          order_num: 1, title: 'List พื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'lst=[10,20,30]  lst[1] มีค่าเท่าไร?', options: ['10','20','30','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'lst=[1,2,3]  lst.__(4)  lst=[1,2,3,4]', options: ['append','add','push','insert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'lst=[1,2,3]  lst.pop() ได้ผลอะไร?', options: ['1','2','3','None'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '[1,2,3]+[4,5] ได้ผลอะไร?', options: ['[1,2,3,4,5]','[5,7]','Error','[1,2,3,[4,5]]'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'lst=[5,2,8,1]  lst.__()  # เรียงน้อยไปมาก', options: ['sort','sorted','order','arrange'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '"a" in ["a","b","c"] ได้ผลอะไร?', options: ['0','True','False','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['append(x)','เพิ่มท้าย'],['remove(x)','ลบค่าแรก'],['index(x)','หาตำแหน่ง'],['count(x)','นับจำนวน']] } },
            { type: 'multiple_choice', data: { prompt: 'lst=[1,2,3,4,5]  lst[1:4] ได้ผลอะไร?', options: ['[1,2,3]','[2,3,4]','[2,3,4,5]','[1,2,3,4]'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Tuple และ Unpacking', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Tuple ต่างจาก List อย่างไร?', options: ['Tuple เร็วกว่า','Tuple เปลี่ยนค่าไม่ได้','Tuple ใส่ได้แค่ตัวเลข','ไม่ต่าง'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 't = (1, 2, 3)  a, b, c = __  # unpacking', options: ['t','*t','list(t)','range(3)'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 't=(1,2,3)  t[0]=10 จะเกิดอะไร?', options: ['t=(10,2,3)','TypeError','OK','None'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'a,b = 1,2  a,b = b,a  a มีค่าเท่าไร?', options: ['1','2','Error','None'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'x, *rest = [1,2,3,4]  rest = __', options: ['[2,3,4]','[1,2,3]','(2,3,4)','Error'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Tuple ของ 1 สมาชิกเขียนอย่างไร?', options: ['(1)','[1]','(1,)','{1}'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ชนิดข้อมูลกับสัญลักษณ์', pairs: [['list','[ ]'],['tuple','( )'],['dict','{ : }'],['set','{ }']] } },
            { type: 'multiple_choice', data: { prompt: 'list((1,2,3)) ได้ผลอะไร?', options: ['(1,2,3)','[1,2,3]','{1,2,3}','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Slicing และ List Operations', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'lst=[0,1,2,3,4]  lst[::-1] ได้ผลอะไร?', options: ['[0,1,2,3,4]','[4,3,2,1,0]','[4,3,2]','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'lst=[1,2,3]  lst2=lst.__()  # copy แบบ shallow', options: ['copy','clone','duplicate','list'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'sorted([3,1,2], reverse=True) ได้ผลอะไร?', options: ['[1,2,3]','[3,2,1]','[3,1,2]','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'max([5,3,9,1]) ได้ผลอะไร?', options: ['1','3','5','9'], correct_index: 3 } },
            { type: 'fill_blank', data: { sentence: '",".join(["a","b","c"]) = __', options: ['"a,b,c"','"abc"','["a,b,c"]','Error'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'lst=[1,2,3]  lst*2 ได้ผลอะไร?', options: ['[2,4,6]','[1,2,3,1,2,3]','[1,2,3,2]','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชันกับการทำงาน', pairs: [['len()','จำนวนสมาชิก'],['sum()','ผลรวม'],['min()','ค่าน้อยสุด'],['max()','ค่ามากสุด']] } },
            { type: 'multiple_choice', data: { prompt: 'any([0,0,1]) ได้ผลอะไร?', options: ['False','True','1','Error'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ══════════════════════════ INTERMEDIATE ══════════════════════════

    {
      order_num: 60,
      title: 'Functions',
      description: 'การเขียนฟังก์ชัน parameters และ return',
      icon: '⚙️',
      level: 'Intermediate',
      grammar_note: `ฟังก์ชัน (Functions):
• def func_name(params): → นิยามฟังก์ชัน
• return value → คืนค่า (ถ้าไม่มี return คืน None)
• ฟังก์ชันเรียกซ้ำได้และส่งไปเป็น argument ได้

Parameters:
• positional: def f(a, b)
• default: def f(a, b=10) → ถ้าไม่ส่ง b ใช้ค่า 10
• *args: รับ argument ไม่จำกัดจำนวนเป็น tuple
• **kwargs: รับ keyword argument เป็น dict

Scope (ขอบเขตตัวแปร):
• Local scope — ตัวแปรในฟังก์ชัน
• Global scope — ตัวแปรนอกฟังก์ชัน
• global keyword — ใช้เมื่อต้องการแก้ global var ใน function`,
      lessons: [
        {
          order_num: 1, title: 'def และ return', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'def add(a,b): return a+b  add(3,4) ได้ผลอะไร?', options: ['34','7','ab','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def greet(name="World"):\n    __ f"Hello {name}"', options: ['return','print','yield','pass'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ฟังก์ชันที่ไม่มี return statement คืนค่าอะไร?', options: ['0','""','None','Error'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'def f(*args): return sum(args)  f(1,2,3,4) ได้ผลอะไร?', options: ['[1,2,3,4]','10','(1,2,3,4)','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def info(**__):  # รับ keyword args เป็น dict', options: ['kwargs','args','kw','dict'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'def f(a, b=5, c=10): return a+b+c  f(1) ได้ผลอะไร?', options: ['1','6','16','Error'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ parameter type กับรูปแบบ', pairs: [['positional','def f(a, b)'],['default','def f(a=1)'],['*args','def f(*args)'],['**kwargs','def f(**kw)']] } },
            { type: 'multiple_choice', data: { prompt: 'def f(a, /, b): pass  / หมายความว่าอะไร?', options: ['ก่อน / ต้องเป็น positional only','ก่อน / ต้องเป็น keyword only','เลขหาร','Error'], correct_index: 0 } },
          ]
        },
        {
          order_num: 2, title: 'Scope และ Lambda', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'x=10  def f(): x=20  f()  print(x)  แสดงอะไร?', options: ['10','20','None','Error'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'x=0\ndef inc():\n    __ x\n    x+=1', options: ['global','local','nonlocal','import'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'lambda x: x*2  ใช้แบบไหน?', options: ['f = lambda x: x*2  แล้วเรียก f(5)','lambda เรียกไม่ได้','ต้อง def ก่อน','ใช้แค่กับ print'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'sorted(lst, key=lambda x: x[1])  key=... ทำหน้าที่อะไร?', options: ['กำหนดการเปรียบเทียบ','เรียงแบบ reverse','เลือก index','Error'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'double = lambda x: __\ndouble(5) = 10', options: ['x*2','x+x','2*x','x**2'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'nonlocal ใช้เมื่อไร?', options: ['เข้าถึง global var','เข้าถึง var ของ outer function','สร้างตัวแปรใหม่','ลบตัวแปร'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชัน higher-order กับการทำงาน', pairs: [['map(f,lst)','apply f ทุก element'],['filter(f,lst)','เก็บ element ที่ f คืน True'],['reduce(f,lst)','สะสมเป็นค่าเดียว'],['sorted(lst,key=f)','เรียงด้วยฟังก์ชัน']] } },
            { type: 'multiple_choice', data: { prompt: 'list(map(lambda x:x**2, [1,2,3])) ได้ผลอะไร?', options: ['[1,2,3]','[1,4,9]','[2,4,6]','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Recursion', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Recursion คืออะไร?', options: ['loop ใน loop','ฟังก์ชันที่เรียกตัวเอง','import ซ้ำ','class ใน class'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def fact(n):\n    if n<=1: return 1\n    return n * fact(__)', options: ['n-1','n+1','n','1'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'fact(5) = ?  (factorial)', options: ['25','100','120','Error'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'Base case ในฟังก์ชัน recursive คืออะไร?', options: ['กรณีที่วนซ้ำ','เงื่อนไขหยุด recursion','parameter แรก','return value'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def fib(n):\n    if n<=1: return n\n    return fib(n-1) + fib(__)', options: ['n-2','n+1','n','2'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ถ้า recursion ไม่มี base case จะเกิดอะไร?', options: ['คืน None','RecursionError','return 0','ทำงานถูกต้อง'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่แนวคิด recursion', pairs: [['base case','เงื่อนไขหยุด'],['recursive case','เรียกตัวเองกับ input เล็กลง'],['stack overflow','depth ลึกเกิน'],['memoization','cache ผลเพื่อความเร็ว']] } },
            { type: 'multiple_choice', data: { prompt: 'def f(n): return n if n<=0 else f(n-1)+1  f(3) = ?', options: ['0','1','2','3'], correct_index: 3 } },
          ]
        },
      ]
    },

    {
      order_num: 70,
      title: 'Dictionaries & Sets',
      description: 'โครงสร้างข้อมูล dict และ set',
      icon: '🗂️',
      level: 'Intermediate',
      grammar_note: `Dictionary:
• d = {"key": value, ...} — เก็บข้อมูลแบบ key-value
• d["key"] → เข้าถึงค่า (KeyError ถ้าไม่มี key)
• d.get("key", default) → ไม่ raise error ถ้าไม่มี
• d.keys(), d.values(), d.items() → ดู keys/values/pairs

Dict methods:
• update(other_dict) — รวม dict
• pop(key) — ลบและคืนค่า
• setdefault(key, val) — set ถ้าไม่มี key นั้น

Set:
• s = {1, 2, 3} — ไม่มีซ้ำ ไม่มีลำดับ
• union: s1 | s2  intersection: s1 & s2
• difference: s1 - s2  symmetric: s1 ^ s2
• s.add(x)  s.discard(x)`,
      lessons: [
        {
          order_num: 1, title: 'Dictionary พื้นฐาน', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'd={"a":1,"b":2}  d["b"] มีค่าเท่าไร?', options: ['1','2','"b"','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'd={}  d["x"] = 10  # เพิ่ม key "__" ค่า 10', options: ['x','10','"x"','None'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'd={"a":1}  d.get("z", 0) ได้ผลอะไร?', options: ['None','KeyError','0','z'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'd={"a":1,"b":2}  list(d.keys()) ได้ผลอะไร?', options: ['[1,2]','["a","b"]','[("a",1),("b",2)]','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'for k, v in d.__().__:\n    print(k, v)', options: ['items','keys/values','pairs','entries'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '"a" in {"a":1,"b":2} ได้ผลอะไร?', options: ['1','True','False','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ dict method กับการทำงาน', pairs: [['d.get(k,v)','คืนค่าหรือ default'],['d.pop(k)','ลบและคืนค่า'],['d.update(d2)','รวม dict'],['d.items()','คืน key-value pairs']] } },
            { type: 'multiple_choice', data: { prompt: '{k:v for k,v in [("a",1),("b",2)]} ได้ผลอะไร?', options: ['{"a":1,"b":2}','[("a",1),("b",2)]','{"a","b"}','Error'], correct_index: 0 } },
          ]
        },
        {
          order_num: 2, title: 'Set Operations', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '{1,2,2,3,3} ได้ผลอะไร?', options: ['{1,2,2,3,3}','{1,2,3}','[1,2,3]','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '{1,2,3} __ {2,3,4} = {2,3}  # intersection', options: ['&','|','-','^'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '{1,2,3} | {3,4,5} ได้ผลอะไร?', options: ['{3}','{1,2,4,5}','{1,2,3,4,5}','Error'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: '{1,2,3} - {2,3} ได้ผลอะไร?', options: ['{1}','{2,3}','{1,2,3}','{4,5}'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 's = {1,2,3}  s.__(4)  # เพิ่มสมาชิก', options: ['add','append','push','insert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Set ต่างจาก List อย่างไร?', options: ['Set เปลี่ยนไม่ได้','Set ไม่มีซ้ำและไม่มีลำดับ','Set index ได้','ไม่ต่าง'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ set operation', pairs: [['A | B','union'],['A & B','intersection'],['A - B','difference'],['A ^ B','symmetric difference']] } },
            { type: 'multiple_choice', data: { prompt: 'frozenset([1,2,3]) ต่างจาก set อย่างไร?', options: ['เร็วกว่า','เปลี่ยนแปลงไม่ได้','เก็บตัวเลขเท่านั้น','ไม่ต่าง'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Nested Data Structures', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'd={"a":[1,2,3]}  d["a"][1] มีค่าเท่าไร?', options: ['1','2','3','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'data=[{"name":"A"},{"name":"B"}]\ndata[1].__  # ได้ "B"', options: ['["name"]','name','get(name)','["B"]'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'deepcopy vs copy ต่างกันอย่างไร?', options: ['ไม่ต่าง','deepcopy copy nested objects ด้วย','deepcopy เร็วกว่า','copy ไม่มีใน Python'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'lst=[[1,2],[3,4]]  lst[0][1] มีค่าเท่าไร?', options: ['1','2','3','4'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'grades = {"Alice": [90,85,92]}\navg = __(grades["Alice"])/len(grades["Alice"])', options: ['sum','max','min','list'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'JSON ใน Python แปลงเป็นอะไร?', options: ['tuple','dict / list','set','class'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โครงสร้างกับการใช้งาน', pairs: [['list of dicts','ตาราง/records'],['dict of lists','grouping'],['dict of dicts','nested config'],['list of tuples','pairs/rows']] } },
            { type: 'multiple_choice', data: { prompt: 'import json  json.loads(\'{"a":1}\') ได้ผลอะไร?', options: ['\'{"a":1}\'','{"a":1}','["a",1]','Error'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 80,
      title: 'File I/O & Exceptions',
      description: 'อ่านเขียนไฟล์และจัดการ error',
      icon: '📁',
      level: 'Intermediate',
      grammar_note: `File I/O:
• open("file.txt", "r") → เปิดอ่าน
• open("file.txt", "w") → เปิดเขียน (ทับ)
• open("file.txt", "a") → เปิดต่อท้าย
• with open(...) as f: → ปิดไฟล์อัตโนมัติ (แนะนำ)
• f.read() → อ่านทั้งหมด
• f.readlines() → อ่านเป็น list of lines
• f.write(text) → เขียนข้อมูล

Exception Handling:
• try: → โค้ดที่อาจ error
• except ExceptionType as e: → จับ error
• else: → ทำเมื่อ try ไม่ error
• finally: → ทำเสมอไม่ว่าจะ error หรือไม่
• raise → throw error เอง`,
      lessons: [
        {
          order_num: 1, title: 'อ่านเขียนไฟล์', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'open("f.txt","w") เปิดไฟล์โหมดอะไร?', options: ['อ่านอย่างเดียว','เขียน (ทับของเดิม)','ต่อท้าย','อ่านและเขียน'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'with open("f.txt","r") as __:\n    data = f.read()', options: ['f','file','fp','handle'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ทำไมใช้ with open() แทน open()?', options: ['เร็วกว่า','ปิดไฟล์อัตโนมัติ','อ่านได้เยอะกว่า','Error น้อยกว่า'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'f.readlines() คืนค่าชนิดอะไร?', options: ['str','list','tuple','dict'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'open("f.txt","__")  # เปิดต่อท้าย', options: ['a','w','r','x'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'f.write("hello") เขียนอะไรลงไฟล์?', options: ['"hello"','hello','h,e,l,l,o','Error'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โหมดกับการทำงาน', pairs: [['"r"','อ่านอย่างเดียว'],['"w"','เขียน (ทับ)'],['"a"','ต่อท้าย'],['"x"','สร้างใหม่ (error ถ้ามีอยู่แล้ว)']] } },
            { type: 'multiple_choice', data: { prompt: 'encoding="utf-8" ใน open() ทำหน้าที่อะไร?', options: ['บีบอัดไฟล์','กำหนดรูปแบบตัวอักษร','เข้ารหัส password','จำกัดขนาด'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'try/except', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'try: int("abc")\nexcept ValueError: print("error")  แสดงอะไร?', options: ['abc','0','error','ไม่แสดง'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'try:\n    x = 1/0\nexcept __:\n    print("div zero")', options: ['ZeroDivisionError','ValueError','TypeError','Exception'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'finally block ทำงานเมื่อไร?', options: ['เฉพาะเมื่อ error','เฉพาะเมื่อไม่ error','ทุกกรณี','ขึ้นกับ except'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'except Exception as e:  e คืออะไร?', options: ['string ของ error','object ของ exception','class ของ error','None'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'raise __(\'invalid input\')  # ขว้าง error เอง', options: ['ValueError','print','Exception','Error'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'else ใน try/except ทำงานเมื่อไร?', options: ['ทุกกรณี','เมื่อเกิด error','เมื่อ try ไม่เกิด error','หลัง finally'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Exception type กับสาเหตุ', pairs: [['ValueError','ค่าไม่ถูกต้อง'],['TypeError','ชนิดไม่ตรง'],['KeyError','ไม่มี key ใน dict'],['IndexError','index นอกขอบเขต']] } },
            { type: 'multiple_choice', data: { prompt: 'except (TypeError, ValueError): จับกี่ exception?', options: ['1','2','3','ทั้งหมด'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Context Managers และ pathlib', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Context manager ใน Python ใช้ร่วมกับ keyword อะไร?', options: ['try','with','open','import'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from pathlib import Path\np = Path("folder/file.txt")\np.__ # อ่านข้อความ', options: ['read_text()','open()','read()','text()'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Path("a/b/c").suffix ได้ผลอะไร?', options: ['"a"','"c"','""','Error (ถ้าไม่มี extension)'], correct_index: 3 } },
            { type: 'multiple_choice', data: { prompt: 'Path.cwd() คืนค่าอะไร?', options: ['home directory','current working directory','path ของ script','root'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'p = Path("data.txt")\nif p.__().__:\n    data = p.read_text()', options: ['exists()','is_file()','check()','path()'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '__enter__ และ __exit__ เกี่ยวข้องกับอะไร?', options: ['for loop','Context manager protocol','Exception','Class constructor'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ pathlib method', pairs: [['p.read_text()','อ่านไฟล์เป็น str'],['p.write_text(s)','เขียน str ลงไฟล์'],['p.exists()','ตรวจว่ามีไฟล์'],['p.stem','ชื่อไฟล์ไม่มี extension']] } },
            { type: 'multiple_choice', data: { prompt: 'list(Path(".").glob("*.py")) คืนอะไร?', options: ['จำนวน .py files','list ของ Path object ของ .py files','str ของ path','Error'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 90,
      title: 'OOP พื้นฐาน',
      description: 'Class Object Inheritance',
      icon: '🏗️',
      level: 'Intermediate',
      grammar_note: `Class และ Object:
• class MyClass: → นิยาม class
• def __init__(self, ...): → constructor
• self → reference ถึง instance ตัวเอง
• obj = MyClass() → สร้าง instance

Attributes และ Methods:
• instance attribute: self.name = "Alice"
• class attribute: shared ระหว่างทุก instance
• method: ฟังก์ชันใน class (รับ self เสมอ)
• @staticmethod: method ที่ไม่ต้องการ self
• @classmethod: method ที่รับ cls แทน self

Inheritance (การสืบทอด):
• class Dog(Animal): → Dog สืบทอดจาก Animal
• super().__init__() → เรียก constructor ของ parent
• Override: เขียน method ชื่อเดิมใน subclass`,
      lessons: [
        {
          order_num: 1, title: 'Class และ Object', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'class Dog:\n  def bark(self):\n    print("Woof!")\nd=Dog()  d.bark()  แสดงอะไร?', options: ['Dog','bark','Woof!','Error'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'class Cat:\n    def __init__(self, name):\n        __.name = name', options: ['self','cat','this','cls'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '__init__ ทำงานเมื่อไร?', options: ['เรียก method','สร้าง object','ลบ object','import class'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'c=Cat("Tom")  c.name ได้ผลอะไร?', options: ['Cat','"Tom"','Tom','Error'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'class Circle:\n    __ = 3.14  # class attribute', options: ['pi','self.pi','cls.pi','Circle.pi'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '@staticmethod method ต่างจาก method ธรรมดาอย่างไร?', options: ['เร็วกว่า','ไม่รับ self','ใช้กับ class ไม่ได้','return ไม่ได้'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ special method กับการทำงาน', pairs: [['__init__','constructor'],['__str__','แปลงเป็น string'],['__len__','len()'],['__repr__','representation สำหรับ debug']] } },
            { type: 'multiple_choice', data: { prompt: 'isinstance(d, Dog) ได้ผลอะไรเมื่อ d เป็น Dog instance?', options: ['False','True','Dog','Error'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Inheritance', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'class B(A): pass  B สืบทอดอะไรจาก A?', options: ['ไม่มีอะไร','ทุก attribute และ method','เฉพาะ __init__','เฉพาะ method public'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class Dog(Animal):\n    def __init__(self, name):\n        __().__init__(name)', options: ['super()','Animal','self','parent'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Method overriding คืออะไร?', options: ['ลบ method','เขียน method ชื่อเดิมใน subclass','เรียก parent method','เพิ่ม parameter'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Python รองรับ Multiple Inheritance หรือไม่?', options: ['ไม่รองรับ','รองรับ','รองรับแค่ 2 parent','ขึ้นกับ version'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class B(A):\n    def greet(self):\n        return __ + " from B"', options: ['super().greet()','A.greet()','self.greet()','parent.greet()'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'issubclass(Dog, Animal) คืนค่าอะไรเมื่อ Dog สืบทอด Animal?', options: ['False','True','Dog','Animal'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่แนวคิด OOP', pairs: [['Encapsulation','ซ่อน implementation'],['Inheritance','สืบทอด property'],['Polymorphism','ใช้ interface เดียวกันต่างพฤติกรรม'],['Abstraction','ซ่อนรายละเอียด']] } },
            { type: 'multiple_choice', data: { prompt: '_name ใน Python หมายถึงอะไร?', options: ['public','protected (convention)','private','static'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Dunder Methods และ Properties', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'def __str__(self): return "Dog" ทำให้ print(obj) แสดงอะไร?', options: ['<Dog object>','Dog','self','None'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def __len__(self):\n    return __(self.items)  # ให้ len(obj) ทำงาน', options: ['len','sum','count','size'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '@property ทำหน้าที่อะไร?', options: ['สร้าง static method','เข้าถึง attribute เหมือน property','สร้าง class method','ซ่อน method'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'def __add__(self, other): ทำให้ใช้ operator อะไรได้?', options: ['-','*','+','/'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'class T:\n    @property\n    def val(self): return self._val\n    @val.__\n    def val(self, v): self._val = v', options: ['setter','getter','deleter','property'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '__eq__ override ทำให้ใช้ operator อะไรได้?', options: ['!=','<','==','>'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ dunder method กับ operator', pairs: [['__add__','+'],['__mul__','*'],['__lt__','<'],['__contains__','in']] } },
            { type: 'multiple_choice', data: { prompt: 'Dataclass decorator (@dataclass) ช่วยอะไร?', options: ['สร้าง HTML','auto-generate __init__ __repr__ __eq__','เร็วกว่า class ปกติ','ใช้กับ static method'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 100,
      title: 'Modules & Packages',
      description: 'import โมดูลและการจัดโครงสร้างโปรเจกต์',
      icon: '📦',
      level: 'Intermediate',
      grammar_note: `Import:
• import math → import โมดูล ใช้งาน math.sqrt()
• from math import sqrt → import เฉพาะฟังก์ชัน
• from math import * → import ทุกอย่าง (ไม่แนะนำ)
• import numpy as np → alias ย่อชื่อ

Standard Library สำคัญ:
• os — path, directory, env variables
• sys — Python interpreter, argv, path
• json — encode/decode JSON
• re — Regular Expression
• datetime — วันที่และเวลา
• collections — Counter, defaultdict, deque
• itertools — combinations, permutations, chain

__name__ == "__main__":
• ใช้แยกโค้ดที่รันเมื่อ execute ไฟล์โดยตรง
• ไม่รันเมื่อ import`,
      lessons: [
        {
          order_num: 1, title: 'import และ Standard Library', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'import math  math.sqrt(16) ได้ผลอะไร?', options: ['2','4','8','16'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from math __ sqrt, pi  # import เฉพาะฟังก์ชัน', options: ['import','use','get','load'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'import os  os.getcwd() คืนค่าอะไร?', options: ['home dir','current working directory','script path','None'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'import sys  sys.argv[0] คืนค่าอะไร?', options: ['Python version','ชื่อ script ที่รัน','argument แรก','None'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from collections import __\nc = Counter(["a","b","a"])\nc["a"] = 2', options: ['Counter','count','Dict','freq'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'import random  random.randint(1,6) คืนค่าอะไร?', options: ['1.0-6.0','1-6 (float)','1-6 (int)','0-5'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โมดูลกับการใช้งาน', pairs: [['os','ระบบไฟล์/OS'],['json','encode/decode JSON'],['re','Regular Expression'],['datetime','วันที่และเวลา']] } },
            { type: 'multiple_choice', data: { prompt: 'if __name__=="__main__": ทำงานเมื่อไร?', options: ['เมื่อ import','เมื่อ execute ไฟล์โดยตรง','ทุกกรณี','ไม่มีกรณีใด'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'datetime และ re', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'from datetime import datetime  datetime.now() คืนอะไร?', options: ['str ของวันที่','datetime object','timestamp','int'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'import re\nre.__(r"\\d+", "a1b2c3") คืน ["1","2","3"]', options: ['findall','search','match','compile'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 're.match vs re.search ต่างกันอย่างไร?', options: ['ไม่ต่าง','match เริ่มจากต้น string เท่านั้น','search เร็วกว่า','match ใช้กับ multiline'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'r"\\d+" ใน regex หมายความว่า?', options: ['ตัวอักษรใดก็ได้','ตัวเลข 1 ตัวขึ้นไป','ตัวเลข 0 หรือ 1 ตัว','\\d แบบ literal'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'dt = datetime(2024, 1, 15)\ndt.strftime("__") คืน "2024-01-15"', options: ['%Y-%m-%d','%d/%m/%Y','%Y/%m/%d','%m-%d-%Y'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'timedelta(days=7) + datetime.now() คืนอะไร?', options: ['datetime 7 นาทีข้างหน้า','datetime 7 วันข้างหน้า','Error','7'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ regex pattern กับความหมาย', pairs: [['.','อักขระใดก็ได้ (ยกเว้น newline)'],['\\d','ตัวเลข 0-9'],['\\w','ตัวอักษร/เลข/_'],['\\s','whitespace']] } },
            { type: 'multiple_choice', data: { prompt: 're.sub(r"\\s+", " ", "a  b   c") ได้ผลอะไร?', options: ['"a  b   c"','"abc"','"a b c"','Error'], correct_index: 2 } },
          ]
        },
        {
          order_num: 3, title: 'Virtual Environment และ pip', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Virtual environment ใช้ทำอะไร?', options: ['รันโค้ดเร็วขึ้น','แยก package ต่อโปรเจกต์','ซ่อนโค้ด','compile Python'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'python -m __ venv  # สร้าง virtual environment ชื่อ venv', options: ['venv','pip','env','virtualenv'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'pip install requests ทำอะไร?', options: ['อัปเดต Python','ติดตั้ง package ชื่อ requests','สร้างไฟล์','รันสคริปต์'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'requirements.txt ใช้ทำอะไร?', options: ['เก็บโค้ด','list dependencies ของโปรเจกต์','config ระบบ','README'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'pip __ > requirements.txt  # บันทึก packages', options: ['freeze','list','show','save'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '__init__.py ในโฟลเดอร์ทำให้อะไร?', options: ['autorun เมื่อ import','โฟลเดอร์กลายเป็น package','config package','ลบ cache'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำสั่ง pip', pairs: [['pip install X','ติดตั้ง package'],['pip uninstall X','ถอนการติดตั้ง'],['pip list','แสดง packages'],['pip show X','ดูรายละเอียด']] } },
            { type: 'multiple_choice', data: { prompt: 'pyproject.toml ใช้แทนอะไรในโปรเจกต์สมัยใหม่?', options: ['requirements.txt','setup.py','__init__.py','ทั้ง setup.py และ requirements'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ══════════════════════════ ADVANCED ══════════════════════════════

    {
      order_num: 110,
      title: 'Decorators & Generators',
      description: 'decorator, generator และ context manager',
      icon: '🎭',
      level: 'Advanced',
      grammar_note: `Decorator:
• @decorator ใส่เหนือ function definition
• ห่อ function เพื่อเพิ่มพฤติกรรม
• ตัวอย่าง: @staticmethod @classmethod @property @lru_cache

การสร้าง Decorator:
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # ก่อนรัน func
        result = func(*args, **kwargs)
        # หลังรัน func
        return result
    return wrapper

Generator:
• ใช้ yield แทน return
• คืนค่าทีละตัวโดยไม่โหลดทั้งหมดในหน่วยความจำ
• next(gen) หรือ for x in gen: เพื่อดึงค่า
• Generator expression: (x for x in range(n))`,
      lessons: [
        {
          order_num: 1, title: 'Decorator', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '@decorator วาง syntax ไว้ที่ไหน?', options: ['หลัง function','ใน function body','เหนือ function definition','หลัง return'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'def log(func):\n    def wrapper(*args, **kwargs):\n        print("calling")\n        return __(* args, **kwargs)\n    return wrapper', options: ['func','wrapper','log','self'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'functools.wraps(func) ใน decorator ทำหน้าที่อะไร?', options: ['ทำให้ decorator เร็วขึ้น','คัดลอก __name__ __doc__ ของ func','ป้องกัน recursion','ไม่ทำอะไร'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '@lru_cache(maxsize=None) ทำอะไร?', options: ['จำกัด recursion','cache ผลลัพธ์ฟังก์ชัน','log การเรียก','วัดเวลา'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '@timer  # decorator วัดเวลา\ndef slow_func():\n    ...\n\nทำงานเหมือน slow_func = __(slow_func)', options: ['timer','wrapper','decorator','log'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Decorator ที่รับ argument เองต้องมี wrapper กี่ชั้น?', options: ['1','2','3','ขึ้นกับ argument'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ built-in decorator กับการทำงาน', pairs: [['@staticmethod','method ไม่ต้องการ self'],['@classmethod','method รับ cls'],['@property','getter สำหรับ attribute'],['@lru_cache','memoization']] } },
            { type: 'multiple_choice', data: { prompt: 'class decorator ต่างจาก function decorator อย่างไร?', options: ['ไม่ต่าง','class decorator มีสถานะ (state) ได้','function decorator เร็วกว่า','ใช้คนละ syntax'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Generator', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'yield ต่างจาก return อย่างไร?', options: ['yield เร็วกว่า','yield หยุดชั่วคราวและจำ state ไว้','yield ใช้แค่ใน loop','ไม่ต่าง'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def count_up(n):\n    for i in range(n):\n        __ i  # generator', options: ['yield','return','print','give'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'next(gen) ทำอะไร?', options: ['reset generator','ดึงค่าถัดไปจาก generator','หยุด generator','นับ steps'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Generator ดีกว่า list เมื่อ?', options: ['ต้องการความเร็ว','ข้อมูลมากและใช้ทีละตัว','ต้องการ index','ต้องการ sort'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'gen = (x**2 for x in range(5))  # __ expression', options: ['generator','list','tuple','iterator'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'StopIteration เกิดขึ้นเมื่อไร?', options: ['generator มี error','generator หมดค่าแล้ว','memory เต็ม','ใช้ break'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่แนวคิด Generator', pairs: [['yield','ส่งค่าและหยุดชั่วคราว'],['next()','ดึงค่าถัดไป'],['StopIteration','generator หมดค่า'],['send(v)','ส่งค่าเข้า generator']] } },
            { type: 'multiple_choice', data: { prompt: 'list(x for x in range(3)) ได้ผลเหมือน?', options: ['list(range(3))','[x for x in range(3)]','tuple(range(3))','ทั้ง a และ b'], correct_index: 3 } },
          ]
        },
        {
          order_num: 3, title: 'Async/Await เบื้องต้น', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'async def ใช้เพื่ออะไร?', options: ['ทำโค้ดเร็วขึ้น','นิยาม coroutine function','สร้าง thread','import async module'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'async def fetch():\n    __ asyncio.sleep(1)  # รอโดยไม่บล็อก', options: ['await','async','yield','return'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'asyncio.run(main()) ทำอะไร?', options: ['สร้าง thread','รัน coroutine จาก sync code','import asyncio','สร้าง event loop และรัน coroutine'], correct_index: 3 } },
            { type: 'multiple_choice', data: { prompt: 'Concurrent vs Parallel ต่างกันอย่างไร?', options: ['ไม่ต่าง','concurrent สลับงาน parallel รันพร้อมกันจริง','parallel ช้ากว่า','concurrent ใช้ CPU หลายตัว'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'tasks = [fetch(url) for url in urls]\nresults = await asyncio.__(tasks)', options: ['gather','run','wait','collect'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'await ใช้ได้เฉพาะใน?', options: ['ทุกฟังก์ชัน','async function','class method','loop'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่แนวคิด async', pairs: [['coroutine','ฟังก์ชัน async def'],['event loop','ตัวจัดการ coroutine'],['await','รอ coroutine จบ'],['asyncio.gather','รันหลาย coroutine พร้อมกัน']] } },
            { type: 'multiple_choice', data: { prompt: 'aiohttp ใช้ทำอะไร?', options: ['async file I/O','async HTTP requests','async database','async logging'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 120,
      title: 'Type Hints & Testing',
      description: 'type annotation, mypy, pytest',
      icon: '🧪',
      level: 'Advanced',
      grammar_note: `Type Hints (PEP 484):
• def f(x: int) -> str: → ระบุชนิด parameter และ return
• Python ไม่ enforce ตอน runtime แต่ IDE และ mypy ช่วย detect
• from typing import List, Dict, Optional, Union, Tuple

Typing module:
• List[int] → list ของ int
• Dict[str, int] → dict ที่ key เป็น str value เป็น int
• Optional[str] = Union[str, None]
• Union[int, str] → รับได้ทั้งสองชนิด
• Callable[[int], str] → ฟังก์ชันรับ int คืน str

Testing ด้วย pytest:
• ชื่อไฟล์ต้องขึ้นต้นด้วย test_ หรือลงท้าย _test
• ชื่อฟังก์ชัน test ต้องขึ้นต้นด้วย test_
• assert statement ตรวจผลลัพธ์
• pytest.raises() ตรวจ exception`,
      lessons: [
        {
          order_num: 1, title: 'Type Hints', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'def add(a: int, b: int) -> int  annotation บอกอะไร?', options: ['บังคับชนิดตอน runtime','เป็น hint สำหรับ IDE/tools','ทำให้โค้ดเร็วขึ้น','สร้าง validation อัตโนมัติ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from typing import __\ndef f(x: Optional[str]) -> None: ...', options: ['Optional','Union','Any','List'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Optional[str] เทียบเท่ากับ?', options: ['str | None','Union[str]','str or None','List[str]'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'x: list[int] = [] ใช้ได้ใน Python version ใด?', options: ['3.7','3.8','3.9','2.7'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'def greet(names: list[str]) -> __:\n    return " ".join(names)', options: ['str','list','None','Any'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'TypeVar ใช้ทำอะไร?', options: ['สร้างตัวแปรพิเศษ','สร้าง generic type','เปลี่ยนชนิด runtime','import type'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ type annotation', pairs: [['list[int]','list ของ int'],['dict[str,int]','dict key:str val:int'],['tuple[int,str]','tuple 2 ตัว'],['Callable[[int],str]','ฟังก์ชัน']] } },
            { type: 'multiple_choice', data: { prompt: 'mypy ทำหน้าที่อะไร?', options: ['รัน tests','ตรวจ type hints','format โค้ด','บีบอัดโค้ด'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'pytest', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'ชื่อไฟล์ test ใน pytest ต้องเป็นแบบไหน?', options: ['mytest.py','test_xxx.py หรือ xxx_test.py','tests/xxx.py','unittest_xxx.py'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'def test_add():\n    __ add(2, 3) == 5  # ตรวจผลลัพธ์', options: ['assert','check','expect','verify'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'pytest.raises(ValueError) ใช้ทำอะไร?', options: ['สร้าง ValueError','ตรวจว่าโค้ด raise ValueError','ป้องกัน ValueError','ignore ValueError'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '@pytest.fixture ใช้ทำอะไร?', options: ['ทำให้ test เร็วขึ้น','สร้าง reusable test setup','skip test','mark test'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '@pytest.mark.parametrize("x,y", [(1,2),(3,4)])\ndef test_sum(x, y):\n    assert sum([x, y]) == __', options: ['x+y','x*y','x-y','x/y'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'TDD (Test Driven Development) คือ?', options: ['เขียน test หลัง code','เขียน test ก่อน code','ไม่มี test','auto-generate test'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ pytest concept', pairs: [['assert','ตรวจเงื่อนไข'],['fixture','shared setup'],['parametrize','test หลายกรณี'],['mark.skip','ข้าม test']] } },
            { type: 'multiple_choice', data: { prompt: 'coverage.py ทำหน้าที่อะไร?', options: ['รัน test','วัด % โค้ดที่ test ครอบคลุม','format โค้ด','profile performance'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Design Patterns ใน Python', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Singleton pattern คืออะไร?', options: ['class ที่สร้างได้แค่ 1 instance','class ไม่มี attribute','class เปลี่ยนไม่ได้','class ไม่มี method'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Factory pattern ใช้ทำอะไร?', options: ['สร้าง object โดยไม่ระบุ class ตรงๆ','ทำลาย object','copy object','แปลง object'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'class Singleton:\n    _instance = None\n    def __new__(cls):\n        if not cls._instance:\n            cls._instance = __().__new__(cls)\n        return cls._instance', options: ['super()','object','cls','Singleton'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Observer pattern ใช้เมื่อ?', options: ['ต้องการ cache','หลาย object ต้องการรับ event จาก object หนึ่ง','ต้องการ lazy loading','ต้องการ proxy'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Context Manager pattern (with statement) ใช้ทำอะไร?', options: ['manage imports','จัดการ resource อัตโนมัติ','สร้าง singleton','lazy initialization'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class MyCtx:\n    def __enter__(self): return self\n    def __(self, *a): pass  # context manager', options: ['__exit__','__leave__','__close__','__end__'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Design Pattern กับการใช้งาน', pairs: [['Singleton','1 instance ต่อ process'],['Factory','สร้าง object จาก factory'],['Observer','event-driven'],['Strategy','เปลี่ยน algorithm ได้']] } },
            { type: 'multiple_choice', data: { prompt: 'SOLID principle ตัว S ย่อมาจาก?', options: ['Static','Single Responsibility','Strict','String'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 130,
      title: 'Concurrency & Performance',
      description: 'threading, multiprocessing, profiling',
      icon: '⚡',
      level: 'Advanced',
      grammar_note: `Threading vs Multiprocessing:
• GIL (Global Interpreter Lock) จำกัด thread ให้รันได้แค่ครั้งละ 1
• threading — I/O-bound tasks (เครือข่าย ไฟล์)
• multiprocessing — CPU-bound tasks (คำนวณหนัก)

threading module:
• t = threading.Thread(target=func, args=(x,))
• t.start() → เริ่ม thread
• t.join() → รอ thread จบ
• threading.Lock() → ป้องกัน race condition

multiprocessing module:
• p = multiprocessing.Process(target=func)
• Pool.map(func, iterable) → parallel map

concurrent.futures:
• ThreadPoolExecutor → thread pool
• ProcessPoolExecutor → process pool
• executor.submit(fn) → submit งาน
• executor.map(fn, iter) → map แบบ concurrent`,
      lessons: [
        {
          order_num: 1, title: 'Threading', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'GIL ใน Python คืออะไร?', options: ['Garbage Interpreter Lock','Global Interpreter Lock','General Interface Layer','ไม่มีจริง'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Threading เหมาะกับงานประเภทใด?', options: ['CPU-bound เท่านั้น','I/O-bound เช่น network/file','ทุกงาน','งาน GUI เท่านั้น'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 't = threading.Thread(target=func)\nt.__()\nt.join()  # รอจบ', options: ['start','run','begin','execute'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Race condition คืออะไร?', options: ['thread วิ่งเร็วเกินไป','thread แข่งกันเข้าถึง shared data','thread ค้าง','thread ไม่จบ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'lock = threading.Lock()\nwith __:\n    # critical section', options: ['lock','Lock()','threading.lock','mutex'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Daemon thread คืออะไร?', options: ['thread ที่เร็วที่สุด','thread ที่จบอัตโนมัติเมื่อ main thread จบ','thread ที่ run ตลอด','thread ที่มีสิทธิ์สูง'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่แนวคิด threading', pairs: [['Lock','ป้องกัน race condition'],['Semaphore','จำกัดจำนวน concurrent access'],['Event','สัญญาณระหว่าง thread'],['Queue','ส่งข้อมูลระหว่าง thread']] } },
            { type: 'multiple_choice', data: { prompt: 'ThreadPoolExecutor ดีกว่า Thread ตรงๆ เพราะ?', options: ['เร็วกว่า','จัดการ pool thread อัตโนมัติ','ไม่ต้องการ GIL','ใช้ multicore ได้'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Multiprocessing', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Multiprocessing เหมาะกับงานประเภทใด?', options: ['I/O-bound','CPU-bound เช่นคำนวณหนัก','GUI apps','Network requests'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from multiprocessing import Pool\nwith Pool(4) as p:\n    results = p.__(square, range(10))', options: ['map','apply','run','execute'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Multiprocessing ไม่ติด GIL เพราะ?', options: ['ใช้ C extension','แต่ละ process มี Python interpreter ของตัวเอง','ใช้ GPU','ปิด GIL ไว้'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'multiprocessing.Queue() ใช้ทำอะไร?', options: ['จัดลำดับ process','ส่งข้อมูลระหว่าง process','เก็บ log','บันทึกผล'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if __name__ == "__main__":\n    p = Process(target=f)\n    p.__()  # สำคัญมากใน multiprocessing', options: ['start','run','begin','fork'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ProcessPoolExecutor(max_workers=4) หมายความว่า?', options: ['สร้าง 4 thread','สร้าง 4 process pool','จำกัด CPU 4 core','กำหนด timeout 4 วินาที'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เครื่องมือกับการใช้งาน', pairs: [['threading','I/O-bound, shared memory'],['multiprocessing','CPU-bound, separate memory'],['asyncio','I/O-bound, single thread'],['concurrent.futures','high-level pool API']] } },
            { type: 'multiple_choice', data: { prompt: 'Shared memory ระหว่าง process ทำได้โดย?', options: ['ไม่ได้เลย','multiprocessing.Value/Array','global variable','class variable'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Profiling & Optimization', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'cProfile ใช้ทำอะไร?', options: ['compile Python','วัด performance ของโค้ด','check type','format code'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'import timeit\ntimeit.__(\'sum(range(1000))\', number=1000)', options: ['timeit','run','measure','time'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Big O notation O(n²) หมายความว่า?', options: ['เวลาคงที่','เวลาเป็น n²','เวลาเป็น log n','เวลาเป็น n'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'dict lookup O(?) ใน Python?', options: ['O(n)','O(log n)','O(1) average','O(n²)'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '# ใช้ __ แทน list เมื่อต้อง insert/delete หัว/ท้ายบ่อย\nfrom collections import deque', options: ['deque','queue','stack','buffer'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Memory profiling ใช้ library อะไร?', options: ['cProfile','memory_profiler','tracemalloc หรือ memory_profiler','timeit'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่โครงสร้างกับ time complexity', pairs: [['list.append','O(1) amortized'],['list.insert(0,x)','O(n)'],['dict[key]','O(1) average'],['sorted(lst)','O(n log n)']] } },
            { type: 'multiple_choice', data: { prompt: 'Cython/Numba ใช้ทำอะไร?', options: ['debug Python','เร่งความเร็วด้วย compile เป็น C/LLVM','format code','manage packages'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ── Advanced Unit 4: Data Science Libraries ─────────────────────────
    {
      order_num: 140,
      title: 'Data Science: NumPy & Pandas',
      description: 'ไลบรารีสำคัญสำหรับ Data Science และการวิเคราะห์ข้อมูล',
      icon: '📊',
      level: 'Advanced',
      grammar_note: `NumPy — array computing:
• import numpy as np
• np.array([1,2,3]) สร้าง ndarray
• arr.shape, arr.dtype, arr.reshape(2,3)
• Broadcasting: ops ระหว่าง array ต่างขนาดทำได้อัตโนมัติ
• np.zeros(n), np.ones(n), np.arange(start,stop,step), np.linspace

Pandas — DataFrame & Series:
• import pandas as pd
• pd.DataFrame({'col': [1,2,3]}) สร้าง DataFrame
• df['col'] หรือ df[['col1','col2']] เลือก column
• df.loc[idx], df.iloc[0] เข้าถึงแถว
• df.dropna(), df.fillna(val), df.groupby('col').mean()
• df.merge(other, on='key'), pd.read_csv('file.csv')`,
      lessons: [
        {
          order_num: 1, title: 'NumPy Arrays', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'np.array([1,2,3]).shape ได้ผลอะไร?', options: ['3','(3,)','(1,3)','[3]'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'import numpy as __\narr = np.zeros(5)', options: ['np','pd','num','numpy'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'np.arange(0, 10, 2) ได้อะไร?', options: ['[0,2,4,6,8]','[0,2,4,6,8,10]','[1,3,5,7,9]','[2,4,6,8,10]'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Broadcasting ใน NumPy คืออะไร?', options: ['วิธี broadcast message','คำนวณ array ต่างขนาดได้อัตโนมัติ','copy array','debug array'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'arr = np.array([[1,2],[3,4]])\nprint(arr.__(1,4))  # reshape', options: ['reshape','resize','transform','shape'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'np.linspace(0, 1, 5) สร้างอะไร?', options: ['5 จำนวนสุ่ม','5 จำนวน int 0-1','5 จำนวนเท่าๆกันระหว่าง 0 ถึง 1','ช่วงเป็น step 5'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ฟังก์ชัน NumPy', pairs: [['np.zeros(n)','array ศูนย์ทั้งหมด'],['np.ones(n)','array หนึ่งทั้งหมด'],['np.random.rand(n)','array สุ่ม'],['np.sort(arr)','เรียง array']] } },
            { type: 'multiple_choice', data: { prompt: 'arr[arr > 5] ทำอะไร?', options: ['เลือก index > 5','Boolean indexing เลือกค่า > 5','error','เปลี่ยนค่า > 5 เป็น True'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Pandas DataFrame', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'pd.read_csv("data.csv") ทำอะไร?', options: ['สร้าง CSV','อ่าน CSV เป็น DataFrame','บันทึก DataFrame','เปิด Excel'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'df = pd.DataFrame({"a":[1,2],"b":[3,4]})\nprint(df.__("a"))  # เลือก column', options: ["['a']",'loc','iloc','get'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'df.dropna() ทำอะไร?', options: ['ลบ column ว่าง','ลบแถวที่มี NaN','เติมค่า NaN','เปลี่ยนชื่อ column'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'df.groupby("city").mean() ทำอะไร?', options: ['จัดกลุ่มแล้วหาค่าเฉลี่ยในแต่ละกลุ่ม','หาค่าเฉลี่ยทั้ง df','จัดเรียงตาม city','กรอง city'], correct_index: 0 } },
            { type: 'fill_blank', data: { sentence: 'df.__(other_df, on="id")  # รวม DataFrame', options: ['merge','join','concat','combine'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'df.iloc[0] ต่างจาก df.loc[0] อย่างไร?', options: ['ไม่ต่างกัน','iloc ใช้ position number, loc ใช้ index label','iloc เร็วกว่า','loc เฉพาะตัวเลข'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการใช้งาน', pairs: [['df.describe()','สถิติพื้นฐาน'],['df.info()','ชนิดข้อมูลและ memory'],['df.head(n)','n แถวแรก'],['df.value_counts()','นับความถี่']] } },
            { type: 'multiple_choice', data: { prompt: 'df.to_csv("out.csv", index=False) ทำอะไร?', options: ['อ่าน CSV','บันทึก DataFrame เป็น CSV ไม่มีคอลัมน์ index','สร้าง index','เปิด CSV'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Data Visualization', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Matplotlib ใช้สร้างอะไร?', options: ['web app','machine learning model','กราฟและ visualization','database'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'import matplotlib.pyplot as __\nplt.plot([1,2,3],[4,5,6])', options: ['plt','mp','plot','mpl'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'plt.show() ทำอะไร?', options: ['บันทึกรูป','แสดงกราฟ','ล้างกราฟ','สร้างกราฟใหม่'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Seaborn ต่างจาก Matplotlib อย่างไร?', options: ['ไม่ต่างกัน','Seaborn ใช้ง่าย สวยกว่า สร้างบน Matplotlib','Seaborn เร็วกว่า','Seaborn ใช้ JavaScript'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'plt.__(x, y, color="blue", label="data")\nplt.legend()', options: ['plot','draw','line','graph'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'plt.savefig("graph.png") ทำอะไร?', options: ['โหลดรูป','แสดงรูป','บันทึกกราฟเป็นไฟล์','ปิดกราฟ'], correct_index: 2 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ประเภทกราฟ', pairs: [['plt.plot()','line chart'],['plt.bar()','bar chart'],['plt.scatter()','scatter plot'],['plt.hist()','histogram']] } },
            { type: 'multiple_choice', data: { prompt: 'fig, ax = plt.subplots(2,2) สร้างอะไร?', options: ['1 กราฟ','4 กราฟ subplot 2x2','กราฟ 2 ชั้น','กราฟ 2 สี'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ── Advanced Unit 5: Web & APIs ──────────────────────────────────────
    {
      order_num: 150,
      title: 'Web Development & APIs',
      description: 'สร้าง Web App และเชื่อมต่อ API ด้วย Flask และ requests',
      icon: '🌐',
      level: 'Advanced',
      grammar_note: `Flask — micro web framework:
• from flask import Flask, request, jsonify
• app = Flask(__name__)
• @app.route('/path', methods=['GET','POST']) decorator กำหนด endpoint
• return jsonify({'key': val}) ส่ง JSON response
• request.json, request.args.get('key') รับข้อมูลจาก client
• flask run หรือ app.run(debug=True)

Requests — HTTP client:
• import requests
• requests.get(url), requests.post(url, json=data)
• resp.status_code, resp.json(), resp.text
• resp.raise_for_status() raise exception ถ้า HTTP error

FastAPI (modern alternative):
• from fastapi import FastAPI
• async def endpoint() — support async natively
• Pydantic models สำหรับ validation อัตโนมัติ
• Auto-generate Swagger docs ที่ /docs`,
      lessons: [
        {
          order_num: 1, title: 'Flask Basics', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '@app.route("/hello") ทำอะไร?', options: ['import module','กำหนด URL endpoint /hello','เรียก function','สร้าง middleware'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from flask import Flask\napp = __(__name__)', options: ['Flask','App','Server','API'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'jsonify() ใน Flask ใช้ทำอะไร?', options: ['parse JSON','แปลง dict เป็น JSON response','อ่านไฟล์ JSON','validate JSON'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '@app.route("/data", methods=["__"])\ndef get_data():\n    return jsonify({"ok": True})', options: ['GET','HTTP','REQUEST','FETCH'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'request.json ใน Flask คืออะไร?', options: ['ส่ง JSON','รับ JSON body จาก POST request','อ่าน JSON file','สร้าง JSON'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'debug=True ใน app.run() มีผลอย่างไร?', options: ['เร็วขึ้น','reload อัตโนมัติและแสดง error detail','ปิด log','เปิด HTTPS'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ HTTP method กับการใช้งาน', pairs: [['GET','ดึงข้อมูล'],['POST','สร้างข้อมูลใหม่'],['PUT','แก้ไขข้อมูล'],['DELETE','ลบข้อมูล']] } },
            { type: 'multiple_choice', data: { prompt: 'Flask เป็น framework ประเภทใด?', options: ['full-stack','micro framework','CMS','ORM'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'HTTP Requests & APIs', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'requests.get(url).json() ทำอะไร?', options: ['ส่ง POST','GET แล้วแปลง response เป็น dict','บันทึก JSON','validate URL'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'resp = requests.post(url, __={"name": "Alice"})', options: ['json','data','body','payload'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'resp.status_code == 200 หมายความว่า?', options: ['Error','ไม่พบข้อมูล','สำเร็จ OK','Redirect'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'resp.raise_for_status() ทำอะไร?', options: ['เพิ่ม status code','raise exception ถ้า 4xx/5xx','แสดง status','เพิกเฉย error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'headers = {"Authorization": "Bearer token"}\nresp = requests.get(url, __=headers)', options: ['headers','auth','token','params'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'REST API ย่อมาจากอะไร?', options: ['Really Easy Service Transfer','Representational State Transfer','Remote Execution Standard Tool','Request Exchange State Token'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ status code กับความหมาย', pairs: [['200','OK'],['201','Created'],['404','Not Found'],['500','Internal Server Error']] } },
            { type: 'multiple_choice', data: { prompt: 'requests.get(url, params={"q":"python"}) ทำอะไร?', options: ['POST query string','GET พร้อม query parameter ?q=python','เซ็ต header','เซ็ต body'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'FastAPI & Modern Python Web', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'FastAPI ดีกว่า Flask ตรงไหน?', options: ['เบากว่า','async native, type hints, auto docs','เก่ากว่า','ไม่ต้องติดตั้ง'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/")\nasync def root():\n    return {"message": "__"}', options: ['Hello','GET','OK','Response'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Pydantic ใน FastAPI ใช้ทำอะไร?', options: ['ทำ HTML template','validate และ serialize data อัตโนมัติ','จัดการ database','สร้าง middleware'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'FastAPI สร้าง docs อัตโนมัติที่ path ไหน?', options: ['/api','/help','/docs','/schema'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'from pydantic import BaseModel\nclass Item(BaseModel):\n    name: __\n    price: float', options: ['str','string','text','String'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'uvicorn ใช้ทำอะไร?', options: ['จัดการ database','ASGI server รัน FastAPI/ASGI app','debug tool','package manager'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เฟรมเวิร์กกับจุดเด่น', pairs: [['Flask','เรียบง่าย ยืดหยุ่น'],['FastAPI','เร็ว async type-safe'],['Django','full-stack batteries'],['Tornado','async high-performance']] } },
            { type: 'multiple_choice', data: { prompt: 'async def ใน FastAPI มีประโยชน์อย่างไร?', options: ['ทำงานช้าลง','handle concurrent requests ได้ดีขึ้นโดยไม่บล็อก','ใช้ได้แค่ใน FastAPI','ไม่มีประโยชน์'], correct_index: 1 } },
          ]
        },
      ]
    },

  ]
};
