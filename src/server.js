import { app, server } from './app.js';
import { env } from './config/env.js';
import { getDB } from './config/db.js';
import { getRedis } from './config/redis.js';

// =========================
// SERVER ENTRY POINT
// =========================

const PORT = env.PORT || 3000;

// =========================
// START SERVER
// =========================
const startServer = async () => {
  try {
    // 🔥 DB CONNECT (PRISMA LAZY INIT)
    await getDB().$connect();
    console.log('🟢 Database conectada');

    // 🔥 REDIS CONNECT
    await getRedis();
    console.log('🟢 Redis conectado');

    // =========================
    // LISTEN SERVER
    // =========================
    server.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

// =========================
// START APP
// =========================
startServer();