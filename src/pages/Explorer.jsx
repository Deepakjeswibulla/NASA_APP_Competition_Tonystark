import React from "react";
import { LayoutGrid, ListFilter } from "lucide-react";
import Filters from "../components/Filters";
import ArtifactCard from "../components/ArtifactCard";
import { EmptyState } from "../components/ui";
import { artifacts, queryArtifacts } from "../utils/data";

const INITIAL = { q: "", planet: "all", mission: "all", category: "all", status: "all", theme: "all", sort: "mission" };

export default function Explorer({ query }) {
  const [state, setState] = React.useState({ ...INITIAL, ...query });

  // Keep the URL in step with the planet filter so links into the archive work.
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (state.planet !== "all") params.set("planet", state.planet);
    const qs = params.toString();
    const target = `#/explorer${qs ? "?" + qs : ""}`;
    if (window.location.hash !== target && window.location.hash.startsWith("#/explorer")) {
      window.history.replaceState(null, "", target);
    }
  }, [state.planet]);

  const results = React.useMemo(() => queryArtifacts(artifacts, state), [state]);
  const counts = React.useMemo(() => {
    const base = (fn) => artifacts.reduce((acc, a) => { const k = fn(a); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
    return {
      planet: base((a) => a.planet),
      category: base((a) => a.category),
      status: base((a) => a.physical_status),
    };
  }, []);

  return (
    <div className="wrap section-tight">
      <div style={{ marginBottom: 26 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Relic Explorer</div>
        <h1 className="h2" style={{ marginBottom: 10 }}>Every artifact in the archive</h1>
        <p className="lede" style={{ maxWidth: 700, margin: 0 }}>
          {artifacts.length} records from {new Set(artifacts.map((a) => a.mission_id)).size} missions on two worlds. Filter by
          planet, equipment type, physical status or science theme — or search for a mission, a region or an instrument.
        </p>
      </div>

      <div className="panel panel-pad" style={{ marginBottom: 28 }}>
        <Filters state={state} setState={setState} resultCount={results.length} counts={counts} />
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="No records match these filters"
          body="Try removing a filter, or clear the search. The archive only contains artifacts that passed the research check, so a narrow combination can legitimately return nothing."
          action={
            <button className="btn btn-sm" onClick={() => setState({ ...INITIAL })}>
              <ListFilter size={14} /> Reset filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-3">
            {results.map((a) => <ArtifactCard artifact={a} key={a.id} />)}
          </div>
          <p className="small muted" style={{ marginTop: 26, display: "flex", gap: 8, alignItems: "center" }}>
            <LayoutGrid size={13} /> Showing {results.length} of {artifacts.length} records. Every card opens the full profile,
            including its sources and verification notes.
          </p>
        </>
      )}
    </div>
  );
}
