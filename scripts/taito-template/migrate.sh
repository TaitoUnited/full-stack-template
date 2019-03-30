#!/bin/bash -e

: "${template_project_path:?}"

# Init
./scripts/taito-template/init.sh

# Move old files away from project root
rm -rf "${template_project_path}/old_root" 2> /dev/null
mkdir -p "${template_project_path}/old_root"
mv !(.git) old_root

# Copy all files from template root
rm -rf .git
yes | cp -- * "${template_project_path}" 2> /dev/null
yes | cp -- .* "${template_project_path}" 2> /dev/null

echo
