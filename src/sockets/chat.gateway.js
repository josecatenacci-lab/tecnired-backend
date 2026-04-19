import { verifyToken } from '../utils/jwt.js';
import { chatService } from '../modules/chat/chat.service.js';

// 🔥 CHAT GATEWAY (TIEMPO REAL)

export const initChatGateway = (io) => {
  io.on('connection', (socket) => {
    console.log('💬 Usuario conectado:', socket.id);

    // =========================
    // AUTH SOCKET
    // =========================
    socket.on('auth', async (token) => {
      try {
        const user = verifyToken(token);
        socket.user = user;

        console.log('✅ Socket autenticado:', user.id);
      } catch (error) {
        console.log('❌ Socket auth error');
        socket.disconnect();
      }
    });

    // =========================
    // MENSAJE GLOBAL (CHAT)
    // =========================
    socket.on('chat:send', async (payload) => {
      try {
        if (!socket.user) return;

        const message = await chatService.createMessage({
          userId: socket.user.id,
          content: payload.content,
        });

        // Broadcast a todos
        io.emit('chat:new', message);
      } catch (error) {
        console.error('chat:send error:', error.message);
      }
    });

    // =========================
    // TYPING INDICATOR
    // =========================
    socket.on('chat:typing', () => {
      if (!socket.user) return;

      socket.broadcast.emit('chat:typing', {
        userId: socket.user.id,
      });
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on('disconnect', () => {
      console.log('🔌 Usuario desconectado:', socket.id);
    });
  });
};