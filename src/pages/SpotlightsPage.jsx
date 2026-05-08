import GrantSpotlightCard from "../components/GrantSpotlightCard.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { PageHeader, SectionHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { getResources } from "../services/resourceProvider";
import { isClubOpportunity, isLearningResource, isSupportService } from "../utils/resourceUtils";

function makeResourceSpotlights(resources) {
  const learning = resources.find(isLearningResource);
  const support = resources.find((resource) => isSupportService(resource) && ["food", "student-family", "mental-health"].includes(resource.categoryId));
  const club = resources.find(isClubOpportunity) ?? resources.find((resource) => resource.categoryId === "volunteer");

  return [
    learning
      ? {
          id: "learning-space",
          resource: learning,
          headline: "Learning Spaces Students Can Use",
          mission: "Help students find public computers, study rooms, maker tools, tutoring paths, and quiet places to work.",
          impactText: "A strong learning space can turn after-school time into project work, homework progress, CTE exploration, or club preparation.",
          cta: "Open learning resource"
        }
      : null,
    support
      ? {
          id: "student-family-support",
          resource: support,
          headline: "Student & Family Support Pathway",
          mission: "Keep basic needs, family support, and wellness resources visible so students can stay connected to learning.",
          impactText: "Support services matter because academic opportunity depends on food access, safety, mental health, internet access, and reliable family resources.",
          cta: "View support resource"
        }
      : null,
    club
      ? {
          id: "clubs-service",
          resource: club,
          headline: "Clubs, Service, and Youth Leadership",
          mission: "Connect students with clubs, service roles, leadership programs, and community organizations that build real skills.",
          impactText: "This is where the hub becomes more than a directory: students can move from finding help to joining, building, volunteering, and leading.",
          cta: "Explore opportunity"
        }
      : null
  ].filter(Boolean);
}

function makeGrantSpotlights(grants) {
  const selected = [
    grants.find((grant) => grant.categories?.includes("STEM & Robotics")),
    grants.find((grant) => grant.categories?.includes("Art & Creative Projects")),
    grants.find((grant) => grant.categories?.includes("Community Service") || grant.categories?.includes("Environmental Projects"))
  ].filter(Boolean);

  return selected.map((grant) => ({
    id: `${grant.id}-spotlight`,
    grant,
    title: grant.categories?.includes("STEM & Robotics")
      ? "School STEM / Team Funding"
      : grant.categories?.includes("Art & Creative Projects")
        ? "Youth Art & Creative Project Funding"
        : "Community Impact Funding",
    whoItIsFor: grant.eligibleApplicants?.join(", ") || "Students, teachers, school clubs, youth groups, and community organizations.",
    whatItFunds: grant.projectTypes?.join(", ") || grant.description,
    whyItMatters:
      "Funding spotlights help teams understand eligibility, sponsor needs, deadlines, and the official-source check required before applying.",
    applicationSteps: [
      "Confirm eligibility on the official source",
      "Choose a teacher, club, school, association, or nonprofit sponsor if required",
      "Write a short project summary and budget",
      "Check the deadline and submit through the funder"
    ]
  }));
}

export default function SpotlightsPage() {
  const profile = useActiveProfile();
  const resources = getResources({}, profile.id);
  const grants = getGrants({}, profile.id);
  const resourceSpotlights = makeResourceSpotlights(resources);
  const grantSpotlights = makeGrantSpotlights(grants);

  return (
    <>
      <PageHeader
        eyebrow="Resource spotlights"
        title="Premium stories that make the hub feel human."
        description="Spotlights give judges more than database rows: mission, audience, services, impact, CTAs, and related support."
      />
      <section className="cc-container py-10">
        <SectionHeader title={`${profile.shortLabel} resource spotlights`} />
        <div className="grid gap-6 lg:grid-cols-3">
          {resourceSpotlights.map((spotlight) => (
            <SpotlightCard key={spotlight.id} spotlight={spotlight} resource={spotlight.resource} premium />
          ))}
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="cc-container">
          <SectionHeader title="Funding spotlights" description="A polished feature layer for school, club, art, STEM, and community project support." />
          <div className="grid gap-6 lg:grid-cols-3">
            {grantSpotlights.map((spotlight) => (
              <GrantSpotlightCard key={spotlight.id} spotlight={spotlight} grant={spotlight.grant} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
