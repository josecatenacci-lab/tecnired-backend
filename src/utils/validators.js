import { POST_TYPES_LIST } from '../constants/postTypes.js';
import { ROLES_LIST } from '../constants/roles.js';

// =========================
// BASIC
// =========================

export const isValidEmail = (
  email,
) => {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email).trim(),
  );
};

export const isValidString = (
  value,
  min = 1,
  max = 5000,
) => {
  if (
    typeof value !==
    'string'
  ) {
    return false;
  }

  const v =
    value.trim();

  return (
    v.length >= min &&
    v.length <= max
  );
};

export const isValidId = (
  id,
) => {
  if (
    typeof id !==
    'string'
  ) {
    return false;
  }

  const value =
    id.trim();

  return (
    value.length >= 8
  );
};

export const isValidUsername = (
  username,
) => {
  return /^[a-zA-Z0-9_.-]{3,30}$/.test(
    String(
      username || '',
    ),
  );
};

export const isValidNumber = (
  value,
) => {
  return Number.isFinite(
    Number(value),
  );
};

// =========================
// DOMAIN
// =========================

export const isValidPostType = (
  type,
) =>
  POST_TYPES_LIST.includes(
    type,
  );

export const isValidRole = (
  role,
) =>
  ROLES_LIST.includes(
    role,
  );

export const isValidStatus = (
  status,
) =>
  [
    'active',
    'inactive',
    'suspended',
    'deleted',
  ].includes(status);

// =========================
// VEHICLE
// =========================

export const isValidVehicle = ({
  brand,
  model,
  year,
}) => {
  if (
    !isValidString(
      brand,
      2,
      50,
    )
  ) {
    return false;
  }

  if (
    model &&
    !isValidString(
      model,
      1,
      50,
    )
  ) {
    return false;
  }

  if (
    year !==
      undefined &&
    year !== null
  ) {
    const y =
      Number(year);

    const current =
      new Date().getFullYear() +
      1;

    if (
      !Number.isInteger(
        y,
      ) ||
      y < 1950 ||
      y > current
    ) {
      return false;
    }
  }

  return true;
};

// =========================
// GPS
// =========================

export const isValidLatitude = (
  value,
) => {
  const n =
    Number(value);

  return (
    Number.isFinite(
      n,
    ) &&
    n >= -90 &&
    n <= 90
  );
};

export const isValidLongitude = (
  value,
) => {
  const n =
    Number(value);

  return (
    Number.isFinite(
      n,
    ) &&
    n >= -180 &&
    n <= 180
  );
};

// =========================
// DATE
// =========================

export const isValidDate = (
  value,
) => {
  const date =
    new Date(value);

  return !Number.isNaN(
    date.getTime(),
  );
};