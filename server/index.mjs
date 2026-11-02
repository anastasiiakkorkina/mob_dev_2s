import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Resolve case files relative to this module, not to the shell's current folder.
const serverDirectory = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(serverDirectory, "../data");

// Keep the public API small and map each route to its existing JSON file.
const resources = new Map([
  ["case", "case.json"],
  ["evidence", "evidence.json"],
  ["people", "people.json"],
  ["locations", "locations.json"],
  ["timeline", "timeline.json"],
]);

// Read integer millisecond values and reject negative or unreasonably long delays.
function readDelay(value, fallback = 0) {
  const milliseconds = Number.parseInt(value ?? String(fallback), 10);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return fallback;
  return Math.min(milliseconds, 10_000);
}

// Use a small promise so delayed responses follow the same request path as normal ones.
function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

const port = Number.parseInt(process.env.API_PORT ?? "3001", 10);

const server = createServer(async (request, response) => {
  // Parse the request URL against a local base because Node supplies a relative path.
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  const resourceName = requestUrl.pathname.replace(/^\/api\//, "");
  const filename = resources.get(resourceName);

  // Return a small JSON error for every unsupported path or method.
  if (!filename) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "API resource not found" }));
    return;
  }
  if (request.method !== "GET") {
    response.writeHead(405, {
      Allow: "GET",
      "Content-Type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ error: "Only GET requests are supported" }));
    return;
  }

  // A query parameter overrides the optional default delay from the environment.
  const delay = readDelay(requestUrl.searchParams.get("delay"), readDelay(process.env.API_DELAY_MS));
  if (delay > 0) await wait(delay);

  // Fail one known resource on demand so the frontend can practice error states.
  if (resourceName === "evidence" && requestUrl.searchParams.get("fail") === "1") {
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Evidence service failure requested for the demo" }));
    return;
  }

  try {
    // Send the original parsed JSON so API responses match the static data shape.
    const contents = await readFile(resolve(dataDirectory, filename), "utf8");
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(contents);
  } catch (error) {
    // Keep filesystem details in the server log and return a generic response to callers.
    console.error(`Could not read ${filename}:`, error);
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Could not read the requested case data" }));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Development case API listening at http://127.0.0.1:${port}`);
});
