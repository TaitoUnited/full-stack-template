terraform {
  backend "s3" {
  }
  required_version = ">= 1.6.0"
}

provider "aws" {
  region                   = var.taito_provider_region

  /* EXAMPLE: Assume role (e.g. for CI/CD)
  assume_role {
    role_arn     = "arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME"
    session_name = "SESSION_NAME"
    external_id  = "EXTERNAL_ID"
  }
  */
}

locals {
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
  version = "3.21.0"

  # Create flags
  create_ingress              = true
  create_containers           = true
  create_functions            = true
  create_function_permissions = true

  # AWS provider
  account_id                  = var.taito_provider_org_id
  region                      = var.taito_provider_region

  # Labels
  zone_name                   = var.taito_zone
  project                     = var.taito_project
  namespace                   = var.taito_namespace

  # Secrets
  secret_resource_path        = var.taito_secret_resource_path
  secret_name_path            = var.taito_secret_name_path

  # Buckets
  static_assets_bucket        = var.taito_static_assets_bucket
  static_assets_path          = var.taito_static_assets_path
  functions_bucket            = var.taito_functions_bucket
  functions_path              = var.taito_functions_path

  # Deployment details
  env                         = var.taito_env
  build_image_tag             = var.taito_build_image_tag

  # Policies
  cicd_policies               = var.taito_cicd_policies
  gateway_policies            = var.taito_gateway_policies

  # Network
  function_subnet_ids         = data.aws_subnets.function_subnets.ids
  function_security_group_ids = data.aws_security_groups.function_security_groups.ids

  # Additional resources as a json file
  resources                   = local.resources
}
