---
name: client-styling
description: Use for Panda CSS, design tokens, icons, reusable UI-kit visuals, or responsive client styling. Do not use for behavior-only component changes with no visual or design-system impact.
---

# Client styling

Read [client styling](../../../docs/client/styling.md) and [design system](../../../docs/client/design-system.md).

- Import styling helpers from `client/src/design-system/`, not Panda internals.
- Reuse tokens, recipes, and responsive conventions instead of hard-coded visual values.
- For UI-kit `Stack` and `Text`, use a single value or a responsive object with a required `base` value. `Stack` pattern props resolve bare token names such as `gap="regular"`; ordinary Panda CSS properties retain their normal `$` token syntax.
- Use full Panda property names rather than shorthand properties, and avoid creating a token for one isolated component without confirming that it is a shared design decision.
- Do not edit generated styling or token output. Keep reusable UI-kit public and accessibility contracts stable, and update stories when a reusable component changes materially.
- Use the shared icon mechanism for single-colour `currentColor` icons; keep branded or multicolour assets local and render them as images.
- Regenerate the design system with `npm run generate:design-system` in `client/` when setup changes.
