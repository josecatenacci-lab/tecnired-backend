import { userService } from './user.service.js';
import { success, error } from '../../utils/response.js';

// =========================
// USER CONTROLLER (HTTP LAYER)
// =========================

export const userController = {
  // =========================
  // PERFIL
  // =========================
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await userService.getProfile(userId);

      return success(res, user, 'Perfil obtenido');
    } catch (err) {
      return error(res, err.message || 'Error al obtener perfil', err.statusCode || 500);
    }
  },

  // =========================
  // ACTUALIZAR PERFIL
  // =========================
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const updated = await userService.updateProfile(userId, data);

      return success(res, updated, 'Perfil actualizado');
    } catch (err) {
      return error(res, err.message || 'Error al actualizar perfil', err.statusCode || 500);
    }
  },

  // =========================
  // CAMBIAR ROL (ADMIN)
  // =========================
  async changeRole(req, res) {
    try {
      const { userId, role } = req.body;

      const updated = await userService.changeRole(userId, role);

      return success(res, updated, 'Rol actualizado');
    } catch (err) {
      return error(res, err.message || 'Error al cambiar rol', err.statusCode || 500);
    }
  },

  // =========================
  // ELIMINAR USUARIO
  // =========================
  async deleteUser(req, res) {
    try {
      const userId = req.user.id;

      await userService.deleteUser(userId);

      return success(res, null, 'Usuario eliminado');
    } catch (err) {
      return error(res, err.message || 'Error al eliminar usuario', err.statusCode || 500);
    }
  },
};