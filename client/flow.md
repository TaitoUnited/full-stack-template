# Feature Development Flow

This document describes the standardized process for developing features in the client application. This flow ensures consistency, quality, and alignment with architectural principles outlined in [`architecture.md`](./architecture.md), testing patterns in [`testing.md`](./testing.md), and quality criteria in [`postprocess.md`](./postprocess.md).

## Overview

The feature development process consists of sequential steps that must be completed in order. Each step builds upon the previous one and requires user confirmation before proceeding to the next step.

The flow **separates positioning & layout from interactions and data fetching**:

1. **Layout first**: Implement and iterate on positioning, styling, and visual structure until the UI matches the user’s Figma screenshot. No interaction logic or data fetching in this phase.
2. **Interactions and data second**: Add user interactions, GraphQL/API integration, state management, and behavior after layout is approved.

Layout is validated by comparing the app in the browser to the user’s Figma screenshot and iterating until they match (see Step 3 and Prerequisites below). Tests are generated after implementation to verify behavior. For business logic and hooks, a test-driven approach may be used when appropriate.

### Layout iteration (Step 3)

Step 3 is implemented by the **layout-iteration** skill. The skill defines the full procedure (prerequisites, run dev → open browser → capture → compare → fix → repeat until match). Prerequisites: dev server running; user’s Figma screenshot; browser MCP (cursor-ide-browser); optionally a screenshot MCP for pixel comparison. See [`.cursor/skills/layout-iteration/SKILL.md`](../.cursor/skills/layout-iteration/SKILL.md) for details.

## Step 1: Implementation Plan and User Confirmation

**Before generating any code**, read and analyze the feature description, then generate a comprehensive implementation plan that clearly separates layout from interactions and data.

### Process

1. **Read the feature description** thoroughly
2. **Obtain or confirm the user’s Figma screenshot** (or design reference) for the feature. This is the visual target for the layout iteration step.
3. **Review design system**: Check Storybook (`npm run uikit:preview`) and design tokens in `/src/styled-system/tokens/` to identify existing components and tokens that can be used
4. **Generate implementation plan** with two distinct parts:

   **Part A – Positioning & layout (no interactions, no data fetching)**
   - Component structure and hierarchy
   - **Design system component usage**: Existing UI kit components from Storybook
   - **Design token usage**: Colors, spacing, typography from `/src/styled-system/tokens/`
   - Route changes needed for the feature to be visible (e.g. where the component is rendered)
   - Styling requirements (design system first, custom values only where needed)
   - Desktop layout considerations
   - Static content / placeholders only (hardcoded text, mock structure)

   **Part B – Interactions and data (after layout is approved)**
   - GraphQL queries/mutations needed
   - State management needs (stores vs local state)
   - User interaction behaviors (clicks, keyboard, forms, etc.)
   - Error handling approach
   - Loading and empty states
   - Accessibility (ARIA, keyboard navigation) for interactive elements

5. **Present the plan to the user** and get confirmation on:
   - **Security Review**: Authentication, authorization, data handling, XSS prevention (where applicable)
   - **Performance Review**: Rendering performance, bundle size, query optimization, code splitting
   - **Accessibility Review**: ARIA patterns, keyboard navigation, screen readers, focus management
   - **UX Review**: User experience, error states, loading states, empty states, desktop layout
6. **Get user confirmation** on the implementation plan
7. **Wait for user approval** before proceeding

## Step 2: Layout Implementation (Positioning & Styling Only)

Implement **only** positioning, layout, and static visual structure. No user interactions (beyond what is needed to view the screen) and no data fetching. Use hardcoded or placeholder content so the screen can be compared to Figma.

### Process

1. **Implement layout** according to Part A of the plan:
   - Component structure and organization
   - **Design system first**: Use existing UI kit components from `/src/components/uikit/` before creating new ones
   - **Design tokens first**: Use existing design tokens from `/src/styled-system/tokens/` before custom values
   - Route setup so the feature screen is reachable (e.g. dev URL to open in Cursor browser)
   - Styling only: spacing, typography, colors, shadows, borders, dimensions
   - Static/placeholder content only (no API calls, no dynamic state that affects layout)
2. **Follow** [`architecture.md`](./architecture.md) for structure and patterns
3. **Do not add** in this step: click handlers, form submission, GraphQL queries/mutations, loading/error UI that depends on API, route guards that fetch data

**Note**: Verification of layout happens in Step 3 (layout iteration). Do not run full implementation verification until after interactions and data are added.

## Step 3: Layout Iteration (Compare Until Match)

Iterate on layout until the app screen **matches the user’s Figma screenshot**. This step is done when the user confirms that the two match.

### Process

1. **Run the layout-iteration skill**: Follow the procedure in [`.cursor/skills/layout-iteration/SKILL.md`](../.cursor/skills/layout-iteration/SKILL.md).
   - The skill covers: **automatically starting** the dev server if not running (never ask user), opening the feature screen in Cursor browser, capturing state (screenshot MCP or `browser_snapshot` / user comparison), comparing with the user’s Figma screenshot, listing differences, correcting layout in code, and repeating until match or user acceptance.
2. **Do not add** interactions or data fetching in this step—only layout/styling fixes.
3. **Get user confirmation** that layout is approved before proceeding to Step 4.

**CRITICAL**: 
- **Never ask the user to start the dev server**: The layout-iteration skill must automatically start the client dev server if it's not running
- **Automatic startup**: Check if dev server is running, and if not, start it automatically (`cd client && npm start` in background)
- The skill describes prerequisites (dev server, Figma screenshot, browser MCP, optional screenshot MCP) and fallbacks when no screenshot MCP is available (user-led comparison or structure-based comparison).

