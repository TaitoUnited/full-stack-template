provider "google" {
  project = var.taito_uptime_namespace_id
}

module "aws-uptime" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/aws-uptime"

  taito_project             = var.taito_project
  taito_env                 = var.taito_env
  taito_domain              = var.taito_domain
  taito_uptime_namespace_id = var.taito_uptime_namespace_id

  taito_uptime_targets  = var.taito_uptime_targets
  taito_uptime_paths    = var.taito_uptime_paths
  taito_uptime_timeouts = var.taito_uptime_timeouts
  taito_uptime_channels = var.taito_uptime_channels
}
