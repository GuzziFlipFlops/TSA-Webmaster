import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export function PageHeader({ eyebrow, title, description, children, tone = "default" }) {
  const toneClass = tone === "gold" ? "from-amber-50 to-white" : "from-teal-50 to-white";
  return (
    <section className={`border-b border-slateLine bg-gradient-to-br ${toneClass}`}>
      <div className="cc-container py-12 md:py-16">
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.2em] text-harbor">{eyebrow}</p> : null}
          <h1 className="mt-3 text-[clamp(2rem,5vw,3.75rem)] font-black leading-[1.04] text-ink">{title}</h1>
          {description ? <p className="mt-4 text-lg leading-8 text-ink/72">{description}</p> : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.2em] text-harbor">{eyebrow}</p> : null}
        <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-black leading-tight text-ink">{title}</h2>
        {description ? <p className="mt-3 leading-7 text-ink/68">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ButtonLink({ to, children, variant = "primary", icon, className = "" }) {
  const variants = {
    primary: "bg-harbor text-white hover:bg-teal-800",
    gold: "bg-honey text-white hover:bg-amber-700",
    dark: "bg-ink text-white hover:bg-slate-800",
    outline: "border border-slateLine bg-white text-ink hover:bg-civic"
  };
  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-black shadow-sm transition focus:outline focus:outline-2 ${variants[variant]} ${className}`}
    >
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
      {children}
    </Link>
  );
}

export function Badge({ children, color = "teal", className = "" }) {
  const colors = {
    teal: "bg-teal-50 text-teal-800 ring-teal-200",
    green: "bg-green-50 text-green-800 ring-green-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    red: "bg-rose-50 text-rose-800 ring-rose-200",
    blue: "bg-blue-50 text-blue-800 ring-blue-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    purple: "bg-purple-50 text-purple-800 ring-purple-200"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold leading-none ring-1 ${colors[color] ?? colors.teal} ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon = "SearchX", title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slateLine bg-white p-8 text-center shadow-sm">
      <Icon name={icon} className="mx-auto h-10 w-10 text-harbor" />
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-ink/65">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function InfoPanel({ icon = "Info", title, children, tone = "teal" }) {
  const tones = {
    teal: "border-teal-200 bg-teal-50 text-teal-950",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    red: "border-rose-200 bg-rose-50 text-rose-950",
    slate: "border-slateLine bg-white text-ink"
  };
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <div className="flex gap-3">
        <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-black">{title}</p>
          <div className="mt-1 text-sm leading-6 opacity-80">{children}</div>
        </div>
      </div>
    </div>
  );
}
