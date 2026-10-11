import type { PersonRecord } from "../modules/state";
import Card from "./Card";

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
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((responsibility) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>
      <div className="person-statement">“{person.statement}”</div>
      <p>
        {evidenceCount} related evidence {evidenceCount === 1 ? "item" : "items"}
      </p>
    </Card>
  );
}
