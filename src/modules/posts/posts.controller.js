import { postsService } from './posts.service.js';
import { success, error } from '../../utils/response.js';

// =========================
// POSTS CONTROLLER (HTTP LAYER)
// =========================

export const postsController = {
  // =========================
  // CREAR POST
  // =========================
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { title, content, type, metadata } = req.body;

      const post = await postsService.createPost({
        title,
        content,
        type,
        userId,
        metadata,
      });

      return success(res, post, 'Post creado', 201);
    } catch (err) {
      return error(res, err.message || 'Error al crear post', err.statusCode || 500);
    }
  },

  // =========================
  // OBTENER POST POR ID
  // =========================
  async getById(req, res) {
    try {
      const { id } = req.params;

      const post = await postsService.getPostById(id);

      return success(res, post, 'Post obtenido');
    } catch (err) {
      return error(res, err.message || 'Error al obtener post', err.statusCode || 500);
    }
  },

  // =========================
  // FEED PRINCIPAL
  // =========================
  async getFeed(req, res) {
    try {
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const feed = await postsService.getFeed({ limit, offset });

      return success(res, feed, 'Feed obtenido');
    } catch (err) {
      return error(res, err.message || 'Error al obtener feed', err.statusCode || 500);
    }
  },

  // =========================
  // ELIMINAR POST
  // =========================
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await postsService.deletePost(id, userId);

      return success(res, null, 'Post eliminado');
    } catch (err) {
      return error(res, err.message || 'Error al eliminar post', err.statusCode || 500);
    }
  },
};