// Create an approximate geodesic circle polygon for map rendering.
// Returns GeoJSON Feature<Polygon> with coordinates in [lng, lat] order.

type LngLat = [number, number];

const EARTH_RADIUS_M = 6371008.8;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function circlePolygon(
  centerLngLat: LngLat,
  radiusMeters: number,
  steps: number = 64,
) {
  const [lng, lat] = centerLngLat;
  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const angularDistance = radiusMeters / EARTH_RADIUS_M;

  const coords: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (2 * Math.PI * i) / steps;
    const sinLat = Math.sin(latRad);
    const cosLat = Math.cos(latRad);

    const sinAd = Math.sin(angularDistance);
    const cosAd = Math.cos(angularDistance);

    const lat2 = Math.asin(sinLat * cosAd + cosLat * sinAd * Math.cos(bearing));
    const lng2 =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * sinAd * cosLat,
        cosAd - sinLat * Math.sin(lat2),
      );

    coords.push([toDeg(lng2), toDeg(lat2)]);
  }

  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [coords],
    },
  };
}

