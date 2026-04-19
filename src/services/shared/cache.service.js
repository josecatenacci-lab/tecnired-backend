import { getRedis } from '../../config/redis.js';

// =========================
// CACHE SERVICE (ABSTRACCIÓN PRO)
// =========================

export const cacheService = {
  // =========================
  // SET CACHE
  // =========================
  async set(key, value, ttl = 3600) {
    try {
      const redis = await getRedis();

      await redis.set(key, JSON.stringify(value), {
        EX: ttl,
      });

      return true;
    } catch (error) {
      console.error('cache.set error:', error.message);
      return false;
    }
  },

  // =========================
  // GET CACHE
  // =========================
  async get(key) {
    try {
      const redis = await getRedis();

      const data = await redis.get(key);

      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('cache.get error:', error.message);
      return null;
    }
  },

  // =========================
  // DELETE CACHE
  // =========================
  async del(key) {
    try {
      const redis = await getRedis();
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('cache.del error:', error.message);
      return false;
    }
  },

  // =========================
  // CLEAR BY PATTERN (AVANZADO)
  // =========================
  async clearPattern(pattern) {
    try {
      const redis = await getRedis();
      const keys = await redis.keys(pattern);

      if (keys.length > 0) {
        await redis.del(keys);
      }

      return true;
    } catch (error) {
      console.error('cache.clearPattern error:', error.message);
      return false;
    }
  },
};