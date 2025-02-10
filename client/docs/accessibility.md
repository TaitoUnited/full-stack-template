# Accessibility Guide for React Projects

Creating accessible web applications is not just a technical task—it’s about building inclusive digital experiences that everyone can use, regardless of ability. This guide explains the importance of accessibility (a11y), provides best practices for React developers, and lists tools for testing accessibility in your projects.

## Why Accessibility Matters

1. **Inclusivity**: Accessibility ensures people with visual, auditory, motor, or cognitive disabilities can use your application.
2. **Broader Audience**: An accessible app reaches a larger audience, including users with temporary impairments or situational limitations.
3. **Legal and Ethical Standards**: Compliance with laws like the [Saavutettavuusdirektiivi](https://www.saavutettavuusvaatimukset.fi/en) and guidelines like the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/) helps avoid legal issues and fosters ethical development.

By prioritizing accessibility, you create a better experience for everyone.

## Accessibility in React

React provides a strong foundation for building accessible applications, and with intentional coding practices, you can ensure a great user experience. Leveraging semantic HTML, ARIA roles, and attributes in React enables your application to be usable by assistive technologies.

## Best Practices for Accessible React Development

Our template includes a pre-built [UI Kit](/client/src/components/uikit/) featuring accessible components like `Button`, `Text`, or `TextInput`. These components are designed with accessibility in mind, leveraging [React Aria](https://react-spectrum.adobe.com/react-aria/index.html) to provide a solid foundation for inclusivity. We strongly recommend using these components wherever possible to ensure consistent and reliable accessibility standards across your application.

> [!TIP]
> The following tips mostly apply when you are not able to use React Aria and have to implement something from scratch.

### 1. Use Semantic HTML

- Prioritize semantic tags over generic ones.
- Example: Replace `<div onClick={...}>` with `<button onClick={...}>`.
- Benefits: Improved readability and compatibility with assistive technologies.

### 2. Apply WAI-ARIA Roles and Attributes

- Use ARIA only when semantic HTML cannot convey enough information.
- Example: `<div role="alert">` to announce a message to screen readers.
- Reference: [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/).

### 3. Manage Focus Effectively

- Ensure logical focus flow for keyboard users.
- Use `tabindex` to define focus order and focusable elements.
- Use React’s `ref` API to programmatically manage focus (e.g., on modal open/close).

### 4. Provide Visual Feedback for Focus

- Ensure that focused elements are clearly highlighted.
- Use [Panda CSS utilities](/client/src/styled-system/setup/utilities.ts) like `$focusRing` to create visual feedback for focus.

### 5. Maintain Sufficient Color Contrast

- Use tools like [Contrast Checker](https://webaim.org/resources/contrastchecker/) to ensure text meets WCAG contrast ratios.
- Recommended ratios:
  - Normal text: 4.5:1
  - Large text: 3:1

> [!NOTE]
> This should be handled by the design system, but it is important to be aware of it.

### 6. Support Keyboard Navigation and Shortcuts

- Provide full functionality using only the keyboard.
- Example: Use `onKeyDown` or `onKeyUp` handlers to support shortcuts.
- Ensure shortcuts are intuitive and do not conflict with assistive technologies.

## How to Test Accessibility

Accessibility testing ensures your app meets WCAG standards and works with assistive technologies. Here are tools and techniques to evaluate your application:

### Automated Tools

1. **[Lighthouse](https://developers.google.com/web/tools/lighthouse)**

   - Integrated into Chrome DevTools.
   - Provides an accessibility score and actionable suggestions.

2. **[Axe](https://www.deque.com/axe/)**
   - Browser extension for accessibility audits.
   - Highlights issues in the DOM and offers guidance on fixes.

### Manual Testing

1. **Screen Readers**

   - Test your app with screen readers like:
     - VoiceOver (Mac)
     - NVDA (Windows)
     - JAWS (Windows)
   - Ensure proper navigation, labeling, and interaction.

2. **Keyboard Navigation**

   - Test all interactive elements using only the keyboard (Tab, Shift+Tab, Enter, and Space).
   - Verify logical focus order and focus visibility.

3. **Color Contrast Testing**
   - Use contrast checker tools to validate that your color scheme meets WCAG guidelines.

## Accessibility Checklist

Before shipping your React project, ensure you’ve covered the following:

- [ ] All interactive elements use semantic HTML tags.
- [ ] WAI-ARIA roles and attributes are applied appropriately.
- [ ] Logical focus flow is maintained for keyboard users.
- [ ] Focused elements have clear visual indicators.
- [ ] Text and UI elements meet color contrast requirements.
- [ ] Application is fully navigable using only a keyboard.
- [ ] Key workflows are tested with screen readers.
- [ ] Accessibility issues identified by automated tools are resolved.

By embedding accessibility into your development process, you’re creating a more inclusive web and delivering better user experiences.
