import { Link } from "react-router-dom";
import { resources } from "../data/communityData";
import { getCategory, resourceById } from "../utils/resourceUtils";
import Icon from "./Icon.jsx";
import { Badge } from "./UI.jsx";

export default function SpotlightCard({ spotlight, premium = false }) {
  const resource = resourceById(resources, spotlight.resourceId);
  const category = resource ? getCategory(resource.categoryId) : null;
  return (
    <article className={`overflow-hidden rounded-lg border shadow-sm ${premium ? "border-teal-200 bg-white" : "border-slateLine bg-white"}`}>
      <div className="premium-gradient h-32 p-5 text-white">
        <Icon name={category?.icon ?? "Sparkles"} className="h-8 w-8" />
        <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white/75">Resource spotlight</p>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {category ? <Badge color="teal">{category.name}</Badge> : null}
          <Badge color="amber">Premium profile</Badge>
        </div>
        <h3 className="mt-3 text-xl font-black">{spotlight.headline}</h3>
        <p className="mt-2 text-sm font-bold text-harbor">{resource?.name}</p>
        <p className="mt-3 leading-7 text-ink/70">{spotlight.mission}</p>
        <p className="mt-3 text-sm leading-6 text-ink/62">{spotlight.impactText}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {resource?.website ? (
            <a href={resource.website} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-sm font-black text-white">
              {spotlight.cta}
            </a>
          ) : null}
          <Link to="/spotlights" className="rounded-full border border-slateLine bg-white px-4 py-2 text-sm font-black text-ink hover:bg-civic">
            Read profile
          </Link>
        </div>
      </div>
    </article>
  );
}
