#!/bin/sh

export suite_name="${1:-*}"
export test_name="${2:-*}"

npm run test
