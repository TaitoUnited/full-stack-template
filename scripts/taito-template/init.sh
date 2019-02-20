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
: "${template_default_registry:?}"
: "${template_default_source_git:?}"
: "${template_default_dest_git:?}"
: "${template_default_kubernetes:?}"
: "${template_default_postgres:?}"

: "${template_project_path:?}"
: "${mode:?}"

# Determine sed options
if [ "$(uname)" = "Darwin" ]; then
 sedi="-i ''"
else
 sedi="-i"
fi

echo
echo "--- Choose stack ---"
echo "NOTE: If you are unsure, just accept the defaults."
echo

echo "WEB user interface (Y/n)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]*$ ]]; then
  stack_client=true
fi
echo
echo "NOTE: WEB user interface is just a bunch of static files that are loaded"
echo "to a web browser. If you need some process running on server or need to"
echo "keep some secrets hidden from browser, you need API/server."
echo
echo "API/server (Y/n)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]*$ ]]; then
  stack_server=true
fi
echo "Relational database (Y/n)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]*$ ]]; then
  stack_database=true
fi
echo "Permanent object storage for files (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_storage=true
fi
echo "Administration GUI (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_admin=true
fi
echo "Static website (e.g. for documentation) (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_www=true
fi
echo "GraphQL gateway (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_graphql=true
fi
echo "Worker for background jobs (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_worker=true
fi
echo "Cache for performance optimizations (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_cache=true
fi
echo "Queue for background jobs or messaging (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_queue=true
fi

##############
# Prune stack
##############

echo
echo "Pruning stack..."

if [[ ! ${stack_admin} ]]; then
  rm -rf admin

{
sed '/# admin start/q' docker-compose.yaml
sed -n -e '/# admin end/,$p' docker-compose.yaml
} > temp
  truncate --size 0 docker-compose.yaml
  cat temp > docker-compose.yaml

