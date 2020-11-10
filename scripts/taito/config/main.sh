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
# shellcheck disable=SC1091
. scripts/taito/labels.sh

# Assets
taito_project_icon=$taito_project-dev.${template_default_domain}/favicon.ico

# Environment mappings
taito_env=${taito_target_env/canary/prod} # canary -> prod

# Cloud provider
taito_provider=${template_default_provider}
taito_provider_org_id=${template_default_provider_org_id}
taito_provider_billing_account_id=${template_default_provider_billing_account_id}
taito_provider_region=${template_default_provider_region}
taito_provider_zone=${template_default_provider_zone}

# Taito zone
taito_zone=${template_default_zone}
taito_zone_multi_tenant=${template_default_zone_multi_tenant}

# Resource namespace (= tenant namespace)
taito_resource_namespace=$taito_zone
taito_resource_namespace_prefix=$taito_organization_abbr-$taito_company
taito_resource_namespace_prefix_sha1sum=TAITO_RESOURCE_NAMESPACE_PREFIX_SHA1SUM
if [[ $taito_zone_multi_tenant == true ]]; then
  taito_resource_namespace=$taito_resource_namespace_prefix-dev
fi

# Network
taito_network_tags='${template_default_network_tags}'
taito_function_subnet_tags='${template_default_function_subnet_tags}'
taito_function_security_group_tags='${template_default_function_security_group_tags}'
taito_cache_subnet_tags='${template_default_cache_subnet_tags}'
taito_cache_security_group_tags='${template_default_cache_security_group_tags}'

# Policies
taito_cicd_policies='${template_default_cicd_policies}'
taito_gateway_policies='${template_default_gateway_policies}'

# Secrets location
taito_provider_secrets_location=${template_default_provider_secrets_location}
taito_cicd_secrets_path=${template_default_cicd_secrets_path}

# Buckets
taito_state_bucket=${template_default_state_bucket}
taito_functions_bucket=${template_default_functions_bucket}
taito_static_assets_bucket=${template_default_public_bucket}

# URLs
taito_domain=$taito_project-$taito_target_env.${template_default_domain}
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain}
taito_cdn_domain=${template_default_cdn_domain}
taito_app_url=

# Hosts
taito_host="${template_default_host}"
taito_host_dir="/projects/$taito_namespace"

# SSH bastion host
ssh_db_proxy_host="${template_default_bastion_public_ip}"
ssh_db_proxy_username="ubuntu"

# Version control provider
taito_vc_provider=${template_default_vc_provider}
taito_vc_organization=${template_default_vc_organization}
taito_vc_repository=$taito_project
taito_vc_repository_url=${template_default_vc_url}/$taito_vc_repository

# CI/CD provider
taito_ci_provider=${template_default_ci_provider}
taito_ci_organization=${template_default_ci_organization}
taito_ci_image=${template_default_taito_image}
taito_ci_cache_all_targets_with_docker=true

# Container registry provider
taito_container_registry_provider=${template_default_container_registry_provider}
taito_container_registry_provider_url=${template_default_container_registry_provider_url}
taito_container_registry_organization=${template_default_container_registry_organization}
taito_container_registry=${template_default_container_registry}/$taito_project

# Uptime monitoring provider
taito_uptime_provider= # only for prod by default
taito_uptime_provider_url=${template_default_uptime_provider_url}
taito_uptime_provider_org_id=${template_default_uptime_provider_org_id}
# You can list all monitoring channels with `taito env info:ENV`
taito_uptime_channels="${template_default_uptime_channels}"

# Tracking provider
taito_tracking_provider=${template_default_tracking_provider}
taito_tracking_provider_url=${template_default_tracking_provider_url}
taito_tracking_organization=${template_default_tracking_organization}

# Tracing provider
taito_tracking_provider=${template_default_tracking_provider}
taito_tracking_provider_url=${template_default_tracking_provider_url}
taito_tracking_organization=${template_default_tracking_organization}

# Messaging provider
taito_messaging_provider=slack
taito_messaging_webhook=
taito_messaging_channel=companyname
taito_messaging_builds_channel=builds
taito_messaging_critical_channel=critical
taito_messaging_monitoring_channel=monitoring

