'use strict';
const express = require('express');
const session = require('express-session');
const path = require('path');

const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const learnApiRoutes = require('./routes/api/learn');
const flashcardsApiRoutes = require('./routes/api/flashcards');
const whiteboardRoutes = require('./routes/whiteboard');
const whiteboardApiRoutes = require('./routes/whiteboardApi');
const watchPartyRoutes = require('./routes/watchParty');
const watchPartyApiRoutes = require('./routes/watchPartyApi');
const { viewLocals } = require('./middleware/viewLocals');

function createApp() {
  const app = express();

  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

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
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('/__health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  app.use('/api', learnApiRoutes);
  app.use('/api', flashcardsApiRoutes);
  app.use('/api', whiteboardApiRoutes);
  app.use('/api', watchPartyApiRoutes);
  app.use('/', whiteboardRoutes);
  app.use('/', watchPartyRoutes);
  app.use('/', authRoutes);
  app.use('/', pageRoutes);

  app.use((req, res) => res.status(404).render('pages/notfound', { title: '404' }));
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(500).render('pages/notfound', { title: 'Error' });
  });

  return app;
}

module.exports = { createApp };
