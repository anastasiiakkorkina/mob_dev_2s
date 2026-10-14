// demo8
// NavLink supplies real links and derives the active state from the URL.
import { NavLink } from "react-router";
import { views } from "./routing";

export default function AppHeader() {
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
            <NavLink
              key={view.id}
              to={view.path}
              className={({ isActive }) => `nav-btn${isActive ? " active" : ""}`}
            >
              {view.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
