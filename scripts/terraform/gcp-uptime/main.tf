provider "google" {
  project = var.taito_uptime_namespace_id
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_uptime_targets = (var.taito_uptime_targets == "" ? [] :
    split(" ", replace(var.taito_uptime_targets, "/\\s+/", " ")))
  taito_uptime_paths = (var.taito_uptime_paths == "" ? [] :
    split(" ", replace(var.taito_uptime_paths, "/\\s+/", " ")))
  taito_uptime_timeouts = (var.taito_uptime_timeouts == "" ? [] :
    split(" ", replace(var.taito_uptime_timeouts, "/\\s+/", " ")))
  taito_uptime_channels = (var.taito_uptime_channels == "" ? [] :
    split(" ", replace(var.taito_uptime_channels, "/\\s+/", " ")))
}

/*
  NOTE: create stackdriver workspace manually:
  https://github.com/terraform-providers/terraform-provider-google/issues/2605
 */
module "gcp-uptime" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/gcp-uptime"

  taito_project             = var.taito_project
  taito_env                 = var.taito_env
  taito_domain              = var.taito_domain
  taito_uptime_namespace_id = var.taito_uptime_namespace_id

  taito_uptime_targets      = local.taito_uptime_targets
  taito_uptime_paths        = local.taito_uptime_paths
  taito_uptime_timeouts     = local.taito_uptime_timeouts
  taito_uptime_channels     = local.taito_uptime_channels
}
