import { events as localEvents, resources as localResources } from "../data/communityData";
import { siteConfig } from "../data/siteConfig";
import { filterResources, getResourcePillar, isLocationBasedResource, matchesSearch } from "../utils/resourceUtils";
import { sortByDistance, withDistance } from "./locationUtils";

export function normalizeResource(resource) {
  const isSample =
    Boolean(resource.isSample) ||
    Boolean(resource.sampleData) ||
    resource.tags?.includes("sample") ||
    resource.source?.toLowerCase().includes("sample");

  return {
    ...resource,
    sourceUrl: resource.sourceUrl ?? resource.website ?? "",
    verifiedDate: resource.verifiedDate ?? siteConfig.lastUpdated,
    isSample,
    dataStatus: isSample ? "Sample/demo listing" : "Curated demo dataset",
    pillar: getResourcePillar(resource)
  };
}

export function normalizeEvent(event) {
  const host = localResources.find((resource) => resource.id === event.hostResourceId);
  const isSample = Boolean(event.isSample) || event.title?.toLowerCase().includes("sample");
  return {
    ...event,
    sourceUrl: event.sourceUrl ?? event.registrationUrl ?? host?.website ?? "",
    verifiedDate: event.verifiedDate ?? siteConfig.lastUpdated,
    isSample,
    dataStatus: isSample ? "Sample/demo listing" : "Curated demo dataset"
  };
}

export function getResources(filters = {}) {
  const normalized = localResources.map(normalizeResource);
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
    transportation: filters.transportation
  }).filter((resource) => {
    if (filters.pillar && resource.pillar !== filters.pillar) return false;
    return true;
  });

  if (filters.location) return withDistance(sortByDistance(filtered, filters.location), filters.location);
  return filtered;
}

export function getMappableResources(filters = {}) {
  const items = getResources(filters).filter(isLocationBasedResource);
  return filters.location ? withDistance(sortByDistance(items, filters.location), filters.location) : items;
}

export function getEvents(filters = {}) {
  return localEvents
    .map(normalizeEvent)
    .filter((event) => {
      if (filters.query && !matchesSearch({ ...event, services: [], tags: [event.categoryId], languages: [], accessibility: [] }, filters.query)) {
        const text = `${event.title} ${event.description} ${event.location} ${event.audience?.join(" ")}`.toLowerCase();
        if (!text.includes(String(filters.query).toLowerCase())) return false;
      }
      if (filters.category && event.categoryId !== filters.category) return false;
      if (filters.audience && !event.audience?.includes(filters.audience)) return false;
      if (filters.volunteerOnly && !event.volunteerOpportunity) return false;
      return true;
    });
}

// TODO: Replace local reads with 211, local open-data, library, school district, or Google Places APIs when API keys and moderation rules are ready.
