# Exercise 6 — Effects, Data Fetching & a Backend

This is the sixth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3–5. All 5 views should already be fully working in React, reading their data from the static `data/*.json` files. This exercise replaces those static files with a small **Node.js backend**, and uses that to properly teach effects, loading/error/empty states, and request cancellation. Things that are hard to demonstrate convincingly against files that can only ever be "instant" or
"404."

**Scope of the backend, deliberately kept small:** a minimal Node server (Express or equivalent) that serves the same 5 JSON files as **read-only** REST endpoints. No write endpoints, no persistence. Bookmarks, notes, and the hypothesis draft stay in `localStorage` exactly as before. Only *reading* the case data moves to the network. **The backend runs locally in development only, it is not deployed.** Exercise 2's GitHub Pages workflow still builds and deploys the static frontend. Wiring up a real deployed backend is out of scope here.


## Corresponding manuscript reading

The closest corresponding sections in the course manuscript:

- **Chapter 6, Promises, `async`/`await`, and Error Flow** — especially error handling, cleanup, cancellation, and relevance, PDF pp. 47–52
- **Chapter 13, Rendering and Navigation Architectures** — “SPA communication flow” and “State in long-lived applications,” PDF pp. 91–93
- **Chapter 15, React Foundations** — “Function components and purity” and “React owns its root DOM,” PDF pp. 104 and 108
- **Chapter 16, React Component Design and Routing** — “Conditional rendering,” PDF p. 110


## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.
These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Render logic vs. effects | ☐ |
| 2 | `useEffect` mental model & dependency arrays | ☐ |
| 3 | Cleanup: timers & subscriptions | ☐ |
| 4 | Build the read-only Node backend | ☐ |
| 5 | Consume the backend from React | ☐ |
| 6 | Loading, error, and empty states | ☐ |
| 7 | Request races & cancellation | ☐ |
| 8 | Extract a reusable custom hook | ☐ |
| 9 | Separate UI, application logic, and API access | ☐ |
| 10 | Data-flow wrap-up & a written UX decision | ☐ |
---

## Demo 1 — Render logic vs. effects

**Tasks**

- [x] Find (or deliberately write, then remove) an example of a **side effect performed directly
during a component's render**. For example, mutating a variable outside the component,
calling `console.log` for debugging on every render, or reading `localStorage` inline in the
function body instead of in an effect, and explain why it's a side effect even though it
"seems to work."

  **Example:** A temporary `console.log("EvidencePage rendered")` in the component body is a bad
  example. I removed it after identifying it. It writes to the browser console, which is outside
  React's UI calculation. It may look harmless, but it runs whenever React renders the component,
  so the message can appear more times than expected. (The current `localStorage` reads in `App`
  are inside lazy state initializers; they read saved values to set initial state. Storage writes
  are correctly done in effects after React commits.)

- [x] Write, in your own words, a short rule for what belongs in render versus what belongs in an effect.

  **Rule:** Render should calculate the UI from props and state without changing anything outside
  React. Use an effect to synchronize with something outside React, such as browser storage,
  timers, subscriptions, or network requests.

**Questions** (depend on the tasks above)

- [x] Why can React call a component's render function more than once, or at times you don't
expect (e.g. in development with Strict Mode)? What would go wrong with the side-effect
example you found if render ran twice?

  **ANSWER:** React may render again when state or props change, when a parent renders, or when
  development Strict Mode checks that rendering is safe. Rendering calculates a possible UI, and
  React may repeat or discard that calculation before showing it. If the `console.log` example
  ran twice, it would print twice even if the user saw only one update. A real external change in
  render, such as incrementing a shared counter, could happen twice too.

- [x] Is calculating a derived value (like the filtered evidence list from Exercise 5) a side
effect? Why or why not, and how does that distinction inform the rule you wrote?

  **ANSWER:** No. The filtered evidence list is calculated from the evidence and current filter
  values, and it does not change either input or anything outside React. The same inputs give the
  same result. It belongs in render. Effects are for synchronizing with the outside world, not
  for ordinary calculations that produce the UI.

---

## Demo 2 — `useEffect` mental model & dependency arrays

**Tasks**

- [x] Write a small `useEffect` example (can be a throwaway one first) with an empty dependency
array, one with a populated dependency array, and one with no array at all, and observe how
often each one actually runs.

  **Demo:** Open `react.html#/_demo/effect-runs`, then open the browser console and press
  **Render again**. `EffectRunsDemo` logs one message for each dependency pattern. In development,
  this app uses Strict Mode, so React does an extra initial effect setup/cleanup check: on mount
  each of the three messages appears twice. After pressing the button, the empty-array effect does
  not log again; the `[count]` effect logs once with the new count; and the no-array effect logs
  once after the new render. In production, the initial setup runs once.
