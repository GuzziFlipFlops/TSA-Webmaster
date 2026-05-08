import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { Badge, InfoPanel, PageHeader, SectionHeader } from "../components/UI.jsx";
import { exchangeItems } from "../data/communityData";
import { getEvents } from "../services/eventProvider";
import { getResources } from "../services/resourceProvider";
import { resourceById, titleCase } from "../utils/resourceUtils";

export default function VolunteerPage() {
  const profile = useActiveProfile();
  const resources = getResources({}, profile.id);
  const events = getEvents({}, profile.id);
  const volunteerResources = resources.filter((resource) => resource.categoryId === "volunteer" || resource.tags?.includes("volunteer"));
  const volunteerEvents = events.filter((event) => event.volunteerOpportunity);

  return (
    <>
      <PageHeader
        eyebrow="Volunteer & community exchange"
        title="Service opportunities and free community aid without turning the site into a marketplace."
        description="This section supports donation drives, volunteer roles, school supply kits, and community aid. No payments, commerce, accounts, or user-to-user selling."
      >
        <LocationProfileSelector />
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="ShieldCheck" title="Free-only exchange rule" tone="teal">
          Community Exchange entries are for verified donation drives, service needs, and free community support. They do not support sales or payment handling.
        </InfoPanel>
        <SectionHeader title="Community exchange board" description="Sample board items connect to verified resources and events." />
        <div className="grid gap-4 md:grid-cols-3">
          {exchangeItems.map((item) => {
            const host = resourceById(resources, item.hostResourceId);
            return (
              <article key={item.id} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge color="purple">{item.type}</Badge>
                  <Badge color="green">Free only</Badge>
                </div>
                <h2 className="mt-3 text-xl font-black">{item.title}</h2>
                <p className="mt-2 leading-7 text-ink/70">{item.description}</p>
                <p className="mt-3 text-sm font-bold text-ink/62">Deadline: {item.deadline}</p>
                {host ? <Link to="/resources" className="mt-4 inline-block rounded-full bg-ink px-4 py-2 text-sm font-black text-white">{host.name}</Link> : null}
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Volunteer resources" description="Organizations where students, families, and adults can connect to service." />
          <div className="grid gap-5 lg:grid-cols-3">
            {volunteerResources.slice(0, 6).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="Volunteer events" description="Service events are ideal for TSA chapter service, school clubs, and community groups." />
        <div className="grid gap-5 lg:grid-cols-2">
          {volunteerEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </>
  );
}
