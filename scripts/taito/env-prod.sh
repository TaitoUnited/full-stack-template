#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Production environment settings
##########################################################################

# Disable basic auth by setting this to false
taito_basic_auth_enabled=true

# Domain name (e.g. www.mydomain.com)
taito_domain=
taito_domain=$taito_project-$taito_target_env.$default_domain_prod # TEMPLATE-REMOVE

# OPTIONAL: Alternate domain name (e.g. mydomain.com) that redirects to main domain
taito_altdomain=

# Default domain name (copy this value to taito_domain if custom domain is not required)
taito_default_domain=$taito_project-$taito_target_env.$default_domain_prod

# Canary environment domain name
if [[ $taito_target_env == "canary" ]]; then
  taito_domain=$taito_project-$taito_target_env.$default_domain_prod
  taito_default_domain=$taito_project-$taito_target_env.$default_domain_prod
fi

# Temporarily allow building hotfix to prod by setting this to true
ci_exec_build=false
