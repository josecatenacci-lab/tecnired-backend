import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis;

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
    errorFormat: 'pretty',
  });

export const prisma =
  globalForPrisma.__tecnired_prisma__ || createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.__tecnired_prisma__ = prisma;
}

export const getDB = () => prisma;

export const closeDB = async () => {
  await prisma.$disconnect();
};