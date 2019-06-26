#!/bin/bash -e

: "${template_project_path:?}"

${taito_setv:-}
./scripts/taito-template/init.sh

shopt -s dotglob

echo "Remove old root files and scripts"
rm -f "${template_project_path}/*"
rm -rf "${template_project_path}/scripts"

echo "Copy root files from template"
(yes | cp * "${template_project_path}" 2> /dev/null || :)

echo "Copy dockerfiles from template"
find . -name "Dockerfile*" -exec cp --parents \{\} "${template_project_path}" \;

echo "Copy scripts from template"
yes | cp -rf scripts "${template_project_path}"

echo
echo
echo "--- Manual steps ---"
echo
echo "Mandatory:"
echo "1) Review all changes."
echo "2) Make the project work locally by adding a 'start' script to each"
echo "   **/package.json file, and by defining environment variables and secrets"
echo "   in docker-compose.yaml. The project should start locally with 'taito kaboom'."
echo "3) Modify all **/package.json files so that they provide scripts required"
echo "   by the CI/CD build (build:prod, lint, unit, test)"
echo "4) Configure the project as usual (see CONFIGURATION.md)."
echo
echo "Recommended additional steps:"
echo "- Update libraries and other project dependencies."
echo "- Make sure that the project includes at least one end-to-end test that is"
echo "  run automatically by the CI/CD pipeline. The template includes a Cypress example."
echo "  CONFIGURATION.md provides instructions for configuring the tests."
echo
