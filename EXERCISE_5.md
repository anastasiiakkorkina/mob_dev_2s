# Exercise 5 — React Interactivity, State & Reactive Programming

This is the fifth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3 and 4. This exercise builds and fully wires up the **final two views: Evidence Catalogue and Workspace**, the two most state-heavy parts of the app (search, multiple filters, sorting, bookmarking, notes, and
the hypothesis form).

This exercise is, on purpose, a chance to solve several problems you already fixed _imperatively_ back in Exercise 1: a dashboard count that could go stale, state that was represented in two places at once, and derived data that got confused with stored data.
Where relevant, the theory questions below ask you to explicitly compare your React solution to how you patched the same category of problem in vanilla JS.

**Out of scope for this exercise** (these come later): `useEffect`/data fetching (Exercise 6), a real backend, automated tests.

## Corresponding manuscript reading

This exercise corresponds to **Chapter 17, React State, Interactivity, and Reactive Data Flow** in the course manuscript, especially "Responding to events" through "Common state-design problems" on pp. 115–123. The chapter transition and summary follow on pp. 124–125.

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                               | Ready? |
| --- | -------------------------------------------------- | ------ |
| 1   | Migrate event handling from vanilla listeners      | ☐      |
| 2   | `useState` & controlled forms                      | ☐      |
| 3   | Immutable updates                                  | ☐      |
| 4   | Derived values vs. stored state                    | ☐      |
| 5   | Lifting state to the nearest common owner          | ☐      |
| 6   | Passing callbacks downward                         | ☐      |
| 7   | `useReducer` for the filter/search/sort state      | ☐      |
| 8   | Context, and when not to use it                    | ☐      |
| 9   | Diagnose & fix common state problems               | ☐      |
| 10  | Remove remaining direct DOM manipulation + wrap-up | ☐      |

---

## Demo 1 — Migrate event handling from vanilla listeners

**Tasks**

- [x] Build the Evidence Catalogue and Workspace views' static structure in React (cards, the filter toolbar, the notes list, the hypothesis form) if you haven't already, then migrate at least 3 real event handlers from the vanilla version (e.g. bookmark click, search input, save-note click) into React event handlers (`onClick`, `onChange`, `onSubmit`, etc.).
- [x] For each one, confirm the vanilla version's inline `onclick` attribute or manually-attached `addEventListener` is gone. React should own the event, not the DOM.

**Questions** (depend on the tasks above)

- [x] How do you attach a click handler to a button in React versus how the vanilla version did it (inline `onclick="..."` in the HTML string, or `addEventListener` in JS)? What actually receives the event object in each approach, and is it the same kind of object?

  **ANSWER:** In React, I write `onClick={handleClick}` on the button. React calls my function and passes it a click event. With `addEventListener`, the browser calls the listener and passes it a native click event. Both describe the same click, but React gives a React event wrapper; its `nativeEvent` is the browser event. An inline `onclick` calls a function from the HTML attribute, usually without a named handler receiving an event unless I pass it (for example, `onclick="handleClick(event)"`).

- [x] The vanilla version's evidence-list click handling used event delegation (one listener on the container, checking `event.target`) partly to work around listeners being re-registered on
      every render. Do you still need that pattern in React? Why or why not?

  **ANSWER:** No. I put `onClick` on each bookmark button in the JSX. React keeps those handlers connected as it updates the UI, so I do not need a container listener to find which button was clicked. Event delegation can still be useful for special cases, but it is not needed to prevent listeners from being lost on each render.

---

## Demo 2 — `useState` & controlled forms

**Tasks**

- [x] Make the Evidence search box a controlled input (`value` + `onChange` backed by `useState`).
- [x] Make the entire hypothesis form (suspect select, nature select, evidence multi-select,
      confidence range, explanation and alternative textareas) fully controlled.
- [x] Wire the "Save hypothesis draft" action to read from your controlled state and persist it (still to `localStorage` for now).

**Questions** (depend on the tasks above)

