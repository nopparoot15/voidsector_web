const { pool } = require('../config/db');

module.exports = async function viewLocals(req, res, next) {
  try {
    res.locals.currentPath = req.path;

    // Default
    res.locals.user = null;

    if (!req.session?.user?.id) return next();

    // If session already has avatar_path, we still refresh username/avatar in case it changed.
    const { rows } = await pool.query(
      'SELECT id, username, avatar_path, bio FROM users WHERE id=$1',
      [req.session.user.id]
    );

    if (!rows.length) {
      // Stale session
      req.session.user = null;
      return next();
    }

    const u = rows[0];
    // Keep session light but in sync for navbar
    req.session.user = {
      id: u.id,
      username: u.username,
      avatar_path: u.avatar_path || null,
    };

    res.locals.user = {
      ...req.session.user,
      bio: u.bio || null,
    };

    return next();
  } catch (err) {
    // Don't break page rendering if DB is down
    res.locals.user = req.session?.user || null;
    return next();
  }
};