# Database definitions for database plugins
# NOTE: database users are defined later in this file
db_database_type=${taito_default_db_type:-pg}
if [[ $db_database_type == "pg" ]]; then
  db_database_instance=${template_default_postgres}
  db_database_name=${taito_project//-/_}_${taito_env}
  if [[ $taito_zone_multi_tenant == true ]]; then
    db_database_name=${taito_random_name//-/_}_${taito_env}
  fi
  db_database_username_suffix=${template_default_postgres_username_suffix}
  db_database_host="127.0.0.1"
  db_database_port=5001
  db_database_real_host="${template_default_postgres_host}"
  db_database_real_port="${template_default_postgres_port}"
  db_database_ssl_enabled="${template_default_postgres_ssl_enabled:-true}"
  db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled:-false}"
  db_database_ssl_server_cert_enabled="${template_default_postgres_ssl_server_cert_enabled:-false}"
  db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled:-true}"
  db_database_create=true
elif [[ $db_database_type == "mysql" ]]; then
  db_database_instance=${template_default_mysql}
  db_database_name=${taito_project_short}${taito_env}
  db_database_username_suffix=${template_default_mysql_username_suffix}
  db_database_host="127.0.0.1"
  db_database_port=5001
  db_database_real_host="${template_default_mysql_host}"
  db_database_real_port="${template_default_mysql_port}"
  db_database_ssl_enabled="${template_default_mysql_ssl_enabled:-true}"
  db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled:-false}"
  db_database_ssl_server_cert_enabled="${template_default_mysql_ssl_server_cert_enabled:-false}"
  db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled:-true}"
  db_database_create=true
fi

# Storage defaults
taito_default_storage_class="${template_default_storage_class}"
taito_default_storage_location="${template_default_storage_location}"
taito_default_storage_days="${template_default_storage_days}"
taito_default_storage_backup_location="${template_default_backup_location}"
taito_default_storage_backup_days="${template_default_backup_days}"

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

taito_deployment_platforms=

# Kubernetes plugin
kubernetes_name=${template_default_kubernetes}
kubernetes_regional=${template_default_kubernetes_regional}
kubernetes_replicas=1
kubernetes_db_proxy_enabled=true

# Binary authorization
binauthz_attestor=${template_default_binauthz_attestor}
binauthz_secret_name=${template_default_binauthz_secret_name}
binauthz_public_key_id=${template_default_binauthz_public_key_id}

# ------ OS specific docker settings ------

if [[ ! ${taito_host_uname} ]]; then
  taito_host_uname="$(uname)"
  if [[ $taito_host_uname == *"_NT"* ]]; then
    taito_host_os=windows
  elif [[ $taito_host_uname == "Darwin" ]]; then
    taito_host_os=macos
  else
    taito_host_os=linux
  fi
fi

# Default dockerfile
dockerfile=${dockerfile:-Dockerfile}

# ------ Environment specific settings ------

