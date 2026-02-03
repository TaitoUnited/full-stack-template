---
name: check-architecture-compliance
description: Verifies that code follows architecture patterns from architecture.md. Use after implementation or during code review.
disable-model-invocation: false
---

# Check Architecture Compliance

Verifies that implementation code follows the architectural patterns and conventions defined in `architecture.md`.

## When to Use

- After completing implementation
- During code review
- When refactoring code
- When ensuring architectural consistency

## Instructions

1. **Read the architecture documentation**:
   - `server/architecture.md` for backend features
   - `client/architecture.md` for frontend features

2. **Read the implementation code** for the feature

3. **Verify domain organization**:
   - ✅ Code is organized in domain folders (backend)
   - ✅ Components follow naming conventions (frontend)
   - ✅ File suffixes match conventions (`.resolver.ts`, `.service.ts`, `.dao.ts`, etc.)

4. **Verify structure**:
   - ✅ Domain-specific code is co-located
   - ✅ Tests are co-located with code
   - ✅ File organization matches architecture patterns

5. **Verify patterns**:
   - ✅ Service layer patterns are followed
   - ✅ DAO layer patterns are followed
   - ✅ Resolver patterns are followed
   - ✅ Error handling patterns are followed

6. **Generate compliance report**:
   - List compliant areas
   - List violations
   - Provide specific recommendations

## Output Format

```
Architecture Compliance Report for: [feature-name]

Domain Organization:
✅ Code organized in comment/ domain folder
✅ File suffixes match conventions (.resolver.ts, .service.ts, .dao.ts)
✅ Tests co-located with code

Structure:
✅ Domain-specific code co-located
✅ File organization matches architecture patterns

Patterns:
✅ Service layer patterns followed
✅ DAO layer patterns followed
✅ Resolver patterns followed
✅ Error handling patterns followed

Overall Status: ✅ PASS - Code follows architecture patterns
```
