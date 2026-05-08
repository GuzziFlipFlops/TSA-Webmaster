import { useMemo, useState } from "react";
import { locationProfiles } from "../data/locationProfiles";
import { findKnownLocation } from "../services/geocodeProvider";
import { setActiveProfile } from "../services/resourceProvider";
import Icon from "./Icon.jsx";
import useActiveProfile from "./useActiveProfile";

export default function LocationProfileSelector({ compact = false, className = "" }) {
  const profile = useActiveProfile();
  const [input, setInput] = useState("");
  const suggestion = useMemo(() => findKnownLocation(input), [input]);

  function chooseProfile(profileId) {
    setActiveProfile(profileId);
    const next = locationProfiles.find((item) => item.id === profileId);
    setInput(next?.primaryZip ?? "");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (suggestion) {
      setActiveProfile(suggestion.profileId);
      setInput(suggestion.label);
      return;
    }
    if (input.trim()) {
      window.alert("Data for this location isn't available yet. Try Middletown, DE or TSA Nationals: National Harbor, MD.");
    }
  }

  return (
    <section className={`rounded-lg border border-slateLine bg-white p-3 shadow-sm ${className}`} aria-label="Location selector">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <form onSubmit={handleSubmit} className="min-w-0 flex-1">
          <label className={`grid gap-1 ${compact ? "text-xs" : "text-sm"} font-black`}>
            <span className="inline-flex items-center gap-2 text-ink/65">
              <Icon name="MapPinned" className="h-4 w-4" />
              Enter your location
            </span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-10 rounded-md border border-slateLine bg-white px-3 py-2 font-bold text-ink shadow-sm focus:outline focus:outline-2"
              placeholder={`${profile.primaryZip}, ${profile.city}, or National Harbor`}
              aria-describedby="location-suggestion"
            />
          </label>
          <p id="location-suggestion" className="mt-1 min-h-5 text-xs font-bold text-ink/58">
            {suggestion ? `Available: ${suggestion.label}` : input.trim() ? `Search "${input.trim()}"` : `Currently showing ${profile.shortLabel}`}
          </p>
        </form>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => chooseProfile("middletown-de")}
            className={`rounded-md border px-3 py-2 text-sm font-black ${
              profile.id === "middletown-de" ? "border-harbor bg-harbor text-white" : "border-slateLine bg-white text-ink hover:bg-civic"
            }`}
          >
            Middletown
          </button>
          <button
            type="button"
            onClick={() => chooseProfile("national-harbor-md")}
            className={`rounded-md border px-3 py-2 text-sm font-black ${
              profile.id === "national-harbor-md" ? "border-harbor bg-harbor text-white" : "border-slateLine bg-white text-ink hover:bg-civic"
            }`}
          >
            TSA Nationals
          </button>
        </div>
      </div>
    </section>
  );
}
