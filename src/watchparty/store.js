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
    // Always-on public room (no create step needed)
    this.ensurePublicRoom();
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
      hostUserId: Number(ownerId) || null,
      // Shared state (server is source of truth)
      state: {
        url: '',
        provider: 'generic', // youtube|vimeo|html5|generic
        isPlaying: false,
        t: 0,               // seconds
        updatedAt: Date.now(),
        seq: 0,             // monotonically increasing state version
      },
      createdAt: Date.now(),
    });
    return id;
  }

  ensurePublicRoom() {
    const id = 'public';
    if (this.rooms.has(id)) return id;
    this.rooms.set(id, {
      id,
      isPublic: true,
      ownerId: null,
      roomJoinKey: null,
      allowed: new Set(),
      presence: new Map(),
      hostUserId: null,
      state: {
        url: '',
        provider: 'generic',
        isPlaying: false,
        t: 0,
        updatedAt: Date.now(),
        seq: 0,
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
    // Re-elect host if the host left (public rooms may have host).
    if (room.hostUserId && !Array.from(room.presence.values()).includes(Number(room.hostUserId))) {
      room.hostUserId = Array.from(room.presence.values())[0] || null;
    }
    // Public room persists forever
    if (String(roomId) === 'public') return { deleted: false };
    if (room.presence.size === 0) {
      this.rooms.delete(String(roomId));
      return { deleted: true };
    }
    return { deleted: false };
  }

  setState(roomId, patch, actorUserId = null) {
    const room = this.get(roomId);
    if (!room) return null;

    // If this is a public room and no host is set yet, the first actor becomes host.
    const actor = Number(actorUserId);
    if (room.isPublic && !room.hostUserId && Number.isFinite(actor) && actor > 0) {
      room.hostUserId = actor;
    }

    const nextSeq = (Number(room.state?.seq) || 0) + 1;
    room.state = {
      ...room.state,
      ...patch,
      updatedAt: Date.now(),
      seq: nextSeq,
    };
    return room.state;
  }
}

const watchPartyStore = new WatchPartyStore();

module.exports = { watchPartyStore };
