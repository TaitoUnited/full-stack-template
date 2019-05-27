#!/bin/bash

# Enable run plugin
taito_plugins="
  run:-local
  ${taito_plugins}
"
run_scripts_location="scripts/custom-provider"

# Do not use Docker, Kubernetes and Helm on remote environments
taito_plugins="${taito_plugins/docker /docker:local }"
taito_plugins="${taito_plugins/kubectl:-local/}"
taito_plugins="${taito_plugins/helm:-local/}"
