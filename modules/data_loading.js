import { renderDashboard } from "./dashboard.js";
import { applyStoredBookmarkFlags, populateEvidenceDropdowns, renderEvidenceList } from "./evidence_list.js";
import { state } from "./state.js";
import { populateTimelineDropdowns, renderTimeline } from "./timeline.js";
import { populateHypothesisDropdowns } from "./workspace.js";

// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

function showLoadingOverlay(msg) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function loadCorePeopleAndLocations() {
  return fetch("data/case.json").then(function (caseRes) {
    if (!caseRes.ok) throw new Error("case.json: HTTP " + caseRes.status);
    return caseRes.json().then(function (caseJson) {
      state.caseData = caseJson;

      return fetch("data/people.json").then(function (peopleRes) {
        if (!peopleRes.ok) throw new Error("people.json: HTTP " + peopleRes.status);
        return peopleRes.json().then(function (peopleJson) {
          state.allPeople = peopleJson;

          return fetch("data/locations.json").then(function (locationsRes) {
            if (!locationsRes.ok) throw new Error("locations.json: HTTP " + locationsRes.status);
            return locationsRes.json().then(function (locationsJson) {
              state.allLocations = locationsJson;

              renderDashboard();
              populateAllDropdowns();
            });
          });
        });
      });
    });
  });
}

function loadEvidenceData() {
  return fetch("data/evidence.json")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      state.allEvidence = data;
      applyStoredBookmarkFlags();
      state.filteredEvidence = state.allEvidence.slice();
      state.evidenceViewLoading = false;
      renderDashboard();
      populateAllDropdowns();
      if (state.currentPage === "evidence") renderEvidenceList();
    })
    .catch(function (err) {
      state.evidenceViewLoading = false;
      state.evidenceLoadError = "Evidence could not be loaded. Please reload the page.";
      if (state.currentPage === "evidence") renderEvidenceList();
      console.error("Failed to load evidence.json", err);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    });
}

function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      state.allTimeline = data;
      renderDashboard();
      if (state.currentPage === "timeline") renderTimeline();
      populateAllDropdowns();
    })
    .catch(function (err) {
      state.timelineLoadError = "Timeline could not be loaded. Please reload the page.";
      console.error("timeline load error", err);
    });
}

export function loadAllData() {
  showLoadingOverlay("Loading case file…");
  state.dataLoaded = false;
  return loadCorePeopleAndLocations().then(function () {
    return loadEvidenceData();
  }).then(function () {
    return loadTimelineData();
  }).then(function () {
    state.dataLoaded = true;
    document.getElementById("loadingOverlay").classList.add("hidden");
  }).catch(function (err) {
    console.error("Failed to load case data", err);
    document.getElementById("loadingText").textContent = "Case data could not be loaded. Please reload the page.";
    document.querySelector("#loadingOverlay .spinner").classList.add("hidden");
  });
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}
