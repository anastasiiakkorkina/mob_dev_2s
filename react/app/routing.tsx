export const views = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
] as const;

export type View = (typeof views)[number]["id"];

export function readView(hash: string): View {
  const id = hash.replace(/^#/, "");
  // Use the same Dashboard fallback as the vanilla router.
  return views.find((view) => view.id === id)?.id ?? "dashboard";
}
