#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Project specific labels
#
# Names of namespaces and resources are determined by these labels.
##########################################################################

taito_project=full-stack-template
taito_project_short=fstemplate # Max 10 characters
taito_random_name=full-stack-template
taito_company=companyname
taito_family=
taito_application=template
taito_suffix=

# Namespace
taito_namespace=full-stack-template-$taito_env

# Database defaults
taito_default_db_type=pg

# Template
template_version=1.0.0
template_name=FULL-STACK-TEMPLATE
template_source_git=git@github.com:TaitoUnited
