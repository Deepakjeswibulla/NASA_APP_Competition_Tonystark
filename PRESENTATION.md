SPACE RELICS — PRESENTATION CONTENT
===================================
Ten-slide structure, pitch, demo script, methodology, judge Q&A.
Every claim below matches the implemented application. Nothing here is aspirational.

Numbers you can quote (verify against the app before presenting):
  13 artifact records · 7 Moon · 6 Mars · 11 missions · 8 science themes
  28 cited sources · 14 NASA images · 52 timeline events · 1967–2022
  11 records verified, 2 partially verified, 0 unverified
  8 screens · single 3.5 MB HTML file · runs offline, no backend


================================================================================
SLIDE 1 — TITLE
================================================================================
SPACE RELICS
The Machines That Stayed Behind

NASA International Space Apps Challenge 2026
Challenge: Abandoned but not Forgotten — Storytelling about NASA's Discarded
Equipment on the Moon and Mars.

Team: [team name] · [city / country] · [date]

Speaker note: "There are more than a hundred human-made objects at Tranquility
Base alone. We built an archive that treats each one as a story with a source,
not a dot on a map."


================================================================================
SLIDE 2 — THE CHALLENGE
================================================================================
The problem is not a shortage of information. It is the shape of it.

  - Space hardware is usually presented as a catalogue: name, date, photo.
  - The interesting part is missing: why it was sent, what it measured, when it
    stopped, and what it is doing now.
  - "Abandoned" flattens very different endings into one word. Apollo 11's
    seismometer failed in three weeks; its laser reflector still returns data
    today. Surveyor 3 was stripped for parts by astronauts. Opportunity is
    somewhere under the dust of a 2018 storm.
  - Popular retellings drift from the record: coordinates get copied between
    frames, odometers are quoted as ground distance, "mission ended" is read as
    "hardware died".

Our framing: an artifact is not an object, it is the residue of a decision — and
every claim about it should be traceable.


================================================================================
SLIDE 3 — APPROACH
================================================================================
Three commitments, in priority order.

1. FACTUAL ACCURACY BEFORE VOLUME
   13 records, not 130. Every record was built from NASA mission pages, NASA
   technical reports (NTRS/PDS/NSSDC), the LROC survey of lunar hardware, and
   peer-reviewed papers. 28 sources, each with the specific claims it supports
   and whether we read the document or an excerpt.

2. ONE DATASET, MANY VIEWS
   Cards, detail pages, search, filters, map, timeline, themes and comparison all
   read the same JSON through a single access layer. Correct a record once and
   every screen changes.

3. HONESTY AS A FEATURE
   Unknown values are null, not guesses. Where sources disagree — Mars Pathfinder
   has three published coordinate sets — both are printed. Four artifacts whose
   own position is unpublished get a site-level marker that says so. Two records
   are deliberately labelled "partially verified" instead of being rounded up.

Automated guard: a validator enforces schema, foreign keys, coordinate ranges,
media metadata, dates and verification consistency. It currently passes with
zero errors and zero warnings.


================================================================================
SLIDE 4 — HOW IT WORKS
================================================================================
Pipeline: sources → records → validation → one access layer → eight screens.

  - 8 screens: Home, Relic Explorer, Artifact story, Planetary map, Mission
    timeline, Science legacy, Compare, About & Sources.
  - Explorer: search across names, missions, regions, instruments, themes and
    structured facts; filters for planet, equipment type, physical status,
    mission and science theme; four sort orders.
  - Artifact story: eight numbered sections — purpose, journey, service, science,
    aftermath, present status, verified timeline, sources — plus an at-a-glance
    panel, coordinate provenance and research notes.
  - Map: Moon/Mars, viewport fitted to the records in view, real graticule,
    surveyed positions filled and approximate ones dashed, co-located records
    offset with leader lines. It states on screen that it is a schematic plot,
    not a basemap.
  - Timeline: 52 dated events, 1967–2022, filterable by planet and event type,
    with arrival, science milestones and end of operations kept as separate
    facts.
  - Science legacy: 8 themes (lunar geology, seismology, solar particles,
    atmospheres, water and habitability, mobility, UV astronomy, space
    weathering) with only the artifacts that genuinely contributed.
  - Compare: any two records across 11 attributes, differences highlighted.
  - Ships as one 3.5 MB HTML file: no server, no accounts, no network, no live
    API. It cannot break on demo day.


