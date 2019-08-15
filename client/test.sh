#!/bin/sh

export suite_name="${1}"
export test_name="${2}"

case $suite_name in
  cypress)
    if [ "$taito_mode" = "ci" ]; then
      echo
      echo "Cypress disabled on CI because of:"
      echo "https://github.com/cypress-io/cypress-docker-images/issues/39"
      echo
    else
      npm run cypress:run
    fi
    ;;
esac
