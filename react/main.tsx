import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
// demo8: hash routes work on the existing static multi-page deployment.
import { HashRouter } from "react-router";

const container = document.getElementById("react-root");
if (!container) throw new Error("React root container is missing");

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