================================================================================
SLIDE 5 — SWOT
================================================================================
STRENGTHS
  - Traceability: every claim maps to a source ID with a stated read level.
  - Integrity by construction: single dataset, generated JSON, validator.
  - Genuinely differentiated content: 13 real records with contradictions
    preserved, not smoothed over.
  - Demo reliability: single offline file, all imagery bundled.

WEAKNESSES
  - Small dataset: 13 of hundreds of objects; deliberately curated.
  - No photographic planetary basemap (schematic plot instead).
  - Four site-level markers rather than artifact-level positions.
  - Sources read as excerpts; no full-document audit.
  - No automated component tests; QA was manual plus headless DOM checks.

OPPORTUNITIES
  - Extend to every catalogued anthropogenic object (the LROC anthropogenic
    features catalogue is the obvious backbone).
  - Add the NASA Image Library API for live imagery with bundled fallbacks.
  - Classroom use: the verification model itself is teachable.
  - Heritage and policy angle: Tranquility Base and the ethics of preserving
    off-world sites.
  - Languages: the dataset is language-neutral; the UI is translatable.

THREATS
  - Fast-moving facts (distance records, mission statuses) age.
  - "AI-generated space content" scepticism — answered by showing sources.
  - Judges expecting live data; answered by stating plainly what is curated.
  - Heritage/legal sensitivity around lunar sites if the archive is extended.


================================================================================
SLIDE 6 — SUSTAINABILITY
================================================================================
Technical
  - Static single-file build: no servers, no database, no paid API, negligible
    hosting cost; works on a laptop or a school machine offline.
  - Data is additive: one record object per artifact, so the archive scales by
    adding records, not by rewriting screens.
  - Imagery is bundled and public domain (NASA), so no licensing drift.

Editorial
  - The validator and the audit trail (RESEARCH_SOURCES.txt, DATA_AUDIT.txt)
    make the archive maintainable by someone who was not on the team.
  - Generated documents cannot drift from the shipped data.
  - Corrections are recorded, not overwritten silently.

Educational
  - Reusable in classrooms as a worked example of evidence, uncertainty and
    citation in science communication.


================================================================================
SLIDE 7 — BUSINESS MODEL CANVAS
================================================================================
(For a public-good, non-commercial product. Costs are near zero by design.)

KEY PARTNERS            NASA open data and imagery · universities and science
                        centres · space-heritage organisations · schools
KEY ACTIVITIES          Research and verification · dataset curation · interface
                        development · educational packaging
KEY RESOURCES           The curated dataset · the validator · the single-file build
VALUE PROPOSITIONS      A trustworthy, story-led archive of off-world hardware ·
                        uncertainty made visible · works offline in any classroom
CUSTOMER RELATIONSHIPS  Open, citable, non-commercial · corrections welcomed
CHANNELS                Static site · downloadable single file · classroom packs
CUSTOMER SEGMENTS       Students and educators · science communicators · space
                        heritage researchers · the space-curious public
COST STRUCTURE          Near zero marginal cost: static hosting, no backend, no
                        licences; volunteer/expert curation time is the real cost
REVENUE STREAMS         None required. Optional grants, museum or education
                        partnerships, and funded expansions (new worlds, new
                        languages) sustain development.


================================================================================
SLIDE 8 — FUTURE PLAN
================================================================================
Next 3 months
  - Grow to 40+ records using the LROC anthropogenic features catalogue as the
    backbone; add Apollo 12 ALSEP, Viking 2, Apollo 16 ALSEP.
  - Upgrade the four site-level markers once published coordinates are located;
    keep the honest fallback where they are not.

Next 6 months
  - Optional live imagery via images-api.nasa.gov with bundled fallbacks, and a
    documented failure path.
  - Photographic basemap support (equirectangular lunar/Martian mosaics) behind
    the same projection code.
  - Classroom pack: worksheets built on the verification model.
  - Accessibility audit with a screen-reader pass and translated UI.

Next 12 months
  - Extend the concept beyond the Moon and Mars — Venus landers, Titan, comet
    mission hardware — using the same schema.
  - Community contribution workflow with review, so the archive can grow without
    losing its evidence standard.

Explicitly not planned: accounts, social features, a chatbot, or a backend.


