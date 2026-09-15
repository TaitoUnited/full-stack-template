#!/usr/bin/env bash
#
# Everything checkable on a developer machine, cheapest failure first: the
# static checks and unit tests, then end to end against a running stack.
#
# Reached through `taito test`, which dispatches here via `taito-host-test`.
# Only ever runs on a host: the CI path lives in `test:playwright`, which
# branches on `taito_mode` and targets a deployed environment instead.
#
# Two things it is careful about:
#
#   - It starts the stack only if nothing is answering yet, and stops it only if
#     it was the one that started it, so it never tears down a stack left up for
#     manual testing.
#   - Where it does start one it passes --clean, because both databases seed
#     through docker-entrypoint-initdb.d and that only runs on a fresh volume.

set -euo pipefail

cd "$(dirname "$0")/.."

env_file="playwright/.env.local"

# Playwright reads TEST_BASE_URL from that file, so the readiness check uses the
# same value rather than a second hardcoded port that could drift from it.
if [ -z "${TEST_BASE_URL:-}" ] && [ -f "$env_file" ]; then
  TEST_BASE_URL="$(grep -E '^TEST_BASE_URL=' "$env_file" | tail -1 | cut -d= -f2- | tr -d '"'"'"'[:space:]')"
fi

if [ -z "${TEST_BASE_URL:-}" ]; then
  echo "ERROR: TEST_BASE_URL is unset and $env_file does not define it." >&2
  exit 1
fi

started_stack=false

stack_is_up() {
  curl -fsS -o /dev/null -m 2 "$TEST_BASE_URL"
}

stop_if_ours() {
  if [ "$started_stack" = true ]; then
    echo "==> Stopping the stack this run started"
    taito stop
  fi
}
trap stop_if_ours EXIT

echo "==> Verifying"
npm run verify

if stack_is_up; then
  echo "==> Stack is already answering at $TEST_BASE_URL, leaving it as it is"
else
  echo "==> Starting the stack"
  taito start --clean
  started_stack=true

  printf '==> Waiting for %s ' "$TEST_BASE_URL"
  for _ in $(seq 1 180); do
    if stack_is_up; then
      printf '\n'
      break
    fi
    printf '.'
    sleep 1
  done

  if ! stack_is_up; then
    printf '\n'
    echo "ERROR: the stack did not answer at $TEST_BASE_URL within 180s." >&2
    exit 1
  fi
fi

echo "==> Running end to end tests"
npm run test
