#!/bin/sh

# NOTE: You can use this shell script to execute a CI/CD build.
# BRANCH and IMAGE_TAG are given as parameters.

BRANCH=$1     # e.g. dev, test, stag, canary, or prod
IMAGE_TAG=$2  # e.g. commit SHA

# Set environment variables
set -e
set -a
taito_mode=ci
taito_target_env=${BRANCH/master/prod}
. taito-config.sh
set +a

# Prepare build
taito build-prepare:$BRANCH $IMAGE_TAG

# Build and push container images in parallel
pids=
(taito artifact-build:admin:$BRANCH $IMAGE_TAG && \
 taito artifact-push:admin:$BRANCH $IMAGE_TAG) & pids="$pids $!"
(taito artifact-build:client:$BRANCH $IMAGE_TAG && \
 taito artifact-push:client:$BRANCH $IMAGE_TAG) & pids="$pids $!"
(taito artifact-build:graphql:$BRANCH $IMAGE_TAG && \
 taito artifact-push:graphql:$BRANCH $IMAGE_TAG) & pids="$pids $!"
(taito artifact-build:server:$BRANCH $IMAGE_TAG && \
 taito artifact-push:server:$BRANCH $IMAGE_TAG) & pids="$pids $!"
(taito artifact-build:worker:$BRANCH $IMAGE_TAG && \
 taito artifact-push:worker:$BRANCH $IMAGE_TAG) & pids="$pids $!"
(taito artifact-build:www:$BRANCH $IMAGE_TAG && \
 taito artifact-push:www:$BRANCH $IMAGE_TAG) & pids="$pids $!"
for pid in $pids; do wait $pid; done

# Deploy changes to target environment
taito db-deploy:$BRANCH
taito deployment-deploy:$BRANCH $IMAGE_TAG

# Test and verify deployment
taito deployment-wait:$BRANCH
taito test:$BRANCH
taito deployment-verify:$BRANCH

# Release build
taito build-release:$BRANCH

# TODO: revert on fail
