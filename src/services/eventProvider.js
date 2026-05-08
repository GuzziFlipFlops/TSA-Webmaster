import { getProfileById } from "../data/locationProfiles";
import { matchesSearch } from "../utils/resourceUtils";
import { getActiveProfile } from "./resourceProvider";

export function normalizeEvent(event, profile = getActiveProfile()) {
  const host = profile.resources.find((resource) => resource.id === event.hostResourceId);
  const isSample = Boolean(event.isSample) || Boolean(event.sampleData) || event.dataStatus === "sample";
  const dataStatus = event.dataStatus ?? (isSample ? "sample" : "needs-review");
  return {
    ...event,
    hostName: host?.name ?? "",
    sourceUrl: event.sourceUrl ?? event.registrationUrl ?? host?.website ?? "",
    verifiedDate: event.verifiedDate ?? profile.lastUpdated,
    isSample,
    sampleData: isSample,
    dataStatus,
    serviceArea: event.serviceArea ?? profile.serviceAreaLabel,
    coordinatesApproximate: event.coordinatesApproximate ?? true,
    profileId: profile.id
  };
}

export function getEvents(filters = {}, profileId = getActiveProfile().id) {
  const profile = getProfileById(profileId);
  return profile.events
    .map((event) => normalizeEvent(event, profile))
    .filter((event) => {
      if (filters.query && !matchesSearch({ ...event, services: [], tags: [event.categoryId], languages: [], accessibility: [] }, filters.query)) {
        const text = `${event.title} ${event.description} ${event.location} ${event.hostName} ${event.audience?.join(" ")}`.toLowerCase();
        if (!text.includes(String(filters.query).toLowerCase())) return false;
      }
      if (filters.category && event.categoryId !== filters.category) return false;
      if (filters.audience && !event.audience?.includes(filters.audience)) return false;
      if (filters.volunteerOnly && !event.volunteerOpportunity) return false;
      return true;
    });
}

// TODO: Future calendar feeds or local open-data event feeds should be normalized here.