- [x] Find a real, justified use for `useEffect` you'll need in this app (loading data is coming in Demo 5, so pick something else — e.g. syncing the document title to the current view).

  **Use:** `App` syncs `document.title` with the current route. The browser title is outside
  React's rendered page, so an effect updates it after the route commits. Its dependency is the
  title string, so it updates when the user navigates to another view.

**Questions** (depend on the tasks above)

- [x] What does React actually compare, between renders, to decide whether to re-run an effect with a populated dependency array? What happens if you omit a value your effect actually uses from that array?

  **ANSWER:** React compares each dependency with its previous value using `Object.is`. If any
  dependency changed, React runs the effect again after the render. If I omit a value the effect
  reads, React may not run it when that value changes, so the effect can use an old value. I should
  list every prop, state value, or component variable that the effect uses.
- [x] What's the difference, in practice, between `useEffect(fn, [])` and just writing `fn()` directly in the component body? Why doesn't the second one work the way you'd expect for "run once"?

  **ANSWER:** `useEffect(fn, [])` runs after React commits the component, and it does not run again
  for later updates (apart from the extra development check in Strict Mode). Writing `fn()` in the
  component body runs during every render, because React calls the component again when state or
  props change. It is not a “run once” place, and an external action there could happen repeatedly
  or while React is still deciding which UI to commit.

---

## Demo 3 — Cleanup: timers & subscriptions

**Tasks**

- [x] Implement at least one effect that sets up something needing cleanup (a `setTimeout`/
`setInterval`, a `window` event listener, or similar) and returns a proper cleanup function.

  **Demo:** Open `react.html#/_demo/cleanup` and the browser console. With **Enable timeout
  cleanup** checked, press **Change delay and restart timer**: the console shows cleanup
  cancelling the old timeout, then setup for the new delay. The old timeout does not fire. Leave
  this route before the new timer fires to see cleanup on unmount. Then uncheck cleanup and change
  the delay again before the timer fires: the old timeout remains scheduled and its “Timer fired”
  message appears. With cleanup off, leaving the route also leaves the pending timeout active.
  Strict Mode may show an extra setup and cleanup during the initial development check.

**Questions** (depend on the tasks above)

- [x] What actually calls your cleanup function, and when? Name at least two distinct situations that trigger it.

  **ANSWER:** React calls the cleanup function returned by the effect. It calls it before running
  the effect again when a dependency changes, and when the component unmounts. In development,
  Strict Mode also runs an extra setup and cleanup cycle to check the effect.
- [x] What real, observable bug would you get in this app if you set up a subscription/timer in an effect but forgot the cleanup function? Be specific, not just "a memory leak."

  **ANSWER:** The cleanup demo shows the timer's message appearing after I change the delay or
  leave its page. In a real view, an old delayed action could show a “saved” message after I left
  Workspace or apply an earlier search after I entered a newer one. Clearing the timer stops work
  that no longer belongs to the current view or current value.

---

## Demo 4 — Build the read-only Node backend

**Tasks**

- [x] Set up a minimal Node.js server (Express or equivalent) with one GET endpoint per data
resource (case, evidence, people, locations, timeline), each returning the same shape of data
as the corresponding `data/*.json` file does today.
- [x] Add a way to deliberately simulate real-world conditions for testing later demos: an artificial delay (configurable, e.g. via a query param or env var) on at least one endpoint, and a way to make one endpoint return an error response (e.g. a 500) on demand.
- [x] Confirm the server runs locally alongside `vite dev` and is documented (a README section is enough) as dev-only (not part of the Exercise 2 deploy pipeline).

  **Demo:** Run `npm run dev:api` and `npm run dev` in separate terminals. The API serves all five
  resources under `/api/`. For example, `/api/evidence?delay=1500` waits 1.5 seconds and
  `/api/evidence?fail=1` returns HTTP 500. The README explains that this API is local-only and
  omitted from the static build/deployment.

**Questions** (depend on the tasks above)

- [x] Why does this exercise ask for artificial delay/error controls on the backend, instead of just pointing the frontend at the static JSON files directly (as it already could)? What could you *not* teach convincingly without them?

  **ANSWER:** Static files usually load too quickly and do not provide a reliable way to trigger a
  server error. The delay and failure controls let me demonstrate loading and error states, request
  races, and cancellation on demand. Those behaviors would be difficult to reproduce reliably with
  local files alone.
