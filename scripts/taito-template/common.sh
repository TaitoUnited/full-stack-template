#!/bin/bash -e
# Common logic for server-template, website-template, and wordpress-template

: "${taito_organization:?}"
: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"

: "${template_default_taito_image:?}"
: "${template_default_environments:?}"
: "${template_default_organization:?}"
: "${template_default_organization_abbr:?}"
: "${template_default_git_organization:?}"
: "${template_default_git_url:?}"
: "${template_default_sentry_organization:?}"
: "${template_default_domain:?}"
: "${template_default_domain_prod:?}"
: "${template_default_zone:?}"
: "${template_default_zone_prod:?}"
: "${template_default_git_provider:?}"
: "${template_default_provider:?}"
: "${template_default_provider_org_id:?}"
: "${template_default_provider_org_id_prod:?}"
: "${template_default_provider_region:?}"
: "${template_default_provider_region_prod:?}"
: "${template_default_provider_zone:?}"
: "${template_default_provider_zone_prod:?}"
: "${template_default_monitoring_uptime_channels_prod:-}"
: "${template_default_container_registry:?}"
: "${template_default_source_git:?}"
: "${template_default_dest_git:?}"
: "${template_default_kubernetes:?}"
: "${template_default_kubernetes_cluster_prefix:?}"
: "${template_default_kubernetes_cluster_prefix_prod:?}"

: "${template_project_path:?}"
: "${mode:?}"

${taito_setv:?}

######################
# Remove these always
######################

# Template note from README.md
sed -i "/^.*(TEMPLATE NOTE START)$/,/^.*(TEMPLATE NOTE END)$/d" README.md

rm -f scripts/terraform/.gitignore

# 'TODO links' from taito-config.sh
sed -i '/https:\/\/TODO/d' taito-config.sh
sed -i "/# TEMPLATE-REMOVE/d" taito-config.sh

# Template MIT license
# TODO leave a reference to the original?
rm LICENSE

######################
# Choose CI/CD
######################

ci=${template_default_ci_provider:-}
while [[ " aws azure bitbucket github gitlab gcloud jenkins shell travis " != *" $ci "* ]]; do
  echo "Select CI/CD: aws, azure, bitbucket, github, gitlab, gcloud, jenkins, shell, or travis"
  read -r ci
done

if [[ ${template_default_ci_deploy_with_spinnaker:-} ]]; then
  ci_deploy_with_spinnaker=$template_default_ci_deploy_with_spinnaker
else
  echo "Use Spinnaker for deployment (y/N)?"
  read -r confirm
  if [[ ${confirm} =~ ^[Yy]$ ]]; then
    ci_deploy_with_spinnaker=true
  fi
fi

#######################
# Replace some strings
#######################

if [[ ! ${taito_random_name} ]] || [[ ${taito_random_name} == *"-template" ]]; then
  taito_random_name="$(taito -q util-random-words: 3)"
fi
echo "Setting random name: ${taito_random_name}"
sed -i "s/^taito_random_name=.*$/taito_random_name=${taito_random_name}/" taito-config.sh

echo "Replacing git repository url"
sed -i "s|TaitoUnited/.*-template.git|${taito_organization}/${taito_vc_repository}.git|g" package.json

echo "Replacing template variables with the given settings..."
sed -i "s/taito_company=.*/taito_company=${taito_company}/g" taito-config.sh
sed -i "s/taito_family=.*/taito_family=${taito_family:-}/g" taito-config.sh
sed -i "s/taito_application=.*/taito_application=${taito_application:-}/g" taito-config.sh
sed -i "s/taito_suffix=.*/taito_suffix=${taito_suffix:-}/g" taito-config.sh
sed -i "s/taito_project=.*/taito_project=${taito_vc_repository}/g" taito-config.sh

