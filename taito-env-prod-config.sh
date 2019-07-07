#!/bin/bash
# shellcheck disable=SC2034

##########################################################################
# Production environment settings
##########################################################################

# Production domain name (e.g. mydomain.com)
taito_domain=
taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?} # TEMPLATE-REMOVE

# Production alternate domain (e.g. www.mydomain.com) that redirects to main domain
taito_altdomain=

# Default domain name (copy value to taito_domain if custom name is not required)
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}

# Disable production environment basic auth by setting this to false
taito_basic_auth_enabled=true

# Overrides for canary environment
if [[ $taito_target_env == "canary" ]]; then
  taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
  taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
fi
