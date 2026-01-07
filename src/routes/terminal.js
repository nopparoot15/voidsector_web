// src/routes/terminal.js
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/requireLogin');

router.get('/terminal', requireLogin, (req, res) => {
  res.render('pages/terminal', {
    user: req.session?.user || null
  });
});

module.exports = router;
