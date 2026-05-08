import { defaultProfileId, getProfileById, profileCenterArray } from "../data/locationProfiles";

export function getDefaultLocation(profileId = defaultProfileId) {
  const profile = getProfileById(profileId);
  return {
    label: `${profile.shortLabel} community center`,
    coordinates: profileCenterArray(profile)
  };
}

export const defaultCommunityLocation = getDefaultLocation(defaultProfileId);

export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function distanceMiles(from, to) {
  if (!Array.isArray(from) || !Array.isArray(to)) return Number.POSITIVE_INFINITY;
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(miles) {
  if (!Number.isFinite(miles)) return "";
  if (miles < 0.1) return "less than 0.1 mi";
  return `${miles.toFixed(miles < 10 ? 1 : 0)} mi`;
}

export function sortByDistance(items, userLocation = defaultCommunityLocation.coordinates) {
  return [...items].sort((a, b) => distanceMiles(userLocation, a.coordinates) - distanceMiles(userLocation, b.coordinates));
}

export function withDistance(items, userLocation = defaultCommunityLocation.coordinates) {
  return items.map((item) => ({
    ...item,
    distanceMiles: distanceMiles(userLocation, item.coordinates)
  }));
}
