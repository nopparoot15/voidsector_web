// src/whiteboard/store.js
// In-memory realtime whiteboard room store.
// Rooms auto-delete when empty (except the public room, which resets when empty).

const crypto = require('crypto');

const MAX_EVENTS = 5000;

function makeRoomId() {
  // short URL-safe id
  return crypto.randomBytes(6).toString('base64url');
}

class WhiteboardStore {
  constructor() {
    this.rooms = new Map();
    // public room is special
    this.ensurePublic();
  }

  ensurePublic() {
    if (!this.rooms.has('public')) {
      this.rooms.set('public', {
        id: 'public',
        isPublic: true,
        ownerId: null,
        allowed: null, // null => anyone logged-in
        history: [],
        presence: new Map(), // socketId -> userId
        createdAt: Date.now(),
      });
    }
  }

  get(roomId) {
    return this.rooms.get(String(roomId));
  }

  exists(roomId) {
    return this.rooms.has(String(roomId));
  }

  createPrivateRoom(ownerId) {
    const id = makeRoomId();
    const allowed = new Set([Number(ownerId)]);
    this.rooms.set(id, {
      id,
      isPublic: false,
      ownerId: Number(ownerId),
      // Anyone with this key can join via share link (no invite/friendship needed).
      // Still requires login (we keep requireLogin on pages/APIs).
      roomJoinKey: crypto.randomBytes(16).toString('base64url'),
      allowed,
      history: [],
      presence: new Map(),
      createdAt: Date.now(),
    });
    return id;
  }

  // Validate share-link key for private rooms
  canAccessWithKey(roomId, userId, key) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return false;
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return false;
    const k = String(key || '');
    return !!(k && room.roomJoinKey && k === room.roomJoinKey);
  }

  // Grant access to a user (used after join via share-link)
  grant(roomId, userId) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return;
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return;
    room.allowed?.add(uid);
  }

  rotateJoinKey(roomId, actorUserId) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return { ok: false, reason: 'not_found' };
    if (Number(room.ownerId) !== Number(actorUserId)) return { ok: false, reason: 'not_owner' };
    room.roomJoinKey = crypto.randomBytes(16).toString('base64url');
    return { ok: true, roomJoinKey: room.roomJoinKey };
  }

  canAccess(roomId, userId) {
    const room = this.get(roomId);
    if (!room) return false;
    if (room.isPublic) return Number.isFinite(Number(userId));
    if (!Number.isFinite(Number(userId))) return false;
    return room.allowed?.has(Number(userId)) || Number(room.ownerId) === Number(userId);
  }

  invite(roomId, actorUserId, friendIds = []) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return { ok: false, reason: 'not_found' };
    if (Number(room.ownerId) !== Number(actorUserId)) return { ok: false, reason: 'not_owner' };
    const ids = (Array.isArray(friendIds) ? friendIds : [])
      .map(n => Number(n))
      .filter(n => Number.isFinite(n) && n > 0);
    for (const id of ids) room.allowed.add(id);
    return { ok: true, added: ids.length };
  }

  addPresence(roomId, socketId, userId) {
    const room = this.get(roomId);
    if (!room) return;
    room.presence.set(socketId, Number(userId));
  }

  removePresence(roomId, socketId) {
    const room = this.get(roomId);
    if (!room) return { deleted: false };
    room.presence.delete(socketId);

    if (room.presence.size === 0) {
      if (roomId === 'public') {
        // reset public room
        room.history = [];
        return { deleted: false, reset: true };
      }
      this.rooms.delete(roomId);
      return { deleted: true };
    }
    return { deleted: false };
  }

  appendEvent(roomId, evt) {
    const room = this.get(roomId);
    if (!room) return;
    room.history.push(evt);
    if (room.history.length > MAX_EVENTS) {
      room.history.splice(0, room.history.length - MAX_EVENTS);
    }
  }

  clear(roomId) {
    const room = this.get(roomId);
    if (!room) return;
    room.history = [];
  }

  undoLastStroke(roomId, userId) {
    const room = this.get(roomId);
    if (!room || !Array.isArray(room.history) || room.history.length === 0) return null;
    const uid = Number(userId);
    for (let i = room.history.length - 1; i >= 0; i--) {
      const evt = room.history[i];
      if (!evt || evt.t !== 'stroke') continue;
      if (Number(evt.userId) !== uid) continue;
      const removed = room.history.splice(i, 1)[0];
      return removed?.id || null;
    }
    return null;
  }
}

const whiteboardStore = new WhiteboardStore();

module.exports = { whiteboardStore };
