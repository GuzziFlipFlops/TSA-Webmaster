import { defaultProfileId, getProfileById } from "../data/locationProfiles";
import { nationalStemResources } from "../data/nationalResources";
import { filterResources, getResourcePillar, isLocationBasedResource } from "../utils/resourceUtils";
import { sortByDistance, withDistance } from "./locationUtils";

const PROFILE_STORAGE_KEY = "cc-active-location-profile";

export function getActiveProfile() {
  if (typeof window === "undefined") return getProfileById(defaultProfileId);
  return getProfileById(window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? defaultProfileId);
}

export function setActiveProfile(profileId) {
  const profile = getProfileById(profileId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, profile.id);
    window.dispatchEvent(new CustomEvent("cc-profile-change", { detail: profile }));
  }
  return profile;
}

export function normalizeResource(resource, profile = getActiveProfile()) {
  const isSample =
    Boolean(resource.isSample) ||
    Boolean(resource.sampleData) ||
    resource.dataStatus === "sample" ||
    resource.tags?.includes("sample");
  const dataStatus = resource.dataStatus ?? (isSample ? "sample" : "needs-review");

  return {
    ...resource,
    sourceUrl: resource.sourceUrl ?? resource.website ?? "",
    verifiedDate: resource.verifiedDate ?? profile.lastUpdated,
    isSample,
    sampleData: isSample,
    dataStatus,
    serviceArea: resource.serviceArea ?? profile.serviceAreaLabel,
    state: resource.state ?? profile.stateCode ?? "",
    stateName: resource.stateName ?? profile.state ?? "",
    coordinatesApproximate: resource.coordinatesApproximate ?? true,
    profileId: resource.profileId ?? profile.id,
    pillar: getResourcePillar(resource)
  };
}

export function getResources(filters = {}, profileId = getActiveProfile().id) {
  const profile = getProfileById(profileId);
  const profileResources = profile.resources.map((resource) => normalizeResource(resource, profile));
  const nationalResources = filters.includeNational
    ? nationalStemResources.map((resource) => normalizeResource({ ...resource, profileId: "national-atlas" }, profile))
    : [];
  const normalized = [...profileResources, ...nationalResources];
  const filtered = filterResources(normalized, {
    query: filters.query ?? "",
    category: filters.category ?? "",
    audience: filters.audience ?? "",
    cost: filters.cost ?? "",
    urgency: filters.urgency ?? "",
    language: filters.language ?? "",
    format: filters.format ?? "",
    openNow: filters.openNow,
    accessibility: filters.accessibility,
    transportation: filters.transportation,
    savedOnly: filters.savedOnly,
    savedIds: filters.savedIds
  }).filter((resource) => {
    if (filters.pillar && resource.pillar !== filters.pillar) return false;
    if (filters.state && resource.state !== filters.state) return false;
    return true;
  });

  if (filters.location) return withDistance(sortByDistance(filtered, filters.location), filters.location);
  return filtered;
}

export function getMappableResources(filters = {}, profileId = getActiveProfile().id) {
  const items = getResources(filters, profileId).filter(isLocationBasedResource);
  return filters.location ? withDistance(sortByDistance(items, filters.location), filters.location) : items;
}

// TODO: Future API providers could merge 211/community-service records, Google Places,
// library open data, or district feeds here. Keep local profile data as the default.
