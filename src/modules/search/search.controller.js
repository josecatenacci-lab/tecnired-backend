import { searchService } from './search.service.js';
import {
  success,
  error,
} from '../../utils/response.js';

// =========================
// SEARCH CONTROLLER
// =========================

export const searchController = {
  async search(req, res) {
    try {
      const data =
        await searchService.search(
          req.query,
        );

      return success(
        res,
        data,
        'Search completed',
      );
    } catch (err) {
      return error(
        res,
        err.message,
        err.statusCode,
      );
    }
  },

  async suggest(req, res) {
    try {
      const data =
        await searchService.suggest(
          req.query,
        );

      return success(
        res,
        data,
        'Suggestions fetched',
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