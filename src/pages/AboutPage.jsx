import React from "react";
import { ExternalLink, ShieldCheck, Database, Image as ImageIcon, AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { artifacts, sources, stats, verificationCounts, meta, themes } from "../utils/data";

const allMedia = artifacts.flatMap((a) => a.media.map((m) => ({ ...m, artifact: a.name })));

export default function AboutPage() {
  return (
    <div className="wrap section-tight">
      <div style={{ maxWidth: 760, marginBottom: 34 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>About this project</div>
        <h1 className="h2" style={{ marginBottom: 12 }}>An archive built to be checked</h1>
        <p className="lede" style={{ margin: 0 }}>
          SPACE RELICS was built for the NASA International Space Apps Challenge 2026, for the challenge
          <em> “Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.”</em>
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 34 }}>
        <div className="panel panel-pad">
          <div className="theme-icon" style={{ marginBottom: 14 }}><BookOpen size={17} /></div>
          <h2 className="h3" style={{ marginBottom: 10 }}>The problem we set out to solve</h2>
          <p className="small" style={{ color: "var(--ink-2)", marginTop: 0 }}>
            Space hardware is usually presented as a catalogue: a name, a date, a photograph. But every object left on
            another world is the residue of a decision — a descent stage that had to work once, a seismometer that had to
            work for years, a rover that was never designed to survive its first winter and survived six. The interesting
            question is not what the object is, but what it did and what happened to it afterwards.
          </p>
          <p className="small" style={{ color: "var(--ink-2)", marginBottom: 0 }}>
            The archive therefore leads with consequence: purpose, journey, service, science, ending, and present state —
            with the technical detail kept available in an "at a glance" panel rather than in the foreground.
          </p>
        </div>
        <div className="panel panel-pad">
          <div className="theme-icon" style={{ marginBottom: 14 }}><Database size={17} /></div>
          <h2 className="h3" style={{ marginBottom: 10 }}>What is curated, and what is live</h2>
          <p className="small" style={{ color: "var(--ink-2)", marginTop: 0 }}>
            Everything you see is served from a <strong style={{ color: "var(--ink)" }}>curated local dataset</strong> of
            {" "}{stats.artifacts} artifact records, {stats.missions} missions, {themes.length} science themes and {stats.sources} cited sources,
            compiled by hand from NASA mission pages, NASA technical reports and peer-reviewed papers.
          </p>
          <p className="small" style={{ color: "var(--ink-2)", marginBottom: 0 }}>
            No live NASA API is called at runtime, and the application makes no claim to real-time data. Imagery is
            downloaded from the NASA Image and Video Library and bundled with the build, so the site works offline and no
            image can silently disappear. Dataset version {meta.dataset_version}, compiled {meta.generated}.
          </p>
        </div>
      </div>

      <section className="panel panel-pad" style={{ marginBottom: 34 }}>
        <h2 className="h3" style={{ marginBottom: 14 }}>Research methodology</h2>
        <div className="grid grid-2" style={{ gap: 26 }}>
          <ol className="small" style={{ color: "var(--ink-2)", margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Identify a candidate artifact and confirm that hardware was genuinely left on the surface.</li>
            <li>Search NASA mission pages, NSSDC catalogues, NASA technical reports and peer-reviewed papers.</li>
            <li>Read the source, extract only supported facts, and record the URL, the claim it supports and how much of the source was read.</li>
            <li>Cross-check critical facts — dates, coordinates, distances — against a second source.</li>
            <li>Record any disagreement between sources instead of silently picking one value.</li>
            <li>Assign a verification status, write the record, and validate the dataset programmatically.</li>
          </ol>
          <div>
            <div className="row" style={{ gap: 10, marginBottom: 12 }}>
              <ShieldCheck size={15} style={{ color: "var(--cyan)" }} />
              <span className="eyebrow plain" style={{ color: "var(--ink-3)" }}>Verification states</span>
            </div>
            <div className="stack" style={{ gap: 12 }}>
              {[
                ["verified", verificationCounts.verified, "Important claims supported by reliable sources; coordinates cross-checked."],
                ["partially verified", verificationCounts["partially verified"], "Something material is still uncertain — a coordinate set, an odometry figure, a final position."],
                ["unverified", verificationCounts.unverified, "Not published as fact; the record says what is missing."],
              ].map(([k, n, d]) => (
                <div key={k} className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                  <span className="mono small" style={{ color: "var(--cyan)", minWidth: 18 }}>{n}</span>
                  <div>
                    <div className="small" style={{ color: "var(--ink)", textTransform: "capitalize" }}>{k}</div>
                    <div className="small muted">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 34 }}>
        <div className="row" style={{ gap: 10, marginBottom: 16 }}>
          <AlertTriangle size={15} style={{ color: "var(--amber)" }} />
          <h2 className="h3">Known limitations</h2>
        </div>
        <div className="grid grid-2">
          {[
            ["No photographic planetary basemap", "The map is a schematic equirectangular plot. Positions are accurate to the coordinates in each record, but the surface shading is not imagery."],
            ["Site-level markers for four records", "Where a final position is not published (Sojourner, Spirit, Opportunity, the Apollo 16 camera), the marker shows the landing site and the interface says so."],
            ["Coordinate disagreement is preserved", "Mars Pathfinder and Viking 1 each have more than one published coordinate set. The archive shows the discrepancy rather than resolving it."],
            ["Odometer versus mapped distance", "Apollo 17's rover odometer reads about 35.7 km; a 2019 photogrammetric reconstruction gives about 31.2 km of ground path. Both figures are recorded."],
            ["Curated, not exhaustive", `${stats.artifacts} artifacts out of the hundreds of human-made objects on the Moon and Mars. Records were selected for documentation quality, not for completeness.`],
            ["Source reading depth", "Each source records whether it was read in full or through a retrieved excerpt. Nothing is marked verified merely because a URL resolves."],
          ].map(([t, d]) => (
            <div className="panel panel-pad" key={t}>
              <div className="small" style={{ color: "var(--ink)", fontWeight: 550, marginBottom: 6 }}>{t}</div>
              <div className="small muted">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel panel-pad" style={{ marginBottom: 34 }}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="row" style={{ gap: 10 }}>
            <ImageIcon size={15} style={{ color: "var(--cyan)" }} />
            <h2 className="h3">Image attribution</h2>
          </div>
          <span className="small muted">All imagery: NASA (public domain unless noted)</span>
        </div>
        <div className="scroll-x">
          <table className="compare-table">
            <thead>
              <tr><th scope="col">ID</th><th scope="col">Title</th><th scope="col">Credit</th><th scope="col">Used for</th></tr>
            </thead>
            <tbody>
              {allMedia.map((m) => (
                <tr key={m.nasa_id + m.artifact}>
                  <td className="mono small">
                    <a className="source-link" href={m.source_url} target="_blank" rel="noreferrer" style={{ marginTop: 0 }}>
                      {m.nasa_id} <ExternalLink size={10} />
                    </a>
                  </td>
                  <td>{m.title}</td>
                  <td className="small muted">{m.credit}</td>
                  <td className="small muted">{m.artifact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ marginBottom: 0, marginTop: 12 }}>
          Illustrations are labelled as illustrations wherever they appear. No image is presented as a photograph of an
          object it does not show.
        </p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <div className="row between" style={{ marginBottom: 16 }}>
          <div className="row" style={{ gap: 10 }}>
            <BookOpen size={15} style={{ color: "var(--cyan)" }} />
            <h2 className="h3">Source bibliography</h2>
          </div>
          <span className="small muted">{sources.length} sources · accessed {sources[0].accessed}</span>
        </div>
        <div className="panel panel-pad">
          {sources.map((s) => (
            <div className="source-item" key={s.source_id}>
              <div className="row" style={{ gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <span className="mono small" style={{ color: "var(--cyan)" }}>{s.source_id}</span>
                <span className="source-title">{s.title}</span>
                <span className="chip" style={{ fontSize: "0.68rem" }}>{s.source_type}</span>
                <span className="chip" style={{ fontSize: "0.68rem" }}>
                  <CheckCircle2 size={10} style={{ marginRight: 4 }} />
                  {s.read_level === "full_text" ? "read in full" : "excerpt reviewed"}
                </span>
              </div>
              <div className="source-meta">{s.organization}{s.publication_date && s.publication_date !== "n.d." ? ` · ${s.publication_date}` : ""} · accessed {s.accessed}</div>
              <div className="source-meta" style={{ color: "var(--ink-2)" }}>Supports: {s.supports.join("; ")}</div>
              {s.notes && <div className="source-meta" style={{ color: "var(--ink-2)" }}>{s.notes}</div>}
              <a className="source-link" href={s.url} target="_blank" rel="noreferrer">Open source <ExternalLink size={11} /></a>
            </div>
          ))}
        </div>
      </section>

      <p className="small muted" style={{ marginTop: 24 }}>
        Built with React and Vite. No tracking, no accounts, no backend. The dataset and the validation script are part of
        the project, so any figure on this site can be traced back to a record and from there to a source.
      </p>
    </div>
  );
}
