import { db } from '../../config/db.js';

// =========================
// NOTIFICATIONS REPOSITORY (DB LAYER)
// =========================

export const notificationsRepository = {
  // =========================
  // CREAR NOTIFICACIÓN
  // =========================
  async create(data) {
    return await db.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
        metadata: data.metadata || {},
      },
    });
  },

  // =========================
  // OBTENER NOTIFICACIONES POR USUARIO
  // =========================
  async findByUser(userId, limit = 20) {
    return await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // =========================
  // MARCAR COMO LEÍDA
  // =========================
  async markAsRead(notificationId) {
    return await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },

  // =========================
  // MARCAR TODAS COMO LEÍDAS
  // =========================
  async markAllAsRead(userId) {
    return await db.notification.updateMany({
      where: { userId },
      data: { read: true },
    });
  },
};