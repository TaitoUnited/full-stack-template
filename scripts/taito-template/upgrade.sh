#!/bin/bash

: "${template_project_path:?}"

echo
./scripts/taito-template/init.sh

echo "- upgrade: Copy files from template to project"
cp README.md "${template_project_path}"
cp cloudbuild.yaml "${template_project_path}"
mkdir -p "${template_project_path}/scripts"
rm -rf "${template_project_path}/scripts/helm" 2> /dev/null
cp -r "scripts/helm" "${template_project_path}/scripts/helm" 2> /dev/null
rm -rf "${template_project_path}/scripts/terraform" 2> /dev/null
cp -r "scripts/terraform" "${template_project_path}/scripts/terraform" 2> /dev/null

echo
taito links generate

echo
echo
echo
echo "Do the following:"
echo "- Remove extra images from the beginning of the cloudbuild.yaml file"
echo "- Add project specific modifications to README.md (README.md was copied from template)"
echo
echo "If something stops working, try the following:"
echo "- Run 'taito --upgrade' to upgrade your taito-cli"
echo "- Compare taito-config.sh with the template"
echo "- Compare package.json with the template"
echo
