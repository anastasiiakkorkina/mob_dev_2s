import { views, type View } from "./routing";

interface AppHeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function AppHeader({ currentView, onNavigate }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img src="assets/logo/logo.svg" alt="Project ReMotion logo" className="brand-logo" />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`nav-btn${currentView === view.id ? " active" : ""}`}
              // aria-current is used by screen readers to indicate the current page in a navigation menu
              aria-current={currentView === view.id ? "page" : undefined}
              onClick={() => onNavigate(view.id)}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
