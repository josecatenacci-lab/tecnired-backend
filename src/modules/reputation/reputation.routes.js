import { Router } from 'express';

import {
  authMiddleware,
  requireRole,
} from '../../middleware/auth.middleware.js';

import {
  validateBody,
  validateQuery,
} from '../../middleware/validate.middleware.js';

import {
  ReputationAdjustDTO,
  ReputationQueryDTO,
} from '../../dto/reputation.dto.js';

import { reputationService } from './reputation.service.js';
import {
  success,
  error,
} from '../../utils/response.js';

const router = Router();

// =========================
// SELF REPUTATION
// =========================

router.get(
  '/me',
  authMiddleware,
  async (req, res) => {
    try {
      const data =
        await reputationService.getByUserId(
          req.user.id,
        );

      return success(
        res,
        data,
        'Reputation fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
);

// =========================
// USER REPUTATION
// =========================

router.get(
  '/user/:userId',
  authMiddleware,
  async (req, res) => {
    try {
      const data =
        await reputationService.getByUserId(
          req.params.userId,
        );

      return success(
        res,
        data,
        'Reputation fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
);

// =========================
// HISTORY
// =========================

router.get(
  '/history',
  authMiddleware,
  validateQuery(
    ReputationQueryDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await reputationService.getHistory(
          req.user.id,
          req.query,
        );

      return success(
        res,
        data,
        'History fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
);

// =========================
// ADMIN ADJUST
// =========================

router.post(
  '/adjust',
  authMiddleware,
  requireRole('admin'),
  validateBody(
    ReputationAdjustDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await reputationService.adjust(
          req.body,
        );

      return success(
        res,
        data,
        'Reputation adjusted',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
);

// =========================
// RANKING
// =========================

router.get(
  '/ranking',
  authMiddleware,
  validateQuery(
    ReputationQueryDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await reputationService.getRanking(
          req.query,
        );

      return success(
        res,
        data,
        'Ranking fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
);

export default router;