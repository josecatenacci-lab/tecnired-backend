import { eventBus } from '../events/eventBus.js';
import { EVENTS } from '../constants/events.js';

// =========================
// JOB: REPUTACIÓN (KARMA TÉCNICO)
// =========================

// 🔥 CONFIG BASE DE PUNTOS
const POINTS = {
  POST_CREATED: 5,
  COMMENT_CREATED: 2,
  REACTION_RECEIVED: 1,
};

// =========================
// POST CREATED → REPUTACIÓN
// =========================
eventBus.on(EVENTS.POST_CREATED, async ({ post }) => {
  try {
    // 👉 Aquí luego conectarás userService
    console.log('⭐ Reputación + post:', post.userId, POINTS.POST_CREATED);

  } catch (error) {
    console.error('reputation.job POST error:', error.message);
  }
});

// =========================
// COMMENT CREATED → REPUTACIÓN
// =========================
eventBus.on(EVENTS.COMMENT_CREATED, async ({ comment }) => {
  try {
    console.log('⭐ Reputación + comment:', comment.userId, POINTS.COMMENT_CREATED);

  } catch (error) {
    console.error('reputation.job COMMENT error:', error.message);
  }
});

// =========================
// REACTION ADDED → REPUTACIÓN
// =========================
eventBus.on(EVENTS.REACTION_ADDED, async ({ reaction }) => {
  try {
    console.log('⭐ Reputación + reaction:', reaction.targetUserId, POINTS.REACTION_RECEIVED);

  } catch (error) {
    console.error('reputation.job REACTION error:', error.message);
  }
});