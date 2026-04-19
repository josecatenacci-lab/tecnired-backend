import { Router } from 'express';
import { commentsController } from './comments.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validateMiddleware } from '../../middleware/validate.middleware.js';

const router = Router();

// =========================
// CREAR COMENTARIO
// =========================
router.post(
  '/',
  authMiddleware,
  [
    body('content').notEmpty().isString().isLength({ max: 2000 }),
    body('postId').notEmpty().isString(),
    validateMiddleware,
  ],
  commentsController.create
);

// =========================
// COMENTARIOS POR POST
// =========================
router.get('/post/:postId', authMiddleware, commentsController.getByPost);

// =========================
// ELIMINAR COMENTARIO
// =========================
router.delete('/:id', authMiddleware, commentsController.delete);

export default router;