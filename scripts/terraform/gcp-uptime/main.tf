provider "google" {
  project = "${var.taito_uptime_namespace_id}"
}

/*
  NOTE: create stackdriver workspace manually:
  https://github.com/terraform-providers/terraform-provider-google/issues/2605
 */
module "common-gcp-uptime" {
  source = "../common/gcp-uptime"

  taito_project = "${var.taito_project}"
  taito_env = "${var.taito_env}"
  taito_domain = "${var.taito_domain}"
  taito_uptime_namespace_id = "${var.taito_uptime_namespace_id}"

  taito_uptime_targets = "${var.taito_uptime_targets}"
  taito_uptime_paths = "${var.taito_uptime_paths}"
  taito_uptime_timeouts = "${var.taito_uptime_timeouts}"
  taito_uptime_channels = "${var.taito_uptime_channels}"
}
