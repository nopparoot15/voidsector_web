'use strict';

function requireLogin(req, res, next) {
  if (req.session && req.session.user) return next();

  if (req.originalUrl.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }

  return res.redirect('/login');
}

module.exports = { requireLogin };
