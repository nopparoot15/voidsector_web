'use strict';
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../controllers/authController');

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/logout', auth.logout);
router.get('/forgot-password', (req, res) => res.render('pages/forgot-password', { title: 'ลืมรหัสผ่าน', error: null, resetUrl: null, sent: false }));
router.post('/forgot-password', auth.forgotPassword);
router.get('/reset-password', auth.resetPassword);
router.post('/reset-password', auth.resetPassword);


module.exports = router;
