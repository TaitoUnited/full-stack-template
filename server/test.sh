#!/bin/sh

echo TODO remove sleep
sleep 5

export suite_name="${1:-*}"
export test_name="${2:-*}"
echo "Running tests: ${suite_name}/${test_name}"

npm run test
