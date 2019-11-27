provider "google" {
  project = var.taito_resource_namespace_id
  region  = var.taito_provider_region
  zone    = var.taito_provider_zone
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
  taito_backup_locations = (var.taito_backup_locations == "" ? [] :
    split(" ", trimspace(replace(var.taito_backup_locations, "/\\s+/", " "))))
  taito_backup_days = (var.taito_backup_days == "" ? [] :
    split(" ", trimspace(replace(var.taito_backup_days, "/\\s+/", " "))))
}

module "gcp" {
  source = "github.com/TaitoUnited/taito-terraform-modules//projects/gcp"

  project               = var.taito_project
  env                   = var.taito_env
  domain                = var.taito_domain
  zone                  = var.taito_zone
  namespace             = var.taito_namespace
  resource_namespace    = var.taito_resource_namespace
  resource_namespace_id = var.taito_resource_namespace_id
  organization          = var.taito_organization
  organization_abbr     = var.taito_organization_abbr

  cloud_provider        = var.taito_provider
  cloud_provider_region = var.taito_provider_region
  cloud_provider_zone   = var.taito_provider_zone

  storages              = local.taito_storages
  storage_locations     = local.taito_storage_locations
  storage_classes       = local.taito_storage_classes
  storage_days          = local.taito_storage_days

  backup_locations      = local.taito_backup_locations
  backup_days           = local.taito_backup_days

  gcp_service_account_enabled = var.gcp_service_account_enabled
}
