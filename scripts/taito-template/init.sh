#!/bin/bash -e
: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"
: "${mode:?}"

${taito_setv:?}

# Remove some files and directories
rm -rf alternatives
rm -rf function

# Remote the example site
rm -rf www/site
sed -i '/    - "\/service\/site\/node_modules"/d' docker-compose.yaml

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

  read -t 1 -n 10000 discard || :
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
    sed -i "/- step: # $name prepare/,/$name-tester.docker/d" bitbucket-pipelines.yml
    sed -i "/- step: # $name release/,/taito artifact-release:$name/d" bitbucket-pipelines.yml
    sed -i "/REPO_NAME\\/$name:/d" cloudbuild.yaml
    sed -i "/^- id: artifact-prepare-$name\$/,/^$/d" cloudbuild.yaml
    # TODO PRUNE Jenkinsfile

    if [[ $name == "client" ]]; then
      sed -i "s/ \\/uptimez / /" taito-config.sh
    fi

    if [[ $name == "server" ]]; then
      sed -i "s/ \\/api\\/uptimez / /" taito-config.sh
      sed -i "s/ \\/api\\/docs / /" taito-config.sh
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
  ./admin/package.json ./client/package.json TAITOLESS.md &> /dev/null || :

./scripts/taito-template/common.sh
echo init done
