function requireLogin(req, res, next) {
  if (req.session?.user) return next();

  // ถ้าเป็น API / fetch / ajax
  if (
    req.originalUrl.startsWith('/api') ||
    req.headers.accept?.includes('application/json')
  ) {
    return res.status(401).json({
      success: false,
      msg: 'ต้องเข้าสู่ระบบก่อน'
    });
  }

  // ถ้าเป็น page
  return res.redirect('/login');
}

module.exports = { requireLogin };
