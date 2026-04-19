import { reputationRepository } from './reputation.repository.js';
import { eventBus } from '../../events/eventBus.js';
import { EVENTS } from '../../constants/events.js';

// =========================
// REPUTATION SERVICE (LOGICA DE NEGOCIO)
// =========================

export const reputationService = {
  // =========================
  // INICIALIZAR USUARIO
  // =========================
  async initUser(userId) {
    return await reputationRepository.createIfNotExists(userId);
  },

  // =========================
  // AUMENTAR REPUTACIÓN
  // =========================
  async addPoints(userId, points) {
    const rep = await reputationRepository.updatePoints(userId, points);

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.REPUTATION_UPDATED, {
      userId,
      points,
      action: 'increment',
    });

    return rep;
  },

  // =========================
  // REDUCIR REPUTACIÓN
  // =========================
  async removePoints(userId, points) {
    const rep = await reputationRepository.updatePoints(userId, -points);

    eventBus.emit(EVENTS.REPUTATION_UPDATED, {
      userId,
      points: -points,
      action: 'decrement',
    });

    return rep;
  },

  // =========================
  // CAMBIAR NIVEL
  // =========================
  async setLevel(userId, level) {
    const rep = await reputationRepository.updateLevel(userId, level);

    eventBus.emit(EVENTS.REPUTATION_LEVEL_CHANGED, {
      userId,
      level,
    });

    return rep;
  },

  // =========================
  // OBTENER REPUTACIÓN
  // =========================
  async getReputation(userId) {
    const rep = await reputationRepository.getByUserId(userId);

    if (!rep) {
      return await this.initUser(userId);
    }

    return rep;
  },
};