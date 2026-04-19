import helmet from 'helmet';

// =========================
// SECURITY HEADERS (PROTECTION LAYER)
// =========================

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // ⚠️ desactivado para APIs + mobile
  crossOriginResourcePolicy: { policy: "cross-origin" },
});