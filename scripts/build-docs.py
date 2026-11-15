#!/usr/bin/env python3
"""Regenerates RESEARCH_SOURCES.txt and DATA_AUDIT.txt from the dataset.

Keeping these two documents machine-generated from src/data/*.json is what stops
the audit trail from drifting away from the data the application actually ships.
Run:  python3 scripts/build-docs.py
"""
import json, os, datetime

ROOT = os.path.join(os.path.dirname(__file__), "..")
D = lambda n: json.load(open(os.path.join(ROOT, "src/data", n)))
artifacts, sources, missions = D("artifacts.json"), D("sources.json"), D("missions.json")
missions_by_id = {m["id"]: m for m in missions}
today = datetime.date.today().isoformat()

# ---------------------------------------------------------------- bibliography
lines = [
 "SPACE RELICS — RESEARCH SOURCES (BIBLIOGRAPHY)",
 "=============================================",
 "",
 f"Compiled: {today}",
 f"Total sources: {len(sources)}",
 "",
 "HOW TO READ THIS FILE",
 "  read_level = full_text   the source document was read in full",
 "  read_level = excerpt     the relevant passage was retrieved and read, not the whole document",
 "A URL resolving is NOT treated as verification. Every entry records which claims it supports.",
 "",
 "SOURCE PRIORITY USED",
 "  1. NASA mission pages and official NASA documents",
 "  2. NASA technical reports and archives (NTRS, PDS, NSSDC)",
 "  3. NASA image and video library",
 "  4. NASA-supported research repositories (LROC/GSFC/ASU)",
 "  5. Peer-reviewed scientific papers",
 "  6. Other reputable scientific institutions, where necessary",
 "",
 "=" * 78,
 ""]
for s in sources:
    lines += [
      f"[{s['source_id']}] {s['title']}",
      f"  Organization / author : {s['organization']}",
      f"  Type                  : {s['source_type']}",
      f"  URL                   : {s['url']}",
      f"  Publication date      : {s['publication_date'] or 'n.d.'}",
      f"  Date accessed         : {s['accessed']}",
      f"  Read level            : {s['read_level']}",
      "  Claims supported:",
    ] + [f"    - {c}" for c in s["supports"]]
    if s.get("notes"):
        lines.append(f"  Reliability notes     : {s['notes']}")
    lines.append("")

lines += ["=" * 78, "UNRESOLVED CONTRADICTIONS BETWEEN SOURCES", "=" * 78, ""]
for a in artifacts:
    for note in a["verification"]["notes"]:
        if any(k in note.lower() for k in ["discrepanc", "differ", "give", "quote", "revision", "revised", "two coordinate", "over-read", "conflict", "three coordinate"]):
            lines.append(f"[{a['id']}] {note}")
            lines.append("")
open(os.path.join(ROOT, "RESEARCH_SOURCES.txt"), "w").write("\n".join(lines))

# ---------------------------------------------------------------- data audit
counts = {"verified": 0, "partially verified": 0, "unverified": 0}
for a in artifacts:
    counts[a["verification"]["status"]] += 1

out = [
 "SPACE RELICS — DATA AUDIT",
 "=========================",
 "",
 f"Generated: {today}",
 f"Artifact records: {len(artifacts)}   |   Verified: {counts['verified']}   |   "
 f"Partially verified: {counts['partially verified']}   |   Unverified: {counts['unverified']}",
 "",
 "STATUS DEFINITIONS",
 "  VERIFIED          — important factual claims are supported by reliable sources and",
 "                      coordinates/dates have been cross-checked.",
 "  PARTIALLY VERIFIED— some important information is missing or uncertain; the record",
 "                      states what and why.",
 "  UNVERIFIED        — insufficient evidence to publish the information as fact.",
 "",
 "STRUCTURAL VALIDATION: see research/DATA_VALIDATION_REPORT.txt (npm run validate).",
 "",
 "=" * 78,
 ""]

for a in artifacts:
    m = missions_by_id.get(a["mission_id"], {})
    loc = a["location"]
    out += [
      "-" * 78,
      f"ARTIFACT ID        : {a['id']}",
      f"NAME               : {a['name']}",
      f"MISSION            : {a['mission']}  ({a['mission_id']})",
      f"PLANET             : {a['planet']}",
      f"CATEGORY           : {a['category']}",
      f"PHYSICAL STATUS    : {a['physical_status']}",
      f"DEPLOYED           : {a['deployment_date'] or 'not established'}",
      f"MISSION PERIOD     : {a['mission_period']['start'] or '?'} -> {a['mission_period']['end'] or '?'}",
      f"OPERATIONAL LIFE   : {a['operational_lifetime']}",
      f"SCIENTIFIC ROLE    : {len(a['scientific_contribution'])} contribution(s) recorded",
      f"LOCATION VERIFIED  : {loc['verified']}  (accuracy: {loc['accuracy']})",
      f"  region / site    : {loc['region']} / {loc['site']}",
      f"  coordinates      : {loc['latitude']}, {loc['longitude']}",
      f"  provenance note  : {loc['map_note']}",
      f"IMAGE VERIFIED     : {len(a['media'])} media record(s), each with NASA id + catalogue caption",
    ]
    for md in a["media"]:
        out.append(f"  - {md['nasa_id']} ({md['media_type']}): {md['title']}")
    out.append(f"SOURCE COMPLETENESS: {len(a['sources'])} source reference(s) -> " +
               ", ".join(s["source_id"] for s in a["sources"]))
    out.append("UNRESOLVED QUESTIONS:")
    out += [f"  - {n}" for n in a["verification"]["notes"]]
    out += [
      f"OVERALL VERIFICATION: {a['verification']['status'].upper()}",
      f"LAST CHECKED        : {a['verification']['last_checked']}",
      ""]

open(os.path.join(ROOT, "DATA_AUDIT.txt"), "w").write("\n".join(out))
print("wrote RESEARCH_SOURCES.txt and DATA_AUDIT.txt")
