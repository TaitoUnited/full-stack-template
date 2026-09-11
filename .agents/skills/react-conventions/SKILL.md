---
name: react-conventions
description: Apply React, client UI, design-system, localization, and route-level async conventions when changing client code.
---

# React conventions

Use this skill for every client change. Prefer clear, direct React code with minimal extraction, explicit data ownership, and project-native libraries.

- Do not use React `StrictMode`. Prefer route-owned Suspense and error boundaries to component `loading` and `error` branches.
- Inspect `client/src/components/uikit`, its stories, and current call sites before writing UI. Do not recreate an existing primitive or create a reusable UI component without user confirmation unless it was explicitly requested.
- Render visible application text with `Text`; localize static text with Lingui. Use semantic `Text` variants and `as` where needed.
- Use `Stack` for local arrangements and `gap` rather than child margins. Use grid or another appropriate model for page structures.
- Use existing React Aria UI-kit controls. Preserve keyboard behavior, focus, accessible names, disabled/pending states, and semantics.
- Use `RoutePending` and `RouteError` for ordinary route-level async states; distinguish a successful empty state.
- Update a colocated Storybook story for meaningful reusable-component UI/API changes.
- Read a matching specialist skill when the work affects accessibility, styling, localisation, GraphQL, routing, analytics, feature flags, or client testing.

Do not include testing guidance from this skill. Testing preferences are intentionally out of scope.

## Component Structure

- Keep the main exported component first in the file.
- Use named exports for components unless the framework requires default exports.
- Use PascalCase for component functions and kebab-case for filenames.
- Prefer one primary component per file.
- Do not extract components merely to shorten JSX. Extract only when the component is shareable, needs its own internal state, or must be memoized for a measured performance reason.
- Keep non-shared extracted components in the same file, below the main component. Rely on function hoisting so the main component remains first.
- For list rendering, keep item JSX inline unless the item needs internal state or a strong performance reason justifies component extraction.
- Keep component-specific constants, helpers, and non-shared hooks in the same file below the component.
- Use self-closing JSX syntax for custom components without children.
- Prefer comments or named local functions for clarification instead of tiny extracted components/hooks that only add indirection.

## Props And APIs

- Use explicit, domain-shaped props instead of broad objects, generic config bags, or casual prop spreading.
- Use `children` for true composition and explicit props for ordinary data.
- Use compound component APIs for reusable UI primitives when they improve composition, for example `Select.Root`, `Select.Trigger`, and `Select.Item`.
- Use render props only when a wrapping component needs to expose internal state to children ergonomically.
- Avoid broad prop spreading except in low-level primitives where pass-through DOM/library props are the point.
- Use affirmative boolean prop names. Avoid multiple boolean props that encode variants; use an explicit variant prop instead.
- Write literal `true` boolean props in shorthand, for example `<Modal isOpen />`.
- Order JSX props by importance and domain meaning, not alphabetically.
- Use `onX` for handler props and `handleX` for handler functions inside a component.

## TypeScript

- Use strict, precise prop modeling. Prefer discriminated unions where they make invalid UI states unrepresentable.
- Avoid loose optional prop bags.
- Use plain function declarations with typed props instead of `React.FC`.
- Name the props type `Props` when the file has one primary component and there is no ambiguity. Use a more specific name only when needed.
- Import React APIs directly, for example `import { useState } from "react"`, instead of using the `React.` namespace.
- Avoid `forwardRef`. In React versions that support it, accept `ref` as a regular prop when a ref is genuinely needed.

## State

- Keep truly local UI state local, especially controlled form input values.
- Use controlled inputs by default.
- Use functional state updates whenever the next value depends on the previous value.
- Derive values during render instead of storing derived values in state or effects.
- Do not duplicate server state in React state. Use the chosen data fetching/cache solution for server-derived state and optimistic updates.
- Use router URL/search state for filters, tabs, sort order, and other page-level state that should survive reloads.
- Use `useReducer` only when specifically asked to do so.
- Use React Context for truly global concerns such as theme, auth/session, i18n, and feature flags, or inside reusable compound components to share state and methods between parts.

## Data Fetching And Async Actions

- Always use specialized data fetching and caching libraries for normal data fetching, such as Apollo Client for GraphQL or TanStack Query for REST.
- Use one-off non-cached fetching only for isolated cases that truly do not need caching.
- Use the project's chosen mutation/action library for pending state and cache updates.
- Prefer colocated async error handling when it makes the async flow easier to follow.
- For optimistic updates, use the chosen data/cache library APIs rather than manually copying server data into local state.

## Effects

- Avoid `useEffect` unless absolutely necessary.
- Treat effects as a synchronization tool for external systems, not a place for ordinary derived logic, data fetching, or flow control.
- Before adding an effect, check whether the value can be derived during render, handled by an event, represented in URL state, or delegated to the data/cache library.
- Never add function references to a `useEffect` dependency array. Functions are almost never the data that should trigger an effect.
- If an effect needs to call a function declared outside the effect, wrap that function with `useEffectEvent` from React to create a stable function reference for the effect body.
- Include only the data-like variables that the effect should actually react to in the dependency array.
- If the hooks linter asks for extra dependencies that should not trigger the effect, suppress that lint error instead of adding unnecessary dependencies.
- Treat extra dependencies as a major source of performance issues and accidental complexity.

## Loading, Errors, And Suspense

- Prefer explicit loading, empty, error, and success render branches when not using framework-level mechanisms.
- Prefer route-level error boundaries and Suspense fallbacks when the chosen framework/router supports them.
- Avoid manually placing Suspense boundaries in ordinary component code. Rely on preconfigured route-level boundaries, such as TanStack Router pending components, when available.

## Performance

- Avoid React memoization hooks and component memoization by default, including `useMemo`, `useCallback`, and `memo`.
- Rely on React Compiler for React-related optimization when the project supports it.
- For large data grids or long lists, use virtualization. First inspect the codebase for the existing virtualization approach or library; do not build custom virtualization.
- Only add memoization when specifically justified by the project or a measured performance issue.

## Styling And Accessibility

- Follow the project's existing styling system.
- If no styling system exists, prefer atomic build-time extracted CSS-in-JS libraries such as Panda CSS or StyleX for good developer experience and runtime performance.
- Prefer semantic HTML and native controls.
- If the project uses a headless accessible component library such as React Aria Components or Base UI, use its primitives instead of hand-rolling accessibility-heavy behavior.

## Framework And Dependency Choices

- Avoid React Server Components unless specifically requested.
- Avoid React-specific directives such as `"use client"` unless the chosen framework requires them for the requested work.
- Before implementing complex UI behavior, search the codebase for existing solutions.
- If no existing implementation exists, inspect `package.json` for dependencies that can solve the problem.
- If neither exists, propose a third-party library or custom implementation before creating a new complex solution.
- Avoid creating shared abstractions. Ask the user before introducing one. Prefer existing design-system or UI components when available.
