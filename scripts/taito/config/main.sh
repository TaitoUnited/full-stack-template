#!/usr/bin/env bash
# shellcheck disable=SC2034
set -a
taito_target_env=${taito_target_env:-local}

##########################################################################
# Root config file
#
# NOTE: This file is updated during 'taito project upgrade' and it should
# not be modified manually. You can override these settings in project.sh
# and env-*.sh.
##########################################################################

# Taito CLI
taito_version=1
taito_plugins="
  terraform:-local
  default-secrets generate-secrets
  docker
  npm git-global links-global
  semantic-release:prod
"

# Project labeling
taito_organization=${template_default_organization}
taito_organization_abbr=${template_default_organization_abbr}
sentry_organization=${template_default_sentry_organization}
# shellcheck disable=SC1091
. scripts/taito/labels.sh

# Assets
taito_project_icon=$taito_project-dev.${template_default_domain}/favicon.ico

# Environment mappings
taito_env=${taito_target_env/canary/prod} # canary -> prod

# Provider and namespaces
taito_provider=${template_default_provider}
taito_provider_org_id=${template_default_provider_org_id}
taito_provider_billing_account_id=${template_default_provider_billing_account_id}
taito_provider_region=${template_default_provider_region}
taito_provider_zone=${template_default_provider_zone}
taito_zone=${template_default_zone}
taito_namespace=$taito_project-$taito_env
taito_resource_namespace=$taito_organization_abbr-$taito_company-dev

# Platforms
taito_deployment_platforms="terraform kubernetes"

# URLs
taito_domain=$taito_project-$taito_target_env.${template_default_domain}
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain}
taito_app_url=https://$taito_domain
taito_static_assets_bucket=$taito_zone-assets
taito_static_assets_path=/$taito_project
taito_functions_bucket=$taito_zone-projects
taito_functions_path=/$taito_project
taito_state_bucket=$taito_zone-projects
taito_state_path=/state/$taito_project-$taito_env

# Hosts
taito_host="${template_default_host}"
taito_host_dir="/projects/$taito_namespace"

# Version control
taito_vc_provider=${template_default_vc_provider}
taito_vc_organization=${template_default_vc_organization}
taito_vc_repository=$taito_project
taito_vc_repository_url=${template_default_vc_url}/$taito_vc_repository

# CI/CD
taito_ci_provider=${template_default_ci_provider}
taito_ci_organization=${template_default_ci_organization}
taito_ci_image=${template_default_taito_image}

# Container registry
taito_container_registry_provider=${template_default_container_registry_provider}
taito_container_registry=${template_default_container_registry}/$taito_project

# Messaging
taito_messaging_provider=slack
taito_messaging_webhook=
taito_messaging_channel=companyname
taito_messaging_builds_channel=builds
taito_messaging_critical_channel=critical
taito_messaging_monitoring_channel=monitoring

# Uptime monitoring
taito_uptime_provider= # only for prod by default
taito_uptime_provider_org_id=${template_default_uptime_provider_org_id}
# You can list all monitoring channels with `taito env info:ENV`
taito_uptime_channels="${template_default_uptime_channels}"

# Database definitions for database plugins
# NOTE: database users are defined later in this file
db_database_type=${taito_default_db_type:-pg}
if [[ $db_database_type == "pg" ]]; then
  db_database_instance=${template_default_postgres}
  db_database_name=${taito_project//-/_}_${taito_env}
  db_database_username_suffix=${template_default_postgres_username_suffix}
  db_database_host="127.0.0.1"
  db_database_port=5001
  db_database_real_host="${template_default_postgres_host}"
  db_database_real_port=5432
  db_database_ssl_enabled="${template_default_postgres_ssl_enabled:-true}"
  db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled:-false}"
  db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled:-true}"
  db_database_create=true
elif [[ $db_database_type == "mysql" ]]; then
  db_database_instance=${template_default_mysql}
  db_database_name=${taito_project_short}${taito_env}
  db_database_username_suffix=${template_default_mysql_username_suffix}
  db_database_host="127.0.0.1"
  db_database_port=5001
  db_database_real_host="${template_default_mysql_host}"
  db_database_real_port=3306
  db_database_ssl_enabled="${template_default_mysql_ssl_enabled:-true}"
  db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled:-false}"
  db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled:-true}"
  db_database_create=true
