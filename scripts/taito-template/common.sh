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
template_default_ci_organization=${template_default_ci_organization:-$template_default_organization}
template_default_vc_organization=${template_default_vc_organization:-$template_default_organization}
template_default_vc_url=${template_default_vc_url:-github.com/$template_default_vc_organization}
template_default_vc_provider=${template_default_vc_provider:-github}
template_default_domain=${template_default_domain:-mydomain.com}
template_default_domain_prod=${template_default_domain_prod:-$template_default_domain}
template_default_zone=${template_default_zone:-my-zone}
template_default_zone_prod=${template_default_zone_prod:-$template_default_zone}
template_default_environments=${template_default_environments:-dev prod}

template_default_kubernetes_prod=${template_default_kubernetes_prod:-$template_default_kubernetes}
template_default_zone_multi_tenant=${template_default_zone_multi_tenant:-false}
template_default_zone_multi_tenant_prod=${template_default_zone_multi_tenant:-false}

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

# Disable and simplify ingress of terraform.yaml if Kubernetes is enabled
if [[ ${template_default_kubernetes:-} ]] || [[ ${kubernetes_name:-} ]]; then
  sed -i 's/enabled: true # ingress/enabled: false/' ./scripts/terraform.yaml
  sed -i '/class: gateway/d' ./scripts/terraform.yaml
  sed -i '/createMainDomain: false/d' ./scripts/terraform.yaml
  sed -i '/# TODO: implement altDomains support/d' ./scripts/terraform.yaml
else
  sed -i 's/enabled: true # ingress/enabled: true/' ./scripts/terraform.yaml
fi

# Remove empty attributes from terraform.yaml
sed -i '/^  [^[:space:]]*:$/!b;N;/:\n$/d' ./scripts/terraform.yaml
sed -i '/^  [^[:space:]]*:$/!b;N;/:\n$/d' ./scripts/terraform-prod.yaml
sed -i '/^# END$/d' ./scripts/terraform.yaml
sed -i '/^# END$/d' ./scripts/terraform-prod.yaml
if [[ -f ./scripts/terraform-dev.yaml ]]; then
  sed -i '/^  [^[:space:]]*:$/!b;N;/:\n$/d' ./scripts/terraform-dev.yaml
  sed -i '/^# END$/d' ./scripts/terraform-dev.yaml
fi

#########################################
# Prune cloud provider specific settings
#########################################

echo "Pruning cloud provider specific settings"

# Remove AWS specific settings
if [[ $template_default_provider != "aws" ]] &&
   [[ $template_default_provider_prod != "aws" ]]; then

  if [[ -d scripts/terraform/aws ]]; then
    rm -rf scripts/terraform/aws
    rm -rf scripts/terraform/aws-deploy
  fi

  if [[ -f scripts/terraform.yaml ]]; then
    sed -i '/# For AWS/d' scripts/terraform.yaml
  fi

  if [[ -f scripts/helm.yaml ]]; then
    sed -i '/# For AWS/d' scripts/helm.yaml
  fi

  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/# For AWS/d' docker-compose-cicd.yaml
    sed -i '/AWS_/d' docker-compose-cicd.yaml
  fi
fi

# Remove Azure specific settings
if [[ $template_default_provider != "azure" ]] &&
   [[ $template_default_provider_prod != "azure" ]]; then

  if [[ -d scripts/terraform/azure ]]; then
    rm -rf scripts/terraform/azure
  fi

  if [[ -f scripts/terraform.yaml ]]; then
    sed -i '/# For Azure/d' scripts/terraform.yaml
  fi

  if [[ -f scripts/helm.yaml ]]; then
    sed -i '/# For Azure/d' scripts/helm.yaml
  fi

  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/# For Azure/d' docker-compose-cicd.yaml
    sed -i '/AZURE_/d' docker-compose-cicd.yaml
  fi

  sed -i '/-storage.accessKey1/d' scripts/taito/project.sh 2> /dev/null || :
  sed -i '/-storage.accessKey2/d' scripts/taito/project.sh 2> /dev/null || :
else
  # Use non-random bucket names on Azure
  # TODO: some configurable flag instead?
  sed -i 's/st_bucket_name="$taito_random_name-$taito_env"/st_bucket_name="$taito_project-$taito_env"/' scripts/taito/project.sh
fi

# Remove DigitalOcean specific settings
if [[ $template_default_provider != "do" ]] &&
   [[ $template_default_provider_prod != "do" ]]; then

  if [[ -d scripts/terraform/do ]]; then
    rm -rf scripts/terraform/do
  fi

  if [[ -f scripts/terraform.yaml ]]; then
    sed -i '/# For DO/d' scripts/terraform.yaml
  fi

  if [[ -f scripts/helm.yaml ]]; then
    sed -i '/# For DO/d' scripts/helm.yaml
  fi

  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/# For DO/d' docker-compose-cicd.yaml
    sed -i '/DO_/d' docker-compose-cicd.yaml
  fi
fi

