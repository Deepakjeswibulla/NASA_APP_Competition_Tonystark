/**
 * Single access layer for the curated dataset.
 *
 * Every view in the application reads from here, and everything here reads from
 * src/data/*.json. No artifact fact is written inside a component.
 */
import artifactsRaw from "../data/artifacts.json";
import sourcesRaw from "../data/sources.json";
import missionsRaw from "../data/missions.json";
import planetsRaw from "../data/planets.json";
import categoriesRaw from "../data/categories.json";
import statusesRaw from "../data/statuses.json";
import themesRaw from "../data/themes.json";
import metaRaw from "../data/meta.json";

// Bundle every artifact image with the app (inlined in the single-file build).
const imageFiles = import.meta.glob("../assets/images/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});
const imageUrl = (file) => {
  const key = Object.keys(imageFiles).find((k) => k.endsWith("/" + file));
  return key ? imageFiles[key] : null;
};

export const meta = metaRaw;
export const planets = planetsRaw;
export const categories = categoriesRaw;
export const statuses = statusesRaw;
export const themes = themesRaw;
export const missions = missionsRaw;
export const sources = sourcesRaw;

const sourceMap = new Map(sourcesRaw.map((s) => [s.source_id, s]));
const missionMap = new Map(missionsRaw.map((m) => [m.id, m]));
const categoryMap = new Map(categoriesRaw.map((c) => [c.id, c]));
const statusMap = new Map(statusesRaw.map((s) => [s.id, s]));
const themeMap = new Map(themesRaw.map((t) => [t.id, t]));

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso) {
  if (!iso) return "Not established";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return "Not established";
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const year = (iso) => (iso ? Number(iso.slice(0, 4)) : null);

/** Enriched artifact records — the objects every component receives. */
export const artifacts = artifactsRaw.map((a) => {
  const mission = missionMap.get(a.mission_id);
  const media = a.media.map((m) => ({ ...m, url: imageUrl(m.file) }));
  const sourceRefs = a.sources
    .map((s) => ({ ...sourceMap.get(s.source_id), supports: s.supports }))
    .filter((s) => s.source_id);
  const themeRefs = a.themes.map((t) => themeMap.get(t)).filter(Boolean);
  return {
    ...a,
    missionRecord: mission || null,
    missionName: mission ? mission.name : a.mission,
    categoryLabel: categoryMap.get(a.category)?.label || a.category,
    statusLabel: statusMap.get(a.physical_status)?.label || a.physical_status,
    media,
    primaryMedia: media[0] || null,
    sourceRefs,
    themeRefs,
    searchText: [
      a.name, a.short_name, a.mission, a.missionName, a.planet, a.categoryLabel,
      a.location.region, a.location.site, a.original_purpose,
      a.verification.status, ...a.themes.map((t) => themeMap.get(t)?.name || ""),
      ...themeRefs.map((t) => t.short),
      ...a.facts.map((f) => `${f.label} ${f.value}`),
    ].join(" ").toLowerCase(),
  };
});

export const artifactMap = new Map(artifacts.map((a) => [a.id, a]));
export const getArtifact = (id) => artifactMap.get(id) || null;

export const verificationCounts = artifacts.reduce(
  (acc, a) => ({ ...acc, [a.verification.status]: (acc[a.verification.status] || 0) + 1 }),
  { verified: 0, "partially verified": 0, unverified: 0 }
);

export const stats = {
  artifacts: artifacts.length,
  moon: artifacts.filter((a) => a.planet === "Moon").length,
  mars: artifacts.filter((a) => a.planet === "Mars").length,
  sources: sources.length,
  mapped: artifacts.filter((a) => a.location.latitude !== null).length,
  missions: missions.length,
};

/** Themes with the artifacts that genuinely contributed to them. */
export const themesWithArtifacts = themes.map((t) => ({
  ...t,
  artifacts: artifacts.filter((a) => a.themes.includes(t.id)),
}));

/** Flattened, date-sorted history used by the timeline and detail pages. */
export const timelineEvents = artifacts
  .flatMap((a) =>
    a.timeline.map((e) => ({
      ...e,
      dateLabel: formatDate(e.date),
      year: year(e.date),
      artifactId: a.id,
      artifactName: a.name,
      planet: a.planet,
      missionName: a.missionName,
    }))
  )
  .sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0));

export const filterOptions = {
  planets: [...new Set(artifacts.map((a) => a.planet))],
  missions: missions.filter((m) => artifacts.some((a) => a.mission_id === m.id)),
  categories: categories.filter((c) => artifacts.some((a) => a.category === c.id)),
  statuses: statuses.filter((s) => artifacts.some((a) => a.physical_status === s.id)),
  themes: themes.filter((t) => artifacts.some((a) => a.themes.includes(t.id))),
};

const SORTERS = {
  mission: (a, b) => (a.deployment_date || "9999") < (b.deployment_date || "9999") ? -1 : 1,
  "mission-desc": (a, b) => (a.deployment_date || "0000") > (b.deployment_date || "0000") ? -1 : 1,
  name: (a, b) => a.name.localeCompare(b.name),
  planet: (a, b) => a.planet.localeCompare(b.planet) || a.name.localeCompare(b.name),
};

/**
 * Search + filter. `q` is matched against names, missions, regions, purposes,
 * themes and the structured fact list — not against prose bodies, so results
 * stay predictable.
 */
export function queryArtifacts(list, { q = "", planet = "all", mission = "all", category = "all", status = "all", theme = "all", sort = "mission" } = {}) {
  const needle = q.trim().toLowerCase();
  const terms = needle ? needle.split(/\s+/).filter(Boolean) : [];
  const out = list.filter((a) => {
    if (planet !== "all" && a.planet !== planet) return false;
    if (mission !== "all" && a.mission_id !== mission) return false;
    if (category !== "all" && a.category !== category) return false;
    if (status !== "all" && a.physical_status !== status) return false;
    if (theme !== "all" && !a.themes.includes(theme)) return false;
    if (terms.length && !terms.every((t) => a.searchText.includes(t))) return false;
    return true;
  });
  return out.sort(SORTERS[sort] || SORTERS.mission);
}

export function relatedArtifacts(artifact, limit = 3) {
  const scored = artifacts
    .filter((a) => a.id !== artifact.id)
    .map((a) => {
      let score = 0;
      if (a.planet === artifact.planet) score += 2;
      if (a.mission_id === artifact.mission_id) score += 3;
      score += a.themes.filter((t) => artifact.themes.includes(t)).length * 2;
      if (a.category === artifact.category) score += 1;
      return { a, score };
    })
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((s) => s.a);
}

export const byId = (id) => getArtifact(id);
