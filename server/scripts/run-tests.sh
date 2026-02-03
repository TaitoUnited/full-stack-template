#!/bin/bash
# Script to run all server tests with proper environment configuration

set -e

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$PROJECT_ROOT"

# Load environment variables from .env.local if it exists
if [ -f "$PROJECT_ROOT/../.env.local" ]; then
  set -a
  while IFS='=' read -r key value; do
    [ -n "$key" ] && [ -n "$value" ] && export "$key=$value"
  done < <(grep -v '^#' "$PROJECT_ROOT/../.env.local" | grep -v '^DOCKER_HOST')
  set +a
fi

# Set defaults for test environment
export DATABASE_PORT=${DATABASE_PORT:-7974}
export DATABASE_SSL_ENABLED=${DATABASE_SSL_ENABLED:-false}
export DATABASE_HOST=${DATABASE_HOST:-127.0.0.1}
export DATABASE_PASSWORD=${DATABASE_PASSWORD:-testpassword123}
export DATABASE_NAME=${DATABASE_NAME:-autoklinikka_parts_local}
export DATABASE_USER=${DATABASE_USER:-autoklinikka_parts_app}
export SESSION_SECRET=${SESSION_SECRET:-test_session_secret}
export EXAMPLE_SECRET=${EXAMPLE_SECRET:-test_example_secret}

# Check if database is running
echo "Checking database connection..."
if ! docker ps | grep -q autoklinikka-parts-database; then
  echo "⚠️  Database container is not running. Starting it..."
  cd "$SERVER_DIR"
  npm run dev:db:start
  echo "Waiting for database to be ready..."
  sleep 3
fi

cd "$SERVER_DIR"

# Run all test suites
echo ""
echo "🧪 Running unit tests..."
npm run test:unit

echo ""
echo "🧪 Running integration tests..."
npm run test:integration

echo ""
echo "🧪 Running API tests..."
npm run test:api

echo ""
echo "✅ All tests completed!"
