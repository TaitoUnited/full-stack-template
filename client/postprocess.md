# Post-Implementation Quality Checklist

This document outlines the quality criteria that must be met after a feature implementation is complete. Every feature must be checked against these criteria and refactored until all requirements are satisfied.

## Quality Criteria

### 1. Test Execution

- Run all tests
- All tests must pass
- No test failures

### 2. Feature Scope Validation

- Check for redundant functionality
- Remove out-of-scope code
- Stay within scope

### 3. Overengineering Check

- Simplify complex solutions
- Remove premature abstractions
- Prefer simple solutions
- Avoid future-proofing

### 4. Defensive Programming Review

- Follow feature description error handling
- Remove redundant error handling
- Trust the specification
- No additional validation

### 5. Custom Code vs. Dependencies

- Prefer established dependencies
- Avoid reinventing the wheel
- Use recognized libraries
- Check for existing solutions

### 6. Framework and Library Patterns

- Check for React patterns
- Prefer established React patterns
- Use TanStack Router patterns
- Follow Apollo Client patterns

### 7. Architecture Patterns Compliance

- Follow component → hook → GraphQL pattern
- Use state management correctly
- Route organization
- Component organization

### 8. Performance

- Code splitting
- Lazy loading
- Memoization
- Query optimization
- Bundle size

### 9. Accessibility

- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

### 10. CSS Style Validation

**Critical**: Every CSS style must be individually evaluated and justified. CSS styles that fail to meet these criteria must be removed.

#### Feature Specification Precedence

**Before changing or removing any style, check the feature description first.**

- **Spec-defined values are not arbitrary**: If the feature spec (e.g. in `client/features/*.md` or `server/features/*.md`) explicitly documents a custom value—e.g. a Figma color not in the design system, a specific pixel dimension, or an implementation pattern such as "use `style={{ color: '#E4002B' }}`"—that style implements the specification. Do not replace it with a design token or remove it solely because it is "arbitrary" or "inline."
- **Do not "fix" spec-compliant styles**: Replacing a spec-documented custom value with a design token (or moving it in a way that breaks the visual result, e.g. relying on inheritance in a component that overrides color) contradicts "implement exactly as specified" and can introduce bugs. When in doubt, keep the implementation that matches the feature description.
- **Inline styles allowed when required by spec or component API**: Using `style={{}}` is acceptable when (1) the feature spec explicitly specifies a custom value and shows it applied via style, or (2) the only way to achieve the specified look with an existing UI kit component is via a style prop (e.g. custom color on a component that does not inherit from parent). Do not remove or refactor such inline styles unless the result still matches the spec and the UI.

#### Individual Style Evaluation

- **Evaluate each style attribute**: Review every Panda CSS utility, `css()` call, and styled component individually
- **Clear purpose required**: Each style must have a clear, documented purpose related to the feature
- **No defensive styles**: Remove styles added "just in case" or without a specific requirement
- **No redundant styles**: Remove duplicate or overlapping styles that achieve the same visual result
- **No conflicting styles**: Remove styles that conflict with or override each other unnecessarily
- **No legacy styles**: Remove styles that are no longer needed due to refactoring or feature changes

#### Arbitrary Values Check

- **Avoid arbitrary values when not spec-defined**: Prefer design tokens over arbitrary values (e.g., `padding: '$large'` instead of `padding: '13px'`) **unless** the feature spec explicitly documents that custom value (e.g. Figma-specified color or dimension not in the design system).
- **No magic numbers**: Use design tokens from `/src/styled-system/tokens/` instead of hardcoded values, except where the feature description documents a custom value.
- **Check for arbitrary spacing**: Replace arbitrary spacing values with design token spacing where no spec requirement says otherwise.
- **Check for arbitrary colors**: Replace arbitrary color values with design token colors **except** when the feature spec documents a custom color (e.g. brand red from Figma not yet in tokens).
- **Check for arbitrary typography**: Replace arbitrary font sizes, line heights, etc. with design token typography unless specified in the feature.
- **Check for arbitrary radii**: Replace arbitrary border radius values with design token radii unless specified in the feature.
- **Check for arbitrary shadows**: Replace arbitrary shadow values with design token shadows unless specified in the feature.

