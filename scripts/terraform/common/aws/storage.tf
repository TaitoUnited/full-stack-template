resource "aws_s3_bucket" "bucket" {
  count = "${length(var.taito_storages)}"
  bucket = "${element(var.taito_storages, count.index)}"
  region = "${element(var.taito_storage_locations, count.index)}"
  /* TODO
  storage_class = "${element(var.taito_storage_classes, count.index)}"
  */

  tags {
    project = "${var.taito_project}"
    env = "${var.taito_env}"
    purpose = "storage"
  }

  /* TODO: enable localhost only for dev and feat environments */
  cors_rule {
    allowed_origins = ["http://localhost", "https://${var.taito_domain}"]
    allowed_methods = ["GET"]
    allowed_headers = ["*"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  lifecycle_rule {
    enabled = true
    noncurrent_version_expiration {
      days = "${element(var.taito_storage_days, count.index)}"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

# TODO: give service account access rights to bucket