- [x] What makes an input "controlled" versus "uncontrolled" in React? Show what happens if you try to type in one of your controlled inputs without wiring its `onChange` and explain, in terms of React's render cycle, _why_ that happens.

  **ANSWER:** A controlled input gets its `value` from React state and updates that state in `onChange`. An uncontrolled input keeps its value in the DOM. If I remove `onChange` from a controlled text input, I can try to type, but React still has the old state value. On the next render React puts that old value back, so the input looks read-only.

- [x] The hypothesis form has several different input types (select, multi-select, range, textarea). Did you use one `useState` per field, or a single object? Justify your choice — and note this question again once you get to Demo 7 (`useReducer`), which asks you to reconsider it for a different form.

  **ANSWER:** I use one `useState` object for the whole hypothesis draft. These fields belong to one draft and are saved together, so one object keeps them together. Each change copies the old object and changes one field. In Demo 7, `useReducer` may be clearer when a state area has more fields and more kinds of related actions.

---

## Demo 3 — Immutable updates

**Tasks**

- [x] Find at least one place where your first instinct (or an early draft) would have mutated state directly (e.g. `evidence.bookmarked = true`, or pushing directly into a state array), and rewrite it as an immutable update.
- [x] Add a case to your bookmark toggle logic that specifically exercises this: toggling a bookmark must produce a _new_ array/object, not a mutated one.

**Questions** (depend on the tasks above)

- [x] Why does mutating state directly in React sometimes still appear to "work" on screen, but
      cause real (possibly hard-to-track) bugs elsewhere? What is React actually comparing when it decides whether to re-render?
- [x] The original vanilla app had a real bug where sorting evidence mutated the master array via a shared reference, permanently losing the original order. Show how your React state update for the equivalent action (bookmark toggle, or sort, if you implement it) avoids that exact class of bug. Be specific about what's different, not just "React handles it."

  **ANSWER:** React compares the old and new state values by identity (with `Object.is`). If I mutate an object and pass the same object back, React may see the same identity and skip a render. Other code can also hold that changed object, so it can see unexpected data. A screen may still appear to update after some other render, which makes this bug hard to find.

  **ANSWER:** The old sort could sort an array that was also the master list, changing its original order. My bookmark update makes a fresh `bookmarks` array and a fresh data object with `{ ...data, bookmarks }`. It leaves `data.evidence` and the previous state unchanged. This avoids changing shared data by reference.

---

## Demo 4 — Derived values vs. stored state

**Tasks**

- [x] Implement the Evidence Catalogue's filtering/sorting so that the _filtered, sorted list is computed from_ the full evidence list and the current filter/sort state, every render. Never stored as its own separate piece of state that could drift out of sync.
- [x] Do the same for the Dashboard's bookmark count and the Workspace's bookmarked-items list: both should be derived from the same single source of truth for bookmarks, not duplicated state.

**Questions** (depend on the tasks above)

- [x] What's the rule for deciding whether something belongs in `useState` versus being computed inline (or via `useMemo`) during render? Apply that rule to the filtered evidence list and justify your answer.

  **ANSWER:** I store values the user changes, such as search and filter choices. I compute the visible evidence list from those choices and the full evidence list during render because it can always be calculated from them. I would use `useMemo` only if this calculation became expensive; it would still be derived data, not a second source of truth.

