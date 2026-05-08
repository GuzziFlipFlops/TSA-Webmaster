import GrantSpotlightCard from "../components/GrantSpotlightCard.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import { PageHeader, SectionHeader } from "../components/UI.jsx";
import { grantSpotlights, spotlights } from "../data/communityData";

export default function SpotlightsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resource spotlights"
        title="Premium profiles that make the hub feel human."
        description="Spotlights give judges more than database rows: mission, audience, services, impact, CTAs, and related support."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="Community resource spotlights" />
        <div className="grid gap-6 lg:grid-cols-3">
          {spotlights.map((spotlight) => (
            <SpotlightCard key={spotlight.id} spotlight={spotlight} premium />
          ))}
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Funding spotlights" description="A polished feature layer for school, club, art, STEM, and community project support." />
          <div className="grid gap-6 lg:grid-cols-3">
            {grantSpotlights.map((spotlight) => (
              <GrantSpotlightCard key={spotlight.id} spotlight={spotlight} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
