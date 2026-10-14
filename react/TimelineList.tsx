// demo5
// Presentational component: display the supplied order, without choosing or sorting data.
import type { TimelineEvent } from "../modules/state";
import TimelineEventCard from "./TimelineEventCard";

interface TimelineListProps {
  events: readonly TimelineEvent[];
}

export default function TimelineList({ events }: TimelineListProps) {
  if (events.length === 0) {
    return <p className="intro-card">No timeline events loaded yet.</p>;
  }

  return (
    <div className="timeline-container">
      {/* demo5 */}
      {/* Rendering and stable keys belong to this list; ordering belongs to the page. */}
      {events.map((event) => (
        <TimelineEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
