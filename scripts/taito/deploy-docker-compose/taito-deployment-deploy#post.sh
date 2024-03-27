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

taito::expose_ssh_opts

export taito_build_image_tag=${1:-$taito_build_image_tag}
if [[ ! $taito_build_image_tag ]]; then
  echo "[Getting commit sha of the latest commit on branch ${taito_branch}]"
  taito_build_image_tag=$(git rev-parse "${taito_branch}")
  echo "Commit SHA: ${taito_build_image_tag}"
  echo
fi

# Add untested prefix
if [[ "${ci_exec_build:-}" == "true" ]] && [[ ${taito_build_image_tag} != *"-untested" ]]; then
  taito_build_image_tag="${taito_build_image_tag}-untested"
  echo "[Using image $taito_build_image_tag]"
  echo "Deploying untested image because ci_exec_build=true"
  echo
fi

echo "[Starting deployment of image $taito_build_image_tag]"
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
  if [[ -f REMOTE.md ]]; then
    cp REMOTE.md "${deploy_temp_dir}/README.md" 2> /dev/null
  fi
  if [[ -f docker-crontab ]]; then
    cp docker-crontab "${deploy_temp_dir}" 2> /dev/null
  fi
  if [[ -f docker-nginx-remote.conf ]]; then
    echo docker-nginx-remote.conf
    cp docker-nginx-remote.conf "${deploy_temp_dir}/docker-nginx.conf"
  elif [[ -f docker-nginx.conf ]]; then
    echo docker-nginx.conf
    cp docker-nginx.conf "${deploy_temp_dir}"
    sed -i "s/http:\/\/${taito_project}/http:\/\/${taito_namespace}/g" "${deploy_temp_dir}/docker-nginx.conf"
  fi
)
echo

function envsubst_file () {
  file=$1
  file_tmp="${1}.tmp"

  if [[ -f ${file} ]]; then
    mv "${file}" "${file_tmp}"
    envsubst < "${file_tmp}" > "${file}"
    rm "${file_tmp}"
  fi
}

echo "[Substitute environment variables in ${deploy_temp_dir}]"
(
  set -e
  ${taito_setv:-}
  cd "${deploy_temp_dir}"
  envsubst_file docker-compose-remote.yaml
  if [[ -f docker-crontab ]]; then
    envsubst_file docker-crontab
  fi
)
echo

echo "[Copy ${deploy_temp_dir} to temporary location ${taito_host}:/tmp]"
(
  set -e
  ${taito_setv:-}
  cd "${deploy_temp_dir}"
  tar -cf "${taito_namespace}.tar" *
  scp ${ssh_opts} "${taito_namespace}.tar" "${taito_host}:/tmp"
)
echo

echo "[Deploy on host ${taito_host}]"
ssh ${ssh_opts} "${taito_host}" "
  bash -c '
    set -e
    ${taito_setv:-}
    cd ${taito_host_dir}
    if [[ ${taito_container_registry} == "local/*" ]] &&
       ! docker images | grep ${taito_container_registry} | grep ${taito_build_image_tag} &> /dev/null; then
      echo
      echo [Check that Docker images exist local registry of remote host]
      echo Latest images on remote host:
      docker images | grep ${taito_container_registry} || :
      echo
      echo ERROR: No image with tag ${taito_build_image_tag} found on remote host
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
    echo TODO: do not prune images with the given tag ${taito_build_image_tag}
    docker image prune --force --all \
      --filter \"label=company=${taito_project}\" --filter until=336h
    echo

    echo [Pull container images using the new configuration]
    docker compose -f docker-compose-remote.yaml pull || :
    echo

    if [[ -f docker-compose.yaml ]]; then
      echo [Stop docker compose using the old configuration]
      docker compose stop || :
      mv -f docker-compose.yaml docker-compose-previous.yaml
      echo
    fi

    echo [Start docker compose using the new configuration]
    mv -f docker-compose-remote.yaml docker-compose.yaml
    docker compose up -d
    echo

    echo [Update docker-crontab if it has changed]
    cronfile=/etc/cron.d/${taito_project}-${taito_env}
    if [[ -f docker-crontab ]] && ! cmp --silent docker-crontab \${cronfile}; then
      echo Updating...
      sudo mv \${PWD}/docker-crontab \${cronfile}
      sudo chown root:root \${cronfile}
    else
      echo Unchanged
      rm -f docker-crontab
    fi
  '
" || (
  echo "Recent commits in ${taito_branch} branch:"
  git log -10 --pretty=oneline "${taito_branch}"
  exit 1
)

echo
