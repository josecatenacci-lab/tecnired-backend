import { userRepository } from './user.repository.js';
import { pushService } from '../../services/shared/push.service.js';
import { EVENTS } from '../../constants/events.js';
import { eventBus } from '../../events/eventBus.js';

// =========================
// USER SERVICE (LOGICA DE NEGOCIO)
// =========================

export const userService = {
  // =========================
  // OBTENER PERFIL
  // =========================
  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    return user;
  },

  // =========================
  // ACTUALIZAR PERFIL
  // =========================
  async updateProfile(userId, data) {
    const updatedUser = await userRepository.update(userId, data);

    return updatedUser;
  },

  // =========================
  // CAMBIAR ROL (ADMIN)
  // =========================
  async changeRole(userId, role) {
    const updated = await userRepository.updateRole(userId, role);

    return updated;
  },

  // =========================
  // ELIMINAR USUARIO
  // =========================
  async deleteUser(userId) {
    const deleted = await userRepository.delete(userId);

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.POST_DELETED, { userId });

    return deleted;
  },
};