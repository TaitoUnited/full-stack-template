#!/bin/bash -e
: "${taito_company:?}"
: "${taito_vc_repository:?}"
: "${taito_vc_repository_alt:?}"

if [[ ${taito_verbose:-} == "true" ]]; then
  set -x
fi

# Remove the example site
rm -rf www/site
sed -i '/\/site\/node_modules" # FOR GATSBY ONLY/d' docker-compose.yaml
sed -i '/\/site\/node_modules" # FOR GATSBY ONLY/d' docker-compose-remote.yaml

# Determine project short name
if [[ $taito_project_short != "fstemplate" ]]; then
  taito_project_short="${taito_project_short}"
else
  taito_project_short="${taito_vc_repository}"
fi
taito_project_short="${taito_project_short//-/}"
if [[ ! ${taito_project_short} ]] || \
   [[ "${#taito_project_short}" -lt 5 ]] || \
   [[ "${#taito_project_short}" -gt 10 ]] || \
   [[ ! "${taito_project_short}" =~ ^[a-zA-Z0-9]*$ ]]; then
  echo "Give a short version of the project name '${taito_vc_repository}'."
  echo "It should be unique but also descriptive as it might be used"
  echo "as a database name and as a database username for some databases."
  echo "No special characters."
  echo
  export taito_project_short=""
  while [[ ! ${taito_project_short} ]] || \
    [[ "${#taito_project_short}" -lt 5 ]] || \
    [[ "${#taito_project_short}" -gt 10 ]] || \
    [[ ! "${taito_project_short}" =~ ^[a-zA-Z0-9]*$ ]]
  do
    echo "Short project name (5-10 characters)?"
    read -r taito_project_short
  done
fi

