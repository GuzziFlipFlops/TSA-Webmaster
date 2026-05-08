import { useMemo, useState } from "react";
import EventCard from "../components/EventCard.jsx";
import GrantCard from "../components/GrantCard.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { Badge, ButtonLink, InfoPanel, PageHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { getEvents } from "../services/eventProvider";
import { getResources } from "../services/resourceProvider";
import { scoreGrant } from "../utils/grantUtils";
import { getResourcePillar, searchableText, titleCase } from "../utils/resourceUtils";

const steps = [
  {
    key: "lookingFor",
    question: "What are you looking for?",
    options: [
      ["learn-make", "A place to learn/make something"],
      ["tutoring", "Tutoring or school help"],
      ["support", "Food/shelter/family support"],
      ["mental-health", "Mental health support"],
      ["club", "A club or team"],
      ["volunteer", "Volunteering"],
      ["funding", "Funding/grants"],
      ["career", "College/career help"]
    ]
  },
  {
    key: "audience",
    question: "Who is this for?",
    options: [
      ["students", "High school student"],
      ["middle-school", "Middle school student"],
      ["families", "Parent/family"],
      ["teachers", "Teacher"],
      ["school-clubs", "School club"],
      ["community-groups", "Community group"],
      ["nonprofits", "Nonprofit/youth organization"]
    ]
  },
  {
    key: "format",
    question: "Do you need something local/in-person or online/general?",
    options: [
      ["in-person", "Local / in person"],
      ["online", "Online / general"],
      ["either", "Either works"]
    ]
  },
  {
    key: "urgent",
    question: "Is it urgent?",
    options: [
      ["urgent", "Yes, soon or today"],
      ["routine", "No, planning ahead"]
    ]
  },
  {
    key: "cost",
    question: "Is free or low-cost required?",
    options: [
      ["free", "Free required"],
      ["free-or-low-cost", "Free or low-cost preferred"],
      ["any", "Any cost"]
    ]
  },
  {
    key: "interest",
    question: "What interest area fits best?",
    options: [
      ["stem robotics", "STEM/robotics"],
      ["art design", "Art/design"],
      ["academic homework tutoring", "Academic help"],
      ["career college cte", "Career/college"],
      ["service volunteer community", "Service"],
      ["food housing mental-health family", "Basic needs/support"]
    ]
  }
];

function scoreResource(resource, answers) {
  const text = searchableText(resource);
  let score = 0;
  const reasons = [];
  const pillar = getResourcePillar(resource);
  const needMap = {
    "learn-make": ["learning-resource", "makerspace", "library", "3d-printer", "computers"],
    tutoring: ["tutoring", "homework", "student-family", "library"],
    support: ["support-service", "food", "housing", "family"],
    "mental-health": ["mental-health", "crisis", "wellness"],
    club: ["club-opportunity", "robotics", "school-club", "art"],
    volunteer: ["volunteer-opportunity", "volunteer", "service-hours"],
    career: ["career-opportunity", "career", "college", "resume", "cte"]
  };
  (needMap[answers.lookingFor] ?? []).forEach((token) => {
    if (text.includes(token) || pillar === token) score += 5;
  });
  if (score > 0) reasons.push(`matches ${titleCase(answers.lookingFor)}`);
  if (answers.audience && (resource.audience?.includes(answers.audience) || text.includes(answers.audience))) {
    score += 3;
    reasons.push(`serves ${titleCase(answers.audience)}`);
  }
  if (answers.format !== "either" && resource.format?.includes(answers.format)) {
    score += 2;
    reasons.push(`offers ${titleCase(answers.format)} access`);
  }
  if (answers.urgent === "urgent" && ["emergency", "urgent", "today", "same-week"].includes(resource.urgency)) {
    score += 3;
    reasons.push("fits urgent timing");
  }
  if (answers.cost !== "any" && ["free", "free-or-low-cost", answers.cost].includes(resource.cost)) {
    score += 2;
    reasons.push("fits cost preference");
  }
  if (answers.interest?.split(" ").some((term) => text.includes(term))) {
    score += 3;
    reasons.push("matches the interest area");
  }
  return { type: "resource", item: resource, score, reasons: reasons.slice(0, 3) };
}

