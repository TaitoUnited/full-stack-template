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
  taito_container_targets = (var.taito_container_targets == "" ? [] :
    split(" ", trimspace(replace(var.taito_container_targets, "/\\s+/", " "))))
}

module "aws" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/aws"

  env                         = var.taito_env
  domain                      = var.taito_domain
  project                     = var.taito_project
  organization                = var.taito_organization
  vc_repository               = var.taito_vc_repository
  cloud_provider_region       = var.taito_provider_region
  cloud_provider_user_profile = var.taito_provider_user_profile

  targets                     = local.taito_targets
  container_targets           = local.taito_container_targets
  container_registry_provider = var.taito_container_registry_provider

  storages                    = local.taito_storages
  storage_locations           = local.taito_storage_locations
  storage_classes             = local.taito_storage_classes
  storage_days                = local.taito_storage_days
}
