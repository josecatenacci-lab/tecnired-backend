import { eventBus } from './eventBus.js';
import { EVENTS } from '../constants/events.js';

// =========================
// EVENTOS DE USUARIOS
// =========================

// 🔥 Registro de usuario
eventBus.on(EVENTS.USER_REGISTERED, async ({ user }) => {
  try {
    console.log('👤 Usuario registrado:', user.id);

    // 👉 Aquí luego:
    // - crear perfil base
    // - asignar reputación inicial
    // - enviar bienvenida

  } catch (error) {
    console.error('user.registered error:', error.message);
  }
});

// 🔥 Login de usuario
eventBus.on(EVENTS.USER_LOGIN, async ({ user }) => {
  try {
    console.log('🔑 Login:', user.id);

    // 👉 Aquí luego:
    // - tracking de actividad
    // - analytics de uso
    // - seguridad (detección de anomalías)

  } catch (error) {
    console.error('user.login error:', error.message);
  }
});