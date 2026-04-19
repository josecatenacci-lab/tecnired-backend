import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateMiddleware } from '../../middleware/validate.middleware.js';
import { body } from 'express-validator';

const router = Router();

// =========================
// REGISTER ROUTE
// =========================
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nombre requerido'),
    validateMiddleware,
  ],
  authController.register
);

// =========================
// LOGIN ROUTE
// =========================
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
    validateMiddleware,
  ],
  authController.login
);

export default router;