#!/bin/bash
: "${COMMON_PUBLIC_PORT:?}"

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
    --baseurl "http://localhost:$COMMON_PUBLIC_PORT" \
    --livereload --livereload-port "$COMMON_PUBLIC_PORT"
else
  # Hugo development
  cd /service/site && \
  hugo server -D --bind=0.0.0.0 --port 8080 \
    --baseURL "http://localhost:$COMMON_PUBLIC_PORT" --appendPort=false \
    --liveReloadPort "$COMMON_PUBLIC_PORT"
fi
