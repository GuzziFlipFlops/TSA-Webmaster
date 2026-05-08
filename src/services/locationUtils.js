import { siteConfig } from "../data/siteConfig";

export const defaultCommunityLocation = {
  label: `${siteConfig.communityName} center`,
  coordinates: siteConfig.centerCoordinates
};

export const localLocationLookup = {
  // Seeded demo lookup. Replace these entries with the actual school community before final submission.
  "fairfax": { label: "Fairfax, VA", coordinates: [38.8462, -77.3064] },
  "22030": { label: "Fairfax, VA 22030", coordinates: [38.8462, -77.3064] },
  "22031": { label: "Merrifield, VA 22031", coordinates: [38.8731, -77.2367] },
  "22032": { label: "Fairfax, VA 22032", coordinates: [38.817, -77.296] },
  "annandale": { label: "Annandale, VA", coordinates: [38.8304, -77.1964] },
  "chantilly": { label: "Chantilly, VA", coordinates: [38.8943, -77.4311] },
  "reston": { label: "Reston, VA", coordinates: [38.9586, -77.357] },
  "vienna": { label: "Vienna, VA", coordinates: [38.9012, -77.2653] }
};

export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function distanceMiles(from, to) {
  if (!from?.length || !to?.length) return Number.POSITIVE_INFINITY;
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
