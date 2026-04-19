import { reactionsRepository } from './reactions.repository.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';
import { pushService } from '../../services/shared/push.service.js';

// =========================
// REACTIONS SERVICE (LOGICA DE NEGOCIO)
// =========================

export const reactionsService = {
  // =========================
  // CREAR / ACTUALIZAR REACCIÓN
  // =========================
  async react({ userId, postId, type }) {
    const reaction = await reactionsRepository.upsertReaction({
      userId,
      postId,
      type,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.REACTION_ADDED, {
      reaction,
    });

    // 🔥 REALTIME UPDATE
    pushService.broadcast('reaction:updated', {
      postId,
      reaction,
    });

    return reaction;
  },

  // =========================
  // OBTENER REACCIONES POR POST
  // =========================
  async getByPost(postId) {
    return await reactionsRepository.findByPost(postId);
  },

  // =========================
  // ELIMINAR REACCIÓN
  // =========================
  async remove(userId, postId) {
    await reactionsRepository.deleteReaction(userId, postId);

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.REACTION_REMOVED, {
      userId,
      postId,
    });

    // 🔥 REALTIME UPDATE
    pushService.broadcast('reaction:removed', {
      postId,
      userId,
    });

    return true;
  },
};