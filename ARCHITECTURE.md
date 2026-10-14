# React architecture — Demo 6

## Folder structure

```text
react/
  main.tsx                         # Portal entry point
  demo4-main.tsx, demo4.html        # Separate teaching-page entry
  app/
    App.tsx                        # Data and page composition
    AppHeader.tsx                  # Shared application shell
    routing.tsx                    # Existing hash navigation
    StubPage.tsx                   # Placeholder views
    useCaseData.ts                 # Application-wide data loading
  features/
    dashboard/
      DashboardPage.tsx            # Dashboard and its local components
    people-locations/
      PeopleLocationsPage.tsx
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

Folder location and component responsibility are separate decisions. `TimelinePage` is a feature component and `TimelineList` is presentational, but both belong to Timeline. This change reorganises files and imports; it does not introduce a routing library or new state.
