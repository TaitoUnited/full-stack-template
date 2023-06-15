#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_env:?}"
: "${taito_namespace:?}"
: "${taito_domain:?}"

set -e

taito::expose_ssh_opts

if [[ -d "secrets/changed/${taito_env}" ]]; then
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
fi

echo "[Execute on ${taito_host}]"
ssh ${ssh_opts} "${taito_host}" "
  sudo bash -c '
    set -e
    ${taito_setv:-}
    if [[ -f \"/tmp/${taito_namespace}-secrets.tar\" ]]; then
      echo [Extract /tmp/${taito_namespace}-secrets.tar]
      secret_dir=\"${taito_host_dir}/secrets/${taito_env}\"
      echo \"Making sure directory ${taito_host_dir} exists. If this fails, you may need to\"
      echo \"create the projects directory manually and give proper permissions for users group.\"
      mkdir -p ${taito_host_dir}
      mkdir -p \${secret_dir}
      chmod -R g+w ${taito_host_dir}
      tar -xf /tmp/${taito_namespace}-secrets.tar -C \${secret_dir}
      rm -f /tmp/${taito_namespace}-secrets.tar
      echo
    fi

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
