# Exercise 3 — React Foundations & First Migration

This is the third exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 1 and 2. This exercise adds
React to that project and migrates the **application shell and one representative view (the Dashboard)** to it. The rest of the app stays vanilla TS for now. You'll migrate more of it in Exercises 4 and 5.

Keep a running note of what you changed and why, and commit as you go. Several theory questions ask you to point at a specific decision or diff you made.

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 12, From Static Documents to Rich Web Applications** — PDF pp. 85–88
- **Chapter 13, Rendering and Navigation Architectures** — PDF pp. 90–95
- **Chapter 14, Hybrid Rendering and Modern Web Architectures** — PDF pp. 96–100
- **Chapter 15, React Foundations** — PDF pp. 102–109

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Historical view of the web | ☐ |
| 2 | SSR vs. CSR | ☐ |
| 3 | The virtual DOM | ☐ |
| 4 | SPA vs. MPA: state & routing | ☐ |
| 5 | React introduction | ☐ |
| 6 | React + TypeScript entry point in the Vite project | ☐ |
| 7 | Component hierarchy for the whole app | ☐ |
| 8 | Architecture Decision Record: why SPA/React | ☐ |
| 9 | Migrate the application shell | ☐ |
| 10 | Migrate the Dashboard view | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Historical view of the web

**Tasks**

- [ ] Give a concise explanation of how web applications evolved over the years and place the app from the exercises on the timeline. Justify where you put it.

**Questions** (depend on the tasks above)
- [ ] What specific problem was AJAX (and libraries like jQuery) solving that plain server-rendered pages couldn't? What new problems did that approach introduce, that SPA frameworks then tried to solve?

ANSWER: With traditional server-rendered pages, many actions required a new request and a full-page reload. AJAX let the browser fetch only the data it needed and update part of the page, making interactions like inline updates and search suggestions feel quicker. jQuery helped developers make requests, select DOM elements, and handle events across browsers.

But developers now had to coordinate data, DOM updates, asynchronous requests, and navigation themselves. This could lead to stale or duplicated UI state, race conditions, and hard-to-maintain event-handler code. SPA frameworks introduced more systematic ways to organise components and render the UI from application state.

- [ ] This app currently uses hash-based routing (`#dashboard`, `#evidence`, ...) with no full page reload between views. Which era does that pattern belong to, and what does it tell you about when this architectural choice became common? 

ANSWER: Hash-based routing belongs to the rise of AJAX-enhanced pages and early client-side SPAs. The fragment (for example, `#dashboard`) can change without requesting a new document, so client code can use it to select a view. This shows that client-side navigation became a common architectural choice as web pages grew into interactive applications; it does not mean that every app from that era used exactly the same routing technique.

---

## Demo 2 — SSR vs. CSR

**Tasks**

- [ ] Present a short comparison table for Server-Side Rendering and Client-Side Rendering. Explain what the server sends on first request, what the browser has to do before the user sees content, and what happens on subsequent navigation.
- [ ] Pick one real, publicly known website and argue whether it's (primarily) SSR or CSR, using
observable evidence (view source, network tab, etc.).

**Questions** (depend on the tasks above)

- [ ] Explain why this exercise application is SSR or CSR and why. Walk through, step by step, what happens between the browser requesting the page and the Dashboard actually being visible.

ANSWER: This app uses CSR for its data-driven content. The server sends a static HTML shell with headings, navigation, and empty content containers. It does not generate the case summary or statistics: browser JavaScript does that. Serving an HTML file alone does not make an app SSR, and CSR does not require React.

| Stage | Server-Side Rendering (SSR) | Client-Side Rendering (CSR) |
|---|---|---|
| First request | The server sends HTML containing the page's main content. | The server sends an HTML shell and links to JavaScript; data may arrive separately. |
| Before content is visible | The browser parses HTML and CSS and paints the content. JavaScript may then add interactivity (hydration). | The browser loads and runs JavaScript, fetches any needed data, creates the content in the DOM, and paints it. |
| Later navigation | In a traditional SSR site, each page needs a new HTML document. Hybrid SSR apps can also navigate on the client. | In a CSR SPA, JavaScript changes the view without reloading the document; it may fetch more data. |

