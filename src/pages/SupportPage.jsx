import { Link } from "react-router-dom";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { ButtonLink, InfoPanel, PageHeader, SectionHeader } from "../components/UI.jsx";
import { getResources } from "../services/resourceProvider";
import { isSupportService } from "../utils/resourceUtils";

const supportTiles = [
  ["Food assistance", "food", "Pantries, WIC, bridge programs, and county planning support."],
  ["Shelter/housing support", "housing", "Shelter, legal aid, case management, and seasonal emergency support."],
  ["Mental health support", "mental-health", "Crisis lines, CSB emergency services, and family wellness programs."],
  ["Internet/device help", "device", "Library computers, Wi-Fi, digital help, and device access pathways."],
  ["Family support", "family", "Parent workshops, early childhood support, family navigation, and benefits referrals."]
];

export default function SupportPage() {
  const profile = useActiveProfile();
  const resources = getResources({}, profile.id);
  const supportResources = resources.filter(isSupportService);
  return (
    <>
      <PageHeader
        eyebrow="Student & family support"
        title="Find practical support services that help students and families stay stable and connected."
        description="Support is part of educational opportunity: food, housing, safety, mental health, devices, transportation, and family programs all affect whether students can participate."
      >
        <div className="mb-3">
          <LocationProfileSelector />
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/finder" icon="Sparkles">Use opportunity finder</ButtonLink>
          <ButtonLink to="/resources?category=mental-health" variant="outline" icon="HeartPulse">Mental health support</ButtonLink>
        </div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="TriangleAlert" title="Emergency disclaimer" tone="red">
          This site is informational. Call 911 for immediate danger, 988 for crisis support, and verify service details before visiting.
        </InfoPanel>
        <SectionHeader title="Support pathways" description="Start from the need, then open filtered resources." />
        <div className="grid gap-4 md:grid-cols-5">
          {supportTiles.map(([title, query, description]) => (
            <Link key={title} to={`/resources?q=${encodeURIComponent(query)}`} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm hover:shadow-soft">
              <h2 className="font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured support services" description="These listings keep urgent and family support visible while the site stays centered on student learning and opportunity." />
          <div className="grid gap-5 lg:grid-cols-3">
            {supportResources.slice(0, 9).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
