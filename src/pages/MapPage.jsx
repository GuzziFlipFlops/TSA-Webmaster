import { useEffect, useMemo, useState } from "react";
import DataStatus from "../components/DataStatus.jsx";
import LocationSearch from "../components/LocationSearch.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import ResourceMap from "../components/ResourceMap.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { Badge, EmptyState, PageHeader } from "../components/UI.jsx";
import { getMappableResources } from "../services/resourceProvider";
import { formatDistance, getDefaultLocation } from "../services/locationUtils";
import { hubPillars } from "../data/communityData";
import { filterResources, getResourcePillar } from "../utils/resourceUtils";

const mappedPillars = ["learning-resource", "support-service", "club-opportunity", "volunteer-opportunity", "career-opportunity"];

export default function MapPage() {
  const profile = useActiveProfile();
  const [pillar, setPillar] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(() => getDefaultLocation(profile.id));

  useEffect(() => {
    setLocation(getDefaultLocation(profile.id));
  }, [profile.id]);

  const filtered = useMemo(() => {
    const base = getMappableResources({ location: location.coordinates }, profile.id);
    return filterResources(base, { query }).filter((resource) => {
      if (!pillar) return mappedPillars.includes(getResourcePillar(resource));
      return getResourcePillar(resource) === pillar;
    });
  }, [location, pillar, profile.id, query]);

  const selected = filtered.find((resource) => resource.id === selectedId) ?? filtered[0];

  return (
    <>
      <PageHeader
        eyebrow="Location-based map"
        title="Map only the resources where place matters."
        description="Libraries, makerspaces, learning centers, support services, volunteer sites, youth program locations, and local clubs belong on the map. Grants and online-only opportunities do not."
      >
        <div className="grid gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <LocationProfileSelector />
            <DataStatus className="flex-1" />
          </div>
          <LocationSearch onLocationChange={setLocation} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-12 w-full rounded-lg border border-slateLine bg-white px-4 font-semibold shadow-sm"
            placeholder="Search mapped locations: library, makerspace, food, mental health, volunteer..."
            aria-label="Search mapped locations"
          />
        </div>
      </PageHeader>
      <section className="cc-container py-10">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-black">Mapped resources from curated local records</p>
            <p className="mt-1 text-sm text-ink/60">Sorted from {location.label}. Grants and online-only listings are excluded.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Map pillar filters">
            <button className={`rounded-md px-3 py-2 text-sm font-black ${pillar === "" ? "bg-ink text-white" : "border border-slateLine bg-white"}`} onClick={() => setPillar("")}>
              All
            </button>
            {hubPillars.filter((item) => mappedPillars.includes(item.id)).map((item) => (
              <button
                key={item.id}
                className={`rounded-md px-3 py-2 text-sm font-black ${pillar === item.id ? "bg-ink text-white" : "border border-slateLine bg-white"}`}
                onClick={() => setPillar(item.id)}
              >
                {item.name.replace("Student & Family ", "").replace("Volunteering & ", "")}
              </button>
            ))}
          </div>
        </div>
        {filtered.length ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="h-[62vh] min-h-[480px] overflow-hidden rounded-lg border border-slateLine bg-white shadow-soft">
              <ResourceMap resources={filtered} selectedId={selected?.id} onSelect={setSelectedId} center={location.coordinates} zoom={12} />
            </div>
            <aside className="max-h-[62vh] min-h-[480px] overflow-auto rounded-lg border border-slateLine bg-white p-4 shadow-sm">
              <div className="sticky top-0 z-10 bg-white pb-3">
                <p className="font-black">Nearby resources</p>
                <p className="mt-1 text-sm text-ink/60">{filtered.length} physical resources</p>
              </div>
              <div className="grid gap-3">
                {filtered.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => setSelectedId(resource.id)}
                    className={`rounded-lg border p-3 text-left transition focus:outline focus:outline-2 ${
                      selected?.id === resource.id ? "border-harbor bg-teal-50" : "border-slateLine bg-white hover:bg-civic"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2">
                      <Badge color={resource.cost === "free" ? "green" : "amber"}>{resource.cost}</Badge>
                      <Badge color="teal">{resource.neighborhood}</Badge>
                      {Number.isFinite(resource.distanceMiles) ? <Badge color="slate">{formatDistance(resource.distanceMiles)}</Badge> : null}
                      {resource.isSample ? <Badge color="slate">Needs verification</Badge> : null}
                    </div>
                    <p className="mt-2 font-black">{resource.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink/62">{resource.description}</p>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <EmptyState title="No mapped locations match that search" description="Try a physical resource like library, makerspace, food, shelter, volunteer, or tutoring." />
        )}
        {selected ? (
          <div className="mt-6">
            <ResourceCard resource={selected} compact />
          </div>
        ) : null}
      </section>
    </>
  );
}
