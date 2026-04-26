import { getDB } from '../../config/db.js';
import { getRedis } from '../../config/redis.js';
import { env } from '../../config/env.js';

// =========================
// BASIC HEALTH
// =========================

export const healthCheck = async (
  _req,
  res,
) => {
  res.status(200).json({
    success: true,
    service: env.APP_NAME,
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
};

// =========================
// LIVENESS
// =========================

export const livenessCheck = async (
  _req,
  res,
) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
};

// =========================
// READINESS
// =========================

export const readinessCheck = async (
  _req,
  res,
) => {
  try {
    await getDB().$queryRaw`SELECT 1`;

    const redis = await getRedis();
    await redis.ping();

    return res.status(200).json({
      success: true,
      status: 'ready',
      database: 'ok',
      redis: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      status: 'not_ready',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};