import { useState, type FormEvent } from "react";
import {
  STORAGE_KEY_HYPOTHESIS,
  type EvidenceRecord,
  type PersonRecord,
} from "../../../modules/state";

interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: string;
  explanation: string;
  alternative: string;
}

const emptyHypothesis: HypothesisDraft = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
};

// Restore a saved draft and use safe defaults for missing or invalid fields.
function loadHypothesis(): HypothesisDraft {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY_HYPOTHESIS) ?? "null");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return emptyHypothesis;
    const value = saved as Record<string, unknown>;
    const rawConfidence = Number(value.confidence);
    const confidence = Number.isFinite(rawConfidence)
      ? String(Math.max(0, Math.min(100, Math.round(rawConfidence))))
      : emptyHypothesis.confidence;
    return {
      suspectId: typeof value.suspectId === "string" ? value.suspectId : "",
      nature: typeof value.nature === "string" ? value.nature : "",
      evidenceIds: Array.isArray(value.evidenceIds)
        ? value.evidenceIds.filter((id): id is string => typeof id === "string")
        : [],
      confidence,
      explanation: typeof value.explanation === "string" ? value.explanation : "",
      alternative: typeof value.alternative === "string" ? value.alternative : "",
    };
  } catch {
    return emptyHypothesis;
  }
}

interface Props {
  evidence: EvidenceRecord[];
  people: PersonRecord[];
  bookmarks: string[];
  notes: Record<string, string>;
  onSaveNote: (id: string, text: string) => void;
}

interface NoteFormProps {
  evidence: EvidenceRecord[];
  onSaveNote: (id: string, text: string) => void;
}

// Keep temporary editor input local, then ask the App-owned callback to save it.
function NoteForm({ evidence, onSaveNote }: NoteFormProps) {
  const [evidenceId, setEvidenceId] = useState(evidence[0]?.id ?? "");
  const [noteText, setNoteText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!evidenceId || !noteText.trim()) return;
    onSaveNote(evidenceId, noteText.trim());
    setNoteText("");
  }

  return (
    <form onSubmit={handleSubmit}>
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
  );
}

export default function WorkspacePage({ evidence, people, bookmarks, notes, onSaveNote }: Props) {
  const [hypothesis, setHypothesis] = useState(loadHypothesis);
  const [hypothesisSaved, setHypothesisSaved] = useState(false);

  // Keep the related hypothesis fields together as one draft object.
  function handleHypothesisSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem(
        STORAGE_KEY_HYPOTHESIS,
        JSON.stringify({ ...hypothesis, savedAt: new Date().toISOString() }),
      );
      setHypothesisSaved(true);
    } catch {
      setHypothesisSaved(false);
    }
  }
  // Derive bookmarked records from the same bookmark IDs used by the Dashboard and Evidence page.
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
          <NoteForm evidence={evidence} onSaveNote={onSaveNote} />
        </div>
      </div>
      <div className="hypothesis-card">
        <h3>Hypothesis Draft</h3>
        <form onSubmit={handleHypothesisSubmit}>
          <div className="form-row">
            <label htmlFor="hypSuspect">Suspected responsible person</label>
            <select
              id="hypSuspect"
              value={hypothesis.suspectId}
              onChange={(event) =>
                setHypothesis((current) => ({ ...current, suspectId: event.target.value }))
              }
            >
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
            <select
              id="hypNature"
              value={hypothesis.nature}
              onChange={(event) =>
                setHypothesis((current) => ({ ...current, nature: event.target.value }))
              }
            >
              <option value="">Select…</option>
              <option value="accidental">Accidental</option>
              <option value="deliberate">Deliberate</option>
              <option value="unclear">Unclear</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="hypEvidence">Selected supporting evidence</label>
            <select
              id="hypEvidence"
              multiple
              size={6}
              value={hypothesis.evidenceIds}
              onChange={(event) =>
                setHypothesis((current) => ({
                  ...current,
                  evidenceIds: Array.from(event.target.selectedOptions, (option) => option.value),
                }))
              }
            >
              {evidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="hypConfidence">Confidence (0–100)</label>
            <input
              id="hypConfidence"
              type="range"
              min="0"
              max="100"
              value={hypothesis.confidence}
              onChange={(event) =>
                setHypothesis((current) => ({ ...current, confidence: event.target.value }))
              }
            />
            <output htmlFor="hypConfidence">{hypothesis.confidence}</output>
          </div>
          <div className="form-row">
            <label htmlFor="hypExplanation">Written explanation</label>
            <textarea
              id="hypExplanation"
              rows={4}
              value={hypothesis.explanation}
              onChange={(event) =>
                setHypothesis((current) => ({ ...current, explanation: event.target.value }))
              }
              placeholder="Explain your reasoning…"
            />
          </div>
          <div className="form-row">
            <label htmlFor="hypAlternative">Alternative explanation</label>
            <textarea
              id="hypAlternative"
              rows={3}
              value={hypothesis.alternative}
              onChange={(event) =>
                setHypothesis((current) => ({ ...current, alternative: event.target.value }))
              }
              placeholder="What else could explain the evidence?"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>
          {hypothesisSaved && (
            <span className="saved-msg" role="status">
              Saved
            </span>
          )}
        </form>
      </div>
    </section>
  );
}
