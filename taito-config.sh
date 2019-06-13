#!/bin/bash
# shellcheck disable=SC2034
set -a
: "${taito_target_env:?}"

# Configuration instructions:
# - https://taito.dev/docs/05-configuration
# - https://taito.dev/plugins

# Taito CLI
taito_version=1
taito_plugins="
  terraform:-local
  default-secrets generate-secrets
  docker docker-compose:local kubectl:-local helm:-local
  postgres-db sqitch-db
  npm git-global links-global
  sentry semantic-release:prod
"

# Project labeling
taito_organization=${template_default_organization:?}
taito_organization_abbr=${template_default_organization_abbr:?}
taito_project=server-template
taito_random_name=server-template
taito_company=companyname
taito_family=
taito_application=template
taito_suffix=

# Assets
taito_project_icon=$taito_project-dev.${template_default_domain:?}/favicon.ico

# Environments
taito_environments="${template_default_environments:?}"
taito_env=${taito_target_env/canary/prod} # canary -> prod

# Provider and namespaces
taito_provider=${template_default_provider:?}
taito_provider_org_id=${template_default_provider_org_id:-}
taito_provider_region=${template_default_provider_region:-}
taito_provider_zone=${template_default_provider_zone:-}
taito_zone=${template_default_zone:?}
taito_namespace=$taito_project-$taito_env
taito_resource_namespace=$taito_organization_abbr-$taito_company-dev

# URLs
taito_domain=$taito_project-$taito_target_env.${template_default_domain:?}
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain:?}
taito_app_url=https://$taito_domain
taito_static_url=

# Hosts
taito_host="${template_default_host:-}"
taito_host_dir="/projects/$taito_namespace"

# Version control
taito_vc_provider=${template_default_vc_provider:?}
taito_vc_repository=$taito_project
taito_vc_repository_url=${template_default_vc_url:?}/$taito_vc_repository

# CI/CD
taito_ci_provider=${template_default_ci_provider:?}

# Container registry
taito_container_registry_provider=${template_default_container_registry_provider:-}
taito_container_registry=${template_default_container_registry:-}/$taito_vc_repository

# Messaging
taito_messaging_provider=slack
taito_messaging_webhook=
taito_messaging_channel=companyname
taito_messaging_builds_channel=builds
taito_messaging_critical_channel=critical
taito_messaging_monitoring_channel=monitoring

# Uptime monitoring
taito_uptime_provider= # only for prod by default
taito_uptime_provider_org_id=${template_default_uptime_provider_org_id:-}
taito_uptime_targets=" admin client graphql server www "
taito_uptime_paths=" /admin/uptimez /uptimez /graphql/uptimez /api/uptimez /docs/uptimez "
taito_uptime_timeouts=" 5s 5s 5s 5s 5s "
# You can list all monitoring channels with `taito env info:ENV`
taito_uptime_channels="${template_default_uptime_channels:-}"

# Stack
taito_targets=" admin client cache graphql database function kafka zookeeper server storage worker www "
taito_storages="$taito_random_name-$taito_env"
taito_networks="default"

# Stack types ('container' by default)
taito_target_type_database=database
taito_target_type_function=function

