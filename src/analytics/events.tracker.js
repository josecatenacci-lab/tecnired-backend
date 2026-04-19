import { eventBus } from '../events/eventBus.js';
import { EVENTS } from '../constants/events.js';

// 🔥 TRACKER GLOBAL (NO BLOQUEANTE)
eventBus.on(EVENTS.USER_LOGIN, ({ user }) => {
  setImmediate(() => {
    console.log('📊 Analytics → login:', user.id);
  });
});

eventBus.on(EVENTS.POST_CREATED, ({ post }) => {
  setImmediate(() => {
    console.log('📊 Analytics → post:', post.id);
  });
});

eventBus.on(EVENTS.MESSAGE_SENT, ({ message }) => {
  setImmediate(() => {
    console.log('📊 Analytics → message:', message.id);
  });
});

eventBus.on(EVENTS.REACTION_ADDED, ({ reaction }) => {
  setImmediate(() => {
    console.log('📊 Analytics → reaction:', reaction.id);
  });
});