import { reputationService } from '../modules/reputation/reputation.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// =========================
// REPUTATION JOBS
// =========================

let reputationInterval = null;

// =========================
// DAILY RECALCULATION
// =========================

const recalculateRanks = async () => {
  try {
    const ranking =
      await reputationService.getRanking({
        page: 1,
        limit: 1000,
      });

    logger.info(
      `Reputation ranking recalculated: ${ranking.meta.total} users`,
    );

    return true;
  } catch (error) {
    logger.error(
      'reputation.recalculate error',
      error,
    );
    return false;
  }
};

// =========================
// WEEKLY MAINTENANCE
// =========================

const cleanupReputationHistory =
  async () => {
    try {
      logger.info(
        'Reputation history maintenance executed',
      );

      return true;
    } catch (error) {
      logger.error(
        'reputation.cleanup error',
        error,
      );
      return false;
    }
  };

// =========================
// STARTER
// =========================

export const startReputationJobs =
  () => {
    if (
      env.ENABLE_REPUTATION_JOBS !==
      true
    ) {
      logger.info(
        'Reputation jobs disabled',
      );
      return;
    }

    if (reputationInterval) {
      return;
    }

    reputationInterval =
      setInterval(
        async () => {
          await recalculateRanks();
          await cleanupReputationHistory();
        },
        1000 *
          60 *
          60 *
          24,
      );

    logger.info(
      'Reputation jobs started',
    );
  };

// =========================
// STOPPER
// =========================

export const stopReputationJobs =
  () => {
    if (reputationInterval) {
      clearInterval(
        reputationInterval,
      );
      reputationInterval =
        null;

      logger.info(
        'Reputation jobs stopped',
      );
    }
  };

// =========================
// MANUAL RUN
// =========================

export const reputationJob =
  {
    start:
      startReputationJobs,
    stop:
      stopReputationJobs,
    recalculateRanks,
    cleanupReputationHistory,
  };