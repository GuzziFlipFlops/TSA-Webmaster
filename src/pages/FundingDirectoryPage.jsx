import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GrantCard from "../components/GrantCard.jsx";
import GrantFilters from "../components/GrantFilters.jsx";
import useLocalStorage from "../components/useLocalStorage.js";
import { ButtonLink, EmptyState, PageHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { filterGrants, sortGrants } from "../utils/grantUtils";

export default function FundingDirectoryPage() {
  const [searchParams] = useSearchParams();
  const [savedIds, setSavedIds] = useLocalStorage("cc-saved-grants", []);
  const grants = getGrants();
  const [filters, setFilters] = useState({
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    bestFor: searchParams.get("bestFor") ?? "",
    difficulty: "",
    scope: "",
    rolling: searchParams.get("rolling") === "true",
    closingSoon: searchParams.get("closingSoon") === "true",
    clubEligible: searchParams.get("clubEligible") === "true",
    teacherEligible: searchParams.get("teacherEligible") === "true",
    nonprofitEligible: searchParams.get("nonprofitEligible") === "true",
    sort: "best"
  });

  const filtered = useMemo(() => sortGrants(filterGrants(grants, { ...filters, savedIds }), filters.sort, filters.query), [filters, savedIds]);
  const toggleSave = (id) =>
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));

  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Funding directory"
        title="Search school, club, teacher, youth, nonprofit, and community project funding."
        description="Every card shows eligibility, sponsor requirements, amount, deadline type, official source, and verified date. Sample/demo opportunities are visibly labeled."
      >
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
