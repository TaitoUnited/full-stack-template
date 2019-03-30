#!/bin/bash

export suite_name="${1:-*}"
export test_name="${2:-*}"

if [[ "${suite_name}" == "cypress"* ]]; then
  npm run cypress:run
else
  # TODO pass suite name and test name
  npm run test
fi
