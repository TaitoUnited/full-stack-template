#!/usr/bin/env bash
: "${taito_target:?}"

set -e
${taito_setv:-}

echo "TODO: Implement. This is only an example implementation."

cd "${taito_target}"
if [[ -f package.json ]]; then
  npm run build
elif [[ -f gradlew ]]; then
  ./gradlew build
elif [[ -f pom.xml ]]; then
  mvn package
elif [[ -f build.xml ]]; then
  ant build
else
  echo "ERROR: Unknown artifact type"
  exit 1
fi
