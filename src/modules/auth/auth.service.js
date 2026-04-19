import bcrypt from 'bcryptjs';
import { authRepository } from './auth.repository.js';
import { generateToken } from '../../utils/jwt.js';
import { EVENTS } from '../../constants/events.js';
import { eventBus } from '../../events/eventBus.js';

// =========================
// AUTH SERVICE (LOGICA DE NEGOCIO)
// =========================

export const authService = {
  // =========================
  // REGISTER
  // =========================
  async register({ email, password, name }) {
    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      throw { statusCode: 409, message: 'Usuario ya existe' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.USER_REGISTERED, { user });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },

  // =========================
  // LOGIN
  // =========================
  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw { statusCode: 404, message: 'Usuario no encontrado' };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw { statusCode: 401, message: 'Credenciales inválidas' };
    }

    // 🔥 EVENTO GLOBAL
    eventBus.emit(EVENTS.USER_LOGIN, { user });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  },
};