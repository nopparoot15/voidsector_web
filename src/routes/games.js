'use strict';
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/requireLogin');
const gameStore = require('../games/store');
const { pool } = require('../config/db');

const GAME_TYPES = { xo: 'XO', wordbomb: 'Word Bomb', trivia: 'Trivia', typerace: 'Typing Race', rps: 'Rock Paper Scissors', drawguess: 'Draw & Guess', spyfall: 'Spyfall', checkers: 'หมากฮอส' };

router.get('/arcade', requireLogin, (req, res) => {
  res.render('pages/arcade', { title: 'Arcade' });
});

router.get('/arcade/:gameType/rooms', requireLogin, (req, res) => {
  const { gameType } = req.params;
  if (!GAME_TYPES[gameType]) return res.status(404).json({ error: 'Unknown game' });
  res.json({ rooms: gameStore.list(gameType) });
});

router.post('/arcade/:gameType/create', requireLogin, (req, res) => {
  const { gameType } = req.params;
  if (!GAME_TYPES[gameType]) return res.status(404).json({ error: 'Unknown game' });
  const { id: userId, username } = req.session.user;
  const room = gameStore.create(gameType, userId, username);
  res.json({ roomId: room.id });
});

router.get('/arcade/:gameType/:roomId', requireLogin, (req, res) => {
  const { gameType, roomId } = req.params;
  if (!GAME_TYPES[gameType]) return res.status(404).render('pages/notfound', { title: '404' });
  const room = gameStore.get(roomId);
  if (!room || room.gameType !== gameType) return res.status(404).render('pages/notfound', { title: 'ไม่พบห้อง' });
  res.render(`pages/game-${gameType}`, {
    title: `${GAME_TYPES[gameType]} — ห้อง ${roomId}`,
    roomId,
    gameType,
  });
});

router.post('/api/games/invite', requireLogin, async (req, res) => {
  const me = Number(req.session.user.id);
  const friendId = Number(req.body.friendId);
  const { roomId, gameType } = req.body;
  if (!friendId || !roomId || !GAME_TYPES[gameType]) return res.json({ ok: false });

  const room = gameStore.get(String(roomId).toUpperCase());
  if (!room || room.gameType !== gameType) return res.json({ ok: false, reason: 'room_not_found' });

  const { rows: [friendship] } = await pool.query(
    `SELECT 1 FROM friendships WHERE user_id=$1 AND friend_user_id=$2`,
    [me, friendId]
  );
  if (!friendship) return res.json({ ok: false, reason: 'not_friends' });

  req.app.get('io')?.to(`user:${friendId}`).emit('gm:invite', {
    from_user_id: me,
    from_username: req.session.user.username,
    gameType,
    game_label: GAME_TYPES[gameType],
    roomId: room.id,
  });

  res.json({ ok: true });
});

module.exports = router;
