---
name: generate-css-wireframe
description: Generates a CSS container structure wireframe showing container hierarchy and nesting. Use during frontend feature generation to visualize layout structure before implementation.
disable-model-invocation: false
---

# Generate CSS Container Wireframe

Generates a visual wireframe showing the CSS container structure, nesting hierarchy, and key layout properties for a frontend feature.

## When to Use

- During frontend feature generation (Step 2, Section 2.5)
- After UI/UX Requirements section is complete
- Before proceeding to User Interactions section
- When container structure needs verification before implementation

## Instructions

1. **Read the UI/UX Requirements section** from the feature spec being generated
   - Extract component structure information
   - Identify all containers and their relationships
   - Note layout properties (flex, grid, positioning)

2. **Analyze container hierarchy**:
   - Identify root container(s)
   - Map parent-child relationships
   - Note sibling containers
   - Identify nested structures

3. **Extract key layout properties**:
   - Display type (flex, grid, block, etc.)
   - Direction (row, column)
   - Alignment properties
   - Spacing (gap, padding, margin)
   - Positioning (relative, absolute, fixed)

4. **Generate wireframe**:
   - Create a visual representation showing container nesting
   - Use indentation or visual boxes to show hierarchy
   - Label each container with its purpose/name
   - Include key layout properties for each container
   - Keep it simple - focus on structure, not styling details

5. **Add wireframe as a chapter in the feature description**:
   - Insert the wireframe as a section (e.g. `## CSS Container Structure Wireframe`) **within the same feature spec document** (`feature-name.md`)
   - Do not create a separate wireframe file. One document per feature always; otherwise the implementation flow gets messed up.
   - Use markdown format with clear structure; include ASCII art or structured text representation

6. **Present to user**:
   - Show the wireframe clearly
   - Explain container hierarchy
   - Highlight key layout decisions
   - Get user confirmation before proceeding

## Wireframe Format

The wireframe should be a simple, clear representation:

```markdown
# CSS Container Structure Wireframe: [Feature Name]

## Container Hierarchy

```
┌─────────────────────────────────────────────────┐
│ Root Container (Page/Component)                 │
│ display: flex, flexDirection: column            │
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ Header Container                          │  │
│ │ display: flex, flexDirection: row         │  │
│ ├───────────────────────────────────────────┤  │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│ │ │ Logo     │ │ Nav      │ │ User     │  │  │
│ │ │          │ │ Links    │ │ Info     │  │  │
│ │ └──────────┘ └──────────┘ └──────────┘  │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ Content Container                         │  │
│ │ display: flex, flexDirection: column     │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Key Layout Properties

### Root Container
- Display: flex
- Flex Direction: column
- Gap: [value]

### Header Container
- Display: flex
- Flex Direction: row
- Justify Content: space-between
- Padding: [value]

### Logo Container
- Width: [value]
- Height: [value]

### Navigation Container
- Display: flex
- Flex Direction: row
- Gap: [value]

### User Info Container
- Display: flex
- Flex Direction: row
- Gap: [value]
```

## Output Requirements

- **Location**: Wireframe is a **chapter** (section) inside the single feature description document (`feature-name.md`). Do not create a separate file.
- **Format**: Markdown with ASCII art or structured text, as a `## CSS Container Structure Wireframe` (or equivalent) section
- **Content**: Container hierarchy, nesting relationships, key layout properties
- **Clarity**: Simple and easy to understand at a glance
- **Completeness**: All containers from UI/UX Requirements should be represented

## Integration with Feature Spec

- The wireframe lives **in the same document** as the rest of the feature description. One document per feature always.
- The wireframe section should align with the component structure described in UI/UX Requirements.
- Implementation uses this single spec document (including the wireframe chapter) when implementing styled components.

## Example

For a navigation bar feature:

```markdown
# CSS Container Structure Wireframe: Top Navigation Bar

## Container Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ TopNavBar (Root)                                            │
│ display: flex, flexDirection: row, justifyContent: space-between │
│ padding: 0px $large, height: 64px                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ LeftSection                                          │  │
│ │ display: flex, flexDirection: row, gap: $medium      │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ ┌──────────────┐ ┌──────────────────────────────┐   │  │
│ │ │ LogoContainer│ │ TabsGroup                    │   │  │
│ │ │ width: 150px │ │ display: flex, gap: 0px      │   │  │
│ │ └──────────────┘ └──────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐  │
│ │ RightSection                                         │  │
│ │ display: flex, flexDirection: row, gap: 0px         │  │
│ ├───────────────────────────────────────────────────────┤  │
│ │ ┌──────────────┐ ┌──────────────────────────────┐   │  │
│ │ │ TeamTab      │ │ UserTab                      │   │  │
│ │ │ width: 155px │ │ width: 204px                 │   │  │
│ │ └──────────────┘ └──────────────────────────────┘   │  │
│ └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Layout Properties

### TopNavBar (Root)
- Display: flex
- Flex Direction: row
- Justify Content: space-between
- Align Items: center
- Padding: 0px $large (32px horizontal)
- Gap: $2xl (48px)
- Height: 64px
- Width: 100%

### LeftSection
- Display: flex
- Flex Direction: row
- Align Items: center
- Gap: $medium (24px)
- Height: 64px

### LogoContainer
- Width: 150px
- Height: 24px
- Display: flex
- Align Items: center
- Justify Content: center

### TabsGroup
- Display: flex
- Flex Direction: row
- Gap: 0px
- Height: 64px

### RightSection
- Display: flex
- Flex Direction: row
- Justify Content: flex-end
- Align Items: center
- Gap: 0px
- Height: 64px

### TeamTab / UserTab
- Display: flex
- Flex Direction: row
- Justify Content: center
- Align Items: center
- Padding: 0px $medium (24px horizontal)
- Gap: $xs (8px)
- Height: 64px
- Min Width: 120px
```

## Notes

- Keep wireframes simple - focus on structure, not visual design
- Use clear, descriptive container names
- Include only essential layout properties
- Show nesting relationships clearly
- Make it easy to verify container structure at a glance