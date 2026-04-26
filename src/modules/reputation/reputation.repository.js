import { db } from '../../config/db.js';

export const reputationRepository = {
  async getByUserId(userId) {
    return db.reputation.findUnique({
      where: { userId },
    });
  },

  async createIfNotExists(userId) {
    return db.reputation.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        points: 0,
        level: 1,
        rank: 'rookie',
      },
    });
  },

  async updateStats(
    userId,
    data,
  ) {
    return db.reputation.update({
      where: { userId },
      data,
    });
  },

  async updatePoints(
    userId,
    points,
  ) {
    return db.reputation.update({
      where: { userId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  },

  async updateLevel(
    userId,
    level,
  ) {
    return db.reputation.update({
      where: { userId },
      data: { level },
    });
  },

  async createEvent(data) {
    return db.reputationEvent.create({
      data,
    });
  },

  async getHistory(
    userId,
    {
      page = 1,
      limit = 20,
    },
  ) {
    const skip =
      (page - 1) * limit;

    const where = { userId };

    const [items, total] =
      await Promise.all([
        db.reputationEvent.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        db.reputationEvent.count({
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

  async getRanking({
    page = 1,
    limit = 20,
  }) {
    const skip =
      (page - 1) * limit;

    const [items, total] =
      await Promise.all([
        db.reputation.findMany({
          skip,
          take: limit,
          orderBy: [
            {
              points: 'desc',
            },
          ],
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        }),
        db.reputation.count(),
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
};