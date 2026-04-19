import { db } from '../../config/db.js';

// =========================
// COMMENTS REPOSITORY (DB LAYER)
// =========================

export const commentsRepository = {
  // =========================
  // CREAR COMENTARIO
  // =========================
  async create(data) {
    return await db.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        postId: data.postId,
      },
    });
  },

  // =========================
  // COMENTARIOS POR POST
  // =========================
  async findByPost(postId) {
    return await db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    });
  },

  // =========================
  // ELIMINAR COMENTARIO
  // =========================
  async delete(commentId) {
    return await db.comment.delete({
      where: { id: commentId },
    });
  },
};