echo "Replacing template variables with the user specific settings..."
sed -i "s/\${template_default_environments:?}/${template_default_environments}/g" taito-config.sh
sed -i "s/\${template_default_organization:?}/${template_default_organization}/g" taito-config.sh
sed -i "s/\${template_default_organization_abbr:?}/${template_default_organization_abbr}/g" taito-config.sh
sed -i "s/\${template_default_git_organization:?}/${template_default_git_organization}/g" taito-config.sh
sed -i "s|\${template_default_git_url:?}|${template_default_git_url}|g" taito-config.sh
sed -i "s/\${template_default_sentry_organization:?}/${template_default_sentry_organization}/g" taito-config.sh
sed -i "s/\${template_default_domain:?}/${template_default_domain}/g" taito-config.sh
sed -i "s/\${template_default_domain_prod:?}/${template_default_domain_prod}/g" taito-config.sh
sed -i "s/\${template_default_zone:?}/${template_default_zone}/g" taito-config.sh
sed -i "s/\${template_default_zone_prod:?}/${template_default_zone_prod}/g" taito-config.sh
sed -i "s/\${template_default_provider:?}/${template_default_provider}/g" taito-config.sh
sed -i "s/\${template_default_provider_org_id:?}/${template_default_provider_org_id}/g" taito-config.sh
sed -i "s/\${template_default_provider_org_id_prod:?}/${template_default_provider_org_id_prod}/g" taito-config.sh
sed -i "s/\${template_default_provider_region:?}/${template_default_provider_region}/g" taito-config.sh
sed -i "s/\${template_default_provider_zone:?}/${template_default_provider_zone}/g" taito-config.sh
sed -i "s/\${template_default_provider_region_prod:?}/${template_default_provider_region_prod}/g" taito-config.sh
sed -i "s/\${template_default_provider_zone_prod:?}/${template_default_provider_zone_prod}/g" taito-config.sh
sed -i "s|\${template_default_monitoring_uptime_channels_prod:-}|${template_default_monitoring_uptime_channels_prod}|g" taito-config.sh
sed -i "s|\${template_default_container_registry:?}|${template_default_container_registry}|g" taito-config.sh
sed -i "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed -i "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh

# Kubernetes
sed -i "s/\${template_default_kubernetes:?}/${template_default_kubernetes}/g" taito-config.sh
sed -i "s|\${template_default_kubernetes_cluster_prefix:?}|${template_default_kubernetes_cluster_prefix}|g" taito-config.sh
sed -i "s|\${template_default_kubernetes_cluster_prefix_prod:?}|${template_default_kubernetes_cluster_prefix_prod}|g" taito-config.sh

# Postgres
sed -i "s/\${template_default_postgres:?}/${template_default_postgres}/g" taito-config.sh
sed -i "s/\${template_default_postgres_host:?}/${template_default_postgres_host}/g" taito-config.sh
sed -i "s/\${template_default_postgres_host_prod:?}/${template_default_postgres_host_prod}/g" taito-config.sh
sed -i "s/\${template_default_postgres_master_username:?}/${template_default_postgres_master_username}/g" taito-config.sh
sed -i "s/\${template_default_postgres_master_password_hint:?}/${template_default_postgres_master_password_hint}/g" taito-config.sh

# MySQL
sed -i "s/\${template_default_mysql:?}/${template_default_mysql}/g" taito-config.sh
sed -i "s/\${template_default_mysql_host:?}/${template_default_mysql_host}/g" taito-config.sh
sed -i "s/\${template_default_mysql_host_prod:?}/${template_default_mysql_host_prod}/g" taito-config.sh
sed -i "s/\${template_default_mysql_master_username:?}/${template_default_mysql_master_username}/g" taito-config.sh
sed -i "s/\${template_default_mysql_master_password_hint:?}/${template_default_mysql_master_password_hint}/g" taito-config.sh

