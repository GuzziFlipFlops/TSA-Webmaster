import { useState } from "react";
import { fundingCategories } from "../data/communityData";
import { PageHeader, InfoPanel } from "../components/UI.jsx";
import useLocalStorage from "../components/useLocalStorage.js";

const initialForm = {
  title: "",
  funder: "",
  category: "",
  eligibleApplicants: "",
  amount: "",
  deadline: "",
  url: "",
  description: "",
  restrictions: "",
  submitterName: "",
  submitterEmail: "",
  notes: ""
};

export default function SuggestGrantPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submissions, setSubmissions] = useLocalStorage("cc-pending-grant-submissions", []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Grant name is required.";
    if (!form.funder.trim()) nextErrors.funder = "Funder is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    if (!form.url.trim()) nextErrors.url = "Official website or application link is required.";
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
        ...form
      }
    ]);
    setForm(initialForm);
    setSuccess(true);
  }

  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Suggest funding"
        title="Suggest a school, club, youth, nonprofit, or community funding opportunity."
        description="Submissions are saved to a pending review list in localStorage. They are not published automatically."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <InfoPanel icon="ShieldCheck" title="Moderation approach" tone="amber">
          Funding opportunities must be verified against official sources before they appear in the directory. This prevents fake deadlines and unreliable grant claims.
        </InfoPanel>
        {success ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5 font-bold text-green-900">
            Thanks. The funding suggestion was saved as pending review.
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-lg border border-slateLine bg-white p-6 shadow-soft">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Grant/funding opportunity name" error={errors.title}>
              <input value={form.title} onChange={(event) => update("title", event.target.value)} className="field" />
            </Field>
            <Field label="Funder" error={errors.funder}>
              <input value={form.funder} onChange={(event) => update("funder", event.target.value)} className="field" />
            </Field>
            <Field label="Category" error={errors.category}>
              <select value={form.category} onChange={(event) => update("category", event.target.value)} className="field">
                <option value="">Choose category</option>
                {fundingCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Eligible applicants">
              <input value={form.eligibleApplicants} onChange={(event) => update("eligibleApplicants", event.target.value)} className="field" placeholder="Teachers, clubs, nonprofits..." />
            </Field>
            <Field label="Funding amount">
              <input value={form.amount} onChange={(event) => update("amount", event.target.value)} className="field" placeholder="$500-$2,500" />
            </Field>
            <Field label="Deadline">
              <input type="date" value={form.deadline} onChange={(event) => update("deadline", event.target.value)} className="field" />
            </Field>
            <Field label="Official website/application link" error={errors.url}>
              <input value={form.url} onChange={(event) => update("url", event.target.value)} className="field" placeholder="https://..." />
            </Field>
            <Field label="Submitter email" error={errors.submitterEmail}>
              <input value={form.submitterEmail} onChange={(event) => update("submitterEmail", event.target.value)} className="field" />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={(event) => update("description", event.target.value)} className="field min-h-28" />
          </Field>
          <Field label="Geographic restrictions">
            <textarea value={form.restrictions} onChange={(event) => update("restrictions", event.target.value)} className="field min-h-20" />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Submitter name">
              <input value={form.submitterName} onChange={(event) => update("submitterName", event.target.value)} className="field" />
            </Field>
            <Field label="Notes">
              <input value={form.notes} onChange={(event) => update("notes", event.target.value)} className="field" />
            </Field>
          </div>
          <button className="rounded-full bg-honey px-5 py-3 font-black text-white hover:bg-amber-700" type="submit">
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
