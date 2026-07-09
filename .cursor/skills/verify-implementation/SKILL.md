---
name: verify-implementation
description: Verifies that implementation code matches the feature specification requirements. Use after implementation completion or during code review.
disable-model-invocation: false
---

# Verify Implementation

Verifies that the implementation matches the feature specification requirements.

## When to Use

- After completing implementation
- During code review
- Before merging PRs
- When ensuring spec compliance

## Instructions

1. **Read the feature spec file** from `server/features/` or `client/features/`

2. **Read the implementation code**:
   - Database schema files (`.db.ts`)
   - Service files (`.service.ts`)
   - DAO files (`.dao.ts`)
   - Resolver files (`.resolver.ts`)
   - Test files (`.test.unit.ts`, `.test.api.ts`)
   - Frontend components, routes, stores (for frontend features)

3. **Verify database requirements**:
   - ✅ All tables from spec are implemented
   - ✅ All columns match spec
   - ✅ Foreign keys match spec
   - ✅ Indexes match spec
   - ✅ Migrations exist

4. **Verify API requirements**:
   - ✅ All GraphQL queries/mutations from spec are implemented
   - ✅ All REST routes from spec are implemented
   - ✅ Type definitions match spec
   - ✅ Authentication requirements match spec

5. **Verify authorization**:
   - ✅ Authorization checks match spec
   - ✅ Role requirements match spec
   - ✅ Organisation membership checks match spec

6. **Verify business logic**:
   - ✅ Business logic matches spec description
   - ✅ Validation rules match spec
   - ✅ Edge cases are handled as specified

7. **Verify error handling**:
   - ✅ Error types match spec
   - ✅ Error messages match spec
   - ✅ HTTP status codes match spec
   - ✅ Logging matches spec requirements

8. **Generate verification report**:
   - List verified requirements
   - List missing requirements
   - List mismatches
   - Provide specific recommendations

## Output Format

```
Verification Report for: [feature-name]

Database Requirements:
✅ comment table implemented
✅ All columns match spec
✅ Foreign keys match spec
✅ Indexes match spec
✅ Migration exists

API Requirements:
✅ createComment mutation implemented
✅ comments query implemented
✅ Comment type matches spec
✅ Authentication required as specified

Authorization:
✅ Organisation membership check implemented
✅ Matches spec requirements

Business Logic:
✅ Content validation matches spec (1-5000 chars)
✅ Post verification matches spec
✅ Comment creation logic matches spec

Error Handling:
✅ BAD_REQUEST for validation errors
✅ FORBIDDEN for authorization errors
✅ NOT_FOUND for missing post
⚠️ Error messages differ slightly from spec

Overall Status: ⚠️ WARN - Implementation mostly matches spec, minor message differences
```
