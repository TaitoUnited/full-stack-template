#!/bin/bash

set -a
taito_host_uname=$(uname)
dockerfile=Dockerfile
taito_target_env=local
. taito-config.sh
set +a
