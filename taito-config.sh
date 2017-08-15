#!/bin/sh

# : "${taito_env:?}"

# Taito-cli settings
export taito_image="eu.gcr.io/gcloud-temp1/github-taitounited-taito-cli:latest"
export taito_extensions=""
# Enabled taito-cli plugins
# - 'docker:local' means that docker is used only in local environment
# - 'kubectl:-local' means that kubernetes is used in all other environments
export taito_plugins=" \
  npm postgres link docker:local kubectl:-local gcloud:-local
  gcloud-builder:-local sentry secret:-local semantic"

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
export taito_app_url="https://${taito_project_env}.g.taitodev.com"
export taito_autorevert=false

# gcloud plugin
export gcloud_region="europe-west1"
export gcloud_zone="europe-west1-c"
export gcloud_sql_proxy_port="5001"
export gcloud_build_enabled=true
export gcloud_dns_enabled=false
export gcloud_monitoring_enabled=false
export gcloud_log_alerts_enabled=false
export gcloud_functions_enabled=false
export gcloud_cdn_enabled=false

# Kubernetes plugin
export kubectl_name="kube1" # TODO rename to common-kubernetes

# Postgres plugin
export postgres_name="common-postgres"
export postgres_database="${taito_project//-/_}_${taito_env}"
export postgres_host="localhost"
export postgres_port="${gcloud_sql_proxy_port}"

# npm plugin: to be used by npm scripts
export test_api_user="test"
export test_api_password="password"
export test_e2e_user="test"
export test_e2e_password="password"

# Template plugin
export template_name="orig-template"
export template_source_git_url="git@github.com:TaitoUnited"
export template_dest_git_url="git@github.com:${taito_organization}"

# Sentry plugin
export sentry_organization="${taito_organization}"

# Override settings for different environments:
# local, feature, dev, test, staging, prod
case "${taito_env}" in
  prod)
    # prod overrides
    # export taito_autorevert=true
    # export taito_app_url="https://www.myapp.com"
    # export taito_zone="taito-gcloud-restricted1"
    # export gcloud_region="europe-west2"
    # export gcloud_zone="europe-west2-a"
    # export gcloud_dns_enabled=true
    # export gcloud_monitoring_enabled=true
    # export gcloud_log_alerts_enabled=true
    # export kubernetes_name="netflix-kubernetes"
    # export postgres_name="netflix-postgres"
    ;;
  staging)
    # staging overrides
    # export taito_app_url="https://${taito_project_env}.myapp.com"
    # export taito_zone="taito-gcloud-restricted1"
    # export gcloud_region="europe-west2"
    # export gcloud_zone="europe-west2-a"
    # export kubernetes_name="netflix-kubernetes"
    # export postgres_name="netflix-postgres"
    ;;
  local)
    # local overrides
    export taito_app_url="http://localhost:3333"
    export postgres_host="${taito_project}-database"
    export postgres_port="5432"
    ;;
esac

# --- Derived values ---

export gcloud_project="${taito_zone}"

# NOTE: Secret naming: generation_method:type.target_of_type.purpose[/namespace]
# NOTE: Additionally all secrets from common namespace are copied during
# create:ENV and rotate:ENV
export taito_secrets="
  random:db.${postgres_database}.app
  random:db.${postgres_database}.build/devops
  copy/devops:ext.google-cloudsql.proxy
  read/devops:ext.github.build"

# Link plugin
export link_urls="\
  open[:ENV]#app=${taito_app_url} \
  open-boards=https://github.com/${taito_organization}/${taito_repo_name}/projects \
  open-issues=https://github.com/${taito_organization}/${taito_repo_name}/issues \
  open-builds=https://console.cloud.google.com/gcr/builds?project=${taito_zone}&query=source.repo_source.repo_name%3D%22${taito_repo_location}-${taito_repo_name}%22 \
  open-artifacts=https://console.cloud.google.com/gcr/images/${taito_zone}/EU/${taito_repo_location}-${taito_repo_name}?project=${taito_zone} \
  open-logs:ENV=https://console.cloud.google.com/logs/viewer?project=${taito_zone}&minLogLevel=0&expandAll=false&resource=container%2Fcluster_name%2F${kubectl_name}%2Fnamespace_id%2F${taito_namespace} \
  open-errors:ENV=https://sentry.io/${taito_organization}/${taito_project}/ \
  open-uptime=https://app.google.stackdriver.com/uptime?project=${taito_zone} \
  open-performance=https://TODO-NOT-IMPLEMENTED \
  open-feedback=https://TODO-NOT-IMPLEMENTED
  "
