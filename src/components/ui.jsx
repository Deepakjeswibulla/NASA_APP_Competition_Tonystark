import React from "react";
import { ShieldCheck, ShieldAlert, ShieldQuestion, ExternalLink, ImageOff, Globe2 } from "lucide-react";
import { formatDate } from "../utils/data";

export function VerificationBadge({ status, small }) {
  const map = {
    verified: { cls: "badge-verified", Icon: ShieldCheck, label: "Verified" },
    "partially verified": { cls: "badge-partially", Icon: ShieldAlert, label: "Partially verified" },
    unverified: { cls: "badge-unverified", Icon: ShieldQuestion, label: "Unverified" },
  };
  const cfg = map[status] || map.unverified;
  const { Icon } = cfg;
  return (
    <span className={`badge ${cfg.cls}`} title={`Research status: ${status}`}>
      <Icon size={small ? 11 : 12} strokeWidth={2.2} />
      {cfg.label}
    </span>
  );
}

export function PlanetChip({ planet }) {
  const cls = planet === "Mars" ? "chip-planet-mars" : "chip-planet-moon";
  return (
    <span className={`chip ${cls}`}>
      <Globe2 size={11} strokeWidth={2.2} />
      {planet}
    </span>
  );
}

export function SectionHead({ eyebrow, title, lede, action, id }) {
  return (
    <div className="row between wrap-gap" style={{ alignItems: "flex-end", marginBottom: 30 }} id={id}>
      <div style={{ maxWidth: 720 }}>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>}
        <h2 className="h2">{title}</h2>
        {lede && <p className="lede" style={{ marginTop: 12, marginBottom: 0 }}>{lede}</p>}
      </div>
      {action}
    </div>
  );
}

/** Image with a graceful fallback when a file cannot load. */
export function MediaFigure({ media, className, ratio, priority }) {
  const [failed, setFailed] = React.useState(false);
  if (!media || failed || !media.url) {
    return (
      <div
        className={className}
        style={{
          display: "grid", placeItems: "center", gap: 8, background: "#0a0f19",
          border: "1px solid var(--line)", color: "var(--ink-3)", minHeight: 180, textAlign: "center", padding: 20,
        }}
      >
        <ImageOff size={22} />
        <span className="small">Image unavailable for this record</span>
      </div>
    );
  }
  return (
    <div className={className} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img
        src={media.url}
        alt={media.caption || media.title}
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function MediaNote({ media }) {
  if (!media) return null;
  const isIllustration = media.media_type === "illustration" || media.media_type === "diagram";
  return (
    <div className="small muted" style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <span className="chip" style={{ textTransform: "capitalize" }}>{media.media_type.replace("_", " ")}</span>
      <span>{media.credit} · {formatDate(media.date)}</span>
      <a className="source-link" href={media.source_url} target="_blank" rel="noreferrer" style={{ marginTop: 0 }}>
        {media.nasa_id} <ExternalLink size={11} />
      </a>
      {isIllustration && <span style={{ color: "var(--amber)" }}>Illustration — not a photograph</span>}
    </div>
  );
}

export function SourceList({ refs, compact }) {
  if (!refs?.length) return <p className="muted small">No sources recorded.</p>;
  return (
    <div>
      {refs.map((s) => (
        <div className="source-item" key={s.source_id}>
          <div className="row" style={{ gap: 8, alignItems: "baseline" }}>
            <span className="mono small" style={{ color: "var(--cyan)" }}>{s.source_id}</span>
            <span className="source-title">{s.title}</span>
          </div>
          <div className="source-meta">
            {s.organization}
            {s.publication_date && s.publication_date !== "n.d." ? ` · ${s.publication_date}` : ""} · accessed {s.accessed}
          </div>
          {!compact && (
            <div className="source-meta" style={{ color: "var(--ink-2)" }}>
              Supports: {s.supports.join("; ")}
            </div>
          )}
          <a className="source-link" href={s.url} target="_blank" rel="noreferrer">
            Open source <ExternalLink size={11} />
          </a>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="empty">
      <div className="empty-icon"><ImageOff size={20} /></div>
      <div style={{ fontWeight: 550, color: "var(--ink)" }}>{title}</div>
      {body && <div className="small" style={{ maxWidth: 420 }}>{body}</div>}
      {action}
    </div>
  );
}

export function SpecList({ rows }) {
  return (
    <div className="spec-list">
      {rows.filter(Boolean).map((r, i) => (
        <div className="spec-row" key={i}>
          <span className="spec-key">{r.label}</span>
          <span className="spec-val">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function NotFound({ what }) {
  return (
    <div className="wrap section">
      <EmptyState
        title={`${what} not found`}
        body="That record is not in the curated dataset. The archive contains only artifacts whose facts are supported by the sources listed in the bibliography."
        action={<a className="btn btn-primary" href="#/explorer">Back to the Relic Explorer</a>}
      />
    </div>
  );
}
