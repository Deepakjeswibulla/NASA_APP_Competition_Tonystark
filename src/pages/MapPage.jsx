import React from "react";
import { ArrowUpRight, AlertTriangle, Crosshair, Globe2 } from "lucide-react";
import PlanetMap from "../components/PlanetMap";
import { PlanetChip, VerificationBadge, EmptyState } from "../components/ui";
import { artifacts, planets, getArtifact, formatDate } from "../utils/data";

export default function MapPage({ query }) {
  const focused = query.focus ? getArtifact(query.focus) : null;
  const [planet, setPlanet] = React.useState(
    focused ? focused.planet : query.planet === "Mars" ? "Mars" : "Moon"
  );
  const [selectedId, setSelectedId] = React.useState(focused ? focused.id : null);

  const items = artifacts.filter((a) => a.planet === planet);
  const selected = selectedId ? getArtifact(selectedId) : null;
  const planetInfo = planets.find((p) => p.id === planet);

  React.useEffect(() => {
    if (selectedId) {
      const el = document.getElementById("map-detail");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  return (
    <div className="wrap section-tight">
      <div className="row between wrap-gap" style={{ alignItems: "flex-end", marginBottom: 24 }}>
        <div style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Planetary map</div>
          <h1 className="h2" style={{ marginBottom: 10 }}>Where the hardware actually is</h1>
          <p className="lede" style={{ margin: 0 }}>
            Positions come from the coordinates published in each record. Surveyed positions are drawn as filled
            markers; approximate or site-level positions are drawn as dashed outlines.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {["Moon", "Mars"].map((p) => (
            <button key={p} className="planet-tab" aria-pressed={planet === p} onClick={() => { setPlanet(p); setSelectedId(null); }}>
              <Globe2 size={13} /> {p}
            </button>
          ))}
        </div>
      </div>

      <div className="map-shell">
        <div>
          <PlanetMap planet={planet} items={items} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="panel panel-pad" style={{ marginTop: 16 }}>
            <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
              <AlertTriangle size={15} style={{ color: "var(--amber)", marginTop: 3, flexShrink: 0 }} />
              <p className="small" style={{ margin: 0, color: "var(--ink-2)" }}>
                <strong style={{ color: "var(--ink)" }}>About this map.</strong> This is a schematic equirectangular plot, not a
                photographic basemap: no offline lunar or Martian basemap imagery is bundled with this build. The graticule,
                the coordinates and the region names are real; the surface shading is not. {planetInfo?.map_label}.
                {" "}{planetInfo?.context}
              </p>
            </div>
          </div>
        </div>

        <div className="map-side">
          <div className="panel panel-pad" id="map-detail">
            {selected ? (
              <>
                <div className="row between" style={{ marginBottom: 12 }}>
                  <PlanetChip planet={selected.planet} />
                  <VerificationBadge status={selected.verification.status} small />
                </div>
                <h3 className="h3" style={{ marginBottom: 8 }}>{selected.name}</h3>
                <p className="small" style={{ color: "var(--ink-2)", marginTop: 0 }}>{selected.location.site}</p>
                <div className="spec-list" style={{ marginBottom: 12 }}>
                  <div className="spec-row"><span className="spec-key">Region</span><span className="spec-val">{selected.location.region}</span></div>
                  <div className="spec-row"><span className="spec-key">Latitude</span><span className="spec-val">{selected.location.latitude}°</span></div>
                  <div className="spec-row"><span className="spec-key">Longitude</span><span className="spec-val">{selected.location.longitude}°</span></div>
                  <div className="spec-row"><span className="spec-key">Accuracy</span><span className="spec-val">{selected.location.accuracy.replace("_", " ")}</span></div>
                  <div className="spec-row"><span className="spec-key">Deployed</span><span className="spec-val">{formatDate(selected.deployment_date)}</span></div>
                </div>
                <p className="small muted" style={{ marginTop: 0 }}>{selected.location.map_note}</p>
                <a className="btn btn-primary btn-sm" href={`#/relic/${selected.id}`} style={{ marginTop: 6 }}>
                  Open the full record <ArrowUpRight size={14} />
                </a>
              </>
            ) : (
              <EmptyState
                title="Select a marker"
                body={`${items.length} ${planet} records are plotted on this map. Click a marker or pick one from the list below.`}
              />
            )}
          </div>

          <div className="panel panel-pad">
            <div className="row between" style={{ marginBottom: 12 }}>
              <span className="eyebrow plain" style={{ color: "var(--ink-3)" }}>{planet} records</span>
              <span className="mono small muted">{items.length}</span>
            </div>
            <div className="map-list">
              {items.map((a) => (
                <button key={a.id} aria-current={a.id === selectedId} onClick={() => setSelectedId(a.id)}>
                  <span style={{ display: "block", color: "inherit" }}>{a.short_name}</span>
                  <span className="small muted" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Crosshair size={10} /> {a.location.latitude}°, {a.location.longitude}° · {a.location.accuracy.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
