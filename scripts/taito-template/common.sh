#!/bin/bash -e
# Common logic for full-stack-template, website-template, wordpress-template,
# and minimal-template.

: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"
: "${template_project_path:?}"

echo "Common template initialization"

# Defaults
template_default_organization=${template_default_organization:-myorganization}
template_default_organization_abbr=${template_default_organization_abbr:-myorg}
template_default_sentry_organization=${template_default_sentry_organization}
template_default_ci_organization=${template_default_ci_organization:-$template_default_organization}
template_default_vc_organization=${template_default_vc_organization:-$template_default_organization}
template_default_vc_url=${template_default_vc_url:-github.com/$template_default_vc_organization}
template_default_vc_provider=${template_default_vc_provider:-github}
template_default_domain=${template_default_domain:-mydomain.com}
template_default_domain_prod=${template_default_domain_prod:-$template_default_domain}
template_default_zone=${template_default_zone:-my-zone}
template_default_zone_prod=${template_default_zone_prod:-$template_default_zone}
template_default_environments=${template_default_environments:-dev prod}

if [[ ${taito_verbose:-} == "true" ]]; then
  set -x
fi

######################
# Remove these always
######################

echo "Removing obsolete stuff"

# Template note from README.md
sed -i "/^.*(TEMPLATE NOTE START)$/,/^.*(TEMPLATE NOTE END)$/d" README.md

rm -f scripts/terraform/.gitignore

sed -i "/# TEMPLATE-REMOVE/d" \
  scripts/taito/env-prod.sh \
  scripts/taito/project.sh \
  scripts/taito/testing.sh

# Template MIT license
# TODO leave a reference to the original?
rm LICENSE

##########################
# Prune provider settings
##########################

echo "Pruning provider settings"

if [[ -f docker-compose-test.yaml ]] && \
   [[ $template_default_provider != "azure" ]] && \
   [[ $template_default_provider_prod != "azure" ]]
then
  sed -i '/AZURE_/d' docker-compose-test.yaml
fi

if [[ -f docker-compose-test.yaml ]] && \
   [[ $template_default_provider != "aws" ]] && \
   [[ $template_default_provider_prod != "aws" ]]
then
  sed -i '/AWS_/d' docker-compose-test.yaml
fi

if [[ -f docker-compose-test.yaml ]] && \
   [[ $template_default_provider != "do" ]] && \
   [[ $template_default_provider_prod != "do" ]]
then
  sed -i '/DO_/d' docker-compose-test.yaml
fi

if [[ -f docker-compose-test.yaml ]] && \
   [[ $template_default_provider != "gcp" ]] && \
   [[ $template_default_provider_prod != "gcp" ]]
then
  sed -i '/GOOGLE_/d' docker-compose-test.yaml
fi

# Currently network policy supported only for gcp (database host is static IP)
if [[ $template_default_provider != "gcp" ]]; then
  sed -i "s/networkPolicyEnabled: true/networkPolicyEnabled: false/" scripts/helm.yaml
fi

######################
# Choose CI/CD
######################

echo "Choosing CI/CD"

ci=${template_default_ci_provider:-}
while [[ " aws azure bitbucket github gitlab gcp jenkins local travis " != *" $ci "* ]]; do
  echo "Select CI/CD: aws, azure, bitbucket, github, gitlab, gcp, jenkins, local, or travis"
  read -r ci
done

#######################
# Replace some strings
#######################

echo "Replacing some strings"

if [[ ! ${taito_random_name} ]] || [[ ${taito_random_name} == *"-template" ]]; then
  taito_random_name="$(taito -q util random words: 3)" # TODO: remove util
fi
echo "Setting random name: ${taito_random_name}"
sed -i "s/^taito_random_name=.*$/taito_random_name=${taito_random_name}/" scripts/taito/labels.sh

echo "Replacing git repository url"
sed -i "s|TaitoUnited/.*-template.git|${template_default_vc_organization}/${taito_vc_repository}.git|g" package.json

