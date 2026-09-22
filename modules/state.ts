export interface EvidenceRecord {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: string;
  relevance: string;
  bookmarked?: boolean;
}

export interface PersonRecord {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface LocationRecord {
  id: string;
  name: string;
  description: string;
  contains: string[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: string;
  certainty: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}

export type PersonId =
  "signal-scholar" | "kernel-colt" | "nova-byte" | "patch-vector" | "refactor-rex" | "root-harbor";
export type LocationId = `L0${1 | 2 | 3 | 4 | 5 | 6}`;
export type EvidenceId = `E${number}`;

export interface CaseRecord {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string;
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface AppState {
  allEvidence: EvidenceRecord[];
  filteredEvidence: EvidenceRecord[];
  selectedEvidence: EvidenceRecord | null;
  bookmarks: string[];
  currentPage: string;
  allPeople: PersonRecord[];
  allLocations: LocationRecord[];
  allTimeline: TimelineEvent[];
  caseData: CaseRecord | null;
  currentPeopleTab: string;
  dataLoaded: boolean;
  evidenceViewLoading: boolean;
  evidenceLoadError: string;
  timelineLoadError: string;
  viewRendered: Record<string, boolean>;
  notesStore: Record<string, string>;
}

export const state: AppState = {
  allEvidence: [],
  filteredEvidence: [],
  selectedEvidence: null,
  bookmarks: [],
  currentPage: "dashboard",
  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: null,
  currentPeopleTab: "people",
  dataLoaded: false,
  evidenceViewLoading: true,
  evidenceLoadError: "",
  timelineLoadError: "",
  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  },
  notesStore: {},
};

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
