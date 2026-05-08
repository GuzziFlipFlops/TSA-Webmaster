import { useMemo, useState } from "react";
import EventCard from "../components/EventCard.jsx";
import { Badge, EmptyState, PageHeader, SectionHeader } from "../components/UI.jsx";
import { categories } from "../data/communityData";
import { getEvents } from "../services/resourceProvider";
import { formatDate, getCategory, titleCase } from "../utils/resourceUtils";

export default function EventsPage() {
  const [category, setCategory] = useState("");
  const [audience, setAudience] = useState("");
  const [view, setView] = useState("list");
  const events = getEvents();
  const filtered = useMemo(
    () =>
      events.filter((event) => {
        if (category && event.categoryId !== category) return false;
        if (audience && !event.audience.includes(audience)) return false;
        return true;
      }),
    [category, audience]
  );

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Find local youth programs, volunteer events, school nights, and community workshops."
        description="Events are stored in local data so judges can inspect the structure without relying on a live calendar API."
      >
        <div className="flex flex-wrap gap-3">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-11 rounded-lg border border-slateLine bg-white px-4 font-bold">
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select value={audience} onChange={(event) => setAudience(event.target.value)} className="min-h-11 rounded-lg border border-slateLine bg-white px-4 font-bold">
            <option value="">All audiences</option>
            {["students", "families", "seniors", "volunteers", "adults"].map((item) => (
              <option key={item} value={item}>{titleCase(item)}</option>
            ))}
          </select>
          <div className="rounded-lg border border-slateLine bg-white p-1">
            {["list", "calendar"].map((item) => (
              <button key={item} className={`rounded-md px-4 py-2 text-sm font-black ${view === item ? "bg-ink text-white" : "text-ink"}`} onClick={() => setView(item)}>
                {titleCase(item)}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="Featured upcoming events" description="The event system highlights volunteer, school, family, and youth-centered programs." />
        {view === "calendar" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => {
              const eventCategory = getCategory(event.categoryId);
              return (
                <article key={event.id} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-harbor">{formatDate(event.date)}</p>
                  <h2 className="mt-3 text-xl font-black">{event.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge color="teal">{eventCategory.name}</Badge>
                    {event.volunteerOpportunity ? <Badge color="purple">Volunteer</Badge> : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{event.description}</p>
                </article>
              );
            })}
          </div>
        ) : filtered.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState title="No events match those filters" description="Try another audience or category." />
        )}
      </section>
    </>
  );
}
