#!/bin/sh
# NOTE: You can use this shell script to execute a CI/CD build.
# BRANCH and IMAGE_TAG are given as parameters.

BRANCH=$1     # e.g. dev, test, stag, canary, or prod
IMAGE_TAG=$2  # e.g. commit SHA

# Set environment variables
# set -e
# set -a
# taito_mode=ci
# taito_target_env=${BRANCH/master/prod}
# . taito-config.sh
# set +a
export taito_mode=ci

# Prepare build
taito build-prepare:$BRANCH $IMAGE_TAG

# Prepare artifacts for deployment in parallel
pids=
taito artifact-prepare:admin:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-prepare:client:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-prepare:graphql:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-prepare:server:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-prepare:worker:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-prepare:www:$BRANCH $IMAGE_TAG & pids="$pids $!"
for pid in $pids; do wait $pid; done

# Deploy changes to target environment
taito db-deploy:$BRANCH
taito deployment-deploy:$BRANCH $IMAGE_TAG

# Test and verify deployment
taito deployment-wait:$BRANCH
taito test:$BRANCH
taito deployment-verify:$BRANCH

# Release artifacts in parallel
pids=
taito artifact-release:admin:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-release:client:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-release:graphql:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-release:server:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-release:worker:$BRANCH $IMAGE_TAG & pids="$pids $!"
taito artifact-release:www:$BRANCH $IMAGE_TAG & pids="$pids $!"
for pid in $pids; do wait $pid; done

# Release build
taito build-release:$BRANCH

# TODO: revert on fail
