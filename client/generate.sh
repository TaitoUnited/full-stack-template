#!/bin/sh

echo
echo "Extracting translations from source code"
echo "Compilation is done automatically by vite lingui plugin"
npm run translations:extract

echo
echo "Generating GraphQL code for client"
npm run generate:graphql

echo "Generating design system"
npm run generate:design-system
