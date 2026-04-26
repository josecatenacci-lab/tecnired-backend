import { db } from '../../config/db.js';

const createHttpError = (statusCode, message) => ({
  statusCode,
  message,
});

const toCsv = (items) => {
  if (!items.length) return '';

  const headers = Object.keys(items[0]);

  const rows = items.map((item) =>
    headers
      .map((header) => {
        const value = item[header];

        if (value === null || value === undefined) {
          return '';
        }

        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replaceAll('"', '""')}"`;
        }

        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(','),
  );

  return [headers.join(','), ...rows].join('\n');
};

const getResourceData = async (resource) => {
  switch (resource) {
    case 'users':
      return db.user.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          status: true,
          specialty: true,
          country: true,
          city: true,
          createdAt: true,
        },
        take: 1000,
        orderBy: {
          createdAt: 'desc',
        },
      });

    case 'reputation':
      return db.reputation.findMany({
        select: {
          id: true,
          userId: true,
          points: true,
          level: true,
          rank: true,
          updatedAt: true,
        },
        take: 1000,
        orderBy: {
          points: 'desc',
        },
      });

    case 'notifications':
      return db.notification.findMany({
        select: {
          id: true,
          userId: true,
          type: true,
          status: true,
          title: true,
          message: true,
          createdAt: true,
        },
        take: 1000,
        orderBy: {
          createdAt: 'desc',
        },
      });

    default:
      throw createHttpError(
        400,
        'Unsupported export resource',
      );
  }
};

export const exportService = {
  async exportResource({ resource, type = 'json' }) {
    const items = await getResourceData(resource);

    if (type === 'json') {
      return {
        resource,
        type,
        total: items.length,
        generatedAt: new Date().toISOString(),
        items,
      };
    }

    if (type === 'csv') {
      return {
        resource,
        type,
        total: items.length,
        generatedAt: new Date().toISOString(),
        content: toCsv(items),
      };
    }

    throw createHttpError(
      400,
      'Unsupported export type',
    );
  },
};