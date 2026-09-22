import { loadAllData } from "./modules/data_loading.js";
import { setupEventListeners } from "./modules/event_listener.js";
import { closeEvidenceDetail, saveCurrentNote } from "./modules/evidence_detail.js";
import { handleSortChange, renderEvidenceList } from "./modules/evidence_list.js";
import { handleHashChange, navigateTo } from "./modules/navigation.js";
import {
  loadBookmarksFromStorage,
  loadNoteAsync,
  loadNotesFromStorage,
} from "./modules/notes_storage.js";
import { switchPeopleTab } from "./modules/people_locations.js";
import { saveHypothesis } from "./modules/workspace.js";

// Compatibility bridge for existing HTML onclick/onchange handlers.
// Keep this list explicit: module internals and shared state stay off window.
Object.assign(window, {
  navigateTo,
  handleSortChange,
  switchPeopleTab,
  saveHypothesis,
  closeEvidenceDetail,
  saveCurrentNote,
  renderEvidenceList,
});

async function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();
  handleHashChange();

  const firstNote = await loadNoteAsync("E01");
  console.log("First note preview:", firstNote);
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
