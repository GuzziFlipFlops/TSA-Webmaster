import GrantReadinessChecklist from "../components/GrantReadinessChecklist.jsx";
import { ButtonLink, PageHeader, SectionHeader } from "../components/UI.jsx";

const guides = [
  {
    title: "Project summary template",
    body: "We are requesting funding for [project] because [need]. The project will serve [audience] by [impact]. Students will lead [tasks], with support from [teacher/club/nonprofit/association]."
  },
  {
    title: "Budget planning guide",
    body: "List every supply, registration, technology, travel, or event cost. Use exact item names and realistic prices. Separate must-have items from stretch items."
  },
  {
    title: "Impact statement guide",
    body: "Explain who benefits, how many people are served, what changes because of the project, and how the team will measure results."
  },
  {
    title: "Timeline planner",
    body: "Include application date, award notification, ordering, project work days, event date, reflection, reporting, and thank-you notes."
  },
  {
    title: "Required documents checklist",
    body: "Common requests include sponsor letter, school approval, nonprofit tax status, budget, project photos, team roster, and reporting plan."
  },
  {
    title: "Common grant terms",
    body: "Eligibility means who can apply. Match means money or support the applicant contributes. Fiscal sponsor means an eligible organization manages funds."
  },
  {
    title: "Mistakes to avoid",
    body: "Do not miss the deadline, ignore eligibility, request vague supplies, promise impossible outcomes, or submit without sponsor approval."
  },
  {
    title: "Mini proposal outline",
    body: "Need, project idea, student role, sponsor role, budget, timeline, impact, accessibility/inclusion, and how results will be shared."
  }
];

export default function GrantToolkitPage() {
  return (
    <>
      <PageHeader
        tone="gold"
        eyebrow="Grant readiness toolkit"
        title="Prepare stronger school, club, and community funding requests."
        description="A practical guide for students, teachers, TSA chapters, robotics teams, art groups, service clubs, associations, nonprofits, and youth organizations."
      >
        <ButtonLink to="/funding/finder" variant="gold" icon="Sparkles">Find matching opportunities</ButtonLink>
      </PageHeader>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <GrantReadinessChecklist />
        <div>
          <SectionHeader title="Toolkit sections" description="General guidance only. It helps teams prepare; it does not promise funding." />
          <div className="grid gap-4">
            {guides.map((guide) => (
              <article key={guide.title} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black">{guide.title}</h2>
                <p className="mt-2 leading-7 text-ink/70">{guide.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
