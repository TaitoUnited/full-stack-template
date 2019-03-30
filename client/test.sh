#!/bin/bash

export suite_name="${1:-*}"
export test_name="${2:-*}"

if [[ "${suite_name}" == "cypress"* ]]; then
  npm run cypress:run
elif [[ "${suite_name}" == "suite1" ]]; then
  npm run test
elif [[ "${suite_name}" == "suite2" ]]; then
  echo "Run example suite 2"
else
  echo "ERROR: Uknown test suite: ${suite_name}"
  exit 1
fi
