#!/bin/sh

set -e

if [ -f ./site/package.json ]; then
  # Gatsby build
  cd site
  npm run build --prefix-paths
  cp -rf ./public/* /build
elif [ -f ./site/Gemfile ]; then
  # Jekyll build
  cd site
  jekyll build
  cp -rf /_site/* /build
elif [ -f ./site/config.toml ]; then
  # Hugo build
  cd site
  hugo
  cp -rf ./public/* /build
else
  echo No site yet.
fi

if [ -d ./public ]; then
  cp -rf ./public/* /build
fi

# TODO configure live reload for all of these
