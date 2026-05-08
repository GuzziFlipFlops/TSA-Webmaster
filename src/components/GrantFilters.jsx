import { fundingCategories } from "../data/communityData";
import { titleCase } from "../utils/resourceUtils";

const bestForOptions = [
  ["students", "Students"],
  ["teachers", "Teachers"],
  ["school-clubs", "School clubs"],
  ["STEM", "STEM teams"],
  ["arts", "Art programs"],
  ["nonprofits", "Nonprofits"],
  ["community-groups", "Community groups"],
  ["service", "Service projects"]
];

export default function GrantFilters({ filters, setFilters, savedCount = 0 }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <aside className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-black">Funding filters</h2>
        <button
          type="button"
          className="text-sm font-bold text-honey hover:text-amber-800"
          onClick={() => setFilters({ query: "", category: "", bestFor: "", difficulty: "", scope: "", sort: "best" })}
        >
          Clear
        </button>
      </div>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm font-bold">
          Category
          <select value={filters.category ?? ""} onChange={(event) => update("category", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">All funding categories</option>
            {fundingCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Best for
          <select value={filters.bestFor ?? ""} onChange={(event) => update("bestFor", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any applicant type</option>
            {bestForOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Application difficulty
          <select value={filters.difficulty ?? ""} onChange={(event) => update("difficulty", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any difficulty</option>
            {["easy", "moderate", "advanced"].map((difficulty) => (
              <option key={difficulty} value={difficulty}>{titleCase(difficulty)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Scope
          <select value={filters.scope ?? ""} onChange={(event) => update("scope", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any scope</option>
            {["local", "state", "national", "international", "chapter-based"].map((scope) => (
              <option key={scope} value={scope}>{titleCase(scope)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Minimum need
          <select value={filters.amount ?? ""} onChange={(event) => update("amount", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any amount</option>
            <option value="500">$500+</option>
            <option value="1000">$1,000+</option>
            <option value="2500">$2,500+</option>
            <option value="5000">$5,000+</option>
          </select>
        </label>
        <div className="grid gap-2 text-sm font-bold">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.rolling)} onChange={(event) => update("rolling", event.target.checked)} />
            Rolling deadline
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.closingSoon)} onChange={(event) => update("closingSoon", event.target.checked)} />
            Closing soon
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.teacherEligible)} onChange={(event) => update("teacherEligible", event.target.checked)} />
            Teacher eligible
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.clubEligible)} onChange={(event) => update("clubEligible", event.target.checked)} />
            School club eligible
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.nonprofitEligible)} onChange={(event) => update("nonprofitEligible", event.target.checked)} />
            Nonprofit/youth org eligible
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.noNonprofitRequired)} onChange={(event) => update("noNonprofitRequired", event.target.checked)} />
            No nonprofit required
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.savedOnly)} onChange={(event) => update("savedOnly", event.target.checked)} />
            Saved only ({savedCount})
          </label>
        </div>
      </div>
    </aside>
  );
}