echo
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

  local terraform_name=$name
  if [[ $terraform_name == "storage" ]]; then
    terraform_name=bucket
  fi

  echo
  read -r -t 1 -n 1000 || :
  read -p "$message" -n 1 -r confirm
  if ( [[ "$message" == *"[y/N]"* ]] && ! [[ "${confirm}" =~ ^[Yy]$ ]] ) || \
     ( [[ "$message" == *"[Y/n]"* ]] && ! [[ "${confirm}" =~ ^[Yy]*$ ]] ); then
    echo
    echo "  Removing ${name}..."
    if [[ $path ]]; then
      sed -i "/^        location $path {\r*\$/,/^        }\r*$/d" docker-nginx.conf
    fi
    if [[ $path2 ]]; then
      sed -i "/^        location $path2 {\r*\$/,/^        }\r*$/d" docker-nginx.conf
    fi

    sed -i "/^  full-stack-template-$name:\r*\$/,/^\r*$/d" docker-compose.yaml
    sed -i "/^  full-stack-template-\${taito_env}-$name:\r*\$/,/^\r*$/d" docker-compose-remote.yaml
    sed -i "/^  # full-stack-template-$name:\r*\$/,/^\r*$/d" docker-compose.yaml
    sed -i "/^  # full-stack-template-\${taito_env}-$name:\r*\$/,/^\r*$/d" docker-compose-remote.yaml
    if [[ -f docker-compose-cicd.yaml ]]; then
      sed -i "/^  full-stack-template-$name-cicd:\r*\$/,/^\r*$/d" docker-compose-cicd.yaml
      sed -i "/^  # full-stack-template-$name-cicd:\r*\$/,/^\r*$/d" docker-compose-cicd.yaml
    fi
    sed -i "/^    $name:\r*\$/,/^\r*$/d" ./scripts/helm.yaml
    sed -i "/-$name$/d" ./scripts/helm.yaml
    sed -i "/^    $terraform_name:\r*\$/,/^\r*$/d" ./scripts/terraform.yaml
    sed -i "/-$terraform_name$/d" ./scripts/terraform.yaml
    if [[ -f ./scripts/terraform-dev.yaml ]]; then
      sed -i "/^    $terraform_name:\r*\$/,/^\r*$/d" ./scripts/terraform-dev.yaml
      sed -i "/-$terraform_name$/d" ./scripts/terraform-dev.yaml
    fi

    sed -i "s/ $name / /" scripts/taito/project.sh
    sed -i "s/ \\/$name\\/uptimez / /" scripts/taito/project.sh

    sed -i "/\\* $name/d" scripts/taito/project.sh
    sed -i "/test_$name/d" scripts/taito/testing.sh

    sed -i "/:$name\":/d" package.json
    sed -i "s/install-all:$name //g" package.json
    sed -i "s/generate:$name //g" package.json
    sed -i "s/taito-host-lint:$name //g" package.json
    sed -i "s/taito-host-unit:$name //g" package.json
    sed -i "s/taito-host-test:$name //g" package.json
    sed -i "s/lint:$name //g" package.json
    sed -i "s/unit:$name //g" package.json
    sed -i "s/test:$name //g" package.json
    sed -i "s/\\\\\"dep-check:$name {@}\\\\\" //g" package.json
    sed -i "s/\\\\\"size-check:$name {@}\\\\\" //g" package.json
    sed -i "s/ && npm run clean:$name//g" package.json

    # Prune target from CI/CD scripts
    sed -i "/taito artifact prepare:$name/d" .github/workflows/pipeline.yaml
    sed -i "/taito artifact release:$name/d" .github/workflows/pipeline.yaml
    sed -i "/taito artifact prepare:$name/d" azure-pipelines.yml
    sed -i "/taito artifact release:$name/d" azure-pipelines.yml
    sed -i "/- step: # $name prepare/,/$name-tester.docker/d" bitbucket-pipelines.yml
    sed -i "/- step: # $name release/,/taito artifact release:$name/d" bitbucket-pipelines.yml
    sed -i "/taito artifact prepare:$name/d" buildspec.yml
    sed -i "/taito artifact release:$name/d" buildspec.yml
    sed -i "/^\s*- id: artifact-prepare-$name\r*\$/,/^\r*$/d" cloudbuild.yaml
    sed -i "/^\s*- id: artifact-release-$name\r*\$/,/^\r*$/d" cloudbuild.yaml
    sed -i "/REPO_NAME\\/$name:/d" cloudbuild.yaml
    # TODO PRUNE .gitlab-ci.yml
    # TODO PRUNE Jenkinsfile
    sed -i "/:$name:/d" local-ci.sh
    # TODO PRUNE .travis.yml

    if [[ $name == "client" ]]; then
      sed -i "s/ \\/uptimez / /" scripts/taito/project.sh
      sed -i "/CYPRESS/d" scripts/taito/testing.sh
      sed -i "/cypress/d" scripts/taito/testing.sh
    fi

    if [[ $name == "server" ]]; then
      sed -i "s/ \\/api\\/uptimez / /" scripts/taito/project.sh
      sed -i "s/ \\/api\\/docs / /" scripts/taito/project.sh
      sed -i '/* apidocs/d' scripts/taito/project.sh
    fi

    if [[ $name == "www" ]]; then
      sed -i '/www-site/d' package.json
      sed -i "s/ \\/docs\\/uptimez / /" scripts/taito/project.sh
    fi

    if [[ $name == "database" ]]; then
      sed -i '/postgres-db/d' scripts/taito/project.sh
      sed -i '/db_/d' scripts/taito/project.sh
      sed -i "/DATABASE/d" scripts/taito/testing.sh
      sed -i '/Database/d' docker-compose.yaml
      sed -i '/Database/d' docker-compose-remote.yaml
      sed -i '/DATABASE_/d' docker-compose.yaml
      sed -i '/DATABASE_/d' docker-compose-remote.yaml
      sed -i '/db_/d' docker-compose.yaml
      sed -i '/db_/d' docker-compose-remote.yaml
      sed -i '/DATABASE_/d' ./scripts/helm.yaml
      sed -i "/^      db:\r*\$/,/^\r*        proxySecret:.*$/d" ./scripts/helm.yaml
      rm -f docker-compose-cicd.yaml

      # Remove database from server implementation
      # TODO: works only for the default Node.js server implementation
      if [[ -d ./server ]] && [[ -f ./server/src/server.ts ]]; then
        sed -i '/pg-promise/d' ./server/package.json &> /dev/null || :
        sed -i '/types\\pg/d' ./server/package.json &> /dev/null || :
        sed -i '/db/d' ./server/src/server.ts &> /dev/null || :
        sed -i '/Db/d' ./server/src/common/setup/types.ts &> /dev/null || :
        sed -i '/Database/d' ./server/src/common/setup/types.ts &> /dev/null || :
        sed -i '/state.tx/d' ./server/src/infra/InfraRouter.ts &> /dev/null || :
        rm -f ./server/src/common/setup/db.ts &> /dev/null || :
      fi
    fi

    if [[ $name == "redis" ]]; then
      sed -i '/-redis/d' scripts/taito/project.sh
      sed -i '/-redis/d' docker-compose.yaml
      sed -i '/-redis/d' docker-compose-remote.yaml
      sed -i '/-redis/d' ./scripts/helm.yaml
      sed -i '/REDIS_/d' docker-compose.yaml
      sed -i '/REDIS_/d' docker-compose-remote.yaml
      sed -i '/REDIS_/d' ./scripts/helm.yaml

      # Remove redis from server implementation
      # TODO: works only for the default Node.js server implementation
      if [[ -f ./server/src/common/setup/config.ts ]]; then
        sed -i '/Redis/d' ./server/src/common/setup/config.ts &> /dev/null || :
        sed -i '/REDIS_/d' ./server/src/common/setup/config.ts &> /dev/null || :
        sed -i '/6379/d' ./server/src/common/setup/config.ts &> /dev/null || :
      fi
    fi

    if [[ $name == "storage" ]]; then
      # Remove storage from configs
      sed -i "s/clean:storage //" package.json
      sed -i "s/ bucket / /" scripts/taito/project.sh
      sed -i '/storage/d' scripts/taito/project.sh
      sed -i '/st_bucket_name/d' scripts/taito/project.sh
      sed -i '/BUCKET_/d' docker-compose.yaml
      sed -i '/BUCKET_/d' docker-compose-remote.yaml
      sed -i '/storage/d' docker-compose.yaml
      sed -i '/storage/d' docker-compose-remote.yaml
      sed -i '/BUCKET_/d' ./scripts/helm.yaml
      sed -i '/-storage/d' ./scripts/terraform.yaml
      rm -f ./scripts/terraform-dev.yaml

      # Remove storage from server implementation
      # TODO: works only for the default Node.js server implementation
      if [[ -d ./server ]] && [[ -f ./server/src/server.ts ]]; then
        if [[ ${taito_provider} != "aws" ]]; then
          sed -i '/aws-sdk/d' ./server/package.json &> /dev/null || :
        fi
        sed -i '/storage/d' ./server/src/server.ts &> /dev/null || :
        sed -i '/storage/d' ./server/src/common/setup/types.ts &> /dev/null || :
        sed -i '/Storage/d' ./server/src/common/setup/config.ts &> /dev/null || :
        sed -i '/BUCKET_/d' ./server/src/common/setup/config.ts &> /dev/null || :
        sed -i '/storage/d' ./server/src/infra/InfraRouter.ts &> /dev/null || :
        sed -i '/storage/d' ./server/src/types/koa.d.ts &> /dev/null || :
        rm -f ./server/src/common/setup/storage.ts &> /dev/null || :
      fi
    fi

    rm -rf "$name"
  else
    # Remove target from terraform.yaml if Kubernetes is enabled
    if [[ "admin client redis server worker www" == *"$terraform_name"* ]] && (
         [[ ${template_default_kubernetes:-} ]] ||
         [[ ${kubernetes_name:-} ]]
       ); then
      sed -i "/^    $terraform_name:\r*\$/,/^\r*$/d" ./scripts/terraform.yaml

      # Leave the uptime path and container type however
      if [[ "admin client server www" == *"$terraform_name"* ]]; then
        path_f="${path//\\/}"
        echo -e "    $terraform_name:\n      type: container\n      uptimePath: ${path_f%/}/uptimez\n" >> scripts/terraform.yaml
      fi
    fi

    if [[ $name == "www" ]]; then
      read -r -t 1 -n 1000 || :
      echo
      echo
      echo "Choose static website path depending on purpose:"
      echo "1) User guides or documentation: /docs"
      echo "2) Main website: /"
      echo "3) Miscellanous usage: /www"
      echo "*) Other: type the path yourself (e.g. /mypath)"
      echo
      www_path=
      while [[ "${www_path}" != "/"* ]]; do
        echo -n "Your choice: "
        read -r www_choice
        www_path="${www_choice}"
        if [[ ${www_path} == "1" ]]; then
          www_path="/docs"
        elif [[ ${www_path} == "2" ]]; then
          www_path="/"
        elif [[ ${www_path} == "3" ]]; then
          www_path="/www"
        fi
      done

      sed -i "s/\\/api\\/docs/\\/api\\/docz/g" scripts/taito/project.sh
      if [[ ${www_path} == "/" ]]; then
        sed -i '/Remove \/docs from path/d' docker-nginx.conf
        sed -i '/rewrite \^\/docs\//d' docker-nginx.conf
        sed -i "s/path: \\/docs/path:/g" scripts/helm.yaml
        sed -i "s/\\/docs//g" scripts/taito/project.sh
        sed -i "s/\\/docs/\\//g" docker-nginx.conf docker-*.yaml
      elif [[ ${www_path} != "/docs" ]]; then
        www_path_escaped="${www_path//\//\\\/}"
        sed -i "s/path: \\/docs/path: ${www_path_escaped}/g" scripts/helm.yaml
        sed -i "s/\\/docs/${www_path_escaped}/g" scripts/taito/project.sh
        sed -i "s/\\/docs/${www_path_escaped}/g" docker-nginx.conf docker-*.yaml
      fi
      sed -i "s/\\/api\\/docz/\\/api\\/docs/g" scripts/taito/project.sh
    fi

    if [[ $name == "database" ]]; then
      echo
      read -r -t 1 -n 1000 || :
      echo "The example implementation supports PostgreSQL only, but you can"
      echo "also choose MySQL."
      read -p "Use MySQL instead of Postgres? [y/N] " -n 1 -r confirm
      if [[ ${confirm} =~ ^[Yy]$ ]]; then
        sed -i "s/taito_default_db_type=pg/taito_default_db_type=mysql/" \
          scripts/taito/defaults.sh
        sed -i "s/postgres-db/mysql-db/" scripts/taito/project.sh
        sed -i "s/pg/mysql/g" database/sqitch.conf
        sed -i "s/_app/a/g" database/sqitch.conf
        sed -i "s/full_stack_template_local/${taito_project_short}local/g" \
          database/sqitch.conf
        sed -i "/CREATE EXTENSION/d" database/db.sql
        sed -i "s/5432/3306/g" database/sqitch.conf
        sed -i "s/5432/3306/g" *.yaml
        sed -i 's/image: postgres:.*/image: mysql:8/g' docker-*.yaml
        sed -i "s/POSTGRES_DB/MYSQL_DATABASE/g" docker-*.yaml
        sed -i "s/POSTGRES_USER/MYSQL_USER/g" docker-*.yaml
        sed -i "s/POSTGRES_PASSWORD_FILE/MYSQL_PASSWORD_FILE/g" docker-*.yaml
        rm -f database/sqitch-init.sql
      else
        sed -i '/MYSQL_/d' docker-*.yaml
        sed -i "/DATABASE_MGR_PASSWORD/d" docker-compose-remote.yaml
        sed -i "/db_database_mgr_secret/d" docker-compose-remote.yaml
      fi
    fi

    if [[ $name == "storage" ]] && [[ ${taito_provider} != "azure" ]]; then
      # Remove minio proxy
      sed -i "/^    storage:\r*\$/,/^\r*$/d" ./scripts/helm.yaml
    fi

    if [[ $name == "storage" ]] && [[ ${taito_provider} == "aws" ]]; then
      # Remove S3 endpoint
      sed -i '/BUCKET_ENDPOINT/d' ./scripts/helm.yaml
    fi

    # For Django
    if [[ $name == "server" ]] && [[ -f ./server/src/manage.py ]]; then
      # Use trailing slash with Django
      sed -i 's|/api/uptimez|/api/uptimez/|g' ./scripts/taito/project.sh
      sed -i 's|/api/uptimez|/api/uptimez/|g' ./scripts/terraform.yaml
      sed -i '/^    server:/a\      livenessPath: /healthz/' scripts/helm.yaml

      # Add Django secret key
      sed -i '/^taito_secrets="/a\  $taito_project-$taito_env-django.secretKey:random-50' scripts/taito/project.sh
      sed -i '/^        EXAMPLE_SECRET:/a\        DJANGO_SECRET_KEY: ${taito_project}-${taito_env}-django.secretKey' scripts/helm.yaml
      sed -i '/^      - EXAMPLE_SECRET/a\      - DJANGO_SECRET_KEY' docker-compose.yaml
      sed -i '/^    file: .\/secrets\/${taito_env}\/${taito_project}-${taito_env}-example.secret/a\  DJANGO_SECRET_KEY:\n    file: .\/secrets\/${taito_env}\/${taito_project}-${taito_env}-django.secretKey' docker-compose.yaml
    fi
  fi
}

