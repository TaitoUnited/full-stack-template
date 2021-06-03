#!/bin/sh

# You can execute commands defined in ./src/commands.ts by running
# './execute.sh myCommand [ARGS...]' on command line.

if [ -f ./src/commands.js ]; then
  # Production
  node ./src/commands.js ${@}
else
  # Development
  npx ts-node -T ./src/commands.ts ${@}
fi