- [x] The vanilla app had two related bugs here: a dashboard bookmark count that could go stale (because it only re-rendered on a view's first visit), and a `filteredEvidence` variable that was sometimes literally the _same array reference_ as the master list. Explain, concretely, why deriving these values during render instead of storing them makes **both** of those bug classes structurally impossible, not just less likely.

  **ANSWER:** The Dashboard count reads the shared `bookmarks.length`, and Workspace filters evidence with those same bookmark IDs. A bookmark update changes that one shared state, so React renders both values from the latest list. The filtered list is also calculated from the full evidence list on each render; it is never assigned back to the master list or kept as stored state that can become stale. Sorting runs on a copied filtered array, so the original evidence order stays unchanged.

---

## Demo 5 — Lifting state to the nearest common owner

**Tasks**

- [x] Identify the lowest common ancestor component of everywhere bookmark state needs to be read or changed (at minimum: an Evidence card's bookmark button, the Dashboard's bookmark count, and the Workspace's bookmarked-items list), and move the actual `useState` for bookmarks up to live there.
- [x] Confirm that toggling a bookmark from the Evidence view is immediately reflected on the
      Dashboard the next time it's rendered.

**Questions** (depend on the tasks above)

- [x] What does "lifting state up" actually mean, mechanically? Walk through where the bookmark state lived before you lifted it, and where it lives now.

  **ANSWER:** Lifting state up means moving `useState` to the nearest parent shared by all components that need it. The bookmark list was part of the loaded case data in `useCaseData`. Now `App` owns `useState` for bookmarks and passes the list and toggle callback to the pages. Evidence calls the callback; Dashboard and Workspace read the same list.

- [x] What would go wrong (be specific) if you had instead kept a separate `useState` for bookmarks inside each of the Dashboard, Evidence, and Workspace components?

  **ANSWER:** Each page would have a separate list. Toggling a bookmark in Evidence would not update the Dashboard count or Workspace list. The counts and lists could disagree unless every copy was updated and kept in sync.

---

## Demo 6 — Passing callbacks downward

**Tasks**

- [x] From wherever you lifted bookmark state to (Demo 5), pass a callback (e.g. `onToggleBookmark`) down through props to every component that needs to trigger a change, rather than letting child components reach up and mutate anything themselves.
- [x] Do the same for at least one more interaction that needs to affect state owned by a parent (e.g. saving a note, or changing evidence review status from the detail view).

**Questions** (depend on the tasks above)

- [x] Why can't (or shouldn't) a deeply nested child component just directly modify state that lives in a distant ancestor? What does passing a callback down get you instead?

  **ANSWER:** A child does not own the ancestor's state, and changing it directly would bypass React's update flow. A callback gives the child one clear action to request. The parent keeps control of the update and can also save it to local storage.

- [x] Trace one callback all the way from where it's defined (with the actual `useState` setter
      inside it) down to the component that calls it. How many component layers does it pass through, and does that feel like "too many". Is prop drilling becoming a real problem here?

  **ANSWER:** `saveNote` is defined in `App` and calls `setNotes`. It passes through `AppRoutes`, then `WorkspacePage`, then `NoteForm`, which calls it on submit: three prop steps. This is still manageable because the route is the only middle layer and there are few consumers. Context would be worth considering if many unrelated layers had to pass the callback.

---

## Demo 7 — `useReducer` for the filter/search/sort state

**Tasks**

- [x] Identify the Evidence Catalogue's combined filter state (search term, type, person, location, status, relevance, and sort order — 7+ related values that often change together or need to be reset together) as a single non-trivial state domain, and replace its `useState` calls with a single `useReducer`.
- [x] Implement at least 3 distinct action types (e.g. `SET_FILTER`, `SET_SORT`, `CLEAR_FILTERS`).

**Questions** (depend on the tasks above)

- [x] Why is this particular piece of state ("evidence filters") a better fit for `useReducer` than for a pile of individual `useState` calls? What specifically got easier once you switched?

  **ANSWER:** Search, filters, and sorting are seven related values used together. The reducer keeps their updates in one place and gives each change a clear action. This makes it easier to see and change how the filter state works.

- [x] Show your `CLEAR_FILTERS` action. How does a reducer make "reset several related values at once, consistently" easier to get right than resetting them individually?

  **ANSWER:** `CLEAR_FILTERS` returns a new copy of `defaultFilters`, including the search text and sort order. One action resets all seven values together, so I cannot forget to reset one separate state variable.

- [x] Is `useReducer` fundamentally different from `useState`, or is `useState` essentially a
      special case of the same underlying idea? Justify your answer.

  **ANSWER:** Both store state and cause a render when the state changes. `useState` gives a simple setter. `useReducer` uses a reducer to decide the next state from the current state and an action. It is useful when state has several related updates; it is not a different kind of state.

---

## Demo 8 — Context, and when not to use it

**Tasks**

