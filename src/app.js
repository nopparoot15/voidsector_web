// src/app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const terminalRoutes = require('./routes/terminal');
const profileRoutes = require('./routes/profile');
const friendsRoutes = require('./routes/friends');
const dmRoutes = require('./routes/dm');
const notifyRoutes = require('./routes/notify');
const quizRoutes = require('./routes/quiz');
const feedApiRoutes = require('./routes/feedApi');
const whiteboardApiRoutes = require('./routes/whiteboardApi');
const whiteboardPageRoutes = require('./routes/whiteboard');
const watchPartyApiRoutes = require('./routes/watchPartyApi');
const watchPartyPageRoutes = require('./routes/watchParty');
const fahsaiRoutes = require('./routes/fahsai');
const viewLocals = require('./middleware/viewLocals');
const { requireLogin } = require('./middleware/requireLogin');

function createApp() {
  const app = express();

  // If deployed behind a reverse proxy (Render/Heroku/Nginx), enable this.
  if (process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
  }

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'change-me-in-.env',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  }));

  app.use(viewLocals);

  // --------------------
  // static
  // --------------------
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

  // --------------------
  // vendor: xterm (serve from node_modules)
  // --------------------
  const xtermDir = path.join(__dirname, '../node_modules/xterm');
  const fitDir = path.join(__dirname, '../node_modules/xterm-addon-fit');

  try {
    const xtermExists = fs.existsSync(xtermDir);
    const fitExists = fs.existsSync(fitDir);
    console.log('✅ vendor xterm dir:', xtermDir, 'exists=', xtermExists);
    console.log('✅ vendor fit dir:', fitDir, 'exists=', fitExists);
  } catch (e) {
    console.warn('⚠️ vendor dir check failed:', e.message);
  }

  app.use('/vendor/xterm', express.static(xtermDir));
  app.use('/vendor/xterm-addon-fit', express.static(fitDir));
  // --------------------
  // vendor: mathjs (calculator)
  // --------------------
  const mathjsDir = path.join(__dirname, "../node_modules/mathjs/lib/browser");
  app.use("/vendor/mathjs", express.static(mathjsDir));


  // --------------------
  // health check (confirm deploy)
  // --------------------
  app.get('/__health', (req, res) => {
    res.json({
      ok: true,
      env: process.env.NODE_ENV || 'unknown',
      trustProxy: app.get('trust proxy') ? true : false,
      time: new Date().toISOString(),
    });
  });

  // --------------------
  // Pages
  // --------------------

  // DM page (render)
  // GET /dm?friend=<id>
  app.get('/dm', requireLogin, (req, res) => {
    const friendId = Number(req.query.friend);
    if (!friendId) return res.redirect('/');
    res.render('pages/dm', { friendId });
  });

  // --------------------
  // routes
  // --------------------
  app.use('/api', apiRoutes);

  // ✅ API routes for DM + Friends
  app.use('/api', dmRoutes);          // /api/dm/open, /api/dm/rooms/:id/messages
  app.use('/api', friendsRoutes);     // /api/friends/...

  // ✅ notifications (badges / dropdown)
  app.use('/api', notifyRoutes);      // /api/notify/summary

  // ✅ quiz scores + leaderboard
  app.use('/api', quizRoutes);        // /api/quiz/submit, /api/quiz/leaderboard

  // ✅ feed (posts + media uploads)
  // /api/feed
  app.use('/api', feedApiRoutes);

  // ✅ realtime whiteboard rooms
  app.use('/api', whiteboardApiRoutes);

  // ✅ watch party rooms (sync video)
  app.use('/api', watchPartyApiRoutes);

  app.use('/', authRoutes);
  app.use(terminalRoutes);
  app.use('/', profileRoutes);
  app.use('/', fahsaiRoutes);

  // pages last
  app.use('/', pageRoutes);

  // whiteboard pages
  app.use('/', whiteboardPageRoutes);

  // watch party pages
  app.use('/', watchPartyPageRoutes);

  // 404 fallback
  app.use((req, res) => res.status(404).render('pages/notfound'));

  // basic error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(500).render('pages/notfound');
  });

  return app;
}

module.exports = { createApp };
