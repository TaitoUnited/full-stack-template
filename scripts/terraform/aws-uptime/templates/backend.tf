terraform {
  backend "s3" {
    profile = "${taito_organization}"
    region  = "${taito_provider_region}"
    bucket  = "${taito_state_bucket}"
    key     = "aws-uptime${taito_state_path}"
  }

  required_version = ">= 0.12"
}
