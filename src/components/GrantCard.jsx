import { ExternalLink, Heart } from "lucide-react";
import { grantAmountLabel } from "../utils/grantUtils";
import { titleCase } from "../utils/resourceUtils";
import { Badge, InfoPanel } from "./UI.jsx";
import { DeadlineBadge, EligibilityBadge, FundingAmountBadge, GrantStatusPill } from "./GrantBadges.jsx";

export default function GrantCard({ grant, saved = false, onToggleSave, compact = false }) {
  const isSample = Boolean(grant.isSample) || Boolean(grant.sampleData);
  const officialUrl = grant.officialUrl ?? grant.sourceUrl;
  const eligibility = [
    grant.teacherEligible && "Teachers",
    grant.schoolEligible && "Schools",
    grant.clubEligible && "School clubs",
    grant.youthGroupEligible && "Youth groups",
    grant.associationEligible && "Associations",
    grant.nonprofitEligible && "Nonprofits"
  ].filter(Boolean);

  return (
    <article className="card hc-surface group border-amber-200/80 hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex max-h-16 flex-wrap gap-2 overflow-hidden">
            <FundingAmountBadge grant={grant} />
            <DeadlineBadge grant={grant} />
            <GrantStatusPill grant={grant} />
            {grant.dataStatus === "live-api" ? <Badge color="blue">Live Grants.gov</Badge> : null}
            {!isSample && grant.dataStatus === "needs-review" ? <Badge color="amber">Needs review</Badge> : null}
            {!isSample && grant.dataStatus === "verified" ? <Badge color="green">Verified source</Badge> : null}
          </div>
          <h3 className="mt-3 text-lg font-black leading-snug sm:text-xl">{grant.title}</h3>
          <p className="mt-1 text-sm font-bold text-honey">{grant.funder}</p>
        </div>
        {onToggleSave ? (
          <button
            type="button"
            aria-label={saved ? `Remove ${grant.title} from saved funding opportunities` : `Save ${grant.title}`}
            aria-pressed={saved}
            onClick={() => onToggleSave(grant.id)}
            className={`rounded-full border p-2 transition focus:outline focus:outline-2 ${
              saved ? "border-honey bg-honey text-white" : "border-slateLine bg-white text-ink hover:bg-amber-50"
            }`}
          >
            <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-3 leading-7 text-ink/70">{grant.description}</p>
      <div className="mt-4 flex max-h-20 flex-wrap gap-2 overflow-hidden">
        {grant.categories.slice(0, compact ? 2 : 4).map((category) => (
          <Badge key={category} color="amber">{category}</Badge>
        ))}
        <Badge color={grant.applicationDifficulty === "easy" ? "green" : grant.applicationDifficulty === "moderate" ? "amber" : "red"}>
          {titleCase(grant.applicationDifficulty)} application
        </Badge>
      </div>
      <div className="mt-4 flex max-h-20 flex-wrap gap-2 overflow-hidden">
        {eligibility.slice(0, compact ? 3 : 6).map((item) => (
          <EligibilityBadge key={item}>{item}</EligibilityBadge>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-sm text-ink/68">
        <p><span className="font-black text-ink">Amount:</span> {grantAmountLabel(grant)}</p>
        <p><span className="font-black text-ink">Sponsor:</span> {grant.sponsorRequired}</p>
        <p><span className="font-black text-ink">Verified:</span> {grant.verifiedDate}</p>
      </div>
      {isSample ? (
        <div className="mt-4">
          <InfoPanel icon="BadgeAlert" title="Needs verification" tone="amber">
            This entry shows a local sponsor or association opportunity format and should be verified before real-world use.
          </InfoPanel>
        </div>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {officialUrl ? (
          <a
            href={officialUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary bg-ink hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            Official source
          </a>
        ) : (
          <span className="inline-flex items-center rounded-full border border-slateLine bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
            Verification needed
          </span>
        )}
      </div>
    </article>
  );
}
