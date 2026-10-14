import { evidenceMentionsPerson } from "../../../modules/lookup_helpers";
import type { EvidenceRecord, LocationRecord, PersonRecord } from "../../../modules/state";
import LocationCard from "./components/LocationCard";
import PersonCard from "./components/PersonCard";

interface PeopleLocationsPageProps {
  people: PersonRecord[];
  locations: LocationRecord[];
  evidence: EvidenceRecord[];
}

export default function PeopleLocationsPage({
  people,
  locations,
  evidence,
}: PeopleLocationsPageProps) {
  return (
    <section aria-labelledby="people-locations-title">
      <h2 id="people-locations-title">People &amp; Locations</h2>
      <h3>People</h3>

      {/* DEMO 2 */}
      {people.length === 0 ? (
        <p className="intro-card">No people loaded yet.</p>
      ) : (
        <div className="people-grid">
          {/* demo3 */}
          {/* Map each record to a card; its ID stays stable across renders. */}
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              evidenceCount={evidence.filter((item) => evidenceMentionsPerson(item, person)).length}
            />
          ))}
        </div>
      )}

      <h3>Locations</h3>
      {locations.length === 0 ? (
        <p className="intro-card">No locations loaded yet.</p>
      ) : (
        <div className="locations-grid">
          {/* demo3 */}
          {/* Keys identify locations among sibling cards. */}
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </section>
  );
}