prune "Web user interface? [Y/n] " client \\/
prune "Separate admin GUI in addition to the web user interface? [y/N] " admin \\/admin
prune "Separate static website (for marketing, API docs, etc.)? [y/N] " www \\/docs
prune "Server (backend)? [Y/n] " server \\/api
echo
echo "NOTE: Often you don't need a separate worker since you can use the server implementation for jobs also."
prune "Separate worker in addition to server? [y/N] " worker
prune "Relational database? [Y/n] " database
prune "Permanent object storage for files? [y/N] " storage \\/minio
prune "Redis for caching and/or queueing? [y/N] " redis

function remove_empty_secrets () {
  sed -i -n '1h;1!H;${g;s/    secrets:\n    environment:/    environment:/;p;}' "$1"
}

remove_empty_secrets docker-compose.yaml
if [[ -f docker-compose-cicd.yaml ]]; then
  remove_empty_secrets docker-compose-cicd.yaml
fi
if [[ -f docker-compose-remote.yaml ]]; then
  remove_empty_secrets docker-compose-remote.yaml
fi

if [[ ${template_default_kubernetes} ]] || [[ ${kubernetes_name} ]]; then
  # Remove serverless-http adapter since Kubernetes is enabled
  if [[ -d ./server ]] && [[ -f ./server/src/server.ts ]]; then
    sed -i '/serverless/d' ./server/package.json
    sed -i '/serverless/d' ./server/src/function.ts
  fi

