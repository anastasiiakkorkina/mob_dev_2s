import { useEffect, useState } from "react";
import { STORAGE_KEY_BOOKMARKS } from "../../modules/state";
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
  bookmarks: string[];
}

async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

function readBookmarks(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKMARKS) ?? "[]");
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
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
          setData({ caseData, evidence, people, locations, timeline, bookmarks: readBookmarks() });
        }
      })
      .catch(() => {
        if (!signal.aborted) setError("Case data could not be loaded. Please reload the page.");
      });
    return () => controller.abort();
  }, []);

  return { data, error };
}
