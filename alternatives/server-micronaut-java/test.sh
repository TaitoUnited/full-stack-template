#!/bin/sh

export suite_name="${1:-*}"
export test_name="${2:-*}"

case $suite_name in
  junit)
    ./gradlew test
    ;;
esac
