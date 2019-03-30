#!/bin/bash -e

: "${template_project_path:?}"

# Init
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
yes | cp -- * "${template_project_path}" 2> /dev/null
yes | cp -- .* "${template_project_path}" 2> /dev/null

echo
echo
echo "--- Manual steps ---"
echo
echo "Your old files are located in 'old_root/'. Move files to correct locations"
echo "using the new folder structure and make it work locally on Docker Compose first."
echo
