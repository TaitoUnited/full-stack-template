---
name: git-workflow
description: Manages git workflow including branch creation, commits, and pushes following project conventions. Use when user requests git operations or when starting new implementations.
disable-model-invocation: false
---

# Git Workflow

Manages git operations following the project's git workflow conventions defined in `git-workflow.md`.

## When to Use

- When user requests git push or commit operations
- When starting a new implementation and need to create a branch
- When checking git status or branch information
- When creating commits following project conventions

## Instructions

1. **Before starting new implementation**:
   - Run `git status` to check current branch
   - If on `dev` or `master`, create a new branch from `dev`:
     - `git checkout -b feature/feature-name dev`
     - Use descriptive feature name in kebab-case

2. **When user prompts for git push**:
   - **Check current branch**: Run `git status` to see current branch
   - **If on dev or master**: Create a new branch from dev first:
     - `git checkout -b feature/feature-name dev`
     - Use descriptive name based on the work being done
   - **CRITICAL: Verify pre-commit requirements BEFORE committing** (from `git-workflow.md`):
     - **Run all linters and typechecks**: `npm run taito-host-lint` (runs both client and server lint + typecheck in parallel)
     - **Run unit tests** (recommended): `npm run taito-host-test-unit` (runs both client and server unit tests in parallel)
     - **Fix any errors** before proceeding to commit - do NOT commit if there are lint or typecheck errors
     - Ensure code follows project conventions and style guidelines
   - **Stage all changes**: `git add .`
   - **Create commit**: Follow commit message conventions from `git-workflow.md`:
     - Format: `<type>(<scope>): <subject>`
     - Types: wip, feat, fix, docs, style, refactor, perf, test, revert, build, ci, chore
     - Subject: lowercase, imperative mood, no period, max ~100 characters
   - **Push to current branch**: `git push origin <current-branch-name>`

3. **Commit message rules**:
   - Type is required and must match allowed types
   - Scope is optional, lowercase (e.g., calibration, device-list, ui, database)
   - Subject must be lowercase, imperative mood, no period
   - Body is optional, explains why not what
   - Footer is optional, for breaking changes or issue references

## Examples

**Creating a branch:**
```bash
git checkout -b feature/user-authentication dev
```

**Commit messages:**
```
feat(calibration): add temperature sensor support
fix(device-list): resolve filter bug when no devices found
docs: update API documentation
wip(ui): add new dashboard component
```

## Important Notes

- `dev` and `master` branches are **not protected**
- Always branch from `dev` when starting new work
- Never commit directly to `dev` or `master` when starting new implementations
- Follow Angular git commit convention for semantic-release compatibility
- Commitlint enforces these rules via git hooks
