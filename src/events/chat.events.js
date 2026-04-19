import { eventBus } from './eventBus.js';
import { EVENTS } from '../constants/events.js';

// =========================
// EVENTOS DE CHAT
// =========================

// 🔥 Cuando se envía un mensaje
eventBus.on(EVENTS.CHAT_MESSAGE_SENT, async ({ message, user }) => {
  try {
    console.log('💬 Mensaje enviado:', message.id);

    // 👉 Aquí luego:
    // - analytics de uso
    // - detección de spam
    // - moderación automática (futuro)

  } catch (error) {
    console.error('chat.events error:', error.message);
  }
});