function scoreEvent(event, answers) {
  const text = `${event.title} ${event.description} ${event.categoryId} ${event.audience.join(" ")}`.toLowerCase();
  let score = 0;
  const reasons = [];
  if (["volunteer", "club", "career", "learn-make", "tutoring"].includes(answers.lookingFor)) {
    score += 2;
    reasons.push("is an event or workshop");
  }
  if (answers.audience && text.includes(answers.audience.replace("middle-school", "students"))) score += 2;
  if (answers.interest?.split(" ").some((term) => text.includes(term))) {
    score += 3;
    reasons.push("matches the interest area");
  }
  return { type: "event", item: event, score, reasons: reasons.slice(0, 3) };
}

function scoreGrantForFinder(grant, answers) {
  const mappedAnswers = {
    applicant: answers.audience === "teachers" ? "teachers" : answers.audience === "nonprofits" ? "nonprofits" : answers.audience === "community-groups" ? "community-groups" : "school-clubs",
    project: answers.interest?.includes("stem") ? "stem" : answers.interest?.includes("art") ? "art" : answers.interest?.includes("service") ? "service" : "club",
    sponsor: ["students", "school-clubs", "teachers"].includes(answers.audience) ? "yes" : "unsure",
    amount: "1000",
    timing: answers.urgent === "urgent" ? "soon" : "year",
    difficulty: "moderate",
    impact: answers.interest?.includes("service") ? "community" : "school"
  };
  const scored = scoreGrant(grant, mappedAnswers);
  if (answers.lookingFor === "funding") scored.score += 8;
  return { type: "grant", item: grant, score: scored.score, reasons: scored.reasons };
}

export default function OpportunityFinderPage() {
  const profile = useActiveProfile();
  const resources = getResources({}, profile.id);
  const events = getEvents({}, profile.id);
  const grants = getGrants({}, profile.id);
  const [answers, setAnswers] = useState({});
  const stepIndex = Object.keys(answers).length;
  const currentStep = steps[stepIndex];
  const done = stepIndex >= steps.length;
  const results = useMemo(() => {
    if (!done) return [];
    return [
      ...resources.map((resource) => scoreResource(resource, answers)),
      ...events.map((event) => scoreEvent(event, answers)),
      ...grants.map((grant) => scoreGrantForFinder(grant, answers))
    ]
      .filter((result) => result.score > 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);
  }, [answers, done]);

  return (
    <>
      <PageHeader
        eyebrow="Opportunity finder"
        title="Get matched to learning spaces, support, clubs, volunteering, events, or funding."
        description="The finder recommends a mix of resources, events, and funding opportunities, clearly labeled by type."
      >
        <LocationProfileSelector />
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="Info" title="Explainable matching" tone="teal">
          Results are ranked from local data tags, applicant fit, access format, urgency, cost, and interest area. Always verify official details before visiting or applying.
        </InfoPanel>
        <div className="mt-6 rounded-lg border border-slateLine bg-white p-6 shadow-soft">
          <div className="h-2 overflow-hidden rounded-full bg-civic">
            <div className="h-full bg-harbor transition-all" style={{ width: `${Math.min(100, (stepIndex / steps.length) * 100)}%` }} />
          </div>
          {!done ? (
            <div className="mt-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-harbor">Question {stepIndex + 1} of {steps.length}</p>
              <h2 className="mt-2 text-2xl font-black">{currentStep.question}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentStep.options.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [currentStep.key]: value }))}
                    className="rounded-lg border border-slateLine bg-white p-4 text-left font-black transition hover:border-harbor hover:bg-teal-50 focus:outline focus:outline-2"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-harbor">Mixed recommendations</p>
                  <h2 className="mt-2 text-2xl font-black">Best matches</h2>
                </div>
                <button type="button" className="rounded-full border border-slateLine px-4 py-2 text-sm font-black" onClick={() => setAnswers({})}>
                  Start over
                </button>
              </div>
              <div className="mt-6 grid gap-5">
                {results.map((result) => (
                  <div key={`${result.type}-${result.item.id}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge color={result.type === "grant" ? "amber" : result.type === "event" ? "purple" : "teal"}>{titleCase(result.type)}</Badge>
                      <p className="text-sm font-bold text-ink/65">Matched because it {result.reasons.join(", ")}.</p>
                    </div>
                    {result.type === "grant" ? <GrantCard grant={result.item} /> : result.type === "event" ? <EventCard event={result.item} /> : <ResourceCard resource={result.item} />}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to="/learning" icon="BookOpenCheck">Learning resources</ButtonLink>
                <ButtonLink to="/funding" variant="gold" icon="BadgeDollarSign">Funding</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
