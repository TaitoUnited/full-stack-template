#!/bin/bash
# shellcheck disable=SC2034
set -a
taito_target_env=${taito_target_env:-local}

##########################################################################
# Root taito-config.sh file
#
# NOTE: This file is updated during 'taito project upgrade'. There should
# rarely be need to modify it manually. Modify taito-project-config.sh,
# taito-env-prod-config.sh, and taito-testing-config.sh instead.
##########################################################################

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
taito_project=full-stack-template
taito_random_name=full-stack-template
taito_company=companyname
taito_family=
taito_application=template
taito_suffix=

# Assets
taito_project_icon=$taito_project-dev.${template_default_domain:?}/favicon.ico

# Environment mappings
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
# You can list all monitoring channels with `taito env info:ENV`
taito_uptime_channels="${template_default_uptime_channels:-}"

# Database definitions for database plugins
# NOTE: database users are defined later in this file
db_database_instance=${template_default_postgres:-}
db_database_type=pg
db_database_name=${taito_project//-/_}_${taito_env}
db_database_host="127.0.0.1"
db_database_port=5001
db_database_real_host="${template_default_postgres_host:-}"
db_database_real_port=5432
db_database_ssl_enabled="${template_default_postgres_ssl_enabled:-true}"
db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled:-true}"
db_database_create=true

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
ci_exec_test_init=false    # run 'init --clean' before each test suite
ci_exec_release=false      # release build
ci_exec_revert=false       # revert deployment automatically on fail
ci_static_assets_location= # location to publish all static files (CDN)

# ------ Plugin and provider specific settings ------

# Template plugin
template_name=FULL-STACK-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Kubernetes plugin
kubernetes_name=${template_default_kubernetes:-}
kubernetes_cluster="${template_default_kubernetes_cluster_prefix:-}${kubernetes_name}"
kubernetes_replicas=1
kubernetes_db_proxy_enabled=true

# ------ OS specific docker settings ------

if [[ ! ${taito_host_uname} ]]; then
  taito_host_uname="$(uname)"
fi

# Default dockerfile
dockerfile=${dockerfile:-Dockerfile}

# Mitigate slow docker volume mounts on Windows with rsync
if [[ "${taito_host_uname}" == *"_NT"* ]]; then
  DC_PATH='/rsync'
  DC_COMMAND='sh -c \"cp -rf /rsync/service/. /service; (while true; do rsync -rtq /rsync/service/. /service; sleep 2; done) &\" '
else
  DC_PATH=
  DC_COMMAND=
fi

# ------ Environment specific settings ------

case $taito_env in
  prod)
    # Settings
    kubernetes_replicas=2

    # Provider and namespaces
    taito_zone=${template_default_zone_prod:?}
    taito_provider=${template_default_provider_prod:?}
    taito_provider_org_id=${template_default_provider_org_id_prod:-}
    taito_provider_region=${template_default_provider_region_prod:-}
    taito_provider_zone=${template_default_provider_zone_prod:-}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod

    # Domain and resources
    taito_host="${template_default_host_prod:-}"
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:-}${kubernetes_name}"
    db_database_real_host="${template_default_postgres_host_prod:-}"
    db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
    db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"

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
    ci_exec_release=true

    # shellcheck disable=SC1091
    if [[ -f taito-env-prod-config.sh ]]; then . taito-env-prod-config.sh; fi
    ;;
  stag)
    # Settings
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
    taito_host="${template_default_host_prod:-}"
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:-}${kubernetes_name}"
    db_database_real_host="${template_default_postgres_host_prod:-}"
    db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
    db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"

    # Monitoring
    taito_uptime_provider= # only for prod by default
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod:-}
    taito_uptime_channels="${template_default_uptime_channels_prod:-}"

    # CI/CD and repositories
    taito_container_registry_provider=${template_default_container_registry_provider_prod:-}
    taito_container_registry=${template_default_container_registry_prod:-}/$taito_vc_repository
    taito_ci_provider=${template_default_ci_provider_prod:?}
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}

    # shellcheck disable=SC1091
    if [[ -f taito-env-stag-config.sh ]]; then . taito-env-stag-config.sh; fi
    ;;
  test)
    # shellcheck disable=SC1091
    if [[ -f taito-env-test-config.sh ]]; then . taito-env-test-config.sh; fi
    ;;
  local)
    taito_app_url=http://localhost:9999
    taito_storage_url=http://localhost:9999/minio
    db_database_external_port=6000
    db_database_host=$taito_project-database
    db_database_port=5432
    db_database_ssl_enabled=false
    db_database_proxy_ssl_enabled=false
    # shellcheck disable=SC1091
    if [[ -f taito-env-local-config.sh ]]; then . taito-env-local-config.sh; fi
    ;;
  *)
    # dev and feature branches
    if [[ $taito_env == "dev" ]] || [[ $taito_env == "f-"* ]]; then
      ci_exec_build=true        # allow build of a new container
      # shellcheck disable=SC1091
      if [[ -f taito-env-dev-config.sh ]]; then . taito-env-dev-config.sh; fi
    fi
    # hotfix branches
    if [[ $taito_env == "h-"* ]]; then
      ci_exec_build=true        # allow build of a new container
      # shellcheck disable=SC1091
      if [[ -f taito-env-hotfix-config.sh ]]; then . taito-env-hotfix-config.sh; fi
    fi
    ;;
esac

# ------ Derived values after environment specific settings ------

# Provider and namespaces
taito_resource_namespace_id=$taito_resource_namespace
taito_uptime_namespace_id=$taito_zone

# URLs
if [[ $taito_env != "local" ]]; then
  taito_app_url=https://$taito_domain
fi

# ------ Database users ------

# app user for application
db_database_app_username="${db_database_name}_app"
db_database_app_secret="${db_database_name//_/-}-db-app.password"

# mgr user for deploying database migrations (CI/CD)
if [[ ${taito_env} != "local" ]]; then
  db_database_mgr_username="$db_database_name"
  db_database_mgr_secret="${db_database_name//_/-}-db-mgr.password"
  :
fi

# default user for executing database operations
# TODO: empty for prod/stag
db_database_default_username="$db_database_name"
db_database_default_secret="${db_database_name//_/-}-db-mgr.password"

# master user for creating and destroying databases
db_database_master_username="${template_default_postgres_master_username:-}"
db_database_master_password_hint="${template_default_postgres_master_password_hint:-}"

# ------ All environments config ------

# shellcheck disable=SC1091
. taito-project-config.sh

# TODO: Temporary hack for https://github.com/gatsbyjs/gatsby/issues/3721
link_urls=${link_urls/:9999\/docs/:7463\/docs/}

# ------ Taito config override (optional) ------

if [[ $TAITO_CONFIG_OVERRIDE ]] && [[ -f $TAITO_CONFIG_OVERRIDE ]]; then
  # shellcheck disable=SC1090
  . "$TAITO_CONFIG_OVERRIDE"
fi

# ------ Provider specific settings ------

# shellcheck disable=SC1091
. taito-provider-config.sh

# ------ Derived values ------

link_urls="
  ${link_urls}
  * storage:ENV=$taito_storage_url Storage bucket (:ENV)
"

# ------ Test suite settings ------

# shellcheck disable=SC1091
. taito-testing-config.sh

set +a
