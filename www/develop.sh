#!/bin/bash
: "${COMMON_PUBLIC_PORT:?}"

set -x

if [ -f ./site/package.json ]; then
  # Gatsby development
  cd /service/site && \
  npm install && \
  npm run develop -- --host 0.0.0.0 --port 8080 --prefix-paths
elif [ -f ./site/Gemfile ]; then
  # Jekyll development
  cd /service/site && \
  bundle update && \
  bundle exec jekyll serve --host 0.0.0.0 --port 8080 \
    --baseurl "http://localhost:${COMMON_PUBLIC_PORT}" \
    --livereload --livereload-port "${COMMON_PUBLIC_PORT}"
elif [ -f ./site/config.toml ]; then
  # Hugo development
  cd /service/site && \
  hugo server -D --bind=0.0.0.0 --port 8080 \
    --baseURL "http://localhost:${COMMON_PUBLIC_PORT}" --appendPort=false \
    --liveReloadPort "${COMMON_PUBLIC_PORT}"
elif [ -d ./assets ]; then
  echo "Serving static assets from www/assets"
  npm run serve
else
  echo "develop.sh: No site yet at www/site. Just keep the container running."
  tail -f /dev/null
fi
