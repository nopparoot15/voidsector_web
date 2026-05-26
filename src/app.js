'use strict';
const express = require('express');
const session = require('express-session');
const path = require('path');
const https = require('https');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const pgSession = require('connect-pg-simple')(session);
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const learnApiRoutes = require('./routes/api/learn');
const flashcardsApiRoutes = require('./routes/api/flashcards');
const whiteboardRoutes = require('./routes/whiteboard');
const whiteboardApiRoutes = require('./routes/whiteboardApi');
const watchPartyRoutes = require('./routes/watchParty');
const watchPartyApiRoutes = require('./routes/watchPartyApi');
const gamesRoutes  = require('./routes/games');
const feedApiRoutes = require('./routes/feedApi');
const friendsRoutes = require('./routes/friends');
const dmRoutes = require('./routes/dm');
const notifyRoutes = require('./routes/notify');
const { viewLocals } = require('./middleware/viewLocals');

function createApp() {
  const app = express();

  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  app.use(express.urlencoded({ extended: false, limit: '2mb' }));
  app.use(express.json({ limit: '2mb' }));

  const { pool: dbPool } = require('./config/db');
  app.use(session({
    store: new pgSession({
      pool: dbPool,
      tableName: 'session',
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || 'change-me-in-.env',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }));

  app.use(compression());
  app.use(viewLocals);
  app.use(express.static(path.join(__dirname, '../public'), { maxAge: '1h' }));

  app.get('/__health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
  app.use('/login', authLimiter);
  app.use('/register', authLimiter);

  app.use('/api', learnApiRoutes);
  app.use('/api', flashcardsApiRoutes);
  app.use('/api', whiteboardApiRoutes);
  app.use('/api', watchPartyApiRoutes);
  app.use('/', whiteboardRoutes);
  app.use('/', watchPartyRoutes);
  app.use('/', gamesRoutes);
  app.use('/api', feedApiRoutes);
  app.use('/api', notifyRoutes);
  app.use('/', dmRoutes);
  app.use('/', friendsRoutes);
  app.use('/', authRoutes);
  app.use('/', pageRoutes);

  // Code execution proxy — must be before 404 handler
  app.post('/api/run-code', (req, res) => {
    const { language, code, stdin = '' } = req.body || {};
    if (!code) return res.json({ output: '', error: 'Language not supported', exitCode: 1 });

    // C# → Rextester (.NET Core, supports C# 7+)
    if (language === 'csharp') {
      const params = new URLSearchParams({
        LanguageChoiceWrapper: '28',
        Program: code,
        Input: stdin || '',
        CompilerArgs: '',
      });
      const body = params.toString();
      const options = {
        hostname: 'rextester.com',
        path: '/rundotnet/api',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
      };
      const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => { data += chunk; });
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const out = parsed.Result || '';
            const err = parsed.Errors || '';
            res.json({ output: out, error: err, exitCode: err ? 1 : 0 });
          } catch {
            res.json({ output: data, error: '', exitCode: 0 });
          }
        });
      });
      apiReq.on('error', e => res.json({ output: '', error: e.message, exitCode: 1 }));
      apiReq.setTimeout(20000, () => { apiReq.destroy(); res.json({ output: '', error: 'Execution timeout', exitCode: 1 }); });
      apiReq.write(body);
      apiReq.end();
      return;
    }

    // Python / JavaScript → Wandbox
    const compilerMap = {
      python:     'cpython-3.12.7',
      javascript: 'nodejs-18.20.4',
    };
    const compiler = compilerMap[language];
    if (!compiler) return res.json({ output: '', error: 'Language not supported', exitCode: 1 });
    const body = JSON.stringify({ compiler, code, stdin: stdin || '' });
    const options = {
      hostname: 'wandbox.org',
      path: '/api/compile.json',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const apiReq = https.request(options, apiRes => {
      let data = '';
      apiRes.on('data', chunk => { data += chunk; });
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const out = parsed.program_output || '';
          const err = parsed.program_error || parsed.compiler_error || '';
          const code = parseInt(parsed.status ?? '0', 10);
          res.json({ output: out, error: err, exitCode: code });
        } catch {
          res.json({ output: data, error: '', exitCode: 0 });
        }
      });
    });
    apiReq.on('error', e => res.json({ output: '', error: e.message, exitCode: 1 }));
    apiReq.setTimeout(20000, () => { apiReq.destroy(); res.json({ output: '', error: 'Execution timeout', exitCode: 1 }); });
    apiReq.write(body);
    apiReq.end();
  });

  app.use((req, res) => res.status(404).render('pages/notfound', { title: '404' }));
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(500).render('pages/notfound', { title: 'Error' });
  });

  return app;
}

module.exports = { createApp };
