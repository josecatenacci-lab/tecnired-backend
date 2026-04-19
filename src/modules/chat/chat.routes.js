import { Router } from 'express';
import { chatController } from './chat.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validateMiddleware } from '../../middleware/validate.middleware.js';

const router = Router();

// =========================
// ENVIAR MENSAJE
// =========================
router.post(
  '/',
  authMiddleware,
  [
    body('content').isString().isLength({ min: 1, max: 2000 }),
    body('room').optional().isString(),
    body('receiverId').optional().isString(),
    validateMiddleware,
  ],
  chatController.sendMessage
);

// =========================
// CHAT GLOBAL
// =========================
router.get('/global', authMiddleware, chatController.getGlobalChat);

// =========================
// CHAT PRIVADO
// =========================
router.get('/private/:userA/:userB', authMiddleware, chatController.getPrivateChat);

export default router;