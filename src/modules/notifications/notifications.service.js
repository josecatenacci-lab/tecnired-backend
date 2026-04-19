import { notificationsRepository } from './notifications.repository.js';
import { pushService } from '../../services/shared/push.service.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';

// =========================
// NOTIFICATIONS SERVICE (LOGICA DE NEGOCIO)
// =========================

export const notificationsService = {
  // =========================
  // CREAR NOTIFICACIÓN
  // =========================
  async createNotification({ userId, type, title, message, metadata }) {
    const notification = await notificationsRepository.create({
      userId,
      type,
      title,
      message,
      metadata,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.NOTIFICATION_CREATED, {
      notification,
    });

    // 🔥 PUSH REALTIME (SOCKET)
    pushService.sendToUser(userId, 'notification:new', notification);

    return notification;
  },

  // =========================
  // NOTIFICACIONES DE USUARIO
  // =========================
  async getUserNotifications(userId, limit = 20) {
    return await notificationsRepository.findByUser(userId, limit);
  },

  // =========================
  // MARCAR COMO LEÍDA
  // =========================
  async markAsRead(notificationId) {
    return await notificationsRepository.markAsRead(notificationId);
  },

  // =========================
  // MARCAR TODAS COMO LEÍDAS
  // =========================
  async markAllAsRead(userId) {
    return await notificationsRepository.markAllAsRead(userId);
  },

  // =========================
  // NOTIFICACIÓN RÁPIDA (HELPER)
  // =========================
  async notifyUser(userId, title, message, type = 'info') {
    return this.createNotification({
      userId,
      type,
      title,
      message,
    });
  },
};