For a normal first visit with no hash or with `#dashboard`:

1. The browser requests `index.html`, then loads the CSS and JavaScript modules. Vite transforms the TypeScript into browser JavaScript. The HTML contains a loading overlay and an empty `#dashboardContent`; CSS initially hides all views.
2. On `DOMContentLoaded`, `initApp()` in `app.ts` restores bookmarks and notes from `localStorage`, registers UI listeners, and calls `loadAllData()`.
3. `modules/data_loading.ts` fetches `case.json`, `people.json`, `locations.json`, `evidence.json`, and `timeline.json` in sequence and stores the results in browser memory. It calls `renderDashboard()` as data arrives.
4. `renderDashboard()` in `modules/dashboard.ts` calculates the statistics and progress, builds HTML, and inserts it into `#dashboardContent` using `innerHTML`.
5. After loading finishes, the overlay is hidden and `handleHashChange()` activates the Dashboard section and renders it again. The browser paints the visible Dashboard. Later navigation changes the hash and active view without requesting a new HTML document.

- [ ] Name one real cost of what the architecture pays for that choice (think about what a user with JavaScript disabled, or a slow connection, or a search engine crawler would see) and why.

ANSWER: The app depends on JavaScript to show useful case content. With JavaScript disabled, the loading overlay stays on screen, the views stay hidden, and no Dashboard data is fetched or rendered. On a slow connection, users must wait for JavaScript and the sequential JSON requests before the Dashboard becomes visible. A crawler that does not run JavaScript also cannot read the case summary from the initial HTML.

---

## Demo 3 — The virtual DOM

**Tasks**

- [ ] In your own words (a few sentences, not a copied definition), explain what the virtual DOM is and what problem it solves.
- [ ] Find one concrete example in the *original* vanilla `app.js` (from before Exercise 1) where a small state change (e.g. toggling one bookmark) caused a large chunk of real DOM to be recreated via `innerHTML`, even though only a tiny part of it actually needed to change.

**Questions** (depend on the tasks above)

- [ ] Using the example you found: how would a virtual-DOM-based approach (conceptually, not necessarily React-specific) avoid recreating the parts that didn't change?

ANSWER: I understand the virtual DOM as a lightweight description of the UI kept in JavaScript memory. After a state change, the library compares the new description with the previous one and updates the real DOM where needed. This helps me keep the UI in sync with state without manually managing every DOM change.

In the original `app.js` (commit `22cb2d8`), toggling one bookmark calls `renderEvidenceList()`. That function builds HTML for every visible evidence card and replaces the whole list with `container.innerHTML = html`, although only one bookmark button needs to change.

With a virtual DOM and stable keys such as evidence IDs, the library can match the existing cards and update only that button's `active` class and star (`☆` to `★`, or back). The unchanged card elements stay in the real DOM, even if their render functions run again.

- [ ] Is the virtual DOM a "faster" way to update the real DOM than directly calling `innerHTML`? Explain precisely what's actually being traded off (think about the diffing work itself).

ANSWER: Not always. The virtual DOM adds work: creating UI descriptions, keeping them in memory, and comparing them. In return, it can avoid replacing a large amount of unchanged DOM. For one bookmark change, this may be cheaper than rebuilding the whole list. But directly updating that button's class and text can be faster because it needs no diffing. The result depends on the size and type of update.

- [ ] Does using a virtual DOM library automatically make your app fast? What could still make a React app slow despite it?

ANSWER: No. A React app can still be slow because of unnecessary re-renders, expensive calculations during rendering, very large lists, large JavaScript downloads, or slow data requests. Unstable keys can also cause elements to be recreated. I still need to measure performance and fix the actual bottleneck; the virtual DOM does not remove these costs.

