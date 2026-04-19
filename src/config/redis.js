import { createClient } from 'redis';
import { env } from './env.js';

// =========================
// REDIS CLIENT (CACHE + JOBS)
// =========================

let client;

export const getRedis = async () => {
  if (client && client.isOpen) return client;

  client = createClient({
    url: env.REDIS_URL,
  });

  client.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
  });

  await client.connect();

  console.log('🟢 Redis conectado');

  return client;
};

// =========================
// HELPERS SIMPLES
// =========================

export const setCache = async (key, value, ttl = 3600) => {
  const redis = await getRedis();

  await redis.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};

export const getCache = async (key) => {
  const redis = await getRedis();

  const data = await redis.get(key);

  return data ? JSON.parse(data) : null;
};

export const deleteCache = async (key) => {
  const redis = await getRedis();
  await redis.del(key);
};