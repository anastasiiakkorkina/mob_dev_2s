import type { PersonRecord } from "../../modules/state";
import PersonCard from "../features/people-locations/components/PersonCard";

// Compile-only example: this file is never imported by the running app.
// Remove the directive below to see the real TypeScript error with tsc --noEmit.
export function WrongPropsExample({ person }: { person: PersonRecord }) {
  // @ts-expect-error: evidenceCount must be a number, not a string
  return <PersonCard person={person} evidenceCount="three" />;
}
