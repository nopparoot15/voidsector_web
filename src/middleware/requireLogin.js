'use strict';

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.avatar === '/uploads/avatars/default.png') {
      req.session.user.avatar = null;
    }
    return next();
  }

  if (req.originalUrl.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อน' });
  }

  return res.redirect('/login');
}

function requireFullAccount(req, res, next) {
  if (!req.session || !req.session.user) return res.redirect('/login');
  return next();
}

module.exports = { requireLogin, requireFullAccount };
