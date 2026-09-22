import { clearFilters, handleSearchInput, renderEvidenceList } from "./evidence_list.js";
import { renderTimeline } from "./timeline.js";
import { saveHypothesis } from "./workspace.js";

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

export function setupEventListeners() {
  const navButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function (event) {
      const targetView = event.currentTarget.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);

  document.getElementById("filterType").addEventListener("change", renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);

  document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);

  document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", function (e) {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
  });
  document.getElementById("hypothesisForm").addEventListener("input", saveHypothesis);
  document.getElementById("hypothesisForm").addEventListener("change", saveHypothesis);
}
