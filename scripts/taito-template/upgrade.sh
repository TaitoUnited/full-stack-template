#!/bin/bash

: "${template_project_path:?}"

echo
./scripts/taito-template/init.sh

# Copy files from template to project
cp README.md "${template_project_path}"
cp cloudbuild.yaml "${template_project_path}"
mkdir -p "${template_project_path}/scripts"

cp "${template_project_path}/scripts/helm/.htpasswd" \
  "${template_project_path}/scripts/.htpasswd" 2> /dev/null
rm -rf "${template_project_path}/scripts/helm" 2> /dev/null
cp -r "scripts/helm" "${template_project_path}/scripts/helm" 2> /dev/null
rm -f "${template_project_path}/scripts/helm/.htpasswd" 2> /dev/null
mv "${template_project_path}/scripts/.htpasswd" \
  "${template_project_path}/scripts/helm/.htpasswd" 2> /dev/null

rm -rf "${template_project_path}/scripts/terraform" 2> /dev/null
cp -r "scripts/terraform" "${template_project_path}/scripts/terraform" 2> /dev/null

echo
echo
echo "--- Manual steps ---"
echo
echo "Do the following:"
echo "- Remove extra images from the beginning of the cloudbuild.yaml file"
echo "- Generate links to README.md by running: taito project docs"
echo "- Add project specific modifications back to README.md if there were any"
echo "  (README.md was copied from the template)"
echo
echo "If something stops working, try the following:"
echo "- Run 'taito --upgrade' to upgrade your taito-cli"
echo "- Compare taito-config.sh with the template"
echo "- Compare package.json with the template"
echo