- [x] What is CORS, and did you have to deal with it running your frontend (from Vite's dev server) against this separate backend server? If yes, what did you configure and why? If no, why not?

  **ANSWER:** CORS is a browser rule that controls whether a page from one origin can read a
  response from another origin. I did not need to add CORS headers: the frontend requests `/api/`
  from the Vite origin, and Vite proxies that request to the local Node server. The browser sees a
  same-origin request. Calling port 3001 directly from browser code would be a different origin
  and would need CORS configuration.

---

## Demo 5 — Consume the backend from React

**Tasks**

- [ ] Replace at least one view's data source (previously the static `data/*.json` fetch/import) with a real `fetch()` call to your new backend, wired up inside a `useEffect`.
- [ ] Do the same for the rest of the app's data sources, so the whole app now reads from your backend rather than static files.

**Questions** (depend on the tasks above)

- [ ] Walk through exactly what happens, in order, from the component mounting to the data actually being available to render: what does the effect do, when does it run, and what causes the component to re-render once the data arrives?
- [ ] What's different about your component now compared to before (when data came from a static
import/fetch of a local file). Specifically in terms of what state it needs to track that it
didn't need before?

---

## Demo 6 — Loading, error, and empty states

**Tasks**

- [ ] For at least one view, implement all three states explicitly: a loading indicator while the fetch is pending, a real error message if it fails (using your backend's on-demand error endpoint from Demo 4 to trigger it live), and a distinct "no data" empty state if the response is successful but contains nothing.
- [ ] Make sure these three states are visually and structurally distinguishable from each other, not all three collapsing into "shows nothing."

**Questions** (depend on the tasks above)

- [ ] Trigger your backend's error endpoint live and show the error state appearing. What state variable(s) are you tracking to distinguish "loading," "error," and "loaded successfully but empty" from each other?
- [ ] The original vanilla app had a bug where a failed fetch could leave a loading spinner stuck forever because the cleanup/hide-loading step was never called on the error path. Explain specifically how your React version's state management makes that particular mistake
harder to make (or show that it doesn't, and fix it).

---

## Demo 7 — Request races & cancellation

**Tasks**

- [ ] Using your backend's artificial-delay control, construct a request race: trigger a request, then trigger another one (for the same data) before the first resolves, and observe
what happens if you do nothing special about it. Does the UI ever show a result from the
*older* request after a newer one already resolved?
- [ ] Fix it using `AbortController` (or a request-id/"ignore stale response" guard, your choice), so the UI can never show a stale result.

**Questions** (depend on the tasks above)

- [ ] Reproduce the race live (with artificial delay dialed up) before your fix, then show the fix preventing it. What exact sequence of events causes the stale result to win without the fix?
- [ ] `AbortController` cancels the *request*. Does the effect's cleanup function run separately, or is aborting the fetch itself what you're doing inside the cleanup? Explain how the two connect in your implementation.

---

## Demo 8 — Extract a reusable custom hook

**Tasks**

- [ ] Extract the data-fetching logic (loading/error/empty state, the effect, cancellation) you've built across Demos 5–7 into at least one reusable custom hook (e.g. `useFetch<T>(url)` or a more specific `useEvidence()`), and use it in at least two different places.

**Questions** (depend on the tasks above)

- [ ] What makes something a legitimate custom hook rather than just a regular helper function? What rule(s) does React enforce about how/where hooks (including your custom one) can be called?
- [ ] Show the two places using your hook. What did extracting it save you from duplicating, and is there anything about the two usages that *couldn't* be shared and had to stay specific to each call site?

---

## Demo 9 — Separate UI, application logic, and API access

**Tasks**

- [ ] Organize your data-fetching code into distinct layers: a thin API-access layer (raw `fetch` calls, knows the backend's URLs/shapes and nothing else), your custom hook(s) from Demo 8 (application logic: loading/error/cancellation), and your components (UI only, no direct `fetch` calls anywhere in a component).
- [ ] Confirm no component in the app calls `fetch` directly anymore.

**Questions** (depend on the tasks above)

- [ ] If your backend's endpoint URLs or response shape changed tomorrow, how many files would you need to touch, and which ones? Would any component need to change?
- [ ] What's the argument *against* this separation for a small app like this one? E.g. when would the extra layering be overkill rather than helpful? Do you think it's justified here?

---

## Demo 10 — Data-flow wrap-up & a written UX decision

**Tasks**

- [ ] Illustrate the full data flow for one piece of data, end to end: the JSON file -> your backend endpoint -> the API-access layer -> your custom hook -> the component -> what's on screen.
- [ ] Explain a short, honest justification for one loading/error/empty-state UX decision you made (e.g. what your loading indicator looks like, how errors are worded, what "empty" looks like) and note one thing you'd do differently with more time.

**Questions** (depend on the tasks above)

- [ ] Walk through your diagram/illustration live, and for one step, explain what would break (and how you'd notice) if that step silently stopped happening.
- [ ] Across Exercises 3–6, this app went from "read static files instantly" to "fetch from a real, sometimes-slow, sometimes-failing server". What did that change force you to add that wasn't needed before and was any of it needed *conceptually* even back when the data source was a static file, just less visible?

---
