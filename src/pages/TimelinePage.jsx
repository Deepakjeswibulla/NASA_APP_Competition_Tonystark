import React from "react";
import { CalendarRange, ArrowUpRight, Filter } from "lucide-react";
import { PlanetChip, EmptyState } from "../components/ui";
import { timelineEvents, formatDate } from "../utils/data";

const TYPES = [
  { id: "all", label: "All events" },
  { id: "deployment", label: "Arrival / deployment" },
  { id: "science", label: "Science milestone" },
  { id: "end", label: "End of operations" },
  { id: "legacy", label: "Later recognition" },
];

export default function TimelinePage() {
  const [planet, setPlanet] = React.useState("all");
  const [type, setType] = React.useState("all");

  const events = React.useMemo(
    () => timelineEvents.filter((e) => (planet === "all" || e.planet === planet) && (type === "all" || e.type === type)),
    [planet, type]
  );

  const byYear = React.useMemo(() => {
    const groups = new Map();
    events.forEach((e) => {
      if (!groups.has(e.year)) groups.set(e.year, []);
      groups.get(e.year).push(e);
    });
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [events]);

  const decades = [...new Set(timelineEvents.map((e) => Math.floor(e.year / 10) * 10))].sort();

  return (
    <div className="wrap section-tight">
      <div style={{ maxWidth: 700, marginBottom: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Mission timeline</div>
        <h1 className="h2" style={{ marginBottom: 10 }}>Fifty-six years of hardware on other worlds</h1>
        <p className="lede" style={{ margin: 0 }}>
          Every dated event in the archive, from the first Surveyor landing in 1967 to the end of InSight in 2022.
          Arrival, science milestones and the end of operations are separate entries, because they are separate facts.
        </p>
      </div>

      <div className="panel panel-pad" style={{ marginBottom: 26 }}>
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">Planet</span>
            <div className="seg">
              {["all", "Moon", "Mars"].map((p) => (
                <button key={p} aria-pressed={planet === p} onClick={() => setPlanet(p)}>
                  {p === "all" ? "Both" : p}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Event type</span>
            <div className="seg">
              {TYPES.map((t) => (
                <button key={t.id} aria-pressed={type === t.id} onClick={() => setType(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className="filter-group" style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
            <span className="result-count"><Filter size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />{events.length} events</span>
          </div>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <span className="filter-label" style={{ alignSelf: "center" }}>Jump to</span>
          {decades.map((d) => (
            <a key={d} className="chip" href={`#year-${d}`} onClick={(e) => { e.preventDefault(); document.getElementById(`year-${d}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
              {d}s
            </a>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No events for this combination" body="Widen the filters to see the timeline." />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "minmax(0,1fr) 300px", alignItems: "start", gap: 34 }}>
          <div className="tl">
            {byYear.map(([year, list]) => (
              <div key={year} id={`year-${Math.floor(year / 10) * 10}`}>
                <div className="tl-year">{year}</div>
                {list.map((e, i) => (
                  <div className={`tl-item t-${e.type}`} key={`${e.artifactId}-${i}`}>
                    <div className="tl-date">{formatDate(e.date)} · {e.type}</div>
                    <div className="tl-title">{e.label}</div>
                    <div className="tl-detail">{e.detail}</div>
                    <a className="tl-link" href={`#/relic/${e.artifactId}`}>
                      {e.artifactName} <ArrowUpRight size={10} style={{ verticalAlign: "middle" }} />
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <aside className="panel panel-pad" style={{ position: "sticky", top: 88 }}>
            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <CalendarRange size={14} style={{ color: "var(--cyan)" }} />
              <span className="eyebrow plain" style={{ color: "var(--ink-3)" }}>How to read this</span>
            </div>
            <p className="small" style={{ color: "var(--ink-2)", marginTop: 0 }}>
              An artifact's operational life is not the length of its mission. A lander can outlive its primary mission by
              years, and a mission can end while its hardware keeps working — Apollo 11's laser retroreflector still returns
              data today.
            </p>
            <hr className="hairline" style={{ margin: "16px 0" }} />
            <div className="stack" style={{ gap: 8 }}>
              {[["deployment", "Arrival or deployment"], ["science", "Science milestone"], ["end", "End of operations"], ["legacy", "Later recognition"]].map(([k, l]) => (
                <div key={k} className="row small" style={{ gap: 9 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: k === "deployment" ? "var(--cyan)" : k === "science" ? "var(--amber)" : k === "end" ? "var(--bad)" : "var(--ok)", flexShrink: 0 }} />
                  <span className="muted">{l}</span>
                </div>
              ))}
            </div>
            <hr className="hairline" style={{ margin: "16px 0" }} />
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              <PlanetChip planet="Moon" />
              <PlanetChip planet="Mars" />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
