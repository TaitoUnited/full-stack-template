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

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
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
              subjects = [ "user:${module.gcp.cicd_service_principal_object_id}" ]
            },
            {
              name = "taito-secret-viewer"
              id = "taito-secret-viewer-for-${var.taito_project}-${var.taito_env}-cicd"
              namespace = "common"
              subjects = [ "user:${module.gcp.cicd_service_principal_object_id}" ]
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
                subjects = [ "user:${module.gcp.cicd_service_principal_object_id}" ]
              },
          ]
          : [],
    )
  }
}

module "gcp" {
  source  = "TaitoUnited/project-resources/google"
  version = "3.5.0"

  # TODO: create_cicd_service_account    = var.create_cicd_service_account
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