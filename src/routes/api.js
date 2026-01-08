// src/routes/api.js
const express = require('express');
const auth = require('../controllers/authController');
const course = require('../controllers/courseController');

const router = express.Router();

// AUTH (API only)
// Aliases for older frontend scripts (/api/login, /api/register)
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.post('/auth/logout', auth.logout);

// COURSES (API)
router.get('/courses', course.listCourses);
router.get('/courses/:category', course.getCourse);

module.exports = router;
