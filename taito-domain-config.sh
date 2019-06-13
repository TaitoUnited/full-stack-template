#!/bin/bash
# shellcheck disable=SC2034

##########################################################################
# Domain settings for production environment
##########################################################################

taito_domain=
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}

taito_basic_auth_enabled=true
