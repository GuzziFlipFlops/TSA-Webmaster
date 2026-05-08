import { categories } from "../data/communityData";
import { titleCase } from "../utils/resourceUtils";

const audiences = ["students", "families", "seniors", "volunteers", "new-residents", "disabled-residents"];
const costs = ["free", "free-or-low-cost", "low-cost"];
const urgencies = ["emergency", "urgent", "today", "same-week", "routine"];

export default function ResourceFilters({ filters, setFilters, savedCount = 0 }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <aside className="rounded-lg border border-slateLine bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-black">Filters</h2>
        <button
          type="button"
          className="text-sm font-bold text-harbor hover:text-teal-900"
          onClick={() => setFilters({ query: "", category: "", audience: "", cost: "", urgency: "", language: "", format: "", sort: "recommended" })}
        >
          Clear
        </button>
      </div>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm font-bold">
          Category
          <select value={filters.category ?? ""} onChange={(event) => update("category", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Audience
          <select value={filters.audience ?? ""} onChange={(event) => update("audience", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Everyone</option>
            {audiences.map((audience) => (
              <option key={audience} value={audience}>{titleCase(audience)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Cost
          <select value={filters.cost ?? ""} onChange={(event) => update("cost", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any cost</option>
            {costs.map((cost) => (
              <option key={cost} value={cost}>{titleCase(cost)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Urgency
          <select value={filters.urgency ?? ""} onChange={(event) => update("urgency", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any timing</option>
            {urgencies.map((urgency) => (
              <option key={urgency} value={urgency}>{titleCase(urgency)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Format
          <select value={filters.format ?? ""} onChange={(event) => update("format", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any format</option>
            <option value="in-person">In person</option>
            <option value="online">Online</option>
            <option value="phone">Phone</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Language
          <select value={filters.language ?? ""} onChange={(event) => update("language", event.target.value)} className="rounded-lg border border-slateLine bg-white px-3 py-2 font-medium">
            <option value="">Any language</option>
            <option value="spanish">Spanish</option>
            <option value="language line">Language line</option>
          </select>
        </label>
        <div className="grid gap-2 text-sm font-bold">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.openNow)} onChange={(event) => update("openNow", event.target.checked)} />
            Open now
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.accessibility)} onChange={(event) => update("accessibility", event.target.checked)} />
            Accessibility info listed
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(filters.transportation)} onChange={(event) => update("transportation", event.target.checked)} />
            Transportation available
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
