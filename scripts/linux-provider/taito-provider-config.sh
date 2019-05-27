#!/bin/bash

# Enable ssh and run plugins
taito_plugins="
  ssh:-local
  run:-local
  ${taito_plugins}
"
run_scripts_location="scripts/linux-provider"

# Set some configuration parameters for scripts/linux-provider scripts
LINUX_SUDO=sudo # NOTE: Put empty value if sudo is not required or allowed
LINUX_CLIENT_MAX_BODY_SIZE=1m

# Use Docker Compose instead of Kubernetes and Helm
taito_plugins="${taito_plugins/docker-compose:local/docker-compose}"
taito_plugins="${taito_plugins/kubectl:-local/}"
taito_plugins="${taito_plugins/helm:-local/}"

# Use SSH plugin as database proxy
export ssh_db_proxy="\
  -L 0.0.0.0:\${database_port}:\${database_host}:\${database_real_port} \${taito_ssh_user}@\${database_real_host}"
export ssh_forward_for_db="${ssh_db_proxy}"
