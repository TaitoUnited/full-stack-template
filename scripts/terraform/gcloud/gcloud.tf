variable "gcloud_org_id" {}
variable "gcloud_region" {}
variable "gcloud_zone" {}
variable "gcloud_storage_locations" {
  type = "list"
}
variable "gcloud_storage_classes" {
  type = "list"
}

provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.gcloud_region}"
  zone = "${var.gcloud_zone}"
}

resource "google_service_account" "service_account" {
  project = "${var.taito_resource_namespace_id}"

  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}

resource "google_storage_bucket" "bucket" {
  project = "${var.taito_resource_namespace_id}"

  count = "${length(var.taito_storages)}"
  name = "${element(var.taito_storages, count.index)}"
  location = "${element(var.gcloud_storage_locations, count.index)}"
  storage_class = "${element(var.gcloud_storage_classes, count.index)}"
  versioning = {
    enabled = "true"
  }
}

resource "google_storage_bucket_acl" "bucket_acl" {
  depends_on = ["google_storage_bucket.bucket"]
  bucket = "${google_storage_bucket.bucket.name}"

  role_entity = [
    # TODO owner -> writer
    "OWNER:user-${google_service_account.service_account.email}"
  ]
}
