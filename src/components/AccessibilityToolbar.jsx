import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";

const modes = {
  textSize: ["normal", "large"],
  contrast: ["normal", "high"],
  motion: ["normal", "reduced"]
};

const storageKey = "cc-accessibility";

export default function AccessibilityToolbar({ compact = false }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [prefs, setPrefs] = useState(() => {
    try {
      return { textSize: "normal", contrast: "normal", motion: "normal", ...JSON.parse(localStorage.getItem(storageKey) ?? "{}") };
    } catch {
      return { textSize: "normal", contrast: "normal", motion: "normal" };
    }
  });

  useEffect(() => {
    document.body.classList.toggle("large-text", prefs.textSize === "large");
    document.body.classList.toggle("high-contrast", prefs.contrast === "high");
    document.body.classList.toggle("reduced-motion", prefs.motion === "reduced");
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const setMode = (key, value) => setPrefs((current) => ({ ...current, [key]: value }));

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Open accessibility preferences"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-slateLine bg-white px-3 text-sm font-black text-ink shadow-sm transition hover:bg-civic focus:outline focus:outline-2"
      >
        <Icon name="Accessibility" className="h-4 w-4" />
        {!compact ? "Access" : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-slateLine bg-white p-4 text-ink shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black">Accessibility</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-ink/60">Preferences are saved on this device.</p>
            </div>
            <button type="button" className="rounded-md p-1 hover:bg-civic" aria-label="Close accessibility menu" onClick={() => setOpen(false)}>
              <Icon name="X" className="h-4 w-4" />
            </button>
          </div>
          <Control
            label="Text Size"
            options={[
              ["normal", "Normal"],
              ["large", "Large"]
            ]}
            value={prefs.textSize}
            onChange={(value) => setMode("textSize", value)}
          />
          <Control
            label="Contrast"
            options={[
              ["normal", "Normal"],
              ["high", "High Contrast"]
            ]}
            value={prefs.contrast}
            onChange={(value) => setMode("contrast", value)}
          />
          <Control
            label="Motion"
            options={[
              ["normal", "Normal"],
              ["reduced", "Reduced"]
            ]}
            value={prefs.motion}
            onChange={(value) => setMode("motion", value)}
          />
        </div>
      ) : null}
    </div>
  );
}

function Control({ label, options, value, onChange }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-xs font-black uppercase tracking-[0.14em] text-ink/65">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map(([optionValue, optionLabel]) => (
          <button
            key={optionValue}
            type="button"
            aria-pressed={value === optionValue}
            onClick={() => onChange(optionValue)}
            className={`rounded-md border px-3 py-2 text-sm font-black transition focus:outline focus:outline-2 ${
              value === optionValue ? "border-ink bg-ink text-white" : "border-slateLine bg-white text-ink hover:bg-civic"
            }`}
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
