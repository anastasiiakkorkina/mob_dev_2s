// demo7
// Visual tones are shared; each feature decides what its domain status means.
export type BadgeTone = "neutral" | "positive" | "warning" | "critical";

interface BadgeProps {
  label: string;
  tone: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "badge-unreviewed",
  positive: "badge-reviewed",
  warning: "badge-flagged",
  critical: "badge-critical",
};

// demo7
// One typed, presentational wrapper for labels in different features.
export default function Badge({ label, tone }: BadgeProps) {
  return <span className={`badge ${toneClasses[tone]}`}>{label}</span>;
}
