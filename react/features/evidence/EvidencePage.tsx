import { useReducer } from "react";
import type { EvidenceRecord, LocationRecord, PersonRecord } from "../../../modules/state";

interface Props {
  evidence: EvidenceRecord[];
  people: PersonRecord[];
  locations: LocationRecord[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

interface EvidenceFilters {
  search: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sort: EvidenceSort;
}

type EvidenceSort = "date-desc" | "date-asc" | "title-asc" | "title-desc";
type FilterKey = Exclude<keyof EvidenceFilters, "sort">;

type EvidenceFilterAction =
  | { type: "SET_FILTER"; key: FilterKey; value: string }
  | { type: "SET_SORT"; sort: EvidenceSort }
  | { type: "CLEAR_FILTERS" };

const defaultFilters: EvidenceFilters = {
  search: "",
  type: "",
  personId: "",
  locationId: "",
  status: "",
  relevance: "",
  sort: "date-desc",
};

// Keep each filter transition in one place and always return a new state object.
function evidenceFiltersReducer(
  state: EvidenceFilters,
  action: EvidenceFilterAction,
): EvidenceFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.key]: action.value };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "CLEAR_FILTERS":
      // Reset every related filter together from the same defaults.
      return { ...defaultFilters };
  }
}

export default function EvidencePage({
  evidence,
  people,
  locations,
  bookmarks,
  onToggleBookmark,
}: Props) {
  // Store only user choices; the visible list is derived below from those choices and the source data.
  // One reducer owns all seven related search, filter, and sort choices.
  const [filters, dispatch] = useReducer(evidenceFiltersReducer, defaultFilters);
  function updateFilter(key: FilterKey, value: string) {
    dispatch({ type: "SET_FILTER", key, value });
  }

  const types = [...new Set(evidence.map((item) => item.type))].sort();

  // Recompute filtering and sorting on every render, sorting a fresh array so the source order stays intact.
  const query = filters.search.trim().toLowerCase();
  const visible = evidence
    .filter((item) => {
      const matchesSearch =
        !query ||
        [item.title, item.summary, ...item.tags].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesType = !filters.type || item.type === filters.type;
      const matchesPerson =
        !filters.personId || item.personIds.some((id) => id === filters.personId);
      const matchesLocation =
        !filters.locationId || item.locationIds.some((id) => id === filters.locationId);
      const matchesStatus = !filters.status || item.status.toLowerCase() === filters.status;
      const matchesRelevance =
        !filters.relevance || item.relevance.toLowerCase() === filters.relevance;
      return (
        matchesSearch &&
        matchesType &&
        matchesPerson &&
        matchesLocation &&
        matchesStatus &&
        matchesRelevance
      );
    })
    .slice()
    .sort((left, right) => {
      if (filters.sort === "title-asc") return left.title.localeCompare(right.title);
      if (filters.sort === "title-desc") return right.title.localeCompare(left.title);
      const dateDifference =
        new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime();
      return filters.sort === "date-asc" ? dateDifference : -dateDifference;
    });

  return (
    <section aria-labelledby="evidence-title">
      <h2 id="evidence-title">Evidence Catalogue</h2>
      <div className="toolbar" id="evidenceToolbar">
        <div className="toolbar-row">
          <label className="visually-hidden" htmlFor="reactEvidenceSearch">
            Search evidence
          </label>
          <input
            id="reactEvidenceSearch"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search evidence by title, summary, or tag…"
            autoComplete="off"
          />
          <label className="visually-hidden" htmlFor="reactFilterType">
            Filter by type
          </label>
          <select
            id="reactFilterType"
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="reactFilterPerson">
            Filter by person
          </label>
          <select
            id="reactFilterPerson"
            value={filters.personId}
            onChange={(event) => updateFilter("personId", event.target.value)}
          >
            <option value="">All people</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="reactFilterLocation">
            Filter by location
          </label>
          <select
            id="reactFilterLocation"
            value={filters.locationId}
            onChange={(event) => updateFilter("locationId", event.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-row">
          <label className="visually-hidden" htmlFor="reactFilterStatus">
            Filter by status
          </label>
          <select
            id="reactFilterStatus"
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">All statuses</option>
            <option>unreviewed</option>
            <option>reviewed</option>
            <option>flagged</option>
          </select>
          <label className="visually-hidden" htmlFor="reactFilterRelevance">
            Filter by relevance
          </label>
          <select
            id="reactFilterRelevance"
            value={filters.relevance}
            onChange={(event) => updateFilter("relevance", event.target.value)}
          >
            <option value="">All relevance</option>
            <option>unknown</option>
            <option>relevant</option>
            <option>irrelevant</option>
          </select>
          <label className="visually-hidden" htmlFor="reactSortEvidence">
            Sort evidence
          </label>
          <select
            id="reactSortEvidence"
            value={filters.sort}
            onChange={(event) =>
              dispatch({ type: "SET_SORT", sort: event.target.value as EvidenceSort })
            }
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
          </select>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
          >
            Clear filters
          </button>
        </div>
      </div>
      <div className="evidence-grid">
        {visible.map((item) => {
          const isBookmarked = bookmarks.includes(item.id);
          return (
            <article className="evidence-card" key={item.id}>
              <button
                type="button"
                className={`bookmark-btn${isBookmarked ? " active" : ""}`}
                aria-label={`${isBookmarked ? "Remove" : "Add"} bookmark for ${item.title}`}
                aria-pressed={isBookmarked}
                onClick={() => onToggleBookmark(item.id)}
              >
                <span aria-hidden="true">{isBookmarked ? "★" : "☆"}</span>
              </button>
              <h3>{item.title}</h3>
              <p className="evidence-meta">
                {item.id} · {new Date(item.timestamp).toLocaleString()}
              </p>
              <p className="evidence-summary">{item.summary}</p>
              <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
              {item.tags.map((tag) => (
                <span className="tag-chip" key={tag}>
                  {tag}
                </span>
              ))}
            </article>
          );
        })}
        {visible.length === 0 && <p>No evidence matches this search.</p>}
      </div>
    </section>
  );
}
