import { useMemo, useState } from "react";
import EventCard from "../components/EventCard.jsx";
import GrantCard from "../components/GrantCard.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import { EmptyState, PageHeader, SectionHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { getEvents, getResources } from "../services/resourceProvider";
import { filterResources, isCareerOpportunity, isClubOpportunity, sortResources } from "../utils/resourceUtils";

const interests = ["stem", "robotics", "art", "career", "college", "service", "cte", "leadership"];

export default function ClubsOpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [interest, setInterest] = useState("");
  const resources = getResources();
  const events = getEvents();
  const grants = getGrants();
  const opportunities = useMemo(() => resources.filter((resource) => isClubOpportunity(resource) || isCareerOpportunity(resource)), []);
  const filtered = useMemo(() => {
    const base = filterResources(opportunities, { query: [query, interest].filter(Boolean).join(" ") });
    return sortResources(base, "recommended", query);
  }, [interest, opportunities, query]);
  const relatedEvents = events.filter((event) => event.audience.includes("students")).slice(0, 3);
  const relatedGrants = grants.filter((grant) => grant.clubEligible || grant.bestFor.includes("school-clubs")).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Clubs & opportunities"
        title="Find school clubs, community STEM teams, youth leadership, art groups, and college/career pathways."
        description="This page collects extracurricular and enrichment opportunities in a searchable format. Physical meeting places can appear on the map when location matters."
      >
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-12 rounded-lg border border-slateLine bg-white px-4 font-semibold shadow-sm"
            placeholder="Search robotics, art club, resume, leadership..."
            aria-label="Search clubs and opportunities"
          />
          <select value={interest} onChange={(event) => setInterest(event.target.value)} className="rounded-lg border border-slateLine bg-white px-4 font-bold">
            <option value="">All interests</option>
            {interests.map((item) => (
              <option key={item} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title={`${filtered.length} club and enrichment listings`} description="Cards include meeting format, skill level, student audience, and sponsor context when available." />
        {filtered.length ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        ) : (
          <EmptyState title="No clubs match that search" description="Try STEM, robotics, art, career, service, or leadership." />
        )}
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader title="Related student events" />
            <div className="grid gap-5">
              {relatedEvents.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Funding for clubs and teams" />
            <div className="grid gap-5">
              {relatedGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} compact />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
