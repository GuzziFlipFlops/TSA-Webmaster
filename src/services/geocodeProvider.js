import { profileLocationLookup } from "../data/locationLookup";
import { defaultProfileId, getProfileById } from "../data/locationProfiles";
import { getDefaultLocation } from "./locationUtils";

function normalizeQuery(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/,\s*/g, " ")
    .replace(/\s+/g, " ");
}

export function findKnownLocation(input) {
  const normalized = normalizeQuery(input);
  if (!normalized) return null;

  for (const [profileId, lookup] of Object.entries(profileLocationLookup)) {
    const direct = lookup[normalized];
    if (direct) return { ...direct, profileId, profile: getProfileById(profileId) };

    const zip = normalized.match(/\b\d{5}\b/)?.[0];
    if (zip && lookup[zip]) return { ...lookup[zip], profileId, profile: getProfileById(profileId) };

    const cityMatch = Object.keys(lookup).find((key) => normalized.includes(key));
    if (cityMatch) return { ...lookup[cityMatch], profileId, profile: getProfileById(profileId) };
  }

  return null;
}

export async function geocodeLocation(input, profileId = defaultProfileId) {
  const normalized = normalizeQuery(input);
  if (!normalized) return getDefaultLocation(profileId);

  const lookup = profileLocationLookup[profileId] ?? profileLocationLookup[defaultProfileId];
  const direct = lookup[normalized];
  if (direct) return direct;

  const zip = normalized.match(/\b\d{5}\b/)?.[0];
  if (zip && lookup[zip]) return lookup[zip];

  const cityMatch = Object.keys(lookup).find((key) => normalized.includes(key));
  if (cityMatch) return lookup[cityMatch];

  // TODO: A future provider could connect Nominatim or Google Geocoding.
  // Keep this local-only so it never pretends to search the internet.
  return null;
}
