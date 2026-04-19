import { getSocketInstance } from '../../config/socket.js';

// =========================
// PUSH SERVICE (REALTIME LAYER)
// =========================

const getIO = () => {
  const io = getSocketInstance();

  if (!io) {
    throw new Error('Socket.IO no inicializado');
  }

  return io;
};

export const pushService = {
  // =========================
  // ENVIAR A USUARIO
  // =========================
  sendToUser(userId, event, payload) {
    try {
      const io = getIO();

      io.to(`user:${userId}`).emit(event, payload);

      return true;
    } catch (error) {
      console.error('push.sendToUser error:', error.message);
      return false;
    }
  },

  // =========================
  // BROADCAST GLOBAL
  // =========================
  broadcast(event, payload) {
    try {
      const io = getIO();

      io.emit(event, payload);

      return true;
    } catch (error) {
      console.error('push.broadcast error:', error.message);
      return false;
    }
  },

  // =========================
  // ENVIAR A ROOM
  // =========================
  sendToRoom(room, event, payload) {
    try {
      const io = getIO();

      io.to(room).emit(event, payload);

      return true;
    } catch (error) {
      console.error('push.sendToRoom error:', error.message);
      return false;
    }
  },
};