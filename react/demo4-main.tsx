import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import KeyIdentityDemo from "./demos/KeyIdentityDemo";

const container = document.getElementById("demo4-root");
if (!container) throw new Error("Demo 4 root container is missing");

// This lookup only connects the standalone demo to its React mount point.
createRoot(container).render(
  <StrictMode>
    <KeyIdentityDemo />
  </StrictMode>,
);
