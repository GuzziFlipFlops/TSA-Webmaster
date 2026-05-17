import { useEffect, useMemo, useState } from "react";
import GrantCard from "../components/GrantCard.jsx";
import LocationProfileSelector from "../components/LocationProfileSelector.jsx";
import useActiveProfile from "../components/useActiveProfile.js";
import { ButtonLink, InfoPanel, PageHeader } from "../components/UI.jsx";
import { getGrants } from "../services/grantProvider";
import { buildGrantsGovKeywordFromAnswers, searchGrantsGov } from "../services/grantsGovProvider";
import { grantQuizOptions, scoreGrant } from "../utils/grantUtils";

const steps = [
  {
    key: "applicant",
    question: "Who is applying?",
    options: grantQuizOptions.applicant.map((option) => [option.id, option.label])
  },
  {
    key: "source",
    question: "Which funding sources should the finder use?",
    options: [
      ["curated", "Curated school/community funding only"],
      ["both", "Curated funding + live Grants.gov"],
      ["federal", "Live Grants.gov federal opportunities only"]
    ]
  },
  {
    key: "project",
    question: "What are you funding?",
    options: grantQuizOptions.project.map((option) => [option.id, option.label])
  },
  {
    key: "sponsor",
    question: "Do you have a school, teacher, club, association, or nonprofit sponsor?",
    options: [
      ["yes", "Yes, we have a sponsor"],
      ["no", "Not yet"],
      ["unsure", "Unsure"]
    ]
  },
  {
    key: "amount",
    question: "How much funding do you need?",
    options: [
      ["500", "Up to $500"],
      ["1000", "Up to $1,000"],
      ["2500", "Up to $2,500"],
      ["5000", "Up to $5,000"],
      ["10000", "$10,000 or more"]
    ]
  },
  {
    key: "timing",
    question: "When is the project happening?",
    options: [
      ["soon", "Within 2 months"],
      ["semester", "This semester"],
      ["year", "This school year"],
      ["flexible", "Flexible timing"]
    ]
  },
  {
    key: "difficulty",
    question: "How difficult of an application can you handle?",
    options: [
      ["easy", "Short and simple"],
      ["moderate", "Moderate proposal"],
      ["advanced", "Advanced grant application"]
    ]
  },
  {
    key: "impact",
    question: "What kind of impact matters most?",
    options: [
      ["school", "School impact"],
      ["community", "Local community impact"],
      ["competition", "Competition/team need"],
      ["accessibility", "Accessibility or inclusion"],
      ["environment", "Environmental impact"]
    ]
  }
];

export default function GrantFinderPage() {
  const profile = useActiveProfile();
  const curatedGrants = getGrants({ includeNational: true }, profile.id);
  const [liveGrants, setLiveGrants] = useState([]);
  const [liveStatus, setLiveStatus] = useState("");
  const [liveLoading, setLiveLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const stepIndex = Object.keys(answers).length;
  const currentStep = steps[stepIndex];
  const done = stepIndex >= steps.length;
  const shouldSearchGrantsGov = done && (answers.source === "both" || answers.source === "federal");

  useEffect(() => {
    if (!shouldSearchGrantsGov) {
      setLiveGrants([]);
      setLiveStatus("");
      return;
    }

    let cancelled = false;
    setLiveLoading(true);
    setLiveStatus("Searching live Grants.gov opportunities for this project...");
    searchGrantsGov({
      keyword: buildGrantsGovKeywordFromAnswers(answers),
      fundingCategories: answers.project === "art" ? "AR|ED" : answers.project === "environment" ? "ENV|ED|ST" : "ED|ST",
      eligibilities: answers.applicant === "nonprofits" ? "12|13" : answers.applicant === "students" ? "05|06|12|13|20|25" : "05|06|12|13|20|25",
      oppStatuses: answers.timing === "flexible" ? "posted|forecasted" : "posted",
      rows: 20
    })
      .then((results) => {
        if (cancelled) return;
        setLiveGrants(results);
        setLiveStatus(`${results.length} live Grants.gov opportunities loaded.`);
      })
      .catch((error) => {
        if (cancelled) return;
        setLiveGrants([]);
        setLiveStatus(`Live Grants.gov search is unavailable right now. ${error.message}`);
      })
      .finally(() => {
        if (!cancelled) setLiveLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [answers, shouldSearchGrantsGov]);

  const grants = useMemo(() => {
    if (answers.source === "federal") return liveGrants;
    if (answers.source === "both") return [...curatedGrants, ...liveGrants];
    return curatedGrants;
  }, [answers.source, curatedGrants, liveGrants]);

  const results = useMemo(() => {
    if (!done) return [];
    return grants
      .map((grant) => scoreGrant(grant, answers))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);
  }, [answers, done, grants]);

  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Funding finder"
        title="Match a school, club, or community project to realistic funding paths."
        description="Recommendations are based on weighted tags for applicant type, project focus, sponsor requirements, funding amount, timing, and application difficulty."
      >
        <LocationProfileSelector />
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="BadgeAlert" title="Funding accuracy note" tone="amber">
          Always confirm eligibility, deadlines, and award amounts on the official funder website. Entries needing verification are clearly marked and should be replaced with verified local data.
        </InfoPanel>
        <div className="mt-6 rounded-lg border border-amber-200 bg-white p-6 shadow-soft">
          <div className="h-2 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full bg-honey transition-all" style={{ width: `${Math.min(100, (stepIndex / steps.length) * 100)}%` }} />
          </div>
          {!done ? (
            <div className="mt-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-honey">Question {stepIndex + 1} of {steps.length}</p>
              <h2 className="mt-2 text-2xl font-black">{currentStep.question}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentStep.options.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className="rounded-lg border border-slateLine bg-white p-4 text-left font-black transition hover:border-honey hover:bg-amber-50 focus:outline focus:outline-2"
                    onClick={() => setAnswers((current) => ({ ...current, [currentStep.key]: value }))}
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
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-honey">Recommended funding</p>
                  <h2 className="mt-2 text-2xl font-black">Best matches for this project</h2>
                </div>
                <button type="button" className="rounded-full border border-slateLine px-4 py-2 text-sm font-black" onClick={() => setAnswers({})}>
                  Start over
                </button>
              </div>
              {shouldSearchGrantsGov ? (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-ink/72" role="status">
                  {liveStatus} {liveLoading ? "This may take a moment." : ""}
                </p>
              ) : null}
              <div className="mt-6 grid gap-5">
                {results.map(({ grant, reasons }) => (
                  <div key={grant.id}>
                    <p className="mb-2 text-sm font-bold text-honey">
                      Matched because this opportunity {reasons.join(", ")}.
                    </p>
                    <GrantCard grant={grant} />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to="/funding/directory" variant="gold" icon="ListFilter">Open funding directory</ButtonLink>
                <ButtonLink to="/funding/toolkit" variant="outline" icon="ClipboardCheck">Prepare application</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
