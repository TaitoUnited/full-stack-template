#!/bin/bash -e

: "${template_project_path:?}"

# Read original random ports from docker-compose.yaml
export ingress_port
ingress_port=$(grep ":80\"" "${template_project_path}/docker-compose.yaml" | head -1 | sed 's/.*"\(.*\):.*/\1/')
export db_port
db_port=$(grep ":5432\"\|:3306\"" "${template_project_path}/docker-compose.yaml" | head -1 | sed 's/.*"\(.*\):.*/\1/')
export www_port
www_port=$(grep ":8080\"" "${template_project_path}/docker-compose.yaml" | head -1 | sed 's/.*"\(.*\):.*/\1/')

${taito_setv:-}
./scripts/taito-template/init.sh

shopt -s dotglob

echo "Remove obsolete alternatives"
rm -rf "alternatives"

echo "Remove obsolete root files not to be copied"
rm -f \
  docker-*
  # TODO: also ->
  # README.md \
  # taito-env-all-config.sh \
  # taito-env-prod-config.sh \
  # taito-testing-config.sh \
  # trouble.txt

echo "Mark all configurations as 'done'"
sed -i "s/\[ \] All done/[x] All done/g" CONFIGURATION.md

echo "Copy all root files from template"
(yes | cp * "${template_project_path}" 2> /dev/null || :)

echo "Copy dockerfiles from template"
find . -name "Dockerfile*" -exec cp --parents \{\} "${template_project_path}" \;

# TODO: remove
rm -rf ${template_project_path}/scripts/helm/*

echo "Copy helm scripts from template"
mkdir -p "${template_project_path}/scripts/helm"
yes | cp -f scripts/helm/* "${template_project_path}/scripts/helm"

# TODO: remove
rm -rf "${template_project_path}/scripts/terraform/gcloud"
# TODO: remove
rm -rf "${template_project_path}/scripts/terraform/.terraform"
# TODO: remove
sed -i "s/oldRewritePolicy: false/oldRewritePolicy: true/g" scripts/helm.yaml
# TODO: remove
(yes | cp -f scripts/*.yaml "${template_project_path}/scripts")

echo "Copy terraform scripts from template"
cp -rf scripts/terraform "${template_project_path}/scripts"

echo "Generate README.md links"
(cd "${template_project_path}" && (taito project docs || :))

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
