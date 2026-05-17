import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GrantCard from "../components/GrantCard.jsx";
import GrantFilters from "../components/GrantFilters.jsx";
import useLocalStorage from "../components/useLocalStorage.js";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { ButtonLink, EmptyState, PageHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { searchGrantsGov } from "../services/grantsGovProvider";
import { filterGrants, sortGrants } from "../utils/grantUtils";

const defaultFilters = {
  query: "",
  category: "",
  bestFor: "",
  difficulty: "",
  scope: "",
  rolling: false,
  closingSoon: false,
  clubEligible: false,
  teacherEligible: false,
  nonprofitEligible: false,
  source: "curated",
  grantsGovCategory: "ED|ST",
  grantsGovEligibility: "05|06|12|13|20|25",
  grantsGovStatus: "posted|forecasted",
  sort: "best"
};

export default function FundingDirectoryPage() {
  const [searchParams] = useSearchParams();
  const profile = useActiveProfile();
  const [savedIds, setSavedIds] = useLocalStorage("cc-saved-grants", []);
  const curatedGrants = getGrants({ includeNational: true }, profile.id);
  const [liveGrants, setLiveGrants] = useState([]);
  const [liveStatus, setLiveStatus] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    bestFor: searchParams.get("bestFor") ?? "",
    rolling: searchParams.get("rolling") === "true",
    closingSoon: searchParams.get("closingSoon") === "true",
    clubEligible: searchParams.get("clubEligible") === "true",
    teacherEligible: searchParams.get("teacherEligible") === "true",
    nonprofitEligible: searchParams.get("nonprofitEligible") === "true"
  });

  const useLiveGrants = filters.source === "all" || filters.source === "grants-gov";
  const grantsGovKeyword = filters.query?.trim() || "STEM education school youth";

  useEffect(() => {
    if (!useLiveGrants) {
      setLiveGrants([]);
      setLiveStatus("");
      return;
    }

    let cancelled = false;
    setLiveLoading(true);
    setLiveStatus("Searching live Grants.gov opportunities...");
    searchGrantsGov({
      keyword: grantsGovKeyword,
      fundingCategories: filters.grantsGovCategory,
      eligibilities: filters.grantsGovEligibility,
      oppStatuses: filters.grantsGovStatus,
      rows: 25
    })
      .then((results) => {
        if (cancelled) return;
        setLiveGrants(results);
        setLiveStatus(`${results.length} live Grants.gov opportunities loaded.`);
      })
      .catch((error) => {
        if (cancelled) return;
        setLiveGrants([]);
        setLiveStatus(`Live Grants.gov search is unavailable right now. ${error.message}`);
      })
      .finally(() => {
        if (!cancelled) setLiveLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters.grantsGovCategory, filters.grantsGovEligibility, filters.grantsGovStatus, grantsGovKeyword, useLiveGrants]);

  const grants = useMemo(() => {
    if (filters.source === "grants-gov") return liveGrants;
    if (filters.source === "all") return [...curatedGrants, ...liveGrants];
    return curatedGrants;
  }, [curatedGrants, filters.source, liveGrants]);

  const filtered = useMemo(() => sortGrants(filterGrants(grants, { ...filters, savedIds }), filters.sort, filters.query), [filters, grants, savedIds]);
  const toggleSave = (id) =>
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));

  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Funding directory"
        title="Search school, club, teacher, youth, nonprofit, and community project funding."
        description="Every card shows eligibility, sponsor requirements, amount, deadline type, official source, and verified date. Entries needing verification are visibly labeled."
      >
        <div className="mb-3">
          <LocationProfileSelector />
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="sr-only" htmlFor="grant-search">Search funding</label>
          <input
            id="grant-search"
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            className="min-h-12 rounded-lg border border-slateLine bg-white px-4 font-semibold shadow-sm"
            placeholder="Search STEM team, art program, teacher grant, service project..."
          />
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            className="min-h-12 rounded-lg border border-slateLine bg-white px-4 font-bold shadow-sm"
            aria-label="Sort funding opportunities"
          >
            <option value="best">Best match</option>
            <option value="closing">Closing soon</option>
            <option value="amount">Highest amount</option>
            <option value="easy">Easiest application</option>
            <option value="verified">Newest verified</option>
            <option value="az">A-Z</option>
          </select>
        </div>
        {useLiveGrants ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-ink/72" role="status">
            {liveStatus} {liveLoading ? "This may take a moment." : ""}
          </p>
        ) : null}
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <GrantFilters filters={filters} setFilters={setFilters} savedCount={savedIds.length} />
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-black">{filtered.length} funding opportunities found</p>
            <p className="text-sm font-semibold text-ink/60">{savedIds.length} saved locally</p>
          </div>
          {filtered.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filtered.map((grant) => (
                <GrantCard key={grant.id} grant={grant} saved={savedIds.includes(grant.id)} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="BadgeDollarSign"
              title="No funding matches those filters"
              description="Try broadening the category, allowing school or nonprofit sponsors, or use the funding finder for recommendations."
              action={<ButtonLink to="/funding/finder" variant="gold" icon="Sparkles">Try funding finder</ButtonLink>}
            />
          )}
        </div>
      </section>
    </>
  );
}
