import { authService } from './auth.service.js';
import { success, error } from '../../utils/response.js';

// =========================
// AUTH CONTROLLER (HTTP LAYER)
// =========================

export const authController = {
  // =========================
  // REGISTER
  // =========================
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register({
        email,
        password,
        name,
      });

      return success(res, result, 'Usuario creado', 201);
    } catch (err) {
      return error(res, err.message || 'Error en registro', err.statusCode || 500);
    }
  },

  // =========================
  // LOGIN
  // =========================
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password,
      });

      return success(res, result, 'Login exitoso');
    } catch (err) {
      return error(res, err.message || 'Error en login', err.statusCode || 500);
    }
  },
};