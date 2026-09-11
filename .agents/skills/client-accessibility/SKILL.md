---
name: client-accessibility
description: Use for semantic HTML, interactive behavior, focus, dynamic announcements, contrast, or accessibility-focused client tests. Do not use for visual-only styling with no accessibility impact.
---

# Client accessibility

Read [client accessibility](../../../docs/client/accessibility.md).

- Prefer semantic elements and existing accessible UI-kit components.
- Use ARIA only when native semantics are insufficient; keep labels, errors, and live feedback understandable to assistive technology.
- Do not make non-interactive elements clickable. Preserve disabled behavior, keyboard operation, visible focus, and sensible focus movement after dialogs or dynamic updates.
- Verify keyboard operation, focus order, visible focus, and relevant responsive states for changed flows.
