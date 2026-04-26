import cors from 'cors';
import { env } from '../config/env.js';

const parseOrigins = () => {
  const raw =
    env.CORS_ORIGIN ||
    env.CLIENT_URL ||
    '';

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins();

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Postman, mobile apps, server-to-server
    if (!origin) {
      return callback(null, true);
    }

    // desarrollo libre local opcional
    if (
      env.NODE_ENV === 'development' &&
      allowedOrigins.length === 0
    ) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error('Blocked by CORS'),
    );
  },

  credentials:
    env.CORS_CREDENTIALS === true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  exposedHeaders: [
    'Content-Length',
    'Content-Type',
  ],

  optionsSuccessStatus: 204,
  maxAge: 86400,
});