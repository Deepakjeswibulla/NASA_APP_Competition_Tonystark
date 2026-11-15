#!/usr/bin/env node
/**
 * Dataset validator for SPACE RELICS.
 *
 * Run with: npm run validate
 * Writes research/DATA_VALIDATION_REPORT.txt and exits non-zero on any error.
 * Nothing is silently dropped: every problem is listed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, "src/data", p), "utf8"));

const artifacts = read("artifacts.json");
const sources = read("sources.json");
const missions = read("missions.json");
const categories = read("categories.json");
const statuses = read("statuses.json");
const themes = read("themes.json");

const errors = [];
const warnings = [];
const info = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (d) => ISO.test(d) && !Number.isNaN(Date.parse(d));

const sourceIds = new Set(sources.map((s) => s.source_id));
const missionIds = new Set(missions.map((m) => m.id));
const categoryIds = new Set(categories.map((c) => c.id));
const statusIds = new Set(statuses.map((s) => s.id));
const themeIds = new Set(themes.map((t) => t.id));
const mediaDir = path.join(root, "src/assets/images");
const mediaFiles = new Set(fs.readdirSync(mediaDir));
const ACCURACY = new Set(["exact", "site_level", "approximate", "unknown"]);
const VERIFICATION = new Set(["verified", "partially verified", "unverified"]);

// ---- sources ---------------------------------------------------------------
const seenSource = new Set();
for (const s of sources) {
  if (seenSource.has(s.source_id)) err(`sources: duplicate source_id ${s.source_id}`);
  seenSource.add(s.source_id);
  for (const f of ["source_id", "title", "organization", "url", "source_type", "accessed", "read_level"]) {
    if (!s[f]) err(`sources/${s.source_id}: missing field "${f}"`);
  }
  if (!/^https?:\/\//.test(s.url || "")) err(`sources/${s.source_id}: url is not http(s)`);
  if (!Array.isArray(s.supports) || s.supports.length === 0) err(`sources/${s.source_id}: no supported claims listed`);
}

// ---- missions / categories / statuses / themes -----------------------------
for (const m of missions) {
  for (const f of ["id", "name", "planet", "launch", "arrival"]) if (!m[f]) err(`missions/${m.id}: missing ${f}`);
  if (m.arrival && !validDate(m.arrival)) err(`missions/${m.id}: arrival is not a valid date`);
}
for (const t of themes) if (!t.id || !t.name || !t.summary) err(`themes/${t.id}: incomplete theme record`);

// ---- artifacts -------------------------------------------------------------
const ids = new Set();
const usedSources = new Set();
for (const a of artifacts) {
  const at = `artifacts/${a.id}`;
  if (ids.has(a.id)) err(`${at}: duplicate artifact id`);
  ids.add(a.id);

  for (const f of ["id", "name", "planet", "mission", "mission_id", "category", "physical_status", "original_purpose", "mission_story", "operational_history", "final_status", "why_it_matters"]) {
    if (!a[f]) err(`${at}: missing required field "${f}"`);
  }
  if (!["Moon", "Mars"].includes(a.planet)) err(`${at}: planet must be Moon or Mars`);
  if (!missionIds.has(a.mission_id)) err(`${at}: mission_id "${a.mission_id}" does not exist in missions.json`);
  if (!categoryIds.has(a.category)) err(`${at}: category "${a.category}" is not in categories.json`);
  if (!statusIds.has(a.physical_status)) err(`${at}: physical_status "${a.physical_status}" is not in statuses.json`);
  if (a.deployment_date && !validDate(a.deployment_date)) err(`${at}: deployment_date "${a.deployment_date}" is not YYYY-MM-DD`);
  for (const k of ["start", "end"]) {
    const d = a.mission_period?.[k];
    if (d && !validDate(d)) err(`${at}: mission_period.${k} is not a valid date`);
  }
  if (a.mission_period?.start && a.mission_period?.end && a.mission_period.start > a.mission_period.end) {
    err(`${at}: mission_period start is after end`);
  }

  // themes
  if (!Array.isArray(a.themes) || a.themes.length === 0) err(`${at}: no science themes assigned`);
  for (const t of a.themes || []) if (!themeIds.has(t)) err(`${at}: theme "${t}" does not exist`);

  // contributions must reference a real theme
  for (const c of a.scientific_contribution || []) {
    if (!c.theme_id || !themeIds.has(c.theme_id)) err(`${at}: contribution "${c.title}" has an unknown theme_id`);
    if (!c.title || !c.text) err(`${at}: contribution is missing a title or text`);
  }
  if ((a.scientific_contribution || []).length === 0) err(`${at}: no scientific contribution recorded`);

  // sources
  if (!Array.isArray(a.sources) || a.sources.length === 0) err(`${at}: no sources`);
  for (const s of a.sources || []) {
    if (!sourceIds.has(s.source_id)) err(`${at}: unknown source_id "${s.source_id}"`);
    else usedSources.add(s.source_id);
    if (!Array.isArray(s.supports) || s.supports.length === 0) err(`${at}: source ${s.source_id} lists no supported claims`);
  }

  // verification
  if (!VERIFICATION.has(a.verification?.status)) err(`${at}: invalid verification status "${a.verification?.status}"`);
  if (!a.verification?.last_checked || !validDate(a.verification.last_checked)) err(`${at}: verification.last_checked is not a valid date`);
  if (!Array.isArray(a.verification?.notes) || a.verification.notes.length === 0) err(`${at}: no verification notes`);
  if (a.verification?.status === "verified" && a.location?.accuracy === "unknown") {
    warn(`${at}: marked verified but location accuracy is unknown`);
  }

  // location
  const loc = a.location || {};
  if (!loc.region || !loc.site) err(`${at}: location.region and location.site are required`);
  if (!ACCURACY.has(loc.accuracy)) err(`${at}: invalid location accuracy "${loc.accuracy}"`);
  const hasLat = loc.latitude !== null && loc.latitude !== undefined;
  const hasLon = loc.longitude !== null && loc.longitude !== undefined;
  if (hasLat !== hasLon) err(`${at}: only one of latitude/longitude is set`);
  if (hasLat) {
    if (typeof loc.latitude !== "number" || loc.latitude < -90 || loc.latitude > 90) err(`${at}: latitude out of range`);
    if (typeof loc.longitude !== "number" || loc.longitude < -360 || loc.longitude > 360) err(`${at}: longitude out of range`);
    if (loc.accuracy === "exact" && !loc.verified) err(`${at}: exact coordinates must be marked verified`);
    if (!loc.map_note) warn(`${at}: has coordinates but no map_note explaining their provenance`);
  }
  if (!loc.verified && hasLat) warn(`${at}: coordinates present but location.verified is false`);

  // media
  if (!Array.isArray(a.media) || a.media.length === 0) err(`${at}: no media`);
  for (const m of a.media || []) {
    if (!mediaFiles.has(m.file)) err(`${at}: image file "${m.file}" is missing from src/assets/images`);
    if (!m.caption || !m.credit || !m.title) err(`${at}: media "${m.file}" needs title, caption and credit`);
    if (!m.source_url || !/^https?:\/\//.test(m.source_url)) err(`${at}: media "${m.file}" has no source_url`);
    if (!m.nasa_id) err(`${at}: media "${m.file}" has no NASA id`);
    if (!["photograph", "orbital photograph", "illustration", "diagram"].includes(m.media_type)) {
      err(`${at}: media "${m.file}" has unknown media_type "${m.media_type}"`);
    }
    if (m.date && !validDate(m.date)) err(`${at}: media "${m.file}" date is not valid`);
  }

  // facts and timeline
  if (!Array.isArray(a.facts) || a.facts.length === 0) warn(`${at}: no structured facts`);
  for (const f of a.facts || []) if (!f.label || !f.value) err(`${at}: fact entry missing label or value`);
  if (!Array.isArray(a.timeline) || a.timeline.length === 0) warn(`${at}: no timeline entries`);
  let prev = "";
  for (const e of a.timeline || []) {
    if (!validDate(e.date)) err(`${at}: timeline entry "${e.label}" has an invalid date`);
    if (!["mission", "deployment", "science", "end", "legacy"].includes(e.type)) err(`${at}: timeline entry "${e.label}" has unknown type "${e.type}"`);
    if (e.date < prev) warn(`${at}: timeline is not in date order at "${e.label}"`);
    prev = e.date;
    if (a.mission_period?.start && e.type !== "mission" && e.date < a.mission_period.start) {
      warn(`${at}: timeline entry "${e.label}" predates the mission period start`);
    }
  }
}

// ---- cross checks ----------------------------------------------------------
for (const s of sources) {
  if (!usedSources.has(s.source_id)) warn(`sources/${s.source_id}: never referenced by an artifact (may still be cited in the bibliography)`);
}
for (const m of missions) {
  if (!artifacts.some((a) => a.mission_id === m.id)) warn(`missions/${m.id}: no artifacts reference this mission`);
}
const unmapped = artifacts.filter((a) => a.location.latitude === null);
info.push(`${artifacts.length} artifact records, ${sources.length} sources, ${missions.length} missions, ${themes.length} themes.`);
info.push(`Coordinates present for ${artifacts.length - unmapped.length}/${artifacts.length} records.`);
info.push(`Verification: ${artifacts.filter((a) => a.verification.status === "verified").length} verified, ${artifacts.filter((a) => a.verification.status === "partially verified").length} partially verified, ${artifacts.filter((a) => a.verification.status === "unverified").length} unverified.`);

const lines = [
  "SPACE RELICS — DATA VALIDATION REPORT",
  `Generated: ${new Date().toISOString()}`,
  "",
  `RESULT: ${errors.length === 0 ? "PASS" : "FAIL"} — ${errors.length} error(s), ${warnings.length} warning(s)`,
  "",
  "SUMMARY",
  ...info.map((i) => `  - ${i}`),
  "",
  "ERRORS",
  ...(errors.length ? errors.map((e) => `  [ERROR] ${e}`) : ["  none"]),
  "",
  "WARNINGS",
  ...(warnings.length ? warnings.map((w) => `  [WARN]  ${w}`) : ["  none"]),
  "",
];
fs.mkdirSync(path.join(root, "research"), { recursive: true });
fs.writeFileSync(path.join(root, "research/DATA_VALIDATION_REPORT.txt"), lines.join("\n"));

console.log(lines.slice(0, 5).join("\n"));
if (errors.length) {
  console.log("\nERRORS:");
  errors.forEach((e) => console.log(" - " + e));
  process.exit(1);
}
console.log(`\n${warnings.length} warning(s) — see research/DATA_VALIDATION_REPORT.txt`);
