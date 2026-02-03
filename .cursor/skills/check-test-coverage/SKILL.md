---
name: check-test-coverage
description: Verifies that test coverage matches the test plan from the feature specification. Use after test generation or during test review.
disable-model-invocation: false
---

# Check Test Coverage

Verifies that test coverage matches the test plan requirements from the feature specification.

## When to Use

- After generating tests
- Before implementation
- During test review
- When ensuring test completeness

## Instructions

1. **Read the feature spec file** from `server/features/` or `client/features/`

2. **Extract test plan requirements**:
   - Look for test plan section or test requirements
   - Identify test categories (unit, integration, API)
   - Identify specific test cases mentioned

3. **Read the test files**:
   - Unit test files (`.test.unit.ts`)
   - Integration test files (`.test.api.ts`)
   - Frontend test files (for frontend features)

4. **Map tests to requirements**:
   - Match test cases to spec requirements
   - Identify covered requirements
   - Identify missing requirements

5. **Check test categories**:
   - ✅ Unit tests for business logic
   - ✅ Integration tests for services
   - ✅ API tests for endpoints
   - ✅ Authorization tests
   - ✅ Error handling tests

6. **Generate coverage report**:
   - List covered requirements
   - List missing requirements
   - Provide recommendations

## Output Format

```
Test Coverage Report for: [feature-name]

Test Categories:
✅ Unit tests present
✅ Integration tests present
✅ API tests present
✅ Authorization tests present
✅ Error handling tests present

Coverage by Requirement:
✅ Content validation tests (1-5000 chars)
✅ Post verification tests
✅ Comment creation tests
✅ Organisation membership tests
⚠️ Edge case: empty content after trim - not tested
✅ Error: Post not found
✅ Error: User not member of organisation

Missing Coverage:
- Edge case: Content with only whitespace

Overall Status: ⚠️ WARN - Most requirements covered, one edge case missing
```
