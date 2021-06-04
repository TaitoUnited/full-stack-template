#!/bin/sh

# You can execute CLI commands manually with
# `taito exec:server:ENV ./execute.sh COMMAND [ARGS]` or you can schedule
# execution with cronjobs (see `scripts/helm/examples.yaml` for examples).

if [ -f ./src/cli.js ]; then
  # Production
  node ./src/cli.js ${@}
else
  # Development
  npx ts-node -T ./src/cli.ts ${@}
fi
