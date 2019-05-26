provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.taito_provider_region}"
  zone = "${var.taito_provider_zone}"
}

module "common-gcp" {
  source = "../common/gcp"

  taito_project = "${var.taito_project}"
  taito_env = "${var.taito_env}"
  taito_domain = "${var.taito_domain}"
  taito_zone = "${var.taito_zone}"
  taito_namespace = "${var.taito_namespace}"
  taito_resource_namespace = "${var.taito_resource_namespace}"
  taito_resource_namespace_id = "${var.taito_resource_namespace_id}"
  taito_provider = "${var.taito_provider}"
  taito_provider_region = "${var.taito_provider_region}"
  taito_provider_zone = "${var.taito_provider_zone}"
  taito_organization = "${var.taito_organization}"
  taito_organization_abbr = "${var.taito_organization_abbr}"

  taito_storages = "${var.taito_storages}"
  taito_storage_locations = "${var.taito_storage_locations}"
  taito_storage_classes = "${var.taito_storage_classes}"
  taito_storage_days = "${var.taito_storage_days}"

  taito_backup_locations = "${var.taito_backup_locations}"
  taito_backup_days = "${var.taito_backup_days}"

  gcp_service_account_enabled = "${var.gcp_service_account_enabled}"
}
