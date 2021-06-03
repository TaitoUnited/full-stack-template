#!/bin/sh

export suite_name="${1}"
export test_name="${2}"

if [ "$TEST_ENV_REMOTE" = "true" ]; then
  echo "Waiting for db proxy to connect"
  sleep 10
fi

case $suite_name in
  jest)
    npm run test -- "${test_name}"
    ;;
esac
