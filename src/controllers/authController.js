const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, msg: 'กรอกข้อมูลไม่ครบ' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users(username, password) VALUES($1, $2)', [username, hashed]);
    return res.json({ success: true, msg: 'สมัครสมาชิกสำเร็จ!' });
  } catch (err) {
    return res.status(409).json({ success: false, msg: 'Username นี้ถูกใช้ไปแล้ว' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, msg: 'กรอกข้อมูลไม่ครบ' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, msg: 'ไม่พบผู้ใช้' });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, msg: 'รหัสผ่านไม่ถูกต้อง' });

    req.session.user = { id: user.id, username: user.username };
    return res.json({ success: true, msg: 'เข้าสู่ระบบสำเร็จ', username: user.username });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'เกิดข้อผิดพลาด' });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.json({ success: true }));
}

module.exports = { register, login, logout };
