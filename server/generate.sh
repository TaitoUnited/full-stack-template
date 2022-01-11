#!/bin/sh

echo
echo "Generating example gql files for integration tests"
npm run generate:test-gql
rm -rf test/graphql/generated/subscriptions # TODO: make these work!

echo
echo "Generating sdk for integration tests"
npm run generate:test-sdk
