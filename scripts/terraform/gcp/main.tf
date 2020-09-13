terraform {
  backend "gcs" {
  }
  required_version = ">= 0.13"
}

provider "google" {
  project = var.taito_resource_namespace_id
  region  = var.taito_provider_region
  zone    = var.taito_provider_zone
}

locals {
  taito_uptime_channels = (var.taito_uptime_channels == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_channels, "/\\s+/", " "))))

  resources = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["settings"]
}

module "gcp" {
  source  = "TaitoUnited/project-resources/google"
  version = "2.1.1"

  create_build_trigger           = true
  create_storage_buckets         = true
  create_databases               = true
  create_in_memory_databases     = true
  create_topics                  = true
  create_service_accounts        = true
  create_service_account_roles   = true
  create_api_keys                = true
  create_uptime_checks           = var.taito_uptime_provider == "gcp"
  create_log_alert_metrics       = var.taito_logging_provider == "gcp"
  create_log_alert_policies      = (
    var.taito_logging_provider == "gcp" && var.taito_env == "prod"
  )

  # Provider
  log_alert_project_id           = var.taito_logging_namespace_id
  uptime_project_id              = var.taito_uptime_namespace_id
  project_id                     = var.taito_resource_namespace_id
  region                         = var.taito_provider_region
  zone                           = var.taito_provider_zone

  # Labels
  project                        = var.taito_project

  # Environment info
  env                            = var.taito_env

  # Version control info
  vc_repo                        = "${var.taito_vc_provider}_${var.taito_vc_organization}_${var.taito_vc_repository}"
  vc_branch                      = var.taito_branch

  # Uptime
  uptime_channels                = local.taito_uptime_channels

  # Additional resources as a json file
  resources                      = local.resources
}
