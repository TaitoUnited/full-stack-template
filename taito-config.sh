#!/bin/bash

# Taito-cli settings
export taito_image="taitounited/taito-cli:latest"
export taito_extensions=""
# Enabled taito-cli plugins
# - 'docker:local' means that docker is used only in local environment
# - 'kubectl:-local' means that kubernetes is used in all other environments
export taito_plugins=" \
  postgres link docker:local kubectl:-local gcloud:-local
  gcloud-builder:-local sentry secret:-local semantic npm"

# Common project settings for all plugins
export taito_organization="taitounited"
export taito_zone="gcloud-temp1" # rename to taito-gcloud-open1
export taito_repo_location="github-${taito_organization}"
export taito_repo_name="server-template"
export taito_customer="customername"
export taito_project="server-template"
export taito_registry="eu.gcr.io/${taito_zone}/github-${taito_organization}-${taito_repo_name}"
export taito_project_env="${taito_project}-${taito_env}"
export taito_namespace="${taito_customer}-${taito_env}"
export taito_app_url="https://${taito_project_env}.taitodev.com"
export taito_autorevert=false

# Settings for ci builds
export ci_test_env=false

# gcloud plugin
export gcloud_region="europe-west1"
export gcloud_zone="europe-west1-c"
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
export template_source_git_url="git@github.com:TaitoUnited"
export template_dest_git_url="git@github.com:${taito_organization}"

# Sentry plugin
export sentry_organization="${taito_organization}"

# Misc settings for npm scripts
export test_api_user="test"
export test_api_password="password"
export test_e2e_user="test"
export test_e2e_password="password"

# Override settings for different environments:
# local, feature, dev, test, staging, prod
case "${taito_env}" in
  prod)
    # prod overrides
    ;;
  staging)
    # staging overrides
    ;;
  local)
    # local overrides
    export taito_app_url="http://localhost:8080"
    if [[ "${taito_mode:-}" != "ci" ]]; then
      export postgres_host="${taito_project}-database"
      export postgres_port="5432"
    else
      export postgres_port="6000"
    fi
    export ci_test_env=true
esac

# --- Derived values ---

export gcloud_project="${taito_zone}"

# NOTE: Secret naming: type.target_of_type.purpose[/namespace]:generation_method
# NOTE: Additionally all secrets from common namespace are copied during
# create:ENV and rotate:ENV
export taito_secrets="
  jwt.server-template.auth:random
  db.${postgres_database}.app:random
  db.${postgres_database}.build/devops:random
  ext.google-cloudsql.proxy:copy/devops
  ext.github.build:read/devops"

# Link plugin
export link_urls="\
  open-app[:ENV]#app=${taito_app_url} \
  open-admin[:ENV]#admin=${taito_app_url}/admin/ \
  open-boards#boards=https://github.com/${taito_organization}/${taito_repo_name}/projects \
  open-issues#issues=https://github.com/${taito_organization}/${taito_repo_name}/issues \
  open-builds#builds=https://console.cloud.google.com/gcr/builds?project=${taito_zone}&query=source.repo_source.repo_name%3D%22${taito_repo_location}-${taito_repo_name}%22 \
  open-artifacts#artifacts=https://console.cloud.google.com/gcr/images/${taito_zone}/EU/${taito_repo_location}-${taito_repo_name}?project=${taito_zone} \
  open-bucket#bucket=https://storage.googleapis.com/${taito_project_env} \
  open-logs:ENV#logs=https://console.cloud.google.com/logs/viewer?project=${taito_zone}&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F${kubectl_name}%2Fnamespace_id%2F${taito_namespace} \
  open-errors:ENV#errors=https://sentry.io/${taito_organization}/${taito_project}/?query=is%3Aunresolved+environment%3A${taito_env} \
  open-uptime#uptime=https://app.google.stackdriver.com/uptime?project=${taito_zone} \
  open-performance#performance=https://TODO-NOT-IMPLEMENTED \
  open-feedback#feedback=https://TODO-NOT-IMPLEMENTED
  "
