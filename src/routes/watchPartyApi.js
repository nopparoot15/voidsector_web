// src/routes/watchPartyApi.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { watchPartyStore } = require('../watchparty/store');
const { pool } = require('../config/db');

const router = express.Router();

// Create watch party room (public/private)
router.post('/watch/rooms', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const isPublic = !!req.body?.isPublic;
  const roomId = watchPartyStore.createRoom({ ownerId: me, isPublic });
  const room = watchPartyStore.get(roomId);
  const joinKey = room?.roomJoinKey || null;
  const origin = `${req.protocol}://${req.get('host')}`;
  const shareUrl = room?.isPublic
    ? `${origin}/watch/r/${encodeURIComponent(roomId)}`
    : `${origin}/watch/r/${encodeURIComponent(roomId)}?k=${encodeURIComponent(joinKey)}`;
  res.json({ ok: true, roomId, isPublic, joinKey, shareUrl });
});

// Invite friends to private room (owner only)
router.post('/watch/rooms/:roomId/invite', requireLogin, async (req, res) => {
  try {
    const me = Number(req.session.user.id);
    const roomId = String(req.params.roomId);
    const friendIds = Array.isArray(req.body?.friendIds) ? req.body.friendIds : [];

    const room = watchPartyStore.get(roomId);
    if (!room || room.isPublic) return res.status(404).json({ ok: false, reason: 'not_found' });
    if (Number(room.ownerId) !== me) return res.status(403).json({ ok: false, reason: 'not_owner' });

    const ids = friendIds.map(n => Number(n)).filter(n => Number.isFinite(n) && n > 0);
    if (ids.length === 0) return res.status(400).json({ ok: false, reason: 'no_targets' });

    // Verify they are actually friends (friendships is directed: user_id -> friend_user_id)
    const q = await pool.query(
      `SELECT friend_user_id AS id
       FROM friendships
       WHERE user_id=$1 AND friend_user_id = ANY($2::int[])`,
      [me, ids]
    );
    const okIds = q.rows.map(r => Number(r.id)).filter(Boolean);
    if (okIds.length === 0) return res.status(400).json({ ok: false, reason: 'not_friends' });

    const out = watchPartyStore.invite(roomId, me, okIds);

    // Notify each invited friend in real-time
    const io = req.app.get('io');
    if (io) {
      const origin = `${req.protocol}://${req.get('host')}`;
      const room2 = watchPartyStore.get(roomId);
      const joinUrl = room2?.roomJoinKey
        ? `${origin}/watch/r/${encodeURIComponent(roomId)}?k=${encodeURIComponent(room2.roomJoinKey)}`
        : `${origin}/watch/r/${encodeURIComponent(roomId)}`;
      const from_username = req.session.user.username;
      const from_user_id = me;
      for (const toId of okIds) {
        io.to(`user:${toId}`).emit('wp:invite_notify', {
          roomId,
          from_user_id,
          from_username,
          join_url: joinUrl,
          at: new Date().toISOString(),
        });
      }
    }

    res.json({ ok: true, added: out.added, friendIds: okIds });
  } catch (e) {
    console.warn('watch invite failed:', e.code || e.message);
    res.status(500).json({ ok: false, reason: 'server_error' });
  }
});

// Rotate share-key (owner only)
router.post('/watch/rooms/:roomId/rotate-key', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = String(req.params.roomId);
  const out = watchPartyStore.rotateJoinKey(roomId, me);
  if (!out.ok) {
    const code = out.reason === 'not_owner' ? 403 : 404;
    return res.status(code).json({ ok: false, reason: out.reason });
  }
  const origin = `${req.protocol}://${req.get('host')}`;
  const shareUrl = `${origin}/watch/r/${encodeURIComponent(roomId)}?k=${encodeURIComponent(out.roomJoinKey)}`;
  res.json({ ok: true, roomId, joinKey: out.roomJoinKey, shareUrl });
});

// Basic room info
router.get('/watch/rooms/:roomId', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = String(req.params.roomId);
  const k = String(req.query.k || req.query.key || '');
  const room = watchPartyStore.get(roomId);
  if (!room) return res.status(404).json({ ok: false, reason: 'not_found' });

  const allowed = watchPartyStore.canAccess(roomId, me) || watchPartyStore.canAccessWithKey(roomId, me, k);
  if (!allowed) return res.status(403).json({ ok: false, reason: 'forbidden' });
  if (!room.isPublic && watchPartyStore.canAccessWithKey(roomId, me, k)) watchPartyStore.grant(roomId, me);

  res.json({
    ok: true,
    room: {
      id: room.id,
      isPublic: !!room.isPublic,
      ownerId: room.ownerId,
      shareEnabled: !room.isPublic,
      membersOnline: room.presence?.size || 0,
      state: room.state,
    }
  });
});

module.exports = router;
