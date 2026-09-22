import { STORAGE_KEY_BOOKMARKS, STORAGE_KEY_NOTES, state } from "./state";

export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(state.bookmarks));
}

export function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    state.bookmarks = Array.isArray(parsed)
      ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string")))
      : [];
  } catch (error) {
    console.warn("Could not read stored bookmarks, starting empty", error);
    state.bookmarks = [];
  }
}

export function saveNoteForEvidence(evidenceId: string, text: string): void {
  state.notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(state.notesStore));
}

export function loadNoteForEvidence(evidenceId: string): string {
  return state.notesStore[evidenceId] ?? "";
}

export function loadNotesFromStorage(): void {
  state.notesStore = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
    for (const [id, value] of Object.entries(parsed)) {
      if (/^E\d+$/.test(id) && typeof value === "string") {
        state.notesStore[id] = value;
      }
    }
  } catch (error) {
    console.warn("Could not read stored notes, starting empty", error);
  }
}

export function loadNoteAsync(evidenceId: string): Promise<string> {
  return Promise.resolve(state.notesStore[evidenceId] ?? "");
}