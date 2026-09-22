import { renderDashboard } from "./dashboard.js";
import {
  applyStoredBookmarkFlags,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "./evidence_list.js";
import { state } from "./state.js";
import { populateTimelineDropdowns, renderTimeline } from "./timeline.js";
import { populateHypothesisDropdowns } from "./workspace.js";

// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

function showLoadingOverlay(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  if (!caseRes.ok) throw new Error("case.json: HTTP " + caseRes.status);
  const caseJson = await caseRes.json();
  state.caseData = caseJson;

  const peopleRes = await fetch("data/people.json");
  if (!peopleRes.ok) throw new Error("people.json: HTTP " + peopleRes.status);
  const peopleJson = await peopleRes.json();
  state.allPeople = peopleJson;

  const locationsRes = await fetch("data/locations.json");
  if (!locationsRes.ok) throw new Error("locations.json: HTTP " + locationsRes.status);
  const locationsJson = await locationsRes.json();
  state.allLocations = locationsJson;

  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData() {
  try {
    const res = await fetch("data/evidence.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.allEvidence = data;
    applyStoredBookmarkFlags();
    state.filteredEvidence = state.allEvidence.slice();
    state.evidenceViewLoading = false;
    renderDashboard();
    populateAllDropdowns();
    if (state.currentPage === "evidence") renderEvidenceList();
  } catch (err) {
    state.evidenceViewLoading = false;
    state.evidenceLoadError = "Evidence could not be loaded. Please reload the page.";
    if (state.currentPage === "evidence") renderEvidenceList();
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

async function loadTimelineData() {
  try {
    const res = await fetch("data/timeline.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.allTimeline = data;
    renderDashboard();
    if (state.currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    state.timelineLoadError = "Timeline could not be loaded. Please reload the page.";
    console.error("timeline load error", err);
  }
}

export async function loadAllData() {
  showLoadingOverlay("Loading case file…");
  state.dataLoaded = false;

  try {
    await loadCorePeopleAndLocations();
    await loadEvidenceData();
    await loadTimelineData();
    state.dataLoaded = true;
    document.getElementById("loadingOverlay").classList.add("hidden");
  } catch (err) {
    console.error("Failed to load case data", err);
    document.getElementById("loadingText").textContent =
      "Case data could not be loaded. Please reload the page.";
    document.querySelector("#loadingOverlay .spinner").classList.add("hidden");
  }
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}
