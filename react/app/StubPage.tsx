import { views, type View } from "./routing";

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
