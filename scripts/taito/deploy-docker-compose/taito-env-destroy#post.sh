#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_namespace:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

set -e

taito::expose_ssh_opts

echo "[Execute on ${taito_host}]"
ssh ${ssh_opts} "${taito_host}" "
  sudo bash -c '
    set -e
    ${taito_setv:-}
    if which deletetaitosite &> /dev/null; then
      deletetaitosite ${taito_namespace}
    else
      echo NOTE: deletetaitosite command does not exist.
      echo You have to remove routing for domain ${taito_domain} yourself.
      echo Press enter to continue.
      read -r
    fi

    echo [Stop docker-compose]
    if cd ${taito_host_dir} &> /dev/null; then
      docker compose stop
    else
      echo "Directory ${taito_host_dir} has already been deleted."
    fi
  '
"