case $taito_env in
  prod)
    # Provider and namespaces
    taito_zone=${template_default_zone_prod}
    taito_zone_multi_tenant=${template_default_zone_multi_tenant_prod}
    taito_provider=${template_default_provider_prod}
    taito_provider_org_id=${template_default_provider_org_id_prod}
    taito_provider_billing_account_id=${template_default_provider_billing_account_id_prod}
    taito_provider_region=${template_default_provider_region_prod}
    taito_provider_zone=${template_default_provider_zone_prod}

    # Resource namespace (= tenant namespace)
    taito_resource_namespace=$taito_zone
    if [[ $taito_zone_multi_tenant == true ]]; then
      taito_resource_namespace=$taito_resource_namespace_prefix-prod
    fi

    # Network
    taito_network_tags="${template_default_network_tags_prod}"
    taito_function_subnet_tags="${template_default_function_subnet_tags_prod}"
    taito_function_security_group_tags="${template_default_function_security_group_tags_prod}"
    taito_cache_subnet_tags="${template_default_cache_subnet_tags_prod}"
    taito_cache_security_group_tags="${template_default_cache_security_group_tags_prod}"

    # Policies
    taito_cicd_policies='${template_default_cicd_policies_prod}'
    taito_gateway_policies='${template_default_gateway_policies_prod}'

    # Secrets location
    taito_provider_secrets_location=${template_default_provider_secrets_location_prod}
    taito_cicd_secrets_path=${template_default_cicd_secrets_path_prod}

    # Domain
    taito_cdn_domain=${template_default_cdn_domain_prod}
    taito_host="${template_default_host_prod}"

    # Kubernetes
    kubernetes_name=${template_default_kubernetes_prod}
    kubernetes_regional=${template_default_kubernetes_regional_prod}
    kubernetes_replicas=2

    # Binary authorization
    binauthz_attestor=${template_default_binauthz_attestor_prod}
    binauthz_secret_name=${template_default_binauthz_secret_name_prod}
    binauthz_public_key_id=${template_default_binauthz_public_key_id_prod}

    # Databases
    ssh_db_proxy_host="${template_default_bastion_public_ip_prod}"
    if [[ $db_database_type == "pg" ]]; then
      db_database_real_host="${template_default_postgres_host_prod}"
      db_database_real_port="${template_default_postgres_port_prod}"
      db_database_username_suffix=${template_default_postgres_username_suffix_prod}
      db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled_prod:-false}"
      db_database_ssl_server_cert_enabled="${template_default_postgres_ssl_server_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_real_host="${template_default_mysql_host_prod}"
      db_database_real_port="${template_default_postgres_port_prod}"
      db_database_username_suffix=${template_default_mysql_username_suffix_prod}
      db_database_ssl_enabled="${template_default_mysql_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled_prod:-false}"
      db_database_ssl_server_cert_enabled="${template_default_mysql_ssl_server_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled_prod:-true}"
    fi

    # Storages
    taito_state_bucket=${template_default_state_bucket_prod}
    taito_functions_bucket=${template_default_functions_bucket_prod}
    taito_static_assets_bucket=${template_default_public_bucket_prod}

    # Storage defaults
    taito_default_storage_class="${template_default_storage_class_prod}"
    taito_default_storage_location="${template_default_storage_location_prod}"
    taito_default_storage_days="${template_default_storage_days_prod}"
    taito_default_storage_backup_location="${template_default_backup_location_prod}"
    taito_default_storage_backup_days="${template_default_backup_days_prod}"

    # Container registry provider
    taito_container_registry_provider=${template_default_container_registry_provider_prod}
    taito_container_registry_provider_url=${template_default_container_registry_provider_url_prod}
    taito_container_registry_organization=${template_default_container_registry_organization_prod}
    taito_container_registry=${template_default_container_registry_prod}/$taito_project

    # CI/CD provider
    taito_ci_provider=${template_default_ci_provider_prod}
    taito_ci_organization=${template_default_ci_organization_prod}

    # CI/CD settings
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ci_exec_release=true

    # Uptime monitoring provider
    taito_uptime_provider=${template_default_uptime_provider_prod}
    taito_uptime_provider_url=${template_default_uptime_provider_url_prod}
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod}
    taito_uptime_channels="${template_default_uptime_channels_prod}"

    # Tracking provider
    taito_tracking_provider=${template_default_tracking_provider_prod}
    taito_tracking_provider_url=${template_default_tracking_provider_url_prod}
    taito_tracking_organization=${template_default_tracking_organization_prod}

    # Tracing provider
    taito_tracking_provider=${template_default_tracking_provider_prod}
    taito_tracking_provider_url=${template_default_tracking_provider_url_prod}
    taito_tracking_organization=${template_default_tracking_organization_prod}

    # shellcheck disable=SC1091
    if [[ -f scripts/taito/env-prod.sh ]]; then . scripts/taito/env-prod.sh; fi
    ;;
  stag)
    # Provider and namespaces
    taito_zone=${template_default_zone_prod}
    taito_zone_multi_tenant=${template_default_zone_multi_tenant_prod}
    taito_provider=${template_default_provider_prod}
    taito_provider_org_id=${template_default_provider_org_id_prod}
    taito_provider_billing_account_id=${template_default_provider_billing_account_id_prod}
    taito_provider_region=${template_default_provider_region_prod}
    taito_provider_zone=${template_default_provider_zone_prod}

    # Resource namespace (= tenant namespace)
    taito_resource_namespace=$taito_zone
    if [[ $taito_zone_multi_tenant == true ]]; then
      taito_resource_namespace=$taito_resource_namespace_prefix-prod
    fi

    # Network
    taito_network_tags="${template_default_network_tags_prod}"
    taito_function_subnet_tags="${template_default_function_subnet_tags_prod}"
    taito_function_security_group_tags="${template_default_function_security_group_tags_prod}"
    taito_cache_subnet_tags="${template_default_cache_subnet_tags_prod}"
    taito_cache_security_group_tags="${template_default_cache_security_group_tags_prod}"

    # Policies
    taito_cicd_policies='${template_default_cicd_policies_prod}'
    taito_gateway_policies='${template_default_gateway_policies_prod}'

    # Secrets location
    taito_provider_secrets_location=${template_default_provider_secrets_location_prod}
    taito_cicd_secrets_path=${template_default_cicd_secrets_path_prod}

    # Domain
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod}
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod}
    taito_cdn_domain=${template_default_cdn_domain_prod}
    taito_host="${template_default_host_prod}"

    # Kubernetes
    kubernetes_name=${template_default_kubernetes_prod}
    kubernetes_regional=${template_default_kubernetes_regional_prod}
    kubernetes_replicas=2

    # Binary authorization
    binauthz_attestor=${template_default_binauthz_attestor_prod}
    binauthz_secret_name=${template_default_binauthz_secret_name_prod}
    binauthz_public_key_id=${template_default_binauthz_public_key_id_prod}

    # Databases
    ssh_db_proxy_host="${template_default_bastion_public_ip_prod}"
    if [[ $db_database_type == "pg" ]]; then
      db_database_real_host="${template_default_postgres_host_prod}"
      db_database_username_suffix=${template_default_postgres_username_suffix_prod}
      db_database_ssl_enabled="${template_default_postgres_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_postgres_ssl_client_cert_enabled_prod:-false}"
      db_database_ssl_server_cert_enabled="${template_default_postgres_ssl_server_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_postgres_proxy_ssl_enabled_prod:-true}"
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_real_host="${template_default_mysql_host_prod}"
      db_database_username_suffix=${template_default_mysql_username_suffix_prod}
      db_database_ssl_enabled="${template_default_mysql_ssl_enabled_prod:-true}"
      db_database_ssl_client_cert_enabled="${template_default_mysql_ssl_client_cert_enabled_prod:-false}"
      db_database_ssl_server_cert_enabled="${template_default_mysql_ssl_server_cert_enabled_prod:-false}"
      db_database_proxy_ssl_enabled="${template_default_mysql_proxy_ssl_enabled_prod:-true}"
    fi

    # Storages
    taito_state_bucket=${template_default_state_bucket_prod}
    taito_functions_bucket=${template_default_functions_bucket_prod}
    taito_static_assets_bucket=${template_default_public_bucket_prod}

    # Storage defaults
    taito_default_storage_class="${template_default_storage_class_prod}"
    taito_default_storage_location="${template_default_storage_location_prod}"
    taito_default_storage_days="${template_default_storage_days_prod}"
    taito_default_storage_backup_location="${template_default_backup_location_prod}"
    taito_default_storage_backup_days="${template_default_backup_days_prod}"

    # Container registry provider
    taito_container_registry_provider=${template_default_container_registry_provider_prod}
    taito_container_registry_provider_url=${template_default_container_registry_provider_url_prod}
    taito_container_registry_organization=${template_default_container_registry_organization_prod}
    taito_container_registry=${template_default_container_registry_prod}/$taito_project

    # CI/CD provider
    taito_ci_provider=${template_default_ci_provider_prod}
    taito_ci_organization=${template_default_ci_organization_prod}

    # CI/CD settings
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}

    # Uptime monitoring provider
    taito_uptime_provider= # only for prod by default
    taito_uptime_provider_url=${template_default_uptime_provider_url_prod}
    taito_uptime_provider_org_id=${template_default_uptime_provider_org_id_prod}
    taito_uptime_channels="${template_default_uptime_channels_prod}"

    # Tracking provider
    taito_tracking_provider=${template_default_tracking_provider_prod}
    taito_tracking_provider_url=${template_default_tracking_provider_url_prod}
    taito_tracking_organization=${template_default_tracking_organization_prod}

    # Tracing provider
    taito_tracking_provider=${template_default_tracking_provider_prod}
    taito_tracking_provider_url=${template_default_tracking_provider_url_prod}
    taito_tracking_organization=${template_default_tracking_organization_prod}

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
    db_database_ssl_server_cert_enabled=false
    db_database_proxy_ssl_enabled=false
    db_database_username_suffix=
    if [[ $db_database_type == "pg" ]]; then
      db_database_port=5432
      db_database_real_port=5432
    elif [[ $db_database_type == "mysql" ]]; then
      db_database_port=3306
      db_database_real_port=3306
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

