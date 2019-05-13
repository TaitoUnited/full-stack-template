#!/bin/bash
: "${taito_cli_path:?}"
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"

image_tag=$1
# TODO PORT
taito_ingress_port=8080

. "${taito_cli_path}/plugins/ssh/util/opts.sh"

echo "Copying docker-compose-prod.yaml to ${taito_host}:/${taito_host_dir}"
sed "s/__IMAGE_TAG__/${image_tag}" docker-compose-prod.yaml |
  sed "s/__PORT__/${taito_ingress_port}" \
  > docker-compose-prod.yaml.tmp
(
  ${taito_setv:?}
  scp ${opts} docker-compose-prod.yaml.tmp \
    "${taito_ssh_user}@${taito_host}:${taito_host_dir}/docker-compose-prod.yaml"
)
rm -f docker-compose-prod.yaml.tmp

echo "Restarting docker-compose on ${taito_host}:/${taito_host_dir}"
(
  ${taito_setv:?}
  ssh ${opts} "${taito_ssh_user}@${taito_host}" "
    sudo bash -c '
      cd ${taito_host_dir} && docker-compose stop && docker-compose -d up
    '
  "
)
