import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { siteConfig } from "../data/siteConfig";
import AccessibilityToolbar from "./AccessibilityToolbar.jsx";
import Icon from "./Icon.jsx";

const navItems = [
  {
    label: "Resources",
    children: [
      { to: "/learning", label: "Learning Resources" },
      { to: "/support", label: "Student & Family Support" },
      { to: "/resources", label: "All Resources" },
      { to: "/finder", label: "Opportunity Finder" }
    ]
  },
  { to: "/students-families", label: "Students" },
  { to: "/clubs", label: "Clubs" },
  { to: "/volunteer", label: "Volunteering" },
  { to: "/funding", label: "Funding" },
  { to: "/events", label: "Events" },
  { to: "/map", label: "Map" },
  { to: "/tsa", label: "TSA" },
  { to: "/cte", label: "CTE" },
  { to: "/about", label: "About" }
];

function activeClass({ isActive }) {
  return `nav-link ${isActive ? "nav-link-active" : ""}`;
}

function DesktopNav() {
  return (
    <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex" aria-label="Primary navigation">
      <NavLink to="/" className={activeClass} end>
        Home
      </NavLink>
      {navItems.map((item) =>
        item.children ? (
          <div key={item.label} className="group relative">
            <button type="button" className="nav-link inline-flex items-center gap-1" aria-haspopup="true">
              {item.label}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full z-40 w-64 translate-y-2 rounded-lg border border-slateLine bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {item.children.map((child) => (
                <NavLink key={child.to} to={child.to} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm font-bold ${isActive ? "bg-civic text-harbor" : "text-ink/75 hover:bg-civic hover:text-ink"}`}>
                  {child.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : (
          <NavLink key={item.to} to={item.to} className={activeClass}>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
}

function MobileNav({ onClick }) {
  return (
    <nav className="grid gap-2" aria-label="Mobile navigation">
      <NavLink to="/" onClick={onClick} className={activeClass} end>
        Home
      </NavLink>
      {navItems.map((item) =>
        item.children ? (
          <div key={item.label} className="rounded-lg border border-slateLine bg-white p-2">
            <p className="px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-ink/55">{item.label}</p>
            {item.children.map((child) => (
              <NavLink key={child.to} to={child.to} onClick={onClick} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm font-bold ${isActive ? "bg-civic text-harbor" : "text-ink/75 hover:bg-civic"}`}>
                {child.label}
              </NavLink>
            ))}
          </div>
        ) : (
          <NavLink key={item.to} to={item.to} onClick={onClick} className={activeClass}>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-50 border-b border-slateLine/80 bg-paper/94 backdrop-blur-xl">
        <div className="cc-container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 rounded-md focus:outline focus:outline-2" aria-label="Community Compass home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-white shadow-sm">
              <Icon name="Compass" className="h-5 w-5" />
            </span>
            <span className="min-w-0 max-w-[190px] leading-tight">
              <span className="block truncate text-sm font-black sm:text-base">{siteConfig.siteName}</span>
              <span className="hidden truncate text-[0.66rem] font-bold uppercase tracking-[0.14em] text-harbor lg:block">
                Learning & Support Hub
              </span>
            </span>
          </Link>
          <DesktopNav />
          <div className="flex shrink-0 items-center gap-2">
            <AccessibilityToolbar compact />
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slateLine bg-white px-3 text-ink xl:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((current) => !current)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-slateLine bg-paper px-4 py-4 xl:hidden">
            <div className="mx-auto max-w-3xl">
              <MobileNav onClick={() => setOpen(false)} />
            </div>
          </div>
        ) : null}
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="border-t border-slateLine bg-ink text-white">
        <div className="cc-container grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-harbor">
                <Icon name="Compass" className="h-5 w-5" />
              </span>
              <p className="text-lg font-black">{siteConfig.siteName}</p>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/72">
              A student-built learning, support, club, volunteering, events, and funding navigator for families, schools, clubs, and community organizations.
            </p>
            <p className="mt-3 text-xs text-white/58">{siteConfig.emergencyDisclaimer}</p>
          </div>
          <div>
            <p className="font-bold">Explore</p>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link to="/learning" className="hover:text-white">Learning Resources</Link>
              <Link to="/support" className="hover:text-white">Student & Family Support</Link>
              <Link to="/clubs" className="hover:text-white">Clubs & Opportunities</Link>
              <Link to="/funding" className="hover:text-white">Funding & Grants</Link>
              <Link to="/events" className="hover:text-white">Events</Link>
            </div>
          </div>
          <div>
            <p className="font-bold">Project</p>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link to="/tsa" className="hover:text-white">TSA Chapter</Link>
              <Link to="/cte" className="hover:text-white">CTE Program</Link>
              <Link to="/about" className="hover:text-white">Credits & Citations</Link>
              <Link to="/suggest" className="hover:text-white">Suggest a Resource</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
