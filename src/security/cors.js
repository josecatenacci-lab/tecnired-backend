import cors from 'cors';
import { env } from '../config/env.js';

// =========================
// CORS CONFIG (PRODUCTION SAFE)
// =========================

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = env.CLIENT_URL
      ? env.CLIENT_URL.split(',')
      : ['*'];

    // Permitir requests sin origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('❌ Bloqueado por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});