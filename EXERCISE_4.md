# Exercise 4 — React UI & Component Design

This is the fourth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercise 3. This exercise migrates **two more views — People & Locations, and Timeline** — bringing the running total to 3 of the app's 5 views fully in React. **Evidence Catalogue and Workspace are deliberately not part of this exercise**. They need real interactivity (`useState`, controlled forms, a reducer) to make sense, and that's Exercise 5.

**This exercise is about structure, not behavior.** Migrate these views as presentational-first, e.g.
reusable components, typed props, lists and conditional content, and (for Timeline) filter controls that are visually complete but not required to be functionally wired to `onChange` handlers yet. "No state management beyond what is necessary to render the initial view" is the rule. It's fine (expected, even) for Timeline's filter dropdowns to not filter anything yet when changed by the user.

**Hard rules for every component you write in this exercise:**
- [ ] No `innerHTML`.
- [ ] No manual DOM creation (`document.createElement`, `.appendChild`, etc.).
- [ ] No state beyond what's needed to render the initial view (reading a query param once to decide *what* to show initially is fine.

**Out of scope for this exercise**: Evidence Catalogue, Workspace, `useState` and any interactivity beyond what's needed to render the initial view, forms that actually submit
or validate anything, global/shared state, and accessibility (not covered in this course). 

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 15, React Foundations** — “JSX is JavaScript syntax for UI descriptions” through “The component tree,” PDF pp. 104–106
- **Chapter 16, React Component Design and Routing** — all sections, PDF pp. 110–114

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | JSX, function components, typed props, composition & children | ☐ |
| 2 | Conditional rendering | ☐ |
| 3 | Rendering collections | ☐ |
| 4 | Stable keys and list identity | ☐ |
| 5 | Presentational vs. feature components and component boundaries | ☐ |
| 6 | Feature-oriented folder structure | ☐ |
| 7 | Reusable UI elements | ☐ |
| 8 | Routing: People & Locations as real routes | ☐ |
| 9 | Route parameters | ☐ |
| 10 | Query parameters as URL state + migration wrap-up | ☐ |

---

## Demo 1 — JSX, function components, typed props, composition & children

**Tasks**

- [x] Build at least 3 small components for the People & Locations or Timeline views using JSX,
each with an explicitly typed props interface/type (no untyped or `any` props).
- [x] Build at least one component that takes `children` (composition) rather than a data prop, and use it in a real place in the app (e.g. a generic card/panel wrapper).

**Questions** (depend on the tasks above)

- [x] Show one JSX expression in your code that embeds a JavaScript value or expression (not just static markup). For example `{person.name}` or a computed value. What can and can't go inside `{...}` in JSX?
- [x] For one component's typed props: what would TypeScript catch if you passed the wrong shape of data to it? Demonstrate a real type error by passing something wrong on purpose.
- [x] What's the difference between passing data as a named prop versus passing it as `children`? Why did you choose `children` for the component you built with it?
- [x] Why does direct DOM manipulation (as the old vanilla `app.js` did constantly, e.g. `innerHTML`, `classList.add/remove`, manually building elements) conflict with React's rendering model? What assumption does React make about who "owns" the DOM that direct manipulation breaks?


### Implementation and how to demonstrate

Based on the course manuscript: Chapter 15, sections 15.3–15.6 (PDF pp. 104–106), and Chapter 16, sections 16.1–16.5 (PDF pp. 110–114).

- `react/PersonCard.tsx`: typed `PersonCardProps` (`person: PersonRecord`, `evidenceCount: number`); displays a person and the related evidence count.
- `react/LocationCard.tsx`: typed `LocationCardProps` (`location: LocationRecord`); displays a location and its equipment.
- `react/Card.tsx`: typed `CardProps` (`className: string`, `children: ReactNode`); wraps the nested JSX in an `<article>`. Both cards use it.
- `react/PeopleLocationsPage.tsx`: typed page props; composes both lists using the existing records and stable IDs as keys. `App.tsx` renders it for `#people`.

Run `npm run dev`, open `/react.html#people`, and show the two groups of cards. Both groups are visible together for Demo 1; tab routes and Timeline belong to later demos. These components do not change props, create DOM nodes manually, or add state.

The checked items above mean implemented/answered. The Self-Check readiness table remains unchecked until I have rehearsed the live demonstration.

### Short answers

**1. JSX expressions.** In `PersonCard`, `<h3>{person.name}</h3>` reads a JavaScript value. The expression `{evidenceCount === 1 ? "item" : "items"}` chooses a word. Braces accept expressions, such as variables, calculations, function calls, ternaries, and `map()`. Statements such as `if`, `for`, or variable declarations cannot go directly inside them. As visible children, React can render strings, numbers, elements, and arrays of renderable values; `null`, `undefined`, and booleans show nothing. A plain object cannot be rendered directly as a child (use a property instead). Objects can be valid attribute values, for example `style={{ color: "red" }}`.

