import { STORAGE_KEY_BOOKMARKS, STORAGE_KEY_NOTES, state } from "./state.js";

// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------

export function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(state.bookmarks));
}

export function loadBookmarksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    state.bookmarks = Array.isArray(parsed)
      ? Array.from(
          new Set(
            parsed.filter(function (id) {
              return typeof id === "string";
            }),
          ),
        )
      : [];
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    state.bookmarks = [];
  }
}

export function saveNoteForEvidence(evidenceId, text) {
  state.notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(state.notesStore));
}

export function loadNoteForEvidence(evidenceId) {
  return state.notesStore[evidenceId] || "";
}

export function loadNotesFromStorage() {
  state.notesStore = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
    for (const id of Object.keys(parsed)) {
      if (/^E\d+$/.test(id) && typeof parsed[id] === "string") {
        state.notesStore[id] = parsed[id];
      }
    }
  } catch (err) {
    console.warn("Could not read stored notes, starting empty", err);
  }
}

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(state.notesStore[evidenceId] || "");
  });
}
