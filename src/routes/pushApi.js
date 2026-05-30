'use strict';
const express = require('express');
const { pool } = require('../config/db');
const { requireLogin } = require('../middleware/requireLogin');

const router = express.Router();

let webpush = null;
try {
  webpush = require('web-push');
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:system@voidsector.internal',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  } else {
    webpush = null;
  }
} catch { webpush = null; }

router.get('/push/vapid-key', (req, res) => {
  res.json({ ok: !!webpush, publicKey: process.env.VAPID_PUBLIC_KEY || null });
});

router.post('/push/subscribe', requireLogin, async (req, res) => {
  if (!webpush) return res.json({ ok: false, reason: 'push_not_configured' });
  const me = Number(req.session.user.id);
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys) return res.status(400).json({ ok: false });
  try {
    await pool.query(
      `INSERT INTO push_subscriptions(user_id, endpoint, keys_json)
       VALUES($1,$2,$3) ON CONFLICT(endpoint) DO UPDATE SET user_id=$1, keys_json=$3`,
      [me, endpoint, JSON.stringify(keys)]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

router.post('/push/unsubscribe', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  const { endpoint } = req.body;
  if (!endpoint) return res.status(400).json({ ok: false });
  await pool.query(`DELETE FROM push_subscriptions WHERE user_id=$1 AND endpoint=$2`, [me, endpoint]);
  res.json({ ok: true });
});

async function sendPush(userId, payload) {
  if (!webpush) return;
  try {
    const { rows } = await pool.query(
      `SELECT endpoint, keys_json FROM push_subscriptions WHERE user_id=$1`, [userId]
    );
    for (const row of rows) {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: JSON.parse(row.keys_json) },
          JSON.stringify(payload)
        );
      } catch (e) {
        if (e.statusCode === 410 || e.statusCode === 404) {
          await pool.query(`DELETE FROM push_subscriptions WHERE endpoint=$1`, [row.endpoint]).catch(() => {});
        }
      }
    }
  } catch {}
}

module.exports = { router, sendPush };
