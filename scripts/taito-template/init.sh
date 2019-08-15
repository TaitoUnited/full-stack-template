#!/bin/bash -e
: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"

${taito_setv:-}

# Function not supported yet
rm -rf function
sed -i "s/ function / /" taito-config.sh
sed -i "s/ function / /" taito-project-config.sh

# Remote the example site
rm -rf www/site
sed -i '/\/site\/node_modules" # FOR GATSBY ONLY/d' docker-compose.yaml
sed -i '/\/site\/node_modules" # FOR GATSBY ONLY/d' docker-compose-remote.yaml

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

  echo
  read -r -t 1 -n 1000 || :
  read -p "$message" -n 1 -r confirm
  if ( [[ "$message" == *"[y/N]"* ]] && ! [[ "${confirm}" =~ ^[Yy]$ ]] ) || \
     ( [[ "$message" == *"[Y/n]"* ]] && ! [[ "${confirm}" =~ ^[Yy]*$ ]] ); then
    echo
    echo "  Removing ${name}..."
    if [[ $path ]]; then
      sed -i "/^        location $path {\$/,/^        }$/d" docker-nginx.conf
    fi
    if [[ $path2 ]]; then
      sed -i "/^        location $path2 {\$/,/^        }$/d" docker-nginx.conf
    fi

    sed -i "/^  full-stack-template-$name:\$/,/^$/d" docker-compose.yaml
    sed -i "/^  full-stack-template-$name:\$/,/^$/d" docker-compose-remote.yaml
    sed -i "/^  # full-stack-template-$name:\$/,/^$/d" docker-compose.yaml
    sed -i "/^  # full-stack-template-$name:\$/,/^$/d" docker-compose-remote.yaml
    if [[ -f docker-compose-test.yaml ]]; then
      sed -i "/^  full-stack-template-$name-test:\$/,/^$/d" docker-compose-test.yaml
      sed -i "/^  # full-stack-template-$name-test:\$/,/^$/d" docker-compose-test.yaml
    fi
    sed -i "/^    $name:\$/,/^$/d" ./scripts/helm.yaml

    sed -i "s/ $name / /" taito-config.sh
    sed -i "s/ $name / /" taito-project-config.sh
    sed -i "s/ \\/$name\\/uptimez / /" taito-config.sh
    sed -i "s/ \\/$name\\/uptimez / /" taito-project-config.sh

    sed -i "/\\* $name/d" taito-project-config.sh
    sed -i "/test_$name/d" taito-testing-config.sh

    sed -i "/:$name\":/d" package.json
    sed -i "s/install-all:$name //g" package.json
    sed -i "s/lint:$name //g" package.json
    sed -i "s/unit:$name //g" package.json
    sed -i "s/test:$name //g" package.json
    sed -i "s/\\\\\"check-deps:$name {@}\\\\\" //g" package.json
    sed -i "s/\\\\\"check-size:$name {@}\\\\\" //g" package.json
    sed -i "s/ && npm run clean:$name//g" package.json

    # Prune target from CI/CD scripts
    sed -i "/^action \"artifact:$name\"/,/^}$/d" .github/main.workflow
    # TODO PRUNE .gitlab-ci.yml
    # TODO PRUNE .travis.yml
    # TODO PRUNE aws-pipelines.yml
    # TODO PRUNE azure-pipelines.yml
    sed -i "/:$name:/d" local-ci.sh
    sed -i "/- step: # $name prepare/,/$name-tester.docker/d" bitbucket-pipelines.yml
    sed -i "/- step: # $name release/,/taito artifact release:$name/d" bitbucket-pipelines.yml
    sed -i "/REPO_NAME\\/$name:/d" cloudbuild.yaml
    sed -i "/^- id: artifact-prepare-$name\$/,/^$/d" cloudbuild.yaml
    # TODO PRUNE Jenkinsfile

    if [[ $name == "client" ]]; then
      sed -i "s/ \\/uptimez / /" taito-config.sh
      sed -i "s/ \\/uptimez / /" taito-project-config.sh
      sed -i "/CYPRESS/d" taito-testing-config.sh
      sed -i "/cypress/d" taito-testing-config.sh
    fi

    if [[ $name == "server" ]]; then
      sed -i "s/ \\/api\\/uptimez / /" taito-config.sh
      sed -i "s/ \\/api\\/uptimez / /" taito-project-config.sh
      sed -i "s/ \\/api\\/docs / /" taito-config.sh
      sed -i "s/ \\/api\\/docs / /" taito-project-config.sh
      sed -i '/* apidocs/d' taito-project-config.sh
    fi

    if [[ $name == "kafka" ]]; then
      sed -i "/KAFKA/d" docker-compose.yaml
      sed -i "/KAFKA/d" docker-compose-remote.yaml
      sed -i "/KAFKA/d" ./scripts/helm.yaml

      # Remove also Zookeeper
      sed -i "s/ zookeeper / /" taito-config.sh
      sed -i "s/ zookeeper / /" taito-project-config.sh
      sed -i "/^  full-stack-template-zookeeper:\$/,/^$/d" docker-compose.yaml
      sed -i "/^  full-stack-template-zookeeper:\$/,/^$/d" docker-compose-remote.yaml
      sed -i "/^  # full-stack-template-zookeeper:\$/,/^$/d" docker-compose.yaml
      sed -i "/^  # full-stack-template-zookeeper:\$/,/^$/d" docker-compose-remote.yaml
      sed -i "/^    zookeeper:\$/,/^$/d" ./scripts/helm.yaml
    fi

    if [[ $name == "www" ]]; then
      sed -i "s/ \\/docs\\/uptimez / /" taito-config.sh
      sed -i "s/ \\/docs\\/uptimez / /" taito-project-config.sh
    fi

    if [[ $name == "database" ]]; then
      sed -i '/postgres-db/d' taito-config.sh
      sed -i '/db_/d' taito-config.sh
      sed -i '/db_/d' taito-project-config.sh
      sed -i "/DATABASE/d" taito-testing-config.sh
      sed -i '/Database/d' docker-compose.yaml
      sed -i '/Database/d' docker-compose-remote.yaml
      sed -i '/DATABASE_/d' docker-compose.yaml
      sed -i '/DATABASE_/d' docker-compose-remote.yaml
      sed -i '/db_/d' docker-compose.yaml
      sed -i '/db_/d' docker-compose-remote.yaml
      sed -i '/DATABASE_/d' ./scripts/helm.yaml
      sed -i "/^      db:\$/,/^        proxySecret:.*$/d" ./scripts/helm.yaml
      rm -f docker-compose-test.yaml
    fi

    if [[ $name == "storage" ]]; then
      # Remove storage from configs
      sed -i "s/service_account_enabled=true/service_account_enabled=false/" taito-config.sh
      sed -i '/storage-gateway/d' taito-config.sh
      sed -i '/taito_storages/d' taito-config.sh
      sed -i '/* storage/d' taito-config.sh
      sed -i '/storage/d' taito-project-config.sh
      sed -i '/S3_/d' docker-compose.yaml
      sed -i '/S3_/d' docker-compose-remote.yaml
      sed -i '/storage-/d' docker-compose.yaml
      sed -i '/storage-/d' docker-compose-remote.yaml
      sed -i '/S3_/d' ./scripts/helm.yaml

      # Remove storage from server implementation
      sed -i '/aws-sdk/d' ./server/package.json
      sed -i '/storage/d' ./server/src/server.ts
      sed -i '/storage/d' ./server/src/infra/InfraRouter.ts
      rm -f ./server/src/common/storage.ts
    fi

    rm -rf "$name"
  else
    if [[ $name == "kafka" ]]; then
      echo
      read -r -t 1 -n 1000 || :
      read -p "Use external Kafka cluster? [Y/n] " -n 1 -r confirm
      if [[ ${confirm} =~ ^[Yy]*$ ]]; then
        sed -i "s/KAFKA_HOST:.*$/KAFKA_HOST: kafka.kafka.svc.cluster.local/g" \
          ./scripts/helm.yaml
        sed -i "/^    $name:\$/,/^$/d" ./scripts/helm.yaml
        sed -i "/^    zookeeper:\$/,/^$/d" ./scripts/helm.yaml

        sed -i "/^  full-stack-template-kafka:\$/,/^$/d" docker-compose-remote.yaml
        sed -i "/^  # full-stack-template-kafka:\$/,/^$/d" docker-compose-remote.yaml
        sed -i "/^  full-stack-template-zookeeper:\$/,/^$/d" docker-compose-remote.yaml
        sed -i "/^  # full-stack-template-zookeeper:\$/,/^$/d" docker-compose-remote.yaml
      fi
    fi
  fi
}

