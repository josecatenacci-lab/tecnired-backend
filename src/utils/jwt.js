import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// =========================
// GENERAR TOKEN
// =========================
export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });
};

// =========================
// VERIFICAR TOKEN (THROWS)
// =========================
export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Token no proporcionado');
  }

  return jwt.verify(token, env.JWT_SECRET);
};

// =========================
// VERIFICAR TOKEN SAFE (NO THROW)
// =========================
export const verifyTokenSafe = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    return null;
  }
};

// =========================
// EXTRAER TOKEN DE HEADER
// =========================
export const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) return null;

  return token;
};