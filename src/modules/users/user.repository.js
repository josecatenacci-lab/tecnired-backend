import { db } from '../../config/db.js';

const baseSelect = {
  id: true,
  email: true,
  name: true,
  username: true,
  avatarUrl: true,
  bio: true,
  phone: true,
  role: true,
  status: true,
  specialty: true,
  country: true,
  city: true,
  createdAt: true,
  updatedAt: true,
};

export const userRepository = {
  async findMany({
    page = 1,
    limit = 20,
    search,
  }) {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const [items, total] =
      await Promise.all([
        db.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          select: baseSelect,
        }),
        db.user.count({ where }),
      ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit,
        ),
      },
    };
  },

  async findById(id) {
    return db.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: baseSelect,
    });
  },

  async update(id, data) {
    return db.user.update({
      where: { id },
      data,
      select: baseSelect,
    });
  },

  async updateRole(id, role) {
    return db.user.update({
      where: { id },
      data: { role },
      select: baseSelect,
    });
  },

  async updateStatus(id, status) {
    return db.user.update({
      where: { id },
      data: { status },
      select: baseSelect,
    });
  },

  async softDelete(id) {
    return db.user.update({
      where: { id },
      data: {
        status: 'deleted',
        deletedAt: new Date(),
      },
      select: baseSelect,
    });
  },
};