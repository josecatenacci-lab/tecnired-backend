const createHttpError = (statusCode, message) => ({
  statusCode,
  message,
});

const toNumber = (value, field) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw createHttpError(
      400,
      `Invalid numeric value for ${field}`,
    );
  }

  return number;
};

const calculateOhm = (values) => {
  const voltage = toNumber(values.voltage, 'voltage');
  const current = toNumber(values.current, 'current');

  if (current === 0) {
    throw createHttpError(
      400,
      'Current cannot be zero',
    );
  }

  return {
    operation: 'ohm',
    resistance: voltage / current,
    unit: 'ohm',
  };
};

const calculateVoltageDrop = (values) => {
  const current = toNumber(values.current, 'current');
  const resistance = toNumber(
    values.resistance,
    'resistance',
  );

  return {
    operation: 'voltage_drop',
    voltageDrop: current * resistance,
    unit: 'V',
  };
};

const calculatePower = (values) => {
  const voltage = toNumber(values.voltage, 'voltage');
  const current = toNumber(values.current, 'current');

  return {
    operation: 'power',
    power: voltage * current,
    unit: 'W',
  };
};

const calculateCurrent = (values) => {
  const voltage = toNumber(values.voltage, 'voltage');
  const resistance = toNumber(
    values.resistance,
    'resistance',
  );

  if (resistance === 0) {
    throw createHttpError(
      400,
      'Resistance cannot be zero',
    );
  }

  return {
    operation: 'current',
    current: voltage / resistance,
    unit: 'A',
  };
};

const calculateResistance = (values) => {
  const voltage = toNumber(values.voltage, 'voltage');
  const current = toNumber(values.current, 'current');

  if (current === 0) {
    throw createHttpError(
      400,
      'Current cannot be zero',
    );
  }

  return {
    operation: 'resistance',
    resistance: voltage / current,
    unit: 'ohm',
  };
};

export const calculatorService = {
  async calculate({ operation, values }) {
    switch (operation) {
      case 'ohm':
        return calculateOhm(values);

      case 'voltage_drop':
        return calculateVoltageDrop(values);

      case 'power':
        return calculatePower(values);

      case 'current':
        return calculateCurrent(values);

      case 'resistance':
        return calculateResistance(values);

      default:
        throw createHttpError(
          400,
          'Unsupported calculator operation',
        );
    }
  },
};