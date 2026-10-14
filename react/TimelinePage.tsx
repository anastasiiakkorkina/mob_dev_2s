import type { TimelineEvent } from "../modules/state";
import TimelineEventCard from "./TimelineEventCard";

interface TimelinePageProps {
  events: TimelineEvent[];
}

// demo3
// The page owns the collection; each card renders a single event.
export default function TimelinePage({ events }: TimelinePageProps) {
  // demo3
  // Sort a copy so rendering never changes the input array.
  const chronologicalEvents = events
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title">Timeline</h2>
      {chronologicalEvents.length === 0 ? (
        <p className="intro-card">No timeline events loaded yet.</p>
      ) : (
        <div className="timeline-container">
          {/* demo3 */}
          {/* A stable event ID identifies each sibling card, even after reordering. */}
          {chronologicalEvents.map((event) => (
            <TimelineEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
