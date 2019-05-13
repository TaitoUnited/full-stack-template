#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_namespace:?}"
: "${taito_target_env:?}"

image_tag=$1
if [[ ! $image_tag ]]; then
  image_tag=$(git rev-parse "${taito_branch:-dev}")
  echo "Image tag not given. Using commit sha $image_tag as image tag."
  echo
fi

echo
echo "NOTE: Deployment is done using the taito-config.sh and"
echo "docker-compose-remote.yaml currently located on your local directory."
echo

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

echo "[Copy docker-compose-remote.yaml to ${taito_host}:/tmp]"
(
  ${taito_setv:?}
  mkdir -p tmp
  tar -cf "tmp/${taito_namespace}.tar" docker-compose-remote.yaml taito-config.sh
  scp ${opts} "tmp/${taito_namespace}.tar" "${taito_ssh_user}@${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}.tar"
)
echo

echo "[Execute on ${taito_host}]"
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    ${taito_setv:?} &&
    cd ${taito_host_dir} &&
    echo &&
    echo [Extract /tmp/${taito_namespace}.tar] &&
    tar -xf /tmp/${taito_namespace}.tar -C . &&
    rm -f /tmp/${taito_namespace}.tar &&
    echo &&
    echo [Replace port and image tag in docker-compose-remote.yaml] &&
    PORT=\$(getsiteport ${taito_namespace}) &&
    sed -i s/__PORT__/\${PORT}/ docker-compose-remote.yaml &&
    sed -i s/__IMAGE_TAG__/${image_tag}/ docker-compose-remote.yaml &&
    echo &&
    echo [Set environment in taito-config.sh] &&
    sed -i \"1 ataito_target_env=${taito_target_env}\" taito-config.sh &&
    sed -i /taito_util_path/d taito-config.sh &&
    echo &&
    echo [Set environment variables] &&
    set -a &&
    taito_target_env=${taito_target_env} &&
    . taito-config.sh &&
    set +a &&
    echo &&
    echo [Restart docker-compose] &&
    docker-compose -f docker-compose-remote.yaml stop &&
    docker-compose -f docker-compose-remote.yaml -d up
  '
"
echo
