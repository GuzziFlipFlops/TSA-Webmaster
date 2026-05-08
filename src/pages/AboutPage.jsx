import { Link } from "react-router-dom";
import DataStatus from "../components/DataStatus.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { PageHeader, SectionHeader, Badge, InfoPanel } from "../components/UI.jsx";
import { dataStatusLabels, siteConfig } from "../data/siteConfig";
import { apiStatus } from "../services/apiStatus";
import { getGrants } from "../services/grantProvider";
import { getResources } from "../services/resourceProvider";
import { isLearningResource } from "../utils/resourceUtils";

export default function AboutPage() {
  const profile = useActiveProfile();
  const grants = getGrants({}, profile.id);
  const resources = getResources({}, profile.id);
  const sampleGrants = grants.filter((grant) => grant.sampleData || grant.isSample).length;
  const sampleResources = resources.filter((resource) => resource.isSample).length;
  const learningCount = resources.filter(isLearningResource).length;

  return (
    <>
      <PageHeader
        eyebrow="About / credits / citations"
        title="Purpose, transparency, data sources, and project credits."
        description="Community Compass is a TSA Webmaster prototype for a focused student, learning, support, clubs, volunteering, events, and funding hub."
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <LocationProfileSelector />
          <DataStatus className="flex-1" />
        </div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-slateLine bg-white p-6 shadow-soft">
            <SectionHeader title="Project purpose" />
            <p className="leading-8 text-ink/72">
              We built a focused community hub that helps students and families find learning spaces, support services, clubs, volunteering, events, and funding opportunities. The map is used only where location matters, while grants and online opportunities use searchable directories and guided matching.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge color="blue">{learningCount} learning entries</Badge>
              <Badge color="teal">{resources.length} total resources</Badge>
              <Badge color="amber">{grants.length} funding entries</Badge>
              <Badge color="slate">{sampleResources + sampleGrants} sample/demo entries</Badge>
            </div>
            <p className="mt-5 text-sm font-bold text-ink/62">
              Active profile: {profile.serviceAreaLabel}. Data mode: {dataStatusLabels[profile.dataMode]}. Last updated {profile.lastUpdated}.
            </p>
          </div>
          <div className="grid gap-4">
            <InfoPanel icon="ShieldCheck" title="Data limitations" tone="amber">
              {siteConfig.disclaimer}
            </InfoPanel>
            <InfoPanel icon="Accessibility" title="Accessibility statement" tone="teal">
              The build includes semantic headings, labeled forms, keyboard-friendly controls, visible focus states, high contrast, large text, and reduced motion toggles.
            </InfoPanel>
          </div>
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Technology and architecture" />
          <div className="grid gap-4 md:grid-cols-4">
            {["React + Vite", "Tailwind CSS", "Leaflet / OpenStreetMap", "Local provider layer + localStorage"].map((tech) => (
              <div key={tech} className="rounded-lg border border-slateLine bg-white p-5 font-black shadow-sm">{tech}</div>
            ))}
          </div>
        </div>
      </section>
      <section className="cc-container py-10">
        <SectionHeader title="API and data status" />
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
            <p className="font-black">{apiStatus.current}</p>
            <p className="mt-3 leading-7 text-ink/68">{apiStatus.map}</p>
            <p className="mt-3 leading-7 text-ink/68">{apiStatus.geolocation}</p>
          </div>
          <div className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
            <p className="font-black">Future provider notes</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/68">
              {apiStatus.futureApis.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="Citations" description="Official sources and technology credits used by the seeded prototype." />
        <div className="grid gap-3 md:grid-cols-2">
          {profile.citations.map((citation) => (
            <a key={citation.url} href={citation.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slateLine bg-white p-4 font-bold text-harbor shadow-sm hover:bg-civic">
              {citation.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-slateLine bg-white p-5">
          <SectionHeader
            title="API-ready path"
            description="The current build reads local seeded data through provider files. Future integrations could connect 211/community resource APIs, Google Places, local open-data portals, Grants.gov, Nominatim geocoding, or district data without changing the page components."
          />
        </div>
        <div className="rounded-lg bg-ink p-6 text-white">
          <SectionHeader
            title="Judge demo talking points"
            description="Focused theme fit, reusable component architecture, structured data modeling, purpose-built map strategy, funding verification labels, accessibility modes, localStorage moderation, and TSA/CTE connection."
            action={<Link to="/" className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink">Return home</Link>}
          />
        </div>
      </section>
    </>
  );
}
