#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# PR environment settings
# 
# NOTE: Pull-request environments use the same secrets and cloud resources
# as the dev environment. However, PRs do have thir own database.
##########################################################################

# Database name override for PR specific database
db_database_name_override=${taito_project//-/_}_${taito_deployment_suffix//-/_}
