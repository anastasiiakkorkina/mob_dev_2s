// demo8
// Navigation metadata; route matching and history are owned by React Router.
export const views = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard" },
  { id: "evidence", label: "Evidence", path: "/evidence" },
  { id: "people", label: "People & Locations", path: "/team" },
  { id: "timeline", label: "Timeline", path: "/timeline" },
  { id: "workspace", label: "Workspace", path: "/workspace" },
] as const;

export type View = (typeof views)[number]["id"];
