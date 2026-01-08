// src/watchparty/store.js
// In-memory realtime "watch party" room store.
// Rooms auto-delete when empty.

const crypto = require('crypto');

function makeRoomId() {
  return crypto.randomBytes(6).toString('base64url');
}

class WatchPartyStore {
  constructor() {
    this.rooms = new Map();
  }

  get(roomId) {
    return this.rooms.get(String(roomId));
  }

  createRoom({ ownerId, isPublic }) {
    const id = makeRoomId();
    const roomJoinKey = crypto.randomBytes(16).toString('base64url');
    this.rooms.set(id, {
      id,
      isPublic: !!isPublic,
      ownerId: Number(ownerId) || null,
      roomJoinKey,
      allowed: new Set([Number(ownerId)]),
      presence: new Map(), // socketId -> userId
      // Shared state (server is source of truth)
      state: {
        url: '',
        provider: 'generic', // youtube|vimeo|html5|generic
        isPlaying: false,
        t: 0,               // seconds
        updatedAt: Date.now(),
      },
      createdAt: Date.now(),
    });
    return id;
  }

  canAccess(roomId, userId) {
    const room = this.get(roomId);
    if (!room) return false;
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return false;
    if (room.isPublic) return true;
    return room.allowed?.has(uid) || Number(room.ownerId) === uid;
  }

  canAccessWithKey(roomId, userId, key) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return false;
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return false;
    const k = String(key || '');
    return !!(k && room.roomJoinKey && k === room.roomJoinKey);
  }

  grant(roomId, userId) {
    const room = this.get(roomId);
    if (!room || room.isPublic) return;
    const uid = Number(userId);
    if (!Number.isFinite(uid) || uid <= 0) return;
    room.allowed?.add(uid);
  }

  rotateJoinKey(roomId, actorUserId) {
    const room = this.get(roomId);
    if (!room) return { ok: false, reason: 'not_found' };
    if (Number(room.ownerId) !== Number(actorUserId)) return { ok: false, reason: 'not_owner' };
    room.roomJoinKey = crypto.randomBytes(16).toString('base64url');
    return { ok: true, roomJoinKey: room.roomJoinKey };
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
      this.rooms.delete(String(roomId));
      return { deleted: true };
    }
    return { deleted: false };
  }

  setState(roomId, patch) {
    const room = this.get(roomId);
    if (!room) return null;
    room.state = {
      ...room.state,
      ...patch,
      updatedAt: Date.now(),
    };
    return room.state;
  }
}

const watchPartyStore = new WatchPartyStore();

module.exports = { watchPartyStore };
