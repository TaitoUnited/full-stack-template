#!/bin/sh

export suite_name="${1}"
export test_name="${2}"

case $suite_name in
  pytest)
    case $test_name in
      unit)
        pytest blog
        ;;
      integration)
        pytest test
        ;;
      "")
        pytest
        break
        ;;
      *)
        pytest -k "${test_name}"
      ;;
    esac
    ;;
esac
