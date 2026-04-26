import { verifyToken } from '../utils/jwt.js';
import { hasRoleLevel } from '../constants/roles.js';

const unauthorized = (res, message = 'Unauthorized') =>
  res.status(401).json({
    success: false,
    message,
  });

const forbidden = (res, message = 'Forbidden') =>
  res.status(403).json({
    success: false,
    message,
  });

// =========================
// AUTH REQUIRED
// =========================

export const authMiddleware = (
  req,
  res,
  next,
) => {
  try {
    const header =
      req.headers.authorization ||
      req.headers.Authorization;

    if (!header) {
      return unauthorized(
        res,
        'Authorization header required',
      );
    }

    if (!header.startsWith('Bearer ')) {
      return unauthorized(
        res,
        'Invalid authorization format',
      );
    }

    const token = header.split(' ')[1];

    if (!token) {
      return unauthorized(
        res,
        'Access token required',
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return unauthorized(
        res,
        'Invalid or expired token',
      );
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user',
    };

    next();
  } catch (_error) {
    return unauthorized(
      res,
      'Authentication failed',
    );
  }
};

// =========================
// OPTIONAL AUTH
// =========================

export const optionalAuthMiddleware = (
  req,
  _res,
  next,
) => {
  try {
    const header =
      req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return next();
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
      };
    }

    next();
  } catch (_error) {
    next();
  }
};

// =========================
// ROLE GUARD
// =========================

export const requireRole = (
  requiredRole,
) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(
        res,
        'Authentication required',
      );
    }

    const currentRole =
      req.user.role || 'user';

    if (
      !hasRoleLevel(
        currentRole,
        requiredRole,
      )
    ) {
      return forbidden(
        res,
        'Insufficient permissions',
      );
    }

    next();
  };
};