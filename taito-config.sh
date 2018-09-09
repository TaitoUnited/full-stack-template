#!/bin/bash

# Taito-cli
export taito_image="taitounited/taito-cli:latest"
export taito_extensions=""
export taito_plugins=" \
  postgres-db sqitch-db \
  docker \
  docker-compose:local \
  terraform:-local \
  secrets:-local kube-secrets:-local \
  kubectl:-local helm:-local \
  gcloud:-local gcloud-builder:-local \
  semantic npm git links-global \
  sentry \
"

# Project
export taito_organization="${template_default_organization:?}"
export taito_project="server-template"
export taito_company="companyname"
export taito_family=""
export taito_application="template"
export taito_suffix=""

# Provider and namespaces
export taito_provider="${template_default_provider:?}" # aws, azure, gcloud, ...
export taito_provider_region="${template_default_provider_region:?}"
export taito_provider_zone="${template_default_provider_zone:?}"
export taito_zone="${template_default_zone:?}" # kube/postgres cluster project
export taito_namespace="${taito_project}-${taito_env:?}" # kubernetes namespace
export taito_resource_namespace="${taito_company}-dev" # additional resources project
export taito_environments="dev prod"

# Repositories
# TODO change taito_repo and taito_registry naming, add also repo url?
export taito_repo_location="github-${taito_organization}"
export taito_repo_name="${taito_project}"
export taito_registry="${template_default_registry:?}/${taito_zone}/${taito_repo_location}-${taito_repo_name}"

# Stack
export taito_targets="
  admin
  client
  cache
  database
  server
  storage
"
export taito_databases="database"
export taito_storages="${taito_project}-${taito_env}"
export taito_networks="default"

# Database definitions for database plugins
export db_database_instance="${template_default_postgres:?}"
export db_database_type="pg"
export db_database_name="${taito_project//-/_}_${taito_env}"
export db_database_host="localhost"
export db_database_proxy_port="5001"
export db_database_port="${db_database_proxy_port}"

# URLs
export taito_domain="${taito_project}-${taito_env:?}.${template_default_domain:?}"
export taito_app_url="https://${taito_domain}"

# Docker plugin
export dockerfile=Dockerfile

# Google Cloud plugin
# TODO gcloud_project_id = taito_zone... ??
# TODO gcloud_resource_project_id = ... ??
export gcloud_org_id="${template_default_provider_org_id:?}"  # NOTE: leave empty for 'no organization'
export gcloud_sql_proxy_port="${db_database_proxy_port}"
export gcloud_cdn_enabled=false

# Kubernetes plugin
export kubectl_name="${template_default_kubernetes:?}"
export kubectl_replicas="1"

# Helm plugin
# export helm_deploy_options="--recreate-pods" # Force restart

# Template plugin
export template_name="SERVER-TEMPLATE"
export template_source_git="git@github.com:TaitoUnited"

# Sentry plugin
export sentry_organization="${taito_organization}"

# CI/CD settings
# NOTE: Most of these should be enabled for dev and feat environments only
export ci_exec_build=false        # build a container if does not exist already
export ci_exec_deploy=true        # deploy automatically
export ci_exec_test=false         # execute test suites after deploy
export ci_exec_test_wait=60       # how many seconds to wait for deployment/restart
export ci_exec_test_init=false    # run 'init --clean' before each test suite
export ci_exec_revert=false       # revert deploy automatically on fail

# --- Override settings for different environments ---

case "${taito_env}" in
  prod)
    export taito_zone="${template_default_zone_prod:?}"
    export taito_provider_region="${template_default_provider_region_prod:?}"
    export taito_provider_zone="${template_default_provider_zone_prod:?}"
    export taito_resource_namespace="${taito_company}-prod"
    export gcloud_org_id="${template_default_provider_org_id_prod:?}"

    # NOTE: Set production domain here
    export taito_domain="${taito_project}-${taito_env:?}.${template_default_domain_prod:?}"
    export taito_app_url="https://${taito_domain}"
    export kubectl_replicas="2"
    ;;
  stag)
    export taito_zone="${template_default_zone_prod:?}"
    export taito_provider_region="${template_default_provider_region_prod:?}"
    export taito_provider_zone="${template_default_provider_zone_prod:?}"
    export taito_resource_namespace="${taito_company}-prod"
    export gcloud_org_id="${template_default_provider_org_id_prod:?}"

    export taito_domain="${taito_project}-${taito_env:?}.${template_default_domain_prod:?}"
    export taito_app_url="https://${taito_domain}"
    ;;
  test)
    ;;
  dev|feat)
    export ci_exec_build=true        # allow build of a new container
    export ci_exec_deploy=true       # deploy automatically
    export ci_exec_test=true         # execute test suites
    export ci_exec_test_init=false   # run 'init --clean' before each test suite
    export ci_exec_revert=false      # revert deploy if previous steps failed
    ;;
  local)
    export ci_exec_test_init=false   # run 'init --clean' before each test suite
    export taito_app_url="http://localhost:8080"
    export db_database_external_port="6000"
    export db_database_host="${taito_project}-database"
    export db_database_port="5432"

    # TODO why this is not required for pg? mysql plugin requires it.
    # export db_database_password="secret"
