import { useEffect, useState } from "react";
import type {
  CaseRecord,
  EvidenceRecord,
  PersonRecord,
  LocationRecord,
  TimelineEvent,
} from "../../modules/state";

export interface CaseData {
  caseData: CaseRecord;
  evidence: EvidenceRecord[];
  people: PersonRecord[];
  locations: LocationRecord[];
  timeline: TimelineEvent[];
}

async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  // Ask the local API through Vite's same-origin proxy.
  const response = await fetch(path, { signal });
  // fetch resolves for HTTP errors, so convert non-2xx responses into failures.
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  // Parse the JSON body into the resource type expected by the caller.
  return (await response.json()) as T;
}

// Called by App, so changing the active page never discards the loaded records.
export function useCaseData() {
  // Null means the API has not returned the complete case bundle yet.
  const [data, setData] = useState<CaseData | null>(null);
  // Keep a readable message when any required request fails.
  const [error, setError] = useState("");

  useEffect(() => {
    // One controller owns all requests started by this effect run.
    const controller = new AbortController();
    const { signal } = controller;
    // Fetch independent resources concurrently from the development backend.
    Promise.all([
      fetchJson<CaseRecord>("/api/case", signal),
      fetchJson<EvidenceRecord[]>("/api/evidence", signal),
      fetchJson<PersonRecord[]>("/api/people", signal),
      fetchJson<LocationRecord[]>("/api/locations", signal),
      fetchJson<TimelineEvent[]>("/api/timeline", signal),
    ])
      .then(([caseData, evidence, people, locations, timeline]) => {
        // Ignore a late result if React has already cleaned up this effect.
        if (!signal.aborted) {
          setData({ caseData, evidence, people, locations, timeline });
        }
      })
      .catch(() => {
        // An aborted request is expected during cleanup, not a user-facing failure.
        if (!signal.aborted) setError("Case data could not be loaded. Please reload the page.");
      });
    // Cancel all in-flight requests if the app unmounts or this effect is replaced.
    return () => controller.abort();
  }, []);

  return { data, error };
}
