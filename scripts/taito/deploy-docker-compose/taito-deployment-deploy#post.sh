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

. "${taito_project_path}/scripts/taito/deploy-docker-compose/_config.sh"
taito::expose_ssh_opts

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
  echo "[Using image $image_tag]"
  echo "Deploying untested image because ci_exec_build=true"
  echo
fi

echo "[Starting deployment of image $image_tag]"
echo

deploy_temp_dir="tmp/deploy/${taito_env}"
echo "[Copy files in ${deploy_temp_dir}]"
(
  set -e
  ${taito_setv:-}
  rm -rf "${deploy_temp_dir}" &> /dev/null
  mkdir -p "${deploy_temp_dir}"
  echo docker-compose-remote.yaml
  cp docker-compose-remote.yaml "${deploy_temp_dir}"
  if [[ -f docker-nginx.conf ]]; then
    echo docker-nginx.conf
    cp docker-nginx.conf "${deploy_temp_dir}"
  fi
  if [[ -f database/db.sql ]]; then
    echo database/db.sql
    mkdir -p "${deploy_temp_dir}/database"
    cp database/db.sql "${deploy_temp_dir}/database"
  fi
)
echo

echo "[Substitute environment variables in ${deploy_temp_dir}]"
(
  set -e
  ${taito_setv:-}
  cd "${deploy_temp_dir}"
  mv docker-compose-remote.yaml docker-compose-tmp.yaml
  envsubst < docker-compose-tmp.yaml > docker-compose-remote.yaml
  rm docker-compose-tmp.yaml
)
echo

echo "[Copy ${deploy_temp_dir} to temporary location ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:-}
  cd "${deploy_temp_dir}"
  tar -cf "${taito_namespace}.tar" *
  scp ${ssh_opts} "${taito_namespace}.tar" "${taito_ssh_user}@${taito_host}:/tmp"
)
echo

echo "[Deploy on host ${taito_host}]"
ssh ${ssh_opts} "${taito_ssh_user}@${taito_host}" "
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
    echo [Prune old unused ${taito_project} docker images]
    echo TODO: do not prune images with the given tag ${image_tag}
    docker image prune --force --all \
      --filter \"label=company=${taito_project}\" --filter until=24h
    echo
    echo [Pull container images using the new configuration]
    echo NOTE: Pulling of local-only images will print an error! This is OK.
    docker-compose -f docker-compose-remote.yaml pull || :
    echo
    if [[ -f docker-compose.yaml ]]; then
      echo [Stop docker-compose using the old configuration]
      echo NOTE: Pulling of local-only images will print an error! This is OK.
      docker-compose stop || :
      mv -f docker-compose.yaml docker-compose-previous.yaml
      echo
    fi
    echo [Start docker-compose using the new configuration]
    mv -f docker-compose-remote.yaml docker-compose.yaml
    docker-compose up -d
  '
" || (
  echo "Recent commits in ${taito_branch} branch:"
  git log -10 --pretty=oneline "${taito_branch}"
  exit 1
)

echo
