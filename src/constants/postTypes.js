// =========================
// TIPOS OFICIALES DE POST
// =========================

export const POST_TYPES = Object.freeze({
  CORTE: 'corte',
  COMANDO: 'comando',
  FICHA: 'ficha',
  PREGUNTA: 'pregunta',
  APORTE: 'aporte',
  LIBRE: 'libre',
});

// =========================
// LISTA VALIDACIÓN
// =========================

export const POST_TYPES_LIST = Object.freeze(
  Object.values(POST_TYPES),
);

// =========================
// HELPERS
// =========================

export const isValidPostType = (type) =>
  POST_TYPES_LIST.includes(type);

export const TECHNICAL_POST_TYPES = Object.freeze([
  POST_TYPES.CORTE,
  POST_TYPES.COMANDO,
  POST_TYPES.FICHA,
  POST_TYPES.APORTE,
]);