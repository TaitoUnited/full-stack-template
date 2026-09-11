---
name: client-localisation
description: Use for client-visible copy, Lingui macros, locale selection, and translation catalogs. Do not use for server-owned runtime data, identifiers, or values that must remain untranslated.
---

# Client localisation

Read [client localisation](../../../docs/client/localisation.md).

- Mark user-visible strings with Lingui macros instead of concatenating translatable fragments.
- Use `Trans` where content can contain JSX, and Lingui's `t` macro for text-only props and accessible labels. Use plural and interpolation helpers for dynamic content.
- Do not wrap server-returned runtime data, names, IDs, or values in translation macros unless they are explicitly part of the localised product copy.
- Run `npm run translations:validate` in `client/` after changing translatable content.