================================================================================
SLIDE 9 — TEAM
================================================================================
[Team name] — [city, country]
  [Name] — research and data curation (sources, verification, audit)
  [Name] — design and frontend (interface, map, accessibility)
  [Name] — science communication (narrative, presentation, demo)
  [Name] — QA and data validation

How we worked: sources first, interface second. No screen was built before the
record it displays existed and had passed the validator.


================================================================================
SLIDE 10 — CONCLUSION
================================================================================
The machines that stayed behind are the most honest record we have of what
exploring another world actually costs and actually achieves.

SPACE RELICS turns that record into something you can search, filter, compare and
check: 13 artifacts, 11 missions, 28 sources, 52 dated events, one dataset, eight
screens, one file that runs offline.

The claim we are most willing to be judged on is not the design. It is that every
fact on the screen can be traced, and that where we do not know something, the
product says so.

Thank you. Questions welcome — including the hard ones about what we left out.


================================================================================
30-SECOND PITCH
================================================================================
"Every mission that landed on the Moon or Mars left something behind — and most
of it is still there. SPACE RELICS is an archive of thirteen of those machines:
what they were built to do, what they discovered, and what happened to them after
their mission ended. Every fact is tied to a NASA source, and where sources
disagree, the archive says so instead of choosing. It's one file, it runs
offline, and it takes about ten seconds to understand."


================================================================================
DEMO SCRIPT (2–3 MINUTES)
================================================================================
0:00  HOME — "Thirteen machines on two worlds. Some have been sitting there for
      fifty-six years." Point at the statistics: 13 artifacts, 7 Moon, 6 Mars,
      28 sources. Click Explore.

0:20  EXPLORER — "This is the archive." Click the Moon filter: seven records.
      Type "roving" in search: two vehicles, 1971 and 1972. Clear. Click the
      status filter "Partly still operational": one record — Apollo 11's EASEP.
      "That's the point: not everything here is dead."

0:45  OPEN APOLLO 11 EASEP — Read section 01 (purpose) in one line. Scroll to 05:
      the seismometer died after 21 days; the laser reflector still returns data
      today. "One box, two endings."

1:05  BACK, OPEN SURVEYOR 3 — "The only spacecraft humans have ever walked up to
      on another world." Show the location panel: surveyed coordinates, source
      LROC, ±2.6 m. Show the research notes: the 155 m / 180 m disagreement,
      printed rather than hidden.

1:30  MAP — switch Moon to Mars. "Every marker is a published coordinate.
      Filled means surveyed, dashed means approximate — we don't pretend."
      Click InSight: coordinates from the mission's own seismic network
      metadata. Click through to the record.

1:50  TIMELINE — "Fifty-two dated events, 1967 to 2022. Arrival, science and end
      of operations are separate entries, because they're separate facts."
      Filter to Mars, event type "End of operations": Viking 1982, Spirit 2010,
      Opportunity 2018, InSight 2022.

2:10  SCIENCE LEGACY — click Seismology. "Five artifacts, two worlds, fifty years
      apart: Apollo 11 and 14 on the Moon, InSight on Mars. Same technique."

2:30  COMPARE — Apollo 15 rover vs Opportunity. "Same idea, two worlds, 27.9 km
      versus 45.16 km — and both are still exactly where they stopped."

2:45  ABOUT — scroll to limitations. "Six limitations, written down. The map is
      schematic, four markers are site-level, sources were read as excerpts.
      That's the product: what we know, and how well we know it."


================================================================================
RESEARCH METHODOLOGY (long answer, ~90 seconds)
================================================================================
We started from the twelve candidates in the brief and tested each one against
one question: was hardware genuinely left on the surface, and is it documented
well enough to publish? All twelve passed; we added a thirteenth — Viking 1 —
because the archive needed a clear case of hardware that stayed operational for
years after its mission ended, and Viking ran for 2,245 sols against a 90-sol
design life.

For each artifact we worked from the top of the source hierarchy down: NASA
mission pages, then NASA technical reports and archives (NSSDC, PDS, NTRS), then
the LROC survey of anthropogenic features for coordinates, then peer-reviewed
papers. We recorded the URL, the specific claims each source supports, and
whether we read the document or a retrieved excerpt — the latter is the honest
answer for most of them, and it is written in the bibliography rather than
implied away.