# Database definitions for database plugins
# NOTE: database users are defined later in this file
db_database_instance=${template_default_postgres:-}
db_database_type=pg
db_database_name=${taito_project//-/_}_${taito_env}
db_database_host="127.0.0.1"
db_database_port=5001
db_database_real_host="${template_default_postgres_host:-}"
db_database_real_port=5432

# Storage definitions for Terraform
taito_storage_classes="${template_default_storage_class:-}"
taito_storage_locations="${template_default_storage_location:-}"
taito_storage_days=${template_default_storage_days:-}

# Storage backup definitions for Terraform
taito_backup_locations="${template_default_backup_location:-}"
taito_backup_days="${template_default_backup_days:-}"

# Misc settings
taito_basic_auth_enabled=true
taito_default_password=secret1234

# ------ CI/CD default settings ------

# NOTE: Most of these should be enabled for dev and feat branches only.
# That is, container image is built and tested on dev environment first.
# After that the same container image will be deployed to other environments:
# dev -> test -> stag -> canary -> prod
ci_exec_build=false        # build container image if it does not exist already
ci_exec_deploy=${template_default_ci_exec_deploy:-true}        # deploy automatically
ci_exec_test=false         # execute test suites after deploy
ci_exec_test_wait=60       # how many seconds to wait for deployment/restart
ci_exec_test_init=false    # run 'init --clean' before each test suite
ci_exec_revert=false       # revert deployment automatically on fail
ci_static_assets_location= # location to publish all static files (CDN)
ci_test_base_url="http://NOT-CONFIGURED-FOR-$taito_env"

# ------ Plugin and provider specific settings ------

# Template plugin
template_name=SERVER-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Kubernetes plugin
kubernetes_name=${template_default_kubernetes:-}
kubernetes_cluster="${template_default_kubernetes_cluster_prefix:-}${kubernetes_name}"
kubernetes_replicas=1
kubernetes_db_proxy_enabled=true

# Helm plugin
# helm_deploy_options="--atomic --cleanup-on-fail --force"

# ------ Environment specific settings ------

case $taito_env in
  prod)
    # Settings
    taito_basic_auth_enabled=true
    kubernetes_replicas=2

    # Provider and namespaces
    taito_zone=${template_default_zone_prod:?}
    taito_provider=${template_default_provider_prod:?}
    taito_provider_org_id=${template_default_provider_org_id_prod:-}
    taito_provider_region=${template_default_provider_region_prod:-}
    taito_provider_zone=${template_default_provider_zone_prod:-}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod

    # Domain and resources
    taito_domain=
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?} # TEMPLATE-REMOVE
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    taito_host="${template_default_host_prod:-}"
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:-}${kubernetes_name}"
    db_database_real_host="${template_default_postgres_host_prod:-}"

    # Storage
    taito_storage_classes="${template_default_storage_class_prod:-}"
    taito_storage_locations="${template_default_storage_location_prod:-}"
    taito_storage_days=${template_default_storage_days_prod:-}
    taito_backup_locations="${template_default_backup_location_prod:-}"
    taito_backup_days="${template_default_backup_days_prod:-}"

    # Monitoring
    taito_uptime_provider=${template_default_uptime_provider_prod:-}
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod:-}
    taito_uptime_channels="${template_default_uptime_channels_prod:-}"

    # CI/CD and repositories
    taito_container_registry_provider=${template_default_container_registry_provider_prod:-}
    taito_container_registry=${template_default_container_registry_prod:-}/$taito_vc_repository
    taito_ci_provider=${template_default_ci_provider_prod:?}
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ;;
  stag)
    # Settings
    taito_basic_auth_enabled=true
    kubernetes_replicas=2

    # Provider and namespaces
    taito_zone=${template_default_zone_prod:?}
    taito_provider=${template_default_provider_prod:?}
    taito_provider_org_id=${template_default_provider_org_id_prod:-}
    taito_provider_region=${template_default_provider_region_prod:-}
    taito_provider_zone=${template_default_provider_zone_prod:-}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod

    # Domain and resources
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    taito_host="${template_default_host_prod:-}"
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:-}${kubernetes_name}"
    db_database_real_host="${template_default_postgres_host_prod:-}"

    # Monitoring
    taito_uptime_provider= # only for prod by default
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod:-}
    taito_uptime_channels="${template_default_uptime_channels_prod:-}"

    # CI/CD and repositories
    taito_container_registry_provider=${template_default_container_registry_provider_prod:-}
    taito_container_registry=${template_default_container_registry_prod:-}/$taito_vc_repository
    taito_ci_provider=${template_default_ci_provider_prod:?}
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ;;
  test)
    ci_test_base_url=https://TODO:TODO@$taito_domain
    ;;
  dev|feat)
    ci_exec_build=true        # allow build of a new container
    ci_exec_deploy=true       # deploy automatically
    ci_exec_test=true         # execute test suites
    ci_exec_test_init=false   # run 'init --clean' before each test suite
    ci_exec_revert=false      # revert deploy if previous steps failed
    ci_test_base_url=https://username:secretpassword@$taito_domain
    ;;
  local)
    ci_exec_test_init=false   # run 'init --clean' before each test suite
    ci_test_base_url=http://server-template-ingress:80
    taito_app_url=http://localhost:9999
    db_database_external_port=6000
    db_database_host=$taito_project-database
    db_database_port=5432

    # TODO why password is not required for pg? mysql plugin requires it.
    # perhaps pg plugin uses 'secret' as password by default?
    # db_database_username=root
    # db_database_password=secret
    ;;
