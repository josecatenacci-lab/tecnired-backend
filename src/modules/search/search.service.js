import { db } from '../../config/db.js';

export const searchService = {
  async search({
    q,
    page = 1,
    limit = 20,
    type = 'all',
  }) {
    const term = q.trim();
    const skip =
      (page - 1) * limit;

    const includeUsers =
      type === 'all' ||
      type === 'users';

    const includePosts =
      type === 'all' ||
      type === 'posts' ||
      type === 'fichas' ||
      type === 'commands';

    const result = {
      users: [],
      posts: [],
      meta: {
        page,
        limit,
        query: term,
        type,
      },
    };

    if (includeUsers) {
      result.users =
        await db.user.findMany({
          where: {
            deletedAt: null,
            OR: [
              {
                name: {
                  contains: term,
                  mode:
                    'insensitive',
                },
              },
              {
                username: {
                  contains: term,
                  mode:
                    'insensitive',
                },
              },
              {
                specialty: {
                  contains: term,
                  mode:
                    'insensitive',
                },
              },
            ],
          },
          take: limit,
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        });
    }

    if (includePosts) {
      const where = {
        deletedAt: null,
        isPublished: true,
        OR: [
          {
            title: {
              contains: term,
              mode:
                'insensitive',
            },
          },
          {
            content: {
              contains: term,
              mode:
                'insensitive',
            },
          },
          {
            brand: {
              contains: term,
              mode:
                'insensitive',
            },
          },
          {
            model: {
              contains: term,
              mode:
                'insensitive',
            },
          },
        ],
      };

      if (type === 'fichas') {
        where.type = 'ficha';
      }

      if (type === 'commands') {
        where.type =
          'comando';
      }

      result.posts =
        await db.post.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        });
    }

    return result;
  },

  async suggest({
    q,
    limit = 5,
  }) {
    const term = q.trim();

    const posts =
      await db.post.findMany({
        where: {
          deletedAt: null,
          isPublished: true,
          title: {
            contains: term,
            mode:
              'insensitive',
          },
        },
        take: limit,
        select: {
          id: true,
          title: true,
          type: true,
        },
      });

    const users =
      await db.user.findMany({
        where: {
          deletedAt: null,
          name: {
            contains: term,
            mode:
              'insensitive',
          },
        },
        take: limit,
        select: {
          id: true,
          name: true,
          username: true,
        },
      });

    return {
      users,
      posts,
    };
  },
};