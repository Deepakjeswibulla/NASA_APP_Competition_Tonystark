import React from "react";
import { ArrowRight, GitCompare, RefreshCw } from "lucide-react";
import { artifacts, getArtifact, formatDate } from "../utils/data";
import { MediaFigure, VerificationBadge } from "../components/ui";

const ROWS = [
  { key: "planet", label: "Planet", get: (a) => a.planet },
  { key: "mission", label: "Mission", get: (a) => a.missionName },
  { key: "category", label: "Equipment type", get: (a) => a.categoryLabel },
  { key: "deployed", label: "Left on the surface", get: (a) => (a.deployment_date ? formatDate(a.deployment_date) : "Not established") },
  { key: "purpose", label: "Purpose", get: (a) => a.original_purpose },
  { key: "ops", label: "Operational history", get: (a) => a.operational_lifetime || "Not established" },
  { key: "science", label: "Scientific contribution", get: (a) => a.scientific_contribution.map((c) => c.title).join("; ") },
  { key: "status", label: "Physical status", get: (a) => a.statusLabel },
  { key: "final", label: "Present condition", get: (a) => a.final_status },
  { key: "region", label: "Location", get: (a) => `${a.location.region} — ${a.location.site}` },
  { key: "verification", label: "Research status", get: (a) => a.verification.status },
];

export default function ComparePage({ query }) {
  const [leftId, setLeftId] = React.useState(query.a || "apollo-15-lrv");
  const [rightId, setRightId] = React.useState(query.b || "opportunity-rover");
  const left = getArtifact(leftId) || artifacts[0];
  const right = getArtifact(rightId) || artifacts[1] || artifacts[0];

  const swap = () => { setLeftId(rightId); setRightId(leftId); };

  return (
    <div className="wrap section-tight">
      <div style={{ maxWidth: 700, marginBottom: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Compare artifacts</div>
        <h1 className="h2" style={{ marginBottom: 10 }}>Two machines, side by side</h1>
        <p className="lede" style={{ margin: 0 }}>
          Pick any two records. Every row is pulled from the same dataset that powers the explorer, the map and the
          timeline — a correction in the data appears here too.
        </p>
      </div>

      <div className="compare-grid" style={{ marginBottom: 22 }}>
        {[{ id: leftId, set: setLeftId, rec: left, tag: "Artifact A" }, { id: rightId, set: setRightId, rec: right, tag: "Artifact B" }].map((side) => (
          <div className="panel panel-pad" key={side.tag}>
            <div className="compare-select">
              <span className="filter-label">{side.tag}</span>
              <select className="select" value={side.id} onChange={(e) => side.set(e.target.value)} aria-label={`Choose ${side.tag}`}>
                {artifacts.map((a) => (
                  <option key={a.id} value={a.id}>{a.planet} — {a.name}</option>
                ))}
              </select>
            </div>
            <div className="compare-head-img" style={{ marginTop: 14 }}>
              <MediaFigure media={side.rec.primaryMedia} />
            </div>
            <div style={{ marginTop: 12 }}>
              <a href={`#/relic/${side.rec.id}`} style={{ fontWeight: 550, display: "block" }}>{side.rec.name}</a>
              <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <VerificationBadge status={side.rec.verification.status} small />
                <span className="small muted">{side.rec.missionName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row between" style={{ marginBottom: 14 }}>
        <span className="small muted row" style={{ gap: 8 }}><GitCompare size={13} /> Rows that differ are highlighted</span>
        <button className="btn btn-sm" onClick={swap}><RefreshCw size={13} /> Swap sides</button>
      </div>

      <div className="panel scroll-x">
        <table className="compare-table">
          <tbody>
            {ROWS.map((r) => {
              const l = r.get(left);
              const rt = r.get(right);
              const differs = String(l) !== String(rt);
              return (
                <tr key={r.key}>
                  <th scope="row">{r.label}</th>
                  <td className={differs ? "diff" : ""}>{l}</td>
                  <td className={differs ? "diff" : ""}>{rt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <a className="btn btn-sm" href={`#/relic/${left.id}`}>Open {left.short_name} <ArrowRight size={13} /></a>
        <a className="btn btn-sm" href={`#/relic/${right.id}`}>Open {right.short_name} <ArrowRight size={13} /></a>
      </div>
    </div>
  );
}
