import { Router } from 'express';

import { userController } from './user.controller.js';

import {
  authMiddleware,
  requireRole,
} from '../../middleware/auth.middleware.js';

import {
  validateBody,
  validateQuery,
} from '../../middleware/validate.middleware.js';

import {
  UpdateUserDTO,
  UserQueryDTO,
} from '../../dto/user.dto.js';

const router = Router();

// =========================
// SELF PROFILE
// =========================

router.get(
  '/me',
  authMiddleware,
  userController.getProfile,
);

router.put(
  '/me',
  authMiddleware,
  validateBody(UpdateUserDTO),
  userController.updateProfile,
);

router.delete(
  '/me',
  authMiddleware,
  userController.deleteUser,
);

// =========================
// ADMIN / MODERATION
// =========================

router.get(
  '/',
  authMiddleware,
  requireRole('moderator'),
  validateQuery(UserQueryDTO),
  userController.getUsers,
);

router.get(
  '/:id',
  authMiddleware,
  requireRole('moderator'),
  userController.getUserById,
);

router.patch(
  '/:id/role',
  authMiddleware,
  requireRole('admin'),
  userController.changeRole,
);

router.patch(
  '/:id/status',
  authMiddleware,
  requireRole('moderator'),
  userController.changeStatus,
);

export default router;