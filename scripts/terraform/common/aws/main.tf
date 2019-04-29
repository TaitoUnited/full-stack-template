provider "aws" {
  region = "${var.taito_provider_region}"
  profile = "${coalesce(var.taito_provider_user_profile, var.taito_organization)}"
  shared_credentials_file = "/home/taito/.aws/credentials"
}

# TODO: create service account for accessing resources
