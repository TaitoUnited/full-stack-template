terraform {
  backend "s3" {
  }
  required_version = ">= 0.13"
}

provider "aws" {
  region                  = var.taito_provider_region
  profile                 = coalesce(var.taito_provider_user_profile, var.taito_organization)
  shared_credentials_file = "/home/taito/.aws/credentials"
}

locals {
  # Read json file
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
        # TODO: For AWS
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

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "3.0.0"

  # Create flags
  create_domain                       = true
  create_domain_certificate           = true
  create_storage_buckets              = true
  create_databases                    = true
  create_in_memory_databases          = true
  create_topics                       = true
  create_service_accounts             = true
  create_uptime_checks                = var.taito_uptime_provider == "aws"
  create_container_image_repositories = (
    var.taito_container_registry_provider == "aws" && var.taito_env == "dev"
  )

  # Provider
  account_id                  = var.taito_provider_org_id
  region                      = var.taito_provider_region
  user_profile                = coalesce(var.taito_provider_user_profile, var.taito_organization)

  # Project
  zone_name                   = var.taito_zone
  project                     = var.taito_project
  namespace                   = var.taito_namespace
  env                         = var.taito_env

  # Container images
  container_image_repository_path     = var.taito_vc_repository
  container_image_target_types        = [ "static", "container", "function" ]
  additional_container_images         = (
    var.taito_ci_cache_all_targets_with_docker
    ? var.taito_targets
    : var.taito_containers
  )

  # Uptime
  uptime_channels                 = var.taito_uptime_channels

  # Policies
  cicd_policies                   = var.taito_cicd_policies
  gateway_policies                = var.taito_gateway_policies

  # Network
  elasticache_subnet_ids          = data.aws_subnet_ids.elasticache_subnet_ids.ids
  elasticache_security_group_ids  = data.aws_security_groups.elasticache_security_groups.ids

  # Additional resources as a json file
  resources                        = local.resources
}
