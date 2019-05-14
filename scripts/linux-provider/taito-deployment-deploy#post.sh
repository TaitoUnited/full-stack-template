#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_namespace:?}"
: "${taito_target_env:?}"
: "${taito_branch:?}"

set -e

image_tag=$1
if [[ ! $image_tag ]]; then
  image_tag=$(git rev-parse "${taito_branch}")
fi

# Add untested prefix
if [[ "${ci_exec_build:-}" == "true" ]]; then
  image_tag="${image_tag}-untested"
fi

echo "[Starting deployment of image $image_tag]"
echo
echo "NOTE: Deployment is done using the taito-config.sh and"
echo "docker-compose-remote.yaml currently located on your local directory."
echo

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

echo "[Copy docker-compose-remote.yaml to ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:?}
  mkdir -p tmp
  tar -cf "tmp/${taito_namespace}.tar" docker-compose-remote.yaml docker-nginx.conf taito-config.sh
  scp ${opts} "tmp/${taito_namespace}.tar" "${taito_ssh_user}@${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}.tar"
)
echo

echo "[Execute on ${taito_host}]"
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    set -e
    ${taito_setv:?}
    cd ${taito_host_dir}
    echo
    echo [Extract /tmp/${taito_namespace}.tar]
    tar -xf /tmp/${taito_namespace}.tar -C .
    rm -f /tmp/${taito_namespace}.tar
    mv -f docker-compose-remote.yaml docker-compose.yaml
    echo
    echo [Replace port and image tag in docker-compose.yaml]
    PORT=\$(getsiteport ${taito_namespace})
    sed -i s/__PORT__/\${PORT}/ docker-compose.yaml
    sed -i s/__IMAGE_TAG__/${image_tag}/ docker-compose.yaml
    echo
    echo [Modify taito-config.sh]
    sed -i \"1 ataito_target_env=${taito_target_env}\" taito-config.sh
    sed -i \"1 aset -a\" taito-config.sh
    echo set +a >> taito-config.sh
    sed -i /taito_util_path/d taito-config.sh
    echo
    echo [Set environment variables]
    . taito-config.sh
    echo
    echo [Pull new container images]
    echo NOTE: Pulling of local-only images will print an error! This is OK.
    (docker-compose pull || :)
    echo
    echo [Restart docker-compose]
    docker-compose stop
    docker-compose up -d
  '
"
echo
