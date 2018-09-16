#!/bin/bash

: "${taito_organization:?}"
: "${taito_company:?}"
: "${taito_repo_name:?}"
: "${taito_repo_name_alt:?}"

: "${template_default_taito_image:?}"
: "${template_default_organization:?}"
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
echo
echo "Relational database (Y/n)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]*$ ]]; then
  stack_database=true
fi
echo
echo "Permanent object storage for files (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_storage=true
fi
echo
echo "Administration GUI (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_admin=true
fi
echo
echo "Worker for background jobs (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_worker=true
fi
echo
echo "Cache for performance optimizations (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_cache=true
fi
echo
echo "Queue for background jobs or messaging (y/N)?"
read -r confirm
if [[ "${confirm}" =~ ^[Yy]$ ]]; then
  stack_queue=true
fi

if [[ ${mode} != "upgrade" ]]; then
  echo
  echo "--- Choose basic auth credentials ---"
  echo
  echo "The application is protected by basic auth until it provides some kind"
  echo "of authentication scheme of its own. The temporary basic auth"
  echo "username/password will be shared among developers."
  echo
  echo "Choose a simple username and password that are easy to remember."
  echo "Also write them down so you can remember them later."
  echo
  echo "Username:"
  read -r auth_username
  until htpasswd -c scripts/helm/.htpasswd "${auth_username}"
  do
    sleep 0.1
  done
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

  sed ${sedi} -- '/  admin/d' taito-config.sh
  sed ${sedi} -- '/  admin:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/\* admin/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/admin:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:admin":/d' package.json
  sed ${sedi} -- '/lint:admin":/d' package.json
  sed ${sedi} -- '/unit:admin":/d' package.json
  sed ${sedi} -- '/test:admin":/d' package.json

  sed ${sedi} -- 's/install-all:admin //g' package.json
  sed ${sedi} -- 's/lint:admin //g' package.json
  sed ${sedi} -- 's/unit:admin //g' package.json
  sed ${sedi} -- 's/test:admin //g' package.json
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

  sed ${sedi} -- '/  client/d' taito-config.sh
  sed ${sedi} -- '/  client:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/  sentry/d' taito-config.sh
  sed ${sedi} -- '/\* app/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/client:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:client":/d' package.json
  sed ${sedi} -- '/lint:client":/d' package.json
  sed ${sedi} -- '/unit:client":/d' package.json
  sed ${sedi} -- '/test:client":/d' package.json

  sed ${sedi} -- 's/install-all:client //g' package.json
  sed ${sedi} -- 's/lint:client //g' package.json
  sed ${sedi} -- 's/unit:client //g' package.json
  sed ${sedi} -- 's/test:client //g' package.json
fi

if [[ ! ${stack_database} ]]; then
  rm -rf database

