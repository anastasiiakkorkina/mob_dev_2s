import { evidenceMentionsPerson } from "../modules/lookup_helpers";
import type { EvidenceRecord, LocationRecord, PersonRecord } from "../modules/state";
import LocationCard from "./LocationCard";
import PersonCard from "./PersonCard";

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
      <div className="people-grid">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            evidenceCount={evidence.filter((item) => evidenceMentionsPerson(item, person)).length}
          />
        ))}
      </div>
      <h3>Locations</h3>
      <div className="locations-grid">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  );
}
