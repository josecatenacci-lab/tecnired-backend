import { Router } from 'express';
import { postsController } from './posts.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validateMiddleware } from '../../middleware/validate.middleware.js';

const router = Router();

// =========================
// CREAR POST
// =========================
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().isString(),
    body('content').notEmpty().isString(),
    body('type').isIn(['corte', 'comando', 'libre']),
    validateMiddleware,
  ],
  postsController.create
);

// =========================
// FEED PRINCIPAL
// =========================
router.get('/', authMiddleware, postsController.getFeed);

// =========================
// OBTENER POST POR ID
// =========================
router.get('/:id', authMiddleware, postsController.getById);

// =========================
// ELIMINAR POST
// =========================
router.delete('/:id', authMiddleware, postsController.delete);

export default router;