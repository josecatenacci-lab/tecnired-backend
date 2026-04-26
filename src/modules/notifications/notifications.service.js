import { notificationsRepository } from './notifications.repository.js';
import { pushService } from '../../services/shared/push.service.js';

const createHttpError = (
  statusCode,
  message,
) => ({
  statusCode,
  message,
});

export const notificationsService = {
  async create(payload) {
    const notification =
      await notificationsRepository.create(
        payload,
      );

    await pushService.sendToUser(
      payload.userId,
      'notification:new',
      notification,
    );

    return notification;
  },

  async notifyUser(
    userId,
    title,
    message,
    type = 'info',
    metadata = null,
  ) {
    return this.create({
      userId,
      type,
      title,
      message,
      metadata,
    });
  },

  async getMine(
    userId,
    query,
  ) {
    return notificationsRepository.findByUser(
      userId,
      query,
    );
  },

  async markAsRead(
    userId,
    notificationId,
  ) {
    const item =
      await notificationsRepository.findOwned(
        userId,
        notificationId,
      );

    if (!item) {
      throw createHttpError(
        404,
        'Notification not found',
      );
    }

    return notificationsRepository.update(
      notificationId,
      {
        status: 'read',
        readAt: new Date(),
      },
    );
  },

  async markAllAsRead(userId) {
    return notificationsRepository.markAllAsRead(
      userId,
    );
  },

  async remove(
    userId,
    notificationId,
  ) {
    const item =
      await notificationsRepository.findOwned(
        userId,
        notificationId,
      );

    if (!item) {
      throw createHttpError(
        404,
        'Notification not found',
      );
    }

    return notificationsRepository.remove(
      notificationId,
    );
  },

  async adminUpdate(
    notificationId,
    data,
  ) {
    return notificationsRepository.update(
      notificationId,
      data,
    );
  },
};