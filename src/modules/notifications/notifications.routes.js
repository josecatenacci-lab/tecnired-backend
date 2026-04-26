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
  CreateNotificationDTO,
  UpdateNotificationDTO,
  NotificationQueryDTO,
} from '../../dto/notification.dto.js';

import { notificationsService } from './notifications.service.js';
import {
  success,
  error,
} from '../../utils/response.js';

const router = Router();

// =========================
// MY NOTIFICATIONS
// =========================

router.get(
  '/',
  authMiddleware,
  validateQuery(
    NotificationQueryDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await notificationsService.getMine(
          req.user.id,
          req.query,
        );

      return success(
        res,
        data,
        'Notifications fetched',
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
// MARK AS READ
// =========================

router.patch(
  '/:id/read',
  authMiddleware,
  async (req, res) => {
    try {
      const data =
        await notificationsService.markAsRead(
          req.user.id,
          req.params.id,
        );

      return success(
        res,
        data,
        'Notification updated',
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
// MARK ALL AS READ
// =========================

router.patch(
  '/read-all',
  authMiddleware,
  async (req, res) => {
    try {
      const data =
        await notificationsService.markAllAsRead(
          req.user.id,
        );

      return success(
        res,
        data,
        'Notifications updated',
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
// DELETE ONE
// =========================

router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      await notificationsService.remove(
        req.user.id,
        req.params.id,
      );

      return success(
        res,
        null,
        'Notification removed',
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
// ADMIN CREATE
// =========================

router.post(
  '/',
  authMiddleware,
  requireRole('admin'),
  validateBody(
    CreateNotificationDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await notificationsService.create(
          req.body,
        );

      return success(
        res,
        data,
        'Notification created',
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
// ADMIN UPDATE STATUS
// =========================

router.patch(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  validateBody(
    UpdateNotificationDTO,
  ),
  async (req, res) => {
    try {
      const data =
        await notificationsService.adminUpdate(
          req.params.id,
          req.body,
        );

      return success(
        res,
        data,
        'Notification updated',
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