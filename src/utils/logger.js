import { env } from '../config/env.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel =
  levels[
    env.LOG_LEVEL
  ] ?? levels.debug;

const shouldLog = (
  level,
) =>
  levels[level] <=
  currentLevel;

const format = (
  level,
  args,
) => {
  const timestamp =
    new Date().toISOString();

  return [
    `[${timestamp}]`,
    `[${level.toUpperCase()}]`,
    ...args,
  ];
};

export const logger = {
  error: (...args) => {
    if (
      shouldLog(
        'error',
      )
    ) {
      console.error(
        ...format(
          'error',
          args,
        ),
      );
    }
  },

  warn: (...args) => {
    if (
      shouldLog(
        'warn',
      )
    ) {
      console.warn(
        ...format(
          'warn',
          args,
        ),
      );
    }
  },

  info: (...args) => {
    if (
      shouldLog(
        'info',
      )
    ) {
      console.log(
        ...format(
          'info',
          args,
        ),
      );
    }
  },

  debug: (...args) => {
    if (
      shouldLog(
        'debug',
      ) &&
      env.NODE_ENV !==
        'production'
    ) {
      console.debug(
        ...format(
          'debug',
          args,
        ),
      );
    }
  },
};