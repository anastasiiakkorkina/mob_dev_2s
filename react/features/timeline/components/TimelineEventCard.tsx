import type { TimelineEvent } from "../../../../modules/state";
import { formatDate } from "../../../../modules/lookup_helpers";
// demo7
// Timeline shares badge markup with Dashboard but keeps its certainty rules local.
import Badge, { type BadgeTone } from "../../../shared/components/Badge";

interface TimelineEventCardProps {
  event: TimelineEvent;
}

// demo3
// One component displays one event; the parent supplies its record.
export default function TimelineEventCard({ event }: TimelineEventCardProps) {
  // demo7
  // Translate event certainty into the shared component's visual contract.
  const badgeTone: BadgeTone =
    event.certainty === "confirmed"
      ? "positive"
      : event.certainty === "contradictory"
        ? "critical"
        : event.certainty === "reported"
          ? "warning"
          : "neutral";

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        <time dateTime={event.time}>{formatDate(event.time)}</time> ·{" "}
        {/* demo7: same Badge component, with Timeline-specific inputs. */}
        <Badge label={event.certainty} tone={badgeTone} />
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
