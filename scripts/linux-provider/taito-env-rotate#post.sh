#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

# TODO: duplicate code with taito-env-apply#post.sh

echo "[Copy changed secrets to ${taito_host}:/tmp]"
(
  ${taito_setv:?}
  mkdir -p tmp
  tar -cf "tmp/${taito_namespace}-secrets.tar" -C "secrets/changed/${taito_env}" .
  scp ${opts} "tmp/${taito_namespace}-secrets.tar" "${taito_ssh_user}@${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}-secrets.tar"
)
echo

echo "[Execute on ${taito_host}]"
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    ${taito_setv:?} &&
    echo [Extract /tmp/${taito_namespace}-secrets.tar] &&
    mkdir -p ${taito_host_dir}/secrets/${taito_env} &&
    tar -xf /tmp/${taito_namespace}-secrets.tar -C ${taito_host_dir}/secrets/${taito_env} &&
    rm -f /tmp/${taito_namespace}-secrets.tar &&
    echo &&

    echo [Restart docker-compose] &&
    docker-compose -f docker-compose-remote.yaml stop &&
    docker-compose -f docker-compose-remote.yaml -d up
  '
"
echo
