import { requireElement } from "./dom";
import { openEvidenceDetail } from "./evidence_detail";
import {
  evidenceMentionsPerson,
  findEvidenceById,
  findPersonById,
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "./lookup_helpers";
import { saveBookmarksToStorage } from "./notes_storage";
import { type EvidenceRecord, state } from "./state";

// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

export function populateEvidenceDropdowns() {
  const typeSelect = requireElement("filterType", HTMLSelectElement);
  const personSelect = requireElement("filterPerson", HTMLSelectElement);
  const locationSelect = requireElement("filterLocation", HTMLSelectElement);
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const t = state.allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML += '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' + state.allPeople[p].id + '">' + state.allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < state.allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      state.allLocations[l].id +
      '">' +
      state.allLocations[l].id +
      " - " +
      state.allLocations[l].name +
      "</option>";
  }
}

function getFilteredEvidence() {
  const searchBox = requireElement("evidenceSearch", HTMLInputElement);
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = requireElement("filterType", HTMLSelectElement).value;
  const personVal = requireElement("filterPerson", HTMLSelectElement).value;
  const locationVal = requireElement("filterLocation", HTMLSelectElement).value;
  const statusVal = requireElement("filterStatus", HTMLSelectElement).value;
  const relevanceVal = requireElement("filterRelevance", HTMLSelectElement).value;

  const results = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const item = state.allEvidence[i];
    let matches = true;

    if (searchTerm) {
      const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && !item.locationIds.some((id) => id === locationVal))
      matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && (item.relevance || "").toLowerCase() !== relevanceVal)
      matches = false;

    if (matches) results.push(item);
  }

  state.filteredEvidence = results;
  return results;
}

export function renderEvidenceList() {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (state.evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");
  if (state.evidenceLoadError) {
    container.textContent = state.evidenceLoadError;
    return;
  }

  const results = getFilteredEvidence();
  sortEvidence(results);

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (let i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  if (!container.dataset.clickBound) {
    container.addEventListener("click", handleEvidenceListClick);
    container.dataset.clickBound = "true";
  }
}

function renderEvidenceCardHTML(ev: EvidenceRecord) {
  const isBookmarked = state.bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html +=
    '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset && target.dataset.action === "bookmark") {
    event.stopPropagation();
    const id = target.dataset.id;
    if (id) handleBookmarkClick(id);
    return;
  }

  const card = target.closest(".evidence-card");
  if (card) {
    const id = card.getAttribute("data-id");
    if (id) openEvidenceDetail(id);
  }
}

function handleBookmarkClick(evidenceId: string) {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (state.bookmarks.indexOf(evidenceId) === -1) {
    state.bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    state.bookmarks = state.bookmarks.filter(function (id) {
      return id !== evidenceId;
    });
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (state.currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags() {
  // Remove any bookmarks that no longer exist in the evidence list,
  // and update the bookmarked flags on the evidence items.
  state.bookmarks = state.bookmarks.filter(function (id) {
    return findEvidenceById(id) !== null;
  });
  for (let i = 0; i < state.allEvidence.length; i++) {
    state.allEvidence[i].bookmarked = state.bookmarks.indexOf(state.allEvidence[i].id) !== -1;
  }
}

export function handleSortChange() {
  renderEvidenceList();
}

// Sort only the new array returned by getFilteredEvidence, never the source.
function sortEvidence(results: EvidenceRecord[]) {
  const sortValue = requireElement("sortEvidence", HTMLSelectElement).value;

  if (sortValue === "title-asc") {
    results.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    results.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    results.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    results.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }
}

export function clearFilters() {
  requireElement("evidenceSearch", HTMLInputElement).value = "";
  requireElement("filterType", HTMLSelectElement).value = "";
  requireElement("filterPerson", HTMLSelectElement).value = "";
  requireElement("filterLocation", HTMLSelectElement).value = "";
  requireElement("filterStatus", HTMLSelectElement).value = "";
  requireElement("filterRelevance", HTMLSelectElement).value = "";
  renderEvidenceList();
}

const simulateAsyncSearch = (term: string): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(term);
    }, 300);
  });

let latestSearchRequestId = 0;

export function handleSearchInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  const term = event.target.value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(() => {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}
