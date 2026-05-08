import { useState } from "react";
import Icon from "./Icon.jsx";

const items = [
  "A one-paragraph project summary",
  "A student, teacher, club, school, association, or nonprofit sponsor",
  "A simple budget with item costs",
  "A timeline for ordering, building, hosting, or reporting",
  "A clear audience and community impact statement",
  "Official eligibility checked against the funder source",
  "Photos, data, or reflection plan for after the project"
];

export default function GrantReadinessChecklist() {
  const [checked, setChecked] = useState([]);
  const toggle = (item) =>
    setChecked((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  return (
    <div className="rounded-lg border border-amber-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-amber-100 p-3 text-honey">
          <Icon name="ClipboardCheck" className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-xl font-black">Grant readiness checklist</h3>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            A quick self-check before a team, teacher, or community group starts an application.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <label key={item} className="flex items-start gap-3 rounded-lg border border-slateLine p-3 text-sm font-semibold">
            <input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} className="mt-1" />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-civic p-3 text-sm font-bold text-ink/70">
        {checked.length} of {items.length} ready. This tool does not promise funding; it helps teams prepare stronger applications.
      </div>
    </div>
  );
}
