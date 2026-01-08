const express = require('express');
const path = require('path');
const multer = require('multer');
const { requireLogin } = require('../middleware/requireLogin');
const { pool } = require('../config/db');

const router = express.Router();

const AVATAR_DIR = path.join(__dirname, '../../public/uploads/avatars');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure folder exists
    require('fs').mkdirSync(AVATAR_DIR, { recursive: true });
    cb(null, AVATAR_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `u${req.session.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.get('/profile', requireLogin, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT username, avatar_path, bio FROM users WHERE id=$1',
    [req.session.user.id]
  );
  res.render('pages/profile', { profile: rows[0] });
});

router.post('/profile/avatar', requireLogin, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.redirect('/profile');
  const avatar = `/uploads/avatars/${req.file.filename}`;
  await pool.query('UPDATE users SET avatar_path=$1 WHERE id=$2', [
    avatar,
    req.session.user.id
  ]);
  // Keep session in sync so navbar updates immediately
  req.session.user.avatar_path = avatar;
  res.redirect('/profile');
});

module.exports = router;
