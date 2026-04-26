import { server } from './app.js';
import { env } from './config/env.js';
import { getDB } from './config/db.js';
import { getRedis } from './config/redis.js';
import { logger } from './utils/logger.js';

const PORT = Number(env.PORT) || 3000;

let httpServer = null;

// =========================
// START SERVER
// =========================
const startServer = async () => {
  try {
    await getDB().$connect();
    logger.info('Database connected');

    await getRedis();
    logger.info('Redis connected');

    httpServer = server.listen(PORT, () => {
      logger.info(`TecniRed backend running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`API Prefix: ${env.API_PREFIX}`);
    });
  } catch (error) {
    logger.error('Startup failure', error);
    process.exit(1);
  }
};

// =========================
// GRACEFUL SHUTDOWN
// =========================
const shutdown = async (signal) => {
  logger.warn(`Received ${signal}. Closing server...`);

  try {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
    }

    await getDB().$disconnect();

    const redis = await getRedis();
    if (redis?.quit) {
      await redis.quit();
    }

    logger.info('Shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Shutdown error', error);
    process.exit(1);
  }
};

// =========================
// PROCESS EVENTS
// =========================
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

// =========================
// INIT
// =========================
startServer();