#!/usr/bin/env bash
: "${taito_target:?}"

set -e
${taito_setv:-}

echo "TODO: Implement. This is only an example implementation."

cd "${taito_target}"
if [[ -f package.json ]]; then
  echo "Here you can, for example, release the artifact to a central repository"
elif [[ -f gradlew ]]; then
  echo "Here you can, for example, release the artifact to a central repository"
elif [[ -f pom.xml ]]; then
  echo "Here you can, for example, release the artifact to a central repository"
elif [[ -f build.xml ]]; then
  echo "Here you can, for example, release the artifact to a central repository"
else
  echo "ERROR: Unknown artifact type"
  exit 1
fi