else
  # Remove helm.yaml since kubernetes is disabled
  rm -f ./scripts/helm*.yaml

  if [[ ${taito_provider} == "aws" ]]; then
    # Use aws policy instead of service account
    sed -i '/SERVICE_ACCOUNT_KEY/d' ./scripts/terraform.yaml
    sed -i '/id: ${taito_project}-${taito_env}-server/d' ./scripts/terraform.yaml
    sed -i '/-storage-serviceaccount/d' ./scripts/taito/project.sh
    sed -i '/-storage.accessKeyId/d' ./scripts/taito/project.sh
    sed -i '/-storage.secretKey/d' ./scripts/taito/project.sh
  else
    # Use service account instead of aws policy
    sed -i "/^      awsPolicy:\r*\$/,/^\r*$/d" ./scripts/terraform.yaml
    sed -i '/BUCKET_REGION/d' ./scripts/terraform.yaml
  fi

  # Remove storage service account
  # (most likely not required for storage access with serverless)
  sed -i '/$taito_project-$taito_env-storage/d' ./scripts/taito/project.sh
  sed -i '/-storage/d' ./scripts/terraform.yaml
fi

if [[ ${taito_provider} != "aws" ]]; then
  # Remove AWS specific stuff from implementation
  if [[ -d ./server ]] && [[ -f ./server/src/common/setup/config.ts ]]; then
    sed -i '/aws/d' ./server/src/common/setup/config.ts
    sed -i '/prettier-ignore/d' ./server/src/common/setup/config.ts
  fi
