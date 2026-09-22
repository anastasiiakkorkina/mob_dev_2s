import { EvidenceRecord, LocationRecord, PersonRecord, state } from "./state";

export function findEvidenceById(id: string): EvidenceRecord | null {
  return state.allEvidence.find((evidence) => evidence.id === id) ?? null;
}

export function findPersonById(id: string): PersonRecord | null {
  return state.allPeople.find((person) => person.id === id) ?? null;
}

export function findLocationById(id: string): LocationRecord | null {
  return state.allLocations.find((location) => location.id === id) ?? null;
}

export function evidenceMentionsPerson(evidence: EvidenceRecord, person: PersonRecord): boolean {
  return evidence.personIds.includes(person.id);
}

export function formatDate(timestamp?: string | null): string {
  if (!timestamp) return "Unknown date";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return `${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} ${date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getStatusBadgeClass(status?: string | null): string {
  const normalizedStatus = (status ?? "").toLowerCase();
  if (normalizedStatus === "reviewed") return "badge-reviewed";
  if (normalizedStatus === "flagged") return "badge-flagged";
  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(relevance?: string | null): string {
  const normalizedRelevance = (relevance ?? "").toLowerCase();
  if (normalizedRelevance === "relevant") return "badge-relevant";
  return "badge-unreviewed";
}
