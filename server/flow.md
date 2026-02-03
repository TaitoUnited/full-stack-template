# Feature Development Flow

This document describes the standardized process for developing features in the server application. This flow ensures consistency, quality, and alignment with architectural principles outlined in [`architecture.md`](./architecture.md), testing patterns in [`testing.md`](./testing.md), and quality criteria in [`postprocess.md`](./postprocess.md).

## Overview

The feature development process consists of sequential steps that must be completed in order. Each step builds upon the previous one. After the test plan is verified by the user, the entire implementation process proceeds automatically without further user confirmation.

The flow is based on Test-Driven Development methodology. The idea is that test planning and generation is a key step done before implementation. Implementation is done to satisfy the behavior required in tests.

## Step 1: Test Plan Generation

**Before generating any code**, read and analyze the feature description, then generate a comprehensive test plan.

### Process

1. **Read the feature description** thoroughly to understand:
   - Business requirements
   - Database requirements
   - API requirements (GraphQL/REST)
   - Authorization requirements
   - Business logic
   - Error handling scenarios

2. **Generate a test plan** that covers:
   - **Unit tests**: Test individual functions and utilities in isolation
   - **Integration tests**: Test services with database access
   - **API tests**: Test full GraphQL/REST API endpoints
   - **Authorization tests**: Test authentication and authorization scenarios
   - **Error handling tests**: Test all error scenarios described in the feature
   - **Edge case tests**: Test boundary conditions and edge cases

3. **Present the test plan to the user** as normal output (not a new `.md` file)

4. **Automatically validate test plan**:
   - **MUST launch** `test-plan-validator` subagent to validate test plan against feature spec
   - Review validation results and address any issues
   - Only proceed after validation passes or issues are addressed

5. **Wait for user acceptance** before proceeding to Step 2

**Note**: Test plan validation runs automatically as part of this step. Do not skip or make it conditional.

**CRITICAL**: After the user accepts the test plan, Steps 2-7 proceed automatically without further user confirmation.

### Test Plan Structure

The test plan should include:
- Test categories (unit, integration, API)
- Specific test cases for each category
- Test data requirements
- Expected outcomes for each test
- Coverage of all feature requirements

## Step 2: Test generation

Once the user has accepted the test plan, proceed automatically:

1. **Generate the test suite** according to [`architecture.md`](./architecture.md) and [`testing.md`](./testing.md)

2. **Automatically verify test coverage**:
   - **MUST run** `/check-test-coverage` skill on the generated tests
   - Verify coverage matches the test plan from the feature spec
   - Address any missing test coverage before proceeding

3. **Proceed automatically** to Step 3 without waiting for user review

**Note**: Test coverage verification runs automatically as part of this step. Do not skip or make it conditional. 

## Step 3: Implementation Plan

Generate the implementation plan automatically:

### Process

1. **Generate implementation plan** (presented as normal output to the user, not a new `.md` file) that includes:
   - Database schema changes (tables, migrations)
   - GraphQL/REST API changes (queries, mutations, routes)
   - Service layer implementation
   - DAO layer implementation
   - Resolver/route handler implementation
   - Test implementation
   - File structure and organization

2. **Review the following topics automatically** (presented as normal output, not a new `.md` file):

#### a) Security Review

**When to review**: If the feature includes:
- Creation of new API endpoints (GraphQL queries/mutations or REST routes)
- Adding new fields to existing API responses
- Modifying authentication or authorization logic

**Automatic review process**:
- Review the feature description's "Authorization Requirements" section
- Ensure authentication and authorization are properly specified
- Verify that authorization checks align with the feature requirements
- Update the feature description's "Authorization Requirements" section if clarifications are needed based on the feature spec

#### b) Scalability Review

**When to review**: If the feature includes:
- New database inserts (creating new records)
- Bulk operations
- Data import/export functionality
- High-frequency operations

**Automatic review process**:
- Review the feature description's "Database Requirements" section
- Ensure database indexing strategies are considered for new tables and queries
- Verify that scalability concerns are addressed in the feature spec
- Update the feature description's "Database Requirements" section with indexing strategies and performance considerations if needed based on the feature spec

#### c) Performance Review

**When to review**: If the feature includes:
- Creation of new API endpoints
- Adding new fields to existing API responses
- Complex database queries
- External API integrations

**Automatic review process**:
- Review the feature description for performance requirements
- Ensure N+1 query concerns are addressed for nested data
- Verify that caching strategies are considered if applicable
- Update the feature description with performance requirements and any caching or optimization strategies if needed based on the feature spec

3. **Proceed automatically** to Step 4 without waiting for user confirmation

## Step 4: Feature Implementation