**2. Typed props and a real error.** `PersonCardProps` requires a complete `PersonRecord` and a numeric `evidenceCount`. TypeScript catches missing required fields, misspelled prop names, and incompatible values before the app runs. `react/demo1-props.typecheck.tsx` deliberately passes `evidenceCount="three"` to `PersonCard`. Remove its `@ts-expect-error` comment and run `npx tsc --noEmit`: the compiler reports `TS2322: Type 'string' is not assignable to type 'number'.` Restore the comment afterwards. The comment marks an expected error so the normal build still passes; the example is not imported into the running app. TypeScript does not validate fetched JSON at runtime automatically.

**3. Named props vs. children.** Named props supply specific inputs: `person={person}` tells `PersonCard` which record to display. Nested JSX between `<Card>` and `</Card>` becomes its `children` prop. I chose children because `Card` provides the same outer structure for different content. It does not need to know the fields of a person or a location.

**4. React and DOM ownership.** React calculates the UI from props and state, then updates the DOM to match that description. It assumes it controls the nodes inside its root. Changing those nodes with `innerHTML`, `classList`, or manual DOM creation can make the real DOM disagree with React's view of it. Later renders may overwrite those changes or update the wrong structure. In these components, JSX and `className` describe the desired result and React makes the DOM changes.

---

## Demo 2 — Conditional rendering

**Tasks**

- [x] Implement at least two real conditional-rendering cases in the views you're migrating. For example: an empty state (e.g. "no timeline events match" if applicable), and a state-dependent style/label (e.g. the active People/Locations tab, or a certainty badge's variant on a timeline event).
- [x] Use at least two different conditional-rendering techniques (e.g. a ternary, `&&`, early-return, or a lookup/mapping function) and be ready to justify which you used where.

**Questions** (depend on the tasks above)

- [x] Show one place where you used `condition && <Component />}` instead of a ternary. What would go wrong if `condition` were a number like `0` instead of a boolean and does that risk apply to your actual code?
- [x] Why might returning `null` from a component be preferable to returning an empty `<div>` in some cases? Did you use either, and why?


### Implementation and how to demonstrate

Based on Chapter 16, section 16.1 (PDF pp. 110–111). All new rendering depends on typed props; no new state or manual DOM changes are used.

- **Ternary:** `PeopleLocationsPage` shows either an empty message or the corresponding card grid. `PersonCard` also chooses between "No related evidence yet." and the count label. A ternary fits two alternative results.
- **Logical AND:** `person.responsibilities.length > 0 && (...)` shows the responsibilities list only when there are entries. It fits optional content with no alternative.
- **Early return:** `PersonStatement` returns `null` when `statement.trim() === ""`; otherwise it renders the quotation. It keeps the absent-content case separate and creates no empty element.

Run `npm run dev` and open `/react.html#people`. To demonstrate the other branches, temporarily change props in the `PeopleLocationsPage` call in `App.tsx` (do not change the JSON files):

1. Pass `people={[]}`: "No people loaded yet." replaces the people grid; locations still appear.
2. Restore people and pass `locations={[]}`: "No locations loaded yet." replaces the locations grid.
3. Restore locations and pass `evidence={[]}`: all person cards show "No related evidence yet.".
4. Restore evidence. Temporarily pass `people={data.people.map((person) => ({ ...person, responsibilities: [], statement: "   " }))}`: cards keep their other fields, but the responsibilities list and quotation disappear. In browser Elements, no statement div or responsibilities ul is present.
5. Restore all original props after the demonstration.

### Short answers

**1. Logical AND and zero.** In `PersonCard`, I use `{person.responsibilities.length > 0 && (<ul>...</ul>)}`. When the boolean condition is false, React renders nothing. With `length && (...)`, an empty array would produce the number `0`, which React renders as visible text. My code avoids this because `length > 0` always produces a boolean.

**2. Returning null.** `null` means the component renders nothing. An empty `<div>` still creates a DOM element and can affect spacing, layout, or CSS. I use `return null` in `PersonStatement` when the statement is empty or whitespace-only, so there is no empty quotation box or decorative border. I do not use an empty div as a substitute.

---

## Demo 3 — Rendering collections

**Tasks**

- [ ] Render the people list, the locations list, and the timeline events list, each as a mapped collection of components, each with a proper `key` prop.

**Questions** (depend on the tasks above)

- [ ] What does React actually use `key` for internally?

---

## Demo 4 — Stable keys and list identity

**Tasks**

- [ ] Deliberately use `key={index}` in one throwaway example, then demonstrate (e.g. by reordering or filtering the underlying array) a case where it produces a visibly wrong result, before replacing it with a real stable id.

**Questions** (depend on the tasks above)

- [ ] What goes wrong, concretely, when keys are missing, duplicated, or based on array index for a list that can reorder or filter?
- [ ] The *original* vanilla version of this app had a real bug where one feature used an array index as an identifier instead of a stable id. Would that same mistake, ported directly into React as `key={index}`, have caused a symptom a user could notice, or only a console warning? Explain why.
- [ ] All of this app's real data (people, locations, timeline events) already has stable ids. Is there ever a legitimate reason to use `key={index}` anyway? When?

