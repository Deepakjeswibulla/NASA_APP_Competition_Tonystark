import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { filterOptions } from "../utils/data";

function Seg({ label, value, onChange, options, counts }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="seg" role="group" aria-label={label}>
        <button aria-pressed={value === "all"} onClick={() => onChange("all")}>
          All
        </button>
        {options.map((o) => (
          <button key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
            {counts && counts[o.id] != null && <span className="count">{counts[o.id]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters({ state, setState, resultCount, counts, sortable = true }) {
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const activeCount = ["planet", "mission", "category", "status", "theme"].filter((k) => state[k] !== "all").length;

  return (
    <div className="toolbar">
      <div className="searchbox">
        <Search size={17} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
        <input
          type="search"
          value={state.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search artifacts, missions, regions, instruments, themes…"
          aria-label="Search the artifact archive"
        />
        {state.q && (
          <button className="search-clear" onClick={() => set({ q: "" })} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-row">
        <Seg
          label="Planet"
          value={state.planet}
          onChange={(v) => set({ planet: v })}
          options={filterOptions.planets.map((p) => ({ id: p, label: p }))}
          counts={counts?.planet}
        />
        <Seg
          label="Category"
          value={state.category}
          onChange={(v) => set({ category: v })}
          options={filterOptions.categories}
          counts={counts?.category}
        />
        <Seg
          label="Physical status"
          value={state.status}
          onChange={(v) => set({ status: v })}
          options={filterOptions.statuses}
          counts={counts?.status}
        />
        <div className="filter-group">
          <span className="filter-label">Mission</span>
          <select className="select" value={state.mission} onChange={(e) => set({ mission: e.target.value })} aria-label="Filter by mission">
            <option value="all">All missions</option>
            {filterOptions.missions.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Science theme</span>
          <select className="select" value={state.theme} onChange={(e) => set({ theme: e.target.value })} aria-label="Filter by science theme">
            <option value="all">All themes</option>
            {filterOptions.themes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        {sortable && (
          <div className="filter-group">
            <span className="filter-label">Sort</span>
            <select className="select" value={state.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort results">
              <option value="mission">Deployment date (oldest first)</option>
              <option value="mission-desc">Deployment date (newest first)</option>
              <option value="name">Name (A–Z)</option>
              <option value="planet">Planet, then name</option>
            </select>
          </div>
        )}
      </div>

      <div className="result-line">
        <span className="result-count">
          <SlidersHorizontal size={12} style={{ marginRight: 6, verticalAlign: "middle" }} />
          {resultCount} {resultCount === 1 ? "record" : "records"}
          {activeCount > 0 && ` · ${activeCount} filter${activeCount > 1 ? "s" : ""} active`}
          {state.q && ` · “${state.q}”`}
        </span>
        {(activeCount > 0 || state.q) && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setState({ q: "", planet: "all", mission: "all", category: "all", status: "all", theme: "all", sort: "mission" })}
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  );
}
