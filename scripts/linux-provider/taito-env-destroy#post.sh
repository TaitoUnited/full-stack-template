#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

${taito_setv:?}
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    echo Delete directory ${taito_host_dir} &&
    rm -rf ${taito_host_dir} &&
    if [[ -f /etc/nginx/sites-available/${taito_namespace} ]]; then
      echo Delete site ${taito_namespace} and restart nginx &&
      rm -f /etc/nginx/sites-enabled/${taito_namespace} &&
      rm -f /etc/nginx/sites-available/${taito_namespace} &&
      service nginx restart;
    else
      echo File /etc/nginx/sites-available/${taito_namespace} does not exist. &&
      echo You have to remove routing for domain ${taito_domain} yourself. &&
      echo Press enter to continue. &&
      read -r;
    fi
  '
"
