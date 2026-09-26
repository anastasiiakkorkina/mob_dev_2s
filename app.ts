import { loadAllData } from "./modules/data_loading";
import { setupEventListeners } from "./modules/event_listener";
import { closeEvidenceDetail, saveCurrentNote } from "./modules/evidence_detail";
import { handleSortChange, renderEvidenceList } from "./modules/evidence_list";
import { handleHashChange, navigateTo } from "./modules/navigation";
import {
  loadBookmarksFromStorage,
  loadNoteAsync,
  loadNotesFromStorage,
} from "./modules/notes_storage";
import { switchPeopleTab } from "./modules/people_locations";
import { saveHypothesis } from "./modules/workspace";

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
