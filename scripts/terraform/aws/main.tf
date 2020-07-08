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

/* Convert whitespace delimited strings into list(string) */
locals {
  taito_storages = (var.taito_storages == "" ? [] :
    split(" ", trimspace(replace(var.taito_storages, "/\\s+/", " "))))
  taito_storage_locations = (var.taito_storage_locations == "" ? [] :
    split(" ", trimspace(replace(var.taito_storage_locations, "/\\s+/", " "))))
  taito_storage_classes = (var.taito_storage_classes == "" ? [] :
    split(" ", trimspace(replace(var.taito_storage_classes, "/\\s+/", " "))))
  taito_storage_days = (var.taito_storage_days == "" ? [] :
    split(" ", trimspace(replace(var.taito_storage_days, "/\\s+/", " "))))
  taito_targets = (var.taito_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_targets, "/\\s+/", " "))))
  taito_containers = (var.taito_containers == "" ? [] :
    split(" ", trimspace(replace(var.taito_containers, "/\\s+/", " "))))
}

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "1.1.0"

  # Provider
  region                      = var.taito_provider_region
  user_profile                = coalesce(var.taito_provider_user_profile, var.taito_organization)

  # Project
  project                     = var.taito_project
  domain                      = var.taito_domain
  env                         = var.taito_env
  vc_repository               = var.taito_vc_repository
  create_container_registry   = var.taito_container_registry_provider == "aws"

  # Shared infrastructure
  functions_bucket            = var.taito_functions_bucket

  # Targets
  containers                  = (
                                  var.taito_ci_cache_all_targets_with_docker
                                  ? local.taito_targets
                                  : local.taito_containers
                                )

  # Storages
  storages                    = local.taito_storages
  storage_locations           = local.taito_storage_locations
  storage_classes             = local.taito_storage_classes
  storage_days                = local.taito_storage_days
}
