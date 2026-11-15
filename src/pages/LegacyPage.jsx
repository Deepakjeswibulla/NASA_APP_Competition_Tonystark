import React from "react";
import { Atom, ArrowUpRight, Waves, Sun, CloudSun, Droplets, Route, Telescope, Timer } from "lucide-react";
import ArtifactCard from "../components/ArtifactCard";
import { themesWithArtifacts } from "../utils/data";

const ICONS = {
  "lunar-geology": Atom,
  seismology: Waves,
  "solar-cosmic": Sun,
  atmosphere: CloudSun,
  "water-habitability": Droplets,
  "surface-mobility": Route,
  astronomy: Telescope,
  "space-weathering": Timer,
};

export default function LegacyPage({ query }) {
  const [active, setActive] = React.useState(query.theme || themesWithArtifacts[0].id);
  const theme = themesWithArtifacts.find((t) => t.id === active) || themesWithArtifacts[0];

  return (
    <div className="wrap section-tight">
      <div style={{ maxWidth: 720, marginBottom: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Science legacy</div>
        <h1 className="h2" style={{ marginBottom: 10 }}>What the machines were for</h1>
        <p className="lede" style={{ margin: 0 }}>
          These artifacts are not memorabilia. Each one was an instrument, and the reason to keep its story is what it
          measured. {themesWithArtifacts.length} themes organise the archive by the science rather than by the hardware.
        </p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 34 }}>
        {themesWithArtifacts.map((t) => {
          const Icon = ICONS[t.id] || Atom;
          const isActive = t.id === theme.id;
          return (
            <button
              key={t.id}
              className="panel theme-card"
              onClick={() => setActive(t.id)}
              aria-pressed={isActive}
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderColor: isActive ? "rgba(111,214,255,0.5)" : undefined,
                background: isActive ? "rgba(111,214,255,0.07)" : undefined,
              }}
            >
              <div className="theme-icon"><Icon size={17} /></div>
              <div style={{ fontWeight: 550, fontSize: "0.98rem", color: "var(--ink)" }}>{t.name}</div>
              <div className="small muted" style={{ marginTop: "auto" }}>{t.artifacts.length} artifact{t.artifacts.length === 1 ? "" : "s"}</div>
            </button>
          );
        })}
      </div>

      <section className="panel panel-pad" style={{ marginBottom: 30 }}>
        <div className="row between wrap-gap" style={{ alignItems: "flex-start" }}>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{theme.short}</div>
            <h2 className="h2" style={{ fontSize: "1.9rem", marginBottom: 14 }}>{theme.name}</h2>
            <p className="lede" style={{ marginBottom: 14 }}>{theme.summary}</p>
            <p style={{ color: "var(--ink-2)", margin: 0, fontSize: "0.95rem" }}>{theme.long}</p>
          </div>
          <div className="panel panel-pad" style={{ minWidth: 190, background: "rgba(255,255,255,0.02)" }}>
            <div className="mono small muted" style={{ letterSpacing: "0.14em" }}>CONTRIBUTING</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 4 }}>
              {theme.artifacts.length}
            </div>
            <div className="small muted">artifact{theme.artifacts.length === 1 ? "" : "s"}</div>
          </div>
        </div>
      </section>

      <div className="row between" style={{ marginBottom: 18 }}>
        <h2 className="h3">Artifacts that contributed to this theme</h2>
        <span className="small muted">Attribution is per record, not per mission</span>
      </div>
      <div className="grid grid-3">
        {theme.artifacts.map((a) => <ArtifactCard artifact={a} key={a.id} />)}
      </div>

      <div className="panel panel-pad" style={{ marginTop: 34 }}>
        <div className="row" style={{ gap: 10, marginBottom: 10 }}>
          <ArrowUpRight size={15} style={{ color: "var(--cyan)" }} />
          <span className="eyebrow plain" style={{ color: "var(--ink-3)" }}>Editorial rule</span>
        </div>
        <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>
          A discovery is attributed to an artifact only when the sources support that attribution. Where a result came from
          a mission's broader instrument suite, or from laboratory analysis of returned samples, the record says so — the
          rover or lander is not credited with work it did not do.
        </p>
      </div>
    </div>
  );
}
