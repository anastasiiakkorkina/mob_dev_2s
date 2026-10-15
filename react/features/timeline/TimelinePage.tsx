// demo10: read URL state without adding local filter state or onChange handlers.
import { useSearchParams } from "react-router";
import type { PersonRecord, TimelineEvent } from "../../../modules/state";
// demo5
// The page prepares data; TimelineList owns the collection markup.
import TimelineList from "./components/TimelineList";

interface TimelinePageProps {
  events: TimelineEvent[];
  people: PersonRecord[];
}

// demo5
// Feature component: choose chronological order and pass the prepared events to the list.
export default function TimelinePage({ events, people }: TimelinePageProps) {
  // demo10: with HashRouter the query belongs after #/timeline.
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("person") ?? "";
  const selectedPerson = people.find((person) => person.id === personId);
  const invalidPerson = personId !== "" && !selectedPerson;
  const visibleEvents = personId
    ? events.filter((event) => event.personIds.some((id) => id === personId))
    : events;
  // demo5
  // Sort a copy so rendering never changes the input array.
  const chronologicalEvents = (invalidPerson ? [] : visibleEvents)
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title">Timeline</h2>
      {/* demo10: a disabled preview displays the URL-selected person; it does not change filters. */}
      <label>
        Person{" "}
        <select value={personId} disabled>
          <option value="">All people</option>
          {invalidPerson && <option value={personId}>Unknown person</option>}
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </label>
      {invalidPerson && <p role="alert">No person matches the person parameter.</p>}
      {/* demo5 */}
      {/* The typed events prop is the boundary between preparation and presentation. */}
      <TimelineList
        events={chronologicalEvents}
        emptyMessage={
          personId ? "No timeline events match this person." : "No timeline events loaded yet."
        }
      />
    </section>
  );
}