---

## Demo 4 — SPA vs. MPA: state & routing

**Tasks**

- [ ] Diagram or illustrate live how navigation currently works in this app: what triggers a view change, what code runs, and what does *not* happen (that would happen in a classic multi-page site).

LIVE DEMONSTRATION:

1. I open the app, wait for loading to finish, open DevTools → Network, and clear the request list.
2. I click Evidence, then Timeline. The URL changes to `#evidence`, then `#timeline`. The view changes, but Network shows no new HTML document request.
3. I show the code: the button calls `navigateTo()`, which changes `window.location.hash`. The `hashchange` listener in `app.ts` calls `handleHashChange()` in `modules/navigation.ts`.
4. That function checks the hash, updates `state.currentPage`, moves the `active` class to the selected section and navigation button, and renders the view when needed. CSS hides the other sections.
5. I press Back to return to Evidence. The document and in-memory state stay alive. In a classic MPA, clicking a page link normally requests another HTML document and replaces the current page.

- [ ] List every piece of state in the current app that would be lost on a full page reload, versus what's preserved (hint: check what's in `localStorage` versus what's only in memory).

ANSWER: Reloading creates fresh JavaScript state. Saved values are restored, and the original case data is fetched again.

| State | After a full reload |
|---|---|
| Bookmarks (`remotion_bookmarks`) | Restored from `localStorage`; evidence bookmark flags are rebuilt. |
| Saved notes (`remotion_notes`) | Restored from `localStorage`. Unsaved note-editor text is lost. |
| Hypothesis (`remotion_hypothesis`) | Restored from `localStorage`: suspect, incident nature, evidence IDs, confidence, explanation, alternative explanation, and save time. Form input/change events save it automatically. |
| Current view (`currentPage`) | Memory resets, but the view is restored from the URL hash after loading. An empty or invalid hash shows Dashboard. |
| `caseData`, `allEvidence`, `allPeople`, `allLocations`, `allTimeline` | Memory resets; JSON is fetched again. Unsaved changes to evidence status and relevance are lost. |
| Evidence search, type/person/location/status/relevance filters, sort selection, `filteredEvidence` | Not saved by the app; controls start from HTML defaults and results are rebuilt. |
| `selectedEvidence` and open detail view | Reset; the selected item is not saved in the URL or storage. |
| `currentPeopleTab` | Resets to People. |
| Timeline order and person/location/type filters | Not saved by the app; return to HTML defaults. |
| `dataLoaded`, `evidenceViewLoading`, `evidenceLoadError`, `timelineLoadError`, `viewRendered` | Reset and updated during loading/rendering. |
| Generated DOM, active/hidden classes, scroll position, pending search/save-message timers and temporary “Saved” message | Not persisted by the app; rebuilt or reset. The browser may independently restore scroll or some form values. |

**Questions** (depend on the tasks above)

- [ ] In a traditional multi-page app, where does "the current page's data" live between requests? Where does it live in this SPA instead, and what are the consequences of that difference (for good and for bad)?

ANSWER: In a traditional MPA, persistent data usually lives in a server database, and user state may live in a server session identified by a cookie. Each page request builds a new document; JavaScript memory from the previous page is lost. In this SPA, loaded data and temporary UI state live in browser memory. Bookmarks, notes and the hypothesis are also saved in `localStorage`. This makes navigation quick and keeps temporary state between views. But reloads lose unsaved memory state, and we must keep client data and the UI consistent. Local storage does not automatically sync across browsers or devices.

- [ ] This app currently implements routing by hand (`handleHashChange()`, a `switch`-like chain of `if`s, and manually toggling CSS classes). What is a router library actually responsible for that this hand-rolled version does *not* handle?

