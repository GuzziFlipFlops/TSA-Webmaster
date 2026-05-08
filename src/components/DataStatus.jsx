import { apiStatus } from "../services/apiStatus";
import Icon from "./Icon.jsx";
import useActiveProfile from "./useActiveProfile";

export default function DataStatus({ className = "" }) {
  const profile = useActiveProfile();
  return (
    <div className={`rounded-lg border border-slateLine bg-white/90 p-3 text-sm font-bold text-ink/68 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Icon name="Database" className="h-4 w-4 text-harbor" />
        <span>{apiStatus.compact}</span>
      </div>
      <p className="mt-1 text-xs text-ink/55">
        Service area: {profile.shortLabel} - Last updated {profile.lastUpdated}
      </p>
    </div>
  );
}
