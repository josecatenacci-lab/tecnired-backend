import { db } from '../../config/db.js';

// =========================
// USER REPOSITORY (DB LAYER)
// =========================

export const userRepository = {
  // =========================
  // OBTENER TODOS LOS USUARIOS (PAGINADO FUTURO)
  // =========================
  async findAll() {
    return await db.user.findMany({
      orderBy: { createdAt: 'desc' },
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
  // ACTUALIZAR PERFIL
  // =========================
  async update(id, data) {
    return await db.user.update({
      where: { id },
      data,
    });
  },

  // =========================
  // CAMBIAR ROL (ADMIN)
  // =========================
  async updateRole(id, role) {
    return await db.user.update({
      where: { id },
      data: { role },
    });
  },

  // =========================
  // ELIMINAR USUARIO
  // =========================
  async delete(id) {
    return await db.user.delete({
      where: { id },
    });
  },
};