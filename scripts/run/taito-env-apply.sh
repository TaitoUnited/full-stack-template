#!/bin/bash
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

echo "Making sure ${taito_host_dir} directory exists on host ${taito_host}"
ssh "${taito_ssh_user}@${taito_host}" "mkdir -p ${taito_host_dir}"

echo "Configuring nginx routing"
echo "TODO"