## Step 4: Interactions and Data Implementation

After layout is approved, implement user interactions, data fetching, and behavior according to Part B of the plan.

### Process

1. **Implement interactions and data** according to Part B of the plan:
   - GraphQL integration (queries, mutations, hooks)
   - State management (stores or local state)
   - User interaction handlers (clicks, keyboard, forms, navigation)
   - Error handling (error boundaries, user feedback, API error states)
   - Loading and empty states
   - Accessibility for interactive elements (ARIA, keyboard navigation)
2. **Follow all architectural patterns** in [`architecture.md`](./architecture.md)
3. **Ensure feature description validation criteria are met** for the full feature

4. **Automatically verify implementation**:
   - **MUST run** `/verify-implementation` skill on the completed implementation
   - **MUST launch** `implementation-verifier` subagent for independent verification
   - **MUST run** `/check-architecture-compliance` skill to verify architecture patterns
   - Review verification results and address any mismatches or violations
   - Only proceed to Step 5 after verification passes or issues are addressed

**Note**: Implementation verification runs automatically as part of this step. Do not skip or make it conditional.

## Step 5: Test Plan Generation

**After implementation** (layout + interactions + data), analyze the implemented feature and generate a comprehensive test plan.

### Process

1. **Review the implemented feature** thoroughly
2. **Generate a test plan** covering:
   - Component rendering tests (layout and static content)
   - User interaction tests
   - Hook tests (if custom hooks were created)
   - Integration tests (component + GraphQL + state)
   - Accessibility tests (ARIA, keyboard navigation)
   - Error handling tests
   - E2E tests (if applicable)
3. **Present the test plan to the user**

4. **Automatically validate test plan**:
   - **MUST launch** `test-plan-validator` subagent to validate test plan against feature spec
   - Review validation results and address any issues
   - Only proceed after validation passes or issues are addressed

5. **Wait for user acceptance** before proceeding

**Note**: Test plan validation runs automatically as part of this step. Do not skip or make it conditional.

## Step 6: Test Generation

Once the user has accepted the test plan:

1. **Generate test files** covering:
   - Component tests (rendering, interactions)
   - Hook tests (if applicable)
   - Integration tests
   - Accessibility tests
   - Error handling tests

2. **Automatically verify test coverage**:
   - **MUST run** `/check-test-coverage` skill on the generated tests
   - Verify coverage matches the test plan from the feature spec
   - Address any missing test coverage before proceeding

3. **Present test suite to user for review**

4. **Wait for user acceptance** before proceeding

**Note**: Test coverage verification runs automatically as part of this step. Do not skip or make it conditional.

## Step 7: Post-Implementation Review and Refactoring

After generating the feature, evaluate and refactor against [`postprocess.md`](./postprocess.md).

### Process

1. **Review the git diff**
2. **Evaluate against quality criteria**
3. **Refactor the code** to address violations
4. **Re-run tests** after refactoring
5. **Repeat** until all quality criteria are met

## Step 8: Summary and Architecture Review

Once the feature and its tests have been generated and refactored, provide a comprehensive summary.

### Process

1. **Generate a summary** including:
   - Generated files
   - Component changes (layout and interactions/data)
   - Route changes
   - GraphQL changes
   - Test coverage
   - Configuration changes
2. **Review deviations from architecture**
3. **Present the summary to the user**

## Process Checklist

- [ ] **Step 1**: Implementation plan generated and confirmed (layout vs interactions/data separated)
  - [ ] User’s Figma screenshot (or design reference) confirmed
  - [ ] Security concerns reviewed (if applicable)
  - [ ] Performance concerns reviewed (if applicable)
  - [ ] Accessibility concerns reviewed (if applicable)
  - [ ] UX concerns reviewed (if applicable)
  - [ ] User confirmation received
- [ ] **Step 2**: Layout implemented (positioning & styling only, no interactions/data)
- [ ] **Step 3**: Layout iteration complete (run `/layout-iteration` skill until Cursor browser matches Figma screenshot, user approval)
- [ ] **Step 4**: Interactions and data implemented; verification passed
- [ ] **Step 5**: Test plan generated and accepted
- [ ] **Step 6**: Test suite generated and accepted
- [ ] **Step 7**: Git diff reviewed and refactored
- [ ] **Step 8**: Summary generated and presented

## References

- [`architecture.md`](./architecture.md) - Client architecture patterns
- [`testing.md`](./testing.md) - Testing patterns
- [`postprocess.md`](./postprocess.md) - Post-implementation quality checklist

## Notes

- **Never skip steps**: All steps must be completed in order
- **Layout before interactions/data**: Positioning and layout are implemented and iterated until the Cursor browser screenshot matches the user’s Figma screenshot; only then are interactions and data fetching added
- **Layout iteration uses Cursor browser**: Step 3 requires running the app in dev mode, opening it in Cursor browser (MCP), taking a screenshot, comparing with the user’s Figma screenshot, fixing differences, and repeating until they match
- **Always get user confirmation**: Steps 1, 3 (layout approval), 5, and 6 require explicit user acceptance
- **Follow the architecture**: All implementations must follow patterns in `architecture.md`
- **Meet quality criteria**: All code must pass the quality checklist in `postprocess.md`
- **No new markdown files**: The flow only edits the feature description file. All other outputs (implementation plans, test plans, summaries) are presented as normal text output to the user, not as new `.md` files
- **Document deviations in summary**: Any deviations from architecture must be included in the Step 8 summary output with reasoning
- **Test after implementation**: Tests are generated after the full implementation (layout + interactions + data) to verify the actual behavior