**Examples:**

**❌ Bad**: Arbitrary values and magic numbers
```tsx
<div className={css({
  padding: '13px',           // ❌ Magic number: use design token
  margin: '7px 11px',         // ❌ Magic numbers: use design tokens
  color: '#1f2937',           // ❌ Arbitrary color: use design token
  fontSize: '15.5px',         // ❌ Magic number: use design token
  borderRadius: '0.375rem',   // ❌ Arbitrary value: use design token
})}>
```

**✅ Good**: Using design tokens
```tsx
<div className={css({
  padding: '$large',          // ✅ Design token
  margin: '$small $medium',   // ✅ Design tokens
  color: '$text',             // ✅ Design token
  fontSize: '$base',           // ✅ Design token
  borderRadius: '$md',         // ✅ Design token
})}>
```

#### Conflicting Styles Check

- **Check for style conflicts**: Identify styles that override each other unnecessarily
- **Check for redundant utilities**: Verify Panda CSS utilities aren't redundant (e.g., `padding: '$large'` and `paddingX: '$large' paddingY: '$large'` together)
- **Check for overridden styles**: Remove styles that are immediately overridden by other styles
- **Check for conflicting styles**: Ensure styles don't conflict with each other

**Examples:**

**❌ Bad**: Conflicting and redundant styles
```tsx
<div className={css({
  padding: '$large',
  paddingX: '$large',         // ❌ Redundant: padding already sets horizontal
  paddingY: '$large',          // ❌ Redundant: padding already sets vertical
  color: '$text',
  color: '$primary',           // ❌ Conflicting: overrides previous color
  width: '100%',
  maxWidth: '100%',            // ❌ Redundant: width 100% already makes it full width
})}>
```

**✅ Good**: Clean, non-conflicting styles
```tsx
<div className={css({
  padding: '$large',           // ✅ Single padding declaration
  color: '$primary',            // ✅ Single color declaration
  width: '100%',               // ✅ Clear purpose
})}>
```

#### Legacy Styles Check

- **Remove legacy styles**: Remove styles from previous implementations that are no longer needed
- **Remove defensive styles**: Remove styles added defensively without a specific requirement
- **Remove commented-out styles**: Clean up commented CSS that's no longer relevant
- **Remove unused styles**: Remove styles that don't affect the final rendered output
- **Remove styles from removed features**: Clean up styles when features are removed

#### Redundancy Check

- **Check for duplicate styles**: Ensure no styles are duplicated across different components or utilities
- **Check for overlapping utilities**: Verify Panda CSS utilities aren't redundant
- **Check for unused styles**: Remove styles that don't affect the final rendered output
- **Check for redundant container structures**: Analyze container structures and remove redundant nesting

#### Panda CSS Pattern Compliance

- **Use Panda CSS utilities**: Prefer Panda CSS `css()` and `styled()` over inline styles or custom CSS when the style is not spec-defined as a custom value.
- **Use design tokens**: Use design tokens (e.g., `'$primary'`, `'$large'`) instead of arbitrary values, except where the feature spec documents a custom value (e.g. Figma color not in design system).
- **Follow Panda CSS patterns**: Use established Panda CSS patterns from existing components.
- **Avoid inline styles when equivalent and safe**: Don't use `style={{}}` when Panda CSS can be used **and** the result matches the spec (e.g. don't move a custom color to a parent if the child component overrides color and won't inherit).
- **Inline styles allowed for spec or API**: Use `style={{}}` when the feature spec explicitly specifies a custom value (e.g. "color: #E4002B via style prop") or when the only way to get the specified look with the current component API is via style.

