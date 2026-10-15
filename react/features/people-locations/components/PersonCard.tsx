import type { PersonRecord } from "../../../../modules/state";
// demo9: real links support direct opening, bookmarking, and browser history.
import { Link } from "react-router";
import Card from "../../../shared/components/Card";
import PersonStatement from "./PersonStatement";

interface PersonCardProps {
  person: PersonRecord;
  evidenceCount: number;
}

export default function PersonCard({ person, evidenceCount }: PersonCardProps) {
  return (
    <Card className="person-card">
      <div className="person-card-header">
        <img className="person-avatar" src={person.avatar} alt={`Portrait of ${person.name}`} />
        <div>
          {/* DEMO 1 */}
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>

      {/* DEMO 2 */}
      {person.responsibilities.length > 0 && (
        <ul>
          {person.responsibilities.map((responsibility) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      )}
      <PersonStatement statement={person.statement} />
      <p>
        {/* DEMO 2 */}
        {evidenceCount === 0
          ? "No related evidence yet."
          : `${evidenceCount} related evidence ${evidenceCount === 1 ? "item" : "items"}`}
      </p>
      {/* demo9: link to this record's parameterized route using its stable ID. */}
      <Link to={`/team/people/${encodeURIComponent(person.id)}`}>
        View details for {person.name}
      </Link>
    </Card>
  );
}