fi

# Storage definitions for Terraform
st_storage_name="$taito_random_name-$taito_env"
st_storage_class="${template_default_storage_class}"
st_storage_location="${template_default_storage_location}"
st_storage_days=${template_default_storage_days}
st_storage_backup_location="${template_default_backup_location}"
st_storage_backup_days="${template_default_backup_days}"

# Misc settings
taito_basic_auth_enabled=true
taito_default_password=secret1234

# ------ CI/CD default settings ------

# NOTE: Most of these should be enabled for dev and feat branches only.
# That is, container image is built and tested on dev environment first.
# After that the same container image will be deployed to other environments:
# dev -> test -> uat -> stag -> canary -> prod
ci_exec_build=false        # build container image if it does not exist already
ci_exec_deploy=${template_default_ci_exec_deploy:-true}        # deploy automatically
ci_exec_test=false         # execute test suites after deploy
ci_exec_test_init=false    # run 'init --clean' before each test suite
ci_exec_release=false      # release build
ci_exec_revert=false       # revert deployment automatically on fail

# ------ Plugin and provider specific settings ------

# Template plugin
template_version=1.0.0
template_name=FULL-STACK-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Kubernetes plugin
kubernetes_name=${template_default_kubernetes}
kubernetes_replicas=1
kubernetes_db_proxy_enabled=true

# ------ OS specific docker settings ------

if [[ ! ${taito_host_uname} ]]; then
  taito_host_uname="$(uname)"
fi

# Default dockerfile
dockerfile=${dockerfile:-Dockerfile}

# Mitigate slow docker volume mounts on Windows with rsync
if [[ "${taito_host_os:-}" == "windows" ]] && [[ ! ${DOCKER_HOST} ]]; then
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
    taito_zone=${template_default_zone_prod}
    taito_provider=${template_default_provider_prod}
    taito_provider_org_id=${template_default_provider_org_id_prod}
    taito_provider_billing_account_id=${template_default_provider_billing_account_id_prod}
    taito_provider_region=${template_default_provider_region_prod}
    taito_provider_zone=${template_default_provider_zone_prod}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod

    # Domain and resources
    taito_host="${template_default_host_prod}"
    if [[ $db_database_type == "pg" ]]; then
      db_database_real_host="${template_default_postgres_host_prod}"
      db_database_username_suffix=${template_default_postgres_username_suffix_prod}
      db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_real_host="${template_default_mysql_host_prod}"
      db_database_username_suffix=${template_default_mysql_username_suffix_prod}
      db_database_ssl_enabled="${template_default_mysql_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled_prod:-true}"
    fi

    # Storage
    taito_storage_classes="${template_default_storage_class_prod}"
    taito_storage_locations="${template_default_storage_location_prod}"
    taito_storage_days=${template_default_storage_days_prod}
    taito_storage_backup_location="${template_default_backup_location_prod}"
    taito_storage_backup_days="${template_default_backup_days_prod}"

    # Monitoring
    taito_uptime_provider=${template_default_uptime_provider_prod}
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod}
    taito_uptime_channels="${template_default_uptime_channels_prod}"

    # CI/CD and repositories
    taito_container_registry_provider=${template_default_container_registry_provider_prod}
    taito_container_registry=${template_default_container_registry_prod}/$taito_project
    taito_ci_provider=${template_default_ci_provider_prod}
    taito_ci_organization=${template_default_ci_organization_prod}
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ci_exec_release=true

    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-prod.sh ]]; then . scripts/taito/env-prod.sh; fi
    ;;
  stag)
    # Settings
    kubernetes_replicas=2

    # Provider and namespaces
    taito_zone=${template_default_zone_prod}
    taito_provider=${template_default_provider_prod}
    taito_provider_org_id=${template_default_provider_org_id_prod}
    taito_provider_billing_account_id=${template_default_provider_billing_account_id_prod}
    taito_provider_region=${template_default_provider_region_prod}
    taito_provider_zone=${template_default_provider_zone_prod}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod

    # Domain and resources
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod}
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod}
    taito_host="${template_default_host_prod}"
    if [[ $db_database_type == "pg" ]]; then
      db_database_real_host="${template_default_postgres_host_prod}"
      db_database_username_suffix=${template_default_postgres_username_suffix_prod}
      db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_real_host="${template_default_mysql_host_prod}"
      db_database_username_suffix=${template_default_mysql_username_suffix_prod}
      db_database_ssl_enabled="${template_default_mysql_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled_prod:-true}"
    fi

    # Monitoring
    taito_uptime_provider= # only for prod by default
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod}
    taito_uptime_channels="${template_default_uptime_channels_prod}"

    # CI/CD and repositories
    taito_container_registry_provider=${template_default_container_registry_provider_prod}
    taito_container_registry=${template_default_container_registry_prod}/$taito_project
    taito_ci_provider=${template_default_ci_provider_prod}
    taito_ci_organization=${template_default_ci_organization_prod}
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}

    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-stag.sh ]]; then . scripts/taito/env-stag.sh; fi
    ;;
  uat)
    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-uat.sh ]]; then . scripts/taito/env-uat.sh; fi
    ;;
  test)
    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-test.sh ]]; then . scripts/taito/env-test.sh; fi
    ;;
  local)
    taito_deployment_platforms=docker-compose
    db_database_host=$taito_project-database
    db_database_ssl_enabled=false
    db_database_ssl_client_cert_enabled=false
    db_database_proxy_ssl_enabled=false
    db_database_username_suffix=
    if [[ $db_database_type == "pg" ]]; then
      db_database_port=5432
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_port=3306
    fi

    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-local.sh ]]; then . scripts/taito/env-local.sh; fi
    ;;
  *)
    # dev and feature branches
    if [[ $taito_env == "dev" ]] || [[ $taito_env == "f-"* ]]; then
      ci_exec_build=true        # allow build of a new container
      # shellcheck disable=SC1091
      if [[ -f scripts/taito/env-dev.sh ]]; then . scripts/taito/env-dev.sh; fi
    fi
    # hotfix branches
    if [[ $taito_env == "h-"* ]]; then
      ci_exec_build=true        # allow build of a new container
      # shellcheck disable=SC1091
      if [[ -f scripts/taito/env-hotfix.sh ]]; then . scripts/taito/env-hotfix.sh; fi
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

