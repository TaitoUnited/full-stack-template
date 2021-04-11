terraform {
  backend "azurerm" {
  }
  required_version = ">= 0.13"
}

provider "azurerm" {
  features {}
}

locals {
  taito_uptime_channels = (var.taito_uptime_channels == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_channels, "/\\s+/", " "))))

  orig = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["settings"]

  ingress = merge(
    {
      # Default values
      enabled = false,
      class = null,
      createMainDomain = false,
      domains = [],
    },
    try(local.orig.ingress, {})
  )

  services = {
    for key in keys(try(local.orig.services, null)):
    key => merge(
      {
        # Default values
        # TODO: For Azure
        type = null
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

  resources = merge(
    local.orig,
    { alerts = coalesce(try(local.orig.alerts, null), []) },
    { apiKeys = coalesce(try(local.orig.apiKeys, null), []) },
    { serviceAccounts = coalesce(try(local.orig.serviceAccounts, null), []) },
    { ingress = local.ingress },
    { services = local.services },
  )
}

module "azure" {
  source  = "TaitoUnited/project-resources/azurerm"
  version = "3.1.0"

  # Create flags
  create_storage_buckets              = true
  create_databases                    = true
  create_in_memory_databases          = true
  create_topics                       = true
  create_service_accounts             = true
  create_uptime_checks                = var.taito_uptime_provider == "azure"

  # Labels
  resource_group = var.taito_resource_namespace_id
  project        = var.taito_project

  # Environment info
  env            = var.taito_env

  # Uptime
  uptime_channels             = local.taito_uptime_channels

  # Additional resources as a json file
  resources                   = local.resources
}