echo "Replacing template variables with the given settings..."
sed -i "s/taito_company=.*/taito_company=${taito_company}/g" scripts/taito/labels.sh
sed -i "s/taito_family=.*/taito_family=${taito_family}/g" scripts/taito/labels.sh
sed -i "s/taito_application=.*/taito_application=${taito_application}/g" scripts/taito/labels.sh
sed -i "s/taito_suffix=.*/taito_suffix=${taito_suffix}/g" scripts/taito/labels.sh
sed -i "s/taito_project=.*/taito_project=${taito_vc_repository}/g" scripts/taito/labels.sh

echo "Replacing template variables with the user specific settings..."
sed -i "s/\${template_default_environments}/${template_default_environments}/g" scripts/taito/project.sh
sed -i "s/\${template_default_organization}/${template_default_organization}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_organization_abbr}/${template_default_organization_abbr:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_vc_organization}/${template_default_vc_organization:-}/g" scripts/taito/config/main.sh
sed -i "s|\${template_default_vc_url}|${template_default_vc_url:-}|g" scripts/taito/config/main.sh
sed -i "s/\${template_default_sentry_organization}/${template_default_sentry_organization:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_domain}/${template_default_domain:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_domain_prod}/${template_default_domain_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_domain_prod}/${template_default_domain_prod:-}/g" scripts/taito/env-prod.sh
sed -i "s/\${template_default_cdn_domain}/${template_default_cdn_domain:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_cdn_domain_prod}/${template_default_cdn_domain_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_zone}/${template_default_zone:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_zone_prod}/${template_default_zone_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider}/${template_default_provider}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_prod}/${template_default_provider_prod}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_org_id}/${template_default_provider_org_id:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_org_id_prod}/${template_default_provider_org_id_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_billing_account_id}/${template_default_provider_billing_account_id:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_billing_account_id_prod}/${template_default_provider_billing_account_id_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_region}/${template_default_provider_region:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_region_prod}/${template_default_provider_region_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_zone}/${template_default_provider_zone:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_zone_prod}/${template_default_provider_zone_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_secrets_location}/${template_default_provider_secrets_location:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_provider_secrets_location_prod}/${template_default_provider_secrets_location_prod:-}/g" scripts/taito/config/main.sh
sed -i "s|\${template_default_uptime_channels}|${template_default_uptime_channels:-}|g" scripts/taito/config/main.sh
sed -i "s|\${template_default_uptime_channels_prod}|${template_default_uptime_channels_prod:-}|g" scripts/taito/config/main.sh
sed -i "s|\${template_default_source_git}|${template_default_source_git:-}|g" scripts/taito/config/main.sh
sed -i "s|\${template_default_dest_git}|${template_default_dest_git:-}|g" scripts/taito/config/main.sh

# Hosts
sed -i "s/\${template_default_host}/${template_default_host:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_host_prod}/${template_default_host_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_bastion_public_ip}/${template_default_bastion_public_ip:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_bastion_public_ip_prod}/${template_default_bastion_public_ip_prod:-}/g" scripts/taito/config/main.sh

# Misc providers
sed -i "s/\${template_default_uptime_provider}/${template_default_uptime_provider:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_uptime_provider_prod}/${template_default_uptime_provider_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_uptime_provider_org_id}/${template_default_uptime_provider_org_id:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_uptime_provider_org_id_prod}/${template_default_uptime_provider_org_id_prod:-}/g" scripts/taito/config/main.sh

# CI/CD
sed -i "s/\${template_default_ci_provider}/${template_default_ci_provider:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_ci_provider_prod}/${template_default_ci_provider_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_ci_organization}/${template_default_ci_organization:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_ci_organization_prod}/${template_default_ci_organization_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_vc_provider}/${template_default_vc_provider:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_container_registry_provider}/${template_default_container_registry_provider:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_container_registry_provider_prod}/${template_default_container_registry_provider_prod:-}/g" scripts/taito/config/main.sh
sed -i "s|\${template_default_container_registry}|${template_default_container_registry:-}|g" scripts/taito/config/main.sh
sed -i "s|\${template_default_container_registry_prod}|${template_default_container_registry_prod:-}|g" scripts/taito/config/main.sh
sed -i "s/\${template_default_ci_exec_deploy:-true}/${template_default_ci_exec_deploy:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_ci_exec_deploy_prod:-true}/${template_default_ci_exec_deploy_prod:-}/g" scripts/taito/config/main.sh

