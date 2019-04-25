#!/bin/sh

# NOTE: You can use this shell script to execute a CI/CD build.
# BRANCH and COMMIT_SHA are given as parameters.

BRANCH=$1
COMMIT_SHA=$2

# Set the environment
set -e
export taito_mode=ci

# Install libraries
taito install:$BRANCH

# Do preparations, code scans, and documentation generation in parallel
pids=
taito artifact-prepare:$BRANCH $COMMIT_SHA & pids="$pids $!"
taito scan:$BRANCH & pids="$pids $!"
taito docs:$BRANCH & pids="$pids $!"
for pid in $pids; do wait $pid; done

# Build and push container images in parallel
pids=
(taito artifact-build:admin:$BRANCH $COMMIT_SHA && \
 taito artifact-push:admin:$BRANCH $COMMIT_SHA) & pids="$pids $!"
(taito artifact-build:client:$BRANCH $COMMIT_SHA && \
 taito artifact-push:client:$BRANCH $COMMIT_SHA) & pids="$pids $!"
(taito artifact-build:graphql:$BRANCH $COMMIT_SHA && \
 taito artifact-push:graphql:$BRANCH $COMMIT_SHA) & pids="$pids $!"
(taito artifact-build:server:$BRANCH $COMMIT_SHA && \
 taito artifact-push:server:$BRANCH $COMMIT_SHA) & pids="$pids $!"
(taito artifact-build:worker:$BRANCH $COMMIT_SHA && \
 taito artifact-push:worker:$BRANCH $COMMIT_SHA) & pids="$pids $!"
(taito artifact-build:www:$BRANCH $COMMIT_SHA && \
 taito artifact-push:www:$BRANCH $COMMIT_SHA) & pids="$pids $!"
for pid in $pids; do wait $pid; done

# Deploy changes to server
taito db-deploy:$BRANCH
taito deployment-deploy:$BRANCH $COMMIT_SHA

# Test the new deployment
taito deployment-wait:$BRANCH
taito test:$BRANCH
taito deployment-verify:$BRANCH

# Publish artifacts, release notes and version tag
taito artifact-publish:$BRANCH
taito artifact-release:$BRANCH
