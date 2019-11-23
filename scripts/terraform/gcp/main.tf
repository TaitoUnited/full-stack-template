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

  taito_project               = var.taito_project
  taito_env                   = var.taito_env
  taito_domain                = var.taito_domain
  taito_zone                  = var.taito_zone
  taito_namespace             = var.taito_namespace
  taito_resource_namespace    = var.taito_resource_namespace
  taito_resource_namespace_id = var.taito_resource_namespace_id
  taito_provider              = var.taito_provider
  taito_provider_region       = var.taito_provider_region
  taito_provider_zone         = var.taito_provider_zone
  taito_organization          = var.taito_organization
  taito_organization_abbr     = var.taito_organization_abbr

  taito_storages              = local.taito_storages
  taito_storage_locations     = local.taito_storage_locations
  taito_storage_classes       = local.taito_storage_classes
  taito_storage_days          = local.taito_storage_days

  taito_backup_locations      = local.taito_backup_locations
  taito_backup_days           = local.taito_backup_days

  gcp_service_account_enabled = var.gcp_service_account_enabled
}
