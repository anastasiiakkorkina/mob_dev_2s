import { Link, useParams } from "react-router";
import type { EvidenceRecord, PersonRecord } from "../../../modules/state";
import { evidenceMentionsPerson } from "../../../modules/lookup_helpers";
import PersonCard from "./components/PersonCard";

interface PersonDetailPageProps {
  people: PersonRecord[];
  evidence: EvidenceRecord[];
}

// demo9
// URL text is untrusted: find the real record instead of casting it to PersonId.
export default function PersonDetailPage({ people, evidence }: PersonDetailPageProps) {
  const { personId } = useParams<"personId">();
  const person = people.find((item) => item.id === personId);

  if (!person) {
    return (
      <section aria-labelledby="person-detail-title">
        <h2 id="person-detail-title">Person not found</h2>
        <p>No person matches this address.</p>
        <Link to="/team/people">Back to people</Link>
      </section>
    );
  }

  // demo9: only a validated record reaches the presentational card.
  const evidenceCount = evidence.filter((item) => evidenceMentionsPerson(item, person)).length;
  return (
    <section aria-labelledby="person-detail-title">
      <h2 id="person-detail-title">Person details: {person.name}</h2>
      <Link to="/team/people">Back to people</Link>
      <PersonCard person={person} evidenceCount={evidenceCount} />
      <h3>Background</h3>
      <p>{person.background}</p>
      {/* demo10: a bookmarkable link supplies the Timeline's initial filter. */}
      <Link to={`/timeline?person=${encodeURIComponent(person.id)}`}>
        View timeline events for {person.name}
      </Link>
    </section>
  );
}
