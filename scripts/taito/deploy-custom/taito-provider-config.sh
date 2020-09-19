#!/bin/bash

echo "TODO: Implement. This is only an example taito-provider-config.sh"

# Enable run plugin
taito_plugins="
  run:-local
  ${taito_plugins}
"
run_scripts_location="scripts/taito/deploy-docker-compose"

# Do not use Docker, Kubernetes and Helm on remote environments
taito_plugins="${taito_plugins/docker /docker:local }"
taito_plugins="${taito_plugins/kubectl:-local/}"
taito_plugins="${taito_plugins/helm:-local/}"
