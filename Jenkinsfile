/*
# TODO execute the same steps that are defined in cloudbuild.yaml:

# Set the environment
export taito_mode="ci"
export COMMIT_SHA="NOTE: get from jenkins environment"
export $BRANCH_NAME="NOTE: get from jenkins environment"

# Some preparations
taito ci-prepare:server:$BRANCH_NAME $COMMIT_SHA
taito install:$BRANCH_NAME
taito ci-release-pre:$BRANCH_NAME
taito scan:$BRANCH_NAME

# Build docs
taito docs:$BRANCH_NAME

# Build and push container images: admin, bot, client, server, worker
taito ci-build:admin:$BRANCH_NAME $COMMIT_SHA
taito ci-push:admin:$BRANCH_NAME $COMMIT_SHA
taito ci-build:client:$BRANCH_NAME $COMMIT_SHA
taito ci-push:client:$BRANCH_NAME $COMMIT_SHA
taito ci-build:graphql:$BRANCH_NAME $COMMIT_SHA
taito ci-push:graphql:$BRANCH_NAME $COMMIT_SHA
taito ci-build:server:$BRANCH_NAME $COMMIT_SHA
taito ci-push:server:$BRANCH_NAME $COMMIT_SHA
taito ci-build:worker:$BRANCH_NAME $COMMIT_SHA
taito ci-push:worker:$BRANCH_NAME $COMMIT_SHA

# Deploy changes to server
taito db-deploy:$BRANCH_NAME
taito ci-deploy:$BRANCH_NAME $COMMIT_SHA

# Test the new deployment
taito ci-wait:$BRANCH_NAME
taito test:$BRANCH_NAME
taito ci-verify:$BRANCH_NAME

# Publish artifacts, release notes and version tag
taito ci-publish:$BRANCH_NAME
taito ci-release-post:$BRANCH_NAME
*/
