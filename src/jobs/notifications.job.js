import { eventBus } from '../events/eventBus.js';
import { EVENTS } from '../constants/events.js';
import { getIO } from '../sockets/index.js';

// =========================
// JOB: NOTIFICACIONES (ASYNC EVENT DRIVEN)
// =========================

// 🔥 Crear notificación desde eventos del sistema
const emitNotification = (userId, payload) => {
  const io = getIO();

  io.to(`user:${userId}`).emit('notification:new', payload);
};

// =========================
// POST CREATED → NOTIFICACIÓN
// =========================
eventBus.on(EVENTS.POST_CREATED, async ({ post }) => {
  try {
    // 👉 Ejemplo futuro: notificar seguidores
    // emitNotification(followerId, { type: 'post', post });

  } catch (error) {
    console.error('notifications.job POST_CREATED error:', error.message);
  }
});

// =========================
// REACTION ADDED → NOTIFICACIÓN
// =========================
eventBus.on(EVENTS.REACTION_ADDED, async ({ reaction }) => {
  try {
    emitNotification(reaction.targetUserId, {
      type: 'reaction',
      message: 'Alguien reaccionó a tu publicación',
      data: reaction,
    });
  } catch (error) {
    console.error('notifications.job REACTION error:', error.message);
  }
});

// =========================
// CHAT MESSAGE → NOTIFICACIÓN
// =========================
eventBus.on(EVENTS.CHAT_MESSAGE_SENT, async ({ message }) => {
  try {
    emitNotification(message.toUserId, {
      type: 'chat',
      message: 'Nuevo mensaje recibido',
      data: message,
    });
  } catch (error) {
    console.error('notifications.job CHAT error:', error.message);
  }
});