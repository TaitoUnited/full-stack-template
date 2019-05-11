#!/bin/bash
# shellcheck disable=SC2034
: "${taito_target_env:?}"

# Configuration instructions:
# - https://github.com/TaitoUnited/taito-cli/blob/master/docs/manual/05-configuration.md
# - https://github.com/TaitoUnited/taito-cli/blob/master/docs/plugins.md

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
taito_env=${taito_env/canary/prod} # canary -> prod

# Provider and namespaces
taito_provider=${template_default_provider:?}
taito_provider_org_id=${template_default_provider_org_id:?}
taito_provider_region=${template_default_provider_region:?}
taito_provider_zone=${template_default_provider_zone:?}
taito_zone=${template_default_zone:?}
taito_namespace=$taito_project-$taito_env
taito_resource_namespace=$taito_organization_abbr-$taito_company-dev

# Hosts
taito_host="${template_default_host:-}"
taito_host_dir="/projects/$taito_namespace"

# URLs
taito_domain=$taito_project-$taito_target_env.${template_default_domain:?}
taito_default_domain=$taito_project-$taito_target_env.${template_default_domain:?}
taito_app_url=https://$taito_domain
taito_static_url=

# CI/CD and repositories
taito_ci_provider=${template_default_ci_provider:?}
taito_vc_provider=${template_default_vc_provider:?}
taito_vc_repository=$taito_project
taito_vc_repository_url=${template_default_vc_url:?}/$taito_vc_repository
taito_container_registry_provider=${template_default_container_registry_provider:?}
taito_container_registry=${template_default_container_registry:?}/$taito_vc_repository

# Stack
taito_targets=" admin client cache graphql database function kafka zookeeper server storage worker www "
taito_storages="$taito_random_name-$taito_env"
taito_networks="default"

# Stack types ('container' by default)
taito_target_type_database=database
taito_target_type_function=function

# Database definitions for database plugins
db_database_instance=${template_default_postgres:?}
db_database_type=pg
db_database_name=${taito_project//-/_}_${taito_env}
db_database_host="127.0.0.1"
db_database_port=5001
db_database_real_host="${template_default_postgres_host:?}"
db_database_real_port=5432
db_database_master_username="${template_default_postgres_master_username:?}"
db_database_master_password_hint="${template_default_postgres_master_password_hint:?}"

# Storage definitions for Terraform
taito_storage_classes="${template_default_storage_class:-}"
taito_storage_locations="${template_default_storage_location:-}"
taito_storage_days=${template_default_storage_days:-}

# Storage backup definitions for Terraform
taito_backup_locations="${template_default_backup_location:-}"
taito_backup_days="${template_default_backup_days:-}"

# Messaging
taito_messaging_app=slack
taito_messaging_webhook=
taito_messaging_channel=companyname
taito_messaging_builds_channel=builds
taito_messaging_critical_channel=critical
taito_messaging_monitoring_channel=monitoring

# Misc
taito_default_password=secret1234

# CI/CD settings
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

# Hour reporting and issue management plugins
toggl_project_id=
toggl_tasks="" # For example "task:12345 another-task:67890"
jira_project_id=

# Template plugin
template_name=SERVER-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Kubernetes plugin
kubernetes_name=${template_default_kubernetes:?}
kubernetes_cluster="${template_default_kubernetes_cluster_prefix:?}${kubernetes_name}"
kubernetes_replicas=1
kubernetes_db_proxy_enabled=true

# Helm plugin
# helm_deploy_options="--recreate-pods" # Force restart

# Sentry plugin
sentry_organization=${template_default_sentry_organization:?}

# ------ Overrides for different environments ------

case $taito_env in
  prod)
    taito_zone=${template_default_zone_prod:?}
    taito_provider=${template_default_provider_prod:?}
    taito_provider_org_id=${template_default_provider_org_id_prod:?}
    taito_provider_region=${template_default_provider_region_prod:?}
    taito_provider_zone=${template_default_provider_zone_prod:?}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod
    taito_host="${template_default_host_prod:-}"

    # NOTE: Set production domain here once you have configured DNS
    taito_domain=
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?} # TEMPLATE-REMOVE
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:?}${kubernetes_name}"
    kubernetes_replicas=2
    db_database_real_host="${template_default_postgres_host_prod:?}"

    # Storage definitions for Terraform
    taito_storage_classes="${template_default_storage_class_prod:-}"
    taito_storage_locations="${template_default_storage_location_prod:-}"
    taito_storage_days=${template_default_storage_days_prod:-}

    # Storage backup definitions for Terraform
    taito_backup_locations="${template_default_backup_location_prod:-}"
    taito_backup_days="${template_default_backup_days_prod:-}"

    # Monitoring
    taito_monitoring_targets=" admin client graphql server www "
    taito_monitoring_paths=" /admin/uptimez /uptimez /graphql/uptimez /api/uptimez /docs/uptimez "
    taito_monitoring_timeouts=" 5s 5s 5s 5s 5s "
    # You can list all monitoring channels with `taito env info:prod`
    taito_monitoring_uptime_channels="${template_default_monitoring_uptime_channels_prod:-}"

    # CI/CD and repositories
    taito_ci_provider=${template_default_ci_provider_prod:?}
    taito_container_registry_provider=${template_default_container_registry_provider_prod:?}
    taito_vc_provider=${template_default_vc_provider_prod:?}
    taito_vc_repository_url=${template_default_vc_url_prod:?}/$taito_vc_repository
    taito_container_registry=${template_default_container_registry_prod:?}/$taito_vc_repository
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ;;
  stag)
    taito_zone=${template_default_zone_prod:?}
    taito_provider=${template_default_provider_prod:?}
    taito_provider_org_id=${template_default_provider_org_id_prod:?}
    taito_provider_region=${template_default_provider_region_prod:?}
    taito_provider_zone=${template_default_provider_zone_prod:?}
    taito_resource_namespace=$taito_organization_abbr-$taito_company-prod
    taito_host="${template_default_host_prod:-}"

    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_default_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    kubernetes_cluster="${template_default_kubernetes_cluster_prefix_prod:?}${kubernetes_name}"
    kubernetes_replicas=2
    db_database_real_host="${template_default_postgres_host_prod:?}"

    # CI/CD
    taito_ci_provider=${template_default_ci_provider_prod:?}
    taito_container_registry_provider=${template_default_container_registry_provider_prod:?}
    taito_vc_provider=${template_default_vc_provider_prod:?}
    taito_vc_repository_url=${template_default_vc_url_prod:?}/$taito_vc_repository
    taito_container_registry=${template_default_container_registry_prod:?}/$taito_vc_repository
    ci_exec_deploy=${template_default_ci_exec_deploy_prod:-true}
    ;;
  test)
    ci_test_base_url=https://TODO:TODO@$taito_domain
    ;;
  dev|feat)
    ci_exec_build=true        # allow build of a new container
    ci_exec_deploy=true       # deploy automatically
    # NOTE: enable tests once you have implemented some integration or e2e tests
    ci_exec_test=true         # execute test suites
    ci_exec_test_init=false   # run 'init --clean' before each test suite
    ci_exec_revert=false      # revert deploy if previous steps failed
    ci_test_base_url=https://user:painipaini@$taito_domain
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

