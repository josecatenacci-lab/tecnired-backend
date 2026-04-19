import { eventBus } from './eventBus.js';
import { EVENTS } from '../constants/events.js';

// =========================
// EVENTOS DE POSTS
// =========================

// 🔥 Cuando se crea un post
eventBus.on(EVENTS.POST_CREATED, async ({ post, user }) => {
  try {
    console.log('📝 Post creado:', post.id);

    // 👉 Aquí luego:
    // - notificar seguidores
    // - indexar en search
    // - analytics adicional

  } catch (error) {
    console.error('post.events CREATE error:', error.message);
  }
});

// 🔥 Cuando se elimina un post
eventBus.on(EVENTS.POST_DELETED, async ({ postId, userId }) => {
  try {
    console.log('🗑️ Post eliminado:', postId);

    // 👉 Aquí luego:
    // - limpiar cache
    // - eliminar relaciones (comentarios, reacciones)

  } catch (error) {
    console.error('post.events DELETE error:', error.message);
  }
});