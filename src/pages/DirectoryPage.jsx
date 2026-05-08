import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ResourceCard from "../components/ResourceCard.jsx";
import ResourceFilters from "../components/ResourceFilters.jsx";
import useLocalStorage from "../components/useLocalStorage.js";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { PageHeader, EmptyState, ButtonLink } from "../components/UI.jsx";
import { getResources } from "../services/resourceProvider";
import { filterResources, sortResources } from "../utils/resourceUtils";

export default function DirectoryPage() {
  const [searchParams] = useSearchParams();
  const profile = useActiveProfile();
  const [savedIds, setSavedIds] = useLocalStorage("cc-saved-resources", []);
  const resources = getResources({}, profile.id);
  const [filters, setFilters] = useState({
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    audience: "",
    cost: "",
    urgency: "",
    language: "",
    format: "",
    sort: "recommended"
  });

  const filtered = useMemo(() => {
    const result = filterResources(resources, { ...filters, savedIds });
    return sortResources(result, filters.sort, filters.query);
  }, [filters, savedIds]);

  const toggleSave = (id) =>
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));

  return (
    <>
      <PageHeader
        eyebrow="Resource directory"
        title="Search local help by need, cost, urgency, audience, and access."
        description="Use filters to narrow food assistance, tutoring, mental health support, transit, senior services, student programs, and volunteer resources."
      >
        <div className="mb-3">
          <LocationProfileSelector />
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="sr-only" htmlFor="directory-search">Search resources</label>
          <input
            id="directory-search"
            value={filters.query}
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            className="min-h-12 rounded-lg border border-slateLine bg-white px-4 font-semibold shadow-sm"
            placeholder="Search by need, organization, tag, neighborhood..."
          />
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            className="min-h-12 rounded-lg border border-slateLine bg-white px-4 font-bold shadow-sm"
            aria-label="Sort resources"
          >
            <option value="recommended">Recommended</option>
            <option value="distance">Closest to community center</option>
            <option value="open">Open now</option>
            <option value="free">Free or low cost</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <ResourceFilters filters={filters} setFilters={setFilters} savedCount={savedIds.length} />
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-black">{filtered.length} resources found</p>
            <p className="text-sm font-semibold text-ink/60">{savedIds.length} saved locally</p>
          </div>
          {filtered.length ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} saved={savedIds.includes(resource.id)} onToggleSave={toggleSave} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No resources match those filters"
              description="Try clearing one or two filters, use the guided finder, or suggest a missing resource for review."
              action={<ButtonLink to="/finder" icon="Sparkles">Try guided finder</ButtonLink>}
            />
          )}
        </div>
      </section>
    </>
  );
}
