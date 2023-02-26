#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"

set -e

secrets_filter=$1

taito::expose_ssh_opts

echo "[Copy secrets from ${taito_host}]"
(
  set -e
  ${taito_setv:-}
  mkdir -p "./secrets/${taito_env}"
  scp ${ssh_opts} "${taito_host}:${taito_host_dir}/secrets/${taito_env}/*${secrets_filter}*" "./secrets/${taito_env}" || \
    echo "Warning: No secrets found with filter '${secrets_filter}'" 
)
