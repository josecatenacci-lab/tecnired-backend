import { commentsRepository } from './comments.repository.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';
import { pushService } from '../../services/shared/push.service.js';

// =========================
// COMMENTS SERVICE (LOGICA DE NEGOCIO)
// =========================

export const commentsService = {
  // =========================
  // CREAR COMENTARIO
  // =========================
  async createComment({ content, userId, postId }) {
    const comment = await commentsRepository.create({
      content,
      userId,
      postId,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.COMMENT_CREATED, { comment });

    // 🔥 NOTIFICACIÓN REALTIME
    pushService.broadcast('comment:new', comment);

    return comment;
  },

  // =========================
  // OBTENER COMENTARIOS POR POST
  // =========================
  async getCommentsByPost(postId) {
    return await commentsRepository.findByPost(postId);
  },

  // =========================
  // ELIMINAR COMENTARIO
  // =========================
  async deleteComment(commentId) {
    return await commentsRepository.delete(commentId);
  },
};