#!/bin/bash

: "${taito_env:?}"
: "${gcloud_resource_project_id:?}"

terraform import -state="./${taito_env}/terraform.tfstate" \
  google_project.resource_project "${gcloud_resource_project_id}"

# terraform import -state="./${taito_env}/terraform.tfstate" \
#   google_project_services.resource_project_services \
#   "${gcloud_resource_project_id}"
