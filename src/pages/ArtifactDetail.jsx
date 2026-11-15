import React from "react";
import { ArrowLeft, MapPin, Crosshair, Info, AlertTriangle, ArrowUpRight, CheckCircle2, Sparkles, Clock } from "lucide-react";
import { VerificationBadge, PlanetChip, SourceList, SpecList, MediaFigure, MediaNote, NotFound } from "../components/ui";
import ArtifactCard from "../components/ArtifactCard";
import { getArtifact, formatDate, relatedArtifacts, themes } from "../utils/data";

function StoryBlock({ n, title, children }) {
  return (
    <section className="story-block">
      <div className="story-num">{n}</div>
      <h2 className="story-title">{title}</h2>
      <div className="prose">{children}</div>
    </section>
  );
}

export default function ArtifactDetail({ id }) {
  const a = getArtifact(id);
  if (!a) return <NotFound what="Artifact" />;
  const related = relatedArtifacts(a);
  const themeNames = a.themeRefs.map((t) => t.name);

  return (
    <>
      <section className="detail-hero">
        {a.primaryMedia?.url && <img src={a.primaryMedia.url} alt={a.primaryMedia.caption} />}
        <div className="wrap">
          <div className="detail-hero-inner">
            <a href="#/explorer" className="btn btn-sm btn-ghost" style={{ marginBottom: 22 }}>
              <ArrowLeft size={14} /> All records
            </a>
            <div className="detail-tags">
              <PlanetChip planet={a.planet} />
              <span className="chip">{a.missionName}</span>
              <span className="chip">{a.categoryLabel}</span>
              <span className="chip">{a.statusLabel}</span>
            </div>
            <h1 className="detail-title">{a.name}</h1>
            <div className="row" style={{ gap: 14, marginTop: 18, flexWrap: "wrap" }}>
              <VerificationBadge status={a.verification.status} />
              <span className="small muted row" style={{ gap: 6 }}>
                <MapPin size={12} /> {a.location.region}
              </span>
              {a.deployment_date && (
                <span className="small muted row" style={{ gap: 6 }}>
                  <Clock size={12} /> Deployed {formatDate(a.deployment_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 44, paddingBottom: 20 }}>
        <div className="detail-grid">
          {/* ---------------- main column ---------------- */}
          <div>
            <StoryBlock n="01 — ORIGINAL PURPOSE" title="What it was built to do">
              <p>{a.original_purpose}</p>
            </StoryBlock>

            <StoryBlock n="02 — THE JOURNEY" title="How it reached the surface">
              <p>{a.mission_story}</p>
            </StoryBlock>

            <StoryBlock n="03 — IN SERVICE" title="Its role during the mission">
              <p>{a.operational_history}</p>
            </StoryBlock>

            <StoryBlock n="04 — SCIENCE" title="What it established">
              <div style={{ marginTop: 4 }}>
                {a.scientific_contribution.map((c, i) => (
                  <div className="contribution" key={i}>
                    <div className="contribution-icon"><Sparkles size={14} /></div>
                    <div>
                      <div style={{ fontWeight: 550, color: "var(--ink)", fontSize: "0.98rem" }}>{c.title}</div>
                      <p style={{ margin: "5px 0 0", color: "var(--ink-2)", fontSize: "0.92rem" }}>{c.text}</p>
                      {themes.find((t) => t.id === c.theme_id) && (
                        <a href={`#/legacy?theme=${c.theme_id}`} className="source-link" style={{ marginTop: 6 }}>
                          Theme: {themes.find((t) => t.id === c.theme_id).name} <ArrowUpRight size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </StoryBlock>

            <StoryBlock n="05 — AFTER THE MISSION" title="What happened next, and what it is doing now">
              <p>{a.final_status}</p>
              <div className="callout" style={{ marginTop: 16 }}>
                <strong>Present physical status:</strong> {a.statusLabel}
                {a.physical_status === "still_partly_operational" && " — some elements of this hardware are still in use today."}
                {a.physical_status === "partially_retrieved" && " — components were removed and returned to Earth; the rest remains in place."}
              </div>
            </StoryBlock>

            <StoryBlock n="06 — WHY IT MATTERS" title="Why this artifact is still relevant">
              <p>{a.why_it_matters}</p>
              {themeNames.length > 0 && (
                <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {a.themeRefs.map((t) => (
                    <a key={t.id} className="chip" href={`#/legacy?theme=${t.id}`}>{t.short}</a>
                  ))}
                </div>
              )}
            </StoryBlock>

            <section className="story-block">
              <div className="story-num">07 — VERIFIED TIMELINE</div>
              <h2 className="story-title">Dates from the mission record</h2>
              <div className="tl" style={{ marginTop: 8 }}>
                {a.timeline.map((e, i) => (
                  <div className={`tl-item t-${e.type}`} key={i}>
                    <div className="tl-date">{formatDate(e.date)}</div>
                    <div className="tl-title">{e.label}</div>
                    <div className="tl-detail">{e.detail}</div>
                  </div>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: 8 }}>
                Dates are mission events. The date of arrival is not the date the mission ended, and neither is
                automatically the date the artifact stopped working.
              </p>
            </section>

            <section className="story-block">
              <div className="story-num">08 — SOURCES</div>
              <h2 className="story-title">Where these facts come from</h2>
              <SourceList refs={a.sourceRefs} />
            </section>
          </div>

          {/* ---------------- sidebar ---------------- */}
          <aside className="stack" style={{ gap: 18 }}>
            <div className="panel panel-pad">
              <div className="eyebrow plain" style={{ marginBottom: 12, color: "var(--ink-3)" }}>At a glance</div>
              <SpecList
                rows={[
                  { label: "Mission", value: a.missionName },
                  { label: "Planet", value: a.planet },
                  { label: "Category", value: a.categoryLabel },
                  { label: "Left behind", value: a.deployment_date ? formatDate(a.deployment_date) : "Not established" },
                  { label: "Operational life", value: a.operational_lifetime || "Not established" },
                  { label: "Physical status", value: a.statusLabel },
                ]}
              />
            </div>

            <div className="panel panel-pad">
              <div className="row between" style={{ marginBottom: 12 }}>
                <span className="eyebrow plain" style={{ color: "var(--ink-3)" }}>Location</span>
                <a className="source-link" href={`#/map?focus=${a.id}`} style={{ marginTop: 0 }}>
                  On the map <Crosshair size={11} />
                </a>
              </div>
              <SpecList
                rows={[
                  { label: "Region", value: a.location.region },
                  { label: "Site", value: a.location.site },
                  { label: "Latitude", value: a.location.latitude !== null ? `${a.location.latitude}°` : "Not published" },
                  { label: "Longitude", value: a.location.longitude !== null ? `${a.location.longitude}°` : "Not published" },
                  {
                    label: "Accuracy",
                    value: a.location.accuracy === "exact" ? "Surveyed" : a.location.accuracy === "site_level" ? "Site-level only" : "Approximate",
                  },
                ]}
              />
              <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>{a.location.map_note}</p>
            </div>

            <div className="panel panel-pad">
              <div className="eyebrow plain" style={{ marginBottom: 12, color: "var(--ink-3)" }}>Research notes</div>
              <div className="stack" style={{ gap: 10 }}>
                {a.verification.notes.map((n, i) => (
                  <div key={i} className="row" style={{ gap: 9, alignItems: "flex-start" }}>
                    {i === 0 ? <CheckCircle2 size={13} style={{ color: "var(--ok)", marginTop: 4, flexShrink: 0 }} /> : <Info size={13} style={{ color: "var(--cyan)", marginTop: 4, flexShrink: 0 }} />}
                    <span className="small" style={{ color: "var(--ink-2)" }}>{n}</span>
                  </div>
                ))}
                {a.verification.status !== "verified" && (
                  <div className="callout" style={{ marginTop: 6 }}>
                    <strong>Read with care:</strong> this record is {a.verification.status}. See the notes above for what is
                    still uncertain.
                  </div>
                )}
              </div>
              <div className="small muted" style={{ marginTop: 14 }}>Last checked {a.verification.last_checked}</div>
            </div>

            <div className="panel" style={{ overflow: "hidden" }}>
              <MediaFigure media={a.primaryMedia} />
              <div style={{ padding: "14px 16px" }}>
                <div className="small" style={{ color: "var(--ink-2)" }}>{a.primaryMedia?.caption}</div>
                <MediaNote media={a.primaryMedia} />
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="section-tight" style={{ borderTop: "1px solid var(--line)", marginTop: 40 }}>
            <div className="row between" style={{ marginBottom: 20 }}>
              <h2 className="h3">Related records</h2>
              <span className="small muted">Same mission, world or science theme</span>
            </div>
            <div className="grid grid-3">
              {related.map((r) => <ArtifactCard artifact={r} key={r.id} compact />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
