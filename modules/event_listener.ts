import { requireElement } from "./dom";
import { clearFilters, handleSearchInput, renderEvidenceList } from "./evidence_list";
import { renderTimeline } from "./timeline";
import { saveHypothesis } from "./workspace";

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

export function setupEventListeners() {
  const navButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", () => {
      const targetView = navButtons[i].getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  requireElement("evidenceSearch", HTMLInputElement).addEventListener("input", handleSearchInput);

  requireElement("filterType", HTMLSelectElement).addEventListener("change", renderEvidenceList);
  requireElement("filterPerson", HTMLSelectElement).addEventListener("change", renderEvidenceList);
  requireElement("filterLocation", HTMLSelectElement).addEventListener(
    "change",
    renderEvidenceList,
  );

  requireElement("filterStatus", HTMLSelectElement).addEventListener("change", renderEvidenceList);

  requireElement("filterRelevance", HTMLSelectElement).addEventListener(
    "change",
    renderEvidenceList,
  );

  requireElement("clearFiltersBtn", HTMLElement).addEventListener("click", clearFilters);

  requireElement("timelineOrder", HTMLSelectElement).addEventListener("change", renderTimeline);
  requireElement("timelinePersonFilter", HTMLSelectElement).addEventListener(
    "change",
    renderTimeline,
  );
  requireElement("timelineLocationFilter", HTMLSelectElement).addEventListener(
    "change",
    renderTimeline,
  );
  requireElement("timelineTypeFilter", HTMLSelectElement).addEventListener(
    "change",
    renderTimeline,
  );

  requireElement("hypConfidence", HTMLInputElement).addEventListener("input", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    requireElement("hypConfidenceValue", HTMLElement).textContent = e.target.value;
  });
  requireElement("hypothesisForm", HTMLElement).addEventListener("input", saveHypothesis);
  requireElement("hypothesisForm", HTMLElement).addEventListener("change", saveHypothesis);
}
