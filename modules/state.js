// One shared object: every importing module reads and updates the same data.
export const state = {
  allEvidence: [],
  filteredEvidence: [],
  selectedEvidence: null,
  bookmarks: [],
  currentPage: "dashboard",
  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: {},
  currentPeopleTab: "people",
  loadingStepsRemaining: 2,
  evidenceViewLoading: true,
  evidenceLoadError: "",
  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false
  },
  notesStore: {},
  modalCloseListenerCount: 0
};

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
