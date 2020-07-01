#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Local environment settings
##########################################################################

# Use localhost:9999 instead of the default domain
taito_app_url=http://localhost:9999

# Connect to database port exposed in docker-compose.yaml
db_database_external_port=6000
