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

  const room = whiteboardStore.get(roomId);
  if (!room || room.isPublic) return res.status(404).render('pages/notfound');
  if (!whiteboardStore.canAccess(roomId, me)) return res.status(403).render('pages/notfound');

  res.render('pages/whiteboard-room', {
    roomId,
    isPublic: false,
  });
});

module.exports = router;
