import { ExternalLink, Heart, Phone } from "lucide-react";
import { getCategory, isOpenNow, titleCase } from "../utils/resourceUtils";
import { Badge } from "./UI.jsx";

function costColor(cost) {
  if (cost === "free") return "green";
  if (cost === "low-cost" || cost === "free-or-low-cost") return "amber";
  return "slate";
}

function urgencyColor(urgency) {
  if (urgency === "emergency" || urgency === "urgent") return "red";
  if (urgency === "today" || urgency === "same-week") return "amber";
  return "blue";
}

export default function ResourceCard({ resource, saved = false, onToggleSave, compact = false }) {
  const category = getCategory(resource.categoryId);
  const openNow = isOpenNow(resource);
  const isSample = Boolean(resource.isSample) || Boolean(resource.sampleData) || resource.tags?.includes("sample") || resource.source?.toLowerCase().includes("sample");
  const sourceUrl = resource.sourceUrl ?? resource.website;
  const directionsUrl = resource.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}` : "";
  return (
    <article className="card hc-surface group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex max-h-16 flex-wrap items-center gap-2 overflow-hidden">
            <Badge color="teal">{category.name}</Badge>
            <Badge color={urgencyColor(resource.urgency)}>{titleCase(resource.urgency)}</Badge>
            {openNow === true ? <Badge color="green">Open now</Badge> : openNow === false ? <Badge color="slate">Closed now</Badge> : <Badge color="slate">Hours not verified</Badge>}
            {isSample ? <Badge color="slate">Needs verification</Badge> : null}
            {resource.dataStatus === "verified" && !isSample ? <Badge color="green">Verified source</Badge> : null}
          </div>
          <h3 className="mt-3 text-lg font-black leading-snug text-ink sm:text-xl">{resource.name}</h3>
        </div>
        {onToggleSave ? (
          <button
            type="button"
            aria-label={saved ? `Remove ${resource.name} from saved resources` : `Save ${resource.name}`}
            aria-pressed={saved}
            onClick={() => onToggleSave(resource.id)}
            className={`rounded-full border p-2 transition focus:outline focus:outline-2 ${
              saved ? "border-harbor bg-harbor text-white" : "border-slateLine bg-white text-ink hover:bg-civic"
            }`}
          >
            <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
          </button>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-3 leading-7 text-ink/70">{resource.description}</p>
      <div className="mt-4 flex max-h-20 flex-wrap gap-2 overflow-hidden">
        <Badge color={costColor(resource.cost)}>{titleCase(resource.cost)}</Badge>
        {resource.audience?.slice(0, compact ? 2 : 4).map((audience) => (
          <Badge key={audience} color="blue">{titleCase(audience)}</Badge>
        ))}
        {resource.transportation ? <Badge color="purple">Transit nearby</Badge> : null}
      </div>
      <div className="mt-4 grid gap-2 text-sm text-ink/66">
        <p>
          <span className="font-bold text-ink">Location:</span> {resource.address}
        </p>
        <p>
          <span className="font-bold text-ink">Hours:</span> {resource.hours?.summary ?? "Hours not verified"}
        </p>
        <p>
          <span className="font-bold text-ink">Verified:</span> {resource.verifiedDate ?? "Seed dataset"}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary bg-ink hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            Official source
          </a>
        ) : null}
        {directionsUrl ? (
          <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-secondary">
            Get directions
          </a>
        ) : null}
        {resource.phone ? (
          <a
            href={`tel:${resource.phone}`}
            className="btn-secondary"
          >
            <Phone className="h-4 w-4" />
            {resource.phone}
          </a>
        ) : null}
      </div>
    </article>
  );
}
