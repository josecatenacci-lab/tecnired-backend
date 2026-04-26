import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const required = (key, fallback = '') => {
  const value = process.env[key] ?? fallback;

  if (value === '' || value === undefined || value === null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const env = {
  // CORE
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: toNumber(process.env.PORT, 3000),
  APP_NAME: process.env.APP_NAME || 'TecniRed Backend',
  APP_ENV: process.env.APP_ENV || 'local',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // DATABASE
  DATABASE_URL: required('DATABASE_URL'),

  // JWT
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || required('JWT_SECRET'),
  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // REDIS
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: toNumber(process.env.REDIS_PORT, 6379),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_TLS: toBoolean(process.env.REDIS_TLS),

  // QUEUES
  QUEUE_REDIS_HOST:
    process.env.QUEUE_REDIS_HOST || process.env.REDIS_HOST || '127.0.0.1',
  QUEUE_REDIS_PORT: toNumber(
    process.env.QUEUE_REDIS_PORT || process.env.REDIS_PORT,
    6379,
  ),
  QUEUE_REDIS_PASSWORD:
    process.env.QUEUE_REDIS_PASSWORD ||
    process.env.REDIS_PASSWORD ||
    '',

  // SECURITY
  TRUST_PROXY: toBoolean(process.env.TRUST_PROXY),
  RATE_LIMIT_WINDOW: toNumber(
    process.env.RATE_LIMIT_WINDOW,
    900000,
  ),
  RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 200),
  BCRYPT_SALT_ROUNDS: toNumber(
    process.env.BCRYPT_SALT_ROUNDS,
    12,
  ),

  // BODY / REQUESTS
  MAX_PAYLOAD_SIZE: process.env.MAX_PAYLOAD_SIZE || '10mb',
  REQUEST_TIMEOUT: toNumber(
    process.env.REQUEST_TIMEOUT,
    30000,
  ),

  // FILES
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: toNumber(
    process.env.MAX_FILE_SIZE,
    10485760,
  ),

  // LOGGING
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  ENABLE_EVENT_LOGS: toBoolean(
    process.env.ENABLE_EVENT_LOGS,
    true,
  ),
  ENABLE_REQUEST_LOGS: toBoolean(
    process.env.ENABLE_REQUEST_LOGS,
    true,
  ),

  // FLAGS
  ENABLE_CHAT: toBoolean(process.env.ENABLE_CHAT, true),
  ENABLE_NOTIFICATIONS: toBoolean(
    process.env.ENABLE_NOTIFICATIONS,
    true,
  ),
  ENABLE_REPUTATION: toBoolean(
    process.env.ENABLE_REPUTATION,
    true,
  ),
  ENABLE_POSTS: toBoolean(process.env.ENABLE_POSTS, true),
  ENABLE_COMMENTS: toBoolean(
    process.env.ENABLE_COMMENTS,
    true,
  ),
  ENABLE_REACTIONS: toBoolean(
    process.env.ENABLE_REACTIONS,
    true,
  ),
  ENABLE_SEARCH: toBoolean(
    process.env.ENABLE_SEARCH,
    true,
  ),
  ENABLE_TOOLS: toBoolean(
    process.env.ENABLE_TOOLS,
    true,
  ),

  // DEBUG
  SHOW_STACKTRACE: toBoolean(
    process.env.SHOW_STACKTRACE,
    true,
  ),
};