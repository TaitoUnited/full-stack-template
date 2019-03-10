#!/bin/bash

set -x

if [ ! -d ./site ]; then
  echo No site yet.
elif [ -f ./site/package.json ]; then
  # Gatsby build
  cd site && \
  npm run build -- --prefix-paths && \
  cp -rf ./public/* /build
elif [ -f ./site/Gemfile ]; then
  # Jekyll build
  cd site && \
  jekyll build && \
  cp -rf /_site/* /build
else
  # Hugo build
  cd site && \
  hugo && \
  cp -rf ./public/* /build
fi

# TODO configure live reload for all of these
