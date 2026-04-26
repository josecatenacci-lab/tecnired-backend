import { Router } from 'express';
import { z } from 'zod';

import { authMiddleware } from '../../middleware/auth.middleware.js';
import {
  validateBody,
  validateQuery,
} from '../../middleware/validate.middleware.js';

import { calculatorService } from './calculator.service.js';
import { gpsToolsService } from './gps.tools.service.js';
import { exportService } from './export.service.js';

import {
  success,
  error,
} from '../../utils/response.js';

const router = Router();

const CalculatorDTO = z.object({
  operation: z.enum([
    'ohm',
    'voltage_drop',
    'power',
    'current',
    'resistance',
  ]),
  values: z.record(z.any()),
});

const DistanceQueryDTO = z.object({
  lat1: z.coerce.number(),
  lon1: z.coerce.number(),
  lat2: z.coerce.number(),
  lon2: z.coerce.number(),
});

const ExportDTO = z.object({
  type: z.enum([
    'json',
    'csv',
  ]).default('json'),
  resource: z.enum([
    'users',
    'reputation',
    'notifications',
  ]),
});

// =========================
// ALL TOOLS PROTECTED
// =========================

router.use(authMiddleware);

// =========================
// CALCULATOR
// =========================

router.post(
  '/calculator',
  validateBody(CalculatorDTO),
  async (req, res) => {
    try {
      const data =
        await calculatorService.calculate(
          req.body,
        );

      return success(
        res,
        data,
        'Calculation completed',
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
// GPS DISTANCE
// =========================

router.get(
  '/gps/distance',
  validateQuery(DistanceQueryDTO),
  async (req, res) => {
    try {
      const data =
        await gpsToolsService.calculateDistance(
          req.query,
        );

      return success(
        res,
        data,
        'Distance calculated',
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
// EXPORT
// =========================

router.post(
  '/export',
  validateBody(ExportDTO),
  async (req, res) => {
    try {
      const data =
        await exportService.exportResource(
          req.body,
        );

      return success(
        res,
        data,
        'Export generated',
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