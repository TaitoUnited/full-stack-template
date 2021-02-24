#!/bin/bash
: "${COMMON_PUBLIC_PORT:?}"

# Starts development mode
# TODO: configure development for all of these static-site-generators

set -e

if [[ -f ./site/package.json ]]; then
  # Gatsby
  cd /develop/site
  npm install
  npm run start:docker
elif [[ -d ./public ]]; then
  # Static files only
  echo "Serving static public assets from www/public"
  npm run serve
else
  # No site yet
  echo "develop.sh: No site yet at www/site. Just keep the container running."
  echo "develop.sh: See CONFIGURATION.md for configuration instructions."
  tail -f /dev/null
fi