ANSWER: Our code already handles basic hash navigation, Back/Forward, and a Dashboard fallback. A router library provides structured URL matching, nested routes, dynamic parameters such as evidence IDs, and query parameters. Depending on the library, it can also support route-level loading, errors, redirects and navigation guards. Our router does not put filters or selected evidence in the URL, so I cannot share a link to that exact state. A library provides tools for this, but I still need to configure them.

- [ ] If the user hits the browser's back button right now, what happens in this app, and why?

ANSWER: If I go from Evidence to Timeline and press Back, the browser restores `#evidence`. This triggers `hashchange`, and `handleHashChange()` shows Evidence without reloading the document. In-memory data and existing controls remain. Back restores the view, not a previous filter or selected evidence item, because those changes do not create history entries. If the previous history entry belongs to another website or document, Back leaves this app.

---

## Demo 5 — React introduction

**Tasks**

- [ ] Read enough of the React docs (or equivalent) to write, from scratch, a single tiny component (it can live in a throwaway sandbox, not necessarily this project yet) that renders a piece of static data as JSX. No state, no props even, just to prove you can write and reason about JSX.
- [ ] Identify, in your own words, what "component" means in React, and how it differs from a plain JavaScript function that happens to return an HTML string (which is essentially what several functions in the old `app.js` did, e.g. `renderEvidenceCardHTML()`).

**Questions** (depend on the tasks above)

- [ ] What is JSX, actually? What does it compile to?

ANSWER: JSX is a JavaScript syntax extension that lets me write HTML-like markup inside JavaScript. It is not an HTML string, and the browser cannot run JSX directly. A build tool transforms it into JavaScript calls: modern React setups use `jsx`/`jsxs` helpers, while the older transform uses `React.createElement()`. These calls create React element objects that describe the UI, not real DOM nodes.

My tiny component has only static content, with no props or state:

```jsx
export default function CaseCard() {
  return (
    <article className="case-card">
      <h2>Project ReMotion</h2>
      <p>Status: Under investigation</p>
    </article>
  );
}
```

