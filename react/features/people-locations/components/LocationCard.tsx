import type { LocationRecord } from "../../../../modules/state";
import Card from "../../../shared/components/Card";

interface LocationCardProps {
  location: LocationRecord;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <Card className="location-card">
      <h3>
        {location.id} — {location.name}
      </h3>
      <p>{location.description}</p>
      <p>
        <strong>Contains:</strong>
      </p>
      <ul>
        {location.contains.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
