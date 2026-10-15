import { Navigate, Route, Routes } from "react-router";
import AppHeader from "./AppHeader";
import { StubPage } from "./StubPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import PeopleLocationsPage from "../features/people-locations/PeopleLocationsPage";
// demo9: a dynamic path identifies one person record.
import PersonDetailPage from "../features/people-locations/PersonDetailPage";
import TimelinePage from "../features/timeline/TimelinePage";
import { useCaseData, type CaseData } from "./useCaseData";

interface AppRoutesProps {
  data: CaseData | null;
  error: string;
}

// demo8
// Explicit routes replace manual hash listeners and currentView state.
export function AppRoutes({ data, error }: AppRoutesProps) {
  const pending = error ? <p role="alert">{error}</p> : <p role="status">Loading case file…</p>;

  return (
    <Routes>
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
      <Route path="/evidence" element={<StubPage view="evidence" />} />
      <Route path="/workspace" element={<StubPage view="workspace" />} />
      {/* demo8: keep the old People link useful and make the unknown-route policy explicit. */}
      <Route path="/people" element={<Navigate to="/team/people" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  // The shell owns loaded data, so navigation does not reload the records.
  const { data, error } = useCaseData();
  return (
    <>
      <AppHeader />
      <main id="app" className="app-main">
        <AppRoutes data={data} error={error} />
      </main>
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
