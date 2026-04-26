import { Router } from 'express';

import {
  authMiddleware,
} from '../../middleware/auth.middleware.js';

import {
  validateQuery,
} from '../../middleware/validate.middleware.js';

import { z } from 'zod';

import { searchController } from './search.controller.js';

const router = Router();

const SearchQueryDTO = z.object({
  q: z.string().min(1).max(120),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z
    .enum([
      'all',
      'users',
      'posts',
      'fichas',
      'commands',
    ])
    .default('all'),
});

// =========================
// GLOBAL SEARCH
// =========================

router.get(
  '/',
  authMiddleware,
  validateQuery(SearchQueryDTO),
  searchController.search,
);

// =========================
// QUICK SUGGESTIONS
// =========================

router.get(
  '/suggest',
  authMiddleware,
  validateQuery(
    z.object({
      q: z.string().min(1).max(80),
      limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(10)
        .default(5),
    }),
  ),
  searchController.suggest,
);

export default router;