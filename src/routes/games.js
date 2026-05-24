'use strict';
const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/requireLogin');
const gameStore = require('../games/store');

const GAME_TYPES = { xo: 'XO', wordbomb: 'Word Bomb', trivia: 'Trivia', typerace: 'Typing Race', rps: 'Rock Paper Scissors', drawguess: 'Draw & Guess' };

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

module.exports = router;
