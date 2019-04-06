/*
# TODO execute the same steps that are defined in cloudbuild.yaml:

# Set the environment
export taito_mode="ci"
export COMMIT_SHA="NOTE: get from jenkins environment"
export $BRANCH_NAME="NOTE: get from jenkins environment"

# Some preparations
taito install:$BRANCH_NAME
taito artifact-prepare:$BRANCH_NAME $COMMIT_SHA
taito scan:$BRANCH_NAME

# Build docs
taito docs:$BRANCH_NAME

# Build and push container images: admin, bot, client, server, worker
taito artifact-build:admin:$BRANCH_NAME $COMMIT_SHA
taito artifact-push:admin:$BRANCH_NAME $COMMIT_SHA
taito artifact-build:client:$BRANCH_NAME $COMMIT_SHA
taito artifact-push:client:$BRANCH_NAME $COMMIT_SHA
taito artifact-build:graphql:$BRANCH_NAME $COMMIT_SHA
taito artifact-push:graphql:$BRANCH_NAME $COMMIT_SHA
taito artifact-build:server:$BRANCH_NAME $COMMIT_SHA
taito artifact-push:server:$BRANCH_NAME $COMMIT_SHA
taito artifact-build:worker:$BRANCH_NAME $COMMIT_SHA
taito artifact-push:worker:$BRANCH_NAME $COMMIT_SHA

# Deploy changes to server
taito db-deploy:$BRANCH_NAME
taito deployment-deploy:$BRANCH_NAME $COMMIT_SHA

# Test the new deployment
taito deployment-wait:$BRANCH_NAME
taito test:$BRANCH_NAME
taito deployment-verify:$BRANCH_NAME

# Publish artifacts, release notes and version tag
taito artifact-publish:$BRANCH_NAME
taito artifact-release:$BRANCH_NAME
*/