{
sed '/# database start/q' docker-compose.yaml
sed -n -e '/# database end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- '/  database/d' taito-config.sh
  sed ${sedi} -- '/  database:/d' ./scripts/helm.yaml

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

  sed ${sedi} -- '/  server/d' taito-config.sh
  sed ${sedi} -- '/  server:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/\* api/d' taito-config.sh
  sed ${sedi} -- '/REPO_NAME\/server:/d' cloudbuild.yaml

  sed ${sedi} -- '/install-all:server":/d' package.json
  sed ${sedi} -- '/lint:server":/d' package.json
  sed ${sedi} -- '/unit:server":/d' package.json
  sed ${sedi} -- '/test:server":/d' package.json

  sed ${sedi} -- 's/install-all:server //g' package.json
  sed ${sedi} -- 's/lint:server //g' package.json
  sed ${sedi} -- 's/unit:server //g' package.json
  sed ${sedi} -- 's/test:server //g' package.json
fi

if [[ ! ${stack_storage} ]]; then
  rm -rf storage

{
sed '/# storage start/q' docker-compose.yaml
sed -n -e '/# storage end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- '/  storage/d' taito-config.sh
  sed ${sedi} -- '/  storage:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/terraform/d' taito-config.sh
  sed ${sedi} -- '/\* storage/d' taito-config.sh
  sed ${sedi} -- '/storage-gateway/d' taito-config.sh
  sed ${sedi} -- '/gserviceaccount/d' taito-config.sh
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

  sed ${sedi} -- '/  worker/d' taito-config.sh
  sed ${sedi} -- '/  worker:/d' ./scripts/helm.yaml

  sed ${sedi} -- '/install-all:worker":/d' package.json
  sed ${sedi} -- '/lint:worker":/d' package.json
  sed ${sedi} -- '/unit:worker":/d' package.json
  sed ${sedi} -- '/test:worker":/d' package.json

  sed ${sedi} -- 's/install-all:worker //g' package.json
  sed ${sedi} -- 's/lint:worker //g' package.json
  sed ${sedi} -- 's/unit:worker //g' package.json
  sed ${sedi} -- 's/test:worker //g' package.json
fi

if [[ ! ${stack_queue} ]]; then

{
sed '/# queue start/q' docker-compose.yaml
sed -n -e '/# queue end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- '/  queue/d' taito-config.sh
  sed ${sedi} -- '/  queue:/d' ./scripts/helm.yaml
fi

if [[ ! ${stack_cache} ]]; then

{
sed '/# cache start/q' docker-compose.yaml
sed -n -e '/# cache end/,$p' docker-compose.yaml
} > temp
truncate --size 0 docker-compose.yaml
cat temp > docker-compose.yaml

  sed ${sedi} -- '/  cache/d' taito-config.sh
  sed ${sedi} -- '/  cache:/d' ./scripts/helm.yaml
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
sed ${sedi} -- "s|TaitoUnited/server-template.git|${taito_organization}/${taito_repo_name}.git|g" package.json

# Add some do not modify notes
echo "Adding do-not-modify notes..."

# Replace NOTE of README.md with a 'do not modify' note
{
sed '/TEMPLATE NOTE START/q' README.md
echo
echo "This file has been copied from \
[SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). Keep \
modifications minimal and improve the original instead."
echo
sed -n -e '/TEMPLATE NOTE END/,$p' README.md
} > temp
truncate --size 0 README.md
cat temp > README.md

# Add 'do not modify' note to readme of helm chart
echo \
"> NOTE: This helm chart has been copied from \
[SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). It is \
located here only to avoid accidental build breaks. Do not modify it. \
Improve the original instead." | \
  cat - scripts/helm/README.md > temp && \
  truncate --size 0 scripts/helm/README.md && \
  cat temp > scripts/helm/README.md

# Add 'do not modify' note to readme of terraform
echo \
"> NOTE: These terraform scripts have been copied from \
[SERVER-TEMPLATE](https://github.com/TaitoUnited/SERVER-TEMPLATE/). They are \
located here only to avoid accidental build breaks. Do not modify them. \
Improve the originals instead." | \
  cat - scripts/terraform/README.md > temp && \
  truncate --size 0 scripts/terraform/README.md && \
  cat temp > scripts/terraform/README.md

# Add 'do not modify' note to cloudbuild.yaml
printf \
"# NOTE: This file has been generated from SERVER-TEMPLATE by taito-cli.\n\
# It is located here only to avoid accidental build breaks. Keep modifications \n\
# minimal and improve the original instead.\n\n" | \
  cat - cloudbuild.yaml > temp && \
  truncate --size 0 cloudbuild.yaml && \
  cat temp > cloudbuild.yaml

# Replace some strings
# TODO init script is never run with os x -> remove darwin support?
echo "Replacing project and company names in files. Please wait..."
if [ "$(uname)" = "Darwin" ]; then
  find . -type f -exec sed -i '' \
    -e "s/server_template/${taito_repo_name_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/server-template/${taito_repo_name}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/companyname/${taito_company}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/SERVER-TEMPLATE/server-template/g" 2> /dev/null {} \;
else
  find . -type f -exec sed -i \
    -e "s/server_template/${taito_repo_name_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/server-template/${taito_repo_name}/g" 2> /dev/null {} \;
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
sed ${sedi} -- "s/export taito_company=\".*\"/export taito_company=\"${taito_company}\"/g" taito-config.sh
sed ${sedi} -- "s/export taito_family=\".*\"/export taito_family=\"${taito_family:-}\"/g" taito-config.sh
sed ${sedi} -- "s/export taito_application=\".*\"/export taito_application=\"${taito_application:-}\"/g" taito-config.sh
sed ${sedi} -- "s/export taito_suffix=\".*\"/export taito_suffix=\"${taito_suffix:-}\"/g" taito-config.sh
sed ${sedi} -- "s/export taito_repo_name=\".*\"/export taito_repo_name=\"${taito_repo_name}\"/g" taito-config.sh
sed ${sedi} -- "s/export taito_project=\".*\"/export taito_project=\"${taito_repo_name}\"/g" taito-config.sh

echo "Replacing template variables with the user specific settings..."

# Replace template variables in taito-config.sh with user specific settings
sed ${sedi} -- "s/\${template_default_organization:?}/${template_default_organization}/g" taito-config.sh
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
