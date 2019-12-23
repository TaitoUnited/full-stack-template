#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_namespace:?}"
: "${taito_target_env:?}"
: "${taito_branch:?}"
: "${taito_container_registry:?}"
: "${taito_project:?}"
: "${taito_basic_auth_enabled:?}"

set -e

. "${taito_project_path}/scripts/linux-provider/_config.sh"
. "${taito_cli_path}/plugins/ssh/util/opts.sh"

image_tag=$1
if [[ ! $image_tag ]]; then
  echo "[Getting commit sha of the latest commit on branch ${taito_branch}]"
  image_tag=$(git rev-parse "${taito_branch}")
  echo "Commit SHA: ${image_tag}"
  echo
fi

# Add untested prefix
if [[ "${ci_exec_build:-}" == "true" ]] && [[ ${image_tag} != *"-untested" ]]; then
  image_tag="${image_tag}-untested"
fi

echo "[Starting deployment of image $image_tag]"
echo "NOTE: Deployment is done using the taito-config.sh and"
echo "docker-compose-remote.yaml currently located on your local directory."
echo

echo "[Copy docker-compose-remote.yaml to ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:-}
  mkdir -p tmp
  files="docker-compose-remote.yaml docker-nginx.conf taito-config.sh scripts/taito/*.sh scripts/taito/config/*.sh"
  if [[ -f database/db.sql ]]; then
    files="$files database/db.sql"
  fi
  tar -cf "tmp/${taito_namespace}.tar" $files
  scp ${opts} "tmp/${taito_namespace}.tar" "${taito_ssh_user}@${taito_host}:/tmp"
  rm -f "tmp/${taito_namespace}.tar"
)
echo

echo "[Execute on host ${taito_host}]"
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  ${LINUX_SUDO} bash -c '
    set -e
    ${taito_setv:-}
    cd ${taito_host_dir}
    echo
    echo [Check that Docker images exist]
    if ! docker images | grep ${taito_container_registry} | grep ${image_tag} &> /dev/null; then
      echo Latest images on remote host:
      docker images | grep ${taito_container_registry}
      echo
      echo ERROR: No image with tag ${image_tag}
      exit 1
    fi
    echo
    echo [Extract configuration files from /tmp/${taito_namespace}.tar]
    tar -xf /tmp/${taito_namespace}.tar -C .
    rm -f /tmp/${taito_namespace}.tar
    echo
    echo [Replace port and image tag in docker-compose-remote.yaml]
    PORT=\$(gettaitositeport ${taito_namespace} 2> /dev/null || :)
    if [[ ! \${PORT} ]]; then
      PORT=\$(cat PORT 2> /dev/null || :)
    fi
    if [[ ! \${PORT} ]]; then
      echo NOTE: gettaitositeport command does not exist.
      echo Internal ingress port cannot be determined automatically.
      echo Give internal ingress port:
      read -r PORT
      printf \"%s\" \$PORT > PORT
    fi
    sed -i \"s/_PORT_/\${PORT}/g\" docker-compose-remote.yaml
    sed -i \"s/_IMAGE_TAG_/${image_tag}/g\" docker-compose-remote.yaml
    echo
    if [[ ${taito_basic_auth_enabled} != false ]]; then
      echo [Enable basic auth]
      sed -i \"s/# auth_basic/auth_basic/\" docker-nginx.conf
      if ! grep \"^[[:space:]]*auth_basic\" docker-nginx.conf &> /dev/null; then
        echo ERROR: Basic auth not enabled
        exit 1
      fi
      echo
    fi
    echo [Modify scripts/taito/config/main.sh]
    sed -i \"3 ataito_target_env=${taito_target_env}\" scripts/taito/config/main.sh
    sed -i /taito_util_path/d scripts/taito/config/main.sh
    echo
    echo [Prune old unused ${taito_project} docker images]
    echo TODO: do not prune images with the given tag ${image_tag}
    docker image prune --force --all \
      --filter \"label=company=${taito_project}\" --filter until=24h
    echo
    echo [Pull container images using the new configuration]
    echo NOTE: Pulling of local-only images will print an error! This is OK.
    (. taito-config.sh && docker-compose -f docker-compose-remote.yaml pull || :)
    echo
    echo [Stop docker-compose using the old configuration]
    echo NOTE: Pulling of local-only images will print an error! This is OK.
    (. taito-config.sh && docker-compose stop || :)
    echo
    echo [Start docker-compose using the new configuration]
    . taito-config.sh
    mv -f docker-compose-remote.yaml docker-compose.yaml
    docker-compose up -d
  '
" || (
  echo "Recent commits in ${taito_branch} branch:"
  git log -10 --pretty=oneline "${taito_branch}"
  exit 1
)

echo