# Storage
sed -i "s/\${template_default_storage_class:-}/${template_default_storage_class:-}/g" taito-config.sh
sed -i "s/\${template_default_storage_class_prod:-}/${template_default_storage_class_prod:-}/g" taito-config.sh
sed -i "s/\${template_default_storage_location:-}/${template_default_storage_location:-}/g" taito-config.sh
sed -i "s/\${template_default_storage_location_prod:-}/${template_default_storage_location_prod:-}/g" taito-config.sh
sed -i "s/\${template_default_storage_days:-}/${template_default_storage_days:-}/g" taito-config.sh
sed -i "s/\${template_default_storage_days_prod:-}/${template_default_storage_days_prod:-}/g" taito-config.sh

# Backups
sed -i "s/\${template_default_backup_class:-}/${template_default_backup_class:-}/g" taito-config.sh
sed -i "s/\${template_default_backup_class_prod:-}/${template_default_backup_class_prod:-}/g" taito-config.sh
sed -i "s/\${template_default_backup_location:-}/${template_default_backup_location:-}/g" taito-config.sh
sed -i "s/\${template_default_backup_location_prod:-}/${template_default_backup_location_prod:-}/g" taito-config.sh
sed -i "s/\${template_default_backup_days:-}/${template_default_backup_days:-}/g" taito-config.sh
sed -i "s/\${template_default_backup_days_prod:-}/${template_default_backup_days_prod:-}/g" taito-config.sh

if [[ -f docker-compose-test.yaml ]]; then
  echo "Removing template settings from docker-compose-test.yaml..."
  sed -i '/template_default_/d' docker-compose-test.yaml
fi

############################
# Replace provider settings
############################

echo "Configuring provider settings for ${template_default_provider}"
if [[ "${template_default_provider}" == "gcloud" ]]; then
  echo "gcloud already configured by default"
elif [[ "${template_default_provider}" == "aws" ]]; then
  sed -i "s/ gcloud:-local/ aws:-local/" taito-config.sh
  sed -i "s/ gcloud-secrets:-local//" taito-config.sh
  sed -i "s/ gcloud-storage:-local/ aws-storage:-local/" taito-config.sh
  sed -i '/gcloud-monitoring:-local/d' taito-config.sh
  sed -i "s/kubernetes_db_proxy_enabled=false/kubernetes_db_proxy_enabled=true/" taito-config.sh
  sed -i '/gserviceaccount/d' taito-config.sh

  # Links
  sed -i '/* services/d' taito-config.sh
  sed -i "s|^  \\* logs:ENV=.*|  * logs:ENV=https://${template_default_provider_region}.console.aws.amazon.com/cloudwatch/home?region=${template_default_provider_region}#logs: Logs (:ENV)|" taito-config.sh
  # TODO: monitoring

  # AWS credentials
  sed -i '/^  _IMAGE_REGISTRY:/a\  _AWS_ACCESS_KEY_ID:\n  _AWS_SECRET_ACCESS_KEY:' cloudbuild.yaml
  sed -i '/^    - taito_mode=ci/a\    - AWS_ACCESS_KEY_ID=$_AWS_ACCESS_KEY_ID\n    - AWS_SECRET_ACCESS_KEY=$_AWS_SECRET_ACCESS_KEY' cloudbuild.yaml
  sed -i "/^    # TODO: should be implemented in taito-cli plugin\$/,/^$/d" cloudbuild.yaml

  echo "TODO: remove Google Cloud storage gateway"
else
  echo "ERROR: Unknown provider '${template_default_provider}'"
  exit 1
fi

######################
# Initialize CI/CD
######################

echo "Initializing CI/CD: $ci"
ci_script=

# aws
if [[ $ci == "aws" ]]; then
  ci_script=aws-pipelines.yml
  sed -i "s/ gcloud-ci:-local/aws-ci:-local/" taito-config.sh
  echo "NOTE: AWS CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -f aws-pipelines.yml
fi

# azure
if [[ $ci == "azure" ]]; then
  ci_script=azure-pipelines.yml
  sed -i "s/ gcloud-ci:-local/azure-ci:-local/" taito-config.sh
  echo "NOTE: Azure CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -f azure-pipelines.yml
fi