# Platforms
if [[ ${kubernetes_name} ]]; then
  taito_deployment_platforms="${taito_deployment_platforms:-kubernetes}"
else
  taito_deployment_platforms="${taito_deployment_platforms:-terraform}"
fi

# Provider and namespaces
taito_resource_namespace_id=$taito_resource_namespace
taito_ci_namespace_id=$taito_resource_namespace
taito_logging_namespace_id=$taito_zone
taito_uptime_namespace_id=$taito_zone
taito_devops_namespace=devops
if [[ ${taito_zone_multi_tenant} == true ]]; then
  taito_devops_namespace="${taito_company}"
fi

# URLs
taito_app_url=${taito_app_url:-https://$taito_domain}
taito_state_path=state/$taito_project-$taito_env
taito_functions_path=functions/$taito_project
taito_static_assets_path=assets/$taito_project
taito_cdn_path=$taito_static_assets_path
if [[ $taito_cdn_domain ]]; then
  taito_cdn_project_path=https://$taito_cdn_domain/$taito_cdn_path
else
  taito_cdn_project_path=-
fi

# ------ Database users ------

db_database_app_user_suffix="_app"
db_database_viewer_user_suffix="_viewer"

# master user for creating and destroying databases
if [[ $db_database_type == "pg" ]]; then
  db_database_master_username="${template_default_postgres_master_username}${db_database_username_suffix}"
  db_database_master_password_hint="${template_default_postgres_master_password_hint}"
elif [[ $db_database_type == "mysql" ]]; then
  db_database_app_user_suffix="a"
  db_database_viewer_user_suffix="v"
  db_database_master_username="${template_default_mysql_master_username}${db_database_username_suffix}"
  db_database_master_password_hint="${template_default_mysql_master_password_hint}"
fi

# app user for application
db_database_app_username="${db_database_name}${db_database_app_user_suffix}${db_database_username_suffix}"
db_database_app_secret="${db_database_name//_/-}-db-app.password"

# viewer user for browsing the database
db_database_viewer_username="${db_database_name}${db_database_viewer_user_suffix}${db_database_username_suffix}"
db_database_viewer_secret="${db_database_name//_/-}-db-viewer.password"

# mgr user for deploying database migrations (CI/CD)
db_database_mgr_username="${db_database_name}${db_database_username_suffix}"
db_database_mgr_secret="${db_database_name//_/-}-db-mgr.password"

# Determine default user for executing database operations
if [[ ${taito_env} == "local" ]]; then
  # App in local environment (there is only app user)
  db_database_default_username="${db_database_app_username}"
  db_database_default_secret="${db_database_app_secret}"
elif [[ ${taito_env} == "prod" ]]; then
  # Viewer in production environment
  db_database_default_username="${db_database_viewer_username}"
  db_database_default_secret="${db_database_viewer_secret}"
else
  # Manager in other environments
  db_database_default_username="${db_database_mgr_username}"
  db_database_default_secret="${db_database_mgr_secret}"
fi

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
