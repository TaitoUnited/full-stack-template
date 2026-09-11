---
name: client-styling
description: Use the Panda CSS generated system and design tokens consistently in client UI changes.
---

# Client styling

Read [client styling](../../../docs/client/styling.md) and [design system](../../../docs/client/design-system.md).

- Import styling helpers from `client/src/styled-system/`, not Panda internals.
- Reuse tokens, recipes, and responsive conventions instead of hard-coded visual values.
- Regenerate the styled system with `npm run generate:styled-system` in `client/` when setup changes.

