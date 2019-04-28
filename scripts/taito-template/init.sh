#!/bin/bash

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
: "${template_default_postgres:?}"
: "${template_default_storage_class:?}"

: "${template_project_path:?}"
: "${mode:?}"

${taito_setv:?}

######################
# Remove these always
######################

# Template note from README.md
sed -i "/^.*(TEMPLATE NOTE START)$/,/^.*(TEMPLATE NOTE END)$/d" README.md

# Some files and directories
rm -rf alternatives
rm -rf function
rm -f scripts/terraform/.gitignore

# Example site
rm -rf www/site
sed -i '/    - "\/service\/site\/node_modules"/d' docker-compose.yaml

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

######################
# Choose stack
######################

echo
echo "######################"
echo "#    Choose stack"
echo "######################"
echo
echo "If you are unsure, just accept the defaults."
echo

function prune () {
  local message=$1
  local name=$2
  local path=$3
  local path2=$4

  read -t 1 -n 10000 discard
  echo "$message"
  read -r confirm
  if ( [[ "$message" == *"(y/N)"* ]] && ! [[ "${confirm}" =~ ^[Yy]$ ]] ) || \
     ( [[ "$message" == *"(Y/n)"* ]] && ! [[ "${confirm}" =~ ^[Yy]*$ ]] ); then
    echo "Removing ${name}..."
    echo
    if [[ $path ]]; then
      sed -i "/^        location $path {\$/,/^        }$/d" docker-nginx.conf
    fi
    if [[ $path2 ]]; then
      sed -i "/^        location $path2 {\$/,/^        }$/d" docker-nginx.conf
    fi

    sed -i "/^  server-template-$name:\$/,/^$/d" docker-compose.yaml
    sed -i "/^  # server-template-$name:\$/,/^$/d" docker-compose.yaml
    if [[ -f docker-compose-test.yaml ]]; then
      sed -i "/^  server-template-$name-test:\$/,/^$/d" docker-compose-test.yaml
    fi
    sed -i "/^    $name:\$/,/^$/d" ./scripts/helm.yaml

    sed -i "s/ $name / /" taito-config.sh
    sed -i "/\\* $name/d" taito-config.sh
    sed -i "s/ \\/$name\\/uptimez / /" taito-config.sh

    sed -i "/:$name\":/d" package.json
    sed -i "s/install-all:$name //g" package.json
    sed -i "s/lint:$name //g" package.json
    sed -i "s/unit:$name //g" package.json
    sed -i "s/test:$name //g" package.json
    sed -i "s/\"check-deps:$name {@}\" //g" package.json
    sed -i "s/\"check-size:$name {@}\" //g" package.json

    # TODO: temporary solution. remove once using terraform v0.12
    sed -i "/^    {\\/\\*$name\\*\\/\$/,/^    }.*$/d" \
      scripts/terraform/common/gcloud/monitoring.tf

    # Prune target from CI/CD scripts
    sed -i "/^action \"artifact:$name\"/,/^}$/d" .github/main.workflow
    # TODO PRUNE .gitlab-ci.yml
    # TODO PRUNE .travis.yml
    # TODO PRUNE aws-pipelines.yml
    # TODO PRUNE azure-pipelines.yml
    sed -i "/:$name:/d" build.sh
    sed -i "/- step: # $name/,/taito artifact-push:$name/d" bitbucket-pipelines.yml
    sed -i "/REPO_NAME\\/$name:/d" cloudbuild.yaml
    sed -i "/^- id: artifact-build-$name\$/,/^$/d" cloudbuild.yaml
    sed -i "/^- id: artifact-push-$name\$/,/^$/d" cloudbuild.yaml
    # TODO PRUNE Jenkinsfile

    if [[ $name == "client" ]]; then
      sed -i "s/ \\/uptimez / /" taito-config.sh
    fi

    if [[ $name == "server" ]]; then
      sed -i "s/ \\/api\\/uptimez / /" taito-config.sh
    fi

    if [[ $name == "www" ]]; then
      sed -i "s/ \\/docs\\/uptimez / /" taito-config.sh
    fi

    if [[ $name == "database" ]]; then
      sed -i '/postgres-db/d' taito-config.sh
      sed -i '/db_/d' taito-config.sh
      sed -i '/Database/d' docker-compose.yaml
      sed -i '/DATABASE_/d' docker-compose.yaml
      sed -i '/db-/d' docker-compose.yaml
      sed -i '/DATABASE_/d' ./scripts/helm.yaml
      sed -i "/^      db:\$/,/^        proxySecret:.*$/d" ./scripts/helm.yaml
      rm -f docker-compose-test.yaml
    fi

    if [[ $name == "storage" ]]; then
      sed -i "s/service_account_enabled=true/service_account_enabled=false/" taito-config.sh
      sed -i '/storage-gateway/d' taito-config.sh
      sed -i '/gserviceaccount.key:file/d' taito-config.sh
      sed -i '/taito_storages/d' taito-config.sh
      sed -i '/S3_/d' docker-compose.yaml
      sed -i '/storage-/d' docker-compose.yaml
      sed -i '/    serviceAccount:/d' ./scripts/helm.yaml
      sed -i '/.*taito_env}-gserviceaccount.key/d' ./scripts/helm.yaml
      sed -i '/S3_/d' ./scripts/helm.yaml
    fi

    rm -rf "$name"
  fi
}

