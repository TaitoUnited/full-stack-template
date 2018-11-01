#!/bin/bash
# shellcheck disable=SC2034
: "${taito_env:?}"
: "${taito_target_env:?}"

# Taito-cli
taito_version=1
taito_plugins="
  postgres-db sqitch-db
  docker
  docker-compose:local
  terraform:-local
  generate-secrets:-local kube-secrets:-local
  kubectl:-local helm:-local
  gcloud:-local gcloud-storage:-local gcloud-builder:-local
  semantic-release npm git links-global
  sentry
"

# Project
taito_organization=${template_default_organization:?}
taito_project=server-template
taito_company=companyname
taito_family=
taito_application=template
taito_suffix=

# Repositories
# TODO variable naming, repo url, taito_registry and taito_repository separately?
taito_repo_location=github-$taito_organization
taito_repo_name=$taito_project
taito_registry=${template_default_registry:?}/$taito_zone/$taito_repo_location-$taito_repo_name

# Assets
taito_project_icon=

# Environments
taito_environments="dev test prod"
taito_env=${taito_env/canary/prod}    # canary -> prod

# URLs
taito_domain=$taito_project-$taito_target_env.${template_default_domain:?}
taito_app_url=https://$taito_domain

# Provider and namespaces
taito_provider=${template_default_provider:?} # aws, azure, gcloud, ...
taito_provider_region=${template_default_provider_region:?}
taito_provider_zone=${template_default_provider_zone:?}
taito_zone=${template_default_zone:?} # kube/postgres cluster project
taito_namespace=$taito_project-$taito_env # kubernetes namespace
taito_resource_namespace=$taito_company-dev # additional resources project

# Stack
taito_targets=" admin client cache database server storage "
taito_databases=database
taito_storages=$taito_project-$taito_env
taito_networks=default

# Database definitions for database plugins
db_database_instance=${template_default_postgres:?}
db_database_type=pg
db_database_name=${taito_project//-/_}_${taito_env}
db_database_host=localhost
db_database_proxy_port=5001
db_database_port=$db_database_proxy_port

# Messaging
taito_messaging_app=slack
taito_messaging_channel=companyname
taito_messaging_builds_channel=builds
taito_messaging_monitoring_channel=monitoring
taito_messaging_webhook=

# Hour reporting and issue management
toggl_project_id=
toggl_tasks="" # For example "task:12345 another-task:67890"
jira_project_id=

# Template plugin
template_name=SERVER-TEMPLATE
template_source_git=git@github.com:TaitoUnited

# Google Cloud plugin
gcloud_org_id=${template_default_provider_org_id:?}
gcloud_sql_proxy_port=$db_database_proxy_port
gcloud_cdn_enabled=false

# Docker plugin
dockerfile=Dockerfile

# Kubernetes plugin
kubectl_name=${template_default_kubernetes:?}
kubectl_replicas=1

# Helm plugin
# helm_deploy_options="--recreate-pods" # Force restart

# Sentry plugin
sentry_organization=$taito_organization

# CI/CD settings
# NOTE: Most of these should be enabled for dev and feat environments only
ci_exec_build=false         # build a container if does not exist already
ci_exec_deploy=true         # deploy automatically
ci_exec_test=false          # execute test suites after deploy
ci_exec_test_wait=60        # how many seconds to wait for deployment/restart
ci_exec_test_init=false     # run 'init --clean' before each test suite
ci_exec_revert=false        # revert deploy automatically on fail

# ------ Settings for different environments ------

case $taito_env in
  prod)
    taito_zone=${template_default_zone_prod:?}
    taito_provider_region=${template_default_provider_region_prod:?}
    taito_provider_zone=${template_default_provider_zone_prod:?}
    taito_resource_namespace=$taito_company-prod
    gcloud_org_id=${template_default_provider_org_id_prod:?}

    # NOTE: Set production domain here
    taito_domain=$taito_project-$taito_target_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    kubectl_replicas=2
    monitoring_enabled=true
    ;;
  stag)
    taito_zone=${template_default_zone_prod:?}
    taito_provider_region=${template_default_provider_region_prod:?}
    taito_provider_zone=${template_default_provider_zone_prod:?}
    taito_resource_namespace=$taito_company-prod
    gcloud_org_id=${template_default_provider_org_id_prod:?}

    taito_domain=$taito_project-$taito_env.${template_default_domain_prod:?}
    taito_app_url=https://$taito_domain
    ;;
  test)
    ;;
  dev|feat)
    ci_exec_build=true        # allow build of a new container
    ci_exec_deploy=true       # deploy automatically
    # NOTE: enable tests once you have implemented some integration or e2e tests
    ci_exec_test=false        # execute test suites
    ci_exec_test_init=false   # run 'init --clean' before each test suite
    ci_exec_revert=false      # revert deploy if previous steps failed
    ;;
  local)
    ci_exec_test_init=false   # run 'init --clean' before each test suite
    taito_app_url=http://localhost:9999
    db_database_external_port=6000
    db_database_host=$taito_project-database
    db_database_port=5432

    # TODO why this is not required for pg? mysql plugin requires it.
    # db_database_password=secret
