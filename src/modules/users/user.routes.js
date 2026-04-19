import { Router } from 'express';
import { userController } from './user.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { body } from 'express-validator';
import { validateMiddleware } from '../../middleware/validate.middleware.js';

const router = Router();

// =========================
// TODAS LAS RUTAS PROTEGIDAS
// =========================

// =========================
// PERFIL
// =========================
router.get('/me', authMiddleware, userController.getProfile);

// =========================
// ACTUALIZAR PERFIL
// =========================
router.put(
  '/me',
  authMiddleware,
  [
    body('name').optional().isString().isLength({ min: 2 }),
    validateMiddleware,
  ],
  userController.updateProfile
);

// =========================
// CAMBIAR ROL (ADMIN FUTURO)
// =========================
router.patch(
  '/role',
  authMiddleware,
  [
    body('userId').notEmpty(),
    body('role').notEmpty(),
    validateMiddleware,
  ],
  userController.changeRole
);

// =========================
// ELIMINAR USUARIO
// =========================
router.delete('/me', authMiddleware, userController.deleteUser);

export default router;