prune "WEB user interface (Y/n)?" client \\/

echo
echo "NOTE: WEB user interface is just a bunch of static files that are loaded"
echo "to a web browser. If you need some process running on server or need to"
echo "keep some secrets hidden from browser, you need API/server."
echo

prune "API/server (Y/n)?" server \\/api
prune "Relational database (Y/n)?" database
prune "Permanent object storage for files (y/N)?" storage \\/bucket \\/minio
prune "Administration GUI (y/N)?" admin \\/admin
prune "Static website (e.g. for API documentation or user guide) (y/N)?" www \\/docs
prune "GraphQL gateway (y/N)?" graphql \\/graphql
prune "Worker for background jobs (y/N)?" worker
prune "Cache for performance optimizations (y/N)?" cache
prune "Queue for background jobs or messaging (y/N)?" queue

#######################
# Replace some strings
#######################

if [[ ! ${taito_random_name} ]] || [[ ${taito_random_name} == "server-template" ]]; then
  taito_random_name="$(taito -q util-random-words: 3)"
fi
echo "Setting random name: ${taito_random_name}"
sed -i "s/^taito_random_name=.*$/taito_random_name=${taito_random_name}/" taito-config.sh

echo "Replacing git repository url"
sed -i "s|TaitoUnited/server-template.git|${taito_organization}/${taito_vc_repository}.git|g" package.json

echo "Replacing project and company names in files. Please wait..."
find . -type f -exec sed -i \
  -e "s/server_template/${taito_vc_repository_alt}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/server-template/${taito_vc_repository}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/companyname/${taito_company}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/SERVER-TEMPLATE/server-template/g" 2> /dev/null {} \;

echo "Generating unique random ports (avoid conflicts with other projects)..."
ingress_port=$(shuf -i 8000-9999 -n 1)
db_port=$(shuf -i 6000-7999 -n 1)
www_port=$(shuf -i 5000-5999 -n 1)
sed -i "s/7463/${www_port}/g" taito-config.sh docker-compose.yaml \
  TAITOLESS.md &> /dev/null
sed -i "s/6000/${db_port}/g" taito-config.sh docker-compose.yaml \
  TAITOLESS.md &> /dev/null
sed -i "s/9999/${ingress_port}/g" docker-compose.yaml taito-config.sh \
  ./admin/package.json ./client/package.json TAITOLESS.md &> /dev/null

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
sed -i "s/\${template_default_git_url:?}/${template_default_git_url//\//\\/}/g" taito-config.sh
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
sed -i "s/\${template_default_monitoring_uptime_channels_prod:-}/${template_default_monitoring_uptime_channels_prod//\//\\\/}/g" taito-config.sh
sed -i "s/\${template_default_container_registry:?}/${template_default_container_registry}/g" taito-config.sh
sed -i "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed -i "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh

# Kubernetes
sed -i \
  "s/\${template_default_kubernetes:?}/${template_default_kubernetes}/g" taito-config.sh

# Database
sed -i \
  "s/\${template_default_postgres:?}/${template_default_postgres}/g" taito-config.sh

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

echo "Removing template settings from docker-compose-test.yaml..."
sed -i '/template_default_/d' docker-compose-test.yaml

############################
# Replace provider settings
############################

echo "Configuring provider settings for ${template_default_provider}"
if [[ "${template_default_provider}" == "gcloud" ]]; then
  echo "gcloud already configured by default"
elif [[ "${template_default_provider}" == "aws" ]]; then
  sed -i "s/ gcloud-secrets:-local/ /" taito-config.sh
  sed -i "s/ gcloud:-local/ aws:-local/" taito-config.sh
  sed -i "s/ gcloud-storage:-local/ aws-storage:-local/" taito-config.sh
  sed -i "s/ gcloud-monitoring:-local/ /" taito-config.sh
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
  sed -i "s/ gcloud-ci:-local/bitbucket-ci:-local/" taito-config.sh
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
  sed -i '/template_default_taito_image/d' cloudbuild.yaml
  sed -i "s|_IMAGE_REGISTRY: eu.gcr.io/\$PROJECT_ID|_IMAGE_REGISTRY: ${template_default_container_registry}/${template_default_zone}|" cloudbuild.yaml
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
sed -i "s/\$template_default_taito_image/${template_default_taito_image}/g" "${ci_script}"

##############################
# Initialize semantic-release
##############################

if [[ "${template_default_git_provider}" != "github.com" ]]; then
  echo "Disabling semantic-release for git provider '${template_default_git_provider}'"
  echo "TODO: implement semantic-release support for '${template_default_git_provider}'"
  sed -i "s/prod\": \"semantic-release/prod\": \"echo DISABLED semantic-release/g" package.json
fi

######################
# Clean up
######################

echo "Cleaning up"
rm -f temp

read -t 1 -n 10000 discard

echo init done
