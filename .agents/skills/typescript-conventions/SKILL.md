---
name: typescript-conventions
description: Apply TypeScript, code-quality, and implementation-documentation conventions when writing, reviewing, or refactoring code.
---

# TypeScript conventions

Use this skill for non-trivial code changes or implementation documentation. Optimize TypeScript for code that is clean, readable, domain-specific, strongly typed, and not needlessly abstract.

## Comments and Documentation

- Comments should explain why, constraints, gotchas, or non-obvious context.
- Avoid comments that restate what the code already says.
- Document security, correctness, lifecycle, compatibility, and performance decisions next to the code that enforces them.
- Explain an invariant or tradeoff, not code that is already self-evident.
- Use JSDoc for important symbols and their invariants; use block comments for multiline local explanations; reserve `//` for a genuine one-line note.
- Update or remove comments when behavior changes. Keep Markdown guidance complementary to the code, not its only source of truth.

## Core Preferences

- Prefer boring, direct code over clever or generic abstractions.
- Prefer domain-specific names over generic technical names like `data`, `item`, `process`, `handle`, `manager`, or `service`.
- Prefer stepwise clarity over dense expression chains when intermediate names make intent easier to scan.
- Introduce abstractions only when they remove real duplication, protect invariants, hide unavoidable complexity, or create a genuinely reusable concept.
- Prefer local clarity at the call site over extraction that only adds navigation.
- Allow local mutation when it is scoped, clearer, or more efficient. Avoid shared mutable state.
- Prefer modules and functions over classes. Use classes only when state, lifecycle, or invariants justify them.

## Readability, Whitespace, and Line Breaks

From the owning package directory, run `npm run format:write` followed by `npm run lint:fix` to make changed code adhere to the formatting and readability standards.

## Function Shape

- Prefer `function` declarations for named functions, including exported functions.
- Use arrow functions for inline callbacks, closures that intentionally capture local state, or cases where lexical `this` is required.
- Prefer named object parameters for functions with several parameters, optional parameters, same-typed adjacent parameters, or boolean-like options.
- Use a named object parameter for more than two positional inputs, or for two positional inputs with the same primitive type (`string`, `number`, or `boolean`).
- Avoid boolean flag arguments. Replace them with named options or discriminated values.
- Prefer inline object types for function parameters when the shape is local to one function.
- Define a named type only when it is reused, exported, recursive, part of a public API, complex enough to deserve a domain name, or needed at multiple call sites.

## Types and State

- Prefer `type` aliases over `interface` for object shapes.
- Use `interface` only when declaration merging or a framework/library API specifically requires it.
- Make invalid states unrepresentable with discriminated unions and precise domain types.
- Put state-specific required fields on their corresponding union variant instead of making them optional on a shared object.
- Construct complete, typed objects in one expression; avoid `{} as SomeType`, half-built objects, and type assertions that bypass construction.
- Avoid advanced generic/type-level machinery unless it clearly removes real duplication across important APIs.
- Prefer boring, domain-named types over clever reusable type utilities.

## Control Flow

- Return directly from terminal branches instead of assigning a temporary result in every branch and returning it at the end.
- Avoid `else` after `return`, `throw`, `continue`, or `break`.
- Prefer guard clauses and base indentation for the main path.
- Prefer `switch` when branching across several cases of the same discriminant, especially discriminated unions and enum-like string unions.
- Use `if` for guard clauses, unrelated conditions, range checks, compound predicates, or one to two branches.

## Boundaries and Errors

- Validate external data at boundaries before passing it into business logic.
- Treat data from JSON, requests, environment variables, storage, queues, and third-party APIs as untrusted.
- Avoid `JSON.parse(raw) as SomeType`; parse and validate into trusted domain types.
- Use exceptions for failures, but do not swallow errors.
- Throw errors with `new Error("descriptive message")`, not `Error()` or an empty message.
- Catch only when adding useful context, translating at a boundary, logging before rethrowing, or handling an expected local recovery.

## Modules and Exports

- Prefer named exports over default exports for grepability and refactorability.
- Use the `node:` protocol when importing Node.js built-in modules.
- Avoid barrel exports when they hide ownership, encourage broad imports, or create circular dependency risk.
- Keep module public surfaces small.
- Do not export private helpers only so tests can reach them.
- Prefer testing observable behavior through public APIs over testing internal implementation details.

## Helpers and Abstractions

- Avoid tiny one-off helper functions when their body is clearer inline at the call site.
- A helper should earn its name by being reused, genuinely generic, domain-significant, or by hiding unavoidable complexity.
- Inline simple predicates and expressions when extraction only adds indirection.
- Generic helpers such as `sleep`, `roundToDecimal`, or small reusable utilities are fine when they are actually shared.

## Async and Performance

- Prefer structured concurrency for independent async work.
- Use `Promise.all` or `Promise.allSettled` when operations can run concurrently and the failure semantics are intentional.
- Avoid sequential awaits unless the later operation depends on the earlier result or ordering matters.
- Prefer a single clear loop over several chained array passes when it improves readability or avoids unnecessary work.
- Avoid dense `reduce` patterns that rebuild objects or arrays through spreads when a loop with local mutation is clearer.

## Nullish Values and Destructuring

- Use one absence convention consistently. Prefer `undefined` for missing optional values unless an external API requires `null`.
- Avoid mixing `null` and `undefined` for the same concept.
- Destructure when it reduces local repetition.
- Avoid wide destructuring that detaches fields from their domain object and makes code harder to understand.
