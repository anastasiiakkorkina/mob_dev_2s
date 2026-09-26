# Exercise 2 — Build Tooling, TypeScript & CI/CD

This is the second exercise in Advanced Web Engineering Course (CSDC). It builds directly on
**Exercise 1**, you need the ES-module split from that exercise finished first, since this exercise migrates those modules to TypeScript and puts them through a real build pipeline.

By the end of this exercise the project will: be managed by a package manager instead of a plain
`<script>` tag, run through Vite for both development and production builds, be written in
TypeScript instead of JavaScript, and be linted, formatted, and deployed automatically by GitHub
Actions whenever code is pushed.

**Out of scope for this exercise** (these come later in the course): migrating to a framework (e.g.
React)

Keep a running note of what you changed and why. As in Exercise 1, **commits are the easiest way to
demonstrate a before/after live**, e.g. "workflow fails here, passes after this commit," or "this
compiled fine in JS, here's the TypeScript error it produces and the fix."

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 7, The Build First Mindset** — PDF pp. 55–57
- **Chapter 8, Dependencies, Package Managers, and Vite** — PDF pp. 58–62
- **Chapter 9, Linting, Formatting, and Asset Processing** — PDF pp. 63–66
- **Chapter 10, TypeScript: Static Types for JavaScript** — PDF pp. 67–78
- **Chapter 11, Continuous Integration and Automated Deployment** — PDF pp. 80–83

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate
or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Initialize the package manager & project metadata | ☐ |
| 2 | Integrate Vite as the dev server | ☐ |
| 3 | Production build & preview | ☐ |
| 4 | `package.json` scripts: lint & format | ☐ |
| 5 | TypeScript setup & first conversions | ☐ |
| 6 | Typing the domain data | ☐ |
| 7 | Full migration & resolving type errors | ☑ |
| 8 | GitHub Actions: development workflow | ☐ |
| 9 | GitHub Actions: deployment workflow | ☐ |
| 10 | Workflow triggers, permissions & failure modes | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked. The table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Initialize the package manager & project metadata

**Tasks**

