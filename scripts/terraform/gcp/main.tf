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

  variables = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["stack"]
}

module "gcp" {
  source  = "TaitoUnited/project-resources/google"
  version = "2.1.1"

  # Create flags
  create_build_trigger       = true
  create_storage_buckets     = true
  create_databases           = true
  create_in_memory_databases = true
  create_topics              = true
  create_service_accounts    = true
  create_alert_metrics       = true
  create_alert_policies      = var.taito_env == "prod"
  create_uptime_checks       = var.taito_uptime_provider == "gcp"

  # Provider
  project_id                 = var.taito_resource_namespace_id
  region                     = var.taito_provider_region
  zone                       = var.taito_provider_zone

  # Labels
  project                    = var.taito_project

  # Environment info
  env                        = var.taito_env

  # Version control info
  vc_repo                    = "${var.taito_vc_provider}_${var.taito_vc_organization}_${var.taito_vc_repository}"
  vc_branch                  = var.taito_branch

  # Uptime
  uptime_channels            = local.taito_uptime_channels

  # Additional variables as a json file
  variables                  = local.variables
}
