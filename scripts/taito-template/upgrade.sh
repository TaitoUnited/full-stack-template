#!/bin/bash -e

: "${template_project_path:?}"

${taito_setv:-}
./scripts/taito-template/init.sh

# Remove obsolete root files not to be copied
rm -f \
  docker-*
  # TODO: also ->
  # README.md \
  # taito-domain-config.sh \
  # taito-environments-config.sh \
  # taito-test-config.sh \
  # trouble.txt

# Copy files from template to project
yes | cp * "${template_project_path}"
find . -name "Dockerfile*" -exec cp --parents \{\} "${template_project_path}" \;

# Mark all configurations as 'done'
sed -i "s/\[ \] All done/[x] All done/g" CONFIGURATION.md

# Copy helm template
mkdir -p "${template_project_path}/scripts/helm"
yes | cp scripts/helm/* \
  "${template_project_path}/scripts/helm" 2> /dev/null

# TODO: remove
rm -rf "${template_project_path}/scripts/terraform/gcloud"

# Copy terraform scripts
cp -rf scripts/terraform "${template_project_path}/scripts/terraform"

echo
echo
echo "--- Manual steps ---"
echo
echo "Recommended steps:"
echo "- Review all changes before committing them to git"
echo
echo "If something stops working, try the following:"
echo "- Run 'taito upgrade' to upgrade your Taito CLI"
echo "- Compare scripts/helm*.yaml with the template"
echo "- Compare taito-*config.sh with the template"
echo "- Compare package.json with the template"
echo
