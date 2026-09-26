import { renderDashboard } from "./dashboard";
import {
  applyStoredBookmarkFlags,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "./evidence_list";
import {
  CaseRecord,
  EvidenceRecord,
  LocationRecord,
  PersonRecord,
  state,
  TimelineEvent,
} from "./state";
import { populateTimelineDropdowns, renderTimeline } from "./timeline";
import { populateHypothesisDropdowns } from "./workspace";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

function showLoadingOverlay(message: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = message;
  if (overlay) overlay.classList.remove("hidden");
}

async function loadCorePeopleAndLocations(): Promise<void> {
  state.caseData = await fetchJson<CaseRecord>("data/case.json");
  state.allPeople = await fetchJson<PersonRecord[]>("data/people.json");
  state.allLocations = await fetchJson<LocationRecord[]>("data/locations.json");

  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    state.allEvidence = await fetchJson<EvidenceRecord[]>("data/evidence.json");
    applyStoredBookmarkFlags();
    state.filteredEvidence = state.allEvidence.slice();
    state.evidenceViewLoading = false;
    renderDashboard();
    populateAllDropdowns();
    if (state.currentPage === "evidence") renderEvidenceList();
  } catch (error) {
    state.evidenceViewLoading = false;
    state.evidenceLoadError = "Evidence could not be loaded. Please reload the page.";
    if (state.currentPage === "evidence") renderEvidenceList();
    console.error("Failed to load evidence.json", error);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

async function loadTimelineData(): Promise<void> {
  try {
    state.allTimeline = await fetchJson<TimelineEvent[]>("data/timeline.json");
    renderDashboard();
    if (state.currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (error) {
    state.timelineLoadError = "Timeline could not be loaded. Please reload the page.";
    console.error("timeline load error", error);
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  state.dataLoaded = false;

  try {
    await loadCorePeopleAndLocations();
    await loadEvidenceData();
    await loadTimelineData();
    state.dataLoaded = true;
    document.getElementById("loadingOverlay")?.classList.add("hidden");
  } catch (error) {
    console.error("Failed to load case data", error);
    const loadingText = document.getElementById("loadingText");
    if (loadingText) {
      loadingText.textContent = "Case data could not be loaded. Please reload the page.";
    }
    document.querySelector("#loadingOverlay .spinner")?.classList.add("hidden");
  }
}

function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}
