'use strict';

module.exports = {
  code: 'cs',
  name: 'C#',
  native_name: 'C#',
  flag: '⚙️',
  vocab: [],
  units: [

    // ══════════════════════════ BEGINNER ══════════════════════════════

    {
      order_num: 10,
      title: 'Variables & Data Types',
      description: 'ตัวแปรและชนิดข้อมูลพื้นฐานใน C#',
      icon: '📦',
      level: 'Beginner',
      grammar_note: `C# เป็น statically typed language — ต้องระบุชนิดข้อมูล:
• int — จำนวนเต็ม 32-bit: int x = 42;
• double — ทศนิยม 64-bit: double pi = 3.14;
• float — ทศนิยม 32-bit: float f = 3.14f;
• decimal — ทศนิยมแม่นยำสูง (เงิน): decimal price = 9.99m;
• bool — true / false
• char — ตัวอักษรเดี่ยว: char c = 'A';
• string — ข้อความ: string name = "Alice";

var — type inference: var x = 10; // compiler รู้เองว่าเป็น int
const — ค่าคงที่ compile-time
Console.WriteLine(x) — แสดงผล`,
      lessons: [
        {
          order_num: 1, title: 'ตัวแปรและชนิดข้อมูล', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'int x = 3.14; ผลอะไร?', options: ['x = 3','x = 3.14','Compile error','Runtime error'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: '__ name = "Alice";  // type inference', options: ['var','let','string','auto'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'decimal ใช้เมื่อใด?', options: ['ทุกกรณี','คำนวณเงิน/การเงินที่ต้องแม่นยำสูง','แทน double เสมอ','เฉพาะ int'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ชนิดข้อมูลกับ literal', pairs: [['int','42'],['double','3.14'],['bool','true'],['char',"'A'"]] } },
            { type: 'multiple_choice', data: { prompt: 'const int MAX = 100; แก้ไขค่าได้ไหม?', options: ['ได้เสมอ','ไม่ได้ compile error','ได้ตอน runtime','ได้ด้วย var'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'decimal price = 9.99__;', options: ['m','d','f','M'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'string เป็น value type หรือ reference type?', options: ['value type','reference type','ทั้งสอง','ไม่ใช่ทั้งสอง'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Console.WriteLine vs Console.Write ต่างกันอย่างไร?', options: ['ไม่ต่างกัน','WriteLine ขึ้นบรรทัดใหม่ด้วย','Write เร็วกว่า','WriteLine เฉพาะ string'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'String Operations', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '"Hello" + " " + "World" ได้อะไร?', options: ['"HelloWorld"','"Hello World"','Error','null'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'string msg = $"Hello, {__}!";  // interpolation', options: ['name','$name','{name}','(name)'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '"hello".ToUpper() ได้อะไร?', options: ['"hello"','"HELLO"','"Hello"','Error'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '"hello world".Contains("world") ได้อะไร?', options: ['false','true','"world"','1'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'string s = "  hi  ";\nstring trimmed = s.__();', options: ['Trim','trim','Strip','Remove'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับผลลัพธ์', pairs: [['"hi".Length','2'],['"hello".Substring(1,3)','ell'],['"a,b,c".Split(",")','["a","b","c"]'],['string.IsNullOrEmpty("")','true']] } },
            { type: 'multiple_choice', data: { prompt: 'StringBuilder ใช้แทน string concat เมื่อใด?', options: ['เสมอ','ต้อง concat หลายครั้งใน loop (performance)','เฉพาะ .NET Core','ใช้กับ char เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: '@"C:\\path\\file" (verbatim string) ทำอะไร?', options: ['error','ไม่ต้อง escape backslash','แปลงเป็น URL','encrypt string'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Type Conversion', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'int.Parse("42") ได้อะไร?', options: ['"42"','42','42.0','Exception'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'bool ok = int.__(str, out int result);  // ไม่ throw', options: ['TryParse','Parse','Convert','TryConvert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Convert.ToInt32("abc") ทำอะไร?', options: ['คืน 0','คืน null','throw FormatException','คืน "abc"'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'Implicit conversion คือ?', options: ['ต้อง cast เองเสมอ','แปลงอัตโนมัติเมื่อปลอดภัย เช่น int→double','ใช้ Convert class','ใช้ as keyword'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'double d = 3.99;\nint i = (__)d;  // explicit cast', options: ['int','Int32','double','float'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'as keyword ใน C# คืออะไร?', options: ['cast บังคับ','cast แบบปลอดภัย คืน null ถ้าล้มเหลว','Convert method','type check'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่วิธี conversion กับลักษณะ', pairs: [['(int)x','explicit cast, throw ถ้าล้มเหลว'],['x as Type','safe cast, คืน null'],['int.Parse(s)','string → int, throw ถ้า error'],['int.TryParse(s,out r)','ไม่ throw, คืน bool']] } },
            { type: 'multiple_choice', data: { prompt: 'object o = 42; int i = (int)o; ทำอะไร?', options: ['error','unboxing','boxing','type erasure'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 20,
      title: 'Control Flow',
      description: 'เงื่อนไขและ loops ใน C#',
      icon: '🔀',
      level: 'Beginner',
      grammar_note: `Conditionals:
• if (condition) { } else if { } else { }
• switch (val) { case x: ... break; default: }
• switch expression (C# 8+): var r = x switch { 1 => "one", _ => "other" };
• Ternary: condition ? trueVal : falseVal
• Null-coalescing: val ?? "default"
• Null-conditional: obj?.Property

Loops:
• for (int i=0; i<n; i++) { }
• while (condition) { }
• do { } while (condition);
• foreach (var item in collection) { }
• break / continue`,
      lessons: [
        {
          order_num: 1, title: 'If / Switch', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'switch expression (C# 8+) ผลของ: 2 switch { 1 => "one", 2 => "two", _ => "other" }', options: ['"one"','"two"','"other"','Error'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'string result = score >= 60 ? "pass" : "__";', options: ['fail','false','no','0'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'null ?? "default" ได้อะไรเมื่อค่าเป็น null?', options: ['null','"default"','false','Exception'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'switch statement ต้องมี break ทำไม?', options: ['ไม่จำเป็น','ป้องกัน fall-through ไปยัง case ถัดไป','เพิ่ม performance','compile requirement เท่านั้น'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if (obj __ null) { ... }  // เช็ค null', options: ['!=','==','is','equals'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'obj?.Name ได้อะไรถ้า obj เป็น null?', options: ['Exception','null','"null"','""'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ operator กับความหมาย', pairs: [['==','เท่ากัน'],['!=','ไม่เท่ากัน'],['??','null coalescing'],['?.','null conditional']] } },
            { type: 'multiple_choice', data: { prompt: 'is keyword ใน C# ใช้ทำอะไร?', options: ['เปรียบค่า','ตรวจชนิด (type check)','cast','null check'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Loops', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'foreach (var item in list) วนซ้ำอะไร?', options: ['index','key-value pairs','ทุก element ใน collection','จำนวนครั้ง'], correct_index: 2 } },
            { type: 'fill_blank', data: { sentence: 'for (int i = 0; i < 5; __)  // เพิ่ม i', options: ['i++','i+1','++i','i+=1'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'do { } while (condition); ต่างจาก while { } อย่างไร?', options: ['ไม่ต่างกัน','do-while รันอย่างน้อย 1 ครั้งก่อนเช็ค','while เร็วกว่า','do-while ใช้ได้เฉพาะกับ array'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'continue ใน loop ทำอะไร?', options: ['ออกจาก loop','ข้ามรอบนี้ไปรอบถัดไป','หยุดโปรแกรม','วนไม่สิ้นสุด'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'int[] nums = {1,2,3};\nforeach (var n __ nums) { Console.WriteLine(n); }', options: ['in','of','from','as'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'for loop ต่างจาก foreach อย่างไร?', options: ['ไม่ต่างกัน','for มี index เข้าถึงได้ foreach ไม่มี (ปกติ)','foreach เร็วกว่าเสมอ','for ใช้กับ string เท่านั้น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ loop กับการใช้งาน', pairs: [['for','รู้จำนวนรอบ'],['while','ไม่รู้จำนวนรอบ เช็คก่อน'],['do-while','รันก่อนเช็ค'],['foreach','iterate collection']] } },
            { type: 'multiple_choice', data: { prompt: 'break ใน nested loop ออกจากอะไร?', options: ['ออกจากทุก loop','ออกจาก loop ที่ใกล้สุด','ออกจาก method','ออกจาก switch เท่านั้น'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Arrays & Collections', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'int[] arr = new int[5]; arr มีกี่ element?', options: ['4','5','0','ไม่จำกัด'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var list = new List<int>();\nlist.__(42);  // เพิ่มค่า', options: ['Add','Push','Append','Insert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'List<T> ดีกว่า Array ตรงไหน?', options: ['เร็วกว่าเสมอ','ขนาดปรับได้ dynamic','ใช้ LINQ ได้เท่านั้น','type safe กว่า'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Dictionary<string, int> เก็บข้อมูลแบบไหน?', options: ['คู่ลำดับ','key-value pairs','เฉพาะ string','เฉพาะ int'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var dict = new Dictionary<string,int>();\ndict["age"] = __;\n// กำหนดค่า', options: ['25','\"25\"','(25)','new 25'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Array.Sort(arr) ทำอะไร?', options: ['copy array','เรียงลำดับ array in-place','สร้าง array ใหม่','filter array'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ collection กับลักษณะ', pairs: [['Array','ขนาดคงที่'],['List<T>','ขนาด dynamic'],['Dictionary<K,V>','key-value'],['HashSet<T>','ไม่ซ้ำ ไม่มีลำดับ']] } },
            { type: 'multiple_choice', data: { prompt: 'list.Count กับ array.Length ต่างกันอย่างไร?', options: ['ไม่ต่างกัน','List ใช้ .Count, Array ใช้ .Length','Count นับ string เท่านั้น','Length ช้ากว่า'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 30,
      title: 'Methods & Parameters',
      description: 'การเขียนและเรียกใช้ method ใน C#',
      icon: '⚙️',
      level: 'Beginner',
      grammar_note: `Methods ใน C#:
• [access] [static] returnType MethodName(params) { return val; }
• void — ไม่คืนค่า
• static — เรียกผ่านชื่อ class โดยไม่ต้อง instance

Parameter types:
• ปกติ — pass by value (copy)
• ref — pass by reference (แก้ค่าต้นทางได้)
• out — เหมือน ref แต่ไม่ต้องกำหนดค่าก่อนส่ง
• params — รับ argument จำนวนไม่จำกัด: params int[] nums
• Optional params: void F(int x, int y = 0) { }
• Named arguments: F(y: 5, x: 3)

Method overloading:
• ชื่อเดียวกัน parameter ต่างกัน
• Compiler เลือก overload ที่ตรงที่สุด`,
      lessons: [
        {
          order_num: 1, title: 'Method Basics', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'void Method() หมายความว่า?', options: ['method ว่าง','method ไม่คืนค่า','method private','method static'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'static int Add(int a, int b)\n{\n    __ a + b;\n}', options: ['return','yield','out','give'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Method overloading คืออะไร?', options: ['method ที่ return หลายค่า','ชื่อเดียวกัน parameter ต่างกัน','method ใน loop','override method'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'ref parameter ทำอะไร?', options: ['copy ค่า','ส่ง reference ให้แก้ค่าต้นทางได้','readonly parameter','optional parameter'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'void Swap(ref int a, ref int b)\n{\n    int temp = a; a = b; b = __;\n}', options: ['temp','a','c','0'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'out parameter ต่างจาก ref อย่างไร?', options: ['ไม่ต่างกัน','out ไม่ต้องกำหนดค่าก่อนส่ง ref ต้อง','out เร็วกว่า','ref สำหรับ struct เท่านั้น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ keyword กับความหมาย', pairs: [['ref','pass by reference'],['out','return ค่าเพิ่มเติม'],['params','argument ไม่จำกัดจำนวน'],['optional','ค่าเริ่มต้นถ้าไม่ส่ง']] } },
            { type: 'multiple_choice', data: { prompt: 'Named argument เช่น F(y: 5, x: 3) มีประโยชน์อย่างไร?', options: ['เร็วขึ้น','อ่านชัดขึ้น ลำดับ param ไม่สำคัญ','บังคับ','เฉพาะ optional param'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Lambda & Delegates', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Delegate ใน C# คืออะไร?', options: ['interface','type ที่แทน function signature','abstract class','event object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'Func<int,int> square = x => x __ x;', options: ['*','**','^','x'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Action<T> ต่างจาก Func<T> อย่างไร?', options: ['ไม่ต่างกัน','Action ไม่คืนค่า Func คืนค่า','Action เร็วกว่า','Func ไม่รับ parameter'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'list.Where(x => x > 5) ใช้อะไร?', options: ['for loop','Lambda expression กับ LINQ','Delegate เท่านั้น','reflection'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'Predicate<int> isEven = n => n __ 2 == 0;', options: ['%','/','+','*'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Event ใน C# ใช้ delegate อย่างไร?', options: ['ไม่เกี่ยวกัน','event เป็น delegate ที่ subscribe/unsubscribe ได้','event เป็น static method','event เป็น interface'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ delegate type กับ signature', pairs: [['Action','() → void'],['Action<T>','T → void'],['Func<T,R>','T → R'],['Predicate<T>','T → bool']] } },
            { type: 'multiple_choice', data: { prompt: 'Multicast delegate คืออะไร?', options: ['delegate ที่มี generic','delegate ที่มีหลาย method ผูกอยู่','delegate async','delegate static'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Exception Handling', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'try { } catch (Exception e) { } ใช้ทำอะไร?', options: ['ทดสอบ performance','จับ exception ไม่ให้โปรแกรมพัง','สร้าง loop','ตรวจชนิด'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'throw new __(\"Invalid input\");', options: ['ArgumentException','Error','Exception','Throw'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'finally block ทำงานเมื่อใด?', options: ['เฉพาะตอน exception','เฉพาะตอนสำเร็จ','เสมอ ไม่ว่าจะมี exception หรือไม่','ไม่ทำงาน'], correct_index: 2 } },
            { type: 'multiple_choice', data: { prompt: 'catch block หลายอันเรียงกันได้ไหม?', options: ['ไม่ได้','ได้ จาก specific ไป general','ได้ แต่แค่ 2 อัน','ได้ เฉพาะ Exception ล่างสุด'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'try {\n  int.Parse("x");\n} catch (__ e) {\n  Console.WriteLine(e.Message);\n}', options: ['FormatException','Exception','ParseException','NumberException'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'when clause ใน catch (C# 6+) คืออะไร?', options: ['ชื่อ exception','filter catch ด้วยเงื่อนไข','catch ทุกชนิด','re-throw exception'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ exception กับสาเหตุ', pairs: [['NullReferenceException','เรียก method บน null'],['IndexOutOfRangeException','index เกิน array'],['DivideByZeroException','หารด้วยศูนย์'],['InvalidCastException','cast ผิดชนิด']] } },
            { type: 'multiple_choice', data: { prompt: 'using statement กับ IDisposable คืออะไร?', options: ['import namespace','รับประกัน Dispose() เมื่อออก block','try-catch แบบสั้น','lock resource'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 40,
      title: 'Object-Oriented Programming',
      description: 'Class, inheritance, interface และ OOP ใน C#',
      icon: '🏗️',
      level: 'Beginner',
      grammar_note: `Classes ใน C#:
• class Animal { public string Name { get; set; } }
• Constructor: public Animal(string name) { Name = name; }
• Access modifiers: public, private, protected, internal
• Properties: get/set accessors (auto-property: { get; set; })
• static — ใช้ผ่านชื่อ class ไม่ต้อง instance

Inheritance:
• class Dog : Animal { } — extends
• base.Method() — เรียก parent
• override — ทับ virtual method
• sealed class — ห้าม inherit ต่อ

Interfaces:
• interface IFlyable { void Fly(); }
• class Bird : Animal, IFlyable { }
• C# ไม่ support multiple inheritance แต่ implement หลาย interface ได้`,
      lessons: [
        {
          order_num: 1, title: 'Classes & Properties', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '{ get; set; } ใน property คืออะไร?', options: ['method','auto-implemented property','field','event'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public class Dog\n{\n    public string Name { __; set; }\n}', options: ['get','read','fetch','return'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'private field ต่างจาก public field อย่างไร?', options: ['ไม่ต่างกัน','private เข้าถึงได้เฉพาะใน class เดียวกัน','private เร็วกว่า','private ใช้กับ static เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'new Dog("Rex") ทำอะไร?', options: ['สร้าง class','เรียก constructor สร้าง instance','ลบ object','clone object'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public class Counter\n{\n    private int _count = 0;\n    public void Increment() => __++;\n}', options: ['_count','count','this','Counter'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'this keyword ใน C# คืออะไร?', options: ['parent class','instance ปัจจุบัน','static context','base class'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ access modifier กับขอบเขต', pairs: [['public','เข้าถึงได้จากทุกที่'],['private','เฉพาะ class เดียวกัน'],['protected','class เดียวกัน + subclass'],['internal','เฉพาะ assembly เดียวกัน']] } },
            { type: 'multiple_choice', data: { prompt: 'readonly field ต่างจาก const อย่างไร?', options: ['ไม่ต่างกัน','readonly กำหนดได้ใน constructor, const ต้องเป็น compile-time','const ยืดหยุ่นกว่า','readonly เฉพาะ string'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Inheritance & Polymorphism', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'virtual method คืออะไร?', options: ['method ที่รันเร็ว','method ที่ subclass สามารถ override ได้','method ที่ abstract','method static'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class Dog : Animal\n{\n    public __ string Speak() => "Woof";\n}', options: ['override','virtual','new','abstract'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'abstract class ต่างจาก interface อย่างไร?', options: ['ไม่ต่างกัน','abstract class มี implementation ได้ interface ไม่มี (ก่อน C#8)','interface เร็วกว่า','abstract class ไม่มี constructor'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'sealed class หมายความว่า?', options: ['class ที่ปลอดภัย','ห้าม inherit ต่อ','class ที่ไม่มี method','class private'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'class Cat : Animal\n{\n    public Cat(string n) : __(n) { }\n}', options: ['base','this','parent','Animal'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Polymorphism ใน C# ทำงานอย่างไร?', options: ['เฉพาะ interface','ตัวแปร Animal อ้างถึง Dog และเรียก override method ของ Dog ได้','เฉพาะ abstract','เฉพาะ static'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่คำสำคัญกับการใช้งาน', pairs: [['virtual','method ที่ override ได้'],['override','ทับ virtual method'],['abstract','ต้อง implement ใน subclass'],['sealed','ห้าม inherit / override']] } },
            { type: 'multiple_choice', data: { prompt: 'is และ as ใช้ทำอะไรกับ inheritance?', options: ['สร้าง instance','is: type check, as: safe cast','override','เรียก base'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Interfaces & Generics', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Interface ใน C# คืออะไร?', options: ['abstract class อีกรูปแบบ','contract ที่กำหนด method/property ที่ต้อง implement','class ที่ไม่มี field','static class'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'interface IShape\n{\n    double CalculateArea__;\n}', options: ['()','(x)','{}','<T>'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'class Circle : IShape ต้องทำอะไร?', options: ['ไม่ต้องทำอะไร','implement ทุก member ของ IShape','extend IShape','static implement'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Generics <T> ใช้ทำอะไร?', options: ['ทำให้โค้ดเร็วขึ้น','เขียน code reusable ที่ type-safe','ลด memory','import module'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public T GetFirst<__>(List<T> items)\n{\n    return items[0];\n}', options: ['T','Type','V','Any'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'IEnumerable<T> ใช้ทำอะไร?', options: ['แทน List','ทำให้ collection ใช้กับ foreach ได้','sort collection','count collection'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ interface กับการใช้งาน', pairs: [['IEnumerable<T>','iterate ด้วย foreach'],['IDisposable','ใช้กับ using statement'],['IComparable<T>','เปรียบค่าสำหรับ sort'],['IEquatable<T>','เปรียบ equality']] } },
            { type: 'multiple_choice', data: { prompt: 'where T : class ใน generic constraint หมายความว่า?', options: ['T ต้องเป็น abstract','T ต้องเป็น reference type','T ต้องเป็น IClass','T ต้องมี constructor'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 50,
      title: 'LINQ & Collections',
      description: 'LINQ query syntax, method syntax และ collection operations',
      icon: '🔍',
      level: 'Beginner',
      grammar_note: `LINQ (Language Integrated Query):
• ทำงานกับ collection, database, XML ด้วย syntax เดียวกัน
• Method syntax: list.Where(x => x > 5).Select(x => x * 2)
• Query syntax: from x in list where x > 5 select x * 2

Method syntax ที่ใช้บ่อย:
• .Where(predicate) — กรอง
• .Select(transform) — แปลงค่า (map)
• .OrderBy(key) / .OrderByDescending(key)
• .FirstOrDefault() — หาตัวแรก หรือ default
• .Count() / .Sum() / .Average() / .Max() / .Min()
• .Any(pred) / .All(pred)
• .GroupBy(key) — จัดกลุ่ม
• .ToList() / .ToArray() — materialize`,
      lessons: [
        {
          order_num: 1, title: 'LINQ Method Syntax', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'list.Where(x => x > 5) ทำอะไร?', options: ['เรียง list','กรองเฉพาะค่า > 5','หาค่าแรก > 5','นับค่า > 5'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var doubled = nums.__(x => x * 2);', options: ['Select','Map','Transform','Convert'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'list.FirstOrDefault() ต่างจาก list.First() อย่างไร?', options: ['ไม่ต่างกัน','FirstOrDefault คืน null/default ถ้าว่าง, First throw exception','First เร็วกว่า','FirstOrDefault ใช้กับ int เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'nums.Sum() ทำอะไร?', options: ['นับจำนวน','รวมค่าทั้งหมด','หาค่าเฉลี่ย','เรียงลำดับ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var sorted = list.__(x => x.Age);', options: ['OrderBy','SortBy','OrderWith','Arrange'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'list.Any(x => x < 0) ทำอะไร?', options: ['กรองค่าลบ','คืน true ถ้ามีค่าลบอย่างน้อย 1 ตัว','นับค่าลบ','ลบค่าลบ'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ LINQ method กับการทำงาน', pairs: [['Where','กรองตามเงื่อนไข'],['Select','แปลงค่า'],['GroupBy','จัดกลุ่ม'],['Distinct','ลบซ้ำ']] } },
            { type: 'multiple_choice', data: { prompt: 'ToList() จำเป็นหลัง LINQ เมื่อใด?', options: ['เสมอ','เมื่อต้องการ execute query และเก็บผลเป็น List','ไม่จำเป็น','เฉพาะ async LINQ'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Advanced LINQ', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'LINQ query syntax: from x in list where x > 5 select x ทำอะไร?', options: ['ลบค่า <= 5','คืน IEnumerable ของค่า > 5','เรียงค่า','นับค่า'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var groups = people.__(p => p.City);', options: ['GroupBy','Group','Cluster','Partition'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'SelectMany ต่างจาก Select อย่างไร?', options: ['ไม่ต่างกัน','SelectMany flatten nested collection, Select ไม่ flatten','Select เร็วกว่า','SelectMany เฉพาะ array'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Deferred execution ใน LINQ คืออะไร?', options: ['LINQ ช้า','query รันจริงตอน iterate ไม่ใช่ตอนสร้าง','LINQ ใช้ thread','LINQ lazy'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var result = nums\n    .Where(x => x > 0)\n    .Select(x => x * 2)\n    .__();  // materialize', options: ['ToList','Execute','Run','Evaluate'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'list.Join(other, x=>x.Id, y=>y.Id, (x,y)=>...) ทำอะไร?', options: ['รวม list','JOIN สองคอลเล็กชันโดยใช้ key','filter','group'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ LINQ กับ SQL', pairs: [['Where','WHERE'],['Select','SELECT'],['GroupBy','GROUP BY'],['OrderBy','ORDER BY']] } },
            { type: 'multiple_choice', data: { prompt: 'nums.Aggregate((acc, x) => acc + x) ทำอะไร?', options: ['เหมือน Sum','fold/reduce สะสมค่า','เรียง','group'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Async & Task', xp_reward: 10,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'async/await ใน C# ใช้ทำอะไร?', options: ['multi-threading','เขียน asynchronous code แบบ synchronous อ่านง่าย','parallel processing','timer'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public __ Task<string> GetDataAsync()\n{\n    return await httpClient.GetStringAsync(url);\n}', options: ['async','await','static','override'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Task<T> คืออะไร?', options: ['thread','แทนการทำงาน async ที่จะคืนค่า T ในอนาคต','callback','Promise'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'await Task.WhenAll(t1,t2,t3) ทำอะไร?', options: ['รัน sequence','รอทุก task เสร็จพร้อมกัน','ยกเลิกทั้งหมด','รัน task แรกที่เสร็จ'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'try {\n    var data = __ FetchAsync();\n} catch (HttpRequestException e) { }', options: ['await','async','task','run'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ConfigureAwait(false) ใช้ทำอะไร?', options: ['ยกเลิก await','ไม่ต้อง resume บน original context (เหมาะ library code)','เพิ่ม timeout','ทำ task ช้าลง'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ Task method กับการทำงาน', pairs: [['Task.Run(fn)','รัน fn ใน thread pool'],['Task.Delay(ms)','async sleep'],['Task.WhenAll','รอทุก task'],['Task.WhenAny','รอ task แรกที่เสร็จ']] } },
            { type: 'multiple_choice', data: { prompt: 'CancellationToken ใช้ทำอะไร?', options: ['timeout เท่านั้น','ยกเลิก async operation ได้','ลด CPU','เพิ่ม thread'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ══════════════════════════ INTERMEDIATE ══════════════════════════

    {
      order_num: 60,
      title: 'Advanced OOP & Design Patterns',
      description: 'Design patterns สำคัญใน C# และ .NET',
      icon: '🧩',
      level: 'Intermediate',
      grammar_note: `Design Patterns ที่ใช้บ่อยใน C#:
• Singleton — ใช้ static instance หรือ Lazy<T>
• Factory / Abstract Factory — สร้าง object โดยซ่อน logic
• Repository — abstraction layer สำหรับ data access
• Dependency Injection (DI) — ส่ง dependency ผ่าน constructor
• Observer — event/delegate pattern
• Strategy — เลือก algorithm ได้ตอน runtime

SOLID Principles:
• S: Single Responsibility — 1 class = 1 reason to change
• O: Open/Closed — เปิดรับ extension ปิดรับการแก้ไข
• L: Liskov Substitution — subclass ใช้แทน superclass ได้
• I: Interface Segregation — interface เล็กๆ ดีกว่าใหญ่
• D: Dependency Inversion — depend on abstraction`,
      lessons: [
        {
          order_num: 1, title: 'SOLID Principles', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Single Responsibility Principle คือ?', options: ['class มีได้แค่ 1 method','class ควรมีเหตุผลเดียวในการเปลี่ยน','class ต้องเป็น abstract','class ไม่มี field'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '// Open/Closed: เพิ่ม behavior โดยไม่แก้ class เดิม\nclass TaxCalculator {\n    public decimal Calculate(Order o, __ strategy) { }\n}', options: ['ITaxStrategy','TaxBase','Calculator','decimal'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Liskov Substitution Principle คือ?', options: ['ห้าม override','subclass ต้องใช้แทน superclass ได้โดยไม่เสียพฤติกรรม','class เดียวกันเท่านั้น','ห้าม cast'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Interface Segregation Principle คือ?', options: ['ใช้ interface เดียวใหญ่','แยก interface เล็กๆ ตามการใช้งาน','ห้าม implement หลาย interface','interface ต้องมีแค่ 1 method'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '// DI: inject dependency ผ่าน constructor\npublic class OrderService\n{\n    private readonly __ _repo;\n    public OrderService(IOrderRepository repo) => _repo = repo;\n}', options: ['IOrderRepository','OrderRepository','Repository','IRepo'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Dependency Inversion Principle คือ?', options: ['ลบ dependency ทั้งหมด','depend บน abstraction (interface) ไม่ใช่ concrete class','inject class ตรงๆ','ห้ามใช้ new'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ SOLID กับหลักการ', pairs: [['S','1 class 1 responsibility'],['O','เปิดรับ extension ปิดรับแก้ไข'],['L','subclass ใช้แทน superclass'],['D','depend on abstraction']] } },
            { type: 'multiple_choice', data: { prompt: 'ทำไม DI ถึงดีกว่าการ new dependency เอง?', options: ['เร็วกว่า','test ง่ายกว่า swap implementation ง่าย','ใช้ memory น้อย','ไม่มีประโยชน์'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Common Design Patterns', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Singleton ด้วย Lazy<T> ดีกว่า static field ธรรมดาอย่างไร?', options: ['ไม่ต่างกัน','thread-safe และสร้าง instance ตอนต้องการจริงๆ','เร็วกว่า','ใช้ DI ได้'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'private static readonly Lazy<Config> _instance =\n    new Lazy<Config>(() => new Config());\npublic static Config Instance => __.Value;', options: ['_instance','Config','Lazy','this'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Repository pattern ใช้ทำอะไร?', options: ['cache data','abstract ชั้น data access ให้ business logic ไม่รู้จัก DB โดยตรง','logging','auth'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Strategy pattern ใช้เมื่อใด?', options: ['ต้องการ singleton','ต้องสลับ algorithm ตอน runtime','สร้าง object','observe event'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public class SortService\n{\n    private __ _strategy;\n    public void SetStrategy(ISortStrategy s) => _strategy = s;\n    public void Sort(int[] arr) => _strategy.Sort(arr);\n}', options: ['ISortStrategy','SortStrategy','ISort','Sort'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Decorator pattern คือ?', options: ['เหมือน inheritance','เพิ่ม behavior โดยไม่แก้ class เดิม wrap ด้วย class ใหม่','static method','extension method'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ pattern กับการใช้งาน', pairs: [['Singleton','instance เดียวทั้ง app'],['Factory','สร้าง object ซ่อน logic'],['Repository','abstract data access'],['Strategy','สลับ algorithm runtime']] } },
            { type: 'multiple_choice', data: { prompt: 'Observer pattern ใน C# ใช้อะไรได้?', options: ['abstract class','events/delegates, IObservable<T>','static method','Singleton'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Extension Methods & Records', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Extension method คืออะไร?', options: ['method ใน subclass','static method ที่เพิ่ม method ให้ type อื่นได้โดยไม่แก้ source code','override method','virtual method'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public static class StringExt\n{\n    public static bool IsEmail(__ string s)\n    { return s.Contains("@"); }\n}', options: ['this','ref','out','static'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Record ใน C# (9+) คืออะไร?', options: ['เหมือน class ธรรมดา','immutable reference type ที่มี value-based equality','abstract class','struct'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'record Point(int X, int Y) ทำอะไร?', options: ['สร้าง class','สร้าง record พร้อม positional constructor auto-property','สร้าง struct','สร้าง interface'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'record Person(string Name, int Age);\nvar p1 = new Person("Ali", 20);\nvar p2 = p1 __ { Age = 21 };  // non-destructive mutation', options: ['with','copy','clone','new'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Value-based equality ของ record หมายความว่า?', options: ['เปรียบ reference','เปรียบค่า property — record ที่มีค่าเหมือนกัน == กัน','เปรียบ hash code เท่านั้น','เหมือน class'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ feature กับ C# version', pairs: [['record','C# 9'],['pattern matching switch','C# 8+'],['nullable reference types','C# 8'],['top-level statements','C# 9']] } },
            { type: 'multiple_choice', data: { prompt: 'struct ต่างจาก class อย่างไร?', options: ['ไม่ต่างกัน','struct เป็น value type stack, class เป็น reference type heap','struct เร็วกว่าเสมอ','struct ไม่มี method'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 70,
      title: 'File I/O & Serialization',
      description: 'อ่าน/เขียนไฟล์, JSON serialization, และ streams',
      icon: '📁',
      level: 'Intermediate',
      grammar_note: `File I/O:
• File.ReadAllText(path) / File.WriteAllText(path, content)
• File.ReadAllLines(path) → string[]
• File.AppendAllText(path, content)
• StreamReader/StreamWriter — อ่าน/เขียน stream ทีละบรรทัด
• using (var sr = new StreamReader(path)) { } — รับประกัน Dispose

JSON Serialization (.NET 6+):
• System.Text.Json
• JsonSerializer.Serialize(obj) → string
• JsonSerializer.Deserialize<T>(json) → T
• [JsonPropertyName("name")] attribute
• JsonSerializerOptions — camelCase, indent, etc.

Path:
• Path.Combine(dir, file) — สร้าง path ปลอดภัย
• Path.GetExtension(path), Path.GetFileName(path)
• Directory.Exists(path), File.Exists(path)`,
      lessons: [
        {
          order_num: 1, title: 'File Operations', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'File.ReadAllText(path) ทำอะไร?', options: ['อ่านทีละบรรทัด','อ่านทั้งไฟล์เป็น string เดียว','เปิดไฟล์','ลบไฟล์'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'File.__(\"log.txt\", \"entry\\n\");  // ต่อท้าย', options: ['AppendAllText','WriteAllText','AddText','AppendText'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'using (var sw = new StreamWriter(path)) ดีกว่า File.WriteAllText อย่างไร?', options: ['ไม่ต่างกัน','ใช้เขียน stream ขนาดใหญ่ทีละส่วนได้ ประหยัด memory','เร็วกว่าเสมอ','ใช้ async ได้เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Path.Combine("C:\\\\data", "file.txt") ดีกว่า string concat เพราะ?', options: ['เร็วกว่า','จัดการ separator ถูกต้องทุก OS','น้ำหนักเบากว่า','เป็น method มาตรฐาน'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'if (File.__(path))\n{\n    string content = File.ReadAllText(path);\n}', options: ['Exists','Found','Has','Check'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Directory.GetFiles(path, "*.cs") ทำอะไร?', options: ['สร้างไฟล์ .cs','คืน array ของไฟล์ .cs ใน directory','ลบไฟล์ .cs','อ่านไฟล์ .cs ทั้งหมด'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ method กับการทำงาน', pairs: [['File.ReadAllLines','อ่านเป็น string[]'],['File.WriteAllLines','เขียนจาก string[]'],['File.Copy','copy ไฟล์'],['File.Delete','ลบไฟล์']] } },
            { type: 'multiple_choice', data: { prompt: 'FileStream ต่างจาก StreamReader อย่างไร?', options: ['ไม่ต่างกัน','FileStream ทำงานกับ bytes, StreamReader กับ text','StreamReader เร็วกว่า','FileStream เฉพาะ binary'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'JSON Serialization', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'JsonSerializer.Serialize(obj) ทำอะไร?', options: ['แปลง JSON เป็น object','แปลง object เป็น JSON string','validate JSON','compress JSON'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var person = JsonSerializer.Deserialize<__>(json);', options: ['Person','object','string','dynamic'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[JsonPropertyName("first_name")] attribute ทำอะไร?', options: ['สร้าง property','map C# property กับ JSON field name ต่างกัน','validate property','encrypt property'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase } ทำอะไร?', options: ['เพิ่ม indent','แปลง PascalCase เป็น camelCase ใน JSON','ลบ null','เพิ่ม quotes'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var opts = new JsonSerializerOptions { WriteIndented = __ };\nstring json = JsonSerializer.Serialize(data, opts);', options: ['true','false','1','null'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Newtonsoft.Json (Json.NET) ต่างจาก System.Text.Json อย่างไร?', options: ['ไม่ต่างกัน','Newtonsoft.Json มี feature มากกว่า System.Text.Json เร็วกว่าและ built-in .NET 6+','System.Text.Json เก่ากว่า','Newtonsoft ใช้กับ .NET Core เท่านั้น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ attribute กับการทำงาน', pairs: [['[JsonPropertyName]','เปลี่ยนชื่อ JSON key'],['[JsonIgnore]','ไม่รวมใน JSON'],['[JsonRequired]','ต้องมีใน JSON'],['[JsonInclude]','รวม field ใน JSON']] } },
            { type: 'multiple_choice', data: { prompt: 'JsonDocument.Parse(json) ใช้เมื่อใด?', options: ['เสมอ','อ่าน JSON แบบ low-level ไม่ต้อง deserialize เป็น class','validate เท่านั้น','เฉพาะ large JSON'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'HTTP Client & APIs', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'HttpClient ใช้ทำอะไร?', options: ['สร้าง HTTP server','ส่ง HTTP request จาก C#','manage cookies','parse URL'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'using var client = new HttpClient();\nvar json = await client.__(url);', options: ['GetStringAsync','GetAsync','FetchAsync','ReadAsync'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'IHttpClientFactory ดีกว่า new HttpClient() เพราะ?', options: ['ไม่ต่างกัน','จัดการ connection pooling ป้องกัน socket exhaustion','เร็วกว่า','ใช้ async ได้เท่านั้น'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'resp.EnsureSuccessStatusCode() ทำอะไร?', options: ['เพิ่ม status code','throw HttpRequestException ถ้า status ไม่ใช่ 2xx','log status','redirect'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var content = new StringContent(\n    JsonSerializer.Serialize(data),\n    Encoding.UTF8,\n    "application/__"\n);', options: ['json','text','xml','form'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Polly library ใช้ทำอะไร?', options: ['serialize JSON','retry, circuit breaker, timeout policy สำหรับ HTTP','logging','auth'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ HTTP method กับการใช้งาน', pairs: [['GetAsync','ดึงข้อมูล'],['PostAsync','สร้างข้อมูล'],['PutAsync','แทนที่ข้อมูล'],['DeleteAsync','ลบข้อมูล']] } },
            { type: 'multiple_choice', data: { prompt: 'CancellationToken ส่งไปกับ HttpClient request ทำอะไร?', options: ['เพิ่ม timeout อัตโนมัติ','ยกเลิก request ได้กลางทาง','retry อัตโนมัติ','compress request'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 80,
      title: 'Entity Framework Core',
      description: 'ORM สำหรับ database access ด้วย C# และ EF Core',
      icon: '🗄️',
      level: 'Intermediate',
      grammar_note: `Entity Framework Core (EF Core):
• ORM — map C# classes กับ database tables อัตโนมัติ
• DbContext — unit of work และ connection manager
• DbSet<T> — คือ table ใน database
• Code-First: เขียน C# class แล้ว generate migration

CRUD:
• context.Table.Add(entity) → INSERT
• context.SaveChangesAsync() — commit
• context.Table.FindAsync(id) — SELECT by PK
• context.Table.ToListAsync() — SELECT *
• context.Entry(e).State = EntityState.Modified → UPDATE
• context.Table.Remove(entity) → DELETE

LINQ กับ EF:
• context.Users.Where(u => u.Age > 18).ToListAsync()
• Include(u => u.Orders) — eager loading (JOIN)
• AsNoTracking() — read-only query เร็วกว่า`,
      lessons: [
        {
          order_num: 1, title: 'DbContext & DbSet', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'DbContext ใน EF Core คืออะไร?', options: ['คือ database','class ที่จัดการ connection และ unit of work','interface','migration tool'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public class AppDbContext : DbContext\n{\n    public __ Users { get; set; }\n}', options: ['DbSet<User>','Table<User>','Set<User>','List<User>'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Code-First approach คือ?', options: ['เขียน SQL ก่อน','เขียน C# class ก่อน generate DB schema','GUI tool','DB-First'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Migration ใน EF Core คืออะไร?', options: ['ย้ายข้อมูล','บันทึกการเปลี่ยน schema ให้ apply กับ DB ได้','backup','seed data'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'protected override void OnConfiguring(DbContextOptionsBuilder opts)\n{\n    opts.UseNpgsql(connectionString);\n    // __ PostgreSQL\n}', options: ['เชื่อมต่อ','setup','config','link'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[Key] attribute ใน EF Core หมายถึง?', options: ['primary key','foreign key','unique key','index'], correct_index: 0 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ EF command กับการทำงาน', pairs: [['dotnet ef migrations add','สร้าง migration'],['dotnet ef database update','apply migration'],['dotnet ef migrations remove','ลบ migration ล่าสุด'],['dotnet ef dbcontext scaffold','generate จาก existing DB']] } },
            { type: 'multiple_choice', data: { prompt: 'AsNoTracking() ใช้เมื่อใด?', options: ['เสมอ','query read-only ที่ไม่ต้อง track changes ให้เร็วขึ้น','update ข้อมูล','delete ข้อมูล'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'CRUD Operations', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'context.Users.Add(user) แล้วต้องทำอะไรต่อ?', options: ['ไม่ต้องทำอะไร','await context.SaveChangesAsync()','context.Commit()','context.Flush()'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var user = await context.Users.__(userId);\n// SELECT by PK', options: ['FindAsync','GetAsync','FindById','QueryAsync'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'UPDATE ด้วย EF Core ทำอย่างไร?', options: ['เรียก Update() method','แก้ property ของ tracked entity แล้ว SaveChanges','เขียน SQL ตรงๆ','ใช้ Patch()'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Include(u => u.Orders) ทำอะไร?', options: ['filter orders','eager load navigation property Orders ด้วย JOIN','lazy load','count orders'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'context.Users.__(user);\nawait context.SaveChangesAsync();\n// DELETE', options: ['Remove','Delete','Drop','Destroy'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Lazy loading ใน EF Core คืออะไร?', options: ['โหลดทุกอย่างก่อน','load navigation property ตอนเข้าถึงครั้งแรก (N+1 problem)','disable loading','cache loading'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ CRUD กับ EF method', pairs: [['Create','context.Add(e) + SaveChanges'],['Read','context.Table.ToListAsync()'],['Update','แก้ property + SaveChanges'],['Delete','context.Remove(e) + SaveChanges']] } },
            { type: 'multiple_choice', data: { prompt: 'Transaction ใน EF Core ทำยังไง?', options: ['อัตโนมัติเสมอ','ใช้ context.Database.BeginTransactionAsync()','ไม่รองรับ','ใช้ lock'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Advanced Queries', xp_reward: 15,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Raw SQL ใน EF Core ทำได้ด้วย?', options: ['ทำไม่ได้','FromSqlRaw() หรือ ExecuteSqlRawAsync()','เฉพาะ stored procedure','reflection'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var users = await context.Users\n    .Where(u => u.City == city)\n    .OrderBy(u => u.Name)\n    .__();', options: ['ToListAsync','Execute','Fetch','RunAsync'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'N+1 problem คืออะไร?', options: ['การใช้ N threads','ดึงข้อมูล 1 ครั้งแล้ว loop ดึง related data อีก N ครั้ง','query timeout','connection limit'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'แก้ N+1 problem ด้วย?', options: ['lazy loading','eager loading ด้วย Include()', 'AsNoTracking','pagination'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var result = await context.Orders\n    .__(o => o.Customer)\n    .__(o => o.Items)\n    .ToListAsync();', options: ['Include', 'ThenInclude', 'With', 'Join'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Pagination ใน EF Core ทำยังไง?', options: ['โหลดทั้งหมดแล้วกรอง','ใช้ .Skip(n).Take(pageSize)','ใช้ LIMIT เท่านั้น','ใช้ cursor'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ technique กับปัญหา', pairs: [['Include','แก้ N+1'],['AsNoTracking','เร็วขึ้นสำหรับ read'],['Skip/Take','pagination'],['SplitQuery','แก้ cartesian explosion']] } },
            { type: 'multiple_choice', data: { prompt: 'DbContext lifetime ที่เหมาะสมใน ASP.NET Core คือ?', options: ['Singleton','Scoped (per HTTP request)','Transient','Thread-static'], correct_index: 1 } },
          ]
        },
      ]
    },

    // ══════════════════════════ ADVANCED ══════════════════════════════

    {
      order_num: 90,
      title: 'ASP.NET Core Web API',
      description: 'สร้าง REST API ด้วย ASP.NET Core',
      icon: '🌐',
      level: 'Advanced',
      grammar_note: `ASP.NET Core Web API:
• Program.cs — entry point, configure services & middleware
• Controller: [ApiController] [Route("api/[controller]")]
• Action methods: [HttpGet], [HttpPost], [HttpPut], [HttpDelete]
• IActionResult / ActionResult<T> — flexible return type
• [FromBody], [FromRoute], [FromQuery] — binding ข้อมูล input
• ModelState validation อัตโนมัติด้วย Data Annotations

Dependency Injection:
• builder.Services.AddScoped<IRepo, Repo>()
• AddSingleton / AddTransient / AddScoped lifetimes
• Inject ผ่าน constructor

Middleware pipeline:
• app.UseAuthentication() → app.UseAuthorization()
• app.UseExceptionHandler() — global error handling
• Custom middleware: IMiddleware หรือ Use() extension`,
      lessons: [
        {
          order_num: 1, title: 'Controllers & Routing', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '[ApiController] attribute ทำอะไร?', options: ['สร้าง controller','เปิด automatic model validation, binding inference','เพิ่ม route','enable CORS'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[HttpGet("{id}")]\npublic async Task<ActionResult<User>> GetUser(__ id)\n{ ... }', options: ['int','string','[FromRoute] int','Guid'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'return NotFound() ใน controller ส่ง HTTP status อะไร?', options: ['200','204','400','404'], correct_index: 3 } },
            { type: 'multiple_choice', data: { prompt: '[FromBody] ทำอะไร?', options: ['bind จาก URL','bind จาก HTTP request body (JSON)','bind จาก header','bind จาก cookie'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[HttpPost]\npublic async Task<IActionResult> Create([__] UserDto dto)\n{ ... }', options: ['FromBody','FromRoute','FromQuery','FromHeader'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'CreatedAtAction() ส่ง HTTP status อะไร?', options: ['200','201','204','400'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ result กับ HTTP status', pairs: [['Ok(data)','200'],['Created(...)','201'],['NoContent()','204'],['BadRequest()','400']] } },
            { type: 'multiple_choice', data: { prompt: 'Route constraint {id:int} หมายความว่า?', options: ['id ต้องเป็น string','id ต้องเป็น integer','id optional','id ต้องไม่ว่าง'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Dependency Injection & Services', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'AddScoped ต่างจาก AddSingleton อย่างไร?', options: ['ไม่ต่างกัน','Scoped: instance ต่อ request, Singleton: instance เดียวตลอด app','Scoped เร็วกว่า','Singleton เฉพาะ DbContext'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'builder.Services.AddScoped<IUserService, __>();', options: ['UserService','IUserService','Service','User'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'AddTransient ทำอะไร?', options: ['instance เดียวทั้ง app','สร้าง instance ใหม่ทุกครั้งที่ inject','instance ต่อ request','instance ต่อ thread'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Constructor injection คือ?', options: ['สร้าง instance ใน constructor','รับ dependency ผ่าน constructor parameter','inject ด้วย attribute','inject static'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'public class UserController\n{\n    private readonly IUserService _svc;\n    public UserController(__ svc) => _svc = svc;\n}', options: ['IUserService','UserService','IService','Service'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'IOptions<T> ใช้ทำอะไร?', options: ['inject random value','inject strongly-typed configuration จาก appsettings.json','inject service','inject controller'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ lifetime กับการใช้งาน', pairs: [['Singleton','config, cache, logger'],['Scoped','DbContext, repository'],['Transient','lightweight stateless service'],['Request','เหมือน Scoped ใน web context']] } },
            { type: 'multiple_choice', data: { prompt: 'Service locator pattern ทำไมถึงไม่ดี?', options: ['ช้า','ซ่อน dependencies ทำ test ยาก','ใช้ได้เฉพาะ Singleton','memory leak'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Auth & Middleware', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'JWT Bearer authentication ใน ASP.NET Core ทำอย่างไร?', options: ['built-in ไม่ต้อง config','AddAuthentication().AddJwtBearer() ใน services','ใช้ cookie เท่านั้น','ใช้ session'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[Authorize]\n[HttpGet("profile")]\npublic IActionResult Profile()\n{\n    var userId = User.FindFirst(ClaimTypes.__)?.Value;\n}', options: ['NameIdentifier','Name','Email','Id'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: '[Authorize(Roles = "Admin")] ทำอะไร?', options: ['สร้าง role','จำกัดเฉพาะ user ที่มี role Admin','ลบ role','เพิ่ม claim'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Middleware ใน ASP.NET Core รันตามลำดับอะไร?', options: ['random','ลำดับที่ Use() ใน Program.cs','ตาม priority','alphabetical'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'app.Use(async (context, next) =>\n{\n    // before\n    await __();\n    // after\n});', options: ['next','context.Next','Continue','Pass'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Global exception handling ใน ASP.NET Core ทำด้วย?', options: ['try-catch ใน main','app.UseExceptionHandler() หรือ IExceptionFilter','เฉพาะ try-catch ใน controller','log เท่านั้น'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ middleware กับการทำงาน', pairs: [['UseHttpsRedirection','redirect HTTP→HTTPS'],['UseAuthentication','ตรวจ identity'],['UseAuthorization','ตรวจ permission'],['UseStaticFiles','serve static files']] } },
            { type: 'multiple_choice', data: { prompt: 'CORS policy ใน ASP.NET Core ตั้งค่าที่ไหน?', options: ['web.config เท่านั้น','builder.Services.AddCors() + app.UseCors()','IIS เท่านั้น','nginx เท่านั้น'], correct_index: 1 } },
          ]
        },
      ]
    },

    {
      order_num: 100,
      title: 'Performance & Testing',
      description: 'Benchmarking, unit testing และ best practices สำหรับ .NET',
      icon: '🚀',
      level: 'Advanced',
      grammar_note: `Testing ใน .NET:
• xUnit — test framework ยอดนิยม
• [Fact] — test method ธรรมดา
• [Theory] + [InlineData] — parameterized tests
• FluentAssertions — assertion ที่อ่านง่าย
• Moq — mocking library
• Integration tests ด้วย WebApplicationFactory

Performance:
• BenchmarkDotNet — micro-benchmarking
• Span<T> / Memory<T> — zero-copy memory operations
• ArrayPool<T> — pool reuse array ลด GC pressure
• ValueTask — ลด allocation สำหรับ hot path async
• Parallel.ForEach / PLINQ — parallel processing
• IAsyncEnumerable<T> — async streaming`,
      lessons: [
        {
          order_num: 1, title: 'Unit Testing with xUnit', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: '[Fact] attribute ใน xUnit คือ?', options: ['ทดสอบ database','ทดสอบ 1 กรณี ไม่มี parameter','ทดสอบหลาย case','integration test'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: '[Theory]\n[InlineData(1, 2, 3)]\n[InlineData(0, 0, 0)]\npublic void Add_Returns_Sum(int a, int b, int expected)\n{\n    Assert.__(expected, Add(a,b));\n}', options: ['Equal','Same','Is','Check'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Moq.Mock<IService>() ใช้ทำอะไร?', options: ['สร้าง service จริง','สร้าง mock สำหรับ interface ทดสอบได้','inject service','log service'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'mock.Setup(s => s.GetUser(1)).Returns(fakeUser) ทำอะไร?', options: ['เรียก GetUser จริง','กำหนดว่าถ้าเรียก GetUser(1) ให้คืน fakeUser','validate input','log call'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'mock.Verify(s => s.SaveAsync(It.IsAny<User>()), Times.__);\n// เช็คว่าถูกเรียก 1 ครั้ง', options: ['Once()','One()','Single()','1()'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'WebApplicationFactory ใน integration tests คืออะไร?', options: ['สร้าง web app จริง','in-memory test server สำหรับ integration test','mock HttpClient','unit test helper'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ test concept กับความหมาย', pairs: [['Arrange','ตั้งค่า precondition'],['Act','เรียก method ที่ test'],['Assert','ตรวจผลลัพธ์'],['Mock','แทน dependency จริง']] } },
            { type: 'multiple_choice', data: { prompt: 'FluentAssertions ช่วยอะไร?', options: ['เร็วกว่า Assert','อ่าน assertion ได้เป็นภาษาอังกฤษ result.Should().Be(5)','สร้าง mock','run test เร็วขึ้น'], correct_index: 1 } },
          ]
        },
        {
          order_num: 2, title: 'Performance Optimization', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'Span<T> ใช้ทำอะไร?', options: ['generic collection','view บน memory block โดยไม่ copy (zero-allocation)','async operation','parallel loop'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'var arr = ArrayPool<byte>.Shared.Rent(1024);\ntry { /* use arr */ }\nfinally { ArrayPool<byte>.Shared.__(arr); }', options: ['Return','Release','Free','Dispose'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'ValueTask ต่างจาก Task อย่างไร?', options: ['เร็วกว่าเสมอ','ValueTask ลด heap allocation สำหรับ hot async path ที่มักสำเร็จ sync','ValueTask ใช้ thread pool','Task ใช้ value type'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'BenchmarkDotNet ใช้ทำอะไร?', options: ['run unit tests','วัด performance code อย่างแม่นยำ ลด noise','compile code','profile memory'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'Parallel.ForEach(items, item =>\n{\n    __(item);\n});  // parallel processing', options: ['Process','run','handle','do'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'GC pressure คืออะไร?', options: ['RAM เต็ม','การสร้าง short-lived object มากทำให้ GC ทำงานบ่อย','CPU สูง','thread deadlock'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่เทคนิคกับการปรับปรุง', pairs: [['Span<T>','ลด memory copy'],['ArrayPool<T>','ลด GC pressure'],['ValueTask','ลด async allocation'],['StringBuilder','ลด string concat alloc']] } },
            { type: 'multiple_choice', data: { prompt: 'IAsyncEnumerable<T> ใช้เมื่อใด?', options: ['เสมอ','stream ข้อมูลจำนวนมาก async ทีละชิ้น','เฉพาะ database','แทน List<T>'], correct_index: 1 } },
          ]
        },
        {
          order_num: 3, title: 'Deployment & DevOps', xp_reward: 20,
          exercises: [
            { type: 'multiple_choice', data: { prompt: 'dotnet publish -c Release ทำอะไร?', options: ['run app','สร้าง optimized build สำหรับ deploy','run tests','สร้าง Docker image'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'FROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY --from=build /app/publish .\n__ ["dotnet","MyApp.dll"]', options: ['ENTRYPOINT','CMD','RUN','EXEC'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'appsettings.Production.json ทำงานอย่างไร?', options: ['ไฟล์สำรอง','override appsettings.json เมื่อ ASPNETCORE_ENVIRONMENT=Production','ลบ appsettings.json','เฉพาะ IIS'], correct_index: 1 } },
            { type: 'multiple_choice', data: { prompt: 'Health check endpoint ใน ASP.NET Core ใช้ทำอะไร?', options: ['test API','ให้ orchestrator ตรวจว่า app healthy (Kubernetes readiness probe)','logging','auth'], correct_index: 1 } },
            { type: 'fill_blank', data: { sentence: 'builder.Services.AddHealthChecks()\n    .__(\"db\", async () => {\n        // check DB\n        return HealthCheckResult.Healthy();\n    });', options: ['AddCheck','Add','Register','AddService'], correct_index: 0 } },
            { type: 'multiple_choice', data: { prompt: 'Structured logging ด้วย Serilog ดีกว่า Console.WriteLine เพราะ?', options: ['เร็วกว่า','log เป็น JSON query ได้ใน Seq/ELK, มี level และ properties','ใช้ memory น้อย','thread-safe'], correct_index: 1 } },
            { type: 'match_pairs', data: { prompt: 'จับคู่ deployment target กับการใช้งาน', pairs: [['Azure App Service','managed PaaS .NET'],['Docker + Kubernetes','containerized microservices'],['Azure Functions','serverless event-driven'],['Railway/Render','simple container deploy']] } },
            { type: 'multiple_choice', data: { prompt: 'Multi-stage Docker build ดีกว่า single stage เพราะ?', options: ['เร็วกว่า','image สุดท้ายเล็กกว่า ไม่มี SDK และ source code','ง่ายกว่า','ปลอดภัยน้อยกว่า'], correct_index: 1 } },
          ]
        },
      ]
    },

  ]
};
