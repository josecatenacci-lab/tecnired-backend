import { db } from '../../config/db.js';

// =========================
// POSTS REPOSITORY (DB LAYER)
// =========================

export const postsRepository = {
  // =========================
  // CREAR POST
  // =========================
  async create(data) {
    return await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type, // corte | comando | libre
        userId: data.userId,
        metadata: data.metadata || {},
      },
    });
  },

  // =========================
  // OBTENER POST POR ID
  // =========================
  async findById(id) {
    return await db.post.findUnique({
      where: { id },
      include: {
        user: true,
        comments: true,
        reactions: true,
      },
    });
  },

  // =========================
  // FEED PRINCIPAL (HOME)
  // =========================
  async findFeed(limit = 20, offset = 0) {
    return await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: true,
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    });
  },

  // =========================
  // ELIMINAR POST
  // =========================
  async delete(id) {
    return await db.post.delete({
      where: { id },
    });
  },
};