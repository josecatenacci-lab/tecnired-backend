import { postsRepository } from './posts.repository.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';
import { pushService } from '../../services/shared/push.service.js';

// =========================
// POSTS SERVICE (LOGICA DE NEGOCIO)
// =========================

export const postsService = {
  // =========================
  // CREAR POST
  // =========================
  async createPost({ title, content, type, userId, metadata }) {
    const post = await postsRepository.create({
      title,
      content,
      type,
      userId,
      metadata,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.POST_CREATED, { post });

    // 🔥 PUSH REALTIME (FEED GLOBAL)
    pushService.broadcast('post:new', post);

    return post;
  },

  // =========================
  // OBTENER POST
  // =========================
  async getPostById(id) {
    const post = await postsRepository.findById(id);

    if (!post) {
      throw { statusCode: 404, message: 'Post no encontrado' };
    }

    return post;
  },

  // =========================
  // FEED PRINCIPAL
  // =========================
  async getFeed({ limit = 20, offset = 0 }) {
    return await postsRepository.findFeed(limit, offset);
  },

  // =========================
  // ELIMINAR POST
  // =========================
  async deletePost(id, userId) {
    const post = await postsRepository.findById(id);

    if (!post) {
      throw { statusCode: 404, message: 'Post no encontrado' };
    }

    if (post.userId !== userId) {
      throw { statusCode: 403, message: 'No autorizado' };
    }

    await postsRepository.delete(id);

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.POST_DELETED, { postId: id, userId });

    return true;
  },
};