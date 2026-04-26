import { logger } from '../../utils/logger.js';

// =========================
// SOCKET HOLDER
// =========================

let ioInstance = null;

// =========================
// INTERNAL HELPERS
// =========================

const hasSocket = () =>
  ioInstance &&
  typeof ioInstance.emit ===
    'function';

const safeRoom = (value) =>
  String(value).trim();

// =========================
// PUBLIC REGISTRY
// =========================

export const setPushInstance = (
  io,
) => {
  ioInstance = io;
  return true;
};

export const getPushInstance =
  () => ioInstance;

// =========================
// PUSH SERVICE
// =========================

export const pushService = {
  setInstance:
    setPushInstance,

  getInstance:
    getPushInstance,

  isReady() {
    return hasSocket();
  },

  sendToUser(
    userId,
    event,
    payload = {},
  ) {
    try {
      if (!hasSocket()) {
        return false;
      }

      ioInstance
        .to(
          `user:${safeRoom(
            userId,
          )}`,
        )
        .emit(
          event,
          payload,
        );

      return true;
    } catch (error) {
      logger.error(
        'push.sendToUser error',
        error,
      );
      return false;
    }
  },

  sendToUsers(
    userIds = [],
    event,
    payload = {},
  ) {
    try {
      if (!hasSocket()) {
        return false;
      }

      for (const userId of userIds) {
        ioInstance
          .to(
            `user:${safeRoom(
              userId,
            )}`,
          )
          .emit(
            event,
            payload,
          );
      }

      return true;
    } catch (error) {
      logger.error(
        'push.sendToUsers error',
        error,
      );
      return false;
    }
  },

  sendToRoom(
    room,
    event,
    payload = {},
  ) {
    try {
      if (!hasSocket()) {
        return false;
      }

      ioInstance
        .to(
          safeRoom(room),
        )
        .emit(
          event,
          payload,
        );

      return true;
    } catch (error) {
      logger.error(
        'push.sendToRoom error',
        error,
      );
      return false;
    }
  },

  broadcast(
    event,
    payload = {},
  ) {
    try {
      if (!hasSocket()) {
        return false;
      }

      ioInstance.emit(
        event,
        payload,
      );

      return true;
    } catch (error) {
      logger.error(
        'push.broadcast error',
        error,
      );
      return false;
    }
  },

  exceptRoom(
    room,
    event,
    payload = {},
  ) {
    try {
      if (!hasSocket()) {
        return false;
      }

      ioInstance
        .except(
          safeRoom(room),
        )
        .emit(
          event,
          payload,
        );

      return true;
    } catch (error) {
      logger.error(
        'push.exceptRoom error',
        error,
      );
      return false;
    }
  },
};