import { db } from '../../config/db.js';

// =========================
// CHAT REPOSITORY (DB LAYER)
// =========================

export const chatRepository = {
  // =========================
  // CREAR MENSAJE
  // =========================
  async createMessage(data) {
    return await db.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId || null,
        room: data.room || 'global',
      },
    });
  },

  // =========================
  // MENSAJES POR ROOM (CHAT GLOBAL)
  // =========================
  async getMessagesByRoom(room = 'global', limit = 50) {
    return await db.message.findMany({
      where: { room },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // =========================
  // CHAT PRIVADO ENTRE USUARIOS
  // =========================
  async getPrivateChat(userA, userB) {
    return await db.message.findMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};