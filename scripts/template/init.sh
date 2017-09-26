#!/bin/bash

: "${template_project_path:?}"
: "${template_project:?}"
: "${template_repo_name:?}"
: "${template_repo_name_alt:?}"
: "${template_customer:?}"
: "${mode:?}"

echo "- init"

# Remove license
rm LICENSE
grep -v '"license":' < package.json > package.json.tmp
mv package.json.tmp package.json

echo
echo "--- Choose the stack ---"
echo
echo "Press enter to accept the default name. Use - as a name to skip."
echo
echo "Short name of admin GUI (admin)?"
read -r admin; admin=${admin:-admin}
echo
echo "Short name of GUI (client)?"
read -r client; client=${client:-client}
echo
echo "Short name of server (server)?"
read -r server; server=${server:-server}
echo
echo "Short name of function (function)?"
read -r function; function=${function:-function}
echo
echo "Short name of cache (cache)?"
read -r cache; cache=${cache:-cache}
echo
echo "Short name of relational database (database)?"
read -r database; database=${database:-database}
echo
echo "Short name of file bucket (bucket)?"
read -r bucket; bucket=${bucket:-bucket}
echo

# Rename/remove directories
if [[ "${mode}" == "create" ]]; then
  move_directory() {
    if [[ "${1}" != "${2}" ]]; then
      if [[ "${2}" == "-" ]]; then
        rm -rf "${1}"
      else
        mv "${1}" "${2}"
      fi
    fi
  }
  move_directory "admin" "${admin}"
  move_directory "client" "${client}"
  move_directory "server" "${server}"
  move_directory "function" "${function}"
fi

# Add the stack to helm.yaml
helm_stack="stack:\n"
helm_stack="${helm_stack}  admin: ${admin//-/}\n"
helm_stack="${helm_stack}  client: ${client//-/}\n"
helm_stack="${helm_stack}  server: ${server//-/}\n"
helm_stack="${helm_stack}  function: ${function//-/}\n"
helm_stack="${helm_stack}  cache: ${cache//-/}\n"
helm_stack="${helm_stack}  database: ${database//-/}\n"
helm_stack="${helm_stack}  bucket: ${bucket//-/}\n"
tail -n +9 "scripts/helm.yaml" > "helm.yaml.tmp" && mv -f "helm.yaml.tmp" "scripts/helm.yaml"
echo -e "${helm_stack}" | cat - scripts/helm.yaml > temp && mv -f temp scripts/helm.yaml

# Create cloudbuild.yaml using the stack
# Header and footer are read from existing cloudbuild.yaml
# and container build steps are generated from cloudbuild_step.yaml
add_container() {
  if [[ "${1}" != "-" ]]; then
    step=$(sed "s/#NAME/${1}/g" "./scripts/template/cloudbuild_step.yaml")
    cloudbuild="${cloudbuild}\n${step}"
  fi
}
cloudbuild=""
add_container "${admin}"
add_container "${client}"
add_container "${server}"
add_container "${function}"
{
  sed '/# STACK START/q' cloudbuild.yaml
  echo -e "${cloudbuild}\n"
  sed -n -e '/# STACK END/,$p' cloudbuild.yaml
} >> cloudbuild.yaml.tmp
mv -f cloudbuild.yaml.tmp cloudbuild.yaml

mv ./scripts/server-template "./scripts/${template_repo_name}"
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

echo
echo "--- Choose basic auth credentials ---"
echo
echo "Simple basic auth username:"
read -r auth_username
echo "Simple basic auth password:"
# read -r auth_password
echo "${auth_password}" | htpasswd -c scripts/${template_repo_name}/.htpasswd ${auth_username}

# Generate ports
front_port=$(shuf -i 8000-9999 -n 1)
db_port=$(shuf -i 6000-7999 -n 1)

# Replace user, password and ports in files
if [ "$(uname)" = "Darwin" ]; then
  sed -i '' -- "s/#username/${auth_username}/g" README.md PROJECT.md package.json
  sed -i '' -- "s/#password/${auth_password}/g" README.md PROJECT.md package.json
  sed -i '' -- "s/6000/${db_port}/g" docker-compose.yaml &> /dev/null
  sed -i '' -- "s/8080/${front_port}/g" docker-compose.yaml taito-config.sh \
    ./admin/package.json ./client/package.json &> /dev/null
else
  sed -i -- "s/#username/${auth_username}/g" README.md PROJECT.md package.json
  sed -i -- "s/#password/${auth_password}/g" README.md PROJECT.md package.json
  sed -i -- "s/6000/${db_port}/g" docker-compose.yaml &> /dev/null
  sed -i -- "s/8080/${front_port}/g" docker-compose.yaml taito-config.sh \
    ./admin/package.json ./client/package.json &> /dev/null
fi

# Replace first line of README.md with a 'do not modify' note
tail -n +2 "README.md" > "README.md.tmp" && mv -f "README.md.tmp" "README.md"
echo \
"> NOTE: This file has been copied from server-template. Do not modify it. \
Improve the original instead. Project specific documentation is located in \
PROJECT.md." | cat - README.md > temp && mv -f temp README.md

# Add 'do not modify' note to readme of helm chart
echo \
"> NOTE: This helm chart has been copied from server-template. It is located \
here only to avoid accidental build breaks. Do not modify it. \
Improve the original instead." | cat - scripts/${template_repo_name}/README.md > \
  temp && mv -f temp scripts/${template_repo_name}/README.md

# Add 'do not modify' note to cloudbuild.yaml
printf \
"# NOTE: This file has been generated from server-template by taito-cli.\n\
# It is located here only to avoid accidental build breaks. Do not modify it.\n\
# Improve the original instead." | cat - cloudbuild.yaml > \
  temp && mv -f temp cloudbuild.yaml

# Instructions
echo
echo "--- Instructions ---"
echo
echo "If you want to run the app locally using docker-compose, configure"
echo "docker-compose.yaml yourself using the following container names:"
echo "- admin: ${template_repo_name}-${admin}"
echo "- client: ${template_repo_name}-${client}"
echo "- server: ${template_repo_name}-${server}"
echo "- function: ${template_repo_name}-${function}"
echo "- cache: ${template_repo_name}-${cache}"
echo "- database: ${template_repo_name}-${database}"
echo "- bucket: ${template_repo_name}-${bucket}"
echo
echo "More information about configuration at the end of README.md"
echo
