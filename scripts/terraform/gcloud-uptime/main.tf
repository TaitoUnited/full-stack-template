provider "google" {
  project = "${var.taito_resource_namespace_id}"
  region = "${var.taito_provider_region}"
  zone = "${var.taito_provider_zone}"
}

module "common-gcloud-uptime" {
  source = "../common/gcloud-uptime"

  taito_project = "${var.taito_project}"
  taito_env = "${var.taito_env}"
  taito_domain = "${var.taito_domain}"

  taito_uptime_targets = "${var.taito_uptime_targets}"
  taito_uptime_paths = "${var.taito_uptime_paths}"
  taito_uptime_timeouts = "${var.taito_uptime_timeouts}"
  taito_uptime_uptime_channels = "${var.taito_uptime_uptime_channels}"
}
