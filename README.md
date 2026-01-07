# Cyber Learning Portal (Refactored)

## What changed
- ✅ แยกโครงสร้างเป็น `src/` (routes/controllers/middleware/config)
- ✅ ใช้ EJS templates + partials (`views/partials/topbar.ejs`) เพื่อทำ **แท็บด้านบนใช้ซ้ำทุกหน้า**
- ✅ เพิ่มหน้าใหม่
  - `/` หน้าแรก (มีปุ่ม **เรียน** และมีเมนูให้เลือกว่าจะเรียนอะไร)
  - `/learn` หน้ารวมคอร์ส
  - `/course/:category` หน้าคอร์ส (โหลดข้อมูลผ่าน API)
- ✅ ย้ายข้อมูลคอร์สออกจาก HTML ไปอยู่ที่ `data/courses.js` เพื่อเพิ่มคอนเทนต์ได้ง่าย

## Project structure
```
cyber-learning-portal/
├─ src/
│  ├─ server.js
│  ├─ app.js
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ authController.js
│  │  └─ courseController.js
│  ├─ middleware/
│  │  ├─ requireAuth.js
│  │  └─ viewLocals.js
│  └─ routes/
│     ├─ api.js
│     └─ pages.js
├─ views/
│  ├─ partials/
│  │  ├─ head.ejs
│  │  └─ topbar.ejs
│  └─ pages/
│     ├─ home.ejs
│     ├─ learn.ejs
│     ├─ course.ejs
│     ├─ login.ejs
│     ├─ register.ejs
│     └─ notfound.ejs
├─ public/
│  ├─ css/style.css
│  └─ js/
│     ├─ auth.js
│     ├─ course.js
│     ├─ login.js
│     └─ register.js
├─ data/
│  └─ courses.js
├─ database/
│  └─ schema.sql
├─ package.json
└─ .env.example
```

## Run locally
1) ติดตั้ง dependencies
```bash
npm install
```

2) สร้างไฟล์ `.env` จาก `.env.example` แล้วใส่ `DATABASE_URL`

3) Run
```bash
npm start
```

## Add new pages in the future
- สร้างไฟล์ view ใหม่ใน `views/pages/` (เช่น `about.ejs`)
- เพิ่ม route ใหม่ใน `src/routes/pages.js`
- Navbar จะถูก include อัตโนมัติ (ใช้ `<%- include('../partials/topbar') %>`)

## Add / edit course content
- แก้ไขไฟล์ `data/courses.js`
  - เพิ่ม category ใหม่: `mycourse: [ ...episodes ]`
  - แต่ละ episode:
    - `title` (string)
    - `desc` (string)
    - `videoId` (YouTube id)
    - `questions` (array) ของ `{ q, o, a }`

- เพิ่มรายการคอร์สใน catalog:
  - `src/routes/pages.js` (เพื่อโชว์บนหน้า Home/Learn)
  - `src/controllers/courseController.js` (ถ้าต้องการเปลี่ยนรายละเอียด catalog ที่ API คืน)

