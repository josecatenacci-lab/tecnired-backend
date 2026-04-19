import { db } from '../../config/db.js';

// =========================
// REACTIONS REPOSITORY (DB LAYER)
// =========================

export const reactionsRepository = {
  // =========================
  // AGREGAR O ACTUALIZAR REACCIÓN
  // =========================
  async upsertReaction(data) {
    return await db.reaction.upsert({
      where: {
        userId_postId: {
          userId: data.userId,
          postId: data.postId,
        },
      },
      update: {
        type: data.type,
      },
      create: {
        userId: data.userId,
        postId: data.postId,
        type: data.type,
      },
    });
  },

  // =========================
  // OBTENER REACCIONES POR POST
  // =========================
  async findByPost(postId) {
    return await db.reaction.findMany({
      where: { postId },
    });
  },

  // =========================
  // ELIMINAR REACCIÓN
  // =========================
  async deleteReaction(userId, postId) {
    return await db.reaction.deleteMany({
      where: {
        userId,
        postId,
      },
    });
  },
};