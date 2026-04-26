import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err,
  req,
  res,
  _next,
) => {
  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  logger.error('Request error', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  // =========================
  // ZOD VALIDATION
  // =========================
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((item) => ({
        field: item.path.join('.'),
        message: item.message,
      })),
    });
  }

  // =========================
  // PRISMA KNOWN ERRORS
  // =========================
  if (
    err instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate record',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }
  }

  // =========================
  // JWT
  // =========================
  if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // =========================
  // DEFAULT
  // =========================
  return res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      'Internal server error',
    ...(env.SHOW_STACKTRACE && {
      stack: err.stack,
    }),
  });
};