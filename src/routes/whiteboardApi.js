// src/routes/whiteboardApi.js
const express = require('express');
const { requireLogin } = require('../middleware/requireLogin');
const { whiteboardStore } = require('../whiteboard/store');

const router = express.Router();

// Create private room
router.post('/whiteboard/rooms', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = whiteboardStore.createPrivateRoom(me);
  res.json({ ok: true, roomId });
});

// Invite friends to private room (owner only)
router.post('/whiteboard/rooms/:roomId/invite', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = String(req.params.roomId);
  const friendIds = req.body?.friendIds;

  const out = whiteboardStore.invite(roomId, me, friendIds);
  if (!out.ok) {
    const code = out.reason === 'not_owner' ? 403 : 404;
    return res.status(code).json({ ok: false, reason: out.reason });
  }
  res.json(out);
});

// Basic room info (for UI)
router.get('/whiteboard/rooms/:roomId', requireLogin, (req, res) => {
  const me = Number(req.session.user.id);
  const roomId = String(req.params.roomId);
  const room = whiteboardStore.get(roomId);
  if (!room) return res.status(404).json({ ok: false, reason: 'not_found' });
  if (!room.isPublic && !whiteboardStore.canAccess(roomId, me)) {
    return res.status(403).json({ ok: false, reason: 'forbidden' });
  }
  res.json({
    ok: true,
    room: {
      id: room.id,
      isPublic: !!room.isPublic,
      ownerId: room.ownerId,
      membersOnline: room.presence?.size || 0,
    }
  });
});

module.exports = router;
