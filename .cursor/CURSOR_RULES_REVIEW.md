# Cursor Rules Review: Blind Spots, Inconsistencies, and Conflicts

## Executive Summary

This review identifies blind spots, inconsistencies, and conflicting instructions across `.cursorrules`, agent files, skill files, and flow documentation. Issues are categorized by severity and impact.

**Last Updated**: 2026-02-02
**Status**: Critical issues fixed, review document updated

---

## 🔴 CRITICAL ISSUES (Conflicts & Major Inconsistencies)

### 1. **Git Workflow: Branch Creation Timing Conflict** ✅ FIXED

**Location**: `.cursorrules` vs `git-workflow.md` vs `server/flow.md`

**Status**: Fixed - Added clarification that branch creation happens at the start of Implementation Workflow, before reading feature spec. Added reference to Git Workflow section.

---

### 2. **Test Plan Validation: Step Numbering Mismatch** ✅ FIXED

**Location**: `.cursorrules` vs `server/flow.md` vs `client/flow.md`

**Status**: Fixed - Updated `.cursorrules` line 112 to reflect correct step numbers:
- Backend: Step 1 (correct)
- Frontend: Step 5 (was incorrectly Step 3)

---

### 3. **Test Generation: Step Numbering Mismatch** ✅ FIXED

**Location**: `.cursorrules` vs `server/flow.md` vs `client/flow.md`

**Status**: Fixed - Updated `.cursorrules` line 117 to reflect correct step numbers:
- Backend: Step 2 (correct)
- Frontend: Step 6 (was incorrectly Step 4)

---

### 4. **Implementation Verification: Step Numbering Mismatch** ✅ FIXED

**Location**: `.cursorrules` vs `server/flow.md` vs `client/flow.md`

**Status**: Fixed - Updated `.cursorrules` line 123 to reflect correct step numbers:
- Backend: Step 4 (correct)
- Frontend: Step 4 (was incorrectly Step 2)

---

### 5. **App Startup: Port Number Inconsistency** ✅ FIXED

**Location**: `.cursorrules` vs `server/flow.md`

**Status**: Fixed - Clarified port usage in `.cursorrules`:
- Port 8016: Used when running via docker-compose (`npm start` from root)
- Port 4000: Used when running server directly (`npm start` in server/ directory)
- Added clear explanation of which port to check based on startup method

---

## ⚠️ MAJOR INCONSISTENCIES

### 6. **Feature Generation Workflow: Validation Step Reference**

**Location**: `.cursorrules` vs `server/feature-generation-flow.md` / `client/feature-generation-flow.md`

**Issue**: `.cursorrules` (line 103) says validation happens "After completing Step 3 (Finalize Feature Description)" but the feature-generation-flow.md files may have different step numbering or structure.

**Recommendation**: Verify that feature-generation-flow.md files have Step 3 as "Finalize Feature Description" or update `.cursorrules` to match actual flow.

---

### 7. **Git Workflow: Pre-Commit Requirements Location** ✅ FIXED

**Location**: `git-workflow.md` vs `.cursorrules`

**Status**: Fixed - Added pre-commit requirements check to both `.cursorrules` (line 153) and `git-workflow/SKILL.md` (line 31-34). Both now reference build/linter checks before committing.

---

### 8. **App Startup: Docker vs npm start** ✅ FIXED

**Location**: `.cursorrules` vs `server/flow.md`

**Status**: Fixed - Clarified in `.cursorrules`:
- Preferred method: `npm start` from project root (docker-compose, port 8016)
- Alternative method: Individual services (direct npm start, port 4000)
- Added port number clarification for each method

---

## 🟡 MINOR INCONSISTENCIES & BLIND SPOTS

### 9. **Missing: What Happens After Implementation Verification Fails?**

**Location**: `.cursorrules`, `server/flow.md`, `client/flow.md`

**Blind Spot**: All documents say "address any verification issues" but don't specify:
- How many retry attempts?
- What if issues can't be fixed?
- Should implementation be rolled back?
- When is it acceptable to proceed with warnings vs errors?

**Recommendation**: Add guidance on handling verification failures and retry limits.

---

### 10. **Missing: Feature Spec Update Process** ✅ FIXED

**Location**: `.cursorrules`, `server/flow.md`

**Status**: Fixed - Added clarification in `.cursorrules` that feature specs can be updated during implementation if security, scalability, or performance concerns are identified (referencing flow files for details).

---

### 11. **Missing: Test Plan Location** ✅ FIXED

**Location**: Multiple files

**Status**: Fixed - Added clarification in `.cursorrules` that test plans are presented as normal text output (not saved as `.md` files) and validated against feature specs.

---

### 12. **Missing: Subagent Launch Instructions** ✅ FIXED

**Location**: `.cursorrules`, agent files

**Status**: Fixed - Added clarification in `.cursorrules` that subagents are launched using Cursor's agent system. Added error handling guidance if subagent launch fails.

---

### 13. **Inconsistent: "Session Ends" Meaning** ✅ FIXED