- [x] Choose **npm** or **pnpm** and record why you picked it over the other.
- [x] Initialize `package.json` for the project (name, version, description, etc. filled in properly).
- [x] Add a `.gitignore` entry for `node_modules` (and any other tool output you generate in later demos, e.g. `dist/`).
- [x] Install one real dependency (you'll add more in later demos) and show the resulting lockfile (`package-lock.json` or `pnpm-lock.yaml`) committed to the repo.

**Package manager choice:** I chose npm because it is included with Node.js, needs no
extra installation, and is the standard tool for this small vanilla-JavaScript project.

**Questions** (depend on the tasks above)

- [ ] What problem does a package manager actually solve that "download the library and put it in a folder yourself" doesn't? Be specific.
- [ ] What's the difference between `dependencies` and `devDependencies` in `package.json`? Which
      category will Vite, your linter/formatter, and TypeScript belong to, and why?
- [ ] What is a lockfile for, and what could go wrong for your teammates (or CI) if it weren't
      committed to the repo?
- [ ] If you chose pnpm: what does it do differently from npm regarding how `node_modules` is laid out and how disk space/install time is shared across projects? If you chose npm: what would you gain or lose by switching to pnpm on a larger project?

---

## Demo 2 — Integrate Vite as the dev server

**Tasks**

- [x] Install Vite and configure it for this project (restructure files if needed so Vite can find `index.html`/your modules/the `data/` and `assets/` folders correctly).
- [x] Get `vite`'s dev server running the app with the same functionality it had before. Verify every view still works, not just that the page loads.
- [x] Trigger Hot Module Replacement at least once: change something in the running app's source and observe the update happen without a full page reload.

**Demo 2 verification:** The project already had a root `index.html`, ES modules in
`modules/`, and browser-accessible `data/` and `assets/` folders, so no file
restructuring was needed. Vite ran the app at `http://127.0.0.1:5173/`. I opened
Dashboard, Evidence, People & Locations, Timeline, and Workspace. I changed the
background color in `styles.css`; Vite reported an HMR update, and the Workspace
route and unsaved text in its form stayed on screen.

**Questions** (depend on the tasks above)

- [x] What is the difference between how you used to run this app (a plain static file server) and running it through Vite's dev server? Name at least one thing Vite's dev server does that a plain static server doesn't.
- [x] What is Hot Module Replacement, and what specifically did you observe happen (and *not* happen, e.g. to app state) when you triggered it?
- [x] Why does an app already split into ES modules (Exercise 1) integrate naturally with a tool like Vite, compared to the original single-`<script>` version?

**Answers (simple English):**

- A plain static server only sends files to the browser. Vite also runs a development server that understands modules, reports build errors, and updates changed files quickly.
- Hot Module Replacement (HMR) updates changed code in the running page without a full reload. I changed `styles.css`, saw the Vite HMR message, and the page style changed. The `#workspace` route and unsaved text in the form stayed there.
- ES modules work naturally with Vite because each file has clear `import` and `export` links. Vite can follow these links, load only what is needed, and rebuild changed modules. A single script has no such module structure, so it is harder to manage and optimize.

---

## Demo 3 — Production build & preview

**Tasks**

- [x] Run the production build (`vite build`) and inspect the generated `dist/` folder.
- [x] Serve that build locally with `vite preview` (not the dev server) and confirm the app still works end-to-end from the built output.
- [x] Compare the dev-mode source with the built output for at least one file: note what changed (filenames, size, formatting/minification).

**Demo 3 verification:** I ran `npm run build` and inspected `dist/`. The first
preview check showed that runtime JSON files were missing from the build, so I
added `public/data/` and `public/assets/` copies. After rebuilding, `vite preview`
served the complete app at `http://127.0.0.1:4173/`. Dashboard loaded 18 evidence
items, 6 people, and 6 locations; Evidence, People & Locations, Timeline, and
Workspace also worked from the production output.

**Source vs build comparison:** The source uses `styles.css` (14,534 bytes) and
separate files in `modules/`. The build produced `dist/assets/index-xJD9k7pJ.css`
(11,442 bytes) and `dist/assets/index-ivDJeK-9.js` (26,024 bytes). Vite bundled
the modules, created hashed filenames, and produced a browser-ready asset layout.

**Questions** (depend on the tasks above)

- [x] Name at least three concrete transformations Vite applied to your source when building for production (e.g. bundling, minification, hashed filenames. Pick the ones you actually observed).
- [x] Why do production filenames typically include a content hash? What problem does that solve for real deployments?
- [x] Why would you never want to deploy the dev server itself (`vite dev`/`vite`) to real users, even though it "works"?

**Answers (simple English):**

- Vite bundled the ES modules into one JavaScript asset, processed and reduced the CSS, and added content-hashed filenames such as `index-ivDJeK-9.js` and `index-xJD9k7pJ.css`.
- A content hash changes when the file content changes. This prevents browsers from using an old cached file after a new deployment.
- The dev server is made for development, not production. It is not optimized for many real users, may expose development details, and does not provide the final optimized build. Users should receive the files from `dist/`.

---

## Demo 4 — `package.json` scripts: lint & format

**Tasks**

- [x] Install and configure a linter (e.g. ESLint) and a formatter (e.g. Prettier) for this TypeScript/JS project.
- [x] Add these scripts to `package.json`: `dev`, `build`, `lint`, `lint:fix`, `format`. Each one must actually do something real when run, not just print a placeholder.
- [x] Run `lint` and show it catching at least one real issue in your code (introduce one on purpose if you have to). Run `lint:fix` and/or `format` and show it actually changing a file.

**Demo 4 verification:** I installed ESLint and Prettier as project devDependencies.
ESLint first found one real error: `resolvedTerm` was defined but never used in
`modules/evidence_list.js`, plus warnings for diagnostic `console.log` calls. I
removed the unused parameter. Prettier then reformatted the JavaScript modules,
CSS, and JSON files. The final lint run has 0 errors and 9 warnings, and the build
still passes.

**Questions** (depend on the tasks above)

- [x] What's the difference between what a linter checks/fixes and what a formatter checks/fixes? Give one concrete finding from each tool on this codebase.
- [x] Why are `lint` and `lint:fix` two separate scripts instead of one script that always auto-fixes? When would you deliberately want the non-fixing version?
- [x] What does `npm run lint` (or `pnpm lint`) actually do under the hood? Where does npm/pnpm look for the `lint` command, and would it work if your linter weren't installed as a project dependency (only globally on your machine)?

**Answers (simple English):**

- A linter checks code for problems and possible bugs. ESLint found the unused `resolvedTerm` parameter. A formatter only changes style and layout. Prettier reformatted long lines and spacing in the modules.
- `lint` checks without changing files. `lint:fix` may change code automatically. The separate non-fixing command is useful in CI and code review, where we want to detect problems without changing a developer's files.
- `npm run lint` reads the `lint` script from `package.json` and runs the local ESLint executable from `node_modules/.bin`. It works because ESLint is installed in this project. A global-only installation is not reliable for teammates or CI, because they may not have the same global tool or version.

---

## Demo 5 — TypeScript setup & first conversions

**Tasks**

- [x] Install TypeScript and add a `tsconfig.json`. Deliberately choose your strictness settings (don't just copy a default blindly) and be ready to justify at least one setting you turned on or left off.
- [x] Convert 2–3 of your smallest/utility modules from Exercise 1 (e.g. formatting or lookup helpers) from `.js` to `.ts`, with **no `any`**, and get them compiling with zero errors.
- [x] Wire TypeScript into your `build`/`dev` scripts from Demo 4 so type errors are actually surfaced by your tooling, not just by your editor.

**Demo 5 verification:** I installed TypeScript and added `tsconfig.json` with
`strict: true`, `noEmit: true`, ES2022 modules, DOM types, and bundler module
resolution. I converted `state.js`, `lookup_helpers.js`, and `notes_storage.js`
to typed `state.ts`, `lookup_helpers.ts`, and `notes_storage.ts`; no `any` is used.
The old JS copies were removed and all imports now use the TypeScript modules.
Both `npm run dev` and `npm run build` run `tsc --noEmit` before Vite, so type
errors stop the command before the app starts or builds.

**Questions** (depend on the tasks above)

- [x] What does the `strict` option in `tsconfig.json` actually turn on? Name at least two individual checks bundled under it, and say whether you kept it on and why.
- [x] What is the difference between a compile-time type error and the runtime bugs you fixed in Exercise 1? Could TypeScript alone have caught any of those specific bugs? Why or why not?
- [x] What does `any` do to TypeScript's checking for a value, and why did you avoid it in this first pass even though it would have been faster to just silence the errors with it?

**Answers (simple English):**

- `strict` enables stronger checks, including `strictNullChecks` and `noImplicitAny`. I kept it on because it catches unsafe values early. `noEmit` is used because Vite is responsible for the final browser build.
- A compile-time type error is found before the program runs. A runtime bug happens while the app is running. TypeScript could catch mistakes such as using a value with the wrong type, but it cannot by itself catch every wrong value inside a JSON file or every UI behavior bug.
- `any` turns off most type checking for a value. I avoided it because it hides mistakes and makes the TypeScript migration less useful. I used specific interfaces and types instead.

---

## Demo 6 — Typing the domain data

**Tasks**

- [x] Define TypeScript types/interfaces for the case's data model (evidence, people, locations, timeline events) that match the shape of `data/*.json`.
- [x] Convert your data-loading module to use these types instead of untyped `fetch().json()` results.
- [x] Pick one field that was genuinely ambiguous or inconsistent in the original JavaScript version (for example: something that could be either an id or a display name, or a date stored in more than one format) and show what modeling it as a proper TypeScript type forced you to decide.

**Demo 6 verification:** I added `CaseRecord`, `EvidenceRecord`, `PersonRecord`,
`LocationRecord`, and `TimelineEvent` models in `modules/state.ts`. I also added
`PersonId`, `LocationId`, and `EvidenceId` types. The old JavaScript data loader is
now `modules/data_loading.ts`; its `fetchJson<T>()` helper loads typed results for
all four JSON datasets. TypeScript checks it with `strict: true` and no errors.

For the ambiguous field, I chose `evidence.personIds`. JavaScript accepted both
`"nova-byte"` and the inconsistent display name `"Nova Byte"`, so the lookup code
had to check both forms. I normalized the JSON data to use `"nova-byte"` and made
`personIds` use the `PersonId` union type. The code now commits to stable IDs.

**Questions** (depend on the tasks above)

- [x] Walk through the ambiguous field you picked: how did the JavaScript version get away without deciding on one shape, and what did TypeScript force you to commit to?
- [x] Is there a data-shape problem in this app that TypeScript's static types **can't** catch on their own, because the actual bad data would only show up at runtime from a JSON file, not from your code? What would you need in addition to types to catch that?
- [x] What's the difference between an `interface` and a `type` alias for an object shape in TypeScript? Which did you use for your domain models, and does it actually matter here?

**Answers (simple English):**

- In JavaScript, `personIds` was just an array of strings, so both an ID and a person name were accepted. TypeScript made me choose one shape. I chose stable IDs and normalized `"Nova Byte"` to `"nova-byte"`.
- TypeScript checks our code, not the real JSON contents at runtime. For example, a JSON file could contain a missing title or an invalid status. Runtime validation with a schema library such as Zod, or manual checks, would be needed to catch that.
- An `interface` describes an object shape and can be extended or merged. A `type` alias can describe object shapes, unions, and other types. I used interfaces for the domain objects and type aliases for ID unions. For this small project, both could describe objects, so the practical difference is small.

---

## Demo 7 — Full migration & resolving type errors across the app

**Tasks**

- [x] Convert the remaining `.js` modules to `.ts`, and get the **entire app** compiling with zero TypeScript errors under the strictness settings from Demo 5.
- [x] Find at least 3 real spots where the compiler flagged something you had to actually think about (a union type, a possibly-`undefined` value, an implicit `any`, etc.). For each, decide and record whether it pointed at a real latent bug or was "just" the compiler being pedantic.
- [x] Confirm the app still behaves identically to the working JavaScript version — a type-safe app that behaves differently is not a successful migration.

**Questions** (depend on the tasks above)

- [x] Show one specific type error you had to actually think about (not just silence with `any` or the `!` non-null assertion). What did it tell you about your code that plain JS review or testing hadn't?
- [x] When (if ever) is reaching for `any` the right call during a migration like this, versus a sign you should model the type properly? Where did you draw that line?
- [x] Did the migration reveal anything that was a genuine, previously-unnoticed bug (as opposed to just noise)? If yes, explain it. If no, explain how you're confident it was only noise.

**Demo 7 verification:** All application modules now use TypeScript. The files
had already been renamed, but most still needed types. I included `app.ts` and
`modules/**/*.ts` in `tsconfig.json`, kept Demo 5's `strict: true`, and disabled
`allowJs`. I updated the HTML entry point and lint/format scripts. The whole app
passes `npm run build` with zero TypeScript errors, without adding `any` or
non-null assertions. ESLint passes with zero errors and nine console warnings.

**Compiler findings and decisions:**

| Place | Compiler problem | Decision and fix |
|---|---|---|
| Stored hypothesis in `workspace.ts` | Properties such as `suspectId` did not exist on the inferred type `{}`. | Investigating this exposed a **real validation bug**. I read JSON as `unknown`, check that it is an object, and check field types before using them. |
| Timeline model in `state.ts` | `time` did not exist on `TimelineEvent`. | **Incorrect type model, not a JavaScript runtime bug.** JSON and the working UI use `time`, so I changed the interface from `timestamp` to `time`. |
| Date sorting | TypeScript rejected subtraction of two `Date` objects. | **Compiler strictness, not a runtime bug.** JavaScript already converts dates to numbers here. Explicit `.getTime()` preserves the same sorting. |
| DOM elements and events | An element could be `null`; `value` does not exist on every `HTMLElement` or `EventTarget`. | **Unchecked assumptions, not demonstrated failures with the current HTML.** I check element classes with `instanceof`. The shared `requireElement` helper checks required elements instead of using `!`. |

**Behavior comparison:** I ran the same Chrome scenarios against the original
JavaScript UI from Git revision `b3b1155` and the migrated app, including its
production build. All five views, evidence filters, search, four sorting modes,
details, notes, bookmark buttons, people/location tabs, timeline filters and modal,
navigation, and saved hypothesis values matched. Notes and hypothesis values
also survived reload. No uncaught page errors occurred in these scenarios.
A failed evidence request still displayed the error message.

These checks cover the tested workflows, not every possible interaction.
The existing inner bookmark-star click issue remains: clicking the icon can open
the card instead of toggling the bookmark. The comparison checked the button
itself. Malformed storage is the intentional behavior correction explained below.

**Answers (simple English):**

1. **One error that required thought:** The hypothesis loader used
   `let draft = {}`, so TypeScript reported that `draft.suspectId` did not exist.
   Simply asserting a draft type would hide the problem. I used `unknown`,
   checked that the parsed value was an object, and checked individual fields,
   for example `typeof draft.suspectId === "string"`. This showed that an object
   can exist but still contain fields of the wrong type. Normal testing only
   created valid drafts and missed that case. The compiler did not read
   localStorage; its error made me investigate it.

2. **When to use any:** `any` can be a small, temporary escape hatch for an old
   library without useful types, with a clear reason and a plan to remove it.
   It should not spread through the app. Here, records, DOM elements, and
   callbacks have meaningful types, so I modeled them properly. For uncertain
   JSON I used `unknown` and checks. I added no `any`. The existing
   `fetchJson<T>()` still uses an assertion: it does not validate HTTP data at
   runtime, so that remains a limitation.

3. **A real bug:** Yes. With
   `{"suspectId":["nova-byte"],"nature":["deliberate"]}` in localStorage, the old
   version converted these arrays to strings and selected values in the form.
   The fields had the wrong types but looked valid to the user. I reproduced
   this in Chrome. The new code rejects those fields and leaves the selects
   empty. Correct saved drafts still restore as before. This fixes malformed
   input while preserving the normal workflow.

**Manuscript basis:** *Advanced Web Engineering*, Chapter 10, PDF pages 67–78:
10.1–10.2 (type checking and erased types), 10.6–10.8 (narrowing, `unknown`,
`any`, and nullability), 10.16 (runtime validation), and 10.17–10.19 (compiler
settings, limits, and gradual migration).

---

## Demo 8 — GitHub Actions: development workflow

**Tasks**

- [ ] Write a GitHub Actions workflow that triggers on push (and/or pull request), checks out the repo, sets up Node.js at the right version, installs dependencies (with dependency caching), and runs your `lint` and a format-check (e.g. `prettier --check`).
- [ ] Push a commit that deliberately fails lint or format, and show the workflow **failing** in the Actions tab.
- [ ] Fix it and push again, and show the same workflow **passing**.

**Questions** (depend on the tasks above)

- [ ] What is the difference between a workflow, a job, and a step in GitHub Actions? Point to one of each in your workflow file.
- [ ] Why should lint/format run in CI at all, if it already runs (or could run) on every developer's own machine before they push?
- [ ] What is dependency caching doing in your workflow, and what would happen (both correctness- and speed-wise) if you removed it?

---

## Demo 9 — GitHub Actions: deployment workflow

**Tasks**

- [ ] Write a second workflow that, on push to your main branch (or another trigger you choose and can justify), checks out the repo, installs dependencies, lints, builds (`vite build`), and deploys the `dist/` output to GitHub Pages (or an equivalent static host).
- [ ] Confirm the deployed URL actually serves the working app end-to-end, not just that the workflow reports success.
- [ ] Make a real change, push it, and show it going live via the workflow without any manual deployment step.

**Questions** (depend on the tasks above)

- [ ] Why does the deploy workflow re-run lint and build itself, instead of trusting "it already passed on my machine" or reusing Demo 8's workflow's result directly?
- [ ] What is the actual mechanism your deploy workflow uses to publish to GitHub Pages (e.g. a dedicated deploy action publishing an artifact, pushing to a `gh-pages` branch, or something else)? Explain, concretely, what it does.
- [ ] What would you need to change in this workflow if you were deploying to a different static host instead (e.g. Netlify, Vercel, a plain server over SFTP)? What would stay the same?

---

## Demo 10 — Workflow triggers, permissions & failure modes

**Tasks**

- [ ] Deliberately commit a real TypeScript error (or a lint failure) that should block deployment, push it, and show the deploy workflow failing *before* it reaches the deploy step.
- [ ] Identify exactly what permissions and/or secrets your deploy workflow needs to publish to GitHub Pages, and show where they're configured (repository settings, the `permissions:` key in the workflow file, etc.).
- [ ] Open the run history for both workflows and be ready to read a failed run's logs live and explain, to someone unfamiliar with it, what failed and why.

**Questions** (depend on the tasks above)

- [ ] When your build step fails, does the previously-deployed version of the app stay live, get taken down, or something else? Is that the behavior you want, and why?
- [ ] What GitHub Actions permission(s) or secret(s) does your deploy workflow actually need, and where did you grant/store them? What's the security risk of over-granting permissions here?
- [ ] What's the difference between triggering a workflow `on: push`, `on: pull_request`, and `on: workflow_dispatch`? Which did you use for the development workflow (Demo 8) and which for the deployment workflow (Demo 9), and why is that pairing the right one?

---

## What to bring to class

For each of the 10 demos: your changed code/config (ideally as commits you can diff live), the actual GitHub Actions run history for both workflows (not just the files), and the ticked checkboxes
above reflecting what you can genuinely demonstrate and answer *right now*. Be ready to trigger a real workflow run live (e.g. via a small commit) on request, not just describe
one that ran earlier.