**Examples:**

**❌ Bad**: Inline styles and custom CSS
```tsx
<div style={{ padding: '13px', color: '#1f2937' }}>
  Content
</div>
```

**✅ Good**: Panda CSS with design tokens
```tsx
<div className={css({ padding: '$large', color: '$text' })}>
  Content
</div>
```

#### Validation Process

For each CSS style (Panda CSS utility, `css()` call, styled component, or inline style):

1. **Check feature spec first**: Is this value or pattern explicitly documented in the feature description (e.g. custom Figma color, dimension, or "use style prop")? If yes, do not replace or remove it; it implements the spec.
2. **Question its purpose**: Why does this style exist? What visual or functional requirement does it serve?
3. **Check for redundancy**: Does another style already achieve this? Can it be combined or simplified?
4. **Check for conflicts**: Does this style conflict with or override other styles unnecessarily?
5. **Check for arbitrary values**: Can arbitrary values be replaced with design tokens **without contradicting the feature spec**?
6. **Check for complexity**: Is there a simpler way to achieve the same result using Panda CSS patterns, **without changing the visual outcome**?
7. **Check against design tokens**: Can this value be replaced with a design token? (Skip if the feature spec documents this as a custom value.)
8. **Remove if unjustified**: If the style cannot be clearly justified and is not required by the feature spec, remove it.

#### Examples

**❌ Bad**: Complex, redundant, and arbitrary styles
```tsx
<div className={css({
  padding: '$large',
  paddingX: '$large',         // ❌ Redundant
  paddingY: '$large',         // ❌ Redundant
  color: '$text',
  color: '$primary',          // ❌ Conflicting
  width: '100%',
  maxWidth: '100%',           // ❌ Redundant
  padding: '13px',            // ❌ Arbitrary value, should use token
  margin: '7px 11px',          // ❌ Arbitrary values
  fontSize: '15.5px',          // ❌ Magic number
  borderRadius: '0.375rem',    // ❌ Arbitrary value
})}>
  Content
</div>
```

**✅ Good**: Clean, purposeful styles with design tokens
```tsx
<div className={css({
  padding: '$large',          // ✅ Clear purpose: padding
  color: '$primary',          // ✅ Clear purpose: text color
  width: '100%',              // ✅ Clear purpose: full width
})}>
  Content
</div>
```

**❌ Bad**: Legacy and defensive styles
```tsx
<div className={css({
  // old-style: from previous implementation  // ❌ Legacy comment
  padding: '$large',
  opacity: 1,                                // ❌ Defensive: default opacity is 1
  display: 'block',                          // ❌ Defensive: div is block by default
  position: 'relative',                     // ❌ Unnecessary: not used for positioning
})}>
  Content
</div>
```

**✅ Good**: Clean, modern styles
```tsx
<div className={css({
  padding: '$large',
})}>
  Content
</div>
```

### 11. Design System Compliance

**Critical**: All new components and styles must be compared against the existing design system before implementation is considered complete.

#### Design System Component Check

- **Check Storybook first**: Before creating new components, verify if existing UI kit components in `/src/components/uikit/` can be used
- **Use existing components**: Prefer existing UI kit components over creating new ones; if none exists, prefer React Aria Components (see architecture) over building from scratch
- **Extend, don't duplicate**: If a component needs customization, extend an existing UI kit component rather than creating a duplicate
- **Component comparison**: After implementation, compare all new components against Storybook to identify:
  - Components that duplicate existing UI kit functionality
  - Components that could be replaced with UI kit components
  - Components that might be generalized into the UI kit only when the same component is needed in multiple places and explicitly decided (do not add new UI kit components as part of feature implementation unless requested)
- **Refactor duplicates**: Remove or refactor components that duplicate UI kit functionality

#### Design Token Check

