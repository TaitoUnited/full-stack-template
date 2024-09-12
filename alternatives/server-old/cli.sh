#!/bin/sh

# ------------------------------------------------------------------
# CLI commands for cronjobs, etc.
#
# You can execute CLI commands manually with:
# taito exec:server:ENV ./cli.sh COMMAND [ARGS...]
#
# You can also schedule CLI command execution with cronjobs. See
# `scripts/helm/examples.yaml` for examples.
# ------------------------------------------------------------------

if [ -f ./src/cli.js ]; then
  # Production
  node ./src/cli.js ${@}
else
  # Development
  npx ts-node -T ./src/cli.ts ${@}
fi