# Kubernetes
sed -i "s/\${template_default_kubernetes}/${template_default_kubernetes:-}/g" scripts/taito/config/main.sh

# Postgres
sed -i "s/\${template_default_postgres}/${template_default_postgres:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_host}/${template_default_postgres_host:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_host_prod}/${template_default_postgres_host_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_username_suffix}/${template_default_postgres_username_suffix:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_username_suffix_prod}/${template_default_postgres_username_suffix_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_enabled:-true}/${template_default_postgres_ssl_enabled:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_enabled_prod:-true}/${template_default_postgres_ssl_enabled_prod:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_client_cert_enabled:-false}/${template_default_postgres_ssl_client_cert_enabled:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_client_cert_enabled_prod:-false}/${template_default_postgres_ssl_client_cert_enabled_prod:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_server_cert_enabled:-false}/${template_default_postgres_ssl_server_cert_enabled:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_ssl_server_cert_enabled_prod:-false}/${template_default_postgres_ssl_server_cert_enabled_prod:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_proxy_ssl_enabled:-true}/${template_default_postgres_proxy_ssl_enabled:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_proxy_ssl_enabled_prod:-true}/${template_default_postgres_proxy_ssl_enabled_prod:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_master_username}/${template_default_postgres_master_username:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_postgres_master_password_hint}/${template_default_postgres_master_password_hint:-}/g" scripts/taito/config/main.sh

# MySQL
sed -i "s/\${template_default_mysql}/${template_default_mysql:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_host}/${template_default_mysql_host:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_host_prod}/${template_default_mysql_host_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_username_suffix}/${template_default_mysql_username_suffix:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_username_suffix_prod}/${template_default_mysql_username_suffix_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_enabled:-true}/${template_default_mysql_ssl_enabled:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_enabled_prod:-true}/${template_default_mysql_ssl_enabled_prod:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_client_cert_enabled:-false}/${template_default_mysql_ssl_client_cert_enabled:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_client_cert_enabled_prod:-false}/${template_default_mysql_ssl_client_cert_enabled_prod:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_server_cert_enabled:-false}/${template_default_mysql_ssl_server_cert_enabled:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_ssl_server_cert_enabled_prod:-false}/${template_default_mysql_ssl_server_cert_enabled_prod:-false}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_proxy_ssl_enabled:-true}/${template_default_mysql_proxy_ssl_enabled:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_proxy_ssl_enabled_prod:-true}/${template_default_mysql_proxy_ssl_enabled_prod:-true}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_master_username}/${template_default_mysql_master_username:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_mysql_master_password_hint}/${template_default_mysql_master_password_hint:-}/g" scripts/taito/config/main.sh

# Storage
sed -i "s/\${template_default_storage_class}/${template_default_storage_class:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_storage_class_prod}/${template_default_storage_class_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_storage_location}/${template_default_storage_location:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_storage_location_prod}/${template_default_storage_location_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_storage_days}/${template_default_storage_days:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_storage_days_prod}/${template_default_storage_days_prod:-}/g" scripts/taito/config/main.sh

# Backups
sed -i "s/\${template_default_backup_class}/${template_default_backup_class:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_backup_class_prod}/${template_default_backup_class_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_backup_location}/${template_default_backup_location:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_backup_location_prod}/${template_default_backup_location_prod:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_backup_days}/${template_default_backup_days:-}/g" scripts/taito/config/main.sh
sed -i "s/\${template_default_backup_days_prod}/${template_default_backup_days_prod:-}/g" scripts/taito/config/main.sh

if [[ -f docker-compose-test.yaml ]]; then
  echo "Removing template settings from docker-compose-test.yaml..."
  sed -i '/template_default_/d' docker-compose-test.yaml
fi

######################
# Initialize CI/CD
######################

echo "Initializing CI/CD: $ci"

