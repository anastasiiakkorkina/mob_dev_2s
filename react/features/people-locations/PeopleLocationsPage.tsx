// demo8: tabs are links; the selected collection comes from the matched route.
import { NavLink } from "react-router";
import { evidenceMentionsPerson } from "../../../modules/lookup_helpers";
import type { EvidenceRecord, LocationRecord, PersonRecord } from "../../../modules/state";
import LocationCard from "./components/LocationCard";
import PersonCard from "./components/PersonCard";

interface PeopleLocationsPageProps {
  people: PersonRecord[];
  locations: LocationRecord[];
  evidence: EvidenceRecord[];
  tab: "people" | "locations";
}

export default function PeopleLocationsPage({
  people,
  locations,
  evidence,
  tab,
}: PeopleLocationsPageProps) {
  return (
    <section aria-labelledby="people-locations-title">
      <h2 id="people-locations-title">People &amp; Locations</h2>
      <nav className="tab-bar" aria-label="People and locations">
        <NavLink
          to="/team/people"
          className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}
        >
          People
        </NavLink>
        <NavLink
          to="/team/locations"
          className={({ isActive }) => `tab-btn${isActive ? " active" : ""}`}
        >
          Locations
        </NavLink>
      </nav>
      {/* demo8: the URL chooses which collection is rendered; no local tab state. */}
      {tab === "people" ? (
        <>
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
                  evidenceCount={
                    evidence.filter((item) => evidenceMentionsPerson(item, person)).length
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </section>
  );
}