---

## Demo 5 — Presentational vs. feature components and component boundaries

**Tasks**

- [ ] Classify every component you've built so far as either "presentational" or "feature/container". Explain why.
- [ ] Find at least one component that's currently doing more than one job, and split it into two components with a clear boundary between them.

**Questions** (depend on the tasks above)

- [ ] For the component you split: what was the single responsibility of each half after the split? If an implementation detail in one half changed, would that change affect the other half? Why or why not?
- [ ] Give one concrete rule you used to decide "this belongs in a presentational component" versus "this belongs in a feature component."

---

## Demo 6 — Feature-oriented folder structure

**Tasks**

- [ ] Reorganize your React source into a feature-oriented structure (e.g. grouping by
`people-locations/`, `timeline/`, `dashboard/`, shared `components/`, rather than one flat
folder of files). Including the Dashboard and shell from Exercise 3.
- [ ] Document the structure you landed on (a short `ARCHITECTURE.md` section or README snippet is enough) and the rule you used to decide what's "shared" versus "feature-local."

**Questions** (depend on the tasks above)

- [ ] What's the difference between organizing files "by type" (all components in one folder, all hooks in another) and "by feature"? What made you choose the structure you chose for this app specifically?
- [ ] Where did you draw the line between a component that lives inside one feature folder and one that belongs in a shared/common folder? Give one real example of each from your own structure.

---

## Demo 7 — Reusable UI elements

**Tasks**

- [ ] Extract at least one presentational component that is genuinely reused in **two or more different places** in the app (e.g. a badge, a card shell, a button variant), with a typed props API that makes it flexible enough for both uses without becoming a special-cased mess.

**Questions** (depend on the tasks above)

- [ ] Show the two (or more) places your reusable component is used. What varies between them via props, and what stays fixed inside the component itself? How did you decide where that line goes?
- [ ] The original vanilla app had duplicated HTML-template code (the same card markup written out twice, slightly differently, in two functions). Compare that directly to what you just built. What does a reusable component give you that copy-pasted template strings didn't?

---

## Demo 8 — Routing: People & Locations as real routes

**Tasks**

- [ ] Install a routing library (React Router or an equivalent of your choice, justified) and
replace the shell's placeholder navigation from Exercise 3 with real routes for at least Dashboard, People & Locations, and Timeline.
- [ ] Convert the People/Locations tab toggle from local component state into two real,
navigable, bookmarkable routes (e.g. `/team/people` and `/team/locations`) instead of a click handler that only changes what's shown without changing the URL.

**Questions** (depend on the tasks above)

- [ ] Why does making the People/Locations tab a real route (versus keeping it as internal
component state) matter for the user? Name a concrete capability the user gains.
- [ ] What does your router do when the URL doesn't match any route you've defined? Compare this to how the vanilla app's `handleHashChange()` fell back to the dashboard for an invalid hash.

---

## Demo 9 — Route parameters

**Tasks**

- [ ] Add at least one route that takes a parameter (e.g. a person or location id in the URL, such as `/team/people/:personId`), and use that parameter inside the corresponding component to determine what to render.
- [ ] Make at least one place in the app link to that parameterized route (not just typing the URL by hand). For example, a person's name in a related-evidence context, or a "view on team page" link.

**Questions** (depend on the tasks above)

- [ ] How do you read a route parameter's value inside your component, and what type is it as far as TypeScript is concerned by default? What did you have to do to use it safely (e.g. what if the id in the URL doesn't match any real person)?
- [ ] What's the practical difference, for the user, between `/team/people/nova-byte` (a route
param) and `/team/people?person=nova-byte` (a query param)? Why is one more appropriate than
the other for this specific case?

---

## Demo 10 — Query parameters as URL state + migration wrap-up

**Tasks**

- [ ] On the Timeline view, read a query parameter (e.g. `?person=...`) when the page loads, and use it to determine the *initial* rendered list (for example, pre-selecting a person filter if the app is opened via a link that includes one). Remember, the filter controls themselves don't need to be interactive yet. This is about parameterizing the initial render from the URL, not wiring `onChange`.
- [ ] Do a final pass confirming: Dashboard, People & Locations, and Timeline are fully React, none of them use `innerHTML` or manual DOM creation anywhere, and all three are reachable via real, bookmarkable routes.

**Questions** (depend on the tasks above)

- [ ] Why is reading a query parameter once, on initial render, still consistent with this exercise's "no state beyond what's necessary to render the initial view" rule? What would cross the line into "real interactivity" that's out of scope until Exercise 5?
- [ ] What would you need to add to make Timeline's filters *actually* filter the list when a user changes them? (You don't have to build it. Just name the concept you'd need)
- [ ] Across the 3 views you've now fully migrated, what's one piece of duplicated logic or markup you noticed but didn't extract yet? Why didn't you, and would you if you had more time?

---
