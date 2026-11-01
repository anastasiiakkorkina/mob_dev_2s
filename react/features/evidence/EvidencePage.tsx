import { useState } from "react";
import type { EvidenceRecord, LocationRecord, PersonRecord } from "../../../modules/state";

interface Props {
  evidence: EvidenceRecord[];
  people: PersonRecord[];
  locations: LocationRecord[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

export default function EvidencePage({
  evidence,
  people,
  locations,
  bookmarks,
  onToggleBookmark,
}: Props) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = evidence.filter((item) =>
    [item.title, item.summary, ...item.tags].some((value) => value.toLowerCase().includes(query)),
  );
  const types = [...new Set(evidence.map((item) => item.type))].sort();

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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search evidence by title, summary, or tag…"
            autoComplete="off"
          />
          <label className="visually-hidden" htmlFor="reactFilterType">
            Filter by type
          </label>
          <select id="reactFilterType" defaultValue="">
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="reactFilterPerson">
            Filter by person
          </label>
          <select id="reactFilterPerson" defaultValue="">
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
          <select id="reactFilterLocation" defaultValue="">
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
          <select id="reactFilterStatus" defaultValue="">
            <option value="">All statuses</option>
            <option>unreviewed</option>
            <option>reviewed</option>
            <option>flagged</option>
          </select>
          <label className="visually-hidden" htmlFor="reactFilterRelevance">
            Filter by relevance
          </label>
          <select id="reactFilterRelevance" defaultValue="">
            <option value="">All relevance</option>
            <option>unknown</option>
            <option>relevant</option>
            <option>irrelevant</option>
          </select>
          <label className="visually-hidden" htmlFor="reactSortEvidence">
            Sort evidence
          </label>
          <select id="reactSortEvidence" defaultValue="date-desc">
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
          </select>
          <button type="button" className="btn btn-secondary" onClick={() => setSearch("")}>
            Clear search
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
              <span className="badge badge-unreviewed">{item.status}</span>
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
