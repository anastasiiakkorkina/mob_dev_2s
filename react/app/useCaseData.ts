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

// LAB6, demo 6. These URL modes make the API states repeatable in class.
export type CaseDataDemoMode = "normal" | "delay" | "error" | "empty";

// LAB6, demo 6. Keep HTTP failures detailed so the error state can explain them.
async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  // Ask the local API through Vite's same-origin proxy.
  const response = await fetch(path, { signal });
  // fetch resolves for HTTP errors, so convert non-2xx responses into failures.
  if (!response.ok) {
    // Read an optional server message from the API's JSON error response.
    let serverMessage = "";
    try {
      const body: unknown = await response.json();
      if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
        serverMessage = body.error;
      }
    } catch {
      // Keep the HTTP status even when the server did not send JSON.
    }
    throw new Error(
      `${path}: HTTP ${response.status}${serverMessage ? ` — ${serverMessage}` : ""}`,
    );
  }
  // Parse the JSON body into the resource type expected by the caller.
  return (await response.json()) as T;
}

// LAB6, demo 6. Called by App so route changes reuse the shared data bundle.
export function useCaseData(demoMode: CaseDataDemoMode = "normal") {
  // Null means the API has not returned the complete case bundle yet.
  const [data, setData] = useState<CaseData | null>(null);
  // Keep a readable message when any required request fails.
  const [error, setError] = useState("");
  // Track loading separately so it always ends on success or failure.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LAB6, demo 6. Reset the visible state when the demo request mode changes.
    setData(null);
    setError("");
    setLoading(true);

    // One controller owns all requests started by this effect run.
    const controller = new AbortController();
    const { signal } = controller;
    // Select a deterministic response for the Evidence endpoint during the demo.
    const evidencePath =
      demoMode === "error"
        ? "/api/evidence?fail=1"
        : demoMode === "delay"
          ? "/api/evidence?delay=3000"
          : demoMode === "empty"
            ? "/api/evidence?empty=1"
            : "/api/evidence";

    // Fetch independent resources concurrently from the development backend.
    Promise.all([
      fetchJson<CaseRecord>("/api/case", signal),
      fetchJson<EvidenceRecord[]>(evidencePath, signal),
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
      .catch((cause: unknown) => {
        // An aborted request is expected during cleanup, not a user-facing failure.
        if (!signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Case data could not be loaded.");
        }
      })
      .finally(() => {
        // Stop the loading state on both success and failure.
        if (!signal.aborted) setLoading(false);
      });
    // Cancel all in-flight requests if the app unmounts or this effect is replaced.
    return () => controller.abort();
  }, [demoMode]);

  return { data, error, loading };
}
