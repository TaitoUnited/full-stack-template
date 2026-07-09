---
name: validate-feature-spec
description: Validates a feature specification file against completeness and quality criteria. Use when reviewing feature specs, before implementation, or when ensuring spec quality.
disable-model-invocation: false
---

# Validate Feature Spec

Validates a feature specification markdown file against the required structure and completeness criteria.

## When to Use

- After generating a feature spec
- Before starting implementation
- When reviewing feature specs
- During code review of feature specs

## Instructions

1. **Read the feature spec file** provided by the user (from `server/features/` or `client/features/`)

2. **Determine the spec type**:
   - Backend specs: Located in `server/features/`
   - Frontend specs: Located in `client/features/`

3. **Validate required sections**:

   **For Backend Specs** (7 required sections):
   - ✅ Business Rationale
   - ✅ Database Requirements
   - ✅ GraphQL/REST API Requirements
   - ✅ Authorization Requirements
   - ✅ Configuration and Secrets
   - ✅ Business Logic Description
   - ✅ Error Handling

   **For Frontend Specs** (9 required sections):
   - ✅ Business Rationale
   - ✅ UI/UX Requirements
   - ✅ User Interactions
   - ✅ Route and Navigation Requirements
   - ✅ GraphQL/API Requirements
   - ✅ State Management Requirements
   - ✅ Styling Requirements
   - ✅ Business Logic Description
   - ✅ Error Handling

4. **Check section quality**:
   - Each section should have substantial content (not just placeholder text)
   - Business Rationale should clearly state value proposition
   - Database Requirements should specify tables, schemas, migrations
   - API Requirements should specify operations, types, auth
   - Authorization Requirements should specify access controls
   - Business Logic should be clear and unambiguous
   - Error Handling should cover all error scenarios

5. **Check wireframe (Frontend specs only)**:
   - Verify the feature spec document **contains a CSS Container Structure Wireframe section** (a chapter within the same document, e.g. `## CSS Container Structure Wireframe`)
   - Do not expect a separate wireframe file; one document per feature always
   - The wireframe section should show container hierarchy and nesting relationships
   - The wireframe section should include key layout properties

6. **Check consistency**:
   - API types should align with database schema
   - Authorization requirements should align with API requirements
   - Error handling should align with business logic

7. **Generate validation report**:
   - List missing sections
   - List incomplete sections
   - List missing wireframe chapter (for frontend specs: wireframe must be a section in the same doc, not a separate file)
   - List inconsistencies
   - Provide specific recommendations for improvement

8. **Return validation result**:
   - ✅ PASS: All sections present and complete
   - ⚠️ WARN: Sections present but need improvement
   - ❌ FAIL: Missing sections or critical issues

## Output Format

```
Validation Report for: [feature-name].md

Section Completeness:
✅ Business Rationale - Complete
✅ Database Requirements - Complete
⚠️ GraphQL/REST API Requirements - Present but needs more detail on error responses
✅ Authorization Requirements - Complete
✅ Configuration and Secrets - Complete
✅ Business Logic Description - Complete
✅ Error Handling - Complete

Wireframe Check (Frontend specs):
✅ Feature spec contains CSS Container Structure Wireframe section (chapter in same document)
✅ Wireframe section shows container hierarchy and key layout properties

Consistency Checks:
✅ API types align with database schema
⚠️ Authorization requirements mention roles not defined in API section

Recommendations:
1. Add error response examples to GraphQL/REST API Requirements
2. Clarify role definitions in Authorization Requirements

Overall Status: ⚠️ WARN - Spec is mostly complete but needs minor improvements
```
