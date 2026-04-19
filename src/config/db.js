import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDB = () => prisma;

export const db = prisma;