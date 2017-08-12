#!/bin/sh

: "${template_project_path:?}"

echo "- migrate: Move old files away from project root"
rm -rf "${template_project_path}/old_root" 2> /dev/null
mkdir -p "${template_project_path}/old_root"
for file in ${template_project_path}/*; do
   if ! [ -d "$file" ]; then
     mv -- "$file" "${template_project_path}/old_root"
   fi
done

# Upgrade
./scripts/template/upgrade.sh

echo "- migrate: Copy all files from template root"
yes | cp -- * "${template_project_path}" 2> /dev/null
yes | cp -- .* "${template_project_path}" 2> /dev/null

echo "- migrate: Copy files from scripts folder"
cp scripts/* "${template_project_path}/scripts" 2> /dev/null
cp scripts/.* "${template_project_path}/scripts" 2> /dev/null

echo
