#!/bin/bash

export suite_name="${1:-*}"
export test_name="${2:-*}"

if [[ "${suite_name}" == "cypress"* ]] && [[ "${taito_mode:-}" != "ci" ]]; then
  npm run cypress:run
elif [[ "${suite_name}" == "cypress"* ]] && [[ "${taito_mode}" == "ci" ]]; then
  echo "SKIP: Cypress tests are currently disabled in ci mode because of an"
  echo "connection problem."
else
  # TODO pass suite name and test name
  npm run test
fi
