export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    try {
      const result = schema.parse(req[source]);

      req[source] = result;

      next();
    } catch (error) {
      next(error);
    }
  };

export const validateBody = (schema) =>
  validate(schema, 'body');

export const validateParams = (schema) =>
  validate(schema, 'params');

export const validateQuery = (schema) =>
  validate(schema, 'query');

export const validateRequest =
  ({ body, params, query }) =>
  (req, _res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      if (query) {
        req.query = query.parse(req.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };