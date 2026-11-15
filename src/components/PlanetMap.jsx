import React from "react";
import { Crosshair, AlertTriangle } from "lucide-react";

/**
 * Planetary position map.
 *
 * There is no tiled planetary basemap available offline, so this is a
 * deliberately schematic plot: every marker is placed from the latitude and
 * longitude recorded in the dataset, and the viewport fits the region that
 * actually contains those records (with the real graticule shown, so the
 * reader can see how tight the fit is). The interface says plainly that it is a
 * plot, not a photographic map. Approximate positions are drawn differently
 * from surveyed ones.
 */
const W = 1000;
const H = 500;

const TINT = {
  Moon: { base: "#0f1624", edge: "#1c2537", accent: "#cdd6e6", line: "rgba(205,214,230,0.14)", dot: "#6fd6ff" },
  Mars: { base: "#1a1114", edge: "#2b1b1d", accent: "#e0805a", line: "rgba(224,128,90,0.16)", dot: "#e0805a" },
};

// Longitudes are published in different conventions (e.g. 354.47°E = 5.53°W).
// Normalise to −180…180 before projecting so every marker lands correctly.
const norm = (lon) => ((lon + 180) % 360 + 360) % 360 - 180;

function fitView(items) {
  const lats = items.map((a) => a.location.latitude);
  const lons = items.map((a) => norm(a.location.longitude));
  let lat0 = Math.min(...lats), lat1 = Math.max(...lats);
  let lon0 = Math.min(...lons), lon1 = Math.max(...lons);
  // minimum span so a single site does not fill the frame
  const minLat = 16, minLon = 26;
  if (lat1 - lat0 < minLat) { const c = (lat0 + lat1) / 2; lat0 = c - minLat / 2; lat1 = c + minLat / 2; }
  if (lon1 - lon0 < minLon) { const c = (lon0 + lon1) / 2; lon0 = c - minLon / 2; lon1 = c + minLon / 2; }
  // padding
  const padLat = (lat1 - lat0) * 0.18, padLon = (lon1 - lon0) * 0.18;
  lat0 -= padLat; lat1 += padLat; lon0 -= padLon; lon1 += padLon;
  lat0 = Math.max(-90, lat0); lat1 = Math.min(90, lat1);
  lon0 = Math.max(-180, lon0); lon1 = Math.min(180, lon1);
  return { lat0, lat1, lon0, lon1 };
}

const ticks = (lo, hi) => {
  const span = hi - lo;
  const step = span > 180 ? 60 : span > 90 ? 30 : span > 40 ? 10 : 5;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(v);
  return out;
};

export default function PlanetMap({ planet, items, selectedId, onSelect }) {
  const tint = TINT[planet] || TINT.Moon;
  const mapped = items.filter((a) => a.location.latitude !== null && a.location.longitude !== null);
  const view = React.useMemo(() => (mapped.length ? fitView(mapped) : { lat0: -30, lat1: 30, lon0: -60, lon1: 60 }), [mapped.length, planet]);

  const x = (lon) => ((norm(lon) - view.lon0) / (view.lon1 - view.lon0)) * W;
  const y = (lat) => ((view.lat1 - lat) / (view.lat1 - view.lat0)) * H;

  // Records that share an identical published position (for example the Apollo
  // 11 descent stage and its experiment package, 16.8 m apart) are drawn with a
  // small offset and a leader line back to the true point, so both stay clickable.
  const placed = React.useMemo(() => {
    const seen = new Map();
    return mapped.map((a) => {
      const key = `${a.location.latitude},${a.location.longitude}`;
      const n = seen.get(key) || 0;
      seen.set(key, n + 1);
      const angle = (-Math.PI / 2) + n * (Math.PI / 3);
      const r = n === 0 ? 0 : 26;
      return { a, dx: Math.cos(angle) * r, dy: Math.sin(angle) * r, offset: n > 0 };
    });
  }, [mapped.length, planet]);

  return (
    <div className="map-canvas">
      <svg
        className="map-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Schematic ${planet} map showing ${mapped.length} artifact locations between ${Math.round(view.lat0)} and ${Math.round(view.lat1)} degrees latitude`}
      >
        <defs>
          <radialGradient id={`bg-${planet}`} cx="50%" cy="35%" r="85%">
            <stop offset="0%" stopColor={tint.edge} />
            <stop offset="100%" stopColor={tint.base} />
          </radialGradient>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
          </filter>
          <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill={`url(#bg-${planet})`} />
        <rect width={W} height={H} filter="url(#grain)" opacity="0.5" />

        {/* graticule at the real degrees in view */}
        <g stroke={tint.line} strokeWidth="1">
          {ticks(view.lon0, view.lon1).map((lon) => (
            <line key={`v${lon}`} x1={x(lon)} y1="0" x2={x(lon)} y2={H} strokeDasharray={lon === 0 ? "0" : "3 7"} />
          ))}
          {ticks(view.lat0, view.lat1).map((lat) => (
            <line key={`h${lat}`} x1="0" y1={y(lat)} x2={W} y2={y(lat)} strokeDasharray={lat === 0 ? "0" : "3 7"} />
          ))}
        </g>

        <g fill={tint.accent} opacity="0.5" fontSize="11" fontFamily="ui-monospace, monospace">
          {ticks(view.lon0, view.lon1).map((lon) => (
            <text key={`lx${lon}`} x={x(lon) + 5} y={H - 8}>{lon}°</text>
          ))}
          {ticks(view.lat0, view.lat1).map((lat) => (
            <text key={`ly${lat}`} x="8" y={y(lat) - 6}>{lat}°</text>
          ))}
        </g>
        <text x={W - 8} y={H - 8} textAnchor="end" fill={tint.accent} opacity="0.42" fontSize="10.5" fontFamily="ui-monospace, monospace">
          {planet === "Moon" ? "SELENOGRAPHIC °E" : "AEROCENTRIC °E"}
        </text>

        {/* short mission labels, one per mission, derived from the records */}
        <g fill={tint.accent} opacity="0.42" fontSize="10.5" fontFamily="ui-monospace, monospace">
          {Object.entries(
            mapped.reduce((acc, a) => {
              const key = a.mission_id;
              if (!acc[key]) {
                acc[key] = {
                  label: a.missionName.split(" — ").pop().split(" / ")[0],
                  xs: [],
                  ys: [],
                };
              }
              acc[key].xs.push(x(a.location.longitude));
              acc[key].ys.push(y(a.location.latitude));
              return acc;
            }, {})
          ).map(([key, g]) => {
            const lx = g.xs.reduce((p2, v) => p2 + v, 0) / g.xs.length;
            const ly = g.ys.reduce((p2, v) => p2 + v, 0) / g.ys.length;
            const right = lx < W * 0.75;
            return (
              <text key={key} x={right ? lx + 13 : lx - 13} y={ly - 10} textAnchor={right ? "start" : "end"}>
                {g.label}
              </text>
            );
          })}
        </g>

        {placed.map(({ a, dx, dy, offset }) => {
          const ax = x(a.location.longitude);
          const ay = y(a.location.latitude);
          const cx = Math.min(Math.max(ax + dx, 18), W - 18);
          const cy = Math.min(Math.max(ay + dy, 18), H - 18);
          const sel = a.id === selectedId;
          const labelRight = cx < W * 0.7;
          const approx = a.location.accuracy !== "exact";
          const color = tint.dot;
          return (
            <g
              key={a.id}
              className={`map-marker${sel ? " sel" : ""}`}
              onClick={() => onSelect(a.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(a.id); } }}
              aria-label={`${a.name}, ${a.location.region}, ${a.location.accuracy} position`}
            >
              <title>{`${a.name} — ${a.location.region} (${a.location.accuracy.replace("_", " ")} position)`}</title>
              {offset && <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={color} strokeWidth="1" opacity="0.55" />}
              {sel && <circle cx={cx} cy={cy} r="20" fill={color} opacity="0.14" />}
              <circle cx={cx} cy={cy} r="13" fill={color} opacity="0.12" />
              <circle
                className="core"
                cx={cx}
                cy={cy}
                r="6"
                fill={approx ? "none" : color}
                stroke={color}
                strokeWidth={approx ? 2 : 1.5}
                strokeDasharray={approx ? "2 2" : "0"}
                filter={sel ? "url(#glow)" : undefined}
              />
              <text
                x={labelRight ? cx + 13 : cx - 13}
                y={cy + 4}
                textAnchor={labelRight ? "start" : "end"}
                fill={sel ? "#ffffff" : "rgba(233,237,247,0.8)"}
                fontSize={sel ? 13 : 11.5}
                fontWeight={sel ? 600 : 400}
                style={{ pointerEvents: "none" }}
              >
                {sel ? (a.short_name.length > 32 ? a.short_name.slice(0, 31) + "…" : a.short_name) : ""}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="map-legend">
        <span><i className="legend-dot" style={{ background: tint.dot }} />Surveyed position</span>
        <span><i className="legend-dot" style={{ border: "1px dashed " + tint.dot, background: "transparent" }} />Approximate or site-level position</span>
        <span><Crosshair size={11} style={{ marginRight: 6, verticalAlign: "middle" }} />Viewport fitted to the records in view</span>
        <span>Co-located records are offset with a leader line</span>
        <span style={{ color: "var(--amber)" }}>
          <AlertTriangle size={11} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Schematic plot — not a photographic basemap
        </span>
      </div>
    </div>
  );
}