fi

echo
echo "Replacing project and company names in files. Please wait..."
find . -type f -exec sed -i \
  -e "s/fstemplate/${taito_project_short}/g" 2> /dev/null {} \;
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
if [[ ! $server_debug_port ]]; then server_debug_port=$(shuf -i 4000-4999 -n 1); fi
if [[ ! $client_free_port ]]; then client_free_port=$(shuf -i 3000-3990 -n 1); fi
if [[ ! $storage_port ]]; then storage_port=$(shuf -i 2000-2999 -n 1); fi
if [[ ! $uikit_port ]]; then uikit_port=$(shuf -i 1000-1999 -n 1); fi
sed -i "s/6006/${uikit_port}/g" \
  client/package.json &> /dev/null || :
sed -i "s/8888/${storage_port}/g" \
  docker-compose.yaml \
  scripts/taito/env-local.sh \
  scripts/taito/TAITOLESS.md &> /dev/null || :
sed -i "s/9996/$((client_free_port+0))/g" \
  docker-compose.yaml &> /dev/null || :
sed -i "s/9997/$((client_free_port+1))/g" \
  docker-compose.yaml &> /dev/null || :
sed -i "s/9998/$((client_free_port+2))/g" \
  docker-compose.yaml &> /dev/null || :
sed -i "s/4229/${server_debug_port}/g" \
  docker-compose.yaml \
  .vscode/launch.json \
  scripts/taito/project.sh scripts/taito/env-local.sh \
  scripts/taito/TAITOLESS.md www/README.md &> /dev/null || :
sed -i "s/7463/${www_port}/g" \
  docker-compose.yaml \
  scripts/taito/project.sh scripts/taito/env-local.sh \
  scripts/taito/TAITOLESS.md www/README.md &> /dev/null || :
sed -i "s/6000/${db_port}/g" \
  docker-compose.yaml \
  scripts/taito/project.sh scripts/taito/env-local.sh \
  scripts/taito/TAITOLESS.md www/README.md &> /dev/null || :
sed -i "s/9999/${ingress_port}/g" \
  docker-compose.yaml \
  scripts/terraform-dev.yaml \
  scripts/taito/project.sh scripts/taito/env-local.sh \
  scripts/taito/TAITOLESS.md www/README.md &> /dev/null || :

./scripts/taito-template/common.sh
echo init done