db_database_app_user_suffix="_app"

# master user for creating and destroying databases
if [[ $db_database_type == "pg" ]]; then
  db_database_master_username="${template_default_postgres_master_username}${db_database_username_suffix}"
  db_database_master_password_hint="${template_default_postgres_master_password_hint}"
elif [[ $db_database_type == "mysql" ]]; then
  db_database_app_user_suffix="a"
  db_database_master_username="${template_default_mysql_master_username}${db_database_username_suffix}"
  db_database_master_password_hint="${template_default_mysql_master_password_hint}"
fi

# app user for application
db_database_app_username="${db_database_name}${db_database_app_user_suffix}${db_database_username_suffix}"
db_database_app_secret="${db_database_name//_/-}-db-app.password"

# mgr user for deploying database migrations (CI/CD)
if [[ ${taito_env} != "local" ]]; then
  db_database_mgr_username="${db_database_name}${db_database_username_suffix}"
  db_database_mgr_secret="${db_database_name//_/-}-db-mgr.password"
  :
fi

# default user for executing database operations
# TODO: empty for prod/stag
db_database_default_username="${db_database_name}${db_database_username_suffix}"
db_database_default_secret="${db_database_name//_/-}-db-mgr.password"

# ------ All environments config ------

# shellcheck disable=SC1091
. scripts/taito/project.sh

# ------ Taito config override (optional) ------

if [[ $TAITO_CONFIG_OVERRIDE ]] && [[ -f $TAITO_CONFIG_OVERRIDE ]]; then
  # shellcheck disable=SC1090
  . "$TAITO_CONFIG_OVERRIDE"
fi

# ------ Provider specific settings ------

# shellcheck disable=SC1091
. scripts/taito/config/provider.sh

# ------ Test suite settings ------

# shellcheck disable=SC1091
. scripts/taito/testing.sh

# ------ Custom terraform mappings ------

# shellcheck disable=SC1091
if [[ -f terraform.sh ]]; then . terraform.sh; fi

set +a
