import { getRedis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

// =========================
// CACHE SERVICE
// =========================

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const cacheService = {
  // =========================
  // SET
  // =========================
  async set(
    key,
    value,
    ttl = 3600,
  ) {
    try {
      const redis =
        await getRedis();

      await redis.set(
        key,
        JSON.stringify(value),
        {
          EX: ttl,
        },
      );

      return true;
    } catch (error) {
      logger.error(
        'cache.set error',
        error,
      );
      return false;
    }
  },

  // =========================
  // GET
  // =========================
  async get(key) {
    try {
      const redis =
        await getRedis();

      const data =
        await redis.get(key);

      if (!data) {
        return null;
      }

      return safeParse(data);
    } catch (error) {
      logger.error(
        'cache.get error',
        error,
      );
      return null;
    }
  },

  // =========================
  // EXISTS
  // =========================
  async exists(key) {
    try {
      const redis =
        await getRedis();

      const exists =
        await redis.exists(
          key,
        );

      return exists === 1;
    } catch (error) {
      logger.error(
        'cache.exists error',
        error,
      );
      return false;
    }
  },

  // =========================
  // TTL
  // =========================
  async ttl(key) {
    try {
      const redis =
        await getRedis();

      return await redis.ttl(
        key,
      );
    } catch (error) {
      logger.error(
        'cache.ttl error',
        error,
      );
      return -1;
    }
  },

  // =========================
  // DELETE
  // =========================
  async del(key) {
    try {
      const redis =
        await getRedis();

      await redis.del(key);

      return true;
    } catch (error) {
      logger.error(
        'cache.del error',
        error,
      );
      return false;
    }
  },

  // =========================
  // MULTI DELETE
  // =========================
  async delMany(keys = []) {
    try {
      if (!keys.length) {
        return true;
      }

      const redis =
        await getRedis();

      await redis.del(keys);

      return true;
    } catch (error) {
      logger.error(
        'cache.delMany error',
        error,
      );
      return false;
    }
  },

  // =========================
  // CLEAR PATTERN
  // =========================
  async clearPattern(
    pattern,
  ) {
    try {
      const redis =
        await getRedis();

      const keys =
        await redis.keys(
          pattern,
        );

      if (keys.length) {
        await redis.del(
          keys,
        );
      }

      return true;
    } catch (error) {
      logger.error(
        'cache.clearPattern error',
        error,
      );
      return false;
    }
  },

  // =========================
  // REMEMBER
  // =========================
  async remember(
    key,
    ttl,
    callback,
  ) {
    const cached =
      await this.get(key);

    if (cached !== null) {
      return cached;
    }

    const fresh =
      await callback();

    await this.set(
      key,
      fresh,
      ttl,
    );

    return fresh;
  },
};