import { POST_TYPES_LIST } from '../constants/postTypes.js';
import { ROLES_LIST } from '../constants/roles.js';

// =========================
// VALIDADORES GENERALES
// =========================

export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidString = (value, min = 1, max = 5000) => {
  if (typeof value !== 'string') return false;

  const v = value.trim();
  return v.length >= min && v.length <= max;
};

export const isValidId = (id) => {
  return typeof id === 'string' && id.length > 0;
};

// =========================
// VALIDADORES DE NEGOCIO
// =========================

export const isValidPostType = (type) => {
  return POST_TYPES_LIST.includes(type);
};

export const isValidRole = (role) => {
  return ROLES_LIST.includes(role);
};

// =========================
// VALIDADOR VEHÍCULO
// =========================

export const isValidVehicle = ({ brand, model, year }) => {
  if (!isValidString(brand, 2, 50)) return false;

  if (model && !isValidString(model, 1, 50)) return false;

  if (year) {
    const y = Number(year);
    const current = new Date().getFullYear();

    if (isNaN(y) || y < 1950 || y > current) return false;
  }

  return true;
};