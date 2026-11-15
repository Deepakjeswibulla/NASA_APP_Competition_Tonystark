import React from "react";
import { ArrowUpRight, MapPin, Camera, Satellite } from "lucide-react";
import { VerificationBadge, PlanetChip, MediaFigure } from "./ui";
import { formatDate } from "../utils/data";

/** One artifact, one card. Every field comes from the dataset record. */
export default function ArtifactCard({ artifact, compact }) {
  const a = artifact;
  const mediaType = a.primaryMedia?.media_type || "photograph";
  return (
    <a className="card fade-up" href={`#/relic/${a.id}`} aria-label={`Open the profile of ${a.name}`}>
      <div className="card-media">
        <div className="card-media-tags">
          <PlanetChip planet={a.planet} />
        </div>
        <MediaFigure media={a.primaryMedia} />
        <span className="card-media-type">
          {mediaType === "photograph" || mediaType === "orbital photograph" ? <Camera size={9} style={{ marginRight: 4, verticalAlign: "middle" }} /> : <Satellite size={9} style={{ marginRight: 4, verticalAlign: "middle" }} />}
          {mediaType}
        </span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span>{a.missionName}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{a.categoryLabel}</span>
        </div>
        <h3 className="card-title">{a.name}</h3>
        {!compact && <p className="card-desc">{a.original_purpose}</p>}
        <div className="card-meta">
          <MapPin size={11} />
          <span>{a.location.region}</span>
          {a.deployment_date && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{formatDate(a.deployment_date)}</span>
            </>
          )}
        </div>
        <div className="card-foot">
          <VerificationBadge status={a.verification.status} small />
          <span className="card-cta">
            Read the story <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </a>
  );
}
