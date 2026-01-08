// src/routes/watchParty.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { watchPartyStore } = require('../watchparty/store');

const router = express.Router();

// Lobby
router.get('/watch', requireLogin, (req, res) => {
  // Show lobby (like whiteboard) with options: join public or create private
  watchPartyStore.ensurePublicRoom();
  res.render('pages/watch-lobby');
});

// Public room
router.get('/watch/public', requireLogin, (req, res) => {
  watchPartyStore.ensurePublicRoom();
  res.render('pages/watch-room', {
    roomId: 'public',
    isPublic: true,
  });
});

// Room
router.get('/watch/r/:roomId', requireLogin, (req, res) => {
  const roomId = String(req.params.roomId || '');
  const me = Number(req.session.user?.id);
  const k = String(req.query.k || req.query.key || '');

  // ensure public room is always available
  if (roomId === 'public') watchPartyStore.ensurePublicRoom();
  const room = watchPartyStore.get(roomId);
  if (!room) return res.status(404).render('pages/notfound');

  const allowed = watchPartyStore.canAccess(roomId, me) || watchPartyStore.canAccessWithKey(roomId, me, k);
  if (!allowed) return res.status(403).render('pages/notfound');
  if (!room.isPublic && watchPartyStore.canAccessWithKey(roomId, me, k)) watchPartyStore.grant(roomId, me);

  res.render('pages/watch-room', {
    roomId,
    isPublic: !!room.isPublic,
    joinKey: (k || (Number(room.ownerId) === Number(me) ? room.roomJoinKey : '')),
  });
});

module.exports = router;
