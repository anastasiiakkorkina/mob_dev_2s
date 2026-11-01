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
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

// Called by App, so changing the active page never discards the loaded records.
export function useCaseData() {
  const [data, setData] = useState<CaseData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all([
      fetchJson<CaseRecord>("data/case.json", signal),
      fetchJson<EvidenceRecord[]>("data/evidence.json", signal),
      fetchJson<PersonRecord[]>("data/people.json", signal),
      fetchJson<LocationRecord[]>("data/locations.json", signal),
      fetchJson<TimelineEvent[]>("data/timeline.json", signal),
    ])
      .then(([caseData, evidence, people, locations, timeline]) => {
        if (!signal.aborted) {
          setData({ caseData, evidence, people, locations, timeline });
        }
      })
      .catch(() => {
        if (!signal.aborted) setError("Case data could not be loaded. Please reload the page.");
      });
    return () => controller.abort();
  }, []);

  return { data, error };
}
