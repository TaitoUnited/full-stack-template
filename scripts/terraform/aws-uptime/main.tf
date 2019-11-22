provider "aws" {
  region                  = var.taito_provider_region
  profile                 = coalesce(var.taito_provider_user_profile, var.taito_organization)
  shared_credentials_file = "/home/taito/.aws/credentials"
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

module "aws-uptime" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/aws-uptime"

  taito_provider_region       = var.taito_provider_region
  taito_organization          = var.taito_organization
  taito_provider_user_profile = var.taito_provider_user_profile
  taito_project               = var.taito_project
  taito_env                   = var.taito_env
  taito_domain                = var.taito_domain

  taito_uptime_targets        = local.taito_uptime_targets
  taito_uptime_paths          = local.taito_uptime_paths
  taito_uptime_timeouts       = local.taito_uptime_timeouts
  taito_uptime_channels       = local.taito_uptime_channels
}
