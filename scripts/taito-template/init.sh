#!/bin/bash

: "${template_default_organization:?}"
: "${template_default_domain:?}"
: "${template_default_zone:?}"
: "${template_default_zone_prod:?}"
: "${template_default_provider:?}"
: "${template_default_provider_region:?}"
: "${template_default_provider_region_prod:?}"
: "${template_default_provider_zone:?}"
: "${template_default_provider_zone_prod:?}"
: "${template_default_source_git:?}"
: "${template_default_dest_git:?}"

: "${template_project_path:?}"
: "${template_repo_name:?}"
: "${template_repo_name_alt:?}"
: "${template_customer:?}"
: "${mode:?}"

if [[ ${mode} != "upgrade" ]]; then
  echo
  echo "--- Choose basic auth credentials ---"
  echo
  echo "Simple basic auth username:"
  read -r auth_username
  echo "Simple basic auth password:"
  # read -r auth_password
  echo "${auth_password}" | htpasswd -c scripts/helm/.htpasswd ${auth_username}
fi

echo
echo "Please wait..."

# Remove license
rm LICENSE
grep -v '"license":' < package.json > package.json.tmp
mv package.json.tmp package.json

# Remove client-vue and server-py
rm -rf client-vue
rm -rf server-py

# Replace NOTE of README.md with a 'do not modify' note
tail -n +2 "README.md" > "README.md.tmp" && mv -f "README.md.tmp" "README.md"
echo \
"> NOTE: This file has been copied from \
[orig-template](https://github.com/TaitoUnited/orig-template/). Keep \
modifications minimal and improve the original instead. Project \
specific documentation is located in PROJECT.md." | \
  cat - README.md > temp && mv -f temp README.md

# Add 'do not modify' note to readme of helm chart
echo \
"> NOTE: This helm chart has been copied from \
[orig-template](https://github.com/TaitoUnited/orig-template/). It is \
located here only to avoid accidental build breaks. Do not modify it. \
Improve the original instead." | \
  cat - scripts/helm/README.md > temp && \
  mv -f temp scripts/helm/README.md

# Add 'do not modify' note to readme of terraform
echo \
"> NOTE: These terraform scripts have been copied from \
[orig-template](https://github.com/TaitoUnited/orig-template/). They are \
located here only to avoid accidental build breaks. Do not modify them. \
Improve the originals instead." | \
  cat - scripts/terraform/README.md > temp && \
  mv -f temp scripts/terraform/README.md

# Add 'do not modify' note to cloudbuild.yaml
printf \
"# NOTE: This file has been generated from orig-template by taito-cli.\n\
# It is located here only to avoid accidental build breaks. Keep modifications \n\
# minimal and improve the original instead.\n\n" | \
  cat - cloudbuild.yaml > temp && \
  mv -f temp cloudbuild.yaml

# Replace some strings
if [ "$(uname)" = "Darwin" ]; then
  find . -type f -exec sed -i '' \
    -e "s/server_template/${template_repo_name_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/server-template/${template_repo_name}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/customername/${template_customer}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i '' \
    -e "s/orig-template/server-template/g" 2> /dev/null {} \;
else
  find . -type f -exec sed -i \
    -e "s/server_template/${template_repo_name_alt}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/server-template/${template_repo_name}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/customername/${template_customer}/g" 2> /dev/null {} \;
  find . -type f -exec sed -i \
    -e "s/orig-template/server-template/g" 2> /dev/null {} \;
fi

# Generate ports
ingress_port=$(shuf -i 8000-9999 -n 1)
db_port=$(shuf -i 6000-7999 -n 1)

# Replace user, password and ports in files
if [ "$(uname)" = "Darwin" ]; then
 sedi="-i ''"
else
 sedi="-i"
fi
sed ${sedi} -- "s/#username/${auth_username}/g" README.md PROJECT.md package.json
sed ${sedi} -- "s/#password/${auth_password}/g" README.md PROJECT.md package.json
sed ${sedi} -- "s/6000/${db_port}/g" taito-config.sh &> /dev/null
sed ${sedi} -- "s/6000/${db_port}/g" docker-compose.yaml &> /dev/null
sed ${sedi} -- "s/8080/${ingress_port}/g" docker-compose.yaml taito-config.sh \
  ./admin/package.json ./client/package.json &> /dev/null

# Replace template variables in taito-config.sh with user specific settings
sed ${sedi} -- "s/\${template_default_organization:?}/${template_default_organization}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_domain:?}/${template_default_domain}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_zone:?}/${template_default_zone}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_zone_prod:?}/${template_default_zone_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider:?}/${template_default_provider}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_region:?}/${template_default_provider_region}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_zone:?}/${template_default_provider_zone}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_region_prod:?}/${template_default_provider_region_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_zone_prod:?}/${template_default_provider_zone_prod}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh

# Remove template settings from cloudbuild.yaml
sed ${sedi} -- '/_TEMPLATE_DEFAULT_/d' cloudbuild.yaml
