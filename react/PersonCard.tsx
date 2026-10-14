import type { PersonRecord } from "../modules/state";
import Card from "./Card";
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
    </Card>
  );
}