I can use it as `<CaseCard />` in a React app. The capital letter identifies a component; `className` sets the HTML class. For me, a component is a reusable piece of UI that combines its rendering logic and markup. React manages when it renders and how its output reaches the DOM. [React: Your First Component](https://react.dev/learn/your-first-component), [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx).

- [ ] Compare your tiny component to the old `renderEvidenceCardHTML(ev)` function (string concatenation returning an HTML string). What is fundamentally different about how each one's output becomes real DOM?

ANSWER: The old function returns a string. Our code joins the card strings and assigns them to `innerHTML`, so the browser parses the HTML and replaces the list's existing child nodes. My component returns a React element description. When rendered through React DOM, React creates the initial DOM and, on later renders, compares the descriptions to update the necessary nodes. I describe what the UI should look like instead of replacing HTML myself.

- [ ] What does it mean that "components are just functions" in React? What would break if a
component's function body had a side effect (e.g. mutated a global variable) every time it rendered?

ANSWER: A function component is a JavaScript function that React calls to calculate the UI from its inputs. Rendering should be pure: the same props and state should give the same result without changing anything outside the function. React can call it again or discard a render; Strict Mode also calls render functions twice in development to reveal mistakes. If I increment a global counter during rendering, it may change even when no UI update is committed, making the result depend on how often React calls the function. I put user-triggered changes in event handlers and use effects when I need to synchronise with an external system. [React: Keeping Components Pure](https://react.dev/learn/keeping-components-pure).

---

## Demo 6 — React + TypeScript entry point in the Vite project

**Tasks**

- [ ] Add React and TypeScript support to the existing Vite project from Exercise 2 (the right Vite plugin, `tsx` support, React types).
- [ ] Create a minimal entry point (e.g. a root `<App />` component mounted into the page) that
renders *something* visible, without removing the working vanilla app yet.
- [ ] Decide and document how the two versions coexist during the migration (e.g. a separate route/ flag to view the React version, or a full swap-over. Your call, but be ready to justify it).

**Questions** (depend on the tasks above)

- [ ] What did you actually have to install and configure to get JSX compiling through Vite? What is each piece responsible for?
- [ ] How does your `<App />` component get from source code onto the actual page? Trace the path from your `.tsx` file to the DOM.
- [ ] What decision did you make about how the vanilla and React versions coexist during migration, and why? What would go wrong with an opposite choice?

---

## Demo 7 — Component hierarchy for the whole app

**Tasks**

- [ ] Design and diagram a proposed component hierarchy for the **entire application**, not just the part you're building this exercise. E.g. pages (one per current view) and the reusable components you expect to extract (cards, badges, buttons, form controls, etc.), even though most of them won't be built until Exercises 4 and 5.
- [ ] For at least 5 components in your diagram, briefly note what data/props each one would need and where that data comes from.

**Questions** (depend on the tasks above)

- [ ] What criteria did you use to decide something should be its own component versus staying inline inside a bigger one?
- [ ] Pick one component in your diagram that appears in more than one place in the app. What made you extract it instead of duplicating its markup, and how does that compare to how the original vanilla app handled (or didn't handle) that same duplication?
- [ ] Your diagram includes components you won't build until later exercises. Why is it useful to design the whole hierarchy now rather than only diagramming what you're about to build?

---

## Demo 8 — Architecture Decision Record: why SPA/React

**Tasks**

- [ ] Argue whether an SPA built with React is actually the right architecture for *this specific app*, given what it does.
- [ ] Include honest trade-offs or downsides of the SPA/React choice for this app, not just the benefits.

**Questions** (depend on the tasks above)

- [ ] What would you lose by keeping this app as server-rendered vanilla HTML/JS instead? What would you lose by choosing React specifically over a *different* SPA approach (e.g. vanilla JS with a router, or a lighter library)?
- [ ] If this app needed to support users on very low-end devices or poor connections as a hard requirement, would you stick with SPA or change the architecture? Why or why not?

---

## Demo 9 — Migrate the application shell

**Tasks**

- [ ] Build the header/branding, the navigation bar, and a routing skeleton (even a minimal one, a full router library is not required yet) in React + TypeScript.
- [ ] Wire it up so navigating between (stub) pages actually changes what's rendered, mirroring the current five views even though only the Dashboard will have real content this exercise.

**Questions** (depend on the tasks above)

- [ ] How does "the current view" get tracked in your React shell? Compare this directly to how `currentPage` and `handleHashChange()` did it in the vanilla version? What's actually
different, and what's superficially different but conceptually the same?
- [ ] What happens in your shell if a user navigates to a view that doesn't exist? How does that compare to the vanilla app's fallback-to-dashboard behavior?

---

## Demo 10 — Migrate the Dashboard view

**Tasks**

- [ ] Rebuild the Dashboard view as React components (using your hierarchy from Demo 7 as a starting point), rendering the case summary, stat cards, review progress, and the recent
evidence/timeline lists. Reading from the same data your app already loads.
- [ ] Confirm it renders correctly with real data, and that navigating away and back doesn't lose or corrupt anything.

**Questions** (depend on the tasks above)

- [ ] Where does the Dashboard's data (case info, evidence, timeline) come from in your React version, and how does it get to the components that render it? Is this the final architecture you intend to keep, or a placeholder you know you'll change in a later exercise?
- [ ] The old vanilla dashboard had a real bug where it could show stale numbers because it only re-rendered on a view's *first* visit (a manual render-cache flag). Does your React version have an equivalent risk? Why or why not, given how React re-renders?
- [ ] What, if anything, does your React Dashboard do differently from the vanilla one in terms of *when* it recalculates derived values (like the review-progress percentage)?

---

## What to bring to class

For each of the 10 demos: your changed code/diagrams/documents (ideally as commits you can show live), and the ticked checkboxes above reflecting what you can genuinely demonstrate and answer *right now*.
