import { Navigate, Route, Routes, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import DashboardPage from "../features/dashboard/DashboardPage";
import PeopleLocationsPage from "../features/people-locations/PeopleLocationsPage";
// demo9: a dynamic path identifies one person record.
import PersonDetailPage from "../features/people-locations/PersonDetailPage";
import TimelinePage from "../features/timeline/TimelinePage";
import { useCaseData, type CaseData, type CaseDataDemoMode } from "./useCaseData";
import EvidencePage from "../features/evidence/EvidencePage";
import WorkspacePage from "../features/workspace/WorkspacePage";
import { useEffect, useState } from "react";
import { STORAGE_KEY_BOOKMARKS, STORAGE_KEY_NOTES } from "../../modules/state";
import { BookmarkProvider } from "./BookmarkContext";
import EffectRunsDemo from "../demos/EffectRunsDemo";
import CleanupDemo from "../demos/CleanupDemo";
import { views } from "./routing";

// LAB6, demo 6. Keep async status available to every data-backed route.
interface AppRoutesProps {
  data: CaseData | null;
  error: string;
  loading: boolean;
  notes: Record<string, string>;
  onSaveNote: (id: string, text: string) => void;
}

// demo8
// Explicit routes replace manual hash listeners and currentView state.
// LAB6, demo 6. Keep loading and failure markup visibly distinct.
export function AppRoutes({ data, error, loading, notes, onSaveNote }: AppRoutesProps) {
  const pending = error ? (
    <div className="case-state case-state--error" role="alert">
      <h2>Could not load case data</h2>
      <p>{error}</p>
    </div>
  ) : loading ? (
    <div className="case-state case-state--loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Loading case file…</p>
    </div>
  ) : (
    <div className="case-state case-state--error" role="alert">
      <h2>Case data is unavailable</h2>
      <p>Please reload the page and try again.</p>
    </div>
  );

  return (
    <Routes>
      {/* Keep the effect timing example available for a live classroom demonstration. */}
      <Route path="/_demo/effect-runs" element={<EffectRunsDemo />} />
      {/* This route compares timer cleanup with a deliberately missing cleanup. */}
      <Route path="/_demo/cleanup" element={<CleanupDemo />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={data ? <DashboardPage data={data} /> : pending} />
      <Route path="/team" element={<Navigate to="/team/people" replace />} />
      {/* demo9: the matched personId is read and checked inside PersonDetailPage. */}
      <Route
        path="/team/people/:personId"
        element={
          data ? <PersonDetailPage people={data.people} evidence={data.evidence} /> : pending
        }
      />
      <Route
        path="/team/people"
        element={
          data ? (
            <PeopleLocationsPage
              people={data.people}
              locations={data.locations}
              evidence={data.evidence}
              tab="people"
            />
          ) : (
            pending
          )
        }
      />
      <Route
        path="/team/locations"
        element={
          data ? (
            <PeopleLocationsPage
              people={data.people}
              locations={data.locations}
              evidence={data.evidence}
              tab="locations"
            />
          ) : (
            pending
          )
        }
      />
      {/* demo10: pass people for validating and displaying URL filter values. */}
      <Route
        path="/timeline"
        element={data ? <TimelinePage events={data.timeline} people={data.people} /> : pending}
      />
      <Route
        path="/evidence"
        element={
          data ? (
            <EvidencePage
              evidence={data.evidence}
              people={data.people}
              locations={data.locations}
            />
          ) : (
            pending
          )
        }
      />
      <Route
        path="/workspace"
        element={
          data ? (
            // Pass the parent-owned save action through the route to the Workspace form.
            <WorkspacePage
              evidence={data.evidence}
              people={data.people}
              notes={notes}
              onSaveNote={onSaveNote}
            />
          ) : (
            pending
          )
        }
      />
      {/* demo8: keep the old People link useful and make the unknown-route policy explicit. */}
      <Route path="/people" element={<Navigate to="/team/people" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  // LAB6, demo 6. Read a demo mode from the current HashRouter query string.
  const { pathname, search } = useLocation();
  const requestedMode = new URLSearchParams(search).get("demo6");
  const demoMode: CaseDataDemoMode =
    requestedMode === "delay" || requestedMode === "error" || requestedMode === "empty"
      ? requestedMode
      : "normal";

  // Read the current route so the browser tab title follows navigation.
  // Find the matching view label, including nested People routes.
  const activeView = views.find(
    (view) => view.path === pathname || (view.id === "people" && pathname.startsWith("/team/")),
  );
  // Keep the dependency as the exact title value used by the effect.
  const pageTitle = `${activeView?.label ?? "Dashboard"} | Project ReMotion`;
  // Update the browser document after React commits this route.
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  // The shell owns loaded data, so navigation does not reload the records.
  // LAB6, demo 6. Loading, error, and empty evidence use separate signals.
  const { data, error, loading } = useCaseData(demoMode);
  // App is the lowest common owner of bookmark readers and the Evidence toggle action.
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKMARKS) ?? "[]");
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
    } catch {
      return [];
    }
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTES) ?? "{}");
      return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, string>)
        : {};
    } catch {
      return {};
    }
  });

  // Effects synchronize committed React state with browser storage outside render.
  // Keeping these writes here avoids changing localStorage during a render attempt.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  // Pass this callback to the pages that can change the shared bookmark list.
  function toggleBookmark(id: string) {
    // Use the latest state, even if React has queued more than one toggle before rendering.
    setBookmarks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function saveNote(id: string, text: string) {
    // Merge into the latest notes object so queued saves do not overwrite each other.
    setNotes((current) => ({ ...current, [id]: text }));
  }

  return (
    <>
      <BookmarkProvider value={{ bookmarks, onToggleBookmark: toggleBookmark }}>
        <AppHeader />
        <main id="app" className="app-main">
          {/* LAB6, demo 6. Pass request state so routes can show loading or failure. */}
          <AppRoutes
            data={data}
            error={error}
            loading={loading}
            notes={notes}
            onSaveNote={saveNote}
          />
        </main>
      </BookmarkProvider>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal — Research Center AI, Software and IT-Security of
          HCW (fictional case study)
        </p>
        <a href="./index.html#dashboard">Open the original portal</a>
      </footer>
    </>
  );
}
