terraform {
  backend "s3" {
  }
  required_version = ">= 0.12"
}

provider "aws" {
  region                  = var.taito_provider_region
  profile                 = coalesce(var.taito_provider_user_profile, var.taito_organization)
  shared_credentials_file = "/home/taito/.aws/credentials"
}

locals {
  taito_targets = (var.taito_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_targets, "/\\s+/", " "))))
  taito_containers = (var.taito_containers == "" ? [] :
    split(" ", trimspace(replace(var.taito_containers, "/\\s+/", " "))))
  taito_uptime_channels = (var.taito_uptime_channels == "" ? [] :
    split(" ", trimspace(replace(var.taito_uptime_channels, "/\\s+/", " "))))

  # Read json file
  variables = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["stack"]
}

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "2.0.2"

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
    ? local.taito_targets
    : local.taito_containers
  )

  # Uptime
  uptime_channels             = local.taito_uptime_channels

  # Network
  elasticache_subnet_ids          = data.aws_subnet_ids.elasticache_subnet_ids.ids
  elasticache_security_group_ids  = data.aws_security_groups.security_groups.ids

  # Additional variables as a json file
  variables                   = local.variables
}
