#!/bin/bash -e

: "${template_project_path:?}"

${taito_setv:-}
./scripts/taito-template/init.sh

# Copy files from template to project
yes | cp CONFIGURATION.md "${template_project_path}"
yes | cp DEVELOPMENT.md "${template_project_path}"
yes | cp TAITOLESS.md "${template_project_path}"
yes | cp cloudbuild.yaml "${template_project_path}"
sed -i "s/\[ \] All done/[x] All done/g" CONFIGURATION.md

# Copy helm requirements
mkdir -p "${template_project_path}/scripts/helm"
yes | cp -r "scripts/helm/requirements.yaml" \
  "${template_project_path}/scripts/helm/requirements.yaml" 2> /dev/null

# Copy terraform scripts
rm -rf "${template_project_path}/scripts/terraform/common"
cp -r scripts/terraform/common "${template_project_path}/scripts/terraform/common"

echo
echo
echo "--- Manual steps ---"
echo
echo "Recommended steps:"
echo "- Update source image(s) in all Dockerfiles. Note that there might be"
echo "  multiple FROM clauses in each file."
echo "- Update libraries and other project dependencies."
echo
echo "If something stops working, try the following:"
echo "- Run 'taito upgrade' to upgrade your taito-cli"
echo "- Compare scripts/helm*.yaml with the template"
echo "- Compare taito-config.sh with the template"
echo "- Compare package.json with the template"
echo "- Compare cloudbuild.yaml with the previous version"
echo
