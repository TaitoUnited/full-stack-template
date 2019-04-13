provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.gcloud_region}"
  zone = "${var.gcloud_zone}"
}

data "google_project" "project" {}

data "google_service_account" "service_account" {
  count = "${var.gcloud_service_account_enabled == "true" ? 1 : 0}"
  account_id   = "${var.taito_project}-${var.taito_env}"
}

resource "google_service_account" "service_account" {
  count = "${var.gcloud_service_account_enabled == "true" ? 1 : 0}"

  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}
