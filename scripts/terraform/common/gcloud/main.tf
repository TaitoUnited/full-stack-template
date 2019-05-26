provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.taito_provider_region}"
  zone = "${var.taito_provider_zone}"
}

data "google_project" "project" {}

resource "google_service_account" "service_account" {
  count = "${var.gcp_service_account_enabled == "true" ? 1 : 0}"

  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}
