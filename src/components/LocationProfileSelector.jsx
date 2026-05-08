import { locationProfiles } from "../data/locationProfiles";
import { setActiveProfile } from "../services/resourceProvider";
import Icon from "./Icon.jsx";
import useActiveProfile from "./useActiveProfile";

export default function LocationProfileSelector({ compact = false }) {
  const profile = useActiveProfile();

  return (
    <label className={`inline-grid gap-1 ${compact ? "text-xs" : "text-sm"} font-black`}>
      <span className="inline-flex items-center gap-2 text-ink/65">
        <Icon name="MapPinned" className="h-4 w-4" />
        Demo profile
      </span>
      <select
        value={profile.id}
        onChange={(event) => setActiveProfile(event.target.value)}
        className="min-h-10 rounded-md border border-slateLine bg-white px-3 py-2 font-bold text-ink shadow-sm focus:outline focus:outline-2"
        aria-label="Select location profile"
      >
        {locationProfiles.map((item) => (
          <option key={item.id} value={item.id}>
            {item.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