esac

# ------ Derived values ------

# Namespaces
taito_resource_namespace_id=$taito_organization-$taito_resource_namespace

# URLs
taito_admin_url=$taito_app_url/admin/

# Google Cloud plugin
gcloud_region=$taito_provider_region
gcloud_zone=$taito_provider_zone
gcloud_project=$taito_zone
gcloud_storage_locations=$gcloud_region
gcloud_storage_classes=REGIONAL

# Kubernetes plugin
kubectl_cluster=gke_${taito_zone}_${gcloud_zone}_${kubectl_name}
kubectl_user=$kubectl_cluster

# Monitoring
monitoring_channel=monitoring
monitoring_paths="/uptimez /admin/uptimez /api/uptimez"
monitoring_log_alert_query="
  resource.type=\"container\"
  severity>=ERROR
  labels.\"container.googleapis.com/namespace_name\":\"$taito_project-$taito_env\"
"

# Link plugin
link_urls="
  * app[:ENV]=$taito_app_url Application (:ENV)
  * admin[:ENV]=$taito_admin_url Admin user interface (:ENV)
  * api[:ENV]=$taito_app_url/api/uptimez API (:ENV)
  * docs=https://github.com/$taito_organization/$taito_repo_name/wiki Project documentation
  * git=https://github.com/$taito_organization/$taito_repo_name GitHub repository
  * kanban=https://github.com/$taito_organization/$taito_repo_name/projects Kanban boards
  * resources[:ENV]=https://console.cloud.google.com/home/dashboard?project=$taito_resource_namespace_id Google resources (:ENV)
  * services[:ENV]=https://console.cloud.google.com/apis/credentials?project=$taito_resource_namespace_id Google services (:ENV)
  * builds=https://console.cloud.google.com/cloud-build/builds?project=$taito_zone&query=source.repo_source.repo_name%3D%22$taito_repo_location-$taito_repo_name%22 Build logs
  * images=https://console.cloud.google.com/gcr/images/$taito_zone/EU/$taito_repo_location-$taito_repo_name?project=$taito_zone Container images
  * artifacts=https://TODO-DOCS-AND-TEST-REPORTS Generated documentation and test reports
  * storage:ENV=https://console.cloud.google.com/storage/browser/$taito_project-$taito_env?project=$taito_resource_namespace_id Storage bucket (:ENV)
  * logs:ENV=https://console.cloud.google.com/logs/viewer?project=$taito_zone&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F$kubectl_name%2Fnamespace_id%2F$taito_namespace Logs (:ENV)
  * errors:ENV=https://sentry.io/$taito_organization/$taito_project/?query=is%3Aunresolved+environment%3A$taito_target_env Sentry errors (:ENV)
  * uptime=https://app.google.stackdriver.com/uptime?project=$taito_zone Uptime monitoring (Stackdriver)
  * styleguide=https://TODO UI/UX style guide and designs
  * wireframes=https://TODO UI/UX wireframes
  * feedback=https://TODO User feedback
  * performance=https://TODO Performance metrics
"

# Secrets
taito_secrets="
  github-buildbot.token:read/devops
  cloudsql-gserviceaccount.key:copy/devops
  $db_database_name-db-mgr.password/devops:random
  $db_database_name-db-app.password:random
  $taito_project-$taito_env-basic-auth.auth:htpasswd-plain
  $taito_project-$taito_env-storage-gateway.secret:random
  $taito_project-$taito_env-gserviceaccount.key:file
"

# ------ Test suite settings ------
# NOTE: Variable is passed to the test without the test_TARGET_ prefix

test_server_TEST_API_URL="https://user:painipaini@$taito_domain/api"
test_server_DATABASE_HOST="$taito_project-database-test-proxy"
test_server_DATABASE_PORT="5432"
test_server_DATABASE_NAME="$db_database_name"
test_server_DATABASE_USER="$db_database_name_app"
# TODO support all environments by reading this from secrets
test_server_DATABASE_PASSWORD="P8JH4m33RQshznTkTNxvQgFO9BWpkg"

if [[ "$taito_env" == "local" ]]; then
  # On local env we use api running on the same container
  test_server_TEST_API_URL="http://localhost:8080"
  # ...and connect to database running on an another container
  test_server_DATABASE_HOST="$taito_project-database"
  test_server_DATABASE_PASSWORD="secret"
fi

# Special settings for running tests on gcloud-builder
if [[ $taito_plugins == *"gcloud-builder"* ]] && [[ "${taito_mode:-}" == "ci" ]]; then
  test_server_DATABASE_HOST="127.0.0.1"
  test_server_DATABASE_PORT="5001"
fi
