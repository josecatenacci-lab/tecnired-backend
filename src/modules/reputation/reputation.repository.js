import { db } from '../../config/db.js';

// =========================
// REPUTATION REPOSITORY (DB LAYER)
// =========================

export const reputationRepository = {
  // =========================
  // OBTENER REPUTACIÓN DE USUARIO
  // =========================
  async getByUserId(userId) {
    return await db.reputation.findUnique({
      where: { userId },
    });
  },

  // =========================
  // CREAR O INICIALIZAR REPUTACIÓN
  // =========================
  async createIfNotExists(userId) {
    return await db.reputation.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        points: 0,
        level: 1,
      },
    });
  },

  // =========================
  // ACTUALIZAR PUNTOS
  // =========================
  async updatePoints(userId, points) {
    return await db.reputation.update({
      where: { userId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  },

  // =========================
  // ACTUALIZAR NIVEL
  // =========================
  async updateLevel(userId, level) {
    return await db.reputation.update({
      where: { userId },
      data: { level },
    });
  },
};