#!/bin/bash -e

: "${template_project_path:?}"

${taito_setv:-}
./scripts/taito-template/init.sh

# Move old files away from project root
(
  set -e
  cd "${template_project_path}"
  rm -rf old_root 2> /dev/null
  mkdir -p old_root
  shopt -s dotglob
  for file in *; do
     if [[ $file != ".git" ]] && \
        [[ $file != "old_root" ]] && \
        [[ $file != "template-tmp" ]]
     then
       mv -- "$file" "old_root"
     fi
  done
)

# Copy all files from template root
rm -rf .git
yes | cp -r * "${template_project_path}" 2> /dev/null || :
yes | cp -r .* "${template_project_path}" 2> /dev/null || :


echo
echo
echo "--- Manual steps ---"
echo
echo "Mandatory:"
echo "- Move files from 'old_root' to the new folder structure and make the project"
echo "  work locally on Docker Compose."
echo "- Configure project (see CONFIGURATION.md)."
echo
echo "Recommended additional steps:"
echo "- Update libraries and other project dependencies."
echo "- Make sure that the project includes at least one end-to-end test that is"
echo "  run automatically by the CI/CD pipeline. The template includes a Cypress example."
echo "  CONFIGURATION.md provides instructions for configuring the tests."
echo
