#!/bin/sh

export suite_name="${1}"
export test_name="${2:-*}"

case $suite_name in
  cypress)
    echo "No cypress tests"
    ;;
esac
