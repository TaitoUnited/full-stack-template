provider "aws" {
  region = "${var.taito_provider_region}"
  profile = "${coalesce(var.taito_provider_user_profile, var.taito_organization)}"
  shared_credentials_file = "/home/taito/.aws/credentials"
}

module "common-aws" {
  source = "../common/aws"

  taito_env = "${var.taito_env}"
  taito_domain = "${var.taito_domain}"
  taito_project = "${var.taito_project}"
  taito_provider_region = "${var.taito_provider_region}"
  taito_organization = "${var.taito_organization}"
  taito_vc_repository = "${var.taito_vc_repository}"
  taito_provider_user_profile = "${var.taito_provider_user_profile}"
  taito_targets = "${var.taito_targets}"

  taito_storages = "${var.taito_storages}"
  taito_storage_locations = "${var.taito_storage_locations}"
  taito_storage_classes = "${var.taito_storage_classes}"
  taito_storage_days = "${var.taito_storage_days}"
}
