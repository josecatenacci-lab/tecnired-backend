import { chatRepository } from './chat.repository.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';
import { pushService } from '../../services/shared/push.service.js';

// =========================
// CHAT SERVICE (LOGICA DE NEGOCIO)
// =========================

export const chatService = {
  // =========================
  // ENVIAR MENSAJE
  // =========================
  async sendMessage({ content, senderId, receiverId, room }) {
    const message = await chatRepository.createMessage({
      content,
      senderId,
      receiverId,
      room,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.CHAT_MESSAGE_SENT, {
      message,
      user: { id: senderId },
    });

    // 🔥 PUSH REALTIME
    pushService.broadcast('chat:new_message', message);

    return message;
  },

  // =========================
  // OBTENER CHAT GLOBAL
  // =========================
  async getGlobalChat() {
    return await chatRepository.getMessagesByRoom('global', 50);
  },

  // =========================
  // CHAT PRIVADO
  // =========================
  async getPrivateChat(userA, userB) {
    return await chatRepository.getPrivateChat(userA, userB);
  },
};