import { Router } from 'express';
import {
  healthCheck,
  readinessCheck,
  livenessCheck,
} from './health.controller.js';

const router = Router();

// =========================
// HEALTH ENDPOINTS
// =========================

router.get('/', healthCheck);
router.get('/live', livenessCheck);
router.get('/ready', readinessCheck);

export default router;