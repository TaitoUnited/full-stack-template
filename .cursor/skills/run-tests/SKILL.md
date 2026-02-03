---
name: run-tests
description: Runs all tests (client unit tests, server unit/integration/API tests, and Playwright E2E tests) with proper database setup. Use when the user asks to run tests, verify tests, or check test status.
disable-model-invocation: false
---

# Run Tests

Runs all test suites for the project: client unit tests, server tests (unit, integration, API), and Playwright E2E tests. Automatically handles database setup for server tests.

## When to Use

- User asks to "run tests" or "run all tests"
- User wants to verify test status
- Before committing code changes
- After implementing features
- When debugging test failures

## Test Execution Flow

The skill runs tests in this order:

1. **Client Unit Tests** - Fast, no dependencies
2. **Server Tests** - Requires database (automatically started)
   - Unit tests
   - Integration tests  
   - API tests
3. **Playwright E2E Tests** - Requires full app stack

## Instructions

### Step 1: Run Client Unit Tests

Run client unit tests first (fastest, no dependencies):

```bash
cd client && npm run test:unit
```

**Expected output**: Vitest test results for client unit tests

**If tests fail**: Report failures and stop execution. Do not proceed to server tests.

### Step 2: Automatically Ensure Database is Running (for Server Tests)

**CRITICAL**: Never ask the user to start the database. Start it automatically if needed.

Before running server tests, check if the database container is running:

```bash
docker ps | grep -q autoklinikka-parts-database
```

**If database is NOT running**:
1. **Automatically start** the database container (do not ask user):
   ```bash
   cd server && npm run dev:db:start
   ```
2. Wait for database to be ready (the script handles this automatically, but use incremental checks)
3. Verify database is ready before proceeding (check health or wait with short incremental delays)

**If database is already running**: Proceed to Step 3

**Never prompt the user**: If the database is not running, start it automatically without asking.

### Step 3: Run Server Tests

Run all server test suites using the test script:

```bash
cd server && ./scripts/run-tests.sh
```

This script automatically:
- Loads environment variables from `.env.local` if present
- Sets test database defaults (DATABASE_PORT=7974, etc.)
- Checks database container status
- Runs all test suites sequentially:
  - Unit tests (`npm run test:unit`)
  - Integration tests (`npm run test:integration`)
  - API tests (`npm run test:api`)

**Expected output**: Test results for all three server test suites

**If tests fail**: Report failures and stop execution. Do not proceed to Playwright tests.

### Step 4: Run Playwright E2E Tests

**CRITICAL**: Playwright E2E tests require the full application stack to be running. **Never ask the user to start it** - start it automatically if needed.

**Before running Playwright tests**:
1. Check if the full app stack is running:
   - Client: `curl http://localhost:3000` or check port 3000
   - Server: `curl http://localhost:4000/api/healthz` or `curl http://localhost:8016/api/healthz` or check ports 4000/8016
   - Database: `docker ps | grep autoklinikka-parts-database`

2. **If not running, automatically start the full stack** (do not ask user):
   - Option A: Run `npm start` from project root (starts everything via docker-compose)
   - Option B: Start individual services:
     - Database: `cd server && npm run dev:db:start`
     - Server: `cd server && npm start` (in background)
     - Client: `cd client && npm start` (in background)

3. Wait for services to be ready (use short incremental waits with health checks)

Run end-to-end tests:

```bash
cd playwright && TEST_USER_PASSWORD=$test_all_TEST_USER_PASSWORD npm run playwright:test
```

**Note**: If `$test_all_TEST_USER_PASSWORD` is not set, use the default from environment or skip the variable.

**Expected output**: Playwright test results

**If tests fail**: Report failures

**Never prompt the user**: If the app stack is not running, start it automatically without asking.

## Complete Command Sequence

For local development, run:

```bash
# 1. Client unit tests
cd client && npm run test:unit

# 2. Ensure database is running (if not already)
docker ps | grep -q autoklinikka-parts-database || (cd server && npm run dev:db:start)

# 3. Server tests (handles database check internally)
cd server && ./scripts/run-tests.sh

# 4. Playwright E2E tests
cd playwright && TEST_USER_PASSWORD=$test_all_TEST_USER_PASSWORD npm run playwright:test
```

## Environment Handling

### Local Development

- Uses `server/scripts/run-tests.sh` which handles database setup
- Database container: `autoklinikka-parts-database`
- Default database port: `7974`
- Test database: `autoklinikka_parts_local`

### CI/Cloud Environments

For CI environments (`taito_mode=ci`), tests run via Taito CLI:
- Server tests: `taito util test:server:${taito_target_env}`
- Playwright tests: `taito util test:playwright:${taito_target_env}`

The skill should detect CI environment and use appropriate commands.

## Error Handling

- **Client tests fail**: Stop execution, report failures
- **Database won't start**: Report error, suggest checking Docker/Docker Compose
- **Server tests fail**: Stop execution, report which suite failed
- **Playwright tests fail**: Report failures but don't block (E2E tests are often flaky)

## Output Format

After running all tests, provide a summary:

```
Test Execution Summary:
✅ Client unit tests: [X] passed, [Y] failed
✅ Server unit tests: [X] passed, [Y] failed  
✅ Server integration tests: [X] passed, [Y] failed
✅ Server API tests: [X] passed, [Y] failed
✅ Playwright E2E tests: [X] passed, [Y] failed

Overall Status: [PASS/FAIL]
```

## Notes

- **CRITICAL**: **NEVER ask the user to start services**. Always start them automatically if needed.
- Server tests require the database container to be running - start it automatically if not running
- The `run-tests.sh` script automatically handles database startup if needed
- Client unit tests are fast and have no external dependencies
- Playwright tests require the full application stack to be running - start it automatically if not running
- Tests run sequentially to avoid resource conflicts
- When starting services, run them in the background (`is_background: true`) so they don't block test execution
