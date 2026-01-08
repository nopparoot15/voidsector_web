// src/routes/watchPartyApi.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { watchPartyStore } = require('../watchparty/store');

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
      membersOnline: room.presence?.size || 0,
      state: room.state,
    }
  });
});

module.exports = router;
