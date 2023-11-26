terraform {
  backend "s3" {
  }
  required_version = ">= 1.6.0"
}

provider "aws" {
  region                   = var.taito_provider_region
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
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

  namespace = {
    serviceAccounts = concat(
      try(local.orig.namespace.serviceAccounts, []),
      var.create_kubernetes_service_account
        ? [
            {
              name = var.taito_namespace
            }
        ]
        : []
    )

    roles = concat(
      try(local.orig.namespace.roles, []),

      # Set role for Kubernetes service account
      var.create_kubernetes_service_account
        ? [
            {
              name = var.kubernetes_service_account_role
              id = "${var.kubernetes_service_account_role}-for-${var.taito_namespace}-sa"
              subjects = [ "sa:${var.taito_namespace}" ]
            }
        ]
        : [],

      # Grant developer and common secrets access for CI/CD
      var.create_cicd_service_account
        ? [
            {
              name = "taito-developer"
              id = "taito-developer-for-${var.taito_project}-${var.taito_env}-cicd"
              namespace = null
              subjects = [ "user:${module.aws.cicd_service_account_arn}" ]
            },
            {
              name = "taito-secret-viewer"
              id = "taito-secret-viewer-for-${var.taito_project}-${var.taito_env}-cicd"
              namespace = "common"
              subjects = [ "user:${module.aws.cicd_service_account_arn}" ]
            },
        ]
        : [],

        # Grant db-proxy access for CI/CD
        var.create_cicd_service_account && var.kubernetes_db_proxy_enabled
          ? [
              {
                name = "taito-proxyer"
                id = "taito-proxyer-for-${var.taito_project}-${var.taito_env}-cicd"
                namespace = "db-proxy"
                subjects = [ "user:${module.aws.cicd_service_account_arn}" ]
              },
          ]
          : [],
    )
  }
}

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "3.21.0"

  # Create flags
  create_cicd_service_account         = var.create_cicd_service_account
  create_domain                       = true
  create_domain_certificate           = true
  create_storage_buckets              = true
  create_databases                    = true
  create_in_memory_databases          = true
  create_queues                       = true
  create_topics                       = true
  create_service_accounts             = true
  create_uptime_checks                = var.taito_uptime_provider == "aws"
  create_container_image_repositories = (
    var.taito_container_registry_provider == "aws" && var.taito_env == "dev"
  )

  # AWS provider
  account_id                  = var.taito_provider_org_id
  region                      = var.taito_provider_region

  # Labels
  zone_name                   = var.taito_zone
  project                     = var.taito_project
  namespace                   = var.taito_namespace
  env                         = var.taito_env

  # Container images
  container_image_repository_path      = var.taito_vc_repository
  container_image_target_types         = [ "container" ]
  container_image_builder_target_types = [ "static", "container", "function" ]

  # Secrets
  cicd_secrets_path           = var.taito_cicd_secrets_path

  # Buckets
  static_assets_bucket        = var.taito_static_assets_bucket
  static_assets_path          = var.taito_static_assets_path
  functions_bucket            = var.taito_functions_bucket
  functions_path              = var.taito_functions_path
  state_bucket                = var.taito_state_bucket
  state_path                  = var.taito_state_path

  # Uptime
  uptime_channels                 = var.taito_uptime_channels

  # Policies
  cicd_policies                   = var.taito_cicd_policies
  gateway_policies                = var.taito_gateway_policies

  # Network
  elasticache_subnet_ids          = data.aws_subnets.elasticache_subnets.ids
  elasticache_security_group_ids  = data.aws_security_groups.elasticache_security_groups.ids

  # Additional resources as a json file
  resources                        = local.resources
}

resource "helm_release" "namespace" {
  count      = var.kubernetes_name != "" ? 1 : 0

  name       = "${var.taito_namespace}-namespace"
  namespace  = var.taito_namespace
  repository = "https://taitounited.github.io/taito-charts/"
  chart      = "namespace"
  version    = "1.2.0"

  values = [
    jsonencode(local.namespace)
  ]
}

/* SENDGRID
provider "sendgrid" {
  api_key    = var.sendgrid_api_key 
}

module "sendgrid" {
  source  = "TaitoUnited/email/sendgrid"
  version = "1.1.0"

  create_api_keys                = true
  create_webhooks                = true

  resources                      = local.resources
}
*/
