import React from "react";
import { ArrowRight, Compass, Map, BookOpen, ShieldCheck, Layers, CircleDot } from "lucide-react";
import heroImg from "../assets/images/hero-apollo17-site.jpg";
import ArtifactCard from "../components/ArtifactCard";
import { SectionHead, VerificationBadge } from "../components/ui";
import { artifacts, stats, themesWithArtifacts, verificationCounts, getArtifact, missions } from "../utils/data";

const FEATURED = ["apollo-15-lrv", "surveyor-3", "opportunity-rover", "apollo-16-fuv-camera"];

export default function Home() {
  const featured = FEATURED.map(getArtifact).filter(Boolean);
  const moon = artifacts.filter((a) => a.planet === "Moon");
  const mars = artifacts.filter((a) => a.planet === "Mars");

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src={heroImg} alt="The Apollo 17 landing site at Taurus-Littrow: lunar module, rover and astronaut in a wide valley" />
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <div className="eyebrow" style={{ marginBottom: 20 }}>NASA International Space Apps Challenge 2026</div>
            <h1 className="display">
              The machines<br />
              that <span className="hero-title-accent">stayed behind</span>.
            </h1>
            <p className="lede hero-sub">
              Descent stages, rovers, seismometers and telescopes are still sitting on the Moon and Mars —
              some for more than fifty years. SPACE RELICS tells the story of what each one was built to do,
              what it discovered, and what it is doing now.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#/explorer">
                Explore the archive <ArrowRight size={16} />
              </a>
              <a className="btn" href="#/map">
                <Map size={15} /> Open the planetary map
              </a>
            </div>
            <div className="hero-meta">
              {[
                [stats.artifacts, "artifacts"],
                [`${stats.moon} / ${stats.mars}`, "Moon / Mars"],
                [stats.sources, "sources cited"],
                [`${stats.missions}`, "missions"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="hero-stat-value">{v}</div>
                  <div className="hero-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="What this is"
            title="A catalogue of objects would be a list. This is a record of consequences."
            lede="Every entry answers the same questions: why was it sent, what did it do, when did it stop, and where is it now? Facts are tied to the sources that support them, and what is unknown is marked as unknown."
          />
          <div className="grid grid-3">
            {[
              { Icon: BookOpen, title: "Story, not inventory", body: "Each artifact is presented as a mission narrative — purpose, deployment, discoveries, ending — with the technical specification kept available but not shouted." },
              { Icon: ShieldCheck, title: "Every fact has a source", body: "Records are built from NASA mission pages, NASA technical reports, the LROC survey of lunar hardware and peer-reviewed papers. Each claim carries the source IDs that support it." },
              { Icon: Layers, title: "Status is not one thing", body: "Left on the surface, switched off at the end of a programme, partly retrieved, still operating, or simply lost — the archive distinguishes all of these instead of calling everything abandoned." },
            ].map(({ Icon, title, body }) => (
              <div className="panel panel-pad stack" key={title} style={{ gap: 14 }}>
                <div className="theme-icon"><Icon size={18} /></div>
                <h3 className="h3">{title}</h3>
                <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <SectionHead
            eyebrow="Two worlds"
            title="Choose a surface"
            action={<a className="btn btn-sm" href="#/explorer">See all {stats.artifacts} records <ArrowRight size={14} /></a>}
          />
          <div className="grid grid-2">
            {[
              { planet: "Moon", list: moon, blurb: "Six Apollo landing sites and a robotic precursor, all within about 30° of the equator on the near side — the best-surveyed hardware off Earth.", img: getArtifact("apollo-11-lm-descent-stage").primaryMedia.url, href: "#/explorer?planet=Moon" },
              { planet: "Mars", list: mars, blurb: "Nine landed missions spread across more than 200° of longitude, from the 1976 Viking landers to InSight's seismometer in Elysium Planitia.", img: getArtifact("opportunity-rover").primaryMedia.url, href: "#/explorer?planet=Mars" },
            ].map((p) => (
              <a className="panel" key={p.planet} href={p.href} style={{ overflow: "hidden", display: "block" }}>
                <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden" }}>
                  <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,10,18,0.1), rgba(9,13,21,0.95))" }} />
                  <div style={{ position: "absolute", bottom: 18, left: 22, right: 22 }}>
                    <div className="eyebrow plain" style={{ marginBottom: 6 }}>{p.list.length} records</div>
                    <h3 className="h2" style={{ fontSize: "1.9rem" }}>{p.planet}</h3>
                  </div>
                </div>
                <div style={{ padding: "18px 22px 22px" }}>
                  <p className="small" style={{ color: "var(--ink-2)", margin: 0 }}>{p.blurb}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Featured records"
            title="Four machines, four kinds of ending"
            lede="One still parked where it was left, one stripped for parts by astronauts, one silent under a dust storm, and one still standing in the shadow of its lander."
            action={<a className="btn btn-sm" href="#/explorer">All records <ArrowRight size={14} /></a>}
          />
          <div className="grid grid-4">
            {featured.map((a) => <ArtifactCard artifact={a} key={a.id} compact />)}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="panel panel-pad" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: 36, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Science legacy</div>
              <h2 className="h2" style={{ marginBottom: 14 }}>The hardware is the instrument. The legacy is the measurement.</h2>
              <p className="lede" style={{ marginBottom: 20 }}>
                {themesWithArtifacts.length} themes connect artifacts to what they actually established — lunar seismology,
                the age of the highlands, the shape of Earth's hydrogen geosphere, ancient water on Mars, and the
                engineering of driving on another world.
              </p>
              <a className="btn" href="#/legacy">Explore the science legacy <ArrowRight size={15} /></a>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              {themesWithArtifacts.slice(0, 5).map((t) => (
                <a key={t.id} href={`#/legacy?theme=${t.id}`} className="row between" style={{ padding: "11px 0", borderBottom: "1px solid var(--line)", gap: 12 }}>
                  <span className="small" style={{ color: "var(--ink)" }}>{t.name}</span>
                  <span className="mono small" style={{ color: "var(--cyan)" }}>{t.artifacts.length}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-2" style={{ alignItems: "center", gap: 40 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>How to read a record</div>
              <h2 className="h2" style={{ marginBottom: 14 }}>Three verification states, no guesses</h2>
              <p className="lede" style={{ marginBottom: 18 }}>
                A record is <strong style={{ color: "var(--ink)" }}>verified</strong> when its important claims are supported by
                reliable sources, <strong style={{ color: "var(--ink)" }}>partially verified</strong> when something material is
                still uncertain, and <strong style={{ color: "var(--ink)" }}>unverified</strong> when it should not be read as fact.
                Where sources disagree, the disagreement is printed in the record.
              </p>
              <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                <VerificationBadge status="verified" />
                <span className="mono small muted">{verificationCounts.verified}</span>
                <VerificationBadge status="partially verified" />
                <span className="mono small muted">{verificationCounts["partially verified"]}</span>
                <VerificationBadge status="unverified" />
                <span className="mono small muted">{verificationCounts.unverified}</span>
              </div>
            </div>
            <div className="panel panel-pad">
              <div className="row" style={{ gap: 10, marginBottom: 14 }}>
                <Compass size={16} style={{ color: "var(--cyan)" }} />
                <span className="mono small" style={{ letterSpacing: "0.14em", color: "var(--ink-2)" }}>START HERE</span>
              </div>
              <div className="stack" style={{ gap: 12 }}>
                {[
                  ["#/relic/apollo-11-easep", "Apollo 11 EASEP", "Hardware that outlived its mission by fifty years"],
                  ["#/relic/surveyor-3", "Surveyor 3", "The only spacecraft humans have walked up to on another world"],
                  ["#/relic/opportunity-rover", "Opportunity", "45.16 km, then a dust storm"],
                ].map(([href, title, sub]) => (
                  <a key={href} href={href} className="row between" style={{ gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <span>
                      <span style={{ display: "block", fontSize: "0.95rem", color: "var(--ink)" }}>{title}</span>
                      <span className="small muted">{sub}</span>
                    </span>
                    <ArrowRight size={15} style={{ color: "var(--cyan)", flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 60 }}>
        <div className="wrap">
          <div className="panel panel-pad row between wrap-gap" style={{ flexWrap: "wrap" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}><CircleDot size={11} /> Open the archive</div>
              <h3 className="h2" style={{ fontSize: "1.6rem" }}>Search, filter and compare every record</h3>
            </div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="#/explorer">Relic Explorer <ArrowRight size={15} /></a>
              <a className="btn" href="#/compare">Compare two artifacts</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
