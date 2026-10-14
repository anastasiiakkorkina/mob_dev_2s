import type { TimelineEvent } from "../../../modules/state";
// demo5
// The page prepares data; TimelineList owns the collection markup.
import TimelineList from "./components/TimelineList";

interface TimelinePageProps {
  events: TimelineEvent[];
}

// demo5
// Feature component: choose chronological order and pass the prepared events to the list.
export default function TimelinePage({ events }: TimelinePageProps) {
  // demo5
  // Sort a copy so rendering never changes the input array.
  const chronologicalEvents = events
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title">Timeline</h2>
      {/* demo5 */}
      {/* The typed events prop is the boundary between preparation and presentation. */}
      <TimelineList events={chronologicalEvents} />
    </section>
  );
}
