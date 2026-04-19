import { eventBus } from '../events/eventBus.js';
import { EVENTS } from '../constants/events.js';

// 🔥 Tracking comportamiento del usuario (NO bloqueante)

// Usuario crea contenido técnico
eventBus.on(EVENTS.POST_CREATED, ({ user, post }) => {
  setImmediate(() => {
    console.log('🧠 Behavior → crea post:', {
      userId: user.id,
      postId: post.id,
      type: post.type,
    });
  });
});

// Usuario interactúa (reacciones)
eventBus.on(EVENTS.REACTION_ADDED, ({ reaction }) => {
  setImmediate(() => {
    console.log('🧠 Behavior → interacción:', {
      userId: reaction.userId,
      targetId: reaction.targetId,
      type: reaction.type,
    });
  });
});

// Usuario participa en chat
eventBus.on(EVENTS.MESSAGE_SENT, ({ message }) => {
  setImmediate(() => {
    console.log('🧠 Behavior → chat activo:', {
      userId: message.userId,
      messageId: message.id,
    });
  });
});