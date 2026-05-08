import { defaultCommunityLocation, localLocationLookup } from "./locationUtils";

export async function geocodeLocation(input) {
  const query = String(input ?? "").trim().toLowerCase();
  if (!query) return defaultCommunityLocation;

  const normalized = query.replace(/,\s*/g, " ").replace(/\s+/g, " ");
  const direct = localLocationLookup[normalized];
  if (direct) return direct;

  const zip = normalized.match(/\b\d{5}\b/)?.[0];
  if (zip && localLocationLookup[zip]) return localLocationLookup[zip];

  const cityMatch = Object.keys(localLocationLookup).find((key) => normalized.includes(key));
  if (cityMatch) return localLocationLookup[cityMatch];

  // TODO: Connect Nominatim, Google Geocoding, or a local open-data geocoder here.
  return null;
}
