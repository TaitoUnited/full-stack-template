#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"
: "${taito_domain:?}"

set -e

CLIENT_MAX_BODY_SIZE=1m

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

echo "[Copy changed secrets to ${taito_host}:/tmp]"
(
  set -e
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
    set -e
    ${taito_setv:?}
    echo [Extract /tmp/${taito_namespace}-secrets.tar]
    mkdir -p ${taito_host_dir}/secrets/${taito_env}
    tar -xf /tmp/${taito_namespace}-secrets.tar -C ${taito_host_dir}/secrets/${taito_env}
    rm -f /tmp/${taito_namespace}-secrets.tar
    echo

    if which createsite &> /dev/null; then
      createsite ${taito_namespace} ${taito_domain} $CLIENT_MAX_BODY_SIZE
    else
      echo NOTE: createsite command does not exist.
      echo Configure routing for domain ${taito_domain} yourself.
      echo Press enter to continue
      read -r
    fi
  '
"
