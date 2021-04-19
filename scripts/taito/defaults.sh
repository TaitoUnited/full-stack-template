#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Project specific default values used for various purposes
##########################################################################

# Labels
taito_project=full-stack-template
taito_project_short=fstemplate # Max 10 characters
taito_project_nonspecial=${taito_project//-/}
taito_random_name=full-stack-template
taito_company=companyname
taito_family=
taito_application=template
taito_suffix=
taito_namespace=full-stack-template-$taito_env

# Template reference
template_version=1.0.0
template_name=FULL-STACK-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Database defaults
# Override database defaults here, if you want to use some other than the
# zone default database cluster.
taito_default_db_type=pg
taito_default_db_shared=false # If true, taito_random_name is used as pg db name
