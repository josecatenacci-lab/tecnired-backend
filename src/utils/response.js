export const success = (
  res,
  data = null,
  message = 'OK',
  status = 200,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const error = (
  res,
  message = 'Internal server error',
  status = 500,
  details = null,
) => {
  return res.status(status || 500).json({
    success: false,
    message:
      message ||
      'Internal server error',
    ...(details && { details }),
  });
};

export const paginated = (
  res,
  {
    items = [],
    total = 0,
    page = 1,
    limit = 10,
  },
  message = 'OK',
) => {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(
        total / limit,
      ),
    },
  });
};

export const created = (
  res,
  data = null,
  message = 'Created',
) => success(
  res,
  data,
  message,
  201,
);

export const noContent = (res) =>
  res.status(204).send();

export const notFoundHandler = (
  req,
  res,
) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};