# Remove extra template stuff from CI/CD scripts
rm -rf cloudbuild-template.yaml
sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image:-}|g" cloudbuild.yaml
sed -i "s|_IMAGE_REGISTRY: eu.gcr.io/\$PROJECT_ID|_IMAGE_REGISTRY: ${template_default_container_registry}|" cloudbuild.yaml
sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" azure-pipelines.yml

ci_scripts="buildspec.yml azure-pipelines.yml bitbucket-pipelines.yml \
  .github/main.workflow .gitlab-ci.yml cloudbuild.yaml Jenkinsfile local-ci.sh \
  .travis.yml"

sed -i "s/\$template_default_taito_image_username/${template_default_taito_image_username:-}/g" ${ci_scripts}
sed -i "s/\$template_default_taito_image_password/${template_default_taito_image_password:-}/g" ${ci_scripts}
sed -i "s/\$template_default_taito_image_email/${template_default_taito_image_email:-}/g" ${ci_scripts}
sed -i "s|\$template_default_taito_image|${template_default_taito_image}|g" ${ci_scripts}
sed -i "s|\${template_default_taito_image}|${template_default_taito_image}|g" scripts/taito/config/main.sh

################################
# Remove obsolete CI/CD scripts
################################

echo "Removing obsolete CI/CD scripts"

# aws
if [[ $ci != "aws" ]] && [[ $template_default_ci_provider_prod != "aws" ]]; then
  rm -f buildspec.yml
fi

# azure
if [[ $ci != "azure" ]] && [[ $template_default_ci_provider_prod != "azure" ]]; then
  rm -f azure-pipelines.yml
  sed -i "/^# Tests disabled on Azure DevOps\r*\$/,/^\r*$/d" scripts/taito/testing.sh
fi

# bitbucket
if [[ $ci != "bitbucket" ]] && [[ $template_default_ci_provider_prod != "bitbucket" ]]; then
  rm -f bitbucket-pipelines.yml
fi

# github
if [[ $ci != "github" ]] && [[ $template_default_ci_provider_prod != "github" ]]; then
  rm -rf .github
fi

# gitlab
if [[ $ci != "gitlab" ]] && [[ $template_default_ci_provider_prod != "gitlab" ]]; then
  rm -rf .gitlab-ci.yml
fi

# gcp
if [[ $ci != "gcp" ]] && [[ $template_default_ci_provider_prod != "gcp" ]]; then
  rm -f cloudbuild.yaml
fi

# jenkins
if [[ $ci != "jenkins" ]] && [[ $template_default_ci_provider_prod != "jenkins" ]]; then
  rm -f Jenkinsfile
fi

# shell
# if [[ $ci != "local" ]] && [[ $template_default_ci_provider_prod != "local" ]]; then
#   rm -f local-ci.sh
# fi

# travis
if [[ $ci != "travis" ]] && [[ $template_default_ci_provider_prod != "travis" ]]; then
  rm -f .travis.yml
fi

####################################
# Remove obsolete provider scripts
####################################

echo "Removing obsolete provider scripts"

if [[ -d scripts/linux-provider ]] && \
   [[ $template_default_provider != "linux" ]] && \
   [[ $template_default_provider_prod != "linux" ]]; then
  rm -rf scripts/linux-provider
fi

if [[ -d scripts/custom-provider ]] && \
   [[ $template_default_provider != "custom" ]] && \
   [[ $template_default_provider_prod != "custom" ]]; then
  rm -rf scripts/custom-provider
fi

if [[ -f docker-compose-remote.yaml ]] && \
   [[ $template_default_provider != "linux" ]] && \
   [[ $template_default_provider_prod != "linux" ]] && \
   [[ $template_default_provider != "custom" ]] && \
   [[ $template_default_provider_prod != "custom" ]]; then
  rm -rf docker-compose-remote.yaml
fi

if [[ -f ./scripts/helm.yaml ]]; then
  sed -i "/# TODO:/d" ./scripts/helm.yaml
fi

######################
# Clean up
######################

echo "Clean up"

read -t 1 -n 10000 discard || :
