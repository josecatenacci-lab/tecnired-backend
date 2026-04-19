import { db } from '../../config/db.js';

// =========================
// AUTH REPOSITORY (DATABASE LAYER)
// =========================

export const authRepository = {
  // =========================
  // CREAR USUARIO
  // =========================
  async createUser(data) {
    return await db.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || 'user',
      },
    });
  },

  // =========================
  // BUSCAR POR EMAIL
  // =========================
  async findByEmail(email) {
    return await db.user.findUnique({
      where: { email },
    });
  },

  // =========================
  // BUSCAR POR ID
  // =========================
  async findById(id) {
    return await db.user.findUnique({
      where: { id },
    });
  },

  // =========================
  // ACTUALIZAR USUARIO
  // =========================
  async updateUser(id, data) {
    return await db.user.update({
      where: { id },
      data,
    });
  },
};