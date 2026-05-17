import { getProfileById } from "../data/locationProfiles";
import { nationalFundingLeads } from "../data/nationalFunding";
import { filterGrants, sortGrants } from "../utils/grantUtils";
import { getActiveProfile } from "./resourceProvider";

export function normalizeGrant(grant, profile = getActiveProfile()) {
  const isSample = Boolean(grant.isSample) || Boolean(grant.sampleData) || grant.dataStatus === "sample";
  const dataStatus = grant.dataStatus ?? (isSample ? "sample" : "needs-review");
  return {
    ...grant,
    isSample,
    sampleData: isSample,
    sourceUrl: grant.sourceUrl ?? grant.officialUrl ?? "",
    officialUrl: grant.officialUrl ?? grant.sourceUrl ?? "",
    verifiedDate: grant.verifiedDate ?? profile.lastUpdated,
    dataStatus,
    serviceArea: grant.serviceArea ?? profile.serviceAreaLabel,
    state: grant.state ?? "",
    stateName: grant.stateName ?? "",
    coordinatesApproximate: grant.coordinatesApproximate ?? false,
    profileId: grant.profileId ?? profile.id
  };
}

export function getGrants(filters = {}, profileId = getActiveProfile().id) {
  const profile = getProfileById(profileId);
  const profileGrants = profile.grants.map((grant) => normalizeGrant(grant, profile));
  const nationalGrants = filters.includeNational
    ? nationalFundingLeads.map((grant) => normalizeGrant({ ...grant, profileId: "national-funding" }, profile))
    : [];
  const normalized = [...profileGrants, ...nationalGrants];
  return sortGrants(filterGrants(normalized, filters), filters.sort ?? "best", filters.query ?? "");
}

// TODO: Future grant integrations could be added here, not inside page components.
// Grants.gov is useful for federal programs, while school-club sponsors often need
// local foundation, district, association, or sponsor-sheet data instead.
