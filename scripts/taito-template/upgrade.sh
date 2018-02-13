#!/bin/bash

: "${template_project_path:?}"
: "${template_project:?}"

echo
./scripts/taito-template/init.sh

echo "- upgrade: Copy files from template to project"
cp README.md "${template_project_path}"
cp cloudbuild.yaml "${template_project_path}"
mkdir -p "${template_project_path}/scripts"
rm -rf "${template_project_path}/scripts/helm" 2> /dev/null
cp -r "scripts/helm" "${template_project_path}/scripts/helm" 2> /dev/null

echo
