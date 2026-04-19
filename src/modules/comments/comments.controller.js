import { commentsService } from './comments.service.js';
import { success, error } from '../../utils/response.js';

// =========================
// COMMENTS CONTROLLER (HTTP LAYER)
// =========================

export const commentsController = {
  // =========================
  // CREAR COMENTARIO
  // =========================
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { content, postId } = req.body;

      const comment = await commentsService.createComment({
        content,
        userId,
        postId,
      });

      return success(res, comment, 'Comentario creado', 201);
    } catch (err) {
      return error(res, err.message || 'Error al crear comentario', err.statusCode || 500);
    }
  },

  // =========================
  // OBTENER COMENTARIOS POR POST
  // =========================
  async getByPost(req, res) {
    try {
      const { postId } = req.params;

      const comments = await commentsService.getCommentsByPost(postId);

      return success(res, comments, 'Comentarios obtenidos');
    } catch (err) {
      return error(res, err.message || 'Error al obtener comentarios', err.statusCode || 500);
    }
  },

  // =========================
  // ELIMINAR COMENTARIO
  // =========================
  async delete(req, res) {
    try {
      const { id } = req.params;

      await commentsService.deleteComment(id);

      return success(res, null, 'Comentario eliminado');
    } catch (err) {
      return error(res, err.message || 'Error al eliminar comentario', err.statusCode || 500);
    }
  },
};