#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_namespace:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

set -e

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

echo "[Execute on ${taito_host}]"
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    set -e
    ${taito_setv:?}
    if which deletesite &> /dev/null; then
      deletesite ${taito_namespace}
    else
      echo NOTE: deletesite command does not exist.
      echo You have to remove routing for domain ${taito_domain} yourself.
      echo Press enter to continue.
      read -r
    fi
  '
"