# ------ Derived values after overrides ------

# Provider and namespaces
taito_resource_namespace_id=$taito_resource_namespace

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

# ------ Secrets ------

taito_remote_secrets="
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-scheduler.secret:random
"
taito_secrets="
  $db_database_name-db-app.password:random
  $taito_project-$taito_env-storage-gateway.secret:random
  $taito_project-$taito_env-example.secret:manual
"

# Define database mgr password for automatic CI/CD deployments
if [[ $ci_exec_deploy == "true" ]]; then
  taito_remote_secrets="
    $taito_remote_secrets
    $db_database_name-db-mgr.password/devops:random
  "
fi

# ------ Provider specific settings ------

case $taito_provider in
  aws)
    taito_plugins="
      aws:-local
      ${taito_plugins}
      aws-storage:-local
    "

    link_urls="
      ${link_urls}
      * logs:ENV=https://${taito_provider_region}.console.aws.amazon.com/cloudwatch/home?region=${taito_provider_region}#logs: Logs (:ENV)
    "
    ;;
  gcloud)
    taito_plugins="
      gcloud:-local
      gcloud-secrets:-local
      ${taito_plugins}
      gcloud-storage:-local
      gcloud-monitoring:-local
    "

    link_urls="
      ${link_urls}
      * services[:ENV]=https://console.cloud.google.com/apis/dashboard?project=$taito_resource_namespace_id Google services (:ENV)
      * logs:ENV=https://console.cloud.google.com/logs/viewer?project=$taito_zone&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F$kubernetes_name%2Fnamespace_id%2F$taito_namespace Logs (:ENV)
      * uptime=https://app.google.stackdriver.com/uptime?project=$taito_zone&f.search=$taito_project Uptime monitoring (Stackdriver)
    "

    taito_remote_secrets="
      $taito_remote_secrets
      cloudsql-gserviceaccount.key:copy/devops
      $taito_project-$taito_env-gserviceaccount.key:file
    "

    kubernetes_db_proxy_enabled=false # use google cloud sql proxy instead
    gcloud_service_account_enabled=true
    ;;
  ssh)
    taito_plugins="
      ssh:-local
      run:-local
      ${taito_plugins}
    "
    # Use docker-compose instead of Kubernetes and Helm
    taito_plugins="${taito_plugins/docker-compose:local/docker-compose}"
    taito_plugins="${taito_plugins/kubectl:-local/}"
    taito_plugins="${taito_plugins/helm:-local/}"
    ;;
