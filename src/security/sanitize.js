import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// =========================
// SUB-MIDDLEWARES
// =========================

export const mongoSanitizeMiddleware =
  mongoSanitize({
    replaceWith: '_',
  });

export const xssMiddleware = xss();

// =========================
// MAIN SANITIZER
// =========================

export const sanitizeMiddleware = (
  req,
  res,
  next,
) => {
  mongoSanitizeMiddleware(
    req,
    res,
    (error) => {
      if (error) return next(error);

      xssMiddleware(
        req,
        res,
        next,
      );
    },
  );
};