esac

# ------ Derived values after environment specific settings ------

# Provider and namespaces
taito_resource_namespace_id=$taito_resource_namespace
taito_uptime_namespace_id=$taito_zone

# URLs
taito_admin_url=$taito_app_url/admin/
taito_storage_url="https://console.cloud.google.com/storage/browser/$taito_random_name-$taito_env?project=$taito_resource_namespace_id"
if [[ "$taito_env" == "local" ]]; then
  taito_storage_url=http://localhost:9999/minio
fi

# Link plugin
link_urls="
  * client[:ENV]=$taito_app_url Application GUI (:ENV)
  * admin[:ENV]=$taito_admin_url Admin GUI (:ENV)
  * server[:ENV]=$taito_app_url/api/uptimez Server API (:ENV)
  * apidocs[:ENV]=$taito_app_url/api/docs API Docs (:ENV)
  * www[:ENV]=$taito_app_url/docs Generated documentation (:ENV)
  * graphql[:ENV]=$taito_app_url/graphql/uptimez GraphQL API (:ENV)
  * git=https://$taito_vc_repository_url Git repository
  * storage:ENV=$taito_storage_url Storage bucket (:ENV)
  * styleguide=https://TODO UI/UX style guide and designs
  * wireframes=https://TODO UI/UX wireframes
  * feedback=https://TODO User feedback
  * performance=https://TODO Performance metrics
"

# TODO: Temporary hack for https://github.com/gatsbyjs/gatsby/issues/3721
link_urls=${link_urls/:9999\/docs/:7463\/docs/}

# ------ Database users ------

# app user for application
db_database_app_username="${db_database_name}_app"
db_database_app_secret="${db_database_name//_/-}-db-app.password"

# mgr user for deploying database migrations
db_database_mgr_username="$db_database_name"
db_database_mgr_secret="${db_database_name//_/-}-db-mgr.password"

# master user for creating and destroying databases
db_database_master_username="${template_default_postgres_master_username:-}"
db_database_master_password_hint="${template_default_postgres_master_password_hint:-}"

# ------ Secrets ------

taito_remote_secrets="
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-scheduler.secret:random
"
taito_secrets="
  $db_database_app_secret:random
  $taito_project-$taito_env-storage-gateway.secret:random
  $taito_project-$taito_env-example.secret:manual
"

# Define database mgr password for automatic CI/CD deployments
if [[ $ci_exec_deploy == "true" ]]; then
  taito_remote_secrets="
    $taito_remote_secrets
    $db_database_mgr_secret/devops:random
  "
fi

# ------ Taito config override (optional) ------

if [[ $TAITO_CONFIG_OVERRIDE ]] && [[ -f $TAITO_CONFIG_OVERRIDE ]]; then
  # shellcheck disable=SC1090
  . "$TAITO_CONFIG_OVERRIDE"
fi

# ------ Provider specific settings ------

# shellcheck disable=SC1091
. taito-provider-config.sh

# ------ Test suite settings ------

# shellcheck disable=SC1091
. taito-test-config.sh

set +a
