'use strict';
const crypto = require('crypto');

const rooms = new Map();

function genId() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function create(gameType, hostUserId, hostUsername) {
  let id;
  do { id = genId(); } while (rooms.has(id));
  const room = {
    id,
    gameType,
    host: hostUserId,
    players: [{ userId: hostUserId, username: hostUsername }],
    status: 'waiting',
    state: {},
    timers: {},
    createdAt: Date.now(),
  };
  rooms.set(id, room);
  setTimeout(() => {
    clearAllTimers(id);
    rooms.delete(id);
  }, 3 * 60 * 60 * 1000);
  return room;
}

function get(id) { return rooms.get(id) || null; }

function addPlayer(id, userId, username) {
  const room = rooms.get(id);
  if (!room) return null;
  if (!room.players.find(p => p.userId === userId)) {
    room.players.push({ userId, username });
  }
  return room;
}

function removePlayer(id, userId) {
  const room = rooms.get(id);
  if (!room) return;
  room.players = room.players.filter(p => p.userId !== userId);
  if (room.players.length === 0) {
    clearAllTimers(id);
    rooms.delete(id);
  }
  return room;
}

function clearAllTimers(id) {
  const room = rooms.get(id);
  if (!room) return;
  Object.values(room.timers).forEach(t => clearTimeout(t));
  room.timers = {};
}

function setTimer(id, key, fn, ms) {
  const room = rooms.get(id);
  if (!room) return;
  if (room.timers[key]) clearTimeout(room.timers[key]);
  room.timers[key] = setTimeout(fn, ms);
}

function clearTimer(id, key) {
  const room = rooms.get(id);
  if (!room) return;
  if (room.timers[key]) { clearTimeout(room.timers[key]); delete room.timers[key]; }
}

module.exports = { create, get, addPlayer, removePlayer, setTimer, clearTimer, clearAllTimers };
