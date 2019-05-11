#!/bin/bash
: "${taito_ssh_user:?}"
: "${taito_host:?}"
: "${taito_host_dir:?}"
: "${taito_ingress_port:?}"

image_tag=$1

echo "Copying docker-compose-prod.yaml to ${taito_host}:/${taito_host_dir}"
sed "s/__IMAGE_TAG__/${image_tag}" docker-compose-prod.yaml |
  sed "s/__PORT__/${taito_ingress_port}" \
  > docker-compose-prod.yaml.tmp
scp docker-compose-prod.yaml.tmp \
  "${taito_ssh_user}@${taito_host}:${taito_host_dir}/docker-compose-prod.yaml"
rm -f docker-compose-prod.yaml.tmp

echo "Restarting docker-compose on ${taito_host}:/${taito_host_dir}"
ssh "${taito_ssh_user}@${taito_host}" \
  "cd ${taito_host_dir} && docker-compose stop && docker-compose -d up"
