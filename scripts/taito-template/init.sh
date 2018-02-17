#!/bin/bash

: "${template_default_organization:?}"
: "${template_default_domain:?}"
: "${template_default_zone:?}"
: "${template_default_provider:?}"
: "${template_default_provider_region:?}"
: "${template_default_provider_zone:?}"
: "${template_default_source_git:?}"
: "${template_default_dest_git:?}"

: "${template_project_path:?}"
: "${template_repo_name:?}"
: "${template_repo_name_alt:?}"
: "${template_customer:?}"
: "${mode:?}"

echo "- init"

# Remove license
rm LICENSE
grep -v '"license":' < package.json > package.json.tmp
mv package.json.tmp package.json

# Remove client-vue and server-py
rm -rf client-vue
rm -rf server-py

# echo
# echo "--- Choose the stack ---"
# echo
# echo "Press enter to accept the default name. Use - as a name to skip."
# echo
# echo "Short name of admin GUI (admin)?"
# read -r admin; admin=${admin:-admin}
# echo
# echo "Short name of cache (cache)?"
# read -r cache; cache=${cache:-cache}
# echo
# echo "Short name of GUI (client)?"
# read -r client; client=${client:-client}
# echo
# echo "Short name of database (database)?"
# read -r database; database=${database:-database}
# echo
# echo "Short name of function (function)?"
# read -r function; function=${function:-function}
# echo
# echo "Short name of queue (queue)?"
# read -r queue; queue=${queue:-queue}
# echo
# echo "Short name of server (server)?"
# read -r server; server=${server:-server}
# echo
# echo "Short name of storage (storage)?"
# read -r storage; storage=${storage:-storage}
# echo
# echo "Short name of worker (worker)?"
# read -r worker; worker=${worker:-worker}
# echo
#
# # Rename/remove directories
# if [[ "${mode}" == "create" ]]; then
#   move_directory() {
#     if [[ "${1}" != "${2}" ]]; then
#       if [[ "${2}" == "-" ]]; then
#         rm -rf "${1}"
#       else
#         mv "${1}" "${2}"
#       fi
#     fi
#   }
#   move_directory "admin" "${admin}"
#   move_directory "client" "${client}"
#   move_directory "database" "${database}"
#   move_directory "function" "${function}"
#   move_directory "server" "${server}"
#   move_directory "storage" "${storage}"
#   move_directory "worker" "${worker}"
# fi
#
# # Add the stack to helm.yaml
# helm_stack="stack:\n"
# helm_stack="${helm_stack}  admin: ${admin//-/}\n"
# helm_stack="${helm_stack}  cache: ${cache//-/}\n"
# helm_stack="${helm_stack}  client: ${client//-/}\n"
# helm_stack="${helm_stack}  database: ${database//-/}\n"
# helm_stack="${helm_stack}  function: ${function//-/}\n"
# helm_stack="${helm_stack}  queue: ${queue//-/}\n"
# helm_stack="${helm_stack}  server: ${server//-/}\n"
# helm_stack="${helm_stack}  storage: ${storage//-/}\n"
# helm_stack="${helm_stack}  worker: ${worker//-/}\n"
# tail -n +9 "scripts/helm.yaml" > "helm.yaml.tmp" && mv -f "helm.yaml.tmp" "scripts/helm.yaml"
# echo -e "${helm_stack}" | cat - scripts/helm.yaml > temp && mv -f temp scripts/helm.yaml
#
# # Create cloudbuild.yaml using the stack
# # Header and footer are read from existing cloudbuild.yaml
# # and container build steps are generated from cloudbuild_step.yaml
# add_container() {
#   if [[ "${1}" != "-" ]]; then
#     step=$(sed "s/#NAME/${1}/g" "./scripts/taito-template/cloudbuild_step.yaml")
#     cloudbuild="${cloudbuild}\n${step}"
#   fi
# }
# cloudbuild=""
# add_container "${admin}"
# add_container "${client}"
# add_container "${function}"
# add_container "${server}"
# add_container "${worker}"
# {
#   sed '/# STACK START/q' cloudbuild.yaml
#   echo -e "${cloudbuild}\n"
#   sed -n -e '/# STACK END/,$p' cloudbuild.yaml
# } >> cloudbuild.yaml.tmp
# mv -f cloudbuild.yaml.tmp cloudbuild.yaml

echo
echo "--- Choose basic auth credentials ---"
echo
echo "Simple basic auth username:"
read -r auth_username
echo "Simple basic auth password:"
# read -r auth_password
echo "${auth_password}" | htpasswd -c scripts/helm/.htpasswd ${auth_username}

# Replace NOTE of README.md with a 'do not modify' note
tail -n +2 "README.md" > "README.md.tmp" && mv -f "README.md.tmp" "README.md"
echo \
"> NOTE: This file has been copied from \
[server-template](https://github.com/TaitoUnited/server-template/). Keep \
modifications minimal and improve the original instead. Project \
specific documentation is located in PROJECT.md." | \
  cat - README.md > temp && mv -f temp README.md

# Add 'do not modify' note to readme of helm chart
echo \
"> NOTE: This helm chart has been copied from \
[server-template](https://github.com/TaitoUnited/server-template/). It is \
located here only to avoid accidental build breaks. Do not modify it. \
Improve the original instead." | \
  cat - scripts/helm/README.md > temp && \
  mv -f temp scripts/helm/README.md

# Add 'do not modify' note to readme of terraform
echo \
"> NOTE: These terraform scripts have been copied from \
[server-template](https://github.com/TaitoUnited/server-template/). They are \
located here only to avoid accidental build breaks. Do not modify them. \
Improve the originals instead." | \
  cat - scripts/terraform/README.md > temp && \
  mv -f temp scripts/terraform/README.md

# Add 'do not modify' note to cloudbuild.yaml
printf \
"# NOTE: This file has been generated from server-template by taito-cli.\n\
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
sed ${sedi} -- "s/\${template_default_provider:?}/${template_default_provider}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_region:?}/${template_default_provider_region}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_provider_zone:?}/${template_default_provider_zone}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_source_git:?}/${template_default_source_git}/g" taito-config.sh
sed ${sedi} -- "s/\${template_default_dest_git:?}/${template_default_dest_git}/g" taito-config.sh

# Remove template settings from cloudbuild.yaml
sed ${sedi} -- '/_TEMPLATE_DEFAULT_/d' cloudbuild.yaml
