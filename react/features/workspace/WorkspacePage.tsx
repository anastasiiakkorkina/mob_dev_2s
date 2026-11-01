import { useState, type FormEvent } from "react";
import type { EvidenceRecord, PersonRecord } from "../../../modules/state";

interface Props {
  evidence: EvidenceRecord[];
  people: PersonRecord[];
  bookmarks: string[];
  notes: Record<string, string>;
  onSaveNote: (id: string, text: string) => void;
}

export default function WorkspacePage({ evidence, people, bookmarks, notes, onSaveNote }: Props) {
  const [evidenceId, setEvidenceId] = useState(evidence[0]?.id ?? "");
  const [noteText, setNoteText] = useState("");
  function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!evidenceId || !noteText.trim()) return;
    onSaveNote(evidenceId, noteText.trim());
    setNoteText("");
  }
  const bookmarked = evidence.filter((item) => bookmarks.includes(item.id));
  const savedNotes = evidence.filter((item) => notes[item.id]?.trim());

  return (
    <section aria-labelledby="workspace-title">
      <h2 id="workspace-title">Investigator Workspace</h2>
      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            {bookmarked.length ? (
              bookmarked.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.id}</strong> — {item.title}
                </div>
              ))
            ) : (
              <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
            )}
          </div>
        </div>
        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">Notes are attached to an evidence item.</p>
          <div className="notes-list">
            {savedNotes.length ? (
              savedNotes.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.title}</strong>
                  <p>{notes[item.id]}</p>
                </div>
              ))
            ) : (
              <p>No notes yet.</p>
            )}
          </div>
          <form onSubmit={handleNoteSubmit}>
            <div className="form-row">
              <label htmlFor="noteEvidence">Evidence item</label>
              <select
                id="noteEvidence"
                value={evidenceId}
                onChange={(event) => setEvidenceId(event.target.value)}
              >
                {evidence.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} — {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="workspaceNote">Investigator note</label>
              <textarea
                id="workspaceNote"
                rows={3}
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Add a private note…"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save note
            </button>
          </form>
        </div>
      </div>
      <div className="hypothesis-card">
        <h3>Hypothesis Draft</h3>
        <form>
          <div className="form-row">
            <label htmlFor="hypSuspect">Suspected responsible person</label>
            <select id="hypSuspect" defaultValue="">
              <option value="">Select a person…</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="hypNature">Accidental or deliberate incident</label>
            <select id="hypNature" defaultValue="">
              <option value="">Select…</option>
              <option value="accidental">Accidental</option>
              <option value="deliberate">Deliberate</option>
              <option value="unclear">Unclear</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="hypEvidence">Selected supporting evidence</label>
            <select id="hypEvidence" multiple size={6}>
              {evidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="hypConfidence">Confidence (0–100)</label>
            <input id="hypConfidence" type="range" min="0" max="100" defaultValue="50" />
          </div>
          <div className="form-row">
            <label htmlFor="hypExplanation">Written explanation</label>
            <textarea id="hypExplanation" rows={4} placeholder="Explain your reasoning…" />
          </div>
          <div className="form-row">
            <label htmlFor="hypAlternative">Alternative explanation</label>
            <textarea
              id="hypAlternative"
              rows={3}
              placeholder="What else could explain the evidence?"
            />
          </div>
          <button type="button" className="btn btn-primary" disabled>
            Save hypothesis draft
          </button>
        </form>
      </div>
    </section>
  );
}
