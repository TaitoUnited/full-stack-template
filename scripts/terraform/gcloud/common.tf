provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.gcloud_region}"
  zone = "${var.gcloud_zone}"
}

resource "google_service_account" "service_account" {
  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}
