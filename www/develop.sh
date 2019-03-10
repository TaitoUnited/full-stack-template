#!/bin/bash

set -x

if [ ! -d ./site ]; then
  # No site yet. Just keep container running.
  tail -f /dev/null
elif [ -f ./site/package.json ]; then
  # Gatsby development
  cd /service/site && \
  npm install && \
  npm run develop -- --host 0.0.0.0 --port 8080 --prefix-paths
elif [ -f ./site/Gemfile ]; then
  # Jekyll development
  cd /service/site && \
  bundle update && \
  bundle exec jekyll serve --host 0.0.0.0 --port 8080 \
    --baseurl http://localhost:9999 \
    --livereload --livereload-port 9999
else
  # Hugo development
  cd /service/site && \
  hugo server -D --bind=0.0.0.0 --port 8080 \
    --baseURL http://localhost:9999 --appendPort=false \
    --liveReloadPort 9999
fi
