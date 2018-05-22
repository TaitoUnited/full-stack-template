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

resource "google_project" "resource_project" {
  count = "${var.taito_provider == "gcloud" ? 1 : 0}"

  name = "${var.gcloud_resource_project}"
  project_id = "${var.gcloud_resource_project_id}"
  org_id = "${var.gcloud_org_id}"
  billing_account = "${var.gcloud_billing_account}"
}

resource "google_project_services" "resource_project_services" {
  depends_on = ["google_project.resource_project"]
  count = "${var.taito_provider == "gcloud" ? 1 : 0}"
  project = "${var.gcloud_resource_project_id}"

  services   = ["compute.googleapis.com"]
}

resource "google_service_account" "resource_project_account" {
  depends_on = ["google_project.resource_project"]
  count = "${var.taito_provider == "gcloud" ? 1 : 0}"
  project = "${var.gcloud_resource_project_id}"

  account_id   = "${var.taito_project}-${var.taito_env}"
  display_name = "${var.taito_project}-${var.taito_env}"
}

resource "google_storage_bucket" "storage" {
  depends_on = ["google_project_services.resource_project_services"]
  count = "${var.taito_provider == "gcloud" ? length(var.taito_storages) : 0}"
  project = "${var.gcloud_resource_project_id}"

  name = "${element(var.taito_storages, count.index)}"
  location = "${element(var.gcloud_storage_regions, count.index)}"
  storage_class = "${element(var.gcloud_storage_classes, count.index)}"
  versioning = {
    enabled = "true"
  }
}

resource "google_storage_bucket_acl" "image-store-acl" {
  depends_on = ["google_storage_bucket.storage"]
  bucket = "${google_storage_bucket.storage.name}"

  role_entity = [
    # TODO owner -> writer
    "OWNER:user-${google_service_account.resource_project_account.email}"
  ]
}
