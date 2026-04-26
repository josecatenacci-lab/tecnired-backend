// =========================
// ROLES OFICIALES TECNIRED
// =========================

export const ROLES = Object.freeze({
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
});

// =========================
// LISTA VALIDACIÓN
// =========================

export const ROLES_LIST = Object.freeze(
  Object.values(ROLES),
);

// =========================
// JERARQUÍA
// =========================

export const ROLE_WEIGHT = Object.freeze({
  user: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
});

// =========================
// HELPERS
// =========================

export const isValidRole = (role) =>
  ROLES_LIST.includes(role);

export const hasRoleLevel = (
  currentRole,
  requiredRole,
) =>
  (ROLE_WEIGHT[currentRole] || 0) >=
  (ROLE_WEIGHT[requiredRole] || 0);

export const isAdminRole = (role) =>
  hasRoleLevel(role, ROLES.ADMIN);