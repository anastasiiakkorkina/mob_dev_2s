import { requireElement } from "./dom";
import { openEvidenceDetail } from "./evidence_detail";
import { navigateTo } from "./navigation";
import { STORAGE_KEY_HYPOTHESIS, state } from "./state";

// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

export function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList() {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = state.allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function () {
      navigateTo("evidence");
      const id = openButtons[b].getAttribute("data-open-evidence");
      if (!id) return;
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList() {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const note = state.notesStore[state.allEvidence[i].id];
    if (note) {
      noteEntries.push({
        index: i,
        evidenceId: state.allEvidence[i].id,
        title: state.allEvidence[i].title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (let n = 0; n < noteEntries.length; n++) {
    const entry = noteEntries[n];
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html += '<div id="noteText-' + entry.index + '"></div></div>';
  }
  container.innerHTML = html;
  // Populate the note text content after the container is in the DOM. DOM elements must exist before setting textContent,
  // otherwise it will fail silently. This is why we don't do it in the loop above.
  for (let n = 0; n < noteEntries.length; n++) {
    requireElement("noteText-" + noteEntries[n].index, HTMLElement).textContent =
      noteEntries[n].text;
  }
}

export function populateHypothesisDropdowns() {
  const suspectSelect = requireElement("hypSuspect", HTMLSelectElement);
  const evidenceSelect = requireElement("hypEvidence", HTMLSelectElement);
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    suspectSelect.innerHTML +=
      '<option value="' + state.allPeople[p].id + '">' + state.allPeople[p].name + "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (let i = 0; i < state.allEvidence.length; i++) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      state.allEvidence[i].id +
      '">' +
      state.allEvidence[i].id +
      " - " +
      state.allEvidence[i].title +
      "</option>";
  }
}

let savedMessageTimer: ReturnType<typeof setTimeout> | undefined;

export function saveHypothesis() {
  const draft = {
    suspectId: requireElement("hypSuspect", HTMLSelectElement).value,
    nature: requireElement("hypNature", HTMLSelectElement).value,
    evidenceIds: getSelectedOptions(requireElement("hypEvidence", HTMLSelectElement)),
    confidence: requireElement("hypConfidence", HTMLInputElement).value,
    explanation: requireElement("hypExplanation", HTMLTextAreaElement).value,
    alternative: requireElement("hypAlternative", HTMLTextAreaElement).value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = requireElement("hypothesisSavedMsg", HTMLElement);
  msg.classList.remove("hidden");
  clearTimeout(savedMessageTimer);
  savedMessageTimer = setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement) {
  const result = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}

function loadHypothesisFromStorage() {
  let draft: Record<string, unknown> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      draft = parsed as Record<string, unknown>;
  } catch (err) {
    console.warn("Could not read stored hypothesis, starting empty", err);
  }

  requireElement("hypSuspect", HTMLSelectElement).value =
    typeof draft.suspectId === "string" ? draft.suspectId : "";
  requireElement("hypNature", HTMLSelectElement).value =
    typeof draft.nature === "string" ? draft.nature : "";
  let confidence = draft.confidence;
  if (typeof confidence === "string" && confidence.trim() !== "") confidence = Number(confidence);
  const normalizedConfidence = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        typeof confidence === "number" && Number.isFinite(confidence) ? confidence : 50,
      ),
    ),
  );
  requireElement("hypConfidence", HTMLInputElement).value = String(normalizedConfidence);
  requireElement("hypConfidenceValue", HTMLElement).textContent = String(normalizedConfidence);
  requireElement("hypExplanation", HTMLTextAreaElement).value =
    typeof draft.explanation === "string" ? draft.explanation : "";
  requireElement("hypAlternative", HTMLTextAreaElement).value =
    typeof draft.alternative === "string" ? draft.alternative : "";

  const evidenceSelect = requireElement("hypEvidence", HTMLSelectElement);
  const savedIds = Array.isArray(draft.evidenceIds) ? draft.evidenceIds : [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    evidenceSelect.options[i].selected = savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
  }
}
