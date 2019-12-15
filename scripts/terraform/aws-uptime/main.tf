provider "aws" {
  region                  = var.taito_provider_region
  profile                 = coalesce(var.taito_provider_user_profile, var.taito_organization)
  shared_credentials_file = "/home/taito/.aws/credentials"
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

module "aws-uptime" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/aws-uptime"

  # Provider
  user_profile          = var.taito_organization
  region                = var.taito_provider_region

  # Project
  project               = var.taito_project
  env                   = var.taito_env
  domain                = var.taito_domain

  # Monitoring
  uptime_targets        = local.taito_uptime_targets
  uptime_paths          = local.taito_uptime_paths
  uptime_timeouts       = local.taito_uptime_timeouts
  uptime_channels       = local.taito_uptime_channels
}