esac

# --- Derived values ---

# Namespaces
export taito_resource_namespace_id="${taito_organization}-${taito_resource_namespace}"

# URLs
export taito_admin_url="${taito_app_url}/admin/"

# Google Cloud plugin
export gcloud_region="${taito_provider_region}"
export gcloud_zone="${taito_provider_zone}"
export gcloud_project="${taito_zone}"
export gcloud_storage_locations="${gcloud_region}"
export gcloud_storage_classes="REGIONAL"

# Kubernetes plugin
export kubectl_cluster="gke_${taito_zone}_${gcloud_zone}_${kubectl_name}"
export kubectl_user="${kubectl_cluster}"

# Link plugin
export link_urls="\
  * app[:ENV]#app=${taito_app_url} Application (:ENV) \
  * admin[:ENV]#admin=${taito_admin_url} Admin user interface (:ENV) \
  * api[:ENV]#app=${taito_app_url}/api/infra/uptimez API (:ENV) \
  * docs=https://github.com/${taito_organization}/${taito_repo_name}/wiki Project documentation \
  * git=https://github.com/${taito_organization}/${taito_repo_name} GitHub repository \
  * kanban=https://github.com/${taito_organization}/${taito_repo_name}/projects Kanban boards \
  * resources[:ENV]=https://console.cloud.google.com/home/dashboard?project=${taito_resource_namespace_id} Google resources (:ENV) \
  * services[:ENV]=https://console.cloud.google.com/apis/credentials?project=${taito_resource_namespace_id} Google services (:ENV) \
  * builds=https://console.cloud.google.com/cloud-build/builds?project=${taito_zone}&query=source.repo_source.repo_name%3D%22${taito_repo_location}-${taito_repo_name}%22 Build logs \
  * images=https://console.cloud.google.com/gcr/images/${taito_zone}/EU/${taito_repo_location}-${taito_repo_name}?project=${taito_zone} Container images \
  * artifacts=https://TODO-DOCS-AND-TEST-REPORTS Generated documentation and test reports \
  * storage:ENV#storage=https://console.cloud.google.com/storage/browser/${taito_project}-${taito_env}?project=${taito_resource_namespace_id} Storage bucket (:ENV) \
  * logs:ENV#logs=https://console.cloud.google.com/logs/viewer?project=${taito_zone}&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F${kubectl_name}%2Fnamespace_id%2F${taito_namespace} Logs (:ENV) \
  * errors:ENV#errors=https://sentry.io/${taito_organization}/${taito_project}/?query=is%3Aunresolved+environment%3A${taito_env} Sentry errors (:ENV) \
  * uptime=https://app.google.stackdriver.com/uptime?project=${taito_zone} Uptime monitoring (Stackdriver) \
  * styleguide=https://TODO UI/UX style guide and designs \
  * wireframes=https://TODO UI/UX wireframes \
  * feedback=https://TODO User feedback \
  * performance=https://TODO Performance metrics \
"

# Secrets
# TODO change secret naming convention
# TODO move github and db.build secrets out of Kubernetes since they
# are required only during build
export taito_secrets="
  git.github.build:read/devops
  gcloud.cloudsql.proxy:copy/devops
  db.${db_database_name}.build/devops:random
  db.${db_database_name}.app:random
  storage.${taito_project}.gateway:random
  gcloud.${taito_project}-${taito_env}.multi:file
  jwt.${taito_project}.auth:random
  user.${taito_project}-admin.auth:manual
  user.${taito_project}-user.auth:manual
"

# NOTE: Example test suite parameters
# NOTE: env variable is passed to the test without the test_TARGET_ prefix
export test_server_TEST_API_URL="https://user:painipaini@${taito_domain}/api"
export test_server_DATABASE_HOST="${taito_project}-database"
export test_server_DATABASE_PORT="5432"
export test_server_DATABASE_ID="${db_database_name}"
export test_server_DATABASE_USER="${db_database_name}_app"
# TODO support all environments by reading this from secrets
# --> secret naming must be refactored first so that we can easily reference env var here
export test_server_DATABASE_SECRET="AhlekeLp47fqtPkg2EFrSy299OjzVA"

if [[ "${taito_env}" == "local" ]]; then
  export test_server_TEST_API_URL="http://localhost:3332"
  export test_server_DATABASE_SECRET="secret"
fi
