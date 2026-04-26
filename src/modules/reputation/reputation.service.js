import { reputationRepository } from './reputation.repository.js';

const createHttpError = (
  statusCode,
  message,
) => ({
  statusCode,
  message,
});

const calculateLevel = (points) =>
  Math.max(1, Math.floor(points / 100) + 1);

const calculateRank = (points) => {
  if (points >= 5000) return 'legend';
  if (points >= 2500) return 'master';
  if (points >= 1000) return 'expert';
  if (points >= 500) return 'advanced';
  if (points >= 100) return 'intermediate';
  return 'rookie';
};

export const reputationService = {
  async initUser(userId) {
    return reputationRepository.createIfNotExists(
      userId,
    );
  },

  async getByUserId(userId) {
    let rep =
      await reputationRepository.getByUserId(
        userId,
      );

    if (!rep) {
      rep =
        await this.initUser(userId);
    }

    return rep;
  },

  async addPoints(
    userId,
    points,
    reason = null,
  ) {
    if (points <= 0) {
      throw createHttpError(
        400,
        'Points must be positive',
      );
    }

    return this.applyDelta(
      userId,
      points,
      reason,
    );
  },

  async removePoints(
    userId,
    points,
    reason = null,
  ) {
    if (points <= 0) {
      throw createHttpError(
        400,
        'Points must be positive',
      );
    }

    return this.applyDelta(
      userId,
      -points,
      reason,
    );
  },

  async applyDelta(
    userId,
    delta,
    reason,
  ) {
    const current =
      await this.getByUserId(userId);

    const nextPoints = Math.max(
      0,
      current.points + delta,
    );

    const level =
      calculateLevel(nextPoints);

    const rank =
      calculateRank(nextPoints);

    const updated =
      await reputationRepository.updateStats(
        userId,
        {
          points: nextPoints,
          level,
          rank,
        },
      );

    await reputationRepository.createEvent({
      userId,
      type: 'admin_adjustment',
      points: delta,
      reason,
    });

    return updated;
  },

  async adjust(payload) {
    return this.applyDelta(
      payload.userId,
      payload.points,
      payload.reason,
    );
  },

  async setLevel(userId, level) {
    if (level < 1) {
      throw createHttpError(
        400,
        'Invalid level',
      );
    }

    return reputationRepository.updateStats(
      userId,
      { level },
    );
  },

  async getHistory(userId, query) {
    return reputationRepository.getHistory(
      userId,
      query,
    );
  },

  async getRanking(query) {
    return reputationRepository.getRanking(
      query,
    );
  },
};