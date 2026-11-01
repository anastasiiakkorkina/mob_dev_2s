import type { CaseRecord, EvidenceRecord, TimelineEvent } from "../../../modules/state";
import { formatDate } from "../../../modules/lookup_helpers";
import type { CaseData } from "../../app/useCaseData";
// demo7
// Reuse the shared visual component instead of a Dashboard-only badge.
import Badge from "../../shared/components/Badge";
import { useBookmarks } from "../../app/BookmarkContext";

function CaseSummary({ caseData }: { caseData: CaseRecord }) {
  return (
    <div className="case-summary-card">
      <h3>{caseData.title || "Case"}</h3>
      <p>
        {/* demo7: the case summary supplies its own label and warning tone. */}
        <Badge label={(caseData.status || "unknown").toUpperCase()} tone="warning" />
      </p>
      <p>{caseData.summary}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ReviewProgress({
  reviewedCount,
  totalCount,
}: {
  reviewedCount: number;
  totalCount: number;
}) {
  const percentage = totalCount === 0 ? 0 : Math.round((reviewedCount / totalCount) * 100);
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div
        className="progress-bar-outer"
        role="progressbar"
        aria-label="Evidence review progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div className="progress-bar-inner" style={{ width: `${percentage}%` }} />
      </div>
      <p>{percentage}% of evidence reviewed</p>
    </div>
  );
}

function RecentEvidenceList({ evidence }: { evidence: EvidenceRecord[] }) {
  // Sort a copy: rendering must not mutate the shared records.
  const recent = evidence
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {recent.length === 0 && <p>No evidence loaded yet.</p>}
      {recent.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> — {item.title}{" "}
          {/* demo7: evidence status is mapped to a visual tone here, not inside Badge. */}
          <Badge
            label={item.status}
            tone={
              item.status.toLowerCase() === "reviewed"
                ? "positive"
                : item.status.toLowerCase() === "flagged"
                  ? "warning"
                  : "neutral"
            }
          />
        </div>
      ))}
    </div>
  );
}

function RecentTimelineList({ timeline }: { timeline: TimelineEvent[] }) {
  const recent = timeline.slice(-5).reverse();
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {recent.length === 0 && <p>No timeline events loaded yet.</p>}
      {recent.map((event) => (
        <div className="mini-list-item" key={event.id}>
          <strong>{formatDate(event.time)}</strong>
          <br />
          {event.title}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage({ data }: { data: CaseData }) {
  const { bookmarks } = useBookmarks();
  // Derive the count from the shared Context value instead of storing another copy.
  const bookmarkCount = bookmarks.length;
  const reviewedCount = data.evidence.filter(
    (item) => (item.status || "").toLowerCase() === "reviewed",
  ).length;
  return (
    <section aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Case Dashboard</h2>
      <CaseSummary caseData={data.caseData} />
      <div className="stat-grid">
        <StatCard value={data.evidence.length} label="Evidence items" />
        <StatCard value={data.people.length} label="People" />
        <StatCard value={data.locations.length} label="Locations" />
        <StatCard value={bookmarkCount} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>
      <ReviewProgress reviewedCount={reviewedCount} totalCount={data.evidence.length} />
      <div className="dashboard-columns">
        <RecentEvidenceList evidence={data.evidence} />
        <RecentTimelineList timeline={data.timeline} />
      </div>
    </section>
  );
}
