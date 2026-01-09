// src/watchparty/store.js
// In-memory realtime "watch party" room store.
// Rooms auto-delete when empty.
//
// ULTRA SYNC NOTE:
// State is server-authoritative and MUST include:
//  { url, provider, isPlaying, t, ts, seq }
// Where:
//  - t  = base playback time (seconds) at moment ts was captured
//  - ts = server Date.now() when state was written
//  - seq increments EVERY update
//
// This makes late-joiners sync instantly: expectedTime = t + (now - ts) if playing.

const crypto = require('crypto');

function makeRoomId() {
  return crypto.randomBytes(6).toString('base64url');
}

function clampNum(n, min, max, fallback) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, x));
}

function nowMs() {
  return Date.now();
}

class WatchPartyStore {
  constructor() {
    this.rooms = new Map();
    // Always-on public room (no create step needed)
    this.ensurePublicRoom(); // ✅ fixed name
  }

  get(roomId) {
    return this.rooms.get(String(roomId));
  }

  // --- internal: create base state ---
  _makeInitialState() {
    return {
      url: '',
      provider: 'generic', // youtube|vimeo|html5|generic
      isPlaying: false,
      t: 0,      // base time in seconds at moment ts
      ts: nowMs(),
      seq: 0,
    };
  }

  createRoom({ ownerId, isPublic }) {
    const id = makeRoomId();
    const roomJoinKey = crypto.randomBytes(16).toString('base64url');
    const owner = Number(ownerId) || null;

    this.rooms.set(id, {
      id,
      isPublic: !!isPublic,
      ownerId: owner,
      roomJoinKey,
      allowed: new Set(owner ? [owner] : []),
      presence: new Map(), // socketId -> userId
      state: this._makeInitialState(),
      createdAt: nowMs(),
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
      state: this._makeInitialState(),
      createdAt: nowMs(),
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
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n > 0);

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

    // Public room persists forever
    if (String(roomId) === 'public') return { deleted: false };

    if (room.presence.size === 0) {
      this.rooms.delete(String(roomId));
      return { deleted: true };
    }
    return { deleted: false };
  }

  // --- internal: compute "current playback time now" from state ---
  _currentTimeFromState(st, now = nowMs()) {
    const base = clampNum(st?.t, 0, 1e7, 0);
    const ts = clampNum(st?.ts, 0, 9e15, now);
    if (!st?.isPlaying) return base;
    const elapsed = Math.max(0, (now - ts) / 1000);
    return base + elapsed;
  }

  // --- internal: sanitize patch ---
  _sanitizePatch(patch = {}) {
    const out = {};
    if (patch && typeof patch === 'object') {
      if (typeof patch.url === 'string') out.url = patch.url.slice(0, 2000);
      if (typeof patch.provider === 'string') out.provider = patch.provider.slice(0, 16);
      if (typeof patch.isPlaying === 'boolean') out.isPlaying = patch.isPlaying;
      if (patch.t !== undefined) out.t = clampNum(patch.t, 0, 1e7, 0);
    }
    return out;
  }

  // Server-authoritative state update
  // This function ensures:
  // - seq increments every call
  // - ts updated every call
  // - if currently playing, we first "advance" base time to now (prevents drift)
  // - then apply patch, and set base time appropriately
  setState(roomId, patch) {
    const room = this.get(roomId);
    if (!room) return null;

    const now = nowMs();
    const prev = room.state || this._makeInitialState();
    const clean = this._sanitizePatch(patch);

    // First, normalize current time to now if it was playing
    let baseNow = this._currentTimeFromState(prev, now);

    // Start from previous values
    const next = { ...prev };

    // Apply URL change: reset timeline to 0 and paused by default unless caller sets isPlaying/t
    if (clean.url && clean.url !== prev.url) {
      next.url = clean.url;
      next.provider = clean.provider || prev.provider || 'generic';
      baseNow = 0;
      next.isPlaying = false;
    }

    // Apply seek: set base time directly
    if (clean.t !== undefined) {
      baseNow = clean.t;
    }

    // Apply play/pause
    if (clean.isPlaying !== undefined) {
      next.isPlaying = clean.isPlaying;
    }

    // Commit base time and timestamp
    next.t = baseNow;
    next.ts = now;
    next.seq = (Number(prev.seq) || 0) + 1;

    room.state = next;
    return room.state;
  }
}

const watchPartyStore = new WatchPartyStore();

module.exports = { watchPartyStore };
