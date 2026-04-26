import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let client;

const buildRedisUrl = () => {
  const password = env.REDIS_PASSWORD
    ? `:${encodeURIComponent(env.REDIS_PASSWORD)}@`
    : '';

  return `redis://${password}${env.REDIS_HOST}:${env.REDIS_PORT}`;
};

const createRedisInstance = () =>
  createClient({
    url: buildRedisUrl(),
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          return new Error('Redis reconnect limit reached');
        }

        return Math.min(retries * 250, 3000);
      },
    },
  });

export const getRedis = async () => {
  if (client?.isOpen) {
    return client;
  }

  if (!client) {
    client = createRedisInstance();

    client.on('connect', () => {
      logger.info('Redis connecting...');
    });

    client.on('ready', () => {
      logger.info('Redis ready');
    });

    client.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    client.on('error', (error) => {
      logger.error('Redis error', error);
    });

    client.on('end', () => {
      logger.warn('Redis connection closed');
    });
  }

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
};

// =========================
// CACHE HELPERS
// =========================

export const setCache = async (
  key,
  value,
  ttl = 3600,
) => {
  try {
    const redis = await getRedis();

    await redis.set(
      key,
      JSON.stringify(value),
      { EX: ttl },
    );

    return true;
  } catch (error) {
    logger.error('setCache failed', error);
    return false;
  }
};

export const getCache = async (key) => {
  try {
    const redis = await getRedis();

    const data = await redis.get(key);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('getCache failed', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    const redis = await getRedis();

    await redis.del(key);

    return true;
  } catch (error) {
    logger.error('deleteCache failed', error);
    return false;
  }
};

export const closeRedis = async () => {
  if (client?.isOpen) {
    await client.quit();
  }
};