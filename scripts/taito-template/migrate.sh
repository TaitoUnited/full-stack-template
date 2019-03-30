#!/bin/bash -e

: "${template_project_path:?}"

# Init
./scripts/taito-template/init.sh

# Move old files away from project root
rm -rf "${template_project_path}/old_root" 2> /dev/null
mkdir -p "${template_project_path}/old_root"
shopt -s extglob dotglob
mv !(old_root) old_root
shopt -u extglob dotglob
mv old_root/.git .

# Copy all files from template root
rm -rf .git
yes | cp -- * "${template_project_path}" 2> /dev/null
yes | cp -- .* "${template_project_path}" 2> /dev/null

echo
echo
echo "--- Manual steps ---"
echo
echo "Your old files are located in 'old_root/'. Move files to correct locations"
echo "using the new folder structure and make it work locally on Docker Compose first."
echo
