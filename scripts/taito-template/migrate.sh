#!/bin/bash

: "${template_project_path:?}"

# Move old files away from project root
rm -rf "${template_project_path}/old_root" 2> /dev/null
mkdir -p "${template_project_path}/old_root"
for file in ${template_project_path}/*; do
   if ! [ -d "$file" ]; then
     mv -- "$file" "${template_project_path}/old_root"
   fi
done

# Move old scripts to old_scripts
mv "${template_project_path}/scripts" "${template_project_path}/old_scripts" \
  2> /dev/null

# Upgrade
./scripts/taito-template/upgrade.sh

# Copy all files from template root
yes | cp -- * "${template_project_path}" 2> /dev/null
yes | cp -- .* "${template_project_path}" 2> /dev/null

# Copy files from scripts folder
cp scripts/* "${template_project_path}/scripts" 2> /dev/null

echo