After receiving user confirmation on the implementation plan, update the feature description if necessary, then generate the feature according to [`architecture.md`](./architecture.md).

### Process

1. **Update feature description** if any changes were made based on Step 2 confirmations:
   - Update "Authorization Requirements" section if security concerns were addressed
   - Update "Database Requirements" section if scalability concerns were addressed
   - Add performance requirements if performance concerns were addressed

2. **Generate the feature** following all patterns and conventions from [`architecture.md`](./architecture.md):
   - **Database layer**: Create `.db.ts` schema files and migrations
   - **DAO layer**: Create `.dao.ts` files with database access functions
   - **Service layer**: Create `.service.ts` files with business logic and authorization
   - **Resolver/Routes layer**: Create `.resolver.ts` or `.routes.ts` files for API endpoints
   - **Tests**: Create `.test.unit.ts`, `.test.integration.ts`, and `.test.api.ts` files
   - **Registration**: Register resolvers in `/setup/graphql/schema.ts` and routes in `/setup/setup.ts`

3. **Follow all architectural patterns**:
   - Resolver → Service → DAO data flow
   - Context passing (services receive `AuthenticatedContext`, DAOs receive `DrizzleDb`)
   - Authentication in resolvers (`.withAuth()` or `server.authenticate`)
   - Authorization in services (`checkOrganisationMembership()`, `hasValidOrganisationRole()`)
   - Error handling (`throwApiError()` in services, `GraphQLError` in resolvers, `ApiRouteError` in REST routes)
   - Logging (only warnings/errors using `ctx.log`, no `console.*` methods)
   - Configuration and secrets (use `config` object and `getSecrets()`)

4. **Ensure feature description validation criteria are met**:
   - ✅ Business Rationale
   - ✅ Database Requirements
   - ✅ GraphQL/REST API Requirements
   - ✅ Authorization Requirements
   - ✅ Configuration and Secrets
   - ✅ Business Logic Description
   - ✅ Error Handling

5. **Automatically verify implementation**:
   - **MUST run** `/verify-implementation` skill on the completed implementation
   - **MUST launch** `implementation-verifier` subagent for independent verification
   - **MUST run** `/check-architecture-compliance` skill to verify architecture patterns
   - Review verification results and address any mismatches or violations
   - Only proceed to Step 5 after verification passes or issues are addressed

**Note**: Implementation verification runs automatically as part of this step. Do not skip or make it conditional.

6. **Proceed automatically** to Step 5 without waiting for user confirmation

## Step 5: Post-Implementation Review and Refactoring

After generating the feature, automatically evaluate and refactor the "git diff" against [`postprocess.md`](./postprocess.md).

### Process

1. **Review the git diff** to see all changes made during implementation

2. **Automatically evaluate against [`postprocess.md`](./postprocess.md) quality criteria**:
   - ✅ **Test Execution**: Run all tests and ensure they pass
   - ✅ **Feature Scope Validation**: Remove any code not in the feature description
   - ✅ **Overengineering Check**: Simplify complex solutions, remove premature abstractions
   - ✅ **Defensive Programming Review**: Remove error handling not specified in feature description
   - ✅ **Custom Code vs. Dependencies**: Replace custom code with established dependencies where appropriate
   - ✅ **Framework and Plugin Patterns**: Use Fastify plugins and established patterns
   - ✅ **Architecture Patterns Compliance**: Follow resolver → service → DAO pattern
   - ✅ **Logging Compliance**: Only log warnings/errors using `ctx.log`, no `console.*` methods
   - ✅ **Configuration and Secrets**: Use `config` object and `getSecrets()`

3. **Refactor the code** to address any violations:
   - Remove out-of-scope code
   - Simplify overengineered solutions
   - Remove redundant error handling
   - Replace custom code with dependencies where appropriate
   - Fix architecture pattern violations
   - Fix logging violations
   - Fix configuration/secrets access patterns

4. **Re-run tests** after refactoring to ensure nothing broke

5. **Repeat** until all quality criteria are met

6. **Proceed automatically** to Step 6 without waiting for user confirmation

**Note**: Postprocess review runs automatically as part of this step. Do not skip or make it conditional.

## Step 6: Live Check Against Running Application

After postprocess review is complete, **automatically start** the application and database containers, then run live checks against the running interface.

### Process

1. **Automatically start database container** (do not ask user):
   - Check if database container is already running: `docker ps | grep autoklinikka-parts-database`
   - If not running, start it automatically: `docker-compose up -d autoklinikka-parts-database`
   - Wait for database to be ready (check health or wait a few seconds with incremental checks)

2. **Automatically start server container** (do not ask user):
   - Check if server container is already running: `docker ps | grep autoklinikka-parts-server`
   - If not running, start it automatically: `docker-compose up -d autoklinikka-parts-server`
   - Wait for server to be ready (check `/api/healthz` endpoint with incremental waits, not long fixed delays)

