#!/bin/bash

: "${taito_organization:?}"
: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"

: "${template_default_taito_image:?}"
: "${template_default_organization:?}"
: "${template_default_organization_abbr:?}"
: "${template_default_github_organization:?}"
: "${template_default_sentry_organization:?}"
: "${template_default_domain:?}"
: "${template_default_domain_prod:?}"
: "${template_default_zone:?}"
: "${template_default_zone_prod:?}"
: "${template_default_provider:?}"
: "${template_default_provider_org_id:?}"
: "${template_default_provider_org_id_prod:?}"
: "${template_default_provider_region:?}"
: "${template_default_provider_region_prod:?}"
: "${template_default_provider_zone:?}"
: "${template_default_provider_zone_prod:?}"
: "${template_default_monitoring_uptime_channels_prod:-}"
: "${template_default_registry:?}"
: "${template_default_source_git:?}"
: "${template_default_dest_git:?}"
: "${template_default_kubernetes:?}"
: "${template_default_postgres:?}"

: "${template_project_path:?}"
: "${mode:?}"

${taito_setv:?}

######################
# Remove these always
######################

# Template note from README.md
sed -i "/^.*(TEMPLATE NOTE START)$/,/^.*(TEMPLATE NOTE END)$/d" README.md

# Some directories
rm -rf alternatives
rm -rf function

# Example site
rm -rf www/site
sed -i '/    - "\/service\/site\/node_modules"/d' docker-compose.yaml

# 'TODO links'
sed -i '/https:\/\/TODO/d' taito-config.sh

# MIT license
# TODO leave a reference to the original?
rm LICENSE

######################
# Choose stack
######################

echo
echo "--------------------"
echo "-   Choose stack   -"
echo "--------------------"
echo "NOTE: If you are unsure, just accept the defaults."
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

    sed -i "/REPO_NAME\\/$name:/d" cloudbuild.yaml
    sed -i "/^- id: artifact-build-$name\$/,/^$/d" cloudbuild.yaml
    sed -i "/^- id: artifact-push-$name\$/,/^$/d" cloudbuild.yaml

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

    sed -i "/^    {\\/\\*$name\\*\\/\$/,/^    }.*$/d" \
      scripts/terraform/gcloud/monitoring.tf

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
sed -i "s/\${template_default_organization:?}/${template_default_organization}/g" taito-config.sh
sed -i "s/\${template_default_organization_abbr:?}/${template_default_organization_abbr}/g" taito-config.sh
sed -i "s/\${template_default_github_organization:?}/${template_default_github_organization}/g" taito-config.sh
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
sed -i "s/\${template_default_registry:?}/${template_default_registry}/g" taito-config.sh
sed -i "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed -i "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh
sed -i \
  "s/\${template_default_kubernetes:?}/${template_default_kubernetes}/g" taito-config.sh
sed -i \
  "s/\${template_default_postgres:?}/${template_default_postgres}/g" taito-config.sh

echo "Removing template settings from cloudbuild.yaml..."
sed -i "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" cloudbuild.yaml
sed -i '/_TEMPLATE_DEFAULT_/d' cloudbuild.yaml
sed -i '/template_default_taito_image/d' cloudbuild.yaml
sed -i "s|_IMAGE_REGISTRY: eu.gcr.io/\$PROJECT_ID|_IMAGE_REGISTRY: ${template_default_registry}/${template_default_zone}|" cloudbuild.yaml

echo "Removing template settings from docker-compose-test.yaml..."
sed -i '/template_default_/d' docker-compose-test.yaml

rm -f temp

read -t 1 -n 10000 discard

echo init done
