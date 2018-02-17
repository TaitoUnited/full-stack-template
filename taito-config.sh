#!/bin/bash

# Taito-cli settings
export taito_image="taitounited/taito-cli:latest"
export taito_extensions=""
# Enabled taito-cli plugins
# - 'docker:local' means that docker is used only in local environment
# - 'kubectl:-local' means that kubernetes is used in all other environments
export taito_plugins=" \
  postgres links-global docker:local kubectl:-local gcloud:-local
  gcloud-builder:-local sentry secret:-local semantic npm"

# Common project settings for all plugins
export taito_environments="dev prod"
export taito_organization="${template_default_organization:?}"
export taito_zone="${template_default_zone:?}"
export taito_provider="${template_default_provider:?}"
export taito_repo_location="github-${taito_organization}"
export taito_repo_name="server-template"
export taito_customer="customername"
export taito_project="server-template"
export taito_registry="eu.gcr.io/${taito_zone}/github-${taito_organization}-${taito_repo_name}"
export taito_namespace="${taito_project}-${taito_env:?}" # or "${taito_customer}-${taito_env}"
export taito_app_url="https://${taito_namespace}.${template_default_domain:?}"
export taito_admin_url="${taito_app_url}/admin/"

# docker plugin
export dockerfile=Dockerfile

# gcloud plugin
export gcloud_region="${template_default_provider_region:?}"
export gcloud_zone="${template_default_provider_zone:?}"
export gcloud_sql_proxy_port="5001"
export gcloud_cdn_enabled=false

# Kubernetes plugin
export kubectl_name="kube1" # TODO rename to common-kubernetes

# Postgres plugin
export postgres_name="common-postgres"
export postgres_database="${taito_project//-/_}_${taito_env}"
export postgres_host="localhost"
export postgres_port="${gcloud_sql_proxy_port}"

# Template plugin
export template_name="orig-template"
export template_source_git="git@github.com:TaitoUnited"

# Sentry plugin
export sentry_organization="${taito_organization}"

# Settings for builds
# NOTE: Most of these should be enabled for dev and feature envs only
export ci_stack="admin client cache database server storage"
export ci_exec_build=false        # build a container if does not exist already
export ci_exec_deploy=true        # deploy automatically
export ci_exec_test=false         # execute test suites after deploy
export ci_exec_test_init=false    # run 'init --clean' before each test suite
export ci_exec_revert=false       # revert deploy automatically on fail
# TODO implement copy support to 'taito ci-deploy'
export ci_copy="\
  docker://client/build;gs://xxx/${taito_namespace}"

# Test suite arguments
export test_api_url="${taito_app_url}/api"
export test_user="test"
export test_password="password"

# Override settings for different environments:
# local, feature, dev, test, staging, prod
case "${taito_env}" in
  prod)
    # prod overrides
    ;;
  staging)
    # staging overrides
    ;;
  test)
    # test overrides
    ;;
  dev|feature)
    # dev and feature overrides
    export ci_exec_build=true        # allow build of a new container
    export ci_exec_deploy=true       # deploy automatically
    export ci_exec_test=true         # execute test suites
    export ci_exec_test_init=true    # run 'init --clean' before each test suite
    export ci_exec_revert=true       # revert deploy if previous steps failed
    ;;
  local)
    # local overrides
    export ci_exec_test_init=true    # run 'init --clean' before each test suite
    export test_api_url="http://localhost:3332"
    export taito_app_url="http://localhost:8080"
    export taito_admin_url="${taito_app_url}/admin/"
    export postgres_external_port="6000"
    if [[ "${taito_mode:-}" != "ci" ]]; then
      export postgres_host="${taito_project}-database"
      export postgres_port="5432"
    else
      export postgres_port="${postgres_external_port}"
    fi
    export ci_test_env=true
esac

# --- Derived values ---

export gcloud_project="${taito_zone}"

# NOTE: Secret naming: type.target_of_type.purpose[/namespace]:generation_method
export taito_secrets="
  git.github.build:read/devops
  gcloud.cloudsql.proxy:copy/devops
  db.${postgres_database}.build/devops:random
  db.${postgres_database}.app:random
  storage.${taito_project}.gateway:random
  gcloud.${taito_project}-${taito_env}.multi:file
  jwt.${taito_project}.auth:random
  user.${taito_project}-admin.auth:manual
  user.${taito_project}-user.auth:manual"

# Link plugin
export link_urls="\
  app[:ENV]#app=${taito_app_url} \
  admin[:ENV]#admin=${taito_admin_url} \
  docs=https://TODO-ADD-DOCS-REFERENCE-HERE \
  git=https://github.com/${taito_organization}/${taito_repo_name} \
  project=https://github.com/${taito_organization}/${taito_repo_name}/projects \
  builds=https://console.cloud.google.com/gcr/builds?project=${taito_zone}&query=source.repo_source.repo_name%3D%22${taito_repo_location}-${taito_repo_name}%22 \
  storage:ENV#storage=https://console.cloud.google.com/storage/browser/${taito_project}-${taito_env}?project=${taito_zone} \
  logs:ENV#logs=https://console.cloud.google.com/logs/viewer?project=${taito_zone}&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F${kubectl_name}%2Fnamespace_id%2F${taito_namespace} \
  errors:ENV#errors=https://sentry.io/${taito_organization}/${taito_project}/?query=is%3Aunresolved+environment%3A${taito_env} \
  uptime=https://app.google.stackdriver.com/uptime?project=${taito_zone} \
  "
  # artifacts=https://console.cloud.google.com/gcr/images/${taito_zone}/EU/${taito_repo_location}-${taito_repo_name}?project=${taito_zone} \
  # feedback=https://TODO-NOT-IMPLEMENTED \
  # performance=https://TODO-NOT-IMPLEMENTED \
