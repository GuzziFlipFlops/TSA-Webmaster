import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import GrantCard from "../components/GrantCard.jsx";
import Icon from "../components/Icon.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import { ButtonLink, PageHeader, SectionHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { getEvents, getResources } from "../services/resourceProvider";

const needs = [
  ["Tutoring programs", "Find academic help, library resources, parent workshops, and youth learning programs.", "BookOpenCheck", "/resources?category=student-family"],
  ["Food assistance", "Connect students and families to pantries, WIC, food bridge programs, and county planning.", "Utensils", "/resources?category=food"],
  ["Mental health support", "Find crisis resources, youth listening sessions, and family wellness support.", "HeartPulse", "/resources?category=mental-health"],
  ["Internet/device access", "Library Wi-Fi, public computers, digital help, and sample device sponsorship pathways.", "Wifi", "/resources?q=device"],
  ["School clubs", "TSA, robotics, service clubs, 4-H, art clubs, and student leadership opportunities.", "UsersRound", "/funding?focus=clubs"],
  ["Volunteer opportunities", "Service hours, food drives, supply kit builds, and youth-friendly service projects.", "Handshake", "/volunteer"],
  ["College/career resources", "Resume help, career training, CTE pathways, and enrichment funding.", "BriefcaseBusiness", "/resources?category=jobs"],
  ["Local youth events", "Student nights, mental health sessions, supply builds, and digital access help.", "CalendarDays", "/events?audience=students"],
  ["School/club funding", "Find funding for student projects, STEM teams, art programs, and service clubs.", "BadgeDollarSign", "/funding"],
  ["STEM/Art/CTE opportunities", "Hands-on programs, grant pathways, competitions, and community-impact builds.", "Sparkles", "/cte"]
];

export default function StudentsFamiliesPage() {
  const resources = getResources();
  const events = getEvents();
  const grants = getGrants();
  const studentResources = resources.filter((resource) => resource.tags.includes("student") || resource.audience.includes("students")).slice(0, 6);
  const studentEvents = events.filter((event) => event.audience.includes("students")).slice(0, 3);
  const studentGrants = grants.filter((grant) => grant.bestFor.includes("students") || grant.clubEligible).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Students & families"
        title="The strongest section for school-age residents and caregivers."
        description="This mini-hub keeps student needs inside the broader community system: tutoring, food, mental health, devices, clubs, volunteering, events, STEM/CTE, and school funding."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/resources?category=student-family" icon="BookOpenCheck">Find tutoring or academic help</ButtonLink>
          <ButtonLink to="/resources?category=mental-health" variant="outline" icon="HeartPulse">Find mental health and family support</ButtonLink>
          <ButtonLink to="/funding/directory?clubEligible=true" variant="gold" icon="BadgeDollarSign">Find school club funding</ButtonLink>
          <ButtonLink to="/volunteer" variant="outline" icon="Handshake">Find volunteer opportunities</ButtonLink>
          <ButtonLink to="/events?audience=students" variant="outline" icon="CalendarDays">Explore youth events</ButtonLink>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="I need..." description="Fast pathways for the most common student and family needs." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {needs.map(([title, description, icon, to]) => (
            <Link key={title} to={to} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-harbor">
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/62">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured student and family resources" description="Cards reuse the main directory data so this section stays connected to the whole hub." />
          <div className="grid gap-5 lg:grid-cols-3">
            {studentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeader title="School and club funding" description="Student projects should use school, club, teacher, association, or nonprofit support when required." />
          <div className="grid gap-5">
            {studentGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} compact />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="Youth events" description="Events keep the resource hub alive and useful after the first visit." />
          <div className="grid gap-5">
            {studentEvents.map((event) => (
              <EventCard key={event.id} event={event} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
