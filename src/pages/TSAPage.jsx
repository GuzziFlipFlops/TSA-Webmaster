import { PageHeader, SectionHeader, Badge } from "../components/UI.jsx";
import { tsaChapter } from "../data/communityData";

export default function TSAPage() {
  return (
    <>
      <PageHeader
        eyebrow="TSA chapter"
        title="Technology Student Association chapter portfolio"
        description="A polished chapter section showing leadership, service, competitions, projects, awards, and how this Webmaster project connects to real technical and civic work."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slateLine bg-white p-6 shadow-soft">
          <p className="text-lg leading-8 text-ink/72">{tsaChapter.overview}</p>
          <p className="mt-4 leading-7 text-ink/70">
            Community Compass gives the chapter a strong interview story: students researched local needs, structured data, built accessible React components, mapped physical learning/support resources, and added a funding navigator for TSA, robotics, STEM, art, service, and community-impact projects.
          </p>
        </div>
      </section>
      <section className="bg-white/72 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Officers" />
          <div className="grid gap-4 md:grid-cols-4">
            {tsaChapter.officers.map((officer) => (
              <article key={officer.name} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <h2 className="text-lg font-black">{officer.name}</h2>
                <p className="mt-1 font-bold text-harbor">{officer.role}</p>
                <p className="mt-3 text-sm leading-6 text-ink/65">{officer.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeader title="Competitions and service" />
          <div className="rounded-lg border border-slateLine bg-white p-5">
            <div className="flex flex-wrap gap-2">
              {tsaChapter.competitions.map((competition) => (
                <Badge key={competition} color="blue">{competition}</Badge>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {tsaChapter.serviceActivities.map((service) => (
                <Badge key={service} color="green">{service}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div>
          <SectionHeader title="Project showcase" />
          <div className="grid gap-4">
            {tsaChapter.projects.map((project) => (
              <article key={project.title} className="rounded-lg border border-slateLine bg-white p-5 shadow-sm">
                <h2 className="font-black">{project.title}</h2>
                <p className="mt-2 leading-7 text-ink/70">{project.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <SectionHeader
            title="Funding connection"
            description="The funding pillar helps a TSA chapter explain how teams can support engineering projects, robotics, web design, CAD/3D printing, electronics, travel, outreach displays, and community-impact prototypes through teacher, school, club, association, nonprofit, or sponsor pathways."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {["Robotics parts and registration", "3D printing and CAD materials", "Community-impact prototype supplies"].map((item) => (
              <div key={item} className="rounded-lg bg-white p-4 font-black shadow-sm">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
