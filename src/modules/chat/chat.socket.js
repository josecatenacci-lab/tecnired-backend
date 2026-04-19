import { chatService } from './chat.service.js';
import { verifyToken } from '../../utils/jwt.js';

// =========================
// CHAT SOCKET HANDLER
// =========================

export const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('💬 Socket chat conectado:', socket.id);

    // =========================
    // AUTH SOCKET
    // =========================
    socket.on('auth', (token) => {
      try {
        const user = verifyToken(token);
        socket.user = user;

        socket.join('global');

        console.log('✅ Chat socket autenticado:', user.id);
      } catch (error) {
        console.log('❌ Chat socket auth error');
        socket.disconnect();
      }
    });

    // =========================
    // MENSAJE EN TIEMPO REAL
    // =========================
    socket.on('chat:send', async (payload) => {
      try {
        if (!socket.user) return;

        const message = await chatService.sendMessage({
          content: payload.content,
          senderId: socket.user.id,
          receiverId: payload.receiverId || null,
          room: payload.room || 'global',
        });

        // 🔥 broadcast global o room
        io.to(payload.room || 'global').emit('chat:new', message);
      } catch (error) {
        console.error('chat.socket send error:', error.message);
      }
    });

    // =========================
    // TYPING INDICATOR
    // =========================
    socket.on('chat:typing', (room = 'global') => {
      if (!socket.user) return;

      socket.to(room).emit('chat:typing', {
        userId: socket.user.id,
      });
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on('disconnect', () => {
      console.log('🔌 Chat socket desconectado:', socket.id);
    });
  });
};