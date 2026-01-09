// src/socket.js
// Tiny helper to expose a single Socket.IO instance to HTTP routes
// without creating circular imports.

let ioRef = null;

function setIO(io) {
  ioRef = io;
}

function getIO() {
  return ioRef;
}

module.exports = { setIO, getIO };
