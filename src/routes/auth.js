'use strict';
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../controllers/authController');

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/logout', auth.logout);


module.exports = router;
