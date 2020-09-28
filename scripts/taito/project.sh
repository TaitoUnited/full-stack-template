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
  taito_containers=" admin client graphql kafka redis server storage worker www zookeeper "
  if [[ ${taito_env} == "local" ]]; then
    taito_containers="${taito_containers} database "
  fi
else
  taito_functions=" graphql server worker "
fi
taito_static_contents=" admin client www "
taito_databases=" database "
taito_networks="default"

# Buckets
taito_buckets=" bucket "
st_bucket_name="$taito_random_name-$taito_env"

# ------ Secrets ------
# Configuration instructions:
# https://taitounited.github.io/taito-cli/tutorial/06-env-variables-and-secrets/

taito_local_secrets="
"

taito_remote_secrets="
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-scheduler.secret:random
  $taito_project-$taito_env-graphql-serviceaccount.key:file
  $taito_project-$taito_env-server-serviceaccount.key:file
  $taito_project-$taito_env-storage-serviceaccount.key:file
  $db_database_viewer_secret:random
  ${db_database_mgr_secret}${taito_cicd_secrets_path}:random
  cicd-tester-serviceaccount.key:read/$taito_devops_namespace
"

taito_secrets="
  $db_database_app_secret:random
  $taito_project-$taito_env-example.secret:manual
  $taito_project-$taito_env-redis.password:random
  $taito_project-$taito_env-storage.accessKeyId:random
  $taito_project-$taito_env-storage.secretKey:random
"

# ------ Links ------
# Add custom links here. You can regenerate README.md links with
# 'taito project docs'. Configuration instructions: TODO

link_urls="
  * client[:ENV]=$taito_app_url Web application GUI (:ENV)
  * admin[:ENV]=$taito_app_url/admin/ Administration GUI (:ENV)
  * server[:ENV]=$taito_app_url/api/uptimez Server API (:ENV)
  * apidocs[:ENV]=$taito_app_url/api/docs API docs (:ENV)
  * www[:ENV]=$taito_app_url/docs Website (:ENV)
  * graphql[:ENV]=$taito_app_url/graphql/uptimez GraphQL API (:ENV)
  * git=https://$taito_vc_repository_url Git repository
"

# TODO: Temporary hack for https://github.com/gatsbyjs/gatsby/issues/3721
link_urls=${link_urls/:9999\/docs/:7463/}
