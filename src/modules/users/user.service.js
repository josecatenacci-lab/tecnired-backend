import { userRepository } from './user.repository.js';
import { isValidRole } from '../../constants/roles.js';

const createHttpError = (
  statusCode,
  message,
) => ({
  statusCode,
  message,
});

const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};

export const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(
      userId,
    );

    if (!user) {
      throw createHttpError(
        404,
        'User not found',
      );
    }

    return sanitizeUser(user);
  },

  async getUsers(query) {
    return userRepository.findMany(query);
  },

  async getUserById(userId) {
    const user = await userRepository.findById(
      userId,
    );

    if (!user) {
      throw createHttpError(
        404,
        'User not found',
      );
    }

    return sanitizeUser(user);
  },

  async updateProfile(userId, data) {
    const existing =
      await userRepository.findById(userId);

    if (!existing) {
      throw createHttpError(
        404,
        'User not found',
      );
    }

    const updatedUser =
      await userRepository.update(
        userId,
        data,
      );

    return sanitizeUser(updatedUser);
  },

  async changeRole(userId, role) {
    if (!isValidRole(role)) {
      throw createHttpError(
        400,
        'Invalid role',
      );
    }

    const updated =
      await userRepository.updateRole(
        userId,
        role,
      );

    return sanitizeUser(updated);
  },

  async changeStatus(userId, status) {
    const allowedStatuses = [
      'active',
      'inactive',
      'suspended',
      'deleted',
    ];

    if (!allowedStatuses.includes(status)) {
      throw createHttpError(
        400,
        'Invalid status',
      );
    }

    const updated =
      await userRepository.updateStatus(
        userId,
        status,
      );

    return sanitizeUser(updated);
  },

  async deleteUser(userId) {
    const existing =
      await userRepository.findById(userId);

    if (!existing) {
      throw createHttpError(
        404,
        'User not found',
      );
    }

    const deleted =
      await userRepository.softDelete(userId);

    return sanitizeUser(deleted);
  },
};