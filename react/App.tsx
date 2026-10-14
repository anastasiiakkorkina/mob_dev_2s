import { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import { StubPage } from "./pages";
import DashboardPage from "./DashboardPage";
import PeopleLocationsPage from "./PeopleLocationsPage";
// demo3
// Timeline now renders the loaded event collection in React.
import TimelinePage from "./TimelinePage";
import { useCaseData } from "./useCaseData";
import { readView, type View } from "./routing";

export default function App() {
  const { data, error } = useCaseData();
  const [currentView, setCurrentView] = useState<View>(() => readView(window.location.hash));

  useEffect(() => {
    // URL changes also cover the browser's Back and Forward buttons
    const handleHashChange = () => setCurrentView(readView(window.location.hash));
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (view: View) => {
    window.location.hash = view;
  };

  return (
    <>
      <AppHeader currentView={currentView} onNavigate={navigate} />
      <main id="app" className="app-main">
        {currentView === "dashboard" || currentView === "people" || currentView === "timeline" ? (
          error ? (
            <p role="alert">{error}</p>
          ) : data ? (
            currentView === "dashboard" ? (
              <DashboardPage data={data} />
            ) : currentView === "timeline" ? (
              <TimelinePage events={data.timeline} />
            ) : (
              <PeopleLocationsPage
                people={data.people}
                // people={[]}
                locations={data.locations}
                // locations={[]}
                evidence={data.evidence}
                // evidence={[]}
              />
            )
          ) : (
            <p role="status">Loading case file…</p>
          )
        ) : (
          // StubPage means that the page is not implemented yet, but we still want to show the user that the page exists and is accessible
          <StubPage key={currentView} view={currentView} />
        )}
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
