'use strict';
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../controllers/authController');

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/logout', auth.logout);

router.post('/auth/guest', (req, res) => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const guestId = 900000000 + Math.floor(Math.random() * 99999999);
  req.session.user = {
    id: guestId,
    username: `Guest${suffix}`,
    xp: 0,
    streak: 0,
    isGuest: true,
  };
  res.redirect('/arcade');
});

module.exports = router;
