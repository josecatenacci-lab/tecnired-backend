import { db } from '../../config/db.js';

export const notificationsRepository = {
  async create(data) {
    return db.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        status: 'unread',
        title: data.title,
        message: data.message,
        metadata:
          data.metadata || {},
      },
    });
  },

  async findByUser(
    userId,
    {
      page = 1,
      limit = 20,
      status,
    },
  ) {
    const skip =
      (page - 1) * limit;

    const where = {
      userId,
      ...(status && {
        status,
      }),
    };

    const [items, total] =
      await Promise.all([
        db.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        db.notification.count({
          where,
        }),
      ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit,
        ),
      },
    };
  },

  async findOwned(
    userId,
    id,
  ) {
    return db.notification.findFirst({
      where: {
        id,
        userId,
      },
    });
  },

  async update(
    id,
    data,
  ) {
    return db.notification.update({
      where: { id },
      data,
    });
  },

  async markAllAsRead(
    userId,
  ) {
    return db.notification.updateMany({
      where: {
        userId,
        status: 'unread',
      },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });
  },

  async remove(id) {
    return db.notification.delete({
      where: { id },
    });
  },
};