3. **Run live checks**:
   - **MUST run** API tests against the live server: `cd server && npm run test:api`
   - Verify that all API tests pass against the running application
   - Check that the health endpoint responds: `curl http://localhost:8016/api/healthz` or equivalent
   - Verify that any new GraphQL queries/mutations work against the live server
   - Address any failures before proceeding

4. **Stop containers** after live checks complete:
   - Stop server container: `docker-compose stop autoklinikka-parts-server`
   - Stop database container: `docker-compose stop autoklinikka-parts-database`

**CRITICAL**: 
- **Never ask the user to start containers**: Start them automatically if they're not running
- **Never skip this step**: Live check runs automatically as part of this step. Do not skip or make it conditional
- **Only stop containers after all checks pass**: Keep containers running until all live checks are complete

## Step 7: Summary and Architecture Review

Once the feature and its tests have been generated and refactored, provide the user with a comprehensive summary.

### Process

1. **Generate a summary** (presented as normal output to the user, not a new `.md` file) that includes:
   - **Generated files**: List all files created or modified
   - **Database changes**: List all schema changes and migrations
   - **API changes**: List all new GraphQL queries/mutations or REST routes
   - **Test coverage**: Summary of test files and test cases
   - **Configuration changes**: Any new environment variables or secrets

2. **Review deviations from [`architecture.md`](./architecture.md)**:
   - Identify any deviations from architectural patterns
   - Provide reasoning for each deviation
   - Explain why the deviation was necessary or acceptable
   - Include any patterns that should be considered for future features in the summary output

3. **Present the summary to the user** as normal output (not a new `.md` file) with:
   - Complete list of generated content
   - Any deviations from architecture patterns and their reasoning
   - Next steps (if any)
   - Any follow-up questions or concerns

### Summary Structure

The summary should be organized as follows (presented as text output to the user):

```
## Feature Implementation Summary

### Generated Files
- [List of all created/modified files]

### Database Changes
- [Schema changes]
- [Migrations created]

### API Changes
- [GraphQL queries/mutations]
- [REST routes]

### Test Coverage
- [Unit tests]
- [Integration tests]
- [API tests]

### Configuration Changes
- [New environment variables]
- [New secrets]

### Architecture Deviations
- [Any deviations and their reasoning]
```

## Process Checklist

Use this checklist to ensure all steps are completed:

- [ ] **Step 1**: Test plan generated and accepted by user
- [ ] **Step 2**: Test suite generated and coverage verified
- [ ] **Step 3**: Implementation plan generated
  - [ ] Security concerns reviewed (if applicable)
  - [ ] Scalability concerns reviewed (if applicable)
  - [ ] Performance concerns reviewed (if applicable)
- [ ] **Step 4**: Feature description updated (if needed)
- [ ] **Step 4**: Feature implemented according to architecture.md
- [ ] **Step 4**: Implementation verified (verify-implementation, implementation-verifier, check-architecture-compliance)
- [ ] **Step 5**: Git diff reviewed against postprocess.md
- [ ] **Step 5**: All quality criteria met
- [ ] **Step 5**: Tests passing after refactoring
- [ ] **Step 6**: Database container started
- [ ] **Step 6**: Server container started
- [ ] **Step 6**: Live API tests run and passing
- [ ] **Step 6**: Health endpoint verified
- [ ] **Step 6**: Containers stopped after checks
- [ ] **Step 7**: Summary generated (as normal output, not a new file)
- [ ] **Step 7**: Architecture deviations reviewed and included in summary
- [ ] **Step 7**: Summary presented to user (as normal output, not a new file)

## References

- [`architecture.md`](./architecture.md) - Server architecture patterns and conventions
- [`testing.md`](./testing.md) - Testing patterns and conventions
- [`postprocess.md`](./postprocess.md) - Post-implementation quality checklist

## Notes

- **Never skip steps**: All steps must be completed in order
- **User confirmation only at Step 1**: After test plan acceptance, Steps 2-7 proceed automatically
- **Follow the architecture**: All implementations must follow patterns in `architecture.md`
- **Meet quality criteria**: All code must pass the quality checklist in `postprocess.md`
- **No new markdown files**: The flow only edits the feature description file. All other outputs (test plans, implementation plans, summaries) are presented as normal text output to the user, not as new `.md` files
- **Document deviations in summary**: Any deviations from architecture must be included in the Step 7 summary output with reasoning
- **Automatic execution**: After Step 1, the entire implementation process runs automatically without user intervention until completion
- **Live checks required**: Step 6 must start containers, run live checks, and stop containers before proceeding to summary
