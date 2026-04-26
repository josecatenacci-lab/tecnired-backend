import { userService } from './user.service.js';
import {
  success,
  error,
} from '../../utils/response.js';

// =========================
// USER CONTROLLER
// =========================

export const userController = {
  // =========================
  // SELF PROFILE
  // =========================

  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(
        req.user.id,
      );

      return success(
        res,
        user,
        'Profile fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async updateProfile(req, res) {
    try {
      const updated =
        await userService.updateProfile(
          req.user.id,
          req.body,
        );

      return success(
        res,
        updated,
        'Profile updated',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(
        req.user.id,
      );

      return success(
        res,
        null,
        'User deleted',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  // =========================
  // ADMIN / MODERATION
  // =========================

  async getUsers(req, res) {
    try {
      const data =
        await userService.getUsers(
          req.query,
        );

      return success(
        res,
        data,
        'Users fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async getUserById(req, res) {
    try {
      const user =
        await userService.getUserById(
          req.params.id,
        );

      return success(
        res,
        user,
        'User fetched',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async changeRole(req, res) {
    try {
      const updated =
        await userService.changeRole(
          req.params.id,
          req.body.role,
        );

      return success(
        res,
        updated,
        'Role updated',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async changeStatus(req, res) {
    try {
      const updated =
        await userService.changeStatus(
          req.params.id,
          req.body.status,
        );

      return success(
        res,
        updated,
        'Status updated',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },
};