const express = require('express');
const router = express.Router();
const { Readable } = require('stream');
const { requireLogin } = require('../middleware/requireLogin');

const FAHSAI_URL = (process.env.FAHSAI_API_URL || '').replace(/\/$/, '');
const FAHSAI_KEY = process.env.FAHSAI_API_KEY || 'fahsai-local-key';

// GET /fahsai — chat page
router.get('/fahsai', requireLogin, (req, res) => {
  const online = Boolean(FAHSAI_URL);
  res.render('pages/fahsai', { online });
});

// POST /api/fahsai/chat — proxy to local Fahsai server, stream SSE back
router.post('/api/fahsai/chat', requireLogin, async (req, res) => {
  if (!FAHSAI_URL) {
    return res.status(503).json({ error: 'FAHSAI_API_URL not configured' });
  }

  const { message, history } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message required' });
  }

  let fahsaiRes;
  try {
    fahsaiRes = await fetch(`${FAHSAI_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': FAHSAI_KEY,
      },
      body: JSON.stringify({
        message: message.trim(),
        history: Array.isArray(history) ? history.slice(-20) : [],
      }),
    });
  } catch (err) {
    console.error('[fahsai] fetch error:', err.message);
    return res.status(502).json({ error: 'Cannot reach Fahsai server — is the tunnel running?' });
  }

  if (!fahsaiRes.ok) {
    const body = await fahsaiRes.text().catch(() => '');
    return res.status(fahsaiRes.status).json({ error: body || 'Fahsai error' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders(); // send headers immediately so browser starts reading

  // Convert WHATWG ReadableStream (Node 18 fetch) → Node.js Readable → pipe to response
  try {
    const nodeStream = Readable.fromWeb(fahsaiRes.body);
    nodeStream.pipe(res);
    nodeStream.on('error', () => { if (!res.writableEnded) res.end(); });
    res.on('close', () => nodeStream.destroy());
  } catch (e) {
    console.error('[fahsai] stream error:', e.message);
    if (!res.writableEnded) res.end();
  }
});

// GET /api/fahsai/status — check if server is reachable
router.get('/api/fahsai/status', requireLogin, async (req, res) => {
  if (!FAHSAI_URL) return res.json({ online: false, reason: 'not configured' });
  try {
    const r = await fetch(`${FAHSAI_URL}/health`, { signal: AbortSignal.timeout(4000) });
    const data = await r.json();
    res.json({ online: data.llm_loaded === true, ...data });
  } catch {
    res.json({ online: false, reason: 'unreachable' });
  }
});

module.exports = router;
