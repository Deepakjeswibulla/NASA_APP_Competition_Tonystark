import React from "react";
import { Menu, X, Github, ExternalLink } from "lucide-react";
import { stats } from "../utils/data";

const NAV = [
  { path: "/", label: "Home" },
  { path: "/explorer", label: "Relic Explorer" },
  { path: "/map", label: "Planetary Map" },
  { path: "/timeline", label: "Mission Timeline" },
  { path: "/legacy", label: "Science Legacy" },
  { path: "/compare", label: "Compare" },
  { path: "/about", label: "About & Sources" },
];

export function useRoute() {
  const [route, setRoute] = React.useState(() => window.location.hash.replace(/^#/, "") || "/");
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path;
}

export function Header({ route }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { setOpen(false); }, [route]);
  const current = (p) => (p === "/" ? route === "/" : route.startsWith(p));
  return (
    <header className="header">
      <div className="wrap header-inner">
        <a className="brand" href="#/" aria-label="SPACE RELICS home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-name">SPACE RELICS</span>
            <span className="brand-sub">The machines that stayed behind</span>
          </span>
        </a>
        <nav className={`nav${open ? " open" : ""}`} aria-label="Main navigation">
          {NAV.map((n) => (
            <a key={n.path} href={`#${n.path}`} className={current(n.path) ? "active" : ""} aria-current={current(n.path) ? "page" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle navigation">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <span className="brand-mark" aria-hidden="true" />
              <span className="brand-text">
                <span className="brand-name">SPACE RELICS</span>
                <span className="brand-sub">An archive of hardware left on other worlds</span>
              </span>
            </div>
            <p style={{ margin: 0, maxWidth: 420 }}>
              {stats.artifacts} curated artifacts on the Moon and Mars, each with its mission history, science
              contribution, present status and sources. Built for the NASA International Space Apps Challenge 2026.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              {NAV.slice(1, 5).map((n) => (
                <li key={n.path}><a href={`#${n.path}`}>{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Research</h4>
            <ul>
              <li><a href="#/about">Source bibliography</a></li>
              <li><a href="#/about">Methodology & limitations</a></li>
              <li>
                <a href="https://images.nasa.gov/" target="_blank" rel="noreferrer">
                  NASA Image Library <ExternalLink size={11} style={{ display: "inline", verticalAlign: "middle" }} />
                </a>
              </li>
              <li>
                <a href="https://science.nasa.gov/" target="_blank" rel="noreferrer">
                  NASA Science <ExternalLink size={11} style={{ display: "inline", verticalAlign: "middle" }} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="hairline" style={{ margin: "32px 0 20px" }} />
        <div className="row between" style={{ flexWrap: "wrap", gap: 12 }}>
          <span>Curated dataset · no live NASA API is used at runtime · imagery: NASA (public domain, credited per image)</span>
          <span className="mono" style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}>NASA SPACE APPS 2026</span>
        </div>
      </div>
    </footer>
  );
}
