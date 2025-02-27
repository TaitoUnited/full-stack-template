#!/bin/sh

echo
echo "Extracting translations from source code"
echo "Compilation is done automatically by vite lingui plugin"
npm run lang:extract

echo
echo "Generating GraphQL code for client"
npm run generate:graphql

echo "Generating styled system"
npm run generate:styled-system
