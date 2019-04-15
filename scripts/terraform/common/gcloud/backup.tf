data "google_storage_transfer_project_service_account" "backup_bucket_transfer" {
}

resource "google_storage_bucket" "backup_bucket" {
  count = "${length(var.taito_backup_classes)}"
  name = "${element(var.taito_storages, count.index)}-backup"
  location = "${element(var.taito_backup_locations, count.index)}"
  storage_class = "${element(var.taito_backup_classes, count.index)}"

  /* TODO: replace versioning with a retention policy and
     automatic delete after retention policy expiration */
  versioning = {
    enabled = "true"
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      is_live = "false"
      age = "${element(var.taito_backup_days, count.index)}"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_storage_bucket_iam_member" "backup_bucket_transfer_member" {
  count         = "${length(var.taito_backup_classes)}"
  bucket        = "${element(var.taito_storages, count.index)}-backup"
  role          = "roles/storage.objectAdmin"
  member        = "serviceAccount:${data.google_storage_transfer_project_service_account.backup_bucket_transfer.email}"
  depends_on    = [
    "google_storage_bucket.backup_bucket"
  ]
}

resource "google_storage_bucket_iam_member" "backup_bucket_transfer_member_legacy" {
  count         = "${length(var.taito_backup_classes)}"
  bucket        = "${element(var.taito_storages, count.index)}-backup"
  role          = "roles/storage.legacyBucketReader"
  member        = "serviceAccount:${data.google_storage_transfer_project_service_account.backup_bucket_transfer.email}"
  depends_on    = [
    "google_storage_bucket.backup_bucket"
  ]
}

resource "google_storage_bucket_iam_member" "bucket_transfer_member" {
  count         = "${length(var.taito_backup_classes)}"
  bucket        = "${element(var.taito_storages, count.index)}"
  role          = "roles/storage.objectViewer"
  member        = "serviceAccount:${data.google_storage_transfer_project_service_account.backup_bucket_transfer.email}"
  depends_on    = [
    "google_storage_bucket.bucket"
  ]
}

resource "google_storage_bucket_iam_member" "bucket_transfer_member_legacy" {
  count         = "${length(var.taito_backup_classes)}"
  bucket        = "${element(var.taito_storages, count.index)}"
  role          = "roles/storage.legacyBucketReader"
  member        = "serviceAccount:${data.google_storage_transfer_project_service_account.backup_bucket_transfer.email}"
  depends_on    = [
    "google_storage_bucket.bucket"
  ]
}

resource "google_storage_transfer_job" "backup_bucket_transfer" {
    count = "${length(var.taito_backup_classes)}"
    description = "${element(var.taito_storages, count.index)} backup"

    transfer_spec {
      transfer_options {
        /* TODO: remove these once retention policy has been enabled */
        overwrite_objects_already_existing_in_sink = true
        delete_objects_unique_in_sink = true
      }
      gcs_data_source {
        bucket_name = "${element(var.taito_storages, count.index)}"
      }
      gcs_data_sink {
        bucket_name = "${element(var.taito_storages, count.index)}-backup"
      }
    }

    schedule {
      schedule_start_date {
        year    = 2019
        month   = 01
        day     = 1
      }
      schedule_end_date {
        year    = 9999
        month   = 12
        day     = 31
      }
      start_time_of_day {
        hours   = 00
        minutes = 00
        seconds = 0
        nanos   = 0
      }
    }

    depends_on = [
      "google_storage_bucket.bucket",
      "google_storage_bucket.backup_bucket",
      "google_storage_bucket_iam_member.bucket_transfer_member",
      "google_storage_bucket_iam_member.bucket_transfer_member_legacy",
      "google_storage_bucket_iam_member.backup_bucket_transfer_member",
      "google_storage_bucket_iam_member.backup_bucket_transfer_member_legacy"
    ]
}
