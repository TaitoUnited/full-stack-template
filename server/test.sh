#!/bin/sh

export suite_name="${1}"
export test_name="${2}"

case $suite_name in
  unit)
    npm run test:unit -- "${test_name}"
    ;;
  api)
    npm run test:api -- "${test_name}"
    ;;
  integration)
    npm run test:integration -- "${test_name}"
    ;;
  *)
    echo "Unknown test suite: ${suite_name}"
    exit 1
    ;;
esac
