#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

TEMPLATE=/etc/nginx/templates/taito-site-template
CLIENT_MAX_BODY_SIZE=32m
# TODO PORT
taito_ingress_port=8080

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

${taito_setv:?}
ssh ${opts} "${taito_ssh_user}@${taito_host}" "
  sudo bash -c '
    echo Making sure ${taito_host_dir} directory exists on host ${taito_host} &&
    mkdir -p ${taito_host_dir} &&
    if [[ -f $TEMPLATE ]]; then
      echo Add site ${taito_namespace} and restart nginx &&
      sed s/NAME/${taito_namespace}/g $TEMPLATE | \
        sed s/DOMAIN/${taito_domain}/g | \
        sed s/PORT/${taito_ingress_port}/g | \
        sed s/CLIENT_MAX_BODY_SIZE/${CLIENT_MAX_BODY_SIZE}/g \
          > /etc/nginx/sites-available/${taito_namespace} &&
      rm -f /etc/nginx/sites-enabled/${taito_namespace} &&
      ln -s /etc/nginx/sites-available/${taito_namespace} \
        /etc/nginx/sites-enabled/${taito_namespace} &&
      service nginx restart;
    else
      echo File $TEMPLATE does not exist. &&
      echo Configure routing for domain ${taito_domain} yourself. &&
      echo Press enter to continue &&
      read -r;
    fi
  '
"

#  |
#   sed s/DOMAIN/${taito_domain}/g |
#   sed s/PORT/${taito_ingress_port}/g |
#   sed s/CLIENT_MAX_BODY_SIZE/${CLIENT_MAX_BODY_SIZE}/g \