**Location**: `.cursorrules`

**Status**: Fixed - Added clarification in `.cursorrules` Important Notes section that "session ends" means waiting for the user's next instruction rather than starting new work.

---

### 14. **Missing: Error Handling for Automatic Validations** ✅ FIXED

**Location**: `.cursorrules`, skill files

**Status**: Fixed - Added error handling guidance in `.cursorrules` Validation Execution Rules section:
- Report errors to user
- Attempt manual validation if possible
- Ask for guidance if critical validation cannot run

---

### 15. **Inconsistent: User Confirmation Points**

**Location**: `server/flow.md` vs `client/flow.md`

**Issue**:
- `server/flow.md` (line 44): Says "After the user accepts the test plan, Steps 2-7 proceed automatically without further user confirmation"
- `client/flow.md` (line 219): Says "Steps 1, 3 (layout approval), 5, and 6 require explicit user acceptance"
- Different confirmation patterns between backend and frontend

**Recommendation**: Document why confirmation patterns differ, or align them if possible.

---

### 16. **Missing: Docker Container Management**

**Location**: `.cursorrules`, `server/flow.md`

**Blind Spot**:
- `server/flow.md` (line 237-239): Says to stop containers after live checks
- `.cursorrules` (line 186): Mentions docker-compose but doesn't mention stopping containers
- No guidance on when to keep containers running vs stopping them

**Recommendation**: Add guidance on container lifecycle management.

---

### 17. **Missing: Feature Spec Validation Before Implementation**

**Location**: `.cursorrules`, `server/flow.md`, `client/flow.md`

**Blind Spot**:
- `.cursorrules` says feature spec validation happens during feature generation
- But `server/flow.md` Step 1 says to "read the feature description" - should it validate first?
- No check that feature spec is valid before starting implementation

**Recommendation**: Add validation check at start of implementation workflow to ensure spec is valid.

---

### 18. **Inconsistent: Test Coverage Check Timing**

**Location**: `.cursorrules` vs `check-test-coverage/SKILL.md`

**Issue**:
- `.cursorrules` (line 119): Says to run `/check-test-coverage` "After test generation"
- `check-test-coverage/SKILL.md` (line 13): Says "After generating tests" OR "Before implementation"
- Conflicting guidance on when to check coverage

**Recommendation**: Clarify that test coverage check happens after test generation, not before implementation.

---

### 19. **Missing: Architecture Compliance Check Details**

**Location**: `.cursorrules` vs `check-architecture-compliance/SKILL.md`

**Blind Spot**:
- `.cursorrules` says to run `/check-architecture-compliance` after implementation
- But doesn't specify what happens if compliance fails
- `check-architecture-compliance/SKILL.md` doesn't specify retry process

**Recommendation**: Add guidance on handling architecture compliance failures.

---

### 20. **Inconsistent: Wireframe Location**

**Location**: `spec-validator.md` vs `validate-feature-spec/SKILL.md`

**Issue**:
- Both say wireframe should be "a chapter within the same document" (not separate file)
- But wording slightly differs - could be clearer

**Recommendation**: Use identical wording in both files for consistency.

---

## 📋 SUMMARY OF RECOMMENDATIONS

### ✅ High Priority (FIXED)
1. ✅ Fix step numbering conflicts between `.cursorrules` and flow files (Issues #2, #3, #4)
2. ✅ Clarify port numbers for server health checks (Issue #5)
3. ✅ Clarify branch creation timing in workflow (Issue #1)

### ✅ Medium Priority (FIXED)
4. ✅ Clarify docker-compose vs npm start usage (Issue #8)
5. ✅ Add subagent launch instructions (Issue #12)
6. ✅ Clarify test plan storage location (Issue #11)
7. ✅ Add error handling for validation failures (Issue #14)
8. ✅ Add pre-commit requirements to git workflow (Issue #7)
9. ✅ Clarify feature spec update process (Issue #10)
10. ✅ Clarify "session ends" meaning (Issue #13)

### ⚠️ Low Priority (Remaining - Nice to Have)
11. Document container lifecycle management (Issue #16)
12. Add validation check at start of implementation (Issue #17)
13. Clarify test coverage check timing details (Issue #18)
14. Add architecture compliance failure handling details (Issue #19)

---

## 🔍 ADDITIONAL OBSERVATIONS

### Positive Aspects
- Good separation of concerns between backend/frontend workflows
- Comprehensive validation and verification steps
- Clear documentation structure
- Good use of automatic validations

### Areas for Improvement
- Step numbering consistency across documents
- More explicit error handling guidance
- Clearer tool invocation instructions
- Better alignment between `.cursorrules` and flow files

---

## 📝 NEXT STEPS

1. **Create fix plan**: Prioritize critical issues first
2. **Update `.cursorrules`**: Fix step numbering references
3. **Update flow files**: Ensure consistency with `.cursorrules`
4. **Add missing guidance**: Fill in blind spots identified
5. **Test updated rules**: Verify no new conflicts introduced