- **Check design tokens first**: Before using custom values, verify if existing design tokens in `/src/styled-system/tokens/` can be used
- **Use existing tokens**: Prefer existing design tokens (colors, spacing, typography, radii, shadows, etc.) over custom values
- **Token comparison**: After implementation, compare all custom values against design tokens to identify:
  - Custom colors that match existing color tokens
  - Custom spacing values that match existing spacing tokens
  - Custom typography that matches existing typography tokens
  - Custom radii, shadows, or other values that match existing tokens
- **Replace with tokens**: Replace custom values with design tokens where possible
- **Add tokens if needed**: If a new value is truly needed and reusable, consider adding it to the design system tokens

#### Styling Patterns

- **Panda CSS patterns**: Use Panda CSS utilities and patterns consistently
- **Design system patterns**: Follow established design system patterns from existing components
- **Desktop layout**: Ensure proper desktop layout (application is desktop-only, landscape-oriented)
- **Theme compliance**: Ensure components work with both light and dark themes using design system tokens

#### Design System Review Process

1. **Review Storybook**: Check all UI kit components in Storybook (`npm run uikit:preview`)
2. **Compare new components**: For each new component, check if a UI kit component exists that could be used instead
3. **Compare custom values**: For each custom color, spacing, typography value, etc., check if a design token exists
4. **Refactor**: Replace custom components/styles with design system components/tokens
5. **Document exceptions**: If a custom component or value is truly needed, document why it couldn't use the design system

### 12. Error Handling

- Error boundaries
- User-facing errors
- Error recovery
- Error reporting

## Post-Implementation Process

1. **Run tests**: Execute the test suite
2. **Review against feature description**: Compare implementation
3. **Check for redundancy**: Remove out-of-scope code
4. **Simplify**: Remove overengineering
5. **Remove defensive programming**: Follow specification
6. **Evaluate dependencies**: Check for existing solutions
7. **Verify architecture patterns**: Ensure compliance
8. **Check performance**: Verify optimizations
9. **Verify accessibility**: Check ARIA and keyboard support
10. **CSS style validation**: **MANDATORY** - Evaluate all CSS styles individually:
    - **Respect feature spec first**: Do not replace or remove styles that implement values explicitly documented in the feature description (e.g. custom Figma colors, dimensions, or inline style patterns).
    - Check for arbitrary values and replace with design tokens where no spec-defined custom value applies
    - Check for conflicting styles and remove conflicts
    - Check for redundant styles and remove duplicates
    - Check for legacy styles and remove outdated code
    - Verify Panda CSS pattern compliance (inline styles are allowed when required by spec or component API)
    - Remove unjustified styles only when they are not required by the feature spec
11. **Design system compliance check**: **MANDATORY** - Compare all new components and styles against the design system:
    - Review Storybook for existing UI kit components
    - Compare new components against UI kit components
    - Compare custom values against design tokens
    - Replace duplicates with design system components/tokens
    - Document any exceptions
12. **Refactor**: Make necessary changes
13. **Re-test**: Run tests again
14. **Repeat**: Continue until all criteria are met

## Summary

The goal of this checklist is to ensure that:
- Features are implemented exactly as specified
- Code is simple and maintainable
- Error handling follows the specification
- Well-established solutions are preferred
- Architecture patterns are consistently followed
- Performance and accessibility are considered
- **CSS styles are clean, purposeful, and free of conflicts, redundancy, and legacy code**
- **Design tokens are used instead of arbitrary values where the feature spec does not define a custom value** (e.g. Figma colors or dimensions not yet in the design system)
- **Feature spec takes precedence**: styles that implement values explicitly documented in the feature description (e.g. custom Figma red) must not be "fixed" or removed by CSS validation
- **Design system components and tokens are prioritized over custom implementations** where the spec does not require a custom value
- **All new components and styles are compared against the design system before completion**

Following these criteria ensures a clean, maintainable codebase that stays true to the feature specifications and architectural principles outlined in `architecture.md`.
