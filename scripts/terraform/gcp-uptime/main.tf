terraform {
  backend "gcs" {
  }
  required_version = ">= 0.12"
}

provider "google" {
  project = var.taito_uptime_namespace_id
  region  = var.taito_provider_region
  zone    = var.taito_provider_zone
}

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_uptime_targets = (var.taito_uptime_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_targets, "/\\s+/", " "))))
  taito_uptime_paths = (var.taito_uptime_paths == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_paths, "/\\s+/", " "))))
  taito_uptime_timeouts = (var.taito_uptime_timeouts == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_timeouts, "/\\s+/", " "))))
  taito_uptime_channels = (var.taito_uptime_channels == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_channels, "/\\s+/", " "))))
}

/*
  NOTE: create stackdriver workspace manually:
  https://github.com/terraform-providers/terraform-provider-google/issues/2605
 */
module "gcp-uptime" {
  source  = "TaitoUnited/uptime-monitoring/google"
  version = "1.0.4"

  # Provider
  project_id          = var.taito_uptime_namespace_id
  region              = var.taito_provider_region
  zone                = var.taito_provider_zone

  # Project
  project             = var.taito_project
  env                 = var.taito_env
  domain              = var.taito_domain

  # Monitoring
  uptime_targets      = local.taito_uptime_targets
  uptime_paths        = local.taito_uptime_paths
  uptime_timeouts     = local.taito_uptime_timeouts
  uptime_channels     = local.taito_uptime_channels
}
