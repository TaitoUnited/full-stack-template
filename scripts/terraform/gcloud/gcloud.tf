variable "gcloud_org_id" {}
variable "gcloud_resource_project" {}
variable "gcloud_resource_project_id" {}
variable "gcloud_region" {}
variable "gcloud_zone" {}
variable "gcloud_billing_account" {}
variable "gcloud_storage_regions" {
  type = "list"
}
variable "gcloud_storage_classes" {
  type = "list"
}

provider "google" {
  project = "${var.gcloud_resource_project_id}"
  region = "${var.gcloud_region}"
  zone = "${var.gcloud_zone}"
}

# resource "google_project" "project" {
#   name = "${var.gcloud_resource_project}"
#   project_id = "${var.gcloud_resource_project_id}"
#   org_id = "${var.gcloud_org_id}"
#   billing_account = "${var.gcloud_billing_account}"
# }

# resource "google_project_services" "services" {
#   depends_on = ["google_project.project"]
#   project = "${var.gcloud_resource_project_id}"
#
#   services   = ["compute.googleapis.com"]
# }

resource "google_project_service" "compute_service" {
  project = "${var.gcloud_resource_project_id}"
  service = "compute.googleapis.com"
}

resource "google_service_account" "service_account" {
  depends_on = ["google_project_service.compute_service"]
  project = "${var.gcloud_resource_project_id}"

  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}

resource "google_storage_bucket" "bucket" {
  depends_on = ["google_project_service.compute_service"]
  project = "${var.gcloud_resource_project_id}"

  count = "${length(var.taito_storages)}"
  name = "${element(var.taito_storages, count.index)}"
  location = "${element(var.gcloud_storage_regions, count.index)}"
  storage_class = "${element(var.gcloud_storage_classes, count.index)}"
  versioning = {
    enabled = "true"
  }
}

resource "google_storage_bucket_acl" "bucket_acl" {
  depends_on = ["google_storage_bucket.bucket"]
  bucket = "${google_storage_bucket.storage.name}"

  role_entity = [
    # TODO owner -> writer
    "OWNER:user-${google_service_account.resource_project_account.email}"
  ]
}
