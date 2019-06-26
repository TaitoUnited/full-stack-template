#!/bin/bash -e

: "${template_project_path:?}"

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
  # taito-domain-config.sh \
  # taito-environments-config.sh \
  # taito-test-config.sh \
  # trouble.txt

echo "Mark all configurations as 'done'"
sed -i "s/\[ \] All done/[x] All done/g" CONFIGURATION.md

echo "Copy all root files from template"
(yes | cp * "${template_project_path}" 2> /dev/null || :)

echo "Copy dockerfiles from template"
find . -name "Dockerfile*" -exec cp --parents \{\} "${template_project_path}" \;

echo "Copy helm scripts from template"
mkdir -p "${template_project_path}/scripts/helm"
yes | cp -f scripts/helm/* "${template_project_path}/scripts/helm"

# TODO: remove
rm -rf "${template_project_path}/scripts/terraform/gcloud"
# TODO: remove
(yes | cp -f scripts/*.yaml "${template_project_path}/scripts")
# TODO: remove
sed -i "s/oldRewritePolicy: false/oldRewritePolicy: true/g" scripts/helm.yaml

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
