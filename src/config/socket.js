import { initSockets } from '../sockets/index.js';

// =========================
// SOCKET CONFIG BOOTSTRAP
// =========================

let ioInstance = null;

// 🔥 Inicializar sockets con server HTTP
export const initSocketServer = (server) => {
  if (ioInstance) return ioInstance;

  ioInstance = initSockets(server);

  return ioInstance;
};

// 🔥 Obtener instancia global
export const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error('Socket.io no inicializado aún');
  }

  return ioInstance;
};