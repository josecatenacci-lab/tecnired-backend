import { db } from '../config/db.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// =========================
// NOTIFICATIONS JOBS
// =========================

let notificationsInterval = null;

// =========================
// ARCHIVE OLD READ ITEMS
// =========================

const archiveOldReadNotifications =
  async () => {
    try {
      const threshold =
        new Date(
          Date.now() -
            1000 *
              60 *
              60 *
              24 *
              30,
        );

      const result =
        await db.notification.updateMany({
          where: {
            status: 'read',
            readAt: {
              lt: threshold,
            },
          },
          data: {
            status:
              'archived',
          },
        });

      logger.info(
        `Notifications archived: ${result.count}`,
      );

      return result.count;
    } catch (error) {
      logger.error(
        'notifications.archive error',
        error,
      );
      return 0;
    }
  };

// =========================
// DELETE OLD ARCHIVED
// =========================

const deleteOldArchivedNotifications =
  async () => {
    try {
      const threshold =
        new Date(
          Date.now() -
            1000 *
              60 *
              60 *
              24 *
              90,
        );

      const result =
        await db.notification.deleteMany({
          where: {
            status:
              'archived',
            createdAt: {
              lt: threshold,
            },
          },
        });

      logger.info(
        `Notifications deleted: ${result.count}`,
      );

      return result.count;
    } catch (error) {
      logger.error(
        'notifications.cleanup error',
        error,
      );
      return 0;
    }
  };

// =========================
// RUNNER
// =========================

const runNotificationsMaintenance =
  async () => {
    await archiveOldReadNotifications();
    await deleteOldArchivedNotifications();
  };

// =========================
// STARTER
// =========================

export const startNotificationsJobs =
  () => {
    if (
      env.ENABLE_NOTIFICATION_JOBS !==
      true
    ) {
      logger.info(
        'Notifications jobs disabled',
      );
      return;
    }

    if (
      notificationsInterval
    ) {
      return;
    }

    notificationsInterval =
      setInterval(
        runNotificationsMaintenance,
        1000 *
          60 *
          60 *
          24,
      );

    logger.info(
      'Notifications jobs started',
    );
  };

// =========================
// STOPPER
// =========================

export const stopNotificationsJobs =
  () => {
    if (
      notificationsInterval
    ) {
      clearInterval(
        notificationsInterval,
      );

      notificationsInterval =
        null;

      logger.info(
        'Notifications jobs stopped',
      );
    }
  };

// =========================
// PUBLIC API
// =========================

export const notificationsJob =
  {
    start:
      startNotificationsJobs,
    stop:
      stopNotificationsJobs,
    archiveOldReadNotifications,
    deleteOldArchivedNotifications,
    run:
      runNotificationsMaintenance,
  };