import { useState } from "react";
import type { PersonRecord } from "../../modules/state";

type DemoPerson = Pick<PersonRecord, "id" | "name">;
type KeyMode = "index" | "id";

const demoPeople: DemoPerson[] = [
  { id: "signal-scholar", name: "Signal Scholar" },
  { id: "kernel-colt", name: "Kernel Colt" },
  { id: "nova-byte", name: "Nova Byte" },
];

interface NoteRowProps {
  person: DemoPerson;
}

// demo4
// Local state makes incorrect row identity visible after reordering.
function NoteRow({ person }: NoteRowProps) {
  const [note, setNote] = useState("");
  return (
    <li className="mini-list-item">
      <label>
        <strong>{person.name}</strong> — note{" "}
        <input value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <p>Record ID: {person.id}</p>
    </li>
  );
}

interface ExperimentProps {
  mode: KeyMode;
}

function Experiment({ mode }: ExperimentProps) {
  const [reversed, setReversed] = useState(false);
  const people = reversed ? demoPeople.slice().reverse() : demoPeople;

  return (
    <>
      <h2>{mode === "index" ? "Broken: index keys" : "Fixed: stable ID keys"}</h2>
      <p>Type "Signal note" beside Signal Scholar, then reverse the order.</p>
      <button type="button" className="btn btn-secondary" onClick={() => setReversed(!reversed)}>
        Reverse order
      </button>
      <ul>
        {/* demo4 */}
        {/* Broken throwaway version: identity belongs to the position. */}
        {mode === "index"
          ? people.map((person, index) => <NoteRow key={index} person={person} />)
          : // demo4
            // Replacement: identity belongs to the person, even when the position changes.
            people.map((person) => <NoteRow key={person.id} person={person} />)}
      </ul>
    </>
  );
}

// This isolated teaching page is the only place with intentionally incorrect keys.
export default function KeyIdentityDemo() {
  const [mode, setMode] = useState<KeyMode>("index");
  return (
    <main className="app-main">
      <h1>Demo 4 — Stable keys and list identity</h1>
      <p>Temporary teaching example. Notes stay on this page and are not saved.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setMode(mode === "index" ? "id" : "index")}
      >
        {mode === "index"
          ? "Use stable IDs (reset experiment)"
          : "Use index keys (reset experiment)"}
      </button>
      {/* demo4 */}
      {/* Changing mode starts a fresh experiment; enter the note again before comparing. */}
      <Experiment key={mode} mode={mode} />
      <a href="/react.html#people">Back to the portal</a>
    </main>
  );
}
