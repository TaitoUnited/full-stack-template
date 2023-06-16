#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"

set -e

taito::expose_ssh_opts

# TODO: some duplicate code with taito-env-apply#post.sh

echo "[Copy changed secrets to ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:-}
  mkdir -p tmp
  tar -cf "tmp/${taito_namespace}-secrets.tar" -C "secrets/changed/${taito_env}" .
  scp ${ssh_opts} "tmp/${taito_namespace}-secrets.tar" "${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}-secrets.tar"
)
echo

echo "[Execute on ${taito_host}]"
ssh ${ssh_opts} "${taito_host}" "
  sudo bash -c '
    set -e
    ${taito_setv:-}
    echo [Extract /tmp/${taito_namespace}-secrets.tar]
    tar -xf /tmp/${taito_namespace}-secrets.tar -C ${taito_host_dir}/secrets/${taito_env}
    rm -f /tmp/${taito_namespace}-secrets.tar
    echo

    echo [Restart docker-compose]
    cd ${taito_host_dir}
    if [[ -f docker-compose.yaml ]]; then
      docker compose stop || :
      docker compose up -d
    else
      echo File docker-compose.yaml not found. Skipping restart.
    fi
  '
"
echo
