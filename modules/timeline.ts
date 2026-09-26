import { requireElement } from "./dom";
import { openEvidenceDetail } from "./evidence_detail";
import { findEvidenceById, findLocationById, formatDate } from "./lookup_helpers";
import { navigateTo } from "./navigation";
import { state } from "./state";

// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------

export function populateTimelineDropdowns() {
  const personSelect = requireElement("timelinePersonFilter", HTMLSelectElement);
  const locationSelect = requireElement("timelineLocationFilter", HTMLSelectElement);
  const typeSelect = requireElement("timelineTypeFilter", HTMLSelectElement);
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' + state.allPeople[p].id + '">' + state.allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < state.allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' + state.allLocations[l].id + '">' + state.allLocations[l].id + "</option>";
  }

  const types = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    if (types.indexOf(state.allTimeline[i].type) === -1) types.push(state.allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (let t = 0; t < types.length; t++) {
    typeSelect.innerHTML += '<option value="' + types[t] + '">' + types[t] + "</option>";
  }
}

export function renderTimeline() {
  const container = document.getElementById("timelineContainer");
  if (!container) return;
  if (state.timelineLoadError) {
    container.textContent = state.timelineLoadError;
    return;
  }

  const order = requireElement("timelineOrder", HTMLSelectElement).value;
  const personFilter = requireElement("timelinePersonFilter", HTMLSelectElement).value;
  const locationFilter = requireElement("timelineLocationFilter", HTMLSelectElement).value;
  const typeFilter = requireElement("timelineTypeFilter", HTMLSelectElement).value;

  let events = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    const evt = state.allTimeline[i];
    if (personFilter && !evt.personIds.some((id) => id === personFilter)) continue;
    if (locationFilter && !evt.locationIds.some((id) => id === locationFilter)) continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (let e = 0; e < events.length; e++) {
    const item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames = [];
    for (let el = 0; el < item.locationIds.length; el++) {
      const evtLoc = findLocationById(item.locationIds[el]);
      eventLocationNames.push(evtLoc ? evtLoc.name : item.locationIds[el]);
    }
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (let ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        item.evidenceIds[ev2] +
        '">View ' +
        item.evidenceIds[ev2] +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  const linkButtons = container.querySelectorAll(".evidence-link-btn");
  for (let b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener("click", function () {
      const id = linkButtons[b].getAttribute("data-evidence-id");
      if (id) openEvidenceModal(id);
    });
  }
}

function certaintyBadgeClass(certainty: string) {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

// --- Quick-view modal (used from the timeline) -------------------------
function openEvidenceModal(evidenceId: string) {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
    modal.addEventListener("click", handleModalClick);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";
}

function handleModalClick(e: MouseEvent) {
  if (!(e.target instanceof Element) || !(e.currentTarget instanceof HTMLElement)) return;
  const modal = e.currentTarget;
  if (
    e.target.classList.contains("modal-close-btn") ||
    e.target.classList.contains("modal-backdrop")
  ) {
    modal.innerHTML = "";
  }
  const evidenceId = e.target.getAttribute && e.target.getAttribute("data-open-full");
  if (evidenceId) {
    modal.innerHTML = "";
    navigateTo("evidence");
    setTimeout(function () {
      openEvidenceDetail(evidenceId);
    }, 0);
  }
}
