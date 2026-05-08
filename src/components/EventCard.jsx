import { Link } from "react-router-dom";
import { events, resources } from "../data/communityData";
import { formatDate, formatTime, getCategory, resourceById, titleCase } from "../utils/resourceUtils";
import { Badge } from "./UI.jsx";

export default function EventCard({ event, compact = false }) {
  const category = getCategory(event.categoryId);
  const host = resourceById(resources, event.hostResourceId);
  const isSample = Boolean(event.isSample) || event.title?.toLowerCase().includes("sample");
  const sourceUrl = event.sourceUrl ?? event.registrationUrl ?? host?.website;
  return (
    <article className="card hc-surface">
      <div className="flex max-h-16 flex-wrap gap-2 overflow-hidden">
        <Badge color="amber">{formatDate(event.date)}</Badge>
        <Badge color="teal">{category.name}</Badge>
        {event.volunteerOpportunity ? <Badge color="purple">Volunteer</Badge> : null}
        {isSample ? <Badge color="slate">Sample/demo listing</Badge> : null}
      </div>
      <h3 className="mt-3 text-lg font-black leading-snug sm:text-xl">{event.title}</h3>
      <p className="mt-2 line-clamp-3 leading-7 text-ink/70">{event.description}</p>
      <div className="mt-4 grid gap-1 text-sm text-ink/65">
        <p><span className="font-bold text-ink">Time:</span> {formatTime(event.startTime)}-{formatTime(event.endTime)}</p>
        <p><span className="font-bold text-ink">Location:</span> {event.location}</p>
        {host ? <p><span className="font-bold text-ink">Host:</span> {host.name}</p> : null}
        <p><span className="font-bold text-ink">Verified:</span> {event.verifiedDate ?? "Seed dataset"}</p>
      </div>
      <div className="mt-4 flex max-h-16 flex-wrap gap-2 overflow-hidden">
        {event.audience.slice(0, compact ? 2 : 4).map((audience) => (
          <Badge key={audience} color="blue">{titleCase(audience)}</Badge>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="btn-primary bg-ink hover:bg-slate-800">
            Official source
          </a>
        ) : null}
        <Link to="/events" className="btn-secondary">
          View details
        </Link>
      </div>
    </article>
  );
}

export function FeaturedEvents({ limit = 3 }) {
  return events
    .filter((event) => event.featured)
    .slice(0, limit)
    .map((event) => <EventCard key={event.id} event={event} compact />);
}
