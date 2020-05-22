#!/bin/bash -e

: "${template_project_path:?}"

function get_randomized_port {
  set +e
  grep "$1" "${template_project_path}/docker-compose.yaml" | head -1 | sed 's/.*"\(.*\):.*/\1/'
}

# Read original random ports from docker-compose.yaml
export ingress_port
ingress_port=$(get_randomized_port ":80\"")
export db_port
db_port=$(get_randomized_port ":5432\"\|:3306\"")
export www_port
www_port=$(get_randomized_port ":8080\"")
export server_debug_port
server_debug_port=$(get_randomized_port ":9229\"")

${taito_setv:-}
./scripts/taito-template/init.sh

shopt -s dotglob

echo "Remove obsolete alternatives"
rm -rf "alternatives" || :

echo "Remove obsolete files not to be copied"
rm -f \
  docker-* \
  README.md \
  TROUBLE.txt \
  scripts/taito/*.sh

echo "Move/remove files of project based on older template"
if [[ -f "${template_project_path}/taito-provider-config.sh" ]]; then
  (
    cd "${template_project_path}"
    mkdir -p scripts/taito/config || :
    rm -rf CONFIGURATION.md || :
    rm -rf DEVELOPMENT.md || :
    mv taito-env-prod-config.sh scripts/taito/prod-env.sh || :
    mv taito-project-config.sh scripts/taito/project.sh || :
    mv taito-testing-config.sh scripts/taito/testing.sh || :
    rm -rf taito*config.sh || :
  )
fi

echo "Mark all configurations as 'done'"
sed -i "s/\[ \] All done/[x] All done/g" scripts/taito/CONFIGURATION.md

echo "Copy taito scripts from template"
mkdir -p "${template_project_path}/scripts/taito"
yes | cp -rf scripts/taito/* "${template_project_path}/scripts/taito"

echo "Copy all root files from template"
(yes | cp * "${template_project_path}" 2> /dev/null || :)

echo "Copy dockerfiles from template"
find . -name "Dockerfile*" -exec cp --parents \{\} "${template_project_path}" \;

echo "Copy helm scripts from template"
mkdir -p "${template_project_path}/scripts/helm"
yes | cp -f scripts/helm/* "${template_project_path}/scripts/helm"

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
echo "- Compare scripts/taito/*.sh with the template"
echo "- Compare package.json with the template"
echo
