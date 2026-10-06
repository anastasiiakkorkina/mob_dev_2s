import { views, type View } from "./routing";

export function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Case Dashboard</h2>
      <div className="intro-card">
        <h3>Welcome to the investigation portal</h3>
        <p>Use the navigation above to explore the case.</p>
        <p>The case summary and statistics will be added in the next demo.</p>
      </div>
    </section>
  );
}

export function StubPage({ view }: { view: Exclude<View, "dashboard"> }) {
  const label = views.find((item) => item.id === view)?.label;
  return (
    <section aria-labelledby={`${view}-title`}>
      <h2 id={`${view}-title`}>{label}</h2>
      <div className="intro-card">
        <p>This section is coming soon.</p>
      </div>
    </section>
  );
}
