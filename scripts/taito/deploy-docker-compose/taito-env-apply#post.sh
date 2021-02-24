#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"
: "${taito_domain:?}"

set -e

. "${taito_project_path}/scripts/taito/deploy-docker-compose/_config.sh"
taito::expose_ssh_opts

echo "[Copy changed secrets to ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:-}
  mkdir -p tmp
  tar -cf "tmp/${taito_namespace}-secrets.tar" -C "secrets/changed/${taito_env}" .
  scp ${ssh_opts} "tmp/${taito_namespace}-secrets.tar" "${taito_ssh_user}@${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}-secrets.tar"
)
echo

echo "[Execute on ${taito_host}]"
ssh ${ssh_opts} "${taito_ssh_user}@${taito_host}" "
  ${LINUX_SUDO} bash -c '
    set -e
    ${taito_setv:-}
    echo [Extract /tmp/${taito_namespace}-secrets.tar]
    mkdir -p ${taito_host_dir}/secrets/${taito_env}
    tar -xf /tmp/${taito_namespace}-secrets.tar -C ${taito_host_dir}/secrets/${taito_env}
    rm -f /tmp/${taito_namespace}-secrets.tar
    echo

    if which createtaitosite &> /dev/null; then
      createtaitosite ${taito_namespace} ${taito_domain} $LINUX_CLIENT_MAX_BODY_SIZE
    else
      echo NOTE: createtaitosite command does not exist.
      echo Configure routing for domain ${taito_domain} yourself.
      echo Press enter to continue.
      read -r
    fi
  '
"
