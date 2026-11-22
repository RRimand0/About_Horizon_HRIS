// UI-only estimate. The PHP API always validates the visitor's full address separately.
export const SERVICE_CENTER = Object.freeze({ lat: 8.477, lng: 124.642 });
export const ONSITE_RADIUS_KM = 200;

export function straightLineDistanceKm(from, to) {
  if (![from?.lat, from?.lng, to?.lat, to?.lng].every(Number.isFinite)) return NaN;
  const radians = (value) => (value * Math.PI) / 180;
  const deltaLat = radians(to.lat - from.lat);
  const deltaLng = radians(to.lng - from.lng);
  const value = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(deltaLng / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.min(1, Math.sqrt(value)));
}
