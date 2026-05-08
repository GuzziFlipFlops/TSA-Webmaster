import { Link, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard.jsx";
import GrantCard from "../components/GrantCard.jsx";
import Icon from "../components/Icon.jsx";
import DataStatus from "../components/DataStatus.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { ButtonLink, SectionHeader } from "../components/UI.jsx";
import { communityProfile } from "../data/communityData";
import { getEvents } from "../services/eventProvider";
import { getResources } from "../services/resourceProvider";
import { getGrants } from "../services/grantProvider";
import { getCategory, getResourcePillar, isClubOpportunity, isLearningResource, isLocationBasedResource, isSupportService } from "../utils/resourceUtils";

const quickActions = [
  ["Find a makerspace", "/learning?filter=makerspace", "Wrench"],
  ["Find tutoring", "/learning?filter=tutoring", "BookOpenCheck"],
  ["Find food help", "/support?need=food", "Utensils"],
  ["Find mental health support", "/support?need=mental-health", "HeartPulse"],
  ["Find a club/team", "/clubs", "UsersRound"],
  ["Find volunteering", "/volunteer", "Handshake"],
  ["Find student funding", "/funding", "BadgeDollarSign"],
  ["Find youth events", "/events?audience=students", "CalendarDays"]
];

export default function HomePage() {
  const navigate = useNavigate();
  const profile = useActiveProfile();
  const resources = getResources({}, profile.id);
  const events = getEvents({}, profile.id);
  const grants = getGrants({}, profile.id);
  const featuredLearning = resources.filter(isLearningResource).slice(0, 6);
  const supportPreview = resources.filter(isSupportService).filter((resource) => ["food", "housing", "mental-health", "student-family"].includes(resource.categoryId)).slice(0, 4);
  const clubPreview = resources.filter(isClubOpportunity).slice(0, 3);
  const featuredGrants = grants.filter((grant) => grant.featured).slice(0, 3);
  const mapPreview = resources.filter(isLocationBasedResource).filter((resource) => ["learning-resource", "support-service", "club-opportunity", "volunteer-opportunity"].includes(getResourcePillar(resource))).slice(0, 4);
  const youthEvents = events.filter((event) => event.audience.includes("students") || event.volunteerOpportunity).slice(0, 3);

  function handleSearch(event) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    navigate(`/finder?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-slateLine bg-paper">
        <div className="absolute inset-0 map-grid opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/94 to-paper/70" aria-hidden="true" />
        <div className="cc-container relative grid gap-10 py-12 md:py-16 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-harbor">
              Student, Learning & Community Support Hub
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.03] text-ink sm:text-6xl">
              Find learning spaces, support, clubs, and opportunities near you.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/72">
              Community Compass connects students and families with educational resources, youth programs, community support, volunteering, and school funding.
            </p>
            <div className="mt-5 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end">
              <LocationProfileSelector />
              <DataStatus className="flex-1" />
            </div>
            <form onSubmit={handleSearch} className="mt-7 flex max-w-3xl flex-col gap-3 rounded-lg border border-slateLine bg-white p-3 shadow-soft sm:flex-row">
              <label className="sr-only" htmlFor="home-search">Search opportunities</label>
              <input
                id="home-search"
                name="q"
                className="min-h-12 flex-1 rounded-md border border-transparent px-4 text-base font-semibold outline-none focus:border-harbor"
                placeholder="Search for tutoring, 3D printers, robotics teams, food help, grants..."
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-harbor px-5 py-3 font-black text-white transition hover:bg-teal-800" type="submit">
                <Icon name="Search" className="h-5 w-5" />
                Search
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickActions.map(([label, to, icon]) => (
                <Link key={label} to={to} className="inline-flex items-center gap-2 rounded-full border border-slateLine bg-white/90 px-4 py-2 text-sm font-black text-ink shadow-sm transition hover:bg-civic">
                  <Icon name={icon} className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-4">
            <div className="rounded-lg border border-slateLine bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-black">Hub snapshot</p>
                <Icon name="Sparkles" className="h-5 w-5 text-harbor" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {communityProfile.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-civic p-4">
                    <p className="text-2xl font-black text-ink">{stat.value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/58">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slateLine bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-black">Nearby resource preview</p>
                <Link to="/map" className="text-sm font-black text-harbor">Open map</Link>
              </div>
              <div className="mt-4 grid gap-2">
                {mapPreview.map((resource) => {
                  const category = getCategory(resource.categoryId);
                  return (
                    <Link key={resource.id} to="/map" className="flex items-center justify-between rounded-lg border border-slateLine p-3 hover:bg-civic">
                      <span>
                        <span className="block text-sm font-black">{resource.name}</span>
                        <span className="text-xs font-semibold text-ink/58">{category.name} in {resource.neighborhood}</span>
                      </span>
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    </Link>
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-semibold text-ink/55">Grants and online-only opportunities are intentionally not mapped.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cc-container py-12 md:py-16">
        <SectionHeader
          eyebrow="Featured learning resources"
          title="Places and tools students can actually use"
          description="Libraries, makerspaces, public computers, 3D printing, art/design stations, tutoring resources, and study spaces."
          action={<ButtonLink to="/learning" variant="outline" icon="BookOpenCheck">Explore learning resources</ButtonLink>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredLearning.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} compact />
          ))}
        </div>
      </section>

      <section className="bg-white/72 py-12 md:py-16">
        <div className="cc-container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader
              eyebrow="Student & family support"
              title="Support services that protect access to learning"
              description="Food assistance, shelter support, mental health, internet/device help, and family programs stay visible without becoming the entire site."
              action={<ButtonLink to="/support" icon="HeartPulse">Open support hub</ButtonLink>}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {supportPreview.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="cc-container py-12 md:py-16">
        <SectionHeader
          eyebrow="Student, school & community opportunities"
          title="Tutoring, clubs, volunteering, events, and enrichment in one path"
          description="This opportunity layer connects academic help, student clubs, service roles, youth programs, college/career preparation, and school-community funding."
          action={<ButtonLink to="/clubs" variant="outline" icon="UsersRound">Find clubs and opportunities</ButtonLink>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {clubPreview.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} compact />
          ))}
        </div>
      </section>

      <section className="bg-white/72 py-12 md:py-16">
        <div className="cc-container">
          <SectionHeader
            eyebrow="Student, school & community funding"
            title="Funding that supports learning, clubs, teams, art, service, and CTE"
            description="Funding is a major judging feature, but it stays focused on students, teachers, school clubs, youth organizations, nonprofits, and community projects."
            action={<ButtonLink to="/funding" variant="gold" icon="BadgeDollarSign">Explore funding</ButtonLink>}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="cc-container py-12 md:py-16">
        <SectionHeader
          eyebrow="Upcoming youth/community events"
          title="Workshops, volunteer days, STEM/art programs, and college/career sessions"
          description="Events keep the hub active and connect students to real next steps."
          action={<ButtonLink to="/events" variant="outline" icon="CalendarDays">View events</ButtonLink>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {youthEvents.map((event) => (
            <EventCard key={event.id} event={event} compact />
          ))}
        </div>
      </section>

      <section className="cc-container pb-14">
        <div className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-200">Find the right path</p>
              <h2 className="mt-2 text-2xl font-black">Not sure whether you need a resource, event, club, or funding?</h2>
              <p className="mt-2 max-w-2xl text-white/72">
                The Opportunity Finder recommends a mix of learning spaces, support services, clubs, volunteer roles, events, and grants.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/finder" variant="outline" icon="Sparkles">Launch Opportunity Finder</ButtonLink>
              <ButtonLink to="/suggest" variant="gold" icon="PlusCircle">Suggest an opportunity</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
