import { chatService } from './chat.service.js';
import { success, error } from '../../utils/response.js';

// =========================
// CHAT CONTROLLER (HTTP LAYER)
// =========================

export const chatController = {
  // =========================
  // ENVIAR MENSAJE
  // =========================
  async sendMessage(req, res) {
    try {
      const { content, receiverId, room } = req.body;
      const senderId = req.user.id;

      const message = await chatService.sendMessage({
        content,
        senderId,
        receiverId,
        room,
      });

      return success(res, message, 'Mensaje enviado');
    } catch (err) {
      return error(res, err.message || 'Error al enviar mensaje', err.statusCode || 500);
    }
  },

  // =========================
  // CHAT GLOBAL
  // =========================
  async getGlobalChat(req, res) {
    try {
      const messages = await chatService.getGlobalChat();

      return success(res, messages, 'Chat global obtenido');
    } catch (err) {
      return error(res, err.message || 'Error al obtener chat', err.statusCode || 500);
    }
  },

  // =========================
  // CHAT PRIVADO
  // =========================
  async getPrivateChat(req, res) {
    try {
      const { userA, userB } = req.params;

      const messages = await chatService.getPrivateChat(userA, userB);

      return success(res, messages, 'Chat privado obtenido');
    } catch (err) {
      return error(res, err.message || 'Error al obtener chat privado', err.statusCode || 500);
    }
  },
};