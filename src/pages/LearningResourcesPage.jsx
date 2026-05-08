import { useMemo, useState } from "react";
import ResourceCard from "../components/ResourceCard.jsx";
import ResourceMap from "../components/ResourceMap.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { Badge, EmptyState, PageHeader, SectionHeader } from "../components/UI.jsx";
import { getResources } from "../services/resourceProvider";
import { profileCenterArray } from "../data/locationProfiles";
import { filterResources, isLearningResource, isLocationBasedResource, isOpenNow, sortResources } from "../utils/resourceUtils";

const learningFilters = [
  ["has3DPrinters", "3D printers"],
  ["hasComputers", "Computers"],
  ["hasMakerspace", "Makerspace"],
  ["hasTutoring", "Tutoring"],
  ["hasArtStations", "Art/drawing"],
  ["hasStudyRooms", "Study rooms"],
  ["free", "Free"],
  ["publicAccess", "Public access"],
  ["reservationRequired", "Reservation required"],
  ["openNow", "Open now"],
  ["studentFriendly", "Student friendly"]
];

export default function LearningResourcesPage() {
  const profile = useActiveProfile();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const learning = useMemo(() => getResources({}, profile.id).filter(isLearningResource), [profile.id]);
  const filtered = useMemo(() => {
    const base = filterResources(learning, { query });
    return sortResources(
      base.filter((resource) => {
        if (active.has3DPrinters && !resource.has3DPrinters) return false;
        if (active.hasComputers && !resource.hasComputers) return false;
        if (active.hasMakerspace && !resource.hasMakerspace) return false;
        if (active.hasTutoring && !resource.hasTutoring) return false;
        if (active.hasArtStations && !resource.hasArtStations) return false;
        if (active.hasStudyRooms && !resource.hasStudyRooms) return false;
        if (active.free && resource.cost !== "free") return false;
        if (active.publicAccess && !resource.publicAccess) return false;
        if (active.reservationRequired && !resource.reservationRequired) return false;
        if (active.openNow && isOpenNow(resource) !== true) return false;
        if (active.studentFriendly && !resource.tags?.includes("student-friendly")) return false;
        return true;
      }),
      "recommended",
      query
    );
  }, [active, learning, query]);
  const mappable = filtered.filter(isLocationBasedResource);
  const selected = mappable.find((resource) => resource.id === selectedId) ?? mappable[0];

  const toggle = (key) => setActive((current) => ({ ...current, [key]: !current[key] }));

  return (
    <>
      <PageHeader
        eyebrow="Learning resources"
        title="Find libraries, makerspaces, computers, 3D printers, study rooms, tutoring, and creative spaces."
        description="This page focuses on the places and tools students can actually use to learn, build, study, design, and prepare."
      >
        <div className="mb-3">
          <LocationProfileSelector />
        </div>
        <label className="sr-only" htmlFor="learning-search">Search learning resources</label>
        <input
          id="learning-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-12 w-full rounded-lg border border-slateLine bg-white px-4 font-semibold shadow-sm"
          placeholder="Search 3D printing, public computers, art stations, tutoring..."
        />
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {learningFilters.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                active[key] ? "bg-blue-700 text-white" : "border border-slateLine bg-white text-ink hover:bg-civic"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
          <div>
            <SectionHeader title={`${filtered.length} learning resources`} description="Cards show student-friendly access, equipment, cost, reservation needs, and official source context." />
            {filtered.length ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filtered.map((resource) => (
                  <article key={resource.id} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {resource.has3DPrinters ? <Badge color="blue">3D Printer</Badge> : null}
                      {resource.hasComputers ? <Badge color="blue">Computers</Badge> : null}
                      {resource.hasMakerspace ? <Badge color="purple">Makerspace</Badge> : null}
                      {resource.publicAccess ? <Badge color="green">Public Access</Badge> : null}
                      {resource.tags?.includes("student-friendly") ? <Badge color="amber">Student Friendly</Badge> : null}
                    </div>
                    <ResourceCard resource={resource} compact />
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title="No learning resources match those filters" description="Try fewer equipment filters or search a broader term like library, maker, computer, or tutoring." />
            )}
          </div>
          <aside className="sticky top-24 h-[640px] overflow-hidden rounded-lg border border-slateLine bg-white p-4 shadow-soft">
            <div className="mb-3">
              <p className="font-black">Learning map</p>
              <p className="mt-1 text-sm text-ink/60">Only physical learning spaces are mapped.</p>
            </div>
            <div className="h-[560px] overflow-hidden rounded-lg">
              <ResourceMap resources={mappable} selectedId={selected?.id} onSelect={setSelectedId} center={profileCenterArray(profile)} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
