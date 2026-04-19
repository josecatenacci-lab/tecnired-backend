// =========================
// RESPUESTAS ESTÁNDAR API
// =========================

export const success = (res, data = null, message = 'OK', status = 200) => {
  return res.status(status).json({
    ok: true,
    message,
    data,
  });
};

export const error = (res, message = 'Error interno', status = 500) => {
  return res.status(status).json({
    ok: false,
    message,
  });
};

// =========================
// RESPUESTAS PAGINADAS
// =========================

export const paginated = (
  res,
  { items = [], total = 0, page = 1, limit = 10 },
  message = 'OK'
) => {
  return res.status(200).json({
    ok: true,
    message,
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};