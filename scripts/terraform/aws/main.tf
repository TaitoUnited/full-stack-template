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
  taito_container_targets = (var.taito_container_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_container_targets, "/\\s+/", " "))))
}

module "aws" {
  source  = "TaitoUnited/project-resources/aws"
  version = "1.0.2"

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
  container_targets           = local.taito_container_targets

  # Storages
  storages                    = local.taito_storages
  storage_locations           = local.taito_storage_locations
  storage_classes             = local.taito_storage_classes
  storage_days                = local.taito_storage_days
}
