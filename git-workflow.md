# Git Workflow and Conventions

This document defines the git usage patterns and commit message conventions for this repository. It covers branch strategy, commit message format, and push workflow to maintain consistency and enable automated tooling.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Allowed Types

The following types are allowed (from package.json commitlint config):

- **wip** - Work in progress commits on feature branches that will be squashed during rebase
- **feat** - A new feature
- **fix** - A bug fix
- **docs** - Documentation only changes
- **style** - Code style changes (formatting, whitespace, etc. - NOT CSS/styling changes)
- **refactor** - Code restructuring without changing functionality
- **perf** - Performance improvements
- **test** - Adding or modifying tests
- **revert** - Reverting a previous commit
- **build** - Changes to build system, dependencies, or tooling
- **ci** - Changes to CI/CD configuration
- **chore** - Maintenance tasks that don't fit other categories

## Rules

1. **Type**: Required, must be one of the types listed above
2. **Scope**: Optional, lowercase, specifies the component/area (e.g., calibration, device-list, ui, database)
3. **Subject**: Required, lowercase, imperative mood, no period, max ~100 characters
   - ✅ "fix filter bug"
   - ❌ "fixed filter bug" or "fixes filter bug"
4. **Body**: Optional, separated by blank line, explains why not what, wrap lines at 100 characters max
5. **Footer**: Optional, for breaking changes (BREAKING CHANGE:) or issue references (Fixes #123)

## Examples

```
feat(calibration): add temperature sensor support
fix(device-list): resolve filter bug when no devices found
docs: update API documentation
refactor(database): simplify query logic
wip(ui): add new dashboard component
```

## Development Workflow

### Branch Strategy

The `dev` and `master` branches are **not protected**. Development mostly happens by branching out from `dev`.

**When starting a new implementation:**
- Check current branch with `git status`
- If on `dev` or `master`, create a new branch from `dev`: `git checkout -b feature/feature-name dev`
- Work on the feature branch
- When ready, merge back to `dev` via pull request

### Pre-Commit Requirements

**Before committing any changes, ensure:**
- All build errors are fixed (run build commands and verify they succeed)
- All linter errors are fixed (run linter and verify no errors remain)
- Code follows project conventions and style guidelines

This ensures that commits contain working, properly formatted code and prevents broken builds from entering the repository.

### When User Prompts for Git Push

When the user prompts for a new push to git, the following steps should be executed:

1. **Check current branch**: `git status` to see current branch
2. **If on dev or master**: Create a new branch from dev first: `git checkout -b feature/feature-name dev`
3. **Verify build and linter**: Ensure all build errors and linter errors are fixed before committing (see Pre-Commit Requirements above)
4. **Stage all changes**: `git add .`
5. **Create commit**: Make a new commit following the commit message conventions defined above
6. **Push to current branch**: `git push origin <current-branch-name>`

The commit message should accurately describe the changes made, using the appropriate type and scope.

## Why This Convention?

All commit messages must be structured according to the Angular git commit convention. This is because application version number and release notes are generated automatically for production release by the semantic-release library.

The commitlint configuration in package.json enforces these rules via git hooks, so commits that don't follow the convention will be rejected.
