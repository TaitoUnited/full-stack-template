#!/bin/bash

set -e
hook_command="$1"
entry_title="$2"
lock_name="${3:-$hook_command}"

# -------------------------------------------------------------------
# Prepare
# -------------------------------------------------------------------

# Read secrets
if [[ -f /run/secrets/SLACK_WEBHOOK_URL ]]; then
  export SLACK_WEBHOOK_URL
  SLACK_WEBHOOK_URL=$(cat /run/secrets/SLACK_WEBHOOK_URL)
fi
if [[ -f /run/secrets/VC_TOKEN ]]; then
  export VC_TOKEN
  VC_TOKEN=$(cat /run/secrets/VC_TOKEN)
fi

# Set working directory based on VC_PULL_ENABLED
DIR_SUFFIX=
if [[ "${VC_PULL_ENABLED}" == "true" ]]; then
  # Use cloned git repository instead
  DIR_SUFFIX=/repository/www
fi

# -------------------------------------------------------------------
# Locking (builds are executed in series)
#
# Implemented here because webhook does not yet support it
# https://github.com/adnanh/webhook/issues/148
# -------------------------------------------------------------------

LOCKDIR=".webhook-${lock_name//:/_}-lock"

function acquireLock() {
  for i in `seq 1 900`; do
    if mkdir $LOCKDIR; then
      echo "Acquired lock '$LOCKDIR'"
      return
    fi
    echo "Waiting for lock '$LOCKDIR' $i"
    sleep 1
  done
  echo "ERROR: Failed to acquire lock '$LOCKDIR'"
  exit 1
}

function releaseLock() {
  if ! rmdir $LOCKDIR; then
    echo "ERROR: Failed to remove lock directory '$LOCKDIR'"
    exit 1
  fi
}

# -------------------------------------------------------------------
# Messaging
# -------------------------------------------------------------------

function send_slack_message() {
  local message=$1
  local webhook_url=$2
  local channel=$3

  if [[ -n "${webhook_url}" ]]; then
    curl -X POST \
      -H 'Content-type: application/json' \
      --data "{\"channel\":\"${channel}\",\"text\":\"${message}\"}" \
      "${webhook_url}"
  fi
}

function notify() {
  local command=$1
  local status=$2

  local startedMessage="$command started"
  local finishedMessage="$command finished"
  local failedMessage="$command failed"
  local unknownStatusMessage=":$command $status"
  local site_url="${WEBSITE_URL}"

  case $command in
    deployment)
      startedMessage="Started a new deployment..."
      finishedMessage="Successfully deployed"
      failedMessage="Failed to deploy"
      ;;
    build)
      startedMessage="Started build..."
      finishedMessage="Successfully built"
      failedMessage="Failed to build"
      ;;
    publish:preview)
      startedMessage="Started publishing preview for '${entry_title}'..."
      finishedMessage="Successfully published preview for '${entry_title}'"
      failedMessage="Failed to publish preview"
      site_url="${WEBSITE_URL}/preview/"
      ;;
    publish)
      startedMessage="Started publishing '${entry_title}'..."
      finishedMessage="Successfully published '${entry_title}'"
      failedMessage="Failed to publish"
      ;;
  esac

  local message=
  case $status in
    STARTED)
      message=":arrow_forward: $startedMessage $site_url"
      ;;
    FINISHED)
      message=":white_check_mark: $finishedMessage $site_url"
      ;;
    FAILED)
      message=":x: $failedMessage $site_url"
      ;;
    *)
      message=":question: $unknownStatusMessage $site_url"
      ;;
  esac

  echo "Sending slack message: ${message}"
  send_slack_message "${message}" "${SLACK_WEBHOOK_URL}" "${SLACK_CHANNEL}"
}

function finish {
  releaseLock
  if [[ $? == 0 ]]; then
    notify "$hook_command" "FINISHED"
  else
    notify "$hook_command" "FAILED"
  fi
}

# -------------------------------------------------------------------
# Build
# -------------------------------------------------------------------

function full_build() {
  local command=$1
  local dir=$2
  local pull_changes=$3
  cd "${dir}${DIR_SUFFIX}"
  if [[ "${pull_changes}" == "true" ]]; then
    git pull
  fi
  npm run "${command}"
}

function exec_hook_command() {
  local command=$1
  echo "Executing command: ${command}"

  if [[ "${command}" == "deployment" ]]; then
    # Copy the original build to the empty shared volume
    mkdir -p /build
    if [[ -z "$(ls -A /build)" ]]; then
      cp -rf /build-orig/* /build
    fi

    if [[ "${VC_PULL_ENABLED}" == "true" ]]; then
      # Clone git repository and install libraries for real-time full builds
      cd /develop
      git clone "https://${VC_TOKEN}@${VC_REPOSITORY_URL}" repository
      cd "/develop${DIR_SUFFIX}"
      git checkout "${COMMON_ENV/prod/master}"
      npm run install-site
      cp -r /develop/repository /preview/repository
    fi
  elif [[ "${command}" == "build" ]]; then
    full_build build:preview /preview "${VC_PULL_ENABLED}"
    full_build build /develop "${VC_PULL_ENABLED}"
  elif [[ "${command}" == "publish:preview" ]]; then
    # Partially build the preview site
    (cd "/preview${DIR_SUFFIX}" && npm run publish:preview)
  elif [[ "${command}" == "publish" ]]; then
    # Partially build the real site
    (cd "/develop${DIR_SUFFIX}" && npm run publish)
  else
    echo "Unknown command: ${command}"
    exit 1
  fi
}

# -------------------------------------------------------------------
# Main
# -------------------------------------------------------------------

acquireLock
trap finish EXIT
notify "$hook_command" "STARTED"
exec_hook_command "$hook_command"