- [x] Pick one piece of state from this exercise (bookmark state is a strong candidate, given Demo 6's prop-drilling question) and actually implement it via React Context, replacing the prop-drilled version.
- [x] Explain a short, honest decision: for _this specific app_, at its _current_ size, is Context actually the right call for this state, or is prop-drilling (or lifting state, without
      Context) good enough? Be ready to defend whichever answer you land on.

  **DECISION:** Bookmark Context is reasonable because Dashboard, Evidence, and Workspace all need the same list, and Evidence also changes it. The app is still small, so passing props would also be manageable; Context is useful here but not required.

**Questions** (depend on the tasks above)

- [x] What problem does Context actually solve? What does it _not_ solve (people sometimes expect it to behave like global state management. Where does that expectation break down)?

  **ANSWER:** Context lets components read a value from a nearby provider without passing it through every layer as props. It does not manage updates or persistence by itself, and it is not a global store. In this app, `App` still owns and updates the bookmark state; Context only makes that value and callback available to its children.

- [x] Revisit Demo 6's callback-depth question. Was prop drilling there actually a real problem
      (annoying, error-prone, worth solving) or a manageable one? What's your threshold for reaching for Context instead of just drilling one more level?

  **ANSWER:** The note callback passed through three prop steps, which was manageable because there were few layers and only one page needed it. I would consider Context when many components in separate branches need the same value, or when several intermediate components only pass it along.

- [x] "Unnecessary global state" is explicitly named as a common problem. Could using Context here be an example of that, even though Context isn't technically the same as a global variable?

  **ANSWER:** It could be unnecessary if only one small component needed the bookmarks. Here several pages share the same bookmark list, so Context has a clear use. It is still scoped to the App provider tree, not available everywhere in the app automatically.

---

## Demo 9 — Diagnose & fix common state problems

**Tasks**

- [x] Review your own Evidence/Workspace/Dashboard code specifically for: duplicated state (the same fact represented in two places), stale state (a value that doesn't update when it should), excessive prop drilling, unnecessary global state, and any remaining direct mutation.
- [x] Find and fix at least 2 real instances (they can be ones you introduced yourself while
      building this exercise, that's normal and expected, not a failure).

**Questions** (depend on the tasks above)

- [x] For each of the 2 issues you fixed: which of the five named categories did it fall into, and how did you notice it (a visible bug, a code-review-style re-read, React DevTools, something else)?

  **ANSWER:** First, the hypothesis form kept showing “Saved” after I edited a field. This was stale UI state; a code review found that edits did not clear the confirmation. Now every field change updates the draft and clears the saved message. Second, the bookmark and note callbacks used values captured by the last App render. This was stale state; a code review showed queued updates could overwrite each other. They now use functional state setters, and effects persist the committed values. I also checked that the page sorting works on copied arrays and found no direct DOM changes in these React views.

- [x] Of the five named problems (duplicated state, stale state, prop drilling, unnecessary global state, mutation), which one is this app's history (Exercise 1's bugs) most clearly an example of? Explain the connection directly.

  **ANSWER:** Stale state is the clearest example. In the vanilla app, the Dashboard bookmark count could stay old because it only rendered on the view's first visit. The React version derives the count from the current shared bookmark state each time the Dashboard renders.

---

## Demo 10 — Remove remaining direct DOM manipulation + wrap-up

**Tasks**

- [ ] Do a final sweep of the Evidence Catalogue and Workspace views (and re-check Dashboard/People & Locations/Timeline from Exercises 3–4) for any remaining direct DOM manipulation, e.g. `document.querySelector`, manual `classList` changes, `innerHTML`, anything not going through React's render, and remove it.
- [ ] Confirm the whole app (all 5 views) now runs entirely on React state and props, with zero manual DOM manipulation anywhere.

**Questions** (depend on the tasks above)

- [ ] Show one state-management decision you made somewhere in this exercise (state ownership, `useState` vs. `useReducer`, prop drilling vs. Context, or something else) that you're not 100% sure was the right call. Explain the trade-off honestly, both directions.
- [ ] Across Exercises 3–5, name one bug category from the _original_ vanilla app (Exercise 1's defect list) that is now, by construction, no longer possible in your React version — not just fixed, but structurally prevented. Explain why the React architecture rules it out.

---
