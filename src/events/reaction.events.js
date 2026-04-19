import { eventBus } from './eventBus.js';
import { EVENTS } from '../constants/events.js';

// =========================
// EVENTOS DE REACCIONES
// =========================

// 🔥 Cuando alguien reacciona a un post/comentario
eventBus.on(EVENTS.REACTION_ADDED, async ({ reaction, user }) => {
  try {
    console.log('🔥 Reacción agregada:', reaction.id);

    // 👉 Aquí luego:
    // - sumar reputación al autor
    // - crear notificación
    // - analytics de engagement

  } catch (error) {
    console.error('reaction.events error:', error.message);
  }
});