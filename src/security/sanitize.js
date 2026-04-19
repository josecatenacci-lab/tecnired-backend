import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// =========================
// SANITIZATION LAYER (ANTI INJECTION / XSS)
// =========================

// 🔥 Limpia queries contra NoSQL injection (Mongo-style attacks)
export const mongoSanitizeMiddleware = mongoSanitize();

// 🔥 Limpia inputs contra XSS (scripts maliciosos)
export const xssMiddleware = xss();

// =========================
// COMBINADO (RECOMENDADO)
// =========================

export const sanitizeMiddleware = (app) => {
  app.use(mongoSanitizeMiddleware);
  app.use(xssMiddleware);
};