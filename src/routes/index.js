import { Router } from 'express';

import healthRoutes from '../modules/health/health.routes.js';
import userRoutes from '../modules/users/user.routes.js';
import reputationRoutes from '../modules/reputation/reputation.routes.js';
import notificationsRoutes from '../modules/notifications/notifications.routes.js';
import searchRoutes from '../modules/search/search.routes.js';
import toolsRoutes from '../modules/tools/tools.routes.js';

const router = Router();

// =========================
// SYSTEM
// =========================

router.use(
  '/health',
  healthRoutes,
);

// =========================
// CORE MODULES
// =========================

router.use(
  '/users',
  userRoutes,
);

router.use(
  '/reputation',
  reputationRoutes,
);

router.use(
  '/notifications',
  notificationsRoutes,
);

router.use(
  '/search',
  searchRoutes,
);

router.use(
  '/tools',
  toolsRoutes,
);

export default router;