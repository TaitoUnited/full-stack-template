#!/bin/bash

# Builds the site with the given command and copies build results
# to the destination directory.
# TODO: configure live reload for all of these static-site-generators
command=$1
dest_dir=$2

set -e
mkdir -p "${dest_dir}"

if [[ -f ./site/package.json ]]; then
  # Gatsby build
  cd site
  npm run "${command}"
  cp -rf ./public/* "${dest_dir}"
elif [[ -f ./site/Gemfile ]]; then
  # Jekyll build
  cd site
  jekyll "${command}"
  cp -rf /_site/* "${dest_dir}"
elif [[ -f ./site/config.toml ]]; then
  # Hugo build
  cd site
  # TODO: "${command}"
  hugo
  cp -rf ./public/* "${dest_dir}"
else
  # No site yet
  echo No site yet.
fi

if [[ -d ./public ]]; then
  cp -rf ./public/* "${dest_dir}"
fi
