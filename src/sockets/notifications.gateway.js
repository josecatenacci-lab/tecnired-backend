import { verifyToken } from '../utils/jwt.js';

// 🔥 NOTIFICATIONS GATEWAY

export const initNotificationsGateway = (io) => {
  io.on('connection', (socket) => {
    // =========================
    // AUTH SOCKET
    // =========================
    socket.on('auth', (token) => {
      try {
        const user = verifyToken(token);

        socket.user = user;

        // 👉 Cada usuario queda en su propia sala
        socket.join(`user:${user.id}`);

        console.log('🔔 Socket notifications auth:', user.id);
      } catch (error) {
        console.log('❌ notifications auth error');
        socket.disconnect();
      }
    });
  });
};