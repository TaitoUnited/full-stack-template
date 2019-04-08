resource "google_storage_bucket" "bucket" {
  count = "${length(var.taito_storages)}"
  name = "${element(var.taito_storages, count.index)}"
  location = "${element(var.gcloud_storage_locations, count.index)}"
  storage_class = "${element(var.gcloud_storage_classes, count.index)}"
  versioning = {
    enabled = "true"
  }
  /* TODO: enable localhost only for dev and feat environments */
  cors = {
    origin = [ "http://localhost", "https://${var.taito_domain}" ]
    method = [ "GET" ]
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "google_storage_bucket_acl" "bucket_acl" {
  depends_on = [
    "google_service_account.service_account",
    "google_storage_bucket.bucket"
  ]
  count = "${length(var.taito_storages)}"
  bucket = "${element(var.taito_storages, count.index)}"

  role_entity = [
    "OWNER:project-owners-${data.google_project.project.number}",
    "OWNER:project-editors-${data.google_project.project.number}",
    "READER:project-viewers-${data.google_project.project.number}",
    "WRITER:user-${google_service_account.service_account.email}"
  ]
}
