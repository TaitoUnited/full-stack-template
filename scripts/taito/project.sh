#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Project specific settings
##########################################################################

# Taito CLI: Project specific plugins (for the selected database, etc.)
taito_plugins="
  ${taito_plugins}
  postgres-db sqitch-db
"

# Environments: In the correct order (e.g. dev test uat stag canary prod)
taito_environments="${template_default_environments}"

# Basic auth: Uncomment the line below to disable basic auth from ALL
# environments. Use env-prod.sh to disable basic auth from prod
# environment only.
# taito_basic_auth_enabled=false

# ------ Stack ------
# Configuration instructions:
# TODO

if [[ ${taito_deployment_platforms} == *"docker"* ]] ||
   [[ ${taito_deployment_platforms} == *"kubernetes"* ]]; then
  taito_containers=" admin client redis server storage worker www pgweb "
  if [[ ${taito_env} == "local" ]]; then
    taito_containers="${taito_containers} database "
  fi
else
  taito_functions=" server worker "
fi
taito_static_contents=" admin client www "
taito_databases=" database "
taito_networks="default"

# Buckets
taito_buckets=" bucket "
st_bucket_name="$taito_random_name-$taito_env"

# Additional databases
# EXAMPLE:
# db_bidb_name=${taito_project//-/_}_bidb_${taito_env}
# db_bidb_port=5001
# if [[ ${taito_env} == "local" ]] || [[ ${taito_vpn_enabled} == "true" ]]; then
#   db_bidb_port=6000
# fi
# db_bidb_mgr_username="${db_bidb_name}${db_database_username_suffix}"
# db_bidb_mgr_secret="${db_bidb_name//_/-}-db-mgr.password"
# db_bidb_app_username="${db_bidb_name}${db_database_app_user_suffix}${db_database_username_suffix}"
# db_bidb_app_secret="${db_bidb_name//_/-}-db-app.password"
# db_bidb_viewer_username="${db_bidb_name}${db_database_viewer_user_suffix}${db_database_username_suffix}"
# db_bidb_viewer_secret="${db_bidb_name//_/-}-db-viewer.password"
# db_bidb_default_username="${db_bidb_mgr_username}"
# db_bidb_default_secret="${db_bidb_mgr_secret}"


# ------ Secrets ------
# Configuration instructions:
# https://taitounited.github.io/taito-cli/tutorial/06-env-variables-and-secrets/

# Secrets for all environments
taito_secrets="
  $db_database_app_secret:random
  $taito_project-$taito_env-redis.password:random
  $taito_project-$taito_env-session.secret:random
  $taito_project-$taito_env-example.secret:manual
"

# Secrets for local environment only
taito_local_secrets="
"

# Secrets for non-local environments
taito_remote_secrets="
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-scheduler.secret:random
  $taito_project-$taito_env-server-serviceaccount.key:file
  $taito_project-$taito_env-storage.accessKeyId:manual
  $taito_project-$taito_env-storage.secretKey:manual
  $db_database_viewer_secret:random
  ${db_database_mgr_secret}${taito_cicd_secrets_path}:random
  cicd-proxy-serviceaccount.key:read/common
"

# Secrets required by CI/CD
taito_cicd_secrets="
  cicd-proxy-serviceaccount.key
  $db_database_mgr_secret
  $db_database_ssl_ca_secret
  $db_database_ssl_cert_secret
  $db_database_ssl_key_secret
"

# Secrets required by CI/CD tests
taito_testing_secrets="
  $taito_project-$taito_env-basic-auth.auth
"

# Secret hints and descriptions
taito_secret_hints="
  * basic-auth=Basic authentication is used to hide non-production environments from public
  * serviceaccount=Service account is typically used to access Cloud resources
  * example=Just an example secret. You can type anything as a value.
"

# ------ Links ------
# Add custom links here. You can regenerate README.md links with
# 'taito project generate'. Configuration instructions: TODO

link_urls="
  * admin[:ENV]=$taito_app_url/admin/ Administration GUI (:ENV)
  * client[:ENV]=$taito_app_url Web application GUI (:ENV)
  * server[:ENV]=$taito_app_url/api/uptimez Server API status (:ENV)
  * apidocs[:ENV]=$taito_app_url/api/docs REST API docs (:ENV)
  * graphql[:ENV]=$taito_app_url/api GraphQL Playground (:ENV)
  * www[:ENV]=$taito_app_url/docs Website (:ENV)
  * git=https://$taito_vc_repository_url Git repository
  * uikit=http://localhost:6006 UI kit in Storybook
"

# TODO: Temporary hack for https://github.com/gatsbyjs/gatsby/issues/3721
link_urls=${link_urls/:9999\/docs/:7463/}
