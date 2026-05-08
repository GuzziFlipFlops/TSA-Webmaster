import { useState } from "react";
import { siteConfig } from "../data/siteConfig";
import { geocodeLocation } from "../services/geocodeProvider";
import { defaultCommunityLocation } from "../services/locationUtils";
import Icon from "./Icon.jsx";

export default function LocationSearch({ onLocationChange }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    const result = await geocodeLocation(input);
    if (!result) {
      setStatus("We could not match that city or ZIP in the local demo lookup. Showing the configured community center instead.");
      onLocationChange(defaultCommunityLocation);
      return;
    }
    onLocationChange(result);
    setStatus(`Sorting nearby resources from ${result.label}.`);
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not available in this browser. Showing the configured community center instead.");
      onLocationChange(defaultCommunityLocation);
      return;
    }
    setBusy(true);
    setStatus("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const result = {
          label: "your current location",
          coordinates: [position.coords.latitude, position.coords.longitude]
        };
        onLocationChange(result);
        setStatus("Sorting nearby resources from your current location.");
        setBusy(false);
      },
      () => {
        setStatus("Location permission was denied or unavailable. Showing the configured community center instead.");
        onLocationChange(defaultCommunityLocation);
        setBusy(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }

  function resetLocation() {
    setInput("");
    setStatus(`Reset to ${defaultCommunityLocation.label}.`);
    onLocationChange(defaultCommunityLocation);
  }

  return (
    <div className="rounded-lg border border-slateLine bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
        <label className="grid gap-1 text-sm font-black">
          Enter city/ZIP
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="field"
            placeholder={`${siteConfig.city}, ZIP, or neighborhood`}
          />
        </label>
        <button type="submit" className="btn-primary">
          Sort nearby
        </button>
        <button type="button" className="btn-secondary" onClick={useBrowserLocation} disabled={busy}>
          <Icon name="LocateFixed" className="h-4 w-4" />
          Use my location
        </button>
        <button type="button" className="btn-secondary" onClick={resetLocation}>
          Reset
        </button>
      </form>
      <p className="mt-3 text-xs font-semibold text-ink/58">{siteConfig.locationPrivacyNote}</p>
      {status ? <p className="mt-2 text-sm font-bold text-harbor" role="status">{status}</p> : null}
    </div>
  );
}
