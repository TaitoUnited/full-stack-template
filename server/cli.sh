#!/bin/sh

# -------------------------------------------------------------------------
# CLI commands for:
# 
# - Executing scheduled cron jobs (e.g. as Kubernetes cronjobs)
# - Executing single jobs (e.g. as Kubernetes jobs)
# - Running the server container image in a 'worker' mode.
# - Executing misc stuff for development or maintenance purposes.
#
# Examples on how to use these on Kubernetes: `scripts/helm/examples.yaml`
#
# TIP: You can execute CLI commands manually inside the container with:
# taito exec:server:ENV ./cli.sh COMMAND [ARGS...]
# -------------------------------------------------------------------------

if [ -f ./src/cli.js ]; then
  # Production
  node ./cli.js ${@}
else
  # Development
  npx ts-node -T ./cli.ts ${@}
fi
