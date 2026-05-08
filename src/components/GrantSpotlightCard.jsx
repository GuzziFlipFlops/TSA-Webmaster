import { Link } from "react-router-dom";
import { grantAmountLabel, grantById } from "../utils/grantUtils";
import { titleCase } from "../utils/resourceUtils";
import { Badge, InfoPanel } from "./UI.jsx";
import { DeadlineBadge } from "./GrantBadges.jsx";

export default function GrantSpotlightCard({ spotlight, grant: providedGrant }) {
  const grant = providedGrant ?? grantById(spotlight.grantId);
  return (
    <article className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-amber-500 to-teal-800 p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-white/78">Funding spotlight</p>
        <h3 className="mt-3 text-2xl font-black">{spotlight.title}</h3>
      </div>
      <div className="p-5">
        {grant ? (
          <div className="flex flex-wrap gap-2">
            <Badge color="amber">{grantAmountLabel(grant)}</Badge>
            <DeadlineBadge grant={grant} />
            <Badge color={grant.applicationDifficulty === "easy" ? "green" : "amber"}>{titleCase(grant.applicationDifficulty)}</Badge>
          </div>
        ) : null}
        <dl className="mt-4 grid gap-4">
          <div>
            <dt className="text-sm font-black text-ink">Who it is for</dt>
            <dd className="mt-1 leading-7 text-ink/70">{spotlight.whoItIsFor}</dd>
          </div>
          <div>
            <dt className="text-sm font-black text-ink">What it funds</dt>
            <dd className="mt-1 leading-7 text-ink/70">{spotlight.whatItFunds}</dd>
          </div>
          <div>
            <dt className="text-sm font-black text-ink">Why it matters</dt>
            <dd className="mt-1 leading-7 text-ink/70">{spotlight.whyItMatters}</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-lg bg-amber-50 p-4">
          <p className="font-black">Application steps</p>
          <ol className="mt-2 grid gap-2 text-sm text-ink/70">
            {spotlight.applicationSteps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="font-black text-honey">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        {grant?.sampleData ? (
          <div className="mt-4">
            <InfoPanel icon="BadgeAlert" title="Sample data" tone="amber">
              This spotlight demonstrates a local funding format and should be replaced with verified school, PTA, booster, or civic association details.
            </InfoPanel>
          </div>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          {grant?.officialUrl ? (
            <a href={grant.officialUrl} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-sm font-black text-white">
              Official source
            </a>
          ) : null}
          <Link to="/funding/directory" className="rounded-full border border-slateLine bg-white px-4 py-2 text-sm font-black text-ink hover:bg-civic">
            Related funding
          </Link>
        </div>
      </div>
    </article>
  );
}
