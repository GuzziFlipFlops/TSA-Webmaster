import { grants as localGrants } from "../data/communityData";
import { siteConfig } from "../data/siteConfig";
import { filterGrants, sortGrants } from "../utils/grantUtils";

export function normalizeGrant(grant) {
  const isSample = Boolean(grant.isSample) || Boolean(grant.sampleData);
  return {
    ...grant,
    isSample,
    sampleData: isSample,
    sourceUrl: grant.sourceUrl ?? grant.officialUrl ?? "",
    officialUrl: grant.officialUrl ?? grant.sourceUrl ?? "",
    verifiedDate: grant.verifiedDate ?? siteConfig.lastUpdated,
    dataStatus: isSample ? "Sample/demo listing" : "Curated demo dataset"
  };
}

export function getGrants(filters = {}) {
  const normalized = localGrants.map(normalizeGrant);
  return sortGrants(filterGrants(normalized, filters), filters.sort ?? "best", filters.query ?? "");
}

// TODO: Connect Grants.gov, state arts/education grant feeds, district sponsor lists, or local foundation APIs later.
// Keep local data as the offline-safe default for TSA judging and Vercel previews.