esac

case $taito_ci_provider in
  bitbucket)
    taito_plugins="
      ${taito_plugins}
      bitbucket-ci:-local
    "
    link_urls="
      ${link_urls}
      * builds=https://$taito_vc_repository_url/addon/pipelines/home Build logs
      * artifacts=https://TODO-DOCS-AND-TEST-REPORTS Generated documentation and test reports
    "
    ;;
  gcloud)
    taito_plugins="
      ${taito_plugins}
      gcloud-ci:-local
    "
    link_urls="
      ${link_urls}
      * builds[:ENV]=https://console.cloud.google.com/cloud-build/builds?project=$taito_zone&query=source.repo_source.repo_name%3D%22github_${template_default_vc_organization:?}_$taito_vc_repository%22 Build logs
      * artifacts=https://TODO-DOCS-AND-TEST-REPORTS Generated documentation and test reports
    "
    # Google Cloud build does not support storing build secrets on user account
    # or organization level. Therefore we use Kubernetes devops namespace.
    if [[ $taito_plugins == *"semantic-release:$taito_env"* ]]; then
      taito_remote_secrets="
        $taito_remote_secrets
        github-buildbot.token:read/devops
      "
    fi
    ;;
  local)
    taito_plugins="
      ${taito_plugins}
      local-ci:-local
    "
    ;;
esac

case $taito_vc_provider in
  bitbucket.org)
    link_urls="
      ${link_urls}
      * docs=https://$taito_vc_repository_url/wiki/Home Project documentation
      * project=https://$taito_vc_repository_url/addon/trello/trello-board Project management
    "
    ;;
  github.com)
    link_urls="
      ${link_urls}
      * docs=https://$taito_vc_repository_url/wiki Project documentation
      * project=https://$taito_vc_repository_url/projects Project management
    "
    ;;
esac

case $taito_container_registry_provider in
  docker)
    taito_plugins="
      ${taito_plugins}
      gcloud-registry:-local
    "
    ;;
  ssh)
    taito_container_registry=${taito_host}
    ;;
esac

if [[ $taito_plugins == *"sentry"* ]]; then
  link_urls="
    ${link_urls}
    * errors:ENV=https://sentry.io/${template_default_sentry_organization:?}/$taito_project/?query=is%3Aunresolved+environment%3A$taito_target_env Sentry errors (:ENV)
  "
fi

# ------ Test suite settings ------
# NOTE: Variable is passed to the test without the test_TARGET_ prefix

# Database connection
test_all_DATABASE_HOST=$taito_project-database-test-proxy
test_all_DATABASE_PORT=5432
test_all_DATABASE_NAME=$db_database_name
test_all_DATABASE_USER=${db_database_name}_app
if [[ "$taito_target_env" == "local" ]]; then
  # On local env we connect to database running on an another container
  test_all_DATABASE_HOST=$taito_project-database
fi

# URLs
test_admin_CYPRESS_baseUrl=$ci_test_base_url/admin
test_client_CYPRESS_baseUrl=$ci_test_base_url
test_graphql_TEST_API_URL=$ci_test_base_url/graphql
test_server_TEST_API_URL=$ci_test_base_url/api
if [[ "$taito_target_env" == "local" ]]; then
  CYPRESS_baseUrl=$taito_app_url
  if [[ $taito_target == "admin" ]]; then
    CYPRESS_baseUrl=$taito_app_url/admin
  fi
else
  CYPRESS_baseUrl=$ci_test_base_url
  if [[ $taito_target == "admin" ]]; then
    CYPRESS_baseUrl=$ci_test_base_url/admin
  fi
fi

# Hack to avoid basic auth on Electron browser startup:
# https://github.com/cypress-io/cypress/issues/1639
CYPRESS_baseUrlHack=$CYPRESS_baseUrl
CYPRESS_baseUrl=https://www.google.com
test_admin_CYPRESS_baseUrlHack=$test_admin_CYPRESS_baseUrl
test_admin_CYPRESS_baseUrl=https://www.google.com
test_client_CYPRESS_baseUrlHack=$test_client_CYPRESS_baseUrl
test_client_CYPRESS_baseUrl=https://www.google.com

# Special settings for running tests on gcloud-ci
if [[ $taito_plugins == *"gcloud-ci"* ]] && [[ ${taito_mode:-} == "ci" ]]; then
  test_all_DATABASE_HOST=127.0.0.1
  test_all_DATABASE_PORT=5001
fi
