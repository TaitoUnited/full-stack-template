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

  orig = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["settings"]

  services = {
    for key in keys(local.orig.services):
    key => merge(
      {
        # Default values
        machineType = null
        name = null
        location = null
        storageClass = null
        cors = []
        versioningEnabled = null
        versioningRetainDays = null
        lockRetainDays = null
        transitionRetainDays = null
        transitionStorageClass = null
        autoDeletionRetainDays = null
        replicationBucket = null
        backupRetainDays = null
        backupLocation = null
        backupLock = null
        admins = []
        objectAdmins = []
        objectViewers = []
        replicas = null
        path = null
        uptimePath = null
        timeout = null
        runtime = null
        memoryRequest = null
        secrets = {}
        env = {}
        publishers = []
        subscribers = []
      },
      local.orig.services[key]
    )
  }

  resources = merge(local.orig, { services = local.services })
}

module "gcp" {
  source  = "TaitoUnited/project-resources/google"
  version = "2.5.1"

  create_storage_buckets         = true
  create_databases               = true
  create_in_memory_databases     = true
  create_topics                  = true
  create_service_accounts        = true
  create_service_account_roles   = true
  create_api_keys                = true

  # Project
  project                        = var.taito_project
  env                            = var.taito_env

  # Cloud provider
  project_id                     = var.taito_resource_namespace_id
  region                         = var.taito_provider_region
  zone                           = var.taito_provider_zone

  # Version control
  vc_provider                    = var.taito_vc_provider
  vc_organization                = var.taito_vc_organization
  vc_repository                  = var.taito_vc_repository
  vc_branch                      = var.taito_branch

  # CI/CD
  create_build_trigger           = var.taito_ci_provider == "gcp"
  cicd_project_id                = var.taito_ci_namespace_id

  # Log monitoring
  create_log_alert_metrics       = var.taito_logging_provider == "gcp"
  create_log_alert_policies      = var.taito_logging_provider == "gcp"
  log_alert_project_id           = var.taito_logging_namespace_id

  # Uptime monitoring
  create_uptime_checks           = var.taito_uptime_provider == "gcp"
  uptime_channels                = local.taito_uptime_channels
  uptime_project_id              = var.taito_uptime_namespace_id

  # Additional resources as a json file
  resources                      = local.resources
}
