resource "google_storage_bucket" "bucket" {
  count = "${length(var.taito_storages)}"
  name = "${element(var.taito_storages, count.index)}"
  location = "${element(var.taito_storage_locations, count.index)}"
  storage_class = "${element(var.taito_storage_classes, count.index)}"

  labels {
    project = "${var.taito_project}"
    env = "${var.taito_env}"
    purpose = "storage"
  }

  /* TODO: enable localhost only for dev and feat environments */
  cors = {
    origin = [ "http://localhost", "https://${var.taito_domain}" ]
    method = [ "GET" ]
  }

  versioning = {
    enabled = "true"
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      with_state = "ARCHIVED"
      age = "${element(var.taito_storage_days, count.index)}"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_storage_bucket_iam_member" "bucket_service_account_member" {
  depends_on = [
    "google_service_account.service_account",
    "google_storage_bucket.bucket"
  ]
  count = "${var.gcloud_service_account_enabled == "true" ? length(var.taito_storages) : 0}"
  bucket = "${element(var.taito_storages, count.index)}"
  role          = "roles/storage.objectAdmin"
  member        = "serviceAccount:${google_service_account.service_account.email}"
}
