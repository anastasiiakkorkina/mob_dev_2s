# React architecture — Demo 6

## Folder structure

```text
react/
  main.tsx                         # Portal entry point
  demo4-main.tsx, demo4.html        # Separate teaching-page entry
  app/
    App.tsx                        # Data and page composition
    AppHeader.tsx                  # Shared application shell
    routing.tsx                    # React Router navigation metadata
    StubPage.tsx                   # Placeholder views
    useCaseData.ts                 # Application-wide data loading
  features/
    dashboard/
      DashboardPage.tsx            # Dashboard and its local components
    people-locations/
      PeopleLocationsPage.tsx
      PersonDetailPage.tsx          # Validated person route (Demo 9)
      components/
        PersonCard.tsx
        LocationCard.tsx
        PersonStatement.tsx
    timeline/
      TimelinePage.tsx
      components/
        TimelineList.tsx
        TimelineEventCard.tsx
  shared/
    components/
      Card.tsx                     # Generic wrapper with children
      Badge.tsx                    # Shared typed visual label (Demo 7)
  demos/
    KeyIdentityDemo.tsx            # Isolated key experiment
    demo1-props.typecheck.tsx       # Compile-only wrong-props example
```

## Placement rules

Group code by the user-facing feature it supports. Keep a component feature-local when its fields, meaning, or reasons to change belong to that feature. `TimelineEventCard` stays in Timeline because it understands event time, certainty, and related evidence IDs. A presentational component does not automatically belong in shared.

Use shared for a domain-independent contract with proven reuse. `Card` accepts only `className` and `children`; both `PersonCard` and `LocationCard` use it. These callers currently belong to one feature, but the wrapper has no people/location-specific fields or branches. Its small, generic contract makes the shared placement deliberate. Do not move a single-use domain card into shared just because another feature might use it later.

The app folder owns the shell, navigation, and application-wide loading. Teaching experiments live in demos because they are not portal features. Entry points stay at their existing URLs. The existing `modules/` types and pure helpers remain available to both the vanilla and React versions; no duplicate data models were created.

## By type versus by feature

By type groups all components together and all hooks together. By feature keeps related work together, such as the Timeline page and its cards. This portal has distinct Dashboard, People & Locations, and Timeline views, so feature folders make related changes easier to find. Small `components/` folders inside a feature are still feature-oriented: they do not mix unrelated views.

Folder location and component responsibility are separate decisions. `TimelinePage` is a feature component and `TimelineList` is presentational, but both belong to Timeline. Demo 6 reorganised files and imports; Demo 8 later added React Router without introducing local tab state.


## Demo 7: shared Badge

`shared/components/Badge.tsx` is used in Dashboard case/evidence summaries and Timeline event cards. Its label and visual tone vary; its span markup and CSS mapping stay shared. Domain-to-tone decisions remain in each feature. This is real reuse across two features with no feature-specific flags.


## Demo 8: routes and deployment

The portal uses React Router's `HashRouter` because `react.html` is a separate entry on a static host. Routes are `/dashboard`, `/team/people`, `/team/locations`, and `/timeline` inside the URL hash. `AppRoutes` selects pages, while `App` keeps loaded records above navigation. `NavLink` derives active navigation and tab styles from the URL. Unknown routes redirect to `/dashboard` with replacement. Evidence and Workspace remain placeholders. No server fallback rewrite is needed for hash URLs.


## Demo 9: person details

`/team/people/:personId` identifies one record. `PersonDetailPage` reads `useParams`, validates against the loaded people collection, and supplies the real record to `PersonCard`. Unknown IDs show a local not-found message, while unknown route shapes still use the global Dashboard redirect. Person cards link to detail URLs using stable IDs; no query filter or new state is added.


## Demo 10: Timeline query state

`/react.html#/timeline?person=nova-byte` filters Timeline from the URL. TimelinePage validates the person, derives the matching events, and shows a disabled selection preview without local filter state. PersonDetailPage supplies real links. Empty or absent parameters show all events; unknown IDs show an explicit message and an empty list. Dashboard, People/Locations, and Timeline use React rendering throughout; vanilla renderer modules are not called from the React feature tree.
