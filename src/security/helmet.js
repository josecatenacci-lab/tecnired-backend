import helmet from 'helmet';

// =========================
// SECURITY HEADERS
// =========================

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false,

  crossOriginEmbedderPolicy: false,

  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },

  referrerPolicy: {
    policy: 'no-referrer',
  },

  frameguard: {
    action: 'deny',
  },

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  noSniff: true,

  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },

  hidePoweredBy: true,
});