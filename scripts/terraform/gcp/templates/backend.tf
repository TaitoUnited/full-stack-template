terraform {
  backend "gcs" {
    bucket  = "${taito_state_bucket}"
    prefix  = "gcp${taito_state_path}"
  }

  required_version = ">= 0.12"
}
