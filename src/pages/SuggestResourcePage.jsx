import { useState } from "react";
import { categories } from "../data/communityData";
import { InfoPanel, PageHeader } from "../components/UI.jsx";
import useLocalStorage from "../components/useLocalStorage.js";

const initialForm = {
  name: "",
  category: "",
  description: "",
  address: "",
  website: "",
  phoneEmail: "",
  hours: "",
  cost: "",
  audience: "",
  languages: "",
  accessibility: "",
  submitterName: "",
  submitterEmail: "",
  notes: ""
};

export default function SuggestResourcePage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submissions, setSubmissions] = useLocalStorage("cc-pending-resource-submissions", []);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Resource name is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.website.trim() && !form.phoneEmail.trim()) nextErrors.phoneEmail = "Add a website, phone, or email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail)) nextErrors.submitterEmail = "Enter a valid submitter email.";
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmissions([
      ...submissions,
      {
        submissionId: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
        status: "pending-review",
        resourceDraftFields: form
      }
    ]);
    setForm(initialForm);
    setSuccess(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Suggest a resource"
        title="Help keep Community Compass accurate and complete."
        description="Suggestions are saved as pending local submissions. They do not publish automatically until reviewed."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="ShieldCheck" title="Safe moderation" tone="teal">
          User-suggested resources are not shown in the public directory until verified by the project team.
        </InfoPanel>
        {success ? <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5 font-bold text-green-900">Thanks. The resource suggestion was saved for review.</div> : null}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-lg border border-slateLine bg-white p-6 shadow-soft">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Organization/resource name" error={errors.name}>
              <input className="field" value={form.name} onChange={(event) => update("name", event.target.value)} />
            </Field>
            <Field label="Category" error={errors.category}>
              <select className="field" value={form.category} onChange={(event) => update("category", event.target.value)}>
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Address/location">
              <input className="field" value={form.address} onChange={(event) => update("address", event.target.value)} />
            </Field>
            <Field label="Website">
              <input className="field" value={form.website} onChange={(event) => update("website", event.target.value)} />
            </Field>
            <Field label="Phone/email" error={errors.phoneEmail}>
              <input className="field" value={form.phoneEmail} onChange={(event) => update("phoneEmail", event.target.value)} />
            </Field>
            <Field label="Hours">
              <input className="field" value={form.hours} onChange={(event) => update("hours", event.target.value)} />
            </Field>
            <Field label="Cost">
              <input className="field" value={form.cost} onChange={(event) => update("cost", event.target.value)} />
            </Field>
            <Field label="Audience served">
              <input className="field" value={form.audience} onChange={(event) => update("audience", event.target.value)} />
            </Field>
            <Field label="Language support">
              <input className="field" value={form.languages} onChange={(event) => update("languages", event.target.value)} />
            </Field>
            <Field label="Accessibility info">
              <input className="field" value={form.accessibility} onChange={(event) => update("accessibility", event.target.value)} />
            </Field>
            <Field label="Submitter name">
              <input className="field" value={form.submitterName} onChange={(event) => update("submitterName", event.target.value)} />
            </Field>
            <Field label="Submitter email" error={errors.submitterEmail}>
              <input className="field" value={form.submitterEmail} onChange={(event) => update("submitterEmail", event.target.value)} />
            </Field>
          </div>
          <Field label="Description" error={errors.description}>
            <textarea className="field min-h-28" value={form.description} onChange={(event) => update("description", event.target.value)} />
          </Field>
          <Field label="Notes">
            <textarea className="field min-h-20" value={form.notes} onChange={(event) => update("notes", event.target.value)} />
          </Field>
          <button type="submit" className="rounded-full bg-harbor px-5 py-3 font-black text-white hover:bg-teal-800">
            Submit for review
          </button>
        </form>
      </section>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="grid gap-1 text-sm font-bold">
      {label}
      {children}
      {error ? <span className="text-sm font-bold text-rose-700">{error}</span> : null}
    </label>
  );
}
