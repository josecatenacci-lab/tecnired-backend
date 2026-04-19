const isProd = process.env.NODE_ENV === 'production';

// =========================
// LOGGER SIMPLE PRO
// =========================

export const logger = {
  info: (...args) => {
    console.log('ℹ️', ...args);
  },

  warn: (...args) => {
    console.warn('⚠️', ...args);
  },

  error: (...args) => {
    console.error('❌', ...args);
  },

  debug: (...args) => {
    if (!isProd) {
      console.debug('🐛', ...args);
    }
  },
};