prune "WEB user interface? [Y/n] " client \\/
prune "Administration GUI? [y/N] " admin \\/admin
prune "Static website (e.g. for API documentation or user guide)? [y/N] " www \\/docs

echo
echo "NOTE: WEB user interface is just a bunch of static files that are loaded"
echo "to a web browser. If you need some process running on server or need to"
echo "keep some secrets hidden from browser, you need API/server."
echo

prune "API/services? [Y/n] " server \\/api
prune "GraphQL gateway? [y/N] " graphql \\/graphql
prune "Kafka for event-based streaming/queuing? [y/N] " kafka
prune "Redis (e.g. as in-memory cache)? [y/N] " redis
prune "Worker for background jobs? [y/N] " worker
prune "Relational database? [Y/n] " database
prune "Permanent object storage for files? [y/N] " storage \\/bucket \\/minio

echo
echo "Replacing project and company names in files. Please wait..."
find . -type f -exec sed -i \
  -e "s/full_stack_template/${taito_vc_repository_alt}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/full-stack-template/${taito_vc_repository}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/companyname/${taito_company}/g" 2> /dev/null {} \;
find . -type f -exec sed -i \
  -e "s/FULL-STACK-TEMPLATE/full-stack-template/g" 2> /dev/null {} \;

echo "Generating unique random ports (avoid conflicts with other projects)..."
if [[ ! $ingress_port ]]; then ingress_port=$(shuf -i 8000-9999 -n 1); fi
if [[ ! $db_port ]]; then db_port=$(shuf -i 6000-7999 -n 1); fi
if [[ ! $www_port ]]; then www_port=$(shuf -i 5000-5999 -n 1); fi
sed -i "s/7463/${www_port}/g" taito-config.sh docker-compose.yaml \
  TAITOLESS.md www/README.md &> /dev/null || :
sed -i "s/6000/${db_port}/g" taito-config.sh docker-compose.yaml \
  TAITOLESS.md &> /dev/null || :
sed -i "s/9999/${ingress_port}/g" taito-config.sh docker-compose.yaml \
  TAITOLESS.md &> /dev/null || :

./scripts/taito-template/common.sh
echo init done
