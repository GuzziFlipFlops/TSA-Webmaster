import { PageHeader, SectionHeader, Badge } from "../components/UI.jsx";
import { cteProgram } from "../data/communityData";

export default function CTEPage() {
  return (
    <>
      <PageHeader
        eyebrow="CTE / engineering program"
        title="Career and technical education behind the build"
        description="This section satisfies Webmaster expectations while showing how classroom skills become a real civic-tech product."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slateLine bg-white p-6 shadow-soft">
          <p className="text-lg leading-8 text-ink/72">{cteProgram.overview}</p>
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Courses and skills" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {cteProgram.courses.map((course) => (
              <article key={course.title} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <h2 className="font-black">{course.title}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.skills.map((skill) => (
                    <Badge key={skill} color="blue">{skill}</Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeader title="Labs and equipment" />
          <div className="grid gap-3">
            {cteProgram.labs.map((lab) => (
              <div key={lab} className="rounded-lg border border-slateLine bg-white p-4 font-black shadow-sm">{lab}</div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader title="Student projects" />
          <div className="grid gap-3">
            {cteProgram.projects.map((project) => (
              <div key={project} className="rounded-lg border border-slateLine bg-white p-4 font-black shadow-sm">{project}</div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Career pathways" description="The site connects learning spaces, CTE skills, clubs, and funding to real student futures." />
          <div className="grid gap-5 md:grid-cols-3">
            {cteProgram.pathways.map((pathway) => (
              <article key={pathway.title} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <h2 className="font-black">{pathway.title}</h2>
                <ul className="mt-3 grid gap-2 text-sm text-ink/70">
                  {pathway.careers.map((career) => (
                    <li key={career}>{career}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <SectionHeader title="How TSA and funding connect to CTE" />
          <div className="grid gap-3 md:grid-cols-2">
            {cteProgram.tsaConnections.map((connection) => (
              <div key={connection} className="rounded-lg bg-white p-4 font-bold leading-7 shadow-sm">{connection}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
