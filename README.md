# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

This application uses `fetch()` to load its case data from local JSON files, so it must be served
over HTTP — opening `index.html` directly from the filesystem (`file://`) will not work in most
browsers.

Any static file server will do. For example, from the project root:

```bash
# Python 3
python -m http.server 8080

# Node.js (no install required)
npx serve .

# VS Code
# Use the "Live Server" extension
```

Then open `http://localhost:8080` (or whatever port your server prints) in your browser.

## Exercise 6: local development API

The read-only Node API is for local development exercises only. It is not part of the static
production build or a deployment server. Start it in one terminal:

```bash
npm run dev:api
```

Start the Vite frontend in a second terminal:

```bash
npm run dev
```

Vite forwards `/api/*` requests to the API on `127.0.0.1:3001`. The available GET endpoints are
`/api/case`, `/api/evidence`, `/api/people`, `/api/locations`, and `/api/timeline`. Each endpoint
returns the same JSON shape as its matching file in `data/`.

To simulate a slow response, add `?delay=1500` (milliseconds), for example
`/api/evidence?delay=1500`. To request a demonstration error, use
`/api/evidence?fail=1`, which returns HTTP 500. `API_DELAY_MS` can set a default delay for all
resources. The optional query delay is capped at 10 seconds.

The Vite proxy keeps browser requests on the frontend's origin, so this development setup does not
need CORS headers. The API binds to localhost and is not included in `vite build` or the static
GitHub Pages deployment. The React preview now reads its case records from this API, so use both
development commands above to run its data views. The vanilla app continues to read the static
JSON files. A deployed React preview needs a separately configured backend URL, which is outside
this exercise's deployment scope.

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is an existing brownfield application, not a fresh scaffold. It works for everyday use, but
you should expect to find rough edges, inconsistent patterns, and a handful of bugs as you work
with it — that discovery process is part of the course.
