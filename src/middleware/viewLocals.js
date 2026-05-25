'use strict';

function viewLocals(req, res, next) {
  res.locals.user = (req.session && req.session.user) || null;
  res.locals.currentPath = req.path;
  next();
}

module.exports = { viewLocals };