# Remove GCP specific settings
if [[ $template_default_provider != "gcp" ]] &&
   [[ $template_default_provider_prod != "gcp" ]]; then

  if [[ -d scripts/terraform/gcp ]]; then
    rm -rf scripts/terraform/gcp
  fi

  if [[ -f scripts/terraform.yaml ]]; then
    sed -i '/# For GCP/d' scripts/terraform.yaml
  fi

  if [[ -f scripts/helm.yaml ]]; then
    sed -i '/# For GCP/d' scripts/helm.yaml
  fi

  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/# For GCP/d' docker-compose-cicd.yaml
    sed -i '/GOOGLE_/d' docker-compose-cicd.yaml
  fi

  sed -i '/-serviceaccount/d' scripts/taito/project.sh 2> /dev/null || :
  sed -i '/-serviceaccount/d' scripts/taito/testing.sh 2> /dev/null || :
fi

# Disable network policy for now as it doesn't work correctly (TODO: remove)
if [[ -f ./scripts/helm.yaml ]]; then
  sed -i "s/networkPolicyEnabled: true/networkPolicyEnabled: false/" ./scripts/helm.yaml
fi

# HACK: remove old cluster settings
if [[ $template_default_zone == "gcloud-temp1" ]]; then
  sed -i 's/taito_ci_namespace_id=$taito_resource_namespace/taito_ci_namespace_id=$taito_zone/' ./scripts/taito/config/main.sh
  sed -i 's/copy\/common/copy\/devops/' ./scripts/taito/config/provider.sh
  sed -i "/^    namespace: nginx-ingress/a\    oldRewritePolicy: true" scripts/helm.yaml
else
  sed -i "/# For old gcp environments/d" ./scripts/helm.yaml
fi

##############################
# Prune database SSL settings
##############################

echo "Pruning database SSL settings"

# Remove database SSL keys if they are not required
if [[ ${template_default_postgres_ssl_enabled} != "true" ]] ||
   [[ ${template_default_postgres_ssl_client_cert_enabled} != "true" ]]; then
  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/DATABASE_SSL_KEY/d' docker-compose-cicd.yaml
    sed -i '/database_ssl_key/d' docker-compose-cicd.yaml
  fi
  if [[ -f scripts/taito/testing.sh ]]; then
    sed -i '/database_ssl_key/d' scripts/taito/testing.sh
  fi
fi
if [[ ${template_default_postgres_ssl_enabled} != "true" ]] ||
   [[ ${template_default_postgres_ssl_server_cert_enabled} != "true" ]]; then
  if [[ -f docker-compose-cicd.yaml ]]; then
    sed -i '/DATABASE_SSL_CA/d' docker-compose-cicd.yaml
    sed -i '/database_ssl_ca/d' docker-compose-cicd.yaml
  fi
  if [[ -f scripts/taito/testing.sh ]]; then
    sed -i '/database_ssl_ca/d' scripts/taito/testing.sh
  fi
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
sed -i "s/taito_project=.*/taito_project=${taito_vc_repository}/g" scripts/taito/labels.sh
sed -i "s/TAITO_RESOURCE_NAMESPACE_PREFIX_SHA1SUM/$(echo "$template_default_organization_abbr-$taito_company" | sha1sum | awk '{print $1;}')/g" scripts/taito/config/main.sh

echo "Replacing template variables with the user specific settings..."
sed -i "s/\${template_default_environments}/${template_default_environments}/g" scripts/taito/project.sh
sed -i "s/\${template_default_domain_prod}/${template_default_domain_prod:-}/g" scripts/taito/env-prod.sh

mv scripts/taito/config/defaults.sh scripts/taito/config/defaults-orig.sh
envsubst < scripts/taito/config/defaults-orig.sh > scripts/taito/config/defaults.sh
rm -f scripts/taito/config/defaults-orig.sh

if [[ -f docker-compose-cicd.yaml ]]; then
  echo "Removing template settings from docker-compose-cicd.yaml..."
  sed -i '/template_default_/d' docker-compose-cicd.yaml
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
sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" bitbucket-pipelines.yml
sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" buildspec.yml

ci_scripts="buildspec.yml azure-pipelines.yml bitbucket-pipelines.yml \
  .github/workflows/pipeline.yaml .gitlab-ci.yml cloudbuild.yaml Jenkinsfile local-ci.sh \
  .travis.yml"

sed -i "s/\$template_default_taito_image_username/${template_default_taito_image_username:-}/g" ${ci_scripts}
sed -i "s/\$template_default_taito_image_password/${template_default_taito_image_password:-}/g" ${ci_scripts}
sed -i "s/\$template_default_taito_image_email/${template_default_taito_image_email:-}/g" ${ci_scripts}
sed -i "s|\$template_default_taito_image|${template_default_taito_image}|g" ${ci_scripts}

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
if [[ $ci != "local" ]] && [[ $template_default_ci_provider_prod != "local" ]]; then
  rm -f local-ci.sh
fi

# travis
if [[ $ci != "travis" ]] && [[ $template_default_ci_provider_prod != "travis" ]]; then
  rm -f .travis.yml
fi

####################################
# Remove obsolete provider scripts
####################################

echo "Removing obsolete provider scripts"

if [[ -d scripts/taito/deploy-docker-compose ]] && \
   [[ $template_default_provider != "linux" ]] && \
   [[ $template_default_provider_prod != "linux" ]]; then
  rm -rf scripts/taito/deploy-docker-compose
fi

if [[ -d scripts/taito/deploy-custom ]] && \
   [[ $template_default_provider != "custom" ]] && \
   [[ $template_default_provider_prod != "custom" ]]; then
  rm -rf scripts/taito/deploy-custom
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
