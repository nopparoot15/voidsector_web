// src/routes/whiteboard.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { whiteboardStore } = require('../whiteboard/store');

const router = express.Router();

// Lobby
router.get('/whiteboard', requireLogin, (req, res) => {
  res.render('pages/whiteboard-lobby');
});

// Public room
router.get('/whiteboard/public', requireLogin, (req, res) => {
  res.render('pages/whiteboard-room', {
    roomId: 'public',
    isPublic: true,
  });
});

// Private room
router.get('/whiteboard/r/:roomId', requireLogin, (req, res) => {
  const roomId = String(req.params.roomId || '');
  const me = Number(req.session.user?.id);
  const k = String(req.query.k || req.query.key || '');

  const room = whiteboardStore.get(roomId);
  if (!room || room.isPublic) return res.status(404).render('pages/notfound');
  // Allow entry via share-link key (no invite/friendship needed)
  const allowed = whiteboardStore.canAccess(roomId, me) || whiteboardStore.canAccessWithKey(roomId, me, k);
  if (!allowed) return res.status(403).render('pages/notfound');
  if (whiteboardStore.canAccessWithKey(roomId, me, k)) {
    // Persist access for this user (in-memory) once they joined via link.
    whiteboardStore.grant(roomId, me);
  }

  res.render('pages/whiteboard-room', {
    roomId,
    isPublic: false,
    joinKey: (k || (Number(room.ownerId) === Number(me) ? room.roomJoinKey : '')),
  });
});

module.exports = router;
