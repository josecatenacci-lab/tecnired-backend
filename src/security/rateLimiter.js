import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const jsonHandler =
  (message) =>
  (_req, res) => {
    res.status(429).json({
      success: false,
      message,
    });
  };

// =========================
// GLOBAL LIMITER
// =========================

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) =>
    req.ip ||
    req.headers['x-forwarded-for'] ||
    'unknown',

  handler: jsonHandler(
    'Too many requests, try again later.',
  ),
});

// =========================
// AUTH LIMITER
// =========================

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) =>
    req.ip ||
    req.headers['x-forwarded-for'] ||
    'unknown',

  handler: jsonHandler(
    'Too many authentication attempts.',
  ),
});

// =========================
// STRICT ACTIONS
// =========================

export const strictRateLimiter =
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    handler: jsonHandler(
      'Action temporarily blocked.',
    ),
  });