Then we cross-checked. Coordinates were compared across the NSSDC landings table,
the LROC 2016 survey and, where relevant, mission-specific metadata such as the
InSight seismic network station file. That is where the interesting problems
appear: Mars Pathfinder has three published coordinate sets in different
reference frames, Viking 1 has two, Apollo 17's rover odometer over-reads its
mapped path by about 4.5 km, and NASA's own pages give two dates for the end of
Spirit's recovery effort. In every case we recorded both values and explained the
disagreement in the record instead of picking the convenient one.

Finally the dataset is machine-checked: unique IDs, foreign keys, coordinate
ranges, media metadata, date formats and verification consistency. If the
validator fails, the build is not delivered.


================================================================================
LIKELY JUDGE QUESTIONS — AND DEFENSIBLE ANSWERS
================================================================================
Q1. Is this live NASA data?
A. No, and the About page says so. It is a curated dataset compiled from NASA
   sources, with imagery bundled from the NASA Image and Video Library. We chose
   this deliberately: a demo that depends on a network and a rate limit is a demo
   that can fail in front of judges, and curated facts can be checked in a way
   that streamed facts cannot.

Q2. How do you know your facts are right?
A. Each record lists the sources that support each claim, with a read level. We
   cross-checked coordinates and dates against a second source wherever one
   existed, and where sources disagree the record shows both. The validator
   enforces that every claim has a source at all.

Q3. Why only thirteen artifacts?
A. Because documentation quality, not object count, is the constraint. Thirteen
   records with sources beat a hundred without. The schema is additive — a new
   record is one object in the authoring script — so scaling is a research task,
   not a rewrite.

Q4. Your map isn't a real map.
A. Correct, and it says so on screen twice. It is a schematic equirectangular
   plot: the coordinates, the graticule and the labels are real, the shading is
   not. A photographic basemap was not available offline in our build
   environment, and we preferred an honest plot to a decorative fake.

Q5. What about the markers that are only site-level?
A. Four artifacts — Sojourner, Spirit, Opportunity and the Apollo 16 UV camera —
   have no published coordinate for the artifact itself. Their markers show the
   landing site, the accuracy field says "site_level", and the record explains
   it. We would rather show a correct site than an invented position.

Q6. Isn't "abandoned" the wrong word for some of this?
A. Yes, which is why the archive uses three physical-status categories and a
   separate verification status. Apollo 11's retroreflector is still in use;
   Surveyor 3 was partly retrieved; the ALSEP stations were switched off while
   still working. The product's argument is precisely that these endings differ.

Q7. How is this different from Wikipedia?
A. Structure and stance. Every artifact uses the same eight-section narrative and
   the same fields, so records are comparable and filterable; uncertainty is a
   first-class field; and the same dataset drives eight different views, so a
   correction propagates everywhere.

Q8. Did AI write your content?
A. The research workflow and drafting were AI-assisted; the evidence standard is
   ours. Every published claim is tied to a named source, nothing is invented,
   and the two records we could not fully verify are labelled as such rather than
   presented as fact.

Q9. What happens when a fact changes?
A. One edit in the authoring script, then rebuild: the validator re-checks the
   dataset, the bibliography and audit are regenerated from it, and every screen
   picks up the change because nothing is hard-coded in the UI.

Q10. Accessibility?
A. Semantic landmarks, aria-current on navigation, aria-pressed on filters,
    keyboard-operable map markers, alt text from the catalogue captions,
    focus-visible rings, reduced-motion support, and a layout tested down to
    390 px.

Q11. What would you do with a month and a budget?
A. Forty-plus records from the LROC anthropogenic features catalogue, published
   coordinates for the four site-level markers, a photographic basemap behind the
   existing projection, a classroom pack, and an accessibility audit with a
   screen-reader pass. Not more features — more evidence.

Q12. What is the single weakest part of the product?
A. The map's visual fidelity, because it is schematic. It is also the part we
   were most careful to label, which is the point: the archive's value is that
   you can tell what is known from what is drawn.


================================================================================
LIMITATIONS TO STATE BEFORE YOU ARE ASKED
================================================================================
  1. Schematic map, not a photographic basemap.
  2. Four site-level markers instead of artifact positions.
  3. Sources read as excerpts, not end-to-end.
  4. Curated and finite: 13 records.
  5. No live NASA API at runtime.
  6. No automated component tests; QA was manual plus headless DOM assertions.
