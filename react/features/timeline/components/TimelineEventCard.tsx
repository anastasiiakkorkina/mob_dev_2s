import type { TimelineEvent } from "../../../../modules/state";
import { formatDate } from "../../../../modules/lookup_helpers";

interface TimelineEventCardProps {
  event: TimelineEvent;
}

// demo3
// One component displays one event; the parent supplies its record.
export default function TimelineEventCard({ event }: TimelineEventCardProps) {
  const badgeClass =
    event.certainty === "confirmed"
      ? "badge-reviewed"
      : event.certainty === "contradictory"
        ? "badge-critical"
        : event.certainty === "reported"
          ? "badge-flagged"
          : "badge-unreviewed";

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        <time dateTime={event.time}>{formatDate(event.time)}</time> ·{" "}
        <span className={`badge ${badgeClass}`}>{event.certainty}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p className="evidence-meta">
        Event: {event.id} · Type: {event.type}
      </p>
      {event.locationIds.length > 0 && (
        <p className="evidence-meta">Locations: {event.locationIds.join(", ")}</p>
      )}
      {event.evidenceIds.length > 0 && (
        <p className="evidence-meta">Related evidence: {event.evidenceIds.join(", ")}</p>
      )}
    </article>
  );
}
