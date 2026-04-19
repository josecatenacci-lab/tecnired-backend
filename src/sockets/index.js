import { Server } from 'socket.io';
import { initChatSocket } from '../modules/chat/chat.socket.js';
import { env } from '../config/env.js';

// =========================
// SOCKET INDEX (BOOTSTRAP GLOBAL)
// =========================

let io;

// =========================
// INICIALIZAR SOCKET.IO
// =========================
export const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL || '*',
      credentials: true,
    },
  });

  console.log('🟢 Socket.IO inicializado');

  // =========================
  // MÓDULOS SOCKET
  // =========================
  initChatSocket(io);

  // 👉 aquí luego puedes agregar:
  // initNotificationSocket(io)
  // initPostSocket(io)

  return io;
};

// =========================
// OBTENER IO GLOBAL
// =========================
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no inicializado');
  }
  return io;
};