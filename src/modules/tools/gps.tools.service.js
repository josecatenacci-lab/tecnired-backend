const EARTH_RADIUS_KM = 6371;
const EARTH_RADIUS_M = EARTH_RADIUS_KM * 1000;

const createHttpError = (statusCode, message) => ({
  statusCode,
  message,
});

const toRadians = (degrees) =>
  (degrees * Math.PI) / 180;

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

const validateLatitude = (latitude, field) => {
  if (latitude < -90 || latitude > 90) {
    throw createHttpError(
      400,
      `${field} must be between -90 and 90`,
    );
  }
};

const validateLongitude = (longitude, field) => {
  if (longitude < -180 || longitude > 180) {
    throw createHttpError(
      400,
      `${field} must be between -180 and 180`,
    );
  }
};

const normalizeCoordinatePair = ({
  lat,
  lon,
  latField,
  lonField,
}) => {
  const latitude = toNumber(lat, latField);
  const longitude = toNumber(lon, lonField);

  validateLatitude(latitude, latField);
  validateLongitude(longitude, lonField);

  return {
    latitude,
    longitude,
  };
};

const haversineDistance = (
  lat1,
  lon1,
  lat2,
  lon2,
) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return EARTH_RADIUS_M * c;
};

const calculateBearing = (
  lat1,
  lon1,
  lat2,
  lon2,
) => {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const λ1 = toRadians(lon1);
  const λ2 = toRadians(lon2);

  const y =
    Math.sin(λ2 - λ1) *
    Math.cos(φ2);

  const x =
    Math.cos(φ1) *
      Math.sin(φ2) -
    Math.sin(φ1) *
      Math.cos(φ2) *
      Math.cos(λ2 - λ1);

  const θ =
    Math.atan2(y, x);

  return (
    (θ * 180) / Math.PI + 360
  ) % 360;
};

export const gpsToolsService = {
  async calculateDistance({
    lat1,
    lon1,
    lat2,
    lon2,
  }) {
    const origin =
      normalizeCoordinatePair({
        lat: lat1,
        lon: lon1,
        latField: 'lat1',
        lonField: 'lon1',
      });

    const destination =
      normalizeCoordinatePair({
        lat: lat2,
        lon: lon2,
        latField: 'lat2',
        lonField: 'lon2',
      });

    const distanceMeters =
      haversineDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude,
      );

    const bearing =
      calculateBearing(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude,
      );

    return {
      origin,
      destination,
      distanceMeters:
        Number(distanceMeters.toFixed(2)),
      distanceKilometers:
        Number(
          (distanceMeters / 1000).toFixed(4),
        ),
      bearingDegrees:
        Number(bearing.toFixed(2)),
    };
  },
};