# bitbucket
if [[ $ci == "bitbucket" ]]; then
  ci_script=bitbucket-pipelines.yml
  sed -i "s/ gcloud-ci:-local/ bitbucket-ci:-local/" taito-config.sh

  # Links
  sed -i "s|^  \\* builds.*|  * builds=https://bitbucket.org/${template_default_git_organization:?}/${taito_vc_repository}/addon/pipelines/home Build logs|" taito-config.sh
  sed -i "s|^  \\* project=.*|  * project=https://bitbucket.org/${template_default_git_organization:?}/${taito_vc_repository}/addon/trello/trello-board Project management|" taito-config.sh
  # TODO: project documentation
else
  rm -f bitbucket-pipelines.yml
fi

# github
if [[ $ci == "github" ]]; then
  ci_script=.github/main.workflow
  sed -i "s/ gcloud-ci:-local/github-ci:-local/" taito-config.sh
  echo "NOTE: GitHub CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -rf .github
fi

# gitlab
if [[ $ci == "gitlab" ]]; then
  ci_script=.gitlab-ci.yml
  sed -i "s/ gcloud-ci:-local/gitlab-ci:-local/" taito-config.sh
  echo "NOTE: GitLab CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -rf .gitlab-ci.yml
fi

# gcloud
if [[ $ci == "gcloud" ]]; then
  ci_script=cloudbuild.yaml
  sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" cloudbuild.yaml
  sed -i '/_TEMPLATE_DEFAULT_/d' cloudbuild.yaml
  sed -i '/taito project create/d' cloudbuild.yaml
  sed -i '/template_default_taito_image/d' cloudbuild.yaml
  sed -i "s|_IMAGE_REGISTRY: eu.gcr.io/\$PROJECT_ID|_IMAGE_REGISTRY: ${template_default_container_registry}|" cloudbuild.yaml
else
  rm -f cloudbuild.yaml
fi

# jenkins
if [[ $ci == "jenkins" ]]; then
  ci_script=Jenkinsfile
  sed -i "s/ gcloud-ci:-local/jenkins-ci:-local/" taito-config.sh
  echo "NOTE: Jenkins CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -f Jenkinsfile
fi

# shell
if [[ $ci == "shell" ]]; then
  ci_script=build.sh
  sed -i "s/ gcloud-ci:-local//" taito-config.sh
else
  rm -f build.sh
fi

# spinnaker
if [[ $ci_deploy_with_spinnaker == "true" ]]; then
  echo "NOTE: Spinnaker CI/CD not yet implemented."
  read -r
fi

# travis
if [[ $ci == "travis" ]]; then
  ci_script=.travis.yml
  sed -i "s/ gcloud-ci:-local/travis-ci:-local/" taito-config.sh
  echo "NOTE: Travis CI/CD not yet implemented. Implement it in '${ci_script}'."
  read -r
else
  rm -f .travis.yml
fi

# common
sed -i "s/\$template_default_taito_image_username/${template_default_taito_image_username:-}/g" "${ci_script}"
sed -i "s/\$template_default_taito_image_password/${template_default_taito_image_password:-}/g" "${ci_script}"
sed -i "s/\$template_default_taito_image_email/${template_default_taito_image_email:-}/g" "${ci_script}"
sed -i "s|\$template_default_taito_image|${template_default_taito_image}|g" "${ci_script}"

##############################
# Initialize semantic-release
##############################

if [[ "${template_default_git_provider}" != "github.com" ]]; then
  echo "Disabling semantic-release for git provider '${template_default_git_provider}'"
  echo "TODO: implement semantic-release support for '${template_default_git_provider}'"
  sed -i "s/release-pre:prod\": \"semantic-release/_release-pre:prod\": \"echo DISABLED semantic-release/g" package.json
  sed -i "s/release-post:prod\": \"semantic-release/_release-post:prod\": \"echo DISABLED semantic-release/g" package.json
  sed -i '/github-buildbot/d' taito-config.sh
fi

######################
# Clean up
######################

read -t 1 -n 10000 discard || :