{
sed '/# admin start/q' docker-nginx.conf
sed -n -e '/# admin end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- 's/ admin / /' taito-config.sh
  sed ${sedi} -- '/^    admin: true/d' ./scripts/helm.yaml

  sed ${sedi} -- '/\* admin/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/admin:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:admin":/d' package.json
  sed ${sedi} -- '/lint:admin":/d' package.json
  sed ${sedi} -- '/unit:admin":/d' package.json
  sed ${sedi} -- '/test:admin":/d' package.json
  sed ${sedi} -- '/check-deps:admin":/d' package.json
  sed ${sedi} -- '/check-size:admin":/d' package.json

  sed ${sedi} -- 's/install-all:admin //g' package.json
  sed ${sedi} -- 's/lint:admin //g' package.json
  sed ${sedi} -- 's/unit:admin //g' package.json
  sed ${sedi} -- 's/test:admin //g' package.json
  sed ${sedi} -- 's/\\"check-deps:admin {@}\\" //g' package.json
  sed ${sedi} -- 's/\\"check-size:admin {@}\\" //g' package.json
fi

if [[ ! ${stack_client} ]]; then
  rm -rf client

{
sed '/# client start/q' docker-compose.yaml
sed -n -e '/# client end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

{
sed '/# client start/q' docker-nginx.conf
sed -n -e '/# client end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- 's/ client / /' taito-config.sh
  sed ${sedi} -- '/^    client: true/d' ./scripts/helm.yaml

  sed ${sedi} -- '/  sentry/d' taito-config.sh
  sed ${sedi} -- '/\* app/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/client:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:client":/d' package.json
  sed ${sedi} -- '/lint:client":/d' package.json
  sed ${sedi} -- '/unit:client":/d' package.json
  sed ${sedi} -- '/test:client":/d' package.json
  sed ${sedi} -- '/check-deps:client":/d' package.json
  sed ${sedi} -- '/check-size:client":/d' package.json

  sed ${sedi} -- 's/install-all:client //g' package.json
  sed ${sedi} -- 's/lint:client //g' package.json
  sed ${sedi} -- 's/unit:client //g' package.json
  sed ${sedi} -- 's/test:client //g' package.json
  sed ${sedi} -- 's/\\"check-deps:client {@}\\" //g' package.json
  sed ${sedi} -- 's/\\"check-size:client {@}\\" //g' package.json
fi

if [[ ! ${stack_database} ]]; then
  rm -rf database

{
sed '/# database start/q' docker-compose.yaml
sed -n -e '/# database end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- 's/ database / /' taito-config.sh
  # sed ${sedi} -- '/  database:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/postgres-db/d' taito-config.sh
  sed ${sedi} -- '/db\./d' taito-config.sh
  sed ${sedi} -- '/DATABASE_/d' docker-compose.yaml
fi

if [[ ! ${stack_server} ]]; then
  rm -rf server

{
sed '/# server start/q' docker-compose.yaml
sed -n -e '/# server end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

{
sed '/# server start/q' docker-nginx.conf
sed -n -e '/# server end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- "s/ci-prepare:server/ci-prepare:client/" cloudbuild.yaml

  sed ${sedi} -- 's/ server / /' taito-config.sh
  sed ${sedi} -- '/^    server: true/d' ./scripts/helm.yaml

  sed ${sedi} -- '/\* api/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/server:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:server":/d' package.json
  sed ${sedi} -- '/lint:server":/d' package.json
  sed ${sedi} -- '/unit:server":/d' package.json
  sed ${sedi} -- '/test:server":/d' package.json
  sed ${sedi} -- '/check-deps:server":/d' package.json

  sed ${sedi} -- 's/install-all:server //g' package.json
  sed ${sedi} -- 's/lint:server //g' package.json
  sed ${sedi} -- 's/unit:server //g' package.json
  sed ${sedi} -- 's/test:server //g' package.json
  sed ${sedi} -- 's/\\"check-deps:server {@}\\" //g' package.json
fi

if [[ ! ${stack_graphql} ]]; then
  rm -rf graphql

{
sed '/# graphql start/q' docker-compose.yaml
sed -n -e '/# graphql end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

{
sed '/# graphql start/q' docker-nginx.conf
sed -n -e '/# graphql end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- 's/ graphql / /' taito-config.sh
  sed ${sedi} -- '/^    graphql: true/d' ./scripts/helm.yaml

  # sed ${sedi} -- '/\* api/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/graphql:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:graphql":/d' package.json
  sed ${sedi} -- '/lint:graphql":/d' package.json
  sed ${sedi} -- '/unit:graphql":/d' package.json
  sed ${sedi} -- '/test:graphql":/d' package.json
  sed ${sedi} -- '/check-deps:graphql":/d' package.json

  sed ${sedi} -- 's/install-all:graphql //g' package.json
  sed ${sedi} -- 's/lint:graphql //g' package.json
  sed ${sedi} -- 's/unit:graphql //g' package.json
  sed ${sedi} -- 's/test:graphql //g' package.json
  sed ${sedi} -- 's/\\"check-deps:graphql {@}\\" //g' package.json
fi

if [[ ! ${stack_storage} ]]; then
  rm -rf storage

{
sed '/# storage start/q' docker-compose.yaml
sed -n -e '/# storage end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

{
sed '/# storage start/q' docker-nginx.conf
sed -n -e '/# storage end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- 's/ storage / /' taito-config.sh
  sed ${sedi} -- '/^    storage: true/d' ./scripts/helm.yaml
  sed ${sedi} -- '/    serviceAccount:/d' ./scripts/helm.yaml
  sed ${sedi} -- '/.*taito_env}-gserviceaccount.key/d' ./scripts/helm.yaml

  sed ${sedi} -- '/terraform/d' taito-config.sh
  sed ${sedi} -- '/\* storage/d' taito-config.sh
  sed ${sedi} -- '/storage-gateway/d' taito-config.sh
  sed ${sedi} -- '/gserviceaccount.key:file/d' taito-config.sh
  sed ${sedi} -- '/S3_/d' ./scripts/helm.yaml
  sed ${sedi} -- '/S3_/d' docker-compose.yaml
fi

if [[ ! ${stack_worker} ]]; then
  rm -rf worker

{
sed '/# worker start/q' docker-compose.yaml
sed -n -e '/# worker end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- 's/ worker / /' taito-config.sh
  sed ${sedi} -- '/^    worker: false/d' ./scripts/helm.yaml

  sed ${sedi} -- '/REPO_NAME\/worker:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:worker":/d' package.json
  sed ${sedi} -- '/lint:worker":/d' package.json
  sed ${sedi} -- '/unit:worker":/d' package.json
  sed ${sedi} -- '/test:worker":/d' package.json
  sed ${sedi} -- '/check-deps:worker":/d' package.json

  sed ${sedi} -- 's/install-all:worker //g' package.json
  sed ${sedi} -- 's/lint:worker //g' package.json
  sed ${sedi} -- 's/unit:worker //g' package.json
  sed ${sedi} -- 's/test:worker //g' package.json
  sed ${sedi} -- 's/\\"check-deps:worker {@}\\" //g' package.json
fi

if [[ ! ${stack_www} ]]; then
  rm -rf www

{
sed '/# www start/q' docker-compose.yaml
sed -n -e '/# www end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

{
sed '/# www start/q' docker-nginx.conf
sed -n -e '/# www end/,$p' docker-nginx.conf
} > temp
truncate --size 0 docker-nginx.conf
cat temp > docker-nginx.conf

  sed ${sedi} -- 's/ www / /' taito-config.sh
  sed ${sedi} -- '/^    www: false/d' ./scripts/helm.yaml

  sed ${sedi} -- '/REPO_NAME\/www:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:www":/d' package.json
  sed ${sedi} -- '/lint:www":/d' package.json
  sed ${sedi} -- '/unit:www":/d' package.json
  sed ${sedi} -- '/test:www":/d' package.json
  sed ${sedi} -- '/check-deps:www":/d' package.json

  sed ${sedi} -- 's/install-all:www //g' package.json
  sed ${sedi} -- 's/lint:www //g' package.json
  sed ${sedi} -- 's/unit:www //g' package.json
  sed ${sedi} -- 's/test:www //g' package.json
  sed ${sedi} -- 's/\\"check-deps:www {@}\\" //g' package.json
fi

if [[ ! ${stack_queue} ]]; then

{
sed '/# queue start/q' docker-compose.yaml
sed -n -e '/# queue end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- 's/ queue / /' taito-config.sh
  sed ${sedi} -- '/^    queue: false/d' ./scripts/helm.yaml
fi

if [[ ! ${stack_cache} ]]; then

{
sed '/# cache start/q' docker-compose.yaml
sed -n -e '/# cache end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- 's/ cache / /' taito-config.sh
  sed ${sedi} -- '/^    cache: false/d' ./scripts/helm.yaml
fi

sed ${sedi} -- '/https:\/\/TODO/d' taito-config.sh


# Remove TODO links
sed ${sedi} -- '/https:\/\/TODO/d' taito-config.sh

# Remove MIT license
# TODO leave a reference to the original?
rm LICENSE
# grep -v '"license":' < package.json > package.json.tmp
# mv package.json.tmp package.json

# Replace repository url in package.json
sed ${sedi} -- "s|TaitoUnited/server-template.git|${taito_organization}/${taito_vc_repository}.git|g" package.json

# Add some do not modify notes
echo "Adding do-not-modify notes..."

# Remove template note from README.md
{
sed '/TEMPLATE NOTE START/q' README.md
sed -n -e '/TEMPLATE NOTE END/,$p' README.md
} > temp
truncate --size 0 README.md
cat temp > README.md

# Replace some strings
# TODO init script is never run with os x -> remove darwin support?
echo "Replacing project and company names in files. Please wait..."
if [ "$(uname)" = "Darwin" ]; then
  find . -type f -exec sed -i '' \
    -e "s/server_template/${taito_vc_repository_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/server-template/${taito_vc_repository}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/companyname/${taito_company}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/SERVER-TEMPLATE/server-template/g" 2> /dev/null {} \;
else
  find . -type f -exec sed -i \
    -e "s/server_template/${taito_vc_repository_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/server-template/${taito_vc_repository}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/companyname/${taito_company}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/SERVER-TEMPLATE/server-template/g" 2> /dev/null {} \;
fi

# Generate ports
echo "Generating unique random ports (avoid conflicts with other projects)..."

ingress_port=$(shuf -i 8000-9999 -n 1)
db_port=$(shuf -i 6000-7999 -n 1)
sed ${sedi} -- "s/6000/${db_port}/g" taito-config.sh &> /dev/null
sed ${sedi} -- "s/6000/${db_port}/g" docker-compose.yaml &> /dev/null
sed ${sedi} -- "s/9999/${ingress_port}/g" docker-compose.yaml taito-config.sh \
  ./admin/package.json ./client/package.json &> /dev/null

echo "Replacing template variables with the given settings..."

# Replace template variables in taito-config.sh with the given settings
sed ${sedi} -- "s/taito_company=.*/taito_company=${taito_company}/g" taito-config.sh
sed ${sedi} -- "s/taito_family=.*/taito_family=${taito_family:-}/g" taito-config.sh
sed ${sedi} -- "s/taito_application=.*/taito_application=${taito_application:-}/g" taito-config.sh
sed ${sedi} -- "s/taito_suffix=.*/taito_suffix=${taito_suffix:-}/g" taito-config.sh
sed ${sedi} -- "s/taito_project=.*/taito_project=${taito_vc_repository}/g" taito-config.sh

echo "Replacing template variables with the user specific settings..."

# Replace template variables in taito-config.sh with user specific settings
sed ${sedi} -- "s/\${template_default_organization:?}/${template_default_organization}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_organization_abbr:?}/${template_default_organization_abbr}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_github_organization:?}/${template_default_github_organization}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_sentry_organization:?}/${template_default_sentry_organization}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_domain:?}/${template_default_domain}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_domain_prod:?}/${template_default_domain_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_zone:?}/${template_default_zone}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_zone_prod:?}/${template_default_zone_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider:?}/${template_default_provider}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_org_id:?}/${template_default_provider_org_id}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_org_id_prod:?}/${template_default_provider_org_id_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_region:?}/${template_default_provider_region}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_zone:?}/${template_default_provider_zone}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_region_prod:?}/${template_default_provider_region_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_zone_prod:?}/${template_default_provider_zone_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_registry:?}/${template_default_registry}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh
sed ${sedi} -- \
  "s/\${template_default_kubernetes:?}/${template_default_kubernetes}/g" taito-config.sh
sed ${sedi} -- \
  "s/\${template_default_postgres:?}/${template_default_postgres}/g" taito-config.sh

echo "Removing template settings from cloudbuild.yaml..."

sed ${sedi} -- "s|\${_TEMPLATE_DEFAULT_TAITO_IMAGE}|${template_default_taito_image}|g" cloudbuild.yaml
sed ${sedi} -- '/_TEMPLATE_DEFAULT_/d' cloudbuild.yaml
sed ${sedi} -- '/template_default_taito_image/d' cloudbuild.yaml

echo "Removing template settings from docker-compose-test.yaml..."

sed ${sedi} -- '/template_default_/d' docker-compose-test.yaml

rm -f temp
