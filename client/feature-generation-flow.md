# Feature Description Generation Flow

This document describes the process for generating feature descriptions that serve as the single source of truth for feature development. Feature descriptions are stored in the [`client/features/`](./features/) folder and must be created before implementing any feature.

## Overview

The feature description generation process ensures that all required information is captured before implementation begins. The generated feature description must meet all validation criteria defined in [`architecture.md`](./architecture.md) before it can be used for implementation.

## Process

### Step 1: Gather Initial Requirements

1. **Understand the feature request** from the user
2. **Ask clarifying questions** if needed
3. **Determine component organization**: Decide whether the feature extends existing components or requires new ones
4. **Determine the feature name** and create the file path: [`client/features/feature-name.md`](./features/)

### Step 2: Generate and Confirm Sections One by One

Generate each required section **one at a time**, present it to the user, and **get confirmation before proceeding** to the next section.

#### Section 1: Business Rationale

- Clear value proposition
- Business purpose
- User benefit
- Present to user and get confirmation

#### Section 2: UI/UX Requirements

- Component structure
- User interface design
- Desktop layout considerations (application is desktop-only, landscape-oriented)
- Accessibility requirements (see [`architecture.md`](./architecture.md); if the feature includes **tablists**, specify that implementation must use **React Aria Tabs** from `react-aria-components`)
- Present to user and get confirmation

#### Section 2.5: CSS Container Structure Wireframe

- **MUST run** `/generate-css-wireframe` skill to generate container structure wireframe
- Extract container hierarchy from UI/UX Requirements section
- Generate visual wireframe showing:
  - Container nesting relationships
  - Key layout properties (display, flex-direction, etc.)
  - Container names and purposes
- **Add the wireframe as a chapter** within the same feature description document (e.g. `## CSS Container Structure Wireframe`). Always produce only one document per feature; no separate wireframe file.
- Present wireframe to user for verification
- Get user confirmation before proceeding

**Note**: The wireframe is part of the single feature description. One document per feature keeps the implementation flow consistent.

#### Section 3: User Interactions

- User interaction patterns (clicks, hovers, keyboard navigation, etc.)
- Interactive element behaviors
- State changes triggered by user actions
- Form interactions (if applicable)
- Modal/dialog interactions (if applicable)
- Drag and drop interactions (if applicable)
- Keyboard shortcuts (if applicable)
- Present to user and get confirmation

#### Section 4: Route and Navigation Requirements

- Route changes needed
- Navigation patterns
- Route guards
- URL structure
- Present to user and get confirmation

#### Section 5: GraphQL/API Requirements

- GraphQL queries/mutations needed
- Data fetching patterns
- Cache management
- Error handling
- Present to user and get confirmation

#### Section 6: State Management Requirements

- Client state needs
- Store requirements
- Local state vs global state
- State persistence
- Present to user and get confirmation

#### Section 7: Styling Requirements

- Design system usage
- Custom styling needs
- Desktop layout considerations (application is desktop-only, landscape-oriented)
- Theme considerations
- Present to user and get confirmation

#### Section 8: Business Logic Description

- Clear, unambiguous description
- Input/Output specifications
- Edge cases
- Validation rules
- State transitions
- Present to user and get confirmation

#### Section 9: Error Handling

- Error scenarios
- Error display patterns
- Error recovery
- User feedback
- Logging requirements
- Present to user and get confirmation

### Step 3: Finalize Feature Description

Once all sections have been generated and confirmed:

1. **Automatically validate the complete feature description**:
   - **MUST run** `/validate-feature-spec` skill on the completed spec
   - **MUST launch** `spec-validator` subagent in background for comprehensive validation
   - Review validation results and address any issues
   - Validation checks all required sections are present and complete

2. **Only after validation passes**: Save the complete feature description as a **single file** in [`client/features/`](./features/) as `feature-name.md` (including the wireframe chapter). One document per feature always.

**Note**: Validation runs automatically as part of this step. Do not skip or make it conditional.

## Section Rejection and Revision

**If a section does not meet the validation criteria or user requirements, it must be revised before proceeding to the next section.**

## Next Steps

Once a feature description is finalized:

1. The feature description can be used with [`flow.md`](./flow.md) to implement the feature
2. Use the prompt: `generate feature X with flow.md` where X is the feature name
3. The implementation flow will read the feature description and follow the standardized development process

## References

- [`architecture.md`](./architecture.md) - Feature Description Template and validation criteria
- [`testing.md`](./testing.md) - Testing patterns and conventions
- [`flow.md`](./flow.md) - Feature implementation flow
