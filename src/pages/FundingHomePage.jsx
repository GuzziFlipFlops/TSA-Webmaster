import { Link } from "react-router-dom";
import GrantCard from "../components/GrantCard.jsx";
import GrantReadinessChecklist from "../components/GrantReadinessChecklist.jsx";
import GrantSpotlightCard from "../components/GrantSpotlightCard.jsx";
import Icon from "../components/Icon.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { ButtonLink, PageHeader, SectionHeader } from "../components/UI.jsx";
import { fundingCategories } from "../data/communityData";
import { getGrants } from "../services/grantProvider";
import { isClosingSoon } from "../utils/grantUtils";

const personas = [
  ["Student", "Student projects with school, club, teacher, or community sponsor support.", "GraduationCap"],
  ["Teacher", "Classroom supplies, STEM tools, art materials, and enrichment activities.", "Presentation"],
  ["School Club", "TSA, service clubs, art clubs, science teams, and student leadership groups.", "UsersRound"],
  ["TSA/Robotics Team", "Registration, parts, outreach displays, engineering materials, and competition needs.", "Bot"],
  ["Parent/Community Association", "PTA/PTSA, booster, and community association support for local projects.", "Handshake"],
  ["Nonprofit", "Youth programs, community service, arts, STEM, and family support initiatives.", "HeartHandshake"],
  ["Youth Organization", "Mentored projects, environmental action, service days, and leadership programs.", "Sparkles"],
  ["Community Group", "Neighborhood improvement, accessibility, inclusion, and civic service projects.", "MapPinned"]
];

const quickFilters = [
  ["STEM Teams", "/funding/directory?bestFor=STEM"],
  ["Art Programs", "/funding/directory?bestFor=arts"],
  ["School Clubs", "/funding/directory?clubEligible=true"],
  ["Teachers", "/funding/directory?teacherEligible=true"],
  ["Youth Groups", "/funding/directory?bestFor=youth-groups"],
  ["Nonprofits", "/funding/directory?nonprofitEligible=true"],
  ["Community Projects", "/funding/directory?bestFor=community-groups"],
  ["Closing Soon", "/funding/directory?closingSoon=true"],
  ["Rolling Deadline", "/funding/directory?rolling=true"]
];

export default function FundingHomePage() {
  const profile = useActiveProfile();
  const grants = getGrants({}, profile.id);
  const featured = grants.filter((grant) => grant.featured).slice(0, 3);
  const closingSoon = grants.filter(isClosingSoon).slice(0, 3);
  const spotlightCards = [
    {
      id: "school-stem-equipment",
      title: "School STEM Equipment Grant",
      grantId: "toshiba-6-12-stem",
      whoItIsFor: "Teachers, CTE programs, TSA chapters, robotics teams, and school clubs that need equipment for hands-on STEM learning.",
      whatItFunds: "Engineering materials, science equipment, robotics-adjacent classroom tools, and project supplies.",
      whyItMatters: "A strong equipment grant can turn a one-time lesson into a lab, club build, or TSA project that students can refine all year.",
      applicationSteps: ["Define the learning goal", "List equipment and costs", "Get teacher/school approval", "Submit through the official funder page"]
    },
    {
      id: "classroom-creative-project",
      title: "Classroom and Creative Project Funding",
      grantId: "donorschoose-classroom",
      whoItIsFor: "Teachers and eligible school staff supporting classroom supplies, art materials, books, technology, and enrichment projects.",
      whatItFunds: "Classroom supplies, student materials, technology, books, art supplies, and STEM tools.",
      whyItMatters: "Small classroom projects are realistic for student teams to understand, document, and connect to learning outcomes.",
      applicationSteps: ["Write a short project story", "Build the item list", "Confirm eligibility", "Share the official project page"]
    },
    {
      id: "team-robotics-support",
      title: "Robotics and School Team Support",
      grantId: "first-team-grants",
      whoItIsFor: "Robotics teams, TSA-adjacent STEM teams, schools, and youth organizations with a mentor or sponsor.",
      whatItFunds: "Team registration, materials, outreach, competition participation, and robotics build costs.",
      whyItMatters: "Competition funding helps students move from interest to sustained participation in engineering and leadership.",
      applicationSteps: ["Confirm team eligibility", "Gather sponsor details", "Estimate season costs", "Apply through the official team grant pathway"]
    }
  ];

  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Student, school & community funding"
        title="Find support for school clubs, STEM teams, art programs, and community projects."
        description="A focused opportunity navigator for students working with sponsors, teachers, school clubs, TSA and robotics teams, youth organizations, nonprofits, associations, and local service groups."
      >
        <div className="flex flex-wrap gap-3">
          <LocationProfileSelector />
          <ButtonLink to="/funding/finder" variant="gold" icon="Sparkles">Launch funding finder</ButtonLink>
          <ButtonLink to="/funding/directory" variant="outline" icon="ListFilter">Browse funding directory</ButtonLink>
          <ButtonLink to="/funding/toolkit" variant="outline" icon="ClipboardCheck">Readiness toolkit</ButtonLink>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Who it helps"
          title="Built for school and community projects"
          description="Opportunities are framed around students, clubs, teachers, schools, associations, nonprofits, and youth-serving community groups."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {personas.map(([title, description, icon]) => (
            <div key={title} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-honey">
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {quickFilters.map(([label, to]) => (
            <Link key={label} to={to} className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-900 hover:bg-amber-100">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Featured funding"
            title="Strong starter opportunities for school teams"
            description="Every official opportunity includes a source link and verified date. Entries that still need verification are labeled clearly."
            action={<ButtonLink to="/funding/directory" variant="gold" icon="BadgeDollarSign">See all funding</ButtonLink>}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featured.map((grant) => (
              <GrantCard key={grant.id} grant={grant} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <SectionHeader eyebrow="Spotlights" title="Premium funding spotlights" description="Three judging-friendly cards explain the opportunity, the sponsor path, and why the funding matters." />
          <div className="grid gap-5">
            {spotlightCards.map((spotlight) => (
              <GrantSpotlightCard
                key={spotlight.id}
                spotlight={spotlight}
                grant={grants.find((grant) => grant.id === spotlight.grantId)}
              />
            ))}
          </div>
        </div>
        <div className="grid content-start gap-6">
          <GrantReadinessChecklist />
          <div className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
            <p className="font-black">Closing soon</p>
            <div className="mt-4 grid gap-3">
              {(closingSoon.length ? closingSoon : grants.slice(0, 3)).map((grant) => (
                <Link key={grant.id} to="/funding/directory" className="rounded-lg border border-slateLine p-4 hover:bg-civic">
                  <p className="font-black">{grant.title}</p>
                  <p className="mt-1 text-sm text-ink/60">{grant.funder}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <SectionHeader
            eyebrow="Funding categories"
            title="Coverage that supports the whole hub"
            description="Funding is connected to tutoring, youth events, STEM/CTE, art, service, accessibility, and school-community improvement."
          />
          <div className="flex flex-wrap gap-2">
            {fundingCategories.map((category) => (
              <span key={category} className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
