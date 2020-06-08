#!/bin/sh

set -e

if [ "${1}" = "install" ]; then
  mkdir -p /build
  if [ -z "$(ls -A /path/to/dir)" ]; then
    # Copy the original build to the empty shared volume
    cp -rf /build-orig/* /build
  fi
  # Clone git and install libraries for real-time builds
  git clone "https://${WEBHOOK_VC_TOKEN}@${VC_REPOSITORY_URL}" repository
  cd /service/repository/www
  git checkout "${COMMON_ENV}"
  npm run install-site
fi

# Run build using up-to-date git repository
cd /service/repository/www
git pull
npm run build
