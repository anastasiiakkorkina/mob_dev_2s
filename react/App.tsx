import { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import { DashboardPage, StubPage } from "./pages";
import { readView, type View } from "./routing";

export default function App() {
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
        {currentView === "dashboard" ? (
          <DashboardPage />
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
