import rateLimit from 'express-rate-limit';

// =========================
// RATE LIMITER (ANTI-SPAM / ANTI-ATTACK)
// =========================

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo requests por IP
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    ok: false,
    message: 'Demasiadas solicitudes, intenta más tarde',
  },
});

// =========================
// STRICT LIMIT (AUTH / LOGIN)
// =========================

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // más estricto para login/register

  message: {
    ok: false,
    message: 'Demasiados intentos de autenticación',
  },
});