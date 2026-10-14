import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import KeyIdentityDemo from "./KeyIdentityDemo";

const container = document.getElementById("demo4-root");
if (!container) throw new Error("Demo 4 root container is missing");
createRoot(container).render(
  <StrictMode>
    <KeyIdentityDemo />
  </